from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from supabase import Client
from typing import Optional

from app.core.database import get_supabase_client
from app.models.user import User
from app.services.user_service import UserService
from app.core.exceptions import InvalidTokenError, UserNotFoundError, to_http_exception

# Esquema de autenticação Bearer
oauth2_scheme = HTTPBearer()


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Obtém usuário atual baseado no token JWT"""
    try:
        # UserService já usa service role por padrão
        user_service = UserService()
        return await user_service.get_current_user(token.credentials)
    except (InvalidTokenError, UserNotFoundError) as e:
        raise to_http_exception(e)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_optional(token: Optional[str] = Depends(HTTPBearer(auto_error=False))) -> Optional[User]:
    """Obtém usuário atual baseado no token JWT (opcional)"""
    if not token:
        return None
    
    try:
        # UserService já usa service role por padrão
        user_service = UserService()
        return await user_service.get_current_user(token.credentials)
    except (InvalidTokenError, UserNotFoundError):
        return None
    except Exception:
        return None


def get_db() -> Client:
    """Dependency para obter cliente do banco"""
    return get_supabase_client()