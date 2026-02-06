"""
API Routers Package
"""
from app.api.routers.machines import router as machines_router
from app.api.routers.production import router as production_router
from app.api.routers.quality import router as quality_router
from app.api.routers.maintenance import router as maintenance_router
from app.api.routers.dashboard import router as dashboard_router

__all__ = [
    "machines_router",
    "production_router",
    "quality_router",
    "maintenance_router",
    "dashboard_router"
]
