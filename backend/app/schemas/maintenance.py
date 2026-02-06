"""
Pydantic Schemas for Maintenance endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MaintenanceTypeEnum(str, Enum):
    PREVENTIVE = "preventive"
    CORRECTIVE = "corrective"
    PREDICTIVE = "predictive"
    EMERGENCY = "emergency"


class MaintenanceStatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on-hold"


# ============== Maintenance Task Schemas ==============

class MaintenanceTaskBase(BaseModel):
    """Base schema for maintenance task"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    type: MaintenanceTypeEnum
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: int = Field(default=3, ge=1, le=5)
    assignee: Optional[str] = Field(None, max_length=100)
    team: Optional[str] = Field(None, max_length=100)
    estimated_duration_hours: Optional[float] = Field(None, ge=0)


class MaintenanceTaskCreate(MaintenanceTaskBase):
    """Schema for creating a maintenance task"""
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None


class MaintenanceTaskUpdate(BaseModel):
    """Schema for updating a maintenance task"""
    status: Optional[MaintenanceStatusEnum] = None
    assignee: Optional[str] = Field(None, max_length=100)
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    actual_duration_hours: Optional[float] = Field(None, ge=0)
    downtime_minutes: Optional[int] = Field(None, ge=0)
    spare_parts_used: Optional[str] = None
    labor_cost: Optional[float] = Field(None, ge=0)
    parts_cost: Optional[float] = Field(None, ge=0)
    root_cause: Optional[str] = None
    resolution: Optional[str] = None
    notes: Optional[str] = None


class MaintenanceTaskResponse(MaintenanceTaskBase):
    """Schema for maintenance task response"""
    id: str
    status: MaintenanceStatusEnum
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    actual_duration_hours: Optional[float] = None
    downtime_minutes: int
    total_cost: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Emulsion Log Schemas ==============

class EmulsionLogBase(BaseModel):
    """Base schema for emulsion log"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    ph_level: float = Field(..., ge=0, le=14)
    conductivity: Optional[float] = Field(None, ge=0)
    concentration: Optional[float] = Field(None, ge=0, le=100)
    temperature: Optional[float] = None
    bacteria_count: Optional[float] = Field(None, ge=0)
    grotan_added: float = Field(default=0.0, ge=0)
    notes: Optional[str] = None


class EmulsionLogCreate(EmulsionLogBase):
    """Schema for creating an emulsion log"""
    timestamp: Optional[datetime] = None


class EmulsionLogResponse(EmulsionLogBase):
    """Schema for emulsion log response"""
    id: int
    timestamp: datetime
    is_within_spec: bool
    action_required: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Maintenance Summary Schemas ==============

class MaintenanceSummary(BaseModel):
    """Schema for maintenance summary"""
    total_tasks: int
    pending: int
    in_progress: int
    completed: int
    by_type: dict
    total_downtime_minutes: int
    total_cost: float
    mttr_hours: Optional[float] = None  # Mean Time To Repair
    mtbf_hours: Optional[float] = None  # Mean Time Between Failures
