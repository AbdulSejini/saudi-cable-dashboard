"""
Capacity and Workforce SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func

from app.db.database import Base


class Plant(Base):
    """Plant/Factory model"""
    __tablename__ = "plants"

    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100))
    description = Column(String(500))

    # Capacity
    design_capacity_mt = Column(Float, nullable=False)  # Metric Tons per year
    current_capacity_mt = Column(Float, default=0.0)

    # Location
    location = Column(String(200))

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Plant {self.id}: {self.name}>"

    @property
    def utilization_percent(self) -> float:
        """Calculate capacity utilization percentage"""
        if self.design_capacity_mt > 0:
            return (self.current_capacity_mt / self.design_capacity_mt) * 100
        return 0.0


class WorkforceRecord(Base):
    """Workforce tracking model"""
    __tablename__ = "workforce_records"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(String(20), nullable=False, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())

    # Headcount
    total_positions = Column(Integer, nullable=False)
    filled_positions = Column(Integer, default=0)
    vacancies = Column(Integer, default=0)

    # Shift breakdown
    morning_shift = Column(Integer, default=0)
    evening_shift = Column(Integer, default=0)
    night_shift = Column(Integer, default=0)

    # Categories
    operators = Column(Integer, default=0)
    technicians = Column(Integer, default=0)
    supervisors = Column(Integer, default=0)
    engineers = Column(Integer, default=0)
    support_staff = Column(Integer, default=0)

    # Training
    in_training = Column(Integer, default=0)
    certified = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<WorkforceRecord {self.plant_id}: {self.filled_positions}/{self.total_positions}>"


class DailyProduction(Base):
    """Daily production summary"""
    __tablename__ = "daily_production"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(String(20), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False, index=True)

    # Production metrics
    production_mt = Column(Float, default=0.0)
    target_mt = Column(Float, default=0.0)
    scrap_mt = Column(Float, default=0.0)

    # OEE components
    availability = Column(Float, default=0.0)
    performance = Column(Float, default=0.0)
    quality = Column(Float, default=0.0)
    oee = Column(Float, default=0.0)

    # Time breakdown (minutes)
    planned_production_time = Column(Integer, default=0)
    actual_production_time = Column(Integer, default=0)
    downtime_planned = Column(Integer, default=0)
    downtime_unplanned = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<DailyProduction {self.plant_id} {self.date}: {self.production_mt}MT>"

    def calculate_oee(self):
        """Calculate OEE from components"""
        self.oee = (self.availability * self.performance * self.quality) / 10000
        return self.oee
