from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from app.models.schemas import Recommendation
from app.models.user import User
from app.services.recommendation_service import RecommendationService
from app.api.deps import get_current_user, get_supabase_client
from app.core.exceptions import DatabaseError

router = APIRouter()
security = HTTPBearer()


def get_recommendation_service(supabase=Depends(get_supabase_client)) -> RecommendationService:
    """Dependency para obter o serviço de recomendações"""
    return RecommendationService(supabase)


@router.get("/", response_model=List[Recommendation])
async def get_recommendations(
    latitude: Optional[float] = Query(None, ge=-90, le=90),
    longitude: Optional[float] = Query(None, ge=-180, le=180),
    ndvi_value: Optional[float] = Query(None, ge=0, le=1),
    biome: Optional[str] = Query(None),
    target_audience: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Busca recomendações baseadas em critérios"""
    try:
        recommendations = await recommendation_service.get_recommendations(
            latitude=latitude,
            longitude=longitude,
            ndvi_value=ndvi_value,
            biome=biome,
            target_audience=target_audience,
            limit=limit
        )
        return recommendations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/personalized", response_model=List[Recommendation])
async def get_personalized_recommendations(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    ndvi_value: Optional[float] = Query(None, ge=0, le=1),
    limit: int = Query(5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Busca recomendações personalizadas para o usuário atual"""
    try:
        recommendations = await recommendation_service.get_personalized_recommendations(
            user_id=current_user.id,
            latitude=latitude,
            longitude=longitude,
            ndvi_value=ndvi_value,
            limit=limit
        )
        return recommendations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/by-ndvi", response_model=List[Recommendation])
async def get_recommendations_by_ndvi(
    ndvi_value: float = Query(..., ge=0, le=1),
    biome: Optional[str] = Query(None),
    target_audience: Optional[str] = Query("citizen"),
    limit: int = Query(5, ge=1, le=20),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Busca recomendações baseadas no valor NDVI"""
    try:
        recommendations = await recommendation_service.get_recommendations_by_ndvi(
            ndvi_value=ndvi_value,
            biome=biome,
            target_audience=target_audience,
            limit=limit
        )
        return recommendations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/categories", response_model=List[str])
async def get_recommendation_categories(
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Lista todas as categorias de recomendações disponíveis"""
    try:
        categories = await recommendation_service.get_categories()
        return categories
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/biomes", response_model=List[str])
async def get_available_biomes(
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Lista todos os biomas disponíveis para recomendações"""
    try:
        biomes = await recommendation_service.get_biomes()
        return biomes
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/audiences", response_model=List[str])
async def get_target_audiences(
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """Lista todos os públicos-alvo disponíveis"""
    try:
        audiences = await recommendation_service.get_target_audiences()
        return audiences
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )