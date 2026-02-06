"""
Pydantic Schemas Package
"""
from app.schemas.machine import (
    MachineStatusEnum, MachineTypeEnum,
    MachineBase, MachineCreate, MachineUpdate, MachineStatusUpdate, MachineResponse,
    MachineStats, AreaOEE,
    EmployeeBase, EmployeeCreate, EmployeeResponse
)

from app.schemas.production import (
    ShiftEnum, PriorityEnum, WorkOrderStatusEnum, DowntimeTypeEnum,
    WorkOrderBase, WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse,
    ProductionLogBase, ProductionLogCreate, ProductionLogResponse,
    DowntimeLogBase, DowntimeLogCreate, DowntimeLogResponse,
    ProductionSummary, DowntimeSummary
)

from app.schemas.quality import (
    ScrapTypeEnum,
    QualityCheckBase, QualityCheckCreate, QualityCheckResponse,
    ScrapEntryBase, ScrapEntryCreate, ScrapEntryResponse,
    ScrapSummary, QualitySummary
)

from app.schemas.maintenance import (
    MaintenanceTypeEnum, MaintenanceStatusEnum,
    MaintenanceTaskBase, MaintenanceTaskCreate, MaintenanceTaskUpdate, MaintenanceTaskResponse,
    EmulsionLogBase, EmulsionLogCreate, EmulsionLogResponse,
    MaintenanceSummary
)

from app.schemas.dashboard import (
    PlantBase, PlantCreate, PlantResponse, PlantCapacity,
    WorkforceRecordBase, WorkforceRecordCreate, WorkforceRecordResponse, WorkforceSummary,
    MachineOverview, KPIOverview, WorkforceOverview, ScrapOverview, DashboardOverview,
    HourlyProduction, DailyProductionSummary, WeeklyTrend
)

__all__ = [
    # Machine schemas
    "MachineStatusEnum", "MachineTypeEnum",
    "MachineBase", "MachineCreate", "MachineUpdate", "MachineStatusUpdate", "MachineResponse",
    "MachineStats", "AreaOEE",
    "EmployeeBase", "EmployeeCreate", "EmployeeResponse",

    # Production schemas
    "ShiftEnum", "PriorityEnum", "WorkOrderStatusEnum", "DowntimeTypeEnum",
    "WorkOrderBase", "WorkOrderCreate", "WorkOrderUpdate", "WorkOrderResponse",
    "ProductionLogBase", "ProductionLogCreate", "ProductionLogResponse",
    "DowntimeLogBase", "DowntimeLogCreate", "DowntimeLogResponse",
    "ProductionSummary", "DowntimeSummary",

    # Quality schemas
    "ScrapTypeEnum",
    "QualityCheckBase", "QualityCheckCreate", "QualityCheckResponse",
    "ScrapEntryBase", "ScrapEntryCreate", "ScrapEntryResponse",
    "ScrapSummary", "QualitySummary",

    # Maintenance schemas
    "MaintenanceTypeEnum", "MaintenanceStatusEnum",
    "MaintenanceTaskBase", "MaintenanceTaskCreate", "MaintenanceTaskUpdate", "MaintenanceTaskResponse",
    "EmulsionLogBase", "EmulsionLogCreate", "EmulsionLogResponse",
    "MaintenanceSummary",

    # Dashboard schemas
    "PlantBase", "PlantCreate", "PlantResponse", "PlantCapacity",
    "WorkforceRecordBase", "WorkforceRecordCreate", "WorkforceRecordResponse", "WorkforceSummary",
    "MachineOverview", "KPIOverview", "WorkforceOverview", "ScrapOverview", "DashboardOverview",
    "HourlyProduction", "DailyProductionSummary", "WeeklyTrend",
]
