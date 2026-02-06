"""
Production API Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.db import get_db
from app.models import (
    WorkOrder, ProductionLog, DowntimeLog, Machine, Employee,
    WorkOrderStatus, Priority, Shift, DowntimeType
)
from app.schemas import (
    WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse,
    ProductionLogCreate, ProductionLogResponse,
    DowntimeLogCreate, DowntimeLogResponse,
    ProductionSummary, DowntimeSummary,
    ShiftEnum, PriorityEnum, WorkOrderStatusEnum, DowntimeTypeEnum
)

router = APIRouter(prefix="/production", tags=["Production"])


# ============== Work Orders ==============

@router.get("/work-orders", response_model=List[WorkOrderResponse])
async def get_work_orders(
    priority: Optional[PriorityEnum] = None,
    status: Optional[WorkOrderStatusEnum] = None,
    machine_id: Optional[str] = None,
    customer: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db)
):
    """Get work orders with optional filtering."""
    query = db.query(WorkOrder)

    if priority:
        query = query.filter(WorkOrder.priority == priority.value)
    if status:
        query = query.filter(WorkOrder.status == status.value)
    if machine_id:
        query = query.filter(WorkOrder.machine_id == machine_id)
    if customer:
        query = query.filter(WorkOrder.customer.ilike(f"%{customer}%"))

    orders = query.order_by(WorkOrder.due_date.asc()).limit(limit).all()
    return orders


@router.get("/work-orders/{order_id}", response_model=WorkOrderResponse)
async def get_work_order(order_id: str, db: Session = Depends(get_db)):
    """Get a specific work order."""
    order = db.query(WorkOrder).filter(WorkOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Work order not found")
    return order


@router.post("/work-orders", response_model=WorkOrderResponse)
async def create_work_order(order: WorkOrderCreate, db: Session = Depends(get_db)):
    """Create a new work order."""
    # Generate order ID
    count = db.query(WorkOrder).count()
    order_id = f"WO-{datetime.now().year}-{str(count + 1).zfill(4)}"

    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == order.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db_order = WorkOrder(
        id=order_id,
        customer=order.customer,
        product=order.product,
        machine_id=order.machine_id,
        priority=order.priority.value,
        status=WorkOrderStatus.PENDING.value,
        quantity_ordered=order.quantity_ordered,
        color=order.color,
        due_date=order.due_date,
        notes=order.notes
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return db_order


@router.put("/work-orders/{order_id}", response_model=WorkOrderResponse)
async def update_work_order(
    order_id: str,
    order_update: WorkOrderUpdate,
    db: Session = Depends(get_db)
):
    """Update a work order."""
    order = db.query(WorkOrder).filter(WorkOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Work order not found")

    update_data = order_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            if field == "status":
                setattr(order, field, value.value)
                # Set timestamps based on status
                if value == WorkOrderStatusEnum.IN_PROGRESS and not order.start_date:
                    order.start_date = datetime.utcnow()
                elif value == WorkOrderStatusEnum.COMPLETED:
                    order.end_date = datetime.utcnow()
            else:
                setattr(order, field, value)

    # Auto-complete if progress reaches 100%
    if order.progress >= 100:
        order.status = WorkOrderStatus.COMPLETED.value
        if not order.end_date:
            order.end_date = datetime.utcnow()

    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)

    return order


# ============== Production Logs ==============

@router.get("/logs", response_model=List[ProductionLogResponse])
async def get_production_logs(
    machine_id: Optional[str] = None,
    shift: Optional[ShiftEnum] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    """Get production logs with optional filtering."""
    query = db.query(ProductionLog)

    if machine_id:
        query = query.filter(ProductionLog.machine_id == machine_id)
    if shift:
        query = query.filter(ProductionLog.shift == shift.value)
    if start_date:
        query = query.filter(ProductionLog.timestamp >= start_date)
    if end_date:
        query = query.filter(ProductionLog.timestamp <= end_date)

    logs = query.order_by(ProductionLog.timestamp.desc()).limit(limit).all()

    # Enrich with operator names
    result = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "machine_id": log.machine_id,
            "shift": log.shift.value,
            "operator_name": log.operator.name if log.operator else None,
            "timestamp": log.timestamp,
            "speed": log.speed,
            "target_speed": log.target_speed,
            "temperature": log.temperature,
            "pressure": log.pressure,
            "output_length": log.output_length,
            "output_weight": log.output_weight,
            "notes": log.notes,
            "created_at": log.created_at
        }
        result.append(log_dict)

    return result


@router.post("/logs", response_model=ProductionLogResponse)
async def create_production_log(log: ProductionLogCreate, db: Session = Depends(get_db)):
    """Create a new production log entry."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == log.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Find operator by name if provided
    operator_id = None
    if log.operator_name:
        operator = db.query(Employee).filter(Employee.name == log.operator_name).first()
        if operator:
            operator_id = operator.id

    db_log = ProductionLog(
        machine_id=log.machine_id,
        operator_id=operator_id,
        shift=log.shift.value,
        timestamp=log.timestamp or datetime.utcnow(),
        speed=log.speed,
        target_speed=log.target_speed,
        temperature=log.temperature,
        pressure=log.pressure,
        output_length=log.output_length,
        output_weight=log.output_weight,
        notes=log.notes
    )

    # Update machine status
    machine.speed = log.speed
    if log.temperature:
        machine.temperature = log.temperature
    machine.updated_at = datetime.utcnow()

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return {
        "id": db_log.id,
        "machine_id": db_log.machine_id,
        "shift": db_log.shift.value,
        "operator_name": log.operator_name,
        "timestamp": db_log.timestamp,
        "speed": db_log.speed,
        "target_speed": db_log.target_speed,
        "temperature": db_log.temperature,
        "pressure": db_log.pressure,
        "output_length": db_log.output_length,
        "output_weight": db_log.output_weight,
        "notes": db_log.notes,
        "created_at": db_log.created_at
    }


@router.get("/logs/summary", response_model=ProductionSummary)
async def get_production_summary(
    machine_id: Optional[str] = None,
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get production summary for a machine or all machines."""
    query = db.query(ProductionLog)

    if machine_id:
        query = query.filter(ProductionLog.machine_id == machine_id)

    # Default to today
    if date:
        start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    end = start + timedelta(days=1)
    query = query.filter(ProductionLog.timestamp >= start, ProductionLog.timestamp < end)

    logs = query.all()

    if not logs:
        return ProductionSummary(
            total_output_length=0,
            total_output_weight=0,
            average_speed=0,
            average_temperature=0,
            log_count=0
        )

    return ProductionSummary(
        total_output_length=sum(l.output_length or 0 for l in logs),
        total_output_weight=sum(l.output_weight or 0 for l in logs),
        average_speed=sum(l.speed for l in logs) / len(logs),
        average_temperature=sum(l.temperature or 0 for l in logs) / len(logs) if any(l.temperature for l in logs) else 0,
        log_count=len(logs)
    )


# ============== Downtime Logs ==============

@router.get("/downtime", response_model=List[DowntimeLogResponse])
async def get_downtime_logs(
    machine_id: Optional[str] = None,
    downtime_type: Optional[DowntimeTypeEnum] = None,
    is_planned: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    """Get downtime logs with optional filtering."""
    query = db.query(DowntimeLog)

    if machine_id:
        query = query.filter(DowntimeLog.machine_id == machine_id)
    if downtime_type:
        query = query.filter(DowntimeLog.downtime_type == downtime_type.value)
    if is_planned is not None:
        query = query.filter(DowntimeLog.is_planned == is_planned)
    if start_date:
        query = query.filter(DowntimeLog.timestamp >= start_date)
    if end_date:
        query = query.filter(DowntimeLog.timestamp <= end_date)

    logs = query.order_by(DowntimeLog.timestamp.desc()).limit(limit).all()
    return logs


@router.post("/downtime", response_model=DowntimeLogResponse)
async def create_downtime_log(log: DowntimeLogCreate, db: Session = Depends(get_db)):
    """Create a new downtime log entry."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == log.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db_log = DowntimeLog(
        machine_id=log.machine_id,
        shift=log.shift.value,
        timestamp=log.timestamp or datetime.utcnow(),
        downtime_type=log.downtime_type.value,
        duration_minutes=log.duration_minutes,
        reason=log.reason,
        resolution=log.resolution,
        is_planned=log.is_planned
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return db_log


@router.get("/downtime/summary", response_model=DowntimeSummary)
async def get_downtime_summary(
    machine_id: Optional[str] = None,
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get downtime summary for a machine or all machines."""
    query = db.query(DowntimeLog)

    if machine_id:
        query = query.filter(DowntimeLog.machine_id == machine_id)

    # Default to today
    if date:
        start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    end = start + timedelta(days=1)
    query = query.filter(DowntimeLog.timestamp >= start, DowntimeLog.timestamp < end)

    logs = query.all()

    by_type = {}
    for log in logs:
        type_name = log.downtime_type.value
        by_type[type_name] = by_type.get(type_name, 0) + log.duration_minutes

    planned = sum(l.duration_minutes for l in logs if l.is_planned)
    unplanned = sum(l.duration_minutes for l in logs if not l.is_planned)

    return DowntimeSummary(
        total_minutes=sum(l.duration_minutes for l in logs),
        by_type=by_type,
        planned_minutes=planned,
        unplanned_minutes=unplanned,
        log_count=len(logs)
    )
