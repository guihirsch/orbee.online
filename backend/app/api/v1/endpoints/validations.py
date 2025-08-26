from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPBearer

from app.models.observation import (
    Validation,
    ValidationCreate,
    ValidationUpdate,
    ValidationStats
)
from app.models.validation import ValidationSummary
from app.models.user import User
from app.services.validation_service import ValidationService
from app.repositories.observation_repository import ObservationRepository
from app.repositories.validation_repository import ValidationRepository
from app.api.deps import get_current_user, get_supabase_client
from app.core.exceptions import (
    ValidationNotFoundError,
    ObservationNotFoundError,
    ValidationError,
    DatabaseError
)

router = APIRouter()
security = HTTPBearer()


def get_validation_service(supabase=Depends(get_supabase_client)) -> ValidationService:
    """Dependency para obter o serviço de validações"""
    observation_repo = ObservationRepository(supabase)
    validation_repo = ValidationRepository(supabase)
    return ValidationService(validation_repo, observation_repo)


@router.post("/", response_model=Validation, status_code=status.HTTP_201_CREATED)
async def create_validation(
    validation_data: ValidationCreate,
    current_user: User = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Cria nova validação para uma observação"""
    try:
        validation = await validation_service.create_validation(
            validation_data, current_user.id
        )
        return validation
    except ObservationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Observação não encontrada"
        )
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


@router.get("/", response_model=List[Validation])
async def get_validations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    observation_id: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Lista validações com filtros opcionais"""
    try:
        if observation_id:
            validations = await validation_service.get_validations_by_observation(
                observation_id, skip=skip, limit=limit
            )
        elif user_id:
            validations = await validation_service.get_validations_by_user(
                user_id, skip=skip, limit=limit
            )
        else:
            validations = await validation_service.get_recent_validations(
                limit=limit
            )
        
        return validations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/recent", response_model=List[Validation])
async def get_recent_validations(
    limit: int = Query(20, ge=1, le=100),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Busca validações recentes"""
    try:
        validations = await validation_service.get_recent_validations(limit=limit)
        return validations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=ValidationStats)
async def get_validation_stats(
    user_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Obtém estatísticas de validações"""
    try:
        # Se user_id não fornecido, usar o usuário atual (se autenticado)
        target_user_id = user_id or (current_user.id if current_user else None)
        
        stats = await validation_service.get_validation_stats(user_id=target_user_id)
        return stats
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/summary", response_model=ValidationSummary)
async def get_validation_summary(
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Obtém resumo geral das validações"""
    try:
        summary = await validation_service.get_validation_summary()
        return summary
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/my", response_model=List[Validation])
async def get_my_validations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Busca validações do usuário atual"""
    try:
        validations = await validation_service.get_validations_by_user(
            current_user.id, skip=skip, limit=limit
        )
        return validations
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{validation_id}", response_model=Validation)
async def get_validation(
    validation_id: str,
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Busca validação por ID"""
    try:
        validation = await validation_service.get_validation_by_id(validation_id)
        return validation
    except ValidationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Validação não encontrada"
        )
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/{validation_id}", response_model=Validation)
async def update_validation(
    validation_id: str,
    validation_data: ValidationUpdate,
    current_user: User = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Atualiza validação (apenas o autor)"""
    try:
        validation = await validation_service.update_validation(
            validation_id, validation_data, current_user.id
        )
        return validation
    except ValidationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Validação não encontrada"
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


@router.delete("/{validation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_validation(
    validation_id: str,
    current_user: User = Depends(get_current_user),
    validation_service: ValidationService = Depends(get_validation_service)
):
    """Remove validação (apenas o autor)"""
    try:
        success = await validation_service.delete_validation(
            validation_id, current_user.id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Validação não encontrada"
            )
    except ValidationNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Validação não encontrada"
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