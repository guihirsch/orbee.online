from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from app.models.observation import (
    Observation,
    ObservationCreate,
    ObservationUpdate,
    ObservationFilter,
    ObservationResponse,
    ObservationStats,
    NearbyObservation,
    ObservationType,
    ObservationStatus
)
from app.models.user import User
from app.services.observation_service import ObservationService
from app.services.validation_service import ValidationService
from app.repositories.observation_repository import ObservationRepository
from app.repositories.validation_repository import ValidationRepository
from app.api.deps import get_current_user, get_supabase_client
from app.core.exceptions import (
    ObservationNotFoundError,
    ValidationError,
    DatabaseError
)

router = APIRouter()
security = HTTPBearer()


def get_observation_service(supabase=Depends(get_supabase_client)) -> ObservationService:
    """Dependency para obter o serviço de observações"""
    observation_repo = ObservationRepository(supabase)
    validation_repo = ValidationRepository(supabase)
    return ObservationService(observation_repo, validation_repo)


def get_validation_service(supabase=Depends(get_supabase_client)) -> ValidationService:
    """Dependency para obter o serviço de validações"""
    observation_repo = ObservationRepository(supabase)
    validation_repo = ValidationRepository(supabase)
    return ValidationService(validation_repo, observation_repo)


@router.post("/", response_model=Observation, status_code=status.HTTP_201_CREATED)
async def create_observation(
    observation_data: ObservationCreate,
    current_user: User = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Cria nova observação"""
    try:
        observation = await observation_service.create_observation(
            observation_data, current_user.id
        )
        return observation
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/", response_model=ObservationResponse)
async def get_observations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    observation_type: Optional[ObservationType] = None,
    status: Optional[ObservationStatus] = None,
    user_id: Optional[str] = None,
    lat: Optional[float] = Query(None, ge=-90, le=90),
    lon: Optional[float] = Query(None, ge=-180, le=180),
    radius_km: Optional[float] = Query(None, gt=0, le=100),
    current_user: Optional[User] = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Lista observações com filtros opcionais"""
    try:
        filters = ObservationFilter(
            observation_type=observation_type,
            status=status,
            user_id=user_id,
            latitude=lat,
            longitude=lon,
            radius_km=radius_km
        )
        
        response = await observation_service.get_observations(
            filters=filters,
            user_id=current_user.id if current_user else None,
            skip=skip,
            limit=limit
        )
        
        return response
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/search", response_model=ObservationResponse)
async def search_observations(
    q: str = Query(..., min_length=3),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observações por texto"""
    try:
        response = await observation_service.search_observations(
            query=q,
            user_id=current_user.id if current_user else None,
            skip=skip,
            limit=limit
        )
        
        return response
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/nearby", response_model=List[NearbyObservation])
async def get_nearby_observations(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(5.0, gt=0, le=50),
    limit: int = Query(10, ge=1, le=50),
    current_user: Optional[User] = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observações próximas a uma localização"""
    try:
        observations = await observation_service.get_nearby_observations(
            lat=lat,
            lon=lon,
            radius_km=radius_km,
            user_id=current_user.id if current_user else None,
            limit=limit
        )
        
        return observations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/recent", response_model=List[Observation])
async def get_recent_observations(
    days: int = Query(7, ge=1, le=30),
    limit: int = Query(20, ge=1, le=100),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observações recentes"""
    try:
        observations = await observation_service.get_recent_observations(
            days=days,
            limit=limit
        )
        
        return observations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/validated", response_model=ObservationResponse)
async def get_validated_observations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observações validadas pela comunidade"""
    try:
        response = await observation_service.get_validated_observations(
            skip=skip,
            limit=limit
        )
        
        return response
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=ObservationStats)
async def get_observation_stats(
    user_id: Optional[str] = None,
    days: Optional[int] = Query(None, ge=1, le=365),
    current_user: Optional[User] = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Obtém estatísticas de observações"""
    try:
        # Se user_id não fornecido, usar o usuário atual (se autenticado)
        target_user_id = user_id or (current_user.id if current_user else None)
        
        stats = await observation_service.get_observation_stats(
            user_id=target_user_id,
            days=days
        )
        
        return stats
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/my", response_model=ObservationResponse)
async def get_my_observations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observações do usuário atual"""
    try:
        response = await observation_service.get_user_observations(
            user_id=current_user.id,
            skip=skip,
            limit=limit
        )
        
        return response
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{observation_id}", response_model=Observation)
async def get_observation(
    observation_id: str,
    current_user: Optional[User] = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Busca observação por ID"""
    try:
        observation = await observation_service.get_observation_by_id(
            observation_id,
            user_id=current_user.id if current_user else None
        )
        
        return observation
    except ObservationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Observação não encontrada"
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/{observation_id}", response_model=Observation)
async def update_observation(
    observation_id: str,
    observation_data: ObservationUpdate,
    current_user: User = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Atualiza observação (apenas o autor)"""
    try:
        observation = await observation_service.update_observation(
            observation_id, observation_data, current_user.id
        )
        
        return observation
    except ObservationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Observação não encontrada"
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{observation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_observation(
    observation_id: str,
    current_user: User = Depends(get_current_user),
    observation_service: ObservationService = Depends(get_observation_service)
):
    """Remove observação (apenas o autor)"""
    try:
        success = await observation_service.delete_observation(
            observation_id, current_user.id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Observação não encontrada"
            )
    except ObservationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Observação não encontrada"
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{observation_id}/can-validate")
async def check_can_validate(
    observation_id: str,
    current_user: User = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Verifica se o usuário pode validar uma observação"""
    try:
        can_validate = await validation_service.check_user_can_validate(
            observation_id, current_user.id
        )
        
        return {"can_validate": can_validate}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao verificar permissão de validação"
        )