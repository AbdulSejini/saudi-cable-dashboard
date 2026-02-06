"""
Maintenance API Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.db import get_db
from app.models import MaintenanceTask, EmulsionLog, Machine, MaintenanceStatus, MaintenanceType
from app.schemas import (
    MaintenanceTaskCreate, MaintenanceTaskUpdate, MaintenanceTaskResponse,
    EmulsionLogCreate, EmulsionLogResponse,
    MaintenanceSummary,
    MaintenanceStatusEnum, MaintenanceTypeEnum
)

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


# ============== Maintenance Tasks ==============

@router.get("/tasks", response_model=List[MaintenanceTaskResponse])
async def get_maintenance_tasks(
    machine_id: Optional[str] = None,
    status: Optional[MaintenanceStatusEnum] = None,
    type: Optional[MaintenanceTypeEnum] = None,
    assignee: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db)
):
    """Get maintenance tasks with optional filtering."""
    query = db.query(MaintenanceTask)

    if machine_id:
        query = query.filter(MaintenanceTask.machine_id == machine_id)
    if status:
        query = query.filter(MaintenanceTask.status == status.value)
    if type:
        query = query.filter(MaintenanceTask.type == type.value)
    if assignee:
        query = query.filter(MaintenanceTask.assignee.ilike(f"%{assignee}%"))

    tasks = query.order_by(MaintenanceTask.priority.asc(), MaintenanceTask.created_at.desc()).limit(limit).all()
    return tasks


@router.get("/tasks/{task_id}", response_model=MaintenanceTaskResponse)
async def get_maintenance_task(task_id: str, db: Session = Depends(get_db)):
    """Get a specific maintenance task."""
    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Maintenance task not found")
    return task


@router.post("/tasks", response_model=MaintenanceTaskResponse)
async def create_maintenance_task(task: MaintenanceTaskCreate, db: Session = Depends(get_db)):
    """Create a new maintenance task."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == task.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Generate task ID
    count = db.query(MaintenanceTask).count()
    task_id = f"MT-{str(count + 1).zfill(4)}"

    db_task = MaintenanceTask(
        id=task_id,
        machine_id=task.machine_id,
        type=task.type.value,
        status=MaintenanceStatus.PENDING.value,
        title=task.title,
        description=task.description,
        priority=task.priority,
        assignee=task.assignee,
        team=task.team,
        scheduled_start=task.scheduled_start,
        scheduled_end=task.scheduled_end,
        estimated_duration_hours=task.estimated_duration_hours
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


@router.put("/tasks/{task_id}", response_model=MaintenanceTaskResponse)
async def update_maintenance_task(
    task_id: str,
    task_update: MaintenanceTaskUpdate,
    db: Session = Depends(get_db)
):
    """Update a maintenance task."""
    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Maintenance task not found")

    update_data = task_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            if field == "status":
                setattr(task, field, value.value)
                # Auto-set timestamps
                if value == MaintenanceStatusEnum.IN_PROGRESS and not task.actual_start:
                    task.actual_start = datetime.utcnow()
                elif value == MaintenanceStatusEnum.COMPLETED and not task.actual_end:
                    task.actual_end = datetime.utcnow()
                    # Calculate actual duration
                    if task.actual_start:
                        duration = (task.actual_end - task.actual_start).total_seconds() / 3600
                        task.actual_duration_hours = round(duration, 2)
            else:
                setattr(task, field, value)

    # Calculate total cost
    task.total_cost = (task.labor_cost or 0) + (task.parts_cost or 0)

    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    # Update machine status if task is completed
    if task.status == MaintenanceStatus.COMPLETED.value:
        machine = db.query(Machine).filter(Machine.id == task.machine_id).first()
        if machine and machine.status.value == "maintenance":
            from app.models import MachineStatus
            machine.status = MachineStatus.IDLE
            machine.updated_at = datetime.utcnow()
            db.commit()

    return task


@router.delete("/tasks/{task_id}")
async def delete_maintenance_task(task_id: str, db: Session = Depends(get_db)):
    """Delete a maintenance task."""
    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Maintenance task not found")

    db.delete(task)
    db.commit()

    return {"message": "Maintenance task deleted successfully", "task_id": task_id}


@router.get("/summary", response_model=MaintenanceSummary)
async def get_maintenance_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get maintenance summary with KPIs."""
    query = db.query(MaintenanceTask)

    if start_date:
        query = query.filter(MaintenanceTask.created_at >= start_date)
    if end_date:
        query = query.filter(MaintenanceTask.created_at <= end_date)

    tasks = query.all()

    # Count by status
    pending = len([t for t in tasks if t.status == MaintenanceStatus.PENDING.value])
    in_progress = len([t for t in tasks if t.status == MaintenanceStatus.IN_PROGRESS.value])
    completed = len([t for t in tasks if t.status == MaintenanceStatus.COMPLETED.value])

    # Count by type
    by_type = {}
    for task in tasks:
        type_name = task.type.value
        by_type[type_name] = by_type.get(type_name, 0) + 1

    # Calculate totals
    total_downtime = sum(t.downtime_minutes or 0 for t in tasks)
    total_cost = sum(t.total_cost or 0 for t in tasks)

    # Calculate MTTR (Mean Time To Repair) for completed tasks
    completed_tasks = [t for t in tasks if t.actual_duration_hours]
    mttr = sum(t.actual_duration_hours for t in completed_tasks) / len(completed_tasks) if completed_tasks else None

    return MaintenanceSummary(
        total_tasks=len(tasks),
        pending=pending,
        in_progress=in_progress,
        completed=completed,
        by_type=by_type,
        total_downtime_minutes=total_downtime,
        total_cost=round(total_cost, 2),
        mttr_hours=round(mttr, 2) if mttr else None,
        mtbf_hours=None  # Would need historical data to calculate
    )


# ============== Emulsion Logs ==============

@router.get("/emulsion", response_model=List[EmulsionLogResponse])
async def get_emulsion_logs(
    machine_id: Optional[str] = None,
    is_within_spec: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db)
):
    """Get emulsion logs with optional filtering."""
    query = db.query(EmulsionLog)

    if machine_id:
        query = query.filter(EmulsionLog.machine_id == machine_id)
    if is_within_spec is not None:
        query = query.filter(EmulsionLog.is_within_spec == is_within_spec)
    if start_date:
        query = query.filter(EmulsionLog.timestamp >= start_date)
    if end_date:
        query = query.filter(EmulsionLog.timestamp <= end_date)

    logs = query.order_by(EmulsionLog.timestamp.desc()).limit(limit).all()
    return logs


@router.post("/emulsion", response_model=EmulsionLogResponse)
async def create_emulsion_log(log: EmulsionLogCreate, db: Session = Depends(get_db)):
    """Create a new emulsion log entry with automatic spec checking."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == log.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Check if parameters are within specification
    is_within_spec = True
    action_required = None

    # pH should be between 8.5 and 9.5
    if log.ph_level < 8.5 or log.ph_level > 9.5:
        is_within_spec = False
        action_required = "pH out of range. Adjust emulsion concentration."

    # Bacteria count should be below 10^5 cfu/ml
    if log.bacteria_count and log.bacteria_count > 100000:
        is_within_spec = False
        action_required = f"Bacteria count too high ({log.bacteria_count} cfu/ml). Add Grotan WS."

    db_log = EmulsionLog(
        machine_id=log.machine_id,
        timestamp=log.timestamp or datetime.utcnow(),
        ph_level=log.ph_level,
        conductivity=log.conductivity,
        concentration=log.concentration,
        temperature=log.temperature,
        bacteria_count=log.bacteria_count,
        is_within_spec=is_within_spec,
        action_required=action_required,
        grotan_added=log.grotan_added,
        notes=log.notes
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return db_log
