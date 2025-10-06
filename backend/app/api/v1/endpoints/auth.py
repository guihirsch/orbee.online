from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta

from app.core.config import settings
from app.core.database import get_supabase_client, get_db
from app.core.exceptions import (
    UserAlreadyExistsError,
    InvalidCredentialsError,
    InvalidTokenError,
    UserNotFoundError,
    to_http_exception
)
from app.models.user import (
    User, 
    UserCreate, 
    Token, 
    TokenData, 
    LoginRequest, 
    RegisterRequest
)
from app.services.user_service import UserService
from app.api.deps import get_current_user

router = APIRouter()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# get_current_user imported from app.api.deps

@router.post("/register", response_model=Token)
async def register(user_data: RegisterRequest):
    """Registers new user"""
    try:
        user_service = UserService()
        return await user_service.register_user(user_data)
    except UserAlreadyExistsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """User login"""
    try:
        user_service = UserService()
        return await user_service.login_user(login_data.email, login_data.password)
    except InvalidCredentialsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/login/form", response_model=Token)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login using OAuth2 form (compatibility)"""
    try:
        user_service = UserService()
        return await user_service.login_user(form_data.username, form_data.password)
    except InvalidCredentialsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Gets current user information"""
    return current_user

@router.post("/logout")
async def logout():
    """User logout (token invalidation on frontend)"""
    return {"message": "Logout successful"}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Renews access token"""
    try:
        user_service = UserService()
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = user_service.create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=current_user
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error renewing token"
        )

