from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt

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
def get_pwd_context():
    """Retorna o contexto de senha configurado"""
    try:
        return CryptContext(schemes=["bcrypt"], deprecated="auto")
    except Exception as e:
        print(f"DEBUG: Erro ao criar CryptContext: {e}")
        raise e

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

# get_current_user importado de app.api.deps

@router.post("/register", response_model=Token)
async def register(user_data: RegisterRequest):
    """Registra novo usuário"""
    try:
        print(f"DEBUG: Endpoint register chamado com dados: {user_data}")
        print(f"DEBUG: Senha recebida: {repr(user_data.password)}")
        print(f"DEBUG: Tamanho da senha em bytes: {len(user_data.password.encode('utf-8'))}")
        
        user_service = UserService()
        return await user_service.register_user(user_data)
    except UserAlreadyExistsError as e:
        raise to_http_exception(e)
    except Exception as e:
        print(f"DEBUG: Erro no endpoint register: {e}")
        print(f"DEBUG: Tipo do erro: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.post("/test-register", response_model=Token)
async def test_register(user_data: RegisterRequest):
    """Endpoint de teste para registro sem Supabase"""
    try:
        from datetime import timedelta
        from jose import jwt
        import uuid
        
        # Criar usuário mockado
        user_id = str(uuid.uuid4())
        
        # Criar token JWT simples para testes
        access_token_expires = timedelta(minutes=30)
        expire = datetime.utcnow() + access_token_expires
        
        token_data = {
            "sub": user_data.email,
            "exp": expire
        }
        
        access_token = jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        # Criar usuário mockado
        user = User(
            id=user_id,
            email=user_data.email,
            full_name=user_data.full_name,
            username=user_data.username or user_data.email.split("@")[0],
            role="citizen",
            bio=None,
            location=None,
            avatar_url=None,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            observation_count=0,
            validation_count=0,
            points=0,
            level=1,
            last_login=None
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=30 * 60,
            user=user
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@router.post("/test-token")
async def test_token():
    """Endpoint de teste para gerar token sem Supabase"""
    try:
        from datetime import timedelta
        from jose import jwt
        
        # Criar token JWT simples para testes
        access_token_expires = timedelta(minutes=30)
        expire = datetime.utcnow() + access_token_expires
        
        token_data = {
            "sub": "teste@exemplo.com",
            "exp": expire
        }
        
        access_token = jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 30 * 60,
            "message": "Token de teste gerado (modo desenvolvimento)"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar token: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Faz login do usuário"""
    try:
        print(f"DEBUG: Endpoint login chamado com email: {login_data.email}")
        user_service = UserService()
        return await user_service.login_user(login_data.email, login_data.password)
    except InvalidCredentialsError as e:
        print(f"DEBUG: Credenciais inválidas: {e}")
        raise to_http_exception(e)
    except Exception as e:
        print(f"DEBUG: Erro no endpoint login: {e}")
        print(f"DEBUG: Tipo do erro: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
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
    return get_pwd_context().verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera hash da senha usando bcrypt diretamente"""
    try:
        print(f"DEBUG: get_password_hash chamado com senha: {repr(password)}")
        print(f"DEBUG: Tamanho em bytes: {len(password.encode('utf-8'))}")
        
        # Truncar senha para máximo de 72 bytes (limitação do bcrypt)
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            print(f"DEBUG: Senha truncada de {len(password_bytes)} para 72 bytes")
            password_bytes = password_bytes[:72]
        
        print(f"DEBUG: Senha final para hash: {password_bytes}")
        
        # Usar bcrypt diretamente
        salt = bcrypt.gensalt()
        result = bcrypt.hashpw(password_bytes, salt)
        
        print(f"DEBUG: Hash gerado com sucesso: {result[:20]}...")
        return result.decode('utf-8')
        
    except Exception as e:
        print(f"DEBUG: Erro em get_password_hash: {e}")
        raise e


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

@router.post("/debug-register")
async def debug_register(user_data: RegisterRequest):
    """Endpoint de debug para investigar o problema"""
    try:
        print(f"DEBUG: Dados recebidos: {user_data}")
        print(f"DEBUG: Senha: {repr(user_data.password)}")
        print(f"DEBUG: Tamanho em bytes: {len(user_data.password.encode('utf-8'))}")
        
        # Testar hash direto
        print(f"DEBUG: Testando hash direto...")
        hash_result = get_password_hash(user_data.password)
        print(f"DEBUG: Hash gerado: {hash_result[:20]}...")
        
        return {
            "message": "Debug successful",
            "password_length_bytes": len(user_data.password.encode('utf-8')),
            "password_length_chars": len(user_data.password),
            "hash_generated": True
        }
        
    except Exception as e:
        print(f"DEBUG: Erro no debug: {e}")
        return {
            "error": str(e),
            "error_type": str(type(e))
        }

# Arquivo limpo - funções duplicadas removidas