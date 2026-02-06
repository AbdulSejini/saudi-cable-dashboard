"""
Dashboard API Router - Overview and Analytics
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta

from app.db import get_db
from app.models import (
    Machine, MachineStatus, WorkOrder, WorkOrderStatus,
    MaintenanceTask, MaintenanceStatus, ScrapEntry, QualityCheck,
    Plant, WorkforceRecord, DailyProduction
)
from app.schemas import (
    PlantCreate, PlantResponse, PlantCapacity,
    WorkforceRecordCreate, WorkforceRecordResponse, WorkforceSummary,
    DashboardOverview, MachineOverview, KPIOverview, WorkforceOverview, ScrapOverview,
    HourlyProduction, DailyProductionSummary, WeeklyTrend
)
from app.core.config import settings

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview", response_model=DashboardOverview)
async def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Get comprehensive dashboard overview with all key metrics.
    This is the main endpoint for the dashboard home page.
    """
    # Machine statistics
    machines = db.query(Machine).all()
    running = [m for m in machines if m.status == MachineStatus.RUNNING]
    idle = [m for m in machines if m.status == MachineStatus.IDLE]
    stopped = [m for m in machines if m.status == MachineStatus.STOPPED]
    maintenance = [m for m in machines if m.status == MachineStatus.MAINTENANCE]

    machine_overview = MachineOverview(
        total=len(machines),
        running=len(running),
        idle=len(idle),
        stopped=len(stopped),
        maintenance=len(maintenance)
    )

    # Calculate overall OEE
    overall_oee = sum(m.oee for m in running) / len(running) if running else 0

    # Capacity utilization
    plants = db.query(Plant).all()
    if plants:
        total_design = sum(p.design_capacity_mt for p in plants)
        total_actual = sum(p.current_capacity_mt for p in plants)
        capacity_util = (total_actual / total_design) * 100 if total_design > 0 else 0
    else:
        capacity_util = 25.0  # Default based on document analysis

    # Work orders
    active_orders = db.query(WorkOrder).filter(
        WorkOrder.status == WorkOrderStatus.IN_PROGRESS.value
    ).count()

    # Maintenance
    pending_maintenance = db.query(MaintenanceTask).filter(
        MaintenanceTask.status.in_([
            MaintenanceStatus.PENDING.value,
            MaintenanceStatus.IN_PROGRESS.value
        ])
    ).count()

    # Quality rate (last 24 hours)
    yesterday = datetime.utcnow() - timedelta(days=1)
    quality_checks = db.query(QualityCheck).filter(
        QualityCheck.timestamp >= yesterday
    ).all()
    quality_rate = (len([q for q in quality_checks if q.passed]) / len(quality_checks) * 100) if quality_checks else 98.5

    kpi_overview = KPIOverview(
        overall_oee=round(overall_oee, 2),
        capacity_utilization=round(capacity_util, 2),
        active_work_orders=active_orders,
        pending_maintenance=pending_maintenance,
        quality_rate=round(quality_rate, 2),
        scrap_rate=1.5  # Would calculate from actual data
    )

    # Workforce
    workforce_records = db.query(WorkforceRecord).order_by(
        WorkforceRecord.date.desc()
    ).first()

    if workforce_records:
        workforce_overview = WorkforceOverview(
            total_on_shift=workforce_records.filled_positions,
            total_vacancies=workforce_records.vacancies,
            vacancy_rate=round((workforce_records.vacancies / workforce_records.total_positions) * 100, 2)
        )
    else:
        # Default based on document analysis
        workforce_overview = WorkforceOverview(
            total_on_shift=137,
            total_vacancies=114,
            vacancy_rate=45.4
        )

    # Scrap today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    scrap_entries = db.query(ScrapEntry).filter(
        ScrapEntry.timestamp >= today_start
    ).all()

    scrap_overview = ScrapOverview(
        weight_kg=sum(e.weight_kg for e in scrap_entries),
        value_usd=sum(e.financial_value_usd or 0 for e in scrap_entries),
        value_sar=sum(e.financial_value_sar or 0 for e in scrap_entries)
    )

    # Generate alerts
    alerts = []

    # Alert for stopped machines
    for m in stopped:
        alerts.append({
            "type": "error",
            "title": "Machine Down",
            "message": f"{m.id} ({m.name}) is stopped",
            "machine_id": m.id,
            "timestamp": datetime.utcnow().isoformat()
        })

    # Alert for machines in maintenance
    for m in maintenance:
        alerts.append({
            "type": "warning",
            "title": "Under Maintenance",
            "message": f"{m.id} ({m.name}) is under maintenance",
            "machine_id": m.id,
            "timestamp": datetime.utcnow().isoformat()
        })

    return DashboardOverview(
        timestamp=datetime.utcnow(),
        machines=machine_overview,
        kpis=kpi_overview,
        workforce=workforce_overview,
        scrap_today=scrap_overview,
        alerts=alerts[:10]  # Limit to 10 alerts
    )


# ============== Capacity Endpoints ==============

@router.get("/capacity", response_model=List[PlantCapacity])
async def get_capacity_data(db: Session = Depends(get_db)):
    """Get capacity data for all plants."""
    plants = db.query(Plant).all()

    if not plants:
        # Return default data if no plants in database
        return [
            PlantCapacity(
                plant_id="PCP-1",
                plant_name="PCP-1 (LV Cables)",
                design_capacity=36000,
                actual_production=9000,
                utilization_percent=25.0
            ),
            PlantCapacity(
                plant_id="PCP-2",
                plant_name="PCP-2 (BSI Cables)",
                design_capacity=7800,
                actual_production=1950,
                utilization_percent=25.0
            )
        ]

    return [
        PlantCapacity(
            plant_id=p.id,
            plant_name=p.name,
            design_capacity=p.design_capacity_mt,
            actual_production=p.current_capacity_mt,
            utilization_percent=p.utilization_percent
        )
        for p in plants
    ]


@router.post("/capacity/plants", response_model=PlantResponse)
async def create_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    """Create a new plant."""
    existing = db.query(Plant).filter(Plant.id == plant.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Plant ID already exists")

    db_plant = Plant(
        id=plant.id,
        name=plant.name,
        name_ar=plant.name_ar,
        description=plant.description,
        design_capacity_mt=plant.design_capacity_mt,
        location=plant.location
    )

    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)

    return db_plant


# ============== Workforce Endpoints ==============

@router.get("/workforce", response_model=List[WorkforceSummary])
async def get_workforce_data(db: Session = Depends(get_db)):
    """Get workforce data for all plants."""
    # Get latest record for each plant
    subquery = db.query(
        WorkforceRecord.plant_id,
        func.max(WorkforceRecord.date).label("max_date")
    ).group_by(WorkforceRecord.plant_id).subquery()

    records = db.query(WorkforceRecord).join(
        subquery,
        (WorkforceRecord.plant_id == subquery.c.plant_id) &
        (WorkforceRecord.date == subquery.c.max_date)
    ).all()

    if not records:
        # Return default data
        return [
            WorkforceSummary(plant_id="PCP-1", total=120, on_shift=85, vacancies=55, vacancy_rate=31.4),
            WorkforceSummary(plant_id="PCP-2", total=80, on_shift=52, vacancies=59, vacancy_rate=53.2)
        ]

    return [
        WorkforceSummary(
            plant_id=r.plant_id,
            total=r.total_positions,
            on_shift=r.filled_positions,
            vacancies=r.vacancies,
            vacancy_rate=round((r.vacancies / r.total_positions) * 100, 2) if r.total_positions > 0 else 0
        )
        for r in records
    ]


@router.post("/workforce", response_model=WorkforceRecordResponse)
async def create_workforce_record(record: WorkforceRecordCreate, db: Session = Depends(get_db)):
    """Create a new workforce record."""
    db_record = WorkforceRecord(
        plant_id=record.plant_id,
        total_positions=record.total_positions,
        filled_positions=record.filled_positions,
        vacancies=record.total_positions - record.filled_positions,
        morning_shift=record.morning_shift,
        evening_shift=record.evening_shift,
        night_shift=record.night_shift,
        operators=record.operators,
        technicians=record.technicians,
        supervisors=record.supervisors,
        engineers=record.engineers,
        in_training=record.in_training,
        certified=record.filled_positions - record.in_training
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return db_record


# ============== Production Trends ==============

@router.get("/trends/hourly", response_model=List[HourlyProduction])
async def get_hourly_production(
    date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get hourly production data for the dashboard chart."""
    # This would aggregate production logs by hour
    # For now, return sample data
    base_date = date or datetime.utcnow()
    hours = []

    for hour in range(6, 23, 2):  # 6 AM to 10 PM
        time_str = f"{hour:02d}:00"
        pcp1 = 12 + (hour - 6) * 5 + (hour % 3)  # Simulated growth pattern
        pcp2 = 8 + (hour - 6) * 3 + (hour % 2)
        target = 15 + (hour - 6) * 5

        hours.append(HourlyProduction(
            hour=time_str,
            pcp1=pcp1,
            pcp2=pcp2,
            target=target
        ))

    return hours


@router.get("/trends/weekly", response_model=List[WeeklyTrend])
async def get_weekly_production(db: Session = Depends(get_db)):
    """Get weekly production trend data."""
    days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
    production_values = [320, 380, 420, 390, 410, 350, 0]  # Friday is off
    scrap_values = [25, 18, 22, 30, 15, 28, 0]
    target = 400

    return [
        WeeklyTrend(
            day=day,
            production=prod,
            target=target if day != "Fri" else 0,
            scrap=scrap
        )
        for day, prod, scrap in zip(days, production_values, scrap_values)
    ]


# ============== Health Check ==============

@router.get("/health")
async def health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION
    }
