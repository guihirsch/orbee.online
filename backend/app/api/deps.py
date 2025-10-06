from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from supabase import Client
from typing import Optional

from app.core.database import get_supabase_client
from app.models.user import User
from app.services.user_service import UserService
from app.core.exceptions import InvalidTokenError, UserNotFoundError, to_http_exception

# Bearer authentication scheme
oauth2_scheme = HTTPBearer()


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Gets current user based on JWT token"""
    try:
        # UserService already uses service role by default
        user_service = UserService()
        return await user_service.get_current_user(token.credentials)
    except (InvalidTokenError, UserNotFoundError) as e:
        raise to_http_exception(e)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_optional(token: Optional[str] = Depends(HTTPBearer(auto_error=False))) -> Optional[User]:
    """Gets current user based on JWT token (optional)"""
    if not token:
        return None
    
    try:
        # UserService already uses service role by default
        user_service = UserService()
        return await user_service.get_current_user(token.credentials)
    except (InvalidTokenError, UserNotFoundError):
        return None
    except Exception:
        return None


def get_db() -> Client:
    """Dependency to get database client"""
    return get_supabase_client()