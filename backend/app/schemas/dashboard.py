"""
Pydantic Schemas for Dashboard and Capacity endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============== Capacity Schemas ==============

class PlantBase(BaseModel):
    """Base schema for plant"""
    name: str = Field(..., min_length=1, max_length=100)
    name_ar: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    design_capacity_mt: float = Field(..., gt=0)
    location: Optional[str] = Field(None, max_length=200)


class PlantCreate(PlantBase):
    """Schema for creating a plant"""
    id: str = Field(..., min_length=1, max_length=20)


class PlantResponse(PlantBase):
    """Schema for plant response"""
    id: str
    current_capacity_mt: float
    utilization_percent: float
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PlantCapacity(BaseModel):
    """Schema for plant capacity data"""
    plant_id: str
    plant_name: str
    design_capacity: float
    actual_production: float
    utilization_percent: float
    unit: str = "MT/year"


# ============== Workforce Schemas ==============

class WorkforceRecordBase(BaseModel):
    """Base schema for workforce record"""
    plant_id: str = Field(..., min_length=1, max_length=20)
    total_positions: int = Field(..., ge=0)
    filled_positions: int = Field(default=0, ge=0)
    morning_shift: int = Field(default=0, ge=0)
    evening_shift: int = Field(default=0, ge=0)
    night_shift: int = Field(default=0, ge=0)
    operators: int = Field(default=0, ge=0)
    technicians: int = Field(default=0, ge=0)
    supervisors: int = Field(default=0, ge=0)
    engineers: int = Field(default=0, ge=0)
    in_training: int = Field(default=0, ge=0)


class WorkforceRecordCreate(WorkforceRecordBase):
    """Schema for creating a workforce record"""
    pass


class WorkforceRecordResponse(WorkforceRecordBase):
    """Schema for workforce record response"""
    id: int
    date: datetime
    vacancies: int
    certified: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkforceSummary(BaseModel):
    """Schema for workforce summary"""
    plant_id: str
    total: int
    on_shift: int
    vacancies: int
    vacancy_rate: float


# ============== Dashboard Overview Schemas ==============

class MachineOverview(BaseModel):
    """Schema for machine overview in dashboard"""
    total: int
    running: int
    idle: int
    stopped: int
    maintenance: int


class KPIOverview(BaseModel):
    """Schema for KPI overview in dashboard"""
    overall_oee: float
    capacity_utilization: float
    active_work_orders: int
    pending_maintenance: int
    quality_rate: float
    scrap_rate: float


class WorkforceOverview(BaseModel):
    """Schema for workforce overview in dashboard"""
    total_on_shift: int
    total_vacancies: int
    vacancy_rate: float


class ScrapOverview(BaseModel):
    """Schema for scrap overview in dashboard"""
    weight_kg: float
    value_usd: float
    value_sar: float


class DashboardOverview(BaseModel):
    """Schema for complete dashboard overview"""
    timestamp: datetime
    machines: MachineOverview
    kpis: KPIOverview
    workforce: WorkforceOverview
    scrap_today: ScrapOverview
    alerts: List[Dict[str, Any]] = []


# ============== Production Trend Schemas ==============

class HourlyProduction(BaseModel):
    """Schema for hourly production data"""
    hour: str
    pcp1: float
    pcp2: float
    target: float


class DailyProductionSummary(BaseModel):
    """Schema for daily production summary"""
    date: str
    plant_id: str
    production_mt: float
    target_mt: float
    scrap_mt: float
    oee: float


class WeeklyTrend(BaseModel):
    """Schema for weekly trend data"""
    day: str
    production: float
    target: float
    scrap: float
