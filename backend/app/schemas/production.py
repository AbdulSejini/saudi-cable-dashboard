"""
Pydantic Schemas for Production-related endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ShiftEnum(str, Enum):
    MORNING = "morning"
    EVENING = "evening"
    NIGHT = "night"


class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class WorkOrderStatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    ON_HOLD = "on-hold"
    CANCELLED = "cancelled"


class DowntimeTypeEnum(str, Enum):
    MECHANICAL = "mechanical"
    ELECTRICAL = "electrical"
    MATERIAL = "material"
    SETUP = "setup"
    QUALITY = "quality"
    BREAK = "break"
    OTHER = "other"


# ============== Work Order Schemas ==============

class WorkOrderBase(BaseModel):
    """Base schema for work order"""
    customer: str = Field(..., min_length=1, max_length=100)
    product: str = Field(..., min_length=1, max_length=200)
    machine_id: str = Field(..., min_length=1, max_length=20)
    priority: PriorityEnum = PriorityEnum.MEDIUM
    quantity_ordered: float = Field(..., gt=0)
    color: Optional[str] = Field(None, max_length=50)
    due_date: Optional[datetime] = None
    notes: Optional[str] = None


class WorkOrderCreate(WorkOrderBase):
    """Schema for creating a work order"""
    pass


class WorkOrderUpdate(BaseModel):
    """Schema for updating a work order"""
    status: Optional[WorkOrderStatusEnum] = None
    progress: Optional[float] = Field(None, ge=0, le=100)
    quantity_produced: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None


class WorkOrderResponse(WorkOrderBase):
    """Schema for work order response"""
    id: str
    status: WorkOrderStatusEnum
    progress: float
    quantity_produced: float
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============== Production Log Schemas ==============

class ProductionLogBase(BaseModel):
    """Base schema for production log"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    shift: ShiftEnum
    operator_name: Optional[str] = Field(None, max_length=100)
    speed: float = Field(..., ge=0)
    temperature: Optional[float] = None
    pressure: Optional[float] = None
    output_length: Optional[float] = Field(None, ge=0)
    output_weight: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None


class ProductionLogCreate(ProductionLogBase):
    """Schema for creating a production log"""
    timestamp: Optional[datetime] = None


class ProductionLogResponse(ProductionLogBase):
    """Schema for production log response"""
    id: int
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Downtime Log Schemas ==============

class DowntimeLogBase(BaseModel):
    """Base schema for downtime log"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    shift: ShiftEnum
    operator_name: Optional[str] = Field(None, max_length=100)
    downtime_type: DowntimeTypeEnum
    duration_minutes: int = Field(..., gt=0)
    reason: str = Field(..., min_length=1)
    resolution: Optional[str] = None
    is_planned: bool = False


class DowntimeLogCreate(DowntimeLogBase):
    """Schema for creating a downtime log"""
    timestamp: Optional[datetime] = None


class DowntimeLogResponse(DowntimeLogBase):
    """Schema for downtime log response"""
    id: int
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Production Summary Schemas ==============

class ProductionSummary(BaseModel):
    """Schema for production summary"""
    total_output_length: float
    total_output_weight: float
    average_speed: float
    average_temperature: float
    log_count: int


class DowntimeSummary(BaseModel):
    """Schema for downtime summary"""
    total_minutes: int
    by_type: dict
    planned_minutes: int
    unplanned_minutes: int
    log_count: int
