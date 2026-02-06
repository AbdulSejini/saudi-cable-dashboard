"""
Machine SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class MachineStatus(str, enum.Enum):
    RUNNING = "running"
    IDLE = "idle"
    STOPPED = "stopped"
    MAINTENANCE = "maintenance"


class MachineType(str, enum.Enum):
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


class Machine(Base):
    """Machine model representing factory equipment"""
    __tablename__ = "machines"

    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    area = Column(String(50), nullable=False, index=True)
    type = Column(Enum(MachineType), nullable=False)
    status = Column(Enum(MachineStatus), default=MachineStatus.IDLE)
    speed = Column(Float, default=0.0)
    target_speed = Column(Float, nullable=False)
    temperature = Column(Float, default=25.0)
    oee = Column(Float, default=0.0)
    operator_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    operator = relationship("Employee", back_populates="assigned_machine")
    production_logs = relationship("ProductionLog", back_populates="machine")
    downtime_logs = relationship("DowntimeLog", back_populates="machine")
    quality_checks = relationship("QualityCheck", back_populates="machine")
    scrap_entries = relationship("ScrapEntry", back_populates="machine")
    maintenance_tasks = relationship("MaintenanceTask", back_populates="machine")

    def __repr__(self):
        return f"<Machine {self.id}: {self.name}>"


class Employee(Base):
    """Employee model"""
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_number = Column(String(20), unique=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100))  # Arabic name
    department = Column(String(50))
    position = Column(String(50))
    shift = Column(String(20))
    is_active = Column(Boolean, default=True)

    # Skills and certifications
    skill_level = Column(Integer, default=1)  # 1-5
    certifications = Column(String(500))  # JSON string of certifications

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assigned_machine = relationship("Machine", back_populates="operator", uselist=False)
    production_logs = relationship("ProductionLog", back_populates="operator")

    def __repr__(self):
        return f"<Employee {self.employee_number}: {self.name}>"
