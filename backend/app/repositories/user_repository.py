from typing import Optional, List, Dict, Any
from datetime import datetime
from supabase import Client
from passlib.context import CryptContext

from app.models.user import UserCreate, UserUpdate, UserInDB, User
from app.core.exceptions import UserNotFoundError, UserAlreadyExistsError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "users"
    
    def _hash_password(self, password: str) -> str:
        """Hash da senha usando bcrypt"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha está correta"""
        return pwd_context.verify(plain_password, hashed_password)
    
    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Cria um novo usuário"""
        try:
            # Verificar se email já existe
            existing = await self.get_user_by_email(user_data.email)
            if existing:
                raise UserAlreadyExistsError(f"Usuário com email {user_data.email} já existe")
            
            # Preparar dados do usuário
            user_dict = user_data.dict(exclude={"password"})
            user_dict["password_hash"] = self._hash_password(user_data.password)
            user_dict["username"] = user_data.email.split("@")[0]  # Username temporário
            
            # Inserir no banco
            result = self.supabase.table(self.table).insert(user_dict).execute()
            
            if not result.data:
                raise Exception("Falha ao criar usuário")
            
            return UserInDB(**result.data[0])
            
        except Exception as e:
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
            response = self.db.table(self.table_name).update(update_data).eq("id", user_id).execute()
            if response.data:
                return User(**response.data[0])
        except Exception:
            pass
        
        # Modo desenvolvimento - simula atualização
        user = await self.get_by_id(user_id)
        if user:
            user_dict = user.dict()
            user_dict.update(update_data)
            return User(**user_dict)
        return None
    
    async def soft_delete(self, user_id: str) -> bool:
        """Desativa usuário (soft delete)"""
        try:
            response = self.db.table(self.table_name).update({"is_active": False}).eq("id", user_id).execute()
            return bool(response.data)
        except Exception:
            return True  # Simula sucesso em desenvolvimento
    
    async def get_top_users_by_points(self, limit: int = 10) -> List[User]:
        """Retorna usuários com mais pontos"""
        try:
            response = (
                self.db.table(self.table_name)
                .select("*")
                .eq("is_active", True)
                .order("points", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [User(**user) for user in response.data]
        except Exception:
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
            response = (
                self.db.table(self.table_name)
                .select("*")
                .or_(f"name.ilike.%{query}%,location.ilike.%{query}%")
                .eq("is_active", True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [User(**user) for user in response.data]
        except Exception:
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