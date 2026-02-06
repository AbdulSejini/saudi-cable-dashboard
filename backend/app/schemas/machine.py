"""
Pydantic Schemas for Machine-related endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MachineStatusEnum(str, Enum):
    RUNNING = "running"
    IDLE = "idle"
    STOPPED = "stopped"
    MAINTENANCE = "maintenance"


class MachineTypeEnum(str, Enum):
    DRAWING = "drawing"
    BUNCHING = "bunching"
    ARMORING = "armoring"
    EXTRUSION = "extrusion"
    STRANDING = "stranding"
    PROCESSING = "processing"
    JACKETING = "jacketing"
    CV_LINE = "cv-line"
    REWINDING = "rewinding"
    STORAGE = "storage"


# ============== Machine Schemas ==============

class MachineBase(BaseModel):
    """Base schema for machine data"""
    name: str = Field(..., min_length=1, max_length=100)
    area: str = Field(..., min_length=1, max_length=50)
    type: MachineTypeEnum
    target_speed: float = Field(..., ge=0)


class MachineCreate(MachineBase):
    """Schema for creating a new machine"""
    id: str = Field(..., min_length=1, max_length=20)
    status: MachineStatusEnum = MachineStatusEnum.IDLE
    speed: float = Field(default=0.0, ge=0)
    temperature: float = Field(default=25.0)
    oee: float = Field(default=0.0, ge=0, le=100)


class MachineUpdate(BaseModel):
    """Schema for updating a machine"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[MachineStatusEnum] = None
    speed: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = None
    oee: Optional[float] = Field(None, ge=0, le=100)
    operator_id: Optional[int] = None


class MachineStatusUpdate(BaseModel):
    """Schema for updating machine status only"""
    status: MachineStatusEnum
    speed: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = None
    operator_name: Optional[str] = None


class MachineResponse(MachineBase):
    """Schema for machine response"""
    id: str
    status: MachineStatusEnum
    speed: float
    temperature: float
    oee: float
    operator_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MachineStats(BaseModel):
    """Schema for machine statistics"""
    total: int
    running: int
    idle: int
    stopped: int
    maintenance: int


class AreaOEE(BaseModel):
    """Schema for area OEE response"""
    area: str
    oee: float
    machine_count: int
    running_count: int


# ============== Employee Schemas ==============

class EmployeeBase(BaseModel):
    """Base schema for employee data"""
    name: str = Field(..., min_length=1, max_length=100)
    name_ar: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=50)
    position: Optional[str] = Field(None, max_length=50)
    shift: Optional[str] = Field(None, max_length=20)


class EmployeeCreate(EmployeeBase):
    """Schema for creating an employee"""
    employee_number: str = Field(..., min_length=1, max_length=20)
    skill_level: int = Field(default=1, ge=1, le=5)


class EmployeeResponse(EmployeeBase):
    """Schema for employee response"""
    id: int
    employee_number: str
    skill_level: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
