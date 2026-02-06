"""
Quality and Scrap API Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.db import get_db
from app.models import QualityCheck, ScrapEntry, Machine
from app.schemas import (
    QualityCheckCreate, QualityCheckResponse,
    ScrapEntryCreate, ScrapEntryResponse,
    ScrapSummary, QualitySummary,
    ShiftEnum, ScrapTypeEnum
)
from app.core.config import settings

router = APIRouter(prefix="/quality", tags=["Quality & Scrap"])


# ============== Quality Checks ==============

@router.get("/checks", response_model=List[QualityCheckResponse])
async def get_quality_checks(
    machine_id: Optional[str] = None,
    passed: Optional[bool] = None,
    shift: Optional[ShiftEnum] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    """Get quality checks with optional filtering."""
    query = db.query(QualityCheck)

    if machine_id:
        query = query.filter(QualityCheck.machine_id == machine_id)
    if passed is not None:
        query = query.filter(QualityCheck.passed == passed)
    if shift:
        query = query.filter(QualityCheck.shift == shift.value)
    if start_date:
        query = query.filter(QualityCheck.timestamp >= start_date)
    if end_date:
        query = query.filter(QualityCheck.timestamp <= end_date)

    checks = query.order_by(QualityCheck.timestamp.desc()).limit(limit).all()
    return checks


@router.post("/checks", response_model=QualityCheckResponse)
async def create_quality_check(check: QualityCheckCreate, db: Session = Depends(get_db)):
    """Create a new quality check entry."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == check.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Determine overall pass/fail
    passed = (
        check.spark_test_passed and
        check.tensile_test_passed and
        check.visual_inspection_passed
    )

    db_check = QualityCheck(
        machine_id=check.machine_id,
        shift=check.shift.value,
        timestamp=check.timestamp or datetime.utcnow(),
        diameter=check.diameter,
        diameter_tolerance=check.diameter_tolerance,
        thickness=check.thickness,
        concentricity=check.concentricity,
        spark_test_passed=check.spark_test_passed,
        spark_test_voltage=check.spark_test_voltage,
        tensile_test_passed=check.tensile_test_passed,
        tensile_strength=check.tensile_strength,
        elongation=check.elongation,
        visual_inspection_passed=check.visual_inspection_passed,
        defect_type=check.defect_type,
        defect_location=check.defect_location,
        passed=passed,
        notes=check.notes
    )

    db.add(db_check)
    db.commit()
    db.refresh(db_check)

    return db_check


@router.get("/checks/summary", response_model=QualitySummary)
async def get_quality_summary(
    machine_id: Optional[str] = None,
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get quality summary for a machine or all machines."""
    query = db.query(QualityCheck)

    if machine_id:
        query = query.filter(QualityCheck.machine_id == machine_id)

    # Default to today
    if date:
        start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    end = start + timedelta(days=1)
    query = query.filter(QualityCheck.timestamp >= start, QualityCheck.timestamp < end)

    checks = query.all()
    total = len(checks)

    if total == 0:
        return QualitySummary(
            total_checks=0,
            passed_count=0,
            failed_count=0,
            pass_rate=0,
            spark_test_failures=0,
            tensile_test_failures=0,
            visual_failures=0
        )

    passed = len([c for c in checks if c.passed])
    failed = total - passed

    return QualitySummary(
        total_checks=total,
        passed_count=passed,
        failed_count=failed,
        pass_rate=round((passed / total) * 100, 2),
        spark_test_failures=len([c for c in checks if not c.spark_test_passed]),
        tensile_test_failures=len([c for c in checks if not c.tensile_test_passed]),
        visual_failures=len([c for c in checks if not c.visual_inspection_passed])
    )


# ============== Scrap Entries ==============

@router.get("/scrap", response_model=List[ScrapEntryResponse])
async def get_scrap_entries(
    machine_id: Optional[str] = None,
    scrap_type: Optional[ScrapTypeEnum] = None,
    shift: Optional[ShiftEnum] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(default=100, le=1000),
    db: Session = Depends(get_db)
):
    """Get scrap entries with optional filtering."""
    query = db.query(ScrapEntry)

    if machine_id:
        query = query.filter(ScrapEntry.machine_id == machine_id)
    if scrap_type:
        query = query.filter(ScrapEntry.scrap_type == scrap_type.value)
    if shift:
        query = query.filter(ScrapEntry.shift == shift.value)
    if start_date:
        query = query.filter(ScrapEntry.timestamp >= start_date)
    if end_date:
        query = query.filter(ScrapEntry.timestamp <= end_date)

    entries = query.order_by(ScrapEntry.timestamp.desc()).limit(limit).all()
    return entries


@router.post("/scrap", response_model=ScrapEntryResponse)
async def create_scrap_entry(entry: ScrapEntryCreate, db: Session = Depends(get_db)):
    """Create a new scrap entry with automatic financial calculation."""
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == entry.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db_entry = ScrapEntry(
        machine_id=entry.machine_id,
        shift=entry.shift.value,
        timestamp=entry.timestamp or datetime.utcnow(),
        scrap_type=entry.scrap_type.value,
        scrap_code=entry.scrap_code,
        weight_kg=entry.weight_kg,
        copper_content_percent=entry.copper_content_percent,
        aluminum_content_percent=entry.aluminum_content_percent,
        reason=entry.reason,
        work_order_id=entry.work_order_id,
        notes=entry.notes
    )

    # Calculate financial value
    db_entry.calculate_financial_value(settings.LME_COPPER_PRICE)

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return db_entry


@router.get("/scrap/summary", response_model=ScrapSummary)
async def get_scrap_summary(
    machine_id: Optional[str] = None,
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get scrap summary with financial value calculation."""
    query = db.query(ScrapEntry)

    if machine_id:
        query = query.filter(ScrapEntry.machine_id == machine_id)

    # Default to today
    if date:
        start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    end = start + timedelta(days=1)
    query = query.filter(ScrapEntry.timestamp >= start, ScrapEntry.timestamp < end)

    entries = query.all()

    # Calculate totals
    total_weight = sum(e.weight_kg for e in entries)
    total_copper = sum((e.weight_kg * e.copper_content_percent) / 100 for e in entries)
    total_value_usd = sum(e.financial_value_usd or 0 for e in entries)
    total_value_sar = sum(e.financial_value_sar or 0 for e in entries)

    # Group by type
    by_type = {}
    for entry in entries:
        type_name = entry.scrap_type.value
        if type_name not in by_type:
            by_type[type_name] = {"weight_kg": 0, "value_usd": 0}
        by_type[type_name]["weight_kg"] += entry.weight_kg
        by_type[type_name]["value_usd"] += entry.financial_value_usd or 0

    return ScrapSummary(
        total_weight_kg=round(total_weight, 2),
        total_copper_kg=round(total_copper, 2),
        total_value_usd=round(total_value_usd, 2),
        total_value_sar=round(total_value_sar, 2),
        entry_count=len(entries),
        by_type=by_type
    )


@router.get("/scrap/codes")
async def get_scrap_codes():
    """Get list of available scrap codes with descriptions."""
    # Based on the 76 internal scrap codes mentioned in the documentation
    scrap_codes = [
        {"code": "SC-001", "type": "copper-wire", "description": "Pure Copper Wire Scrap", "copper_content": 93},
        {"code": "SC-002", "type": "copper-wire", "description": "Copper Wire with Light Coating", "copper_content": 85},
        {"code": "SC-010", "type": "pvc-compound", "description": "Virgin PVC Compound", "copper_content": 0},
        {"code": "SC-011", "type": "pvc-compound", "description": "Recycled PVC", "copper_content": 0},
        {"code": "SC-020", "type": "mixed-cable", "description": "Mixed LV Cable Scrap", "copper_content": 45},
        {"code": "SC-021", "type": "mixed-cable", "description": "Mixed MV Cable Scrap", "copper_content": 55},
        {"code": "SC-030", "type": "insulated-copper", "description": "PVC Insulated Copper", "copper_content": 70},
        {"code": "SC-031", "type": "insulated-copper", "description": "XLPE Insulated Copper", "copper_content": 75},
        {"code": "SC-040", "type": "aluminum-wire", "description": "Pure Aluminum Wire", "copper_content": 0},
        {"code": "SC-050", "type": "steel-armor", "description": "Steel Armoring Wire", "copper_content": 0},
    ]
    return scrap_codes
