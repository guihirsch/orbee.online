from typing import Optional, List, Dict, Any
from datetime import datetime
from supabase import Client
from passlib.context import CryptContext
import bcrypt
import logging

from app.models.user import UserCreate, UserUpdate, UserInDB, User
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError

def get_pwd_context():
    """Returns configured password context"""
    return CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)


class UserRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "users"
        
        # If no supabase, use service role to bypass RLS
        if supabase is None:
            from app.core.database import get_supabase_service_client
            self.supabase = get_supabase_service_client()
    
    def _check_supabase(self):
        """Checks if Supabase is configured"""
        if self.supabase is None:
            raise Exception("Supabase not configured - development mode")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt directly"""
        try:
            print(f"DEBUG: _hash_password called with password: {repr(password)}")
            print(f"DEBUG: Size in bytes: {len(password.encode('utf-8'))}")
            
            # Truncate password to maximum 72 bytes (bcrypt limitation)
            password_bytes = password.encode('utf-8')
            if len(password_bytes) > 72:
                print(f"DEBUG: Password truncated from {len(password_bytes)} to 72 bytes")
                password_bytes = password_bytes[:72]
            
            print(f"DEBUG: Final password for hash: {password_bytes}")
            
            # Use bcrypt directly
            salt = bcrypt.gensalt()
            result = bcrypt.hashpw(password_bytes, salt)
            
            print(f"DEBUG: Hash generated successfully: {result[:20]}...")
            return result.decode('utf-8')
            
        except Exception as e:
            print(f"DEBUG: Error in _hash_password: {e}")
            raise e
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifies if password is correct using bcrypt directly"""
        try:
            # Truncate password to maximum 72 bytes (bcrypt limitation)
            password_bytes = plain_password.encode('utf-8')
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            
            # Use bcrypt directly
            return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))
        except Exception as e:
            print(f"DEBUG: Error in verify_password: {e}")
            return False
    
    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Cria um novo usuário"""
        try:
            print(f"DEBUG: create_user chamado com email: {user_data.email}")
            self._check_supabase()
            # Verificar se email já existe
            existing = await self.get_user_by_email(user_data.email)
            if existing:
                raise UserAlreadyExistsError(f"Usuário com email {user_data.email} já existe")
            
            print(f"DEBUG: Preparando dados do usuário...")
            # Preparar dados do usuário - apenas campos obrigatórios
            user_dict = {
                "email": user_data.email,
                "full_name": user_data.full_name,
                "password_hash": self._hash_password(user_data.password),
                "username": user_data.email.split("@")[0],  # Username baseado no email
                "role": "citizen",  # Role padrão
                "is_active": True
            }
            
            # Adicionar campos opcionais apenas se fornecidos
            if user_data.username:
                user_dict["username"] = user_data.username
            if user_data.bio:
                user_dict["bio"] = user_data.bio
            if user_data.location:
                user_dict["location"] = user_data.location
            if user_data.avatar_url:
                user_dict["avatar_url"] = user_data.avatar_url
                
            print(f"DEBUG: Dados finais para inserção: {user_dict}")
            print(f"DEBUG: Inserindo no Supabase...")
            
            # Inserir no banco
            result = self.supabase.table(self.table).insert(user_dict).execute()
            
            print(f"DEBUG: Resultado da inserção: {result}")
            
            if not result.data:
                raise Exception("Falha ao criar usuário")
            
            return UserInDB(**result.data[0])
            
        except Exception as e:
            print(f"DEBUG: Erro em create_user: {e}")
            print(f"DEBUG: Tipo do erro: {type(e)}")
            if "duplicate key" in str(e).lower():
                raise UserAlreadyExistsError("Email já está em uso")
            raise e
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Busca usuário por ID"""
        try:
            result = self.supabase.table(self.table).select("*").eq("id", user_id).execute()
            
            if result.data:
                return UserInDB(**result.data[0])
            return None
            
        except Exception as e:
            print(f"Erro ao buscar usuário por ID: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Busca usuário por email"""
        try:
            self._check_supabase()
            result = self.supabase.table(self.table).select("*").eq("email", email).execute()
            
            if result.data:
                return UserInDB(**result.data[0])
            return None
            
        except Exception as e:
            print(f"Erro ao buscar usuário por email: {e}")
            return None
    
    async def update(self, user_id: str, update_data: Dict[str, Any]) -> Optional[User]:
        """Atualiza dados do usuário"""
        try:
            self._check_supabase()
            response = self.supabase.table(self.table).update(update_data).eq("id", user_id).execute()
            if response.data:
                return User(**response.data[0])
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário: {e}")
            return None
        
        return None
    
    async def soft_delete(self, user_id: str) -> bool:
        """Desativa usuário (soft delete)"""
        try:
            self._check_supabase()
            response = self.supabase.table(self.table).update({"is_active": False}).eq("id", user_id).execute()
            return bool(response.data)
        except Exception as e:
            logger.error(f"Erro ao desativar usuário: {e}")
            return False
    
    async def get_recent_users(self, limit: int = 10) -> List[User]:
        """Retorna usuários mais recentes"""
        try:
            self._check_supabase()
            response = (
                self.supabase.table(self.table)
                .select("*")
                .eq("is_active", True)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [User(**user) for user in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar usuários recentes: {e}")
            pass
        
        # Dados mockados para desenvolvimento
        mock_users = [
            User(
                id="maria-user-id",
                email="maria@example.com",
                full_name="Maria Silva",
                username="maria_silva",
                role="citizen",
                bio="Pesquisadora em ecologia",
                location="Campinas, SP",
                avatar_url=None,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                last_login=None
            ),
            User(
                id="joao-user-id",
                email="joao@example.com",
                full_name="João Santos",
                username="joao_santos",
                role="researcher",
                bio="Especialista em sensoriamento remoto",
                location="São Paulo, SP",
                avatar_url=None,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                last_login=None
            ),
            User(
                id="ana-user-id",
                email="ana@example.com",
                full_name="Ana Costa",
                username="ana_costa",
                role="citizen",
                bio="Ativista ambiental",
                location="Rio de Janeiro, RJ",
                avatar_url=None,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                last_login=None
            )
        ]
        
        return mock_users[:limit]
    
    async def search_users(self, query: str, limit: int = 20) -> List[User]:
        """Busca usuários por nome ou localização"""
        try:
            self._check_supabase()
            response = (
                self.supabase.table(self.table)
                .select("*")
                .or_(f"full_name.ilike.%{query}%,location.ilike.%{query}%")
                .eq("is_active", True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [User(**user) for user in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar usuários: {e}")
            pass
        
        # Busca mockada para desenvolvimento
        all_users = await self.get_recent_users(50)
        query_lower = query.lower()
        
        filtered_users = [
            user for user in all_users
            if query_lower in user.full_name.lower() or 
               (user.location and query_lower in user.location.lower())
        ]
        
        return filtered_users[:limit]
    
    async def update_last_login(self, user_id: str) -> bool:
        """Atualiza o último login do usuário"""
        try:
            self._check_supabase()
            result = self.supabase.table(self.table).update({
                "last_login": datetime.utcnow().isoformat()
            }).eq("id", user_id).execute()
            
            return bool(result.data)
        except Exception as e:
            print(f"Erro ao atualizar último login: {e}")
            return False