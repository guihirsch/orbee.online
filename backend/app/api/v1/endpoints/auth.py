from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

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

# Configuração de segurança
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# get_current_user importado de app.api.deps

@router.post("/register", response_model=Token)
async def register(user_data: RegisterRequest):
    """Registra novo usuário"""
    try:
        user_service = UserService()
        return await user_service.register_user(user_data)
    except UserAlreadyExistsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Faz login do usuário"""
    try:
        user_service = UserService()
        return await user_service.login_user(login_data.email, login_data.password)
    except InvalidCredentialsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/login/form", response_model=Token)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login usando formulário OAuth2 (compatibilidade)"""
    try:
        user_service = UserService()
        return await user_service.login_user(form_data.username, form_data.password)
    except InvalidCredentialsError as e:
        raise to_http_exception(e)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtém informações do usuário atual"""
    return current_user

@router.post("/logout")
async def logout():
    """Logout do usuário (invalidação do token no frontend)"""
    return {"message": "Logout realizado com sucesso"}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Renova token de acesso"""
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
            detail="Erro ao renovar token"
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    """Cria token JWT de acesso"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


# Arquivo limpo - funções duplicadas removidas