"""
Machine API Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db import get_db
from app.models import Machine, Employee, MachineStatus
from app.schemas import (
    MachineCreate, MachineUpdate, MachineResponse, MachineStatusUpdate,
    MachineStats, AreaOEE, MachineStatusEnum
)

router = APIRouter(prefix="/machines", tags=["Machines"])


@router.get("", response_model=List[MachineResponse])
async def get_all_machines(
    area: Optional[str] = None,
    status: Optional[MachineStatusEnum] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all machines with optional filtering.

    - **area**: Filter by plant area (e.g., PCP-1, PCP-2)
    - **status**: Filter by machine status
    - **type**: Filter by machine type
    """
    query = db.query(Machine)

    if area:
        query = query.filter(Machine.area == area)
    if status:
        query = query.filter(Machine.status == status.value)
    if type:
        query = query.filter(Machine.type == type)

    machines = query.all()

    # Enrich with operator names
    result = []
    for machine in machines:
        machine_dict = {
            "id": machine.id,
            "name": machine.name,
            "area": machine.area,
            "type": machine.type.value,
            "status": machine.status.value,
            "speed": machine.speed,
            "target_speed": machine.target_speed,
            "temperature": machine.temperature,
            "oee": machine.oee,
            "operator_name": machine.operator.name if machine.operator else None,
            "created_at": machine.created_at,
            "updated_at": machine.updated_at
        }
        result.append(machine_dict)

    return result


@router.get("/stats", response_model=MachineStats)
async def get_machine_stats(db: Session = Depends(get_db)):
    """Get summary statistics for all machines."""
    machines = db.query(Machine).all()

    return MachineStats(
        total=len(machines),
        running=len([m for m in machines if m.status == MachineStatus.RUNNING]),
        idle=len([m for m in machines if m.status == MachineStatus.IDLE]),
        stopped=len([m for m in machines if m.status == MachineStatus.STOPPED]),
        maintenance=len([m for m in machines if m.status == MachineStatus.MAINTENANCE])
    )


@router.get("/oee/{area}", response_model=AreaOEE)
async def get_area_oee(area: str, db: Session = Depends(get_db)):
    """Calculate OEE for a specific area."""
    machines = db.query(Machine).filter(Machine.area == area).all()

    if not machines:
        raise HTTPException(status_code=404, detail=f"No machines found in area: {area}")

    running_machines = [m for m in machines if m.status == MachineStatus.RUNNING]
    avg_oee = sum(m.oee for m in running_machines) / len(running_machines) if running_machines else 0

    return AreaOEE(
        area=area,
        oee=round(avg_oee, 2),
        machine_count=len(machines),
        running_count=len(running_machines)
    )


@router.get("/{machine_id}", response_model=MachineResponse)
async def get_machine(machine_id: str, db: Session = Depends(get_db)):
    """Get a specific machine by ID."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    return {
        "id": machine.id,
        "name": machine.name,
        "area": machine.area,
        "type": machine.type.value,
        "status": machine.status.value,
        "speed": machine.speed,
        "target_speed": machine.target_speed,
        "temperature": machine.temperature,
        "oee": machine.oee,
        "operator_name": machine.operator.name if machine.operator else None,
        "created_at": machine.created_at,
        "updated_at": machine.updated_at
    }


@router.post("", response_model=MachineResponse)
async def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    """Create a new machine."""
    # Check if machine already exists
    existing = db.query(Machine).filter(Machine.id == machine.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Machine ID already exists")

    db_machine = Machine(
        id=machine.id,
        name=machine.name,
        area=machine.area,
        type=machine.type.value,
        status=machine.status.value,
        speed=machine.speed,
        target_speed=machine.target_speed,
        temperature=machine.temperature,
        oee=machine.oee
    )

    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)

    return db_machine


@router.put("/{machine_id}", response_model=MachineResponse)
async def update_machine(
    machine_id: str,
    machine_update: MachineUpdate,
    db: Session = Depends(get_db)
):
    """Update a machine."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    update_data = machine_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            if field == "status":
                setattr(machine, field, value.value)
            else:
                setattr(machine, field, value)

    machine.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(machine)

    return machine


@router.put("/{machine_id}/status")
async def update_machine_status(
    machine_id: str,
    status_update: MachineStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update machine status and optionally speed/temperature."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    machine.status = status_update.status.value

    if status_update.speed is not None:
        machine.speed = status_update.speed
    if status_update.temperature is not None:
        machine.temperature = status_update.temperature

    # Handle operator assignment by name
    if status_update.operator_name:
        operator = db.query(Employee).filter(Employee.name == status_update.operator_name).first()
        if operator:
            machine.operator_id = operator.id

    machine.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(machine)

    return {
        "message": "Machine status updated successfully",
        "machine_id": machine_id,
        "new_status": machine.status.value
    }


@router.delete("/{machine_id}")
async def delete_machine(machine_id: str, db: Session = Depends(get_db)):
    """Delete a machine."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db.delete(machine)
    db.commit()

    return {"message": "Machine deleted successfully", "machine_id": machine_id}
