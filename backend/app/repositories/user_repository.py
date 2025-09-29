from typing import Optional, List, Dict, Any
from datetime import datetime
from supabase import Client
from passlib.context import CryptContext
import bcrypt
import logging

from app.models.user import UserCreate, UserUpdate, UserInDB, User
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError

def get_pwd_context():
    """Retorna o contexto de senha configurado"""
    return CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)


class UserRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "users"
        
        # Se não há supabase, usar service role para contornar RLS
        if supabase is None:
            from app.core.database import get_supabase_service_client
            self.supabase = get_supabase_service_client()
    
    def _check_supabase(self):
        """Verifica se Supabase está configurado"""
        if self.supabase is None:
            raise Exception("Supabase não configurado - modo desenvolvimento")
    
    def _hash_password(self, password: str) -> str:
        """Hash da senha usando bcrypt diretamente"""
        try:
            print(f"DEBUG: _hash_password chamado com senha: {repr(password)}")
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
            print(f"DEBUG: Erro em _hash_password: {e}")
            raise e
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha está correta usando bcrypt diretamente"""
        try:
            # Truncar senha para máximo de 72 bytes (limitação do bcrypt)
            password_bytes = plain_password.encode('utf-8')
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            
            # Usar bcrypt diretamente
            return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))
        except Exception as e:
            print(f"DEBUG: Erro em verify_password: {e}")
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
            # Preparar dados do usuário
            user_dict = user_data.dict(exclude={"password", "role"})  # Excluir role temporariamente
            print(f"DEBUG: Dados do usuário (sem senha e role): {user_dict}")
            
            print(f"DEBUG: Fazendo hash da senha...")
            user_dict["password_hash"] = self._hash_password(user_data.password)
            user_dict["username"] = user_data.email.split("@")[0]  # Username temporário
            
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
    
    async def get_top_users_by_points(self, limit: int = 10) -> List[User]:
        """Retorna usuários com mais pontos"""
        try:
            self._check_supabase()
            response = (
                self.supabase.table(self.table)
                .select("*")
                .eq("is_active", True)
                .order("points", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [User(**user) for user in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar top usuários: {e}")
            pass
        
        # Dados mockados para desenvolvimento
        mock_leaderboard = [
            User(
                id="maria-user-id",
                email="maria@example.com",
                name="Maria Silva",
                location="Campinas, SP",
                created_at="2024-01-01T00:00:00Z",
                is_active=True,
                points=250,
                observations_count=8,
                validations_count=15
            ),
            User(
                id="joao-user-id",
                email="joao@example.com",
                name="João Santos",
                location="São Paulo, SP",
                created_at="2024-01-01T00:00:00Z",
                is_active=True,
                points=180,
                observations_count=6,
                validations_count=12
            ),
            User(
                id="ana-user-id",
                email="ana@example.com",
                name="Ana Costa",
                location="Rio de Janeiro, RJ",
                created_at="2024-01-01T00:00:00Z",
                is_active=True,
                points=150,
                observations_count=5,
                validations_count=10
            )
        ]
        
        return mock_leaderboard[:limit]
    
    async def search_users(self, query: str, limit: int = 20) -> List[User]:
        """Busca usuários por nome ou localização"""
        try:
            self._check_supabase()
            response = (
                self.supabase.table(self.table)
                .select("*")
                .or_(f"name.ilike.%{query}%,location.ilike.%{query}%")
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
        all_users = await self.get_top_users_by_points(50)
        query_lower = query.lower()
        
        filtered_users = [
            user for user in all_users
            if query_lower in user.name.lower() or 
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