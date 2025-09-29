from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    observations,
    validations,
    ndvi,
    recommendations,
    aoi,
    geo,
    plan,
    cache
)

api_router = APIRouter()

# Incluir todas as rotas
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["authentication"]
)

api_router.include_router(
    users.router, 
    prefix="/users", 
    tags=["users"]
)

api_router.include_router(
    observations.router, 
    prefix="/observations", 
    tags=["observations"]
)

api_router.include_router(
    validations.router, 
    prefix="/validations", 
    tags=["validations"]
)

api_router.include_router(
    ndvi.router, 
    prefix="/ndvi", 
    tags=["ndvi-data"]
)

api_router.include_router(
    recommendations.router, 
    prefix="/recommendations", 
    tags=["recommendations"]
)

api_router.include_router(
    aoi.router,
    prefix="/aoi",
    tags=["areas-of-interest"]
)

api_router.include_router(
    geo.router,
    prefix="/geo",
    tags=["geo"]
)

api_router.include_router(
    plan.router,
    prefix="/plan",
    tags=["action-plan"]
)

api_router.include_router(
    cache.router,
    prefix="/cache",
    tags=["cache"]
)