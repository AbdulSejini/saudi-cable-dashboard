
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api.routers import auth, machines, production, maintenance, quality, dashboard

# Create tables (Alternative to running Alembic manually for first start)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard")
app.include_router(machines.router, prefix=f"{settings.API_V1_STR}") # Machines router defines its own /machines prefix
app.include_router(production.router, prefix=f"{settings.API_V1_STR}/production")
app.include_router(maintenance.router, prefix=f"{settings.API_V1_STR}/maintenance")
app.include_router(quality.router, prefix=f"{settings.API_V1_STR}/quality")

@app.get("/")
def root():
    return {
        "message": "Saudi Cable Company Smart Operations API",
        "doc_url": f"{settings.API_V1_STR}/docs"
    }
