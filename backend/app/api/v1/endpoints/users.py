from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from app.core.database import get_supabase_client
from app.core.exceptions import (
    UserNotFoundError,
    UserAlreadyExistsError,
    InsufficientPermissionsError,
    to_http_exception
)
from app.models.user import (
    User, UserCreate, UserUpdate, UserProfile, UserStats
)
from app.services.user_service import UserService
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user)
):
    """Lista usuários com paginação (apenas admins)"""
    try:
        if current_user.role != "admin":
            raise InsufficientPermissionsError("Apenas administradores podem listar usuários")
        
        user_service = UserService()
        return await user_service.get_users(skip=skip, limit=limit)
    except InsufficientPermissionsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Obtém perfil público de um usuário"""
    try:
        user_service = UserService()
        user = await user_service.get_user_by_id(user_id)
        
        # Converte User para UserProfile (dados públicos)
        return UserProfile(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            bio=user.bio,
            location=user.location,
            avatar_url=user.avatar_url,
            level=user.level,
            points=user.points,
            observation_count=user.observation_count,
            validation_count=user.validation_count,
            created_at=user.created_at
        )
    except UserNotFoundError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.put("/profile", response_model=User)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Atualiza perfil do usuário atual"""
    try:
        user_service = UserService()
        return await user_service.update_user(current_user.id, user_update)
    except UserNotFoundError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/stats/{user_id}", response_model=UserStats)
async def get_user_stats(user_id: str):
    """Obtém estatísticas de um usuário"""
    try:
        user_service = UserService()
        return await user_service.get_user_stats(user_id)
    except UserNotFoundError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/ranking", response_model=List[User])
async def get_user_ranking(
    limit: int = Query(10, ge=1, le=50)
):
    """Obtém ranking de usuários por pontuação"""
    try:
        user_service = UserService()
        return await user_service.get_top_users(limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/search", response_model=List[User])
async def search_users(
    q: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50)
):
    """Busca usuários por nome ou localização"""
    try:
        user_service = UserService()
        return await user_service.search_users(query=q, limit=limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/increment-observations/{user_id}")
async def increment_observations(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Incrementa contador de observações (uso interno)"""
    try:
        user_service = UserService()
        await user_service.increment_observations(user_id)
        return {"message": "Contador de observações incrementado"}
    except UserNotFoundError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/increment-validations/{user_id}")
async def increment_validations(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Incrementa contador de validações (uso interno)"""
    try:
        user_service = UserService()
        await user_service.increment_validations(user_id)
        return {"message": "Contador de validações incrementado"}
    except UserNotFoundError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )