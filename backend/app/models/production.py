"""
Production-related SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class Shift(str, enum.Enum):
    MORNING = "morning"
    EVENING = "evening"
    NIGHT = "night"


class Priority(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class WorkOrderStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    ON_HOLD = "on-hold"
    CANCELLED = "cancelled"


class WorkOrder(Base):
    """Work Order model"""
    __tablename__ = "work_orders"

    id = Column(String(20), primary_key=True, index=True)
    customer = Column(String(100), nullable=False)
    product = Column(String(200), nullable=False)
    product_code = Column(String(50))
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    status = Column(Enum(WorkOrderStatus), default=WorkOrderStatus.PENDING)
    progress = Column(Float, default=0.0)
    quantity_ordered = Column(Float, nullable=False)
    quantity_produced = Column(Float, default=0.0)
    color = Column(String(50))
    due_date = Column(DateTime(timezone=True))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    machine = relationship("Machine")

    def __repr__(self):
        return f"<WorkOrder {self.id}: {self.product}>"


class ProductionLog(Base):
    """Production Log for manual data entry"""
    __tablename__ = "production_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("employees.id"))
    shift = Column(Enum(Shift), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Production metrics
    speed = Column(Float, nullable=False)
    target_speed = Column(Float)
    temperature = Column(Float)
    pressure = Column(Float)
    output_length = Column(Float)  # meters
    output_weight = Column(Float)  # kg

    # Notes
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    machine = relationship("Machine", back_populates="production_logs")
    operator = relationship("Employee", back_populates="production_logs")

    def __repr__(self):
        return f"<ProductionLog {self.id}: {self.machine_id}>"


class DowntimeType(str, enum.Enum):
    MECHANICAL = "mechanical"
    ELECTRICAL = "electrical"
    MATERIAL = "material"
    SETUP = "setup"
    QUALITY = "quality"
    BREAK = "break"
    OTHER = "other"


class DowntimeLog(Base):
    """Downtime Log for tracking machine stoppages"""
    __tablename__ = "downtime_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(20), ForeignKey("machines.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("employees.id"))
    shift = Column(Enum(Shift), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Downtime details
    downtime_type = Column(Enum(DowntimeType), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    resolution = Column(Text)
    is_planned = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    machine = relationship("Machine", back_populates="downtime_logs")

    def __repr__(self):
        return f"<DowntimeLog {self.id}: {self.machine_id} - {self.downtime_type}>"
