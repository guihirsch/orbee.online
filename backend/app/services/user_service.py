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
            supabase = get_supabase_client()
        self.user_repo = UserRepository(supabase)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Cria token JWT de acesso"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> TokenData:
        """Verifica e decodifica token JWT"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise InvalidTokenError("Token inválido")
            return TokenData(email=email)
        except JWTError:
            raise InvalidTokenError("Token inválido")
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Autentica usuário com email e senha"""
        user = await self.user_repo.get_user_by_email(email)
        if not user:
            return None
        if not self.user_repo.verify_password(password, user.hashed_password):
            return None
        return user
    
    async def register_user(self, user_data: UserCreate) -> Token:
        """Registra novo usuário"""
        # Verificar se usuário já existe
        existing_user = await self.user_repo.get_user_by_email(user_data.email)
        if existing_user:
            raise UserAlreadyExistsError("Email já está em uso")
        
        # Criar usuário
        user_in_db = await self.user_repo.create_user(user_data)
        
        # Criar token de acesso
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user_in_db.email}, expires_delta=access_token_expires
        )
        
        # Converter para modelo User (sem dados sensíveis)
        user = User(
            id=user_in_db.id,
            email=user_in_db.email,
            full_name=user_in_db.full_name,
            role=user_in_db.role,
            bio=user_in_db.bio,
            location=user_in_db.location,
            avatar_url=user_in_db.avatar_url,
            is_active=user_in_db.is_active,
            created_at=user_in_db.created_at,
            updated_at=user_in_db.updated_at,
            observation_count=user_in_db.observation_count,
            validation_count=user_in_db.validation_count,
            points=user_in_db.points,
            level=user_in_db.level,
            last_login=user_in_db.last_login
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user
        )
    
    async def login_user(self, email: str, password: str) -> Token:
        """Faz login do usuário"""
        user = await self.authenticate_user(email, password)
        if not user:
            raise InvalidCredentialsError("Email ou senha incorretos")
        
        # Atualizar último login
        await self.user_repo.update_last_login(user.id)
        
        # Criar token de acesso
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        # Converter para modelo User (sem dados sensíveis)
        user_response = User(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            bio=user.bio,
            location=user.location,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            observation_count=user.observation_count,
            validation_count=user.validation_count,
            points=user.points,
            level=user.level,
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
            role=user.role,
            bio=user.bio,
            location=user.location,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            observation_count=user.observation_count,
            validation_count=user.validation_count,
            points=user.points,
            level=user.level,
            last_login=user.last_login
        )
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Atualiza dados do usuário"""
        update_data = user_data.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            return await self.user_repository.update(user_id, update_data)
        return await self.get_user_by_id(user_id)
    
    async def delete_user(self, user_id: str) -> bool:
        """Remove usuário (soft delete)"""
        return await self.user_repository.soft_delete(user_id)
    
    async def add_points(self, user_id: str, points: int) -> Optional[User]:
        """Adiciona pontos ao usuário"""
        user = await self.get_user_by_id(user_id)
        if user:
            new_points = user.points + points
            return await self.user_repository.update(user_id, {
                "points": new_points,
                "updated_at": datetime.utcnow()
            })
        return None
    
    async def increment_observations(self, user_id: str) -> Optional[User]:
        """Incrementa contador de observações"""
        user = await self.get_user_by_id(user_id)
        if user:
            new_count = user.observations_count + 1
            # Adiciona pontos por observação
            new_points = user.points + 10
            return await self.user_repository.update(user_id, {
                "observations_count": new_count,
                "points": new_points,
                "updated_at": datetime.utcnow()
            })
        return None
    
    async def increment_validations(self, user_id: str) -> Optional[User]:
        """Incrementa contador de validações"""
        user = await self.get_user_by_id(user_id)
        if user:
            new_count = user.validations_count + 1
            # Adiciona pontos por validação
            new_points = user.points + 5
            return await self.user_repository.update(user_id, {
                "validations_count": new_count,
                "points": new_points,
                "updated_at": datetime.utcnow()
            })
        return None
    
    async def get_leaderboard(self, limit: int = 10) -> List[User]:
        """Retorna ranking de usuários por pontos"""
        return await self.user_repository.get_top_users_by_points(limit)
    
    async def search_users(self, query: str, limit: int = 20) -> List[User]:
        """Busca usuários por nome ou localização"""
        return await self.user_repository.search_users(query, limit)