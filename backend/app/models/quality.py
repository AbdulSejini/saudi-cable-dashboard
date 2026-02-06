"""
Quality and Scrap SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base
from app.models.production import Shift


class QualityCheck(Base):
    """Quality Check model for in-process quality control"""
    __tablename__ = "quality_checks"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("employees.id"))
    shift = Column(Enum(Shift), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Quality measurements
    diameter = Column(Float)
    diameter_tolerance = Column(Float)
    thickness = Column(Float)
    concentricity = Column(Float)

    # Test results
    spark_test_passed = Column(Boolean, default=True)
    spark_test_voltage = Column(Float)
    tensile_test_passed = Column(Boolean, default=True)
    tensile_strength = Column(Float)
    elongation = Column(Float)

    # Visual inspection
    visual_inspection_passed = Column(Boolean, default=True)
    defect_type = Column(String(100))
    defect_location = Column(Float)  # meters from start

    # Overall result
    passed = Column(Boolean, default=True)
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    machine = relationship("Machine", back_populates="quality_checks")

    def __repr__(self):
        return f"<QualityCheck {self.id}: {self.machine_id} - {'PASS' if self.passed else 'FAIL'}>"


class ScrapType(str, enum.Enum):
    COPPER_WIRE = "copper-wire"
    PVC_COMPOUND = "pvc-compound"
    MIXED_CABLE = "mixed-cable"
    ALUMINUM_WIRE = "aluminum-wire"
    INSULATED_COPPER = "insulated-copper"
    XLPE = "xlpe"
    RUBBER = "rubber"
    STEEL_ARMOR = "steel-armor"
    OTHER = "other"


class ScrapEntry(Base):
    """Scrap Entry model for tracking waste and calculating financial value"""
    __tablename__ = "scrap_entries"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("employees.id"))
    shift = Column(Enum(Shift), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Scrap details
    scrap_type = Column(Enum(ScrapType), nullable=False)
    scrap_code = Column(String(20))  # Internal scrap code (e.g., from the 76 codes)
    weight_kg = Column(Float, nullable=False)
    copper_content_percent = Column(Float, default=0.0)
    aluminum_content_percent = Column(Float, default=0.0)

    # Financial calculation
    lme_price_used = Column(Float)  # LME price at time of entry
    financial_value_usd = Column(Float)
    financial_value_sar = Column(Float)

    # Reason and notes
    reason = Column(Text)
    work_order_id = Column(String(20), ForeignKey("work_orders.id"))
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    machine = relationship("Machine", back_populates="scrap_entries")

    def __repr__(self):
        return f"<ScrapEntry {self.id}: {self.scrap_type} - {self.weight_kg}kg>"

    def calculate_financial_value(self, lme_copper_price: float, usd_to_sar: float = 3.75):
        """Calculate financial value based on copper content and LME price"""
        copper_weight_kg = (self.weight_kg * self.copper_content_percent) / 100
        copper_weight_mt = copper_weight_kg / 1000
        self.lme_price_used = lme_copper_price
        self.financial_value_usd = copper_weight_mt * lme_copper_price
        self.financial_value_sar = self.financial_value_usd * usd_to_sar
        return self.financial_value_usd
