"""
Pydantic Schemas for Quality and Scrap endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

from app.schemas.production import ShiftEnum


class ScrapTypeEnum(str, Enum):
    COPPER_WIRE = "copper-wire"
    PVC_COMPOUND = "pvc-compound"
    MIXED_CABLE = "mixed-cable"
    ALUMINUM_WIRE = "aluminum-wire"
    INSULATED_COPPER = "insulated-copper"
    XLPE = "xlpe"
    RUBBER = "rubber"
    STEEL_ARMOR = "steel-armor"
    OTHER = "other"


# ============== Quality Check Schemas ==============

class QualityCheckBase(BaseModel):
    """Base schema for quality check"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    shift: ShiftEnum
    operator_name: Optional[str] = Field(None, max_length=100)

    # Measurements
    diameter: Optional[float] = Field(None, ge=0)
    diameter_tolerance: Optional[float] = None
    thickness: Optional[float] = Field(None, ge=0)
    concentricity: Optional[float] = None

    # Test results
    spark_test_passed: bool = True
    spark_test_voltage: Optional[float] = None
    tensile_test_passed: bool = True
    tensile_strength: Optional[float] = None
    elongation: Optional[float] = None

    # Visual inspection
    visual_inspection_passed: bool = True
    defect_type: Optional[str] = Field(None, max_length=100)
    defect_location: Optional[float] = None

    notes: Optional[str] = None


class QualityCheckCreate(QualityCheckBase):
    """Schema for creating a quality check"""
    timestamp: Optional[datetime] = None


class QualityCheckResponse(QualityCheckBase):
    """Schema for quality check response"""
    id: int
    passed: bool
    timestamp: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Scrap Entry Schemas ==============

class ScrapEntryBase(BaseModel):
    """Base schema for scrap entry"""
    machine_id: str = Field(..., min_length=1, max_length=20)
    shift: ShiftEnum
    operator_name: Optional[str] = Field(None, max_length=100)

    # Scrap details
    scrap_type: ScrapTypeEnum
    scrap_code: Optional[str] = Field(None, max_length=20)
    weight_kg: float = Field(..., gt=0)
    copper_content_percent: float = Field(default=0.0, ge=0, le=100)
    aluminum_content_percent: float = Field(default=0.0, ge=0, le=100)

    # Additional info
    reason: Optional[str] = None
    work_order_id: Optional[str] = None
    notes: Optional[str] = None


class ScrapEntryCreate(ScrapEntryBase):
    """Schema for creating a scrap entry"""
    timestamp: Optional[datetime] = None


class ScrapEntryResponse(ScrapEntryBase):
    """Schema for scrap entry response"""
    id: int
    timestamp: datetime
    lme_price_used: Optional[float] = None
    financial_value_usd: Optional[float] = None
    financial_value_sar: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Scrap Summary Schemas ==============

class ScrapSummary(BaseModel):
    """Schema for scrap summary"""
    total_weight_kg: float
    total_copper_kg: float
    total_value_usd: float
    total_value_sar: float
    entry_count: int
    by_type: dict


class QualitySummary(BaseModel):
    """Schema for quality summary"""
    total_checks: int
    passed_count: int
    failed_count: int
    pass_rate: float
    spark_test_failures: int
    tensile_test_failures: int
    visual_failures: int
