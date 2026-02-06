"""
Maintenance SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class MaintenanceType(str, enum.Enum):
    PREVENTIVE = "preventive"
    CORRECTIVE = "corrective"
    PREDICTIVE = "predictive"
    EMERGENCY = "emergency"


class MaintenanceStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on-hold"


class MaintenanceTask(Base):
    """Maintenance Task model"""
    __tablename__ = "maintenance_tasks"

    id = Column(String(20), primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    type = Column(Enum(MaintenanceType), nullable=False)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.PENDING)

    # Task details
    title = Column(String(200), nullable=False)
    description = Column(Text)
    priority = Column(Integer, default=3)  # 1-5, 1 being highest

    # Assignment
    assignee = Column(String(100))
    team = Column(String(100))

    # Scheduling
    scheduled_start = Column(DateTime(timezone=True))
    scheduled_end = Column(DateTime(timezone=True))
    actual_start = Column(DateTime(timezone=True))
    actual_end = Column(DateTime(timezone=True))

    # Metrics
    estimated_duration_hours = Column(Float)
    actual_duration_hours = Column(Float)
    downtime_minutes = Column(Integer, default=0)

    # Parts and costs
    spare_parts_used = Column(Text)  # JSON string
    labor_cost = Column(Float, default=0.0)
    parts_cost = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)

    # Resolution
    root_cause = Column(Text)
    resolution = Column(Text)
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    machine = relationship("Machine", back_populates="maintenance_tasks")

    def __repr__(self):
        return f"<MaintenanceTask {self.id}: {self.title}>"


class EmulsionLog(Base):
    """Emulsion monitoring log for drawing machines"""
    __tablename__ = "emulsion_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Emulsion parameters
    ph_level = Column(Float)
    conductivity = Column(Float)
    concentration = Column(Float)
    temperature = Column(Float)
    bacteria_count = Column(Float)  # cfu/ml

    # Status
    is_within_spec = Column(Boolean, default=True)
    action_required = Column(String(200))
    grotan_added = Column(Float, default=0.0)  # liters

    # Notes
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<EmulsionLog {self.id}: pH={self.ph_level}>"
