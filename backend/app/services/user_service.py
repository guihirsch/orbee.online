from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends
from supabase import Client

from app.core.config import settings
from app.core.database import get_supabase_client
from app.core.exceptions import (
    UserNotFoundError, 
    UserAlreadyExistsError, 
    InvalidCredentialsError,
    InvalidTokenError
)
from app.models.user import (
    User, 
    UserCreate, 
    UserUpdate, 
    UserInDB, 
    Token, 
    TokenData,
    UserStats
)
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, supabase: Client = None):
        if supabase is None:
            # Use service role to bypass RLS
            from app.core.database import get_supabase_service_client
            supabase = get_supabase_service_client()
        self.user_repo = UserRepository(supabase)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Creates JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> TokenData:
        """Verifies and decodes JWT token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise InvalidTokenError("Invalid token")
            return TokenData(email=email)
        except JWTError:
            raise InvalidTokenError("Invalid token")
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticates user with email and password"""
        user = await self.user_repo.get_user_by_email(email)
        if not user:
            return None
        if not self.user_repo.verify_password(password, user.password_hash):
            return None
        return user
    
    async def register_user(self, user_data: UserCreate) -> Token:
        """Registers new user"""
        # Check if user already exists
        existing_user = await self.user_repo.get_user_by_email(user_data.email)
        if existing_user:
            raise UserAlreadyExistsError("Email is already in use")
        
        # Create user
        user_in_db = await self.user_repo.create_user(user_data)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user_in_db.email}, expires_delta=access_token_expires
        )
        
        # Converter para modelo User (sem dados sensíveis)
        user = User(
            id=user_in_db.id,
            email=user_in_db.email,
            full_name=user_in_db.full_name,
            username=user_in_db.username,
            role=user_in_db.role,
            bio=user_in_db.bio,
            location=user_in_db.location,
            avatar_url=user_in_db.avatar_url,
            is_active=user_in_db.is_active,
            created_at=user_in_db.created_at,
            updated_at=user_in_db.updated_at,
            last_login=user_in_db.last_login
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user
        )
    
    async def login_user(self, email: str, password: str) -> Token:
        """Logs in user"""
        user = await self.authenticate_user(email, password)
        if not user:
            raise InvalidCredentialsError("Incorrect email or password")
        
        # Update last login
        await self.user_repo.update_last_login(user.id)
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        # Converter para modelo User (sem dados sensíveis)
        user_response = User(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            username=user.username,
            role=user.role,
            bio=user.bio,
            location=user.location,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
    
    async def get_current_user(self, token: str) -> User:
        """Obtém usuário atual baseado no token"""
        token_data = self.verify_token(token)
        user = await self.user_repo.get_user_by_email(token_data.email)
        if user is None:
            raise UserNotFoundError("Usuário não encontrado")
        
        # Converter para modelo User (sem dados sensíveis)
        return User(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            username=user.username,
            role=user.role,
            bio=user.bio,
            location=user.location,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            last_login=user.last_login
        )
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Atualiza dados do usuário"""
        update_data = user_data.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            return await self.user_repo.update(user_id, update_data)
        return await self.get_user_by_id(user_id)
    
    async def delete_user(self, user_id: str) -> bool:
        """Remove usuário (soft delete)"""
        return await self.user_repo.soft_delete(user_id)
    
    async def get_recent_users(self, limit: int = 10) -> List[User]:
        """Retorna usuários mais recentes"""
        return await self.user_repo.get_recent_users(limit)
    
    async def search_users(self, query: str, limit: int = 20) -> List[User]:
        """Busca usuários por nome ou localização"""
        return await self.user_repo.search_users(query, limit)
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Busca usuário por ID"""
        try:
            user_in_db = await self.user_repo.get_user_by_id(user_id)
            if user_in_db is None:
                raise UserNotFoundError("Usuário não encontrado")
            
            # Converter UserInDB para User (sem dados sensíveis)
            return User(
                id=user_in_db.id,
                email=user_in_db.email,
                full_name=user_in_db.full_name,
                username=user_in_db.username,
                role=user_in_db.role,
                bio=user_in_db.bio,
                location=user_in_db.location,
                avatar_url=user_in_db.avatar_url,
                is_active=user_in_db.is_active,
                created_at=user_in_db.created_at,
                updated_at=user_in_db.updated_at,
                last_login=user_in_db.last_login
            )
        except UserNotFoundError:
            raise
        except Exception as e:
            print(f"Erro ao buscar usuário por ID: {e}")
            raise UserNotFoundError("Erro ao buscar usuário")