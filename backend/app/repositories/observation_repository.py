from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from supabase import Client
import logging

from app.models.observation import (
    Observation,
    ObservationCreate,
    ObservationUpdate,
    ObservationInDB,
    ObservationFilter,
    ObservationStats,
    Validation,
    ValidationCreate,
    ValidationUpdate,
    ValidationInDB,
    ValidationStats,
    NearbyObservation,
    ObservationStatus,
    ValidationStatus
)
from app.core.exceptions import (
    ObservationNotFoundError,
    ValidationError,
    DatabaseError
)

logger = logging.getLogger(__name__)


class ObservationRepository:
    """Repositório para operações de observações no banco de dados"""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.observations_table = "observations"
        self.validations_table = "observation_validations"
        self.users_table = "users"
    
    async def create_observation(self, observation_data: ObservationCreate, user_id: str, user_token: str = None) -> ObservationInDB:
        """Cria nova observação"""
        try:
            # Preparar dados para inserção
            insert_data = {
                "user_id": user_id,
                "title": observation_data.title,
                "description": observation_data.description,
                "observation_type": observation_data.observation_type.value,
                "latitude": observation_data.latitude,
                "longitude": observation_data.longitude,
                "address": observation_data.location_name,
                "images": observation_data.images or [],
                "status": ObservationStatus.PENDING.value,
                "validation_count": 0,
                "validation_score": 0.0,
                "is_validated": False
            }
            
            # Se temos um token de usuário, usar service role para bypass RLS
            # ou configurar o cliente com o token do usuário
            if user_token:
                # Para desenvolvimento, vamos usar service role para bypass RLS
                from app.core.database import get_supabase_service_client
                service_client = get_supabase_service_client()
                if service_client:
                    result = service_client.table(self.observations_table).insert(insert_data).execute()
                else:
                    # Fallback para cliente normal
                    result = self.supabase.table(self.observations_table).insert(insert_data).execute()
            else:
                result = self.supabase.table(self.observations_table).insert(insert_data).execute()
            
            if not result.data:
                raise DatabaseError("Falha ao criar observação")
            
            return ObservationInDB(**result.data[0])
            
        except Exception as e:
            logger.error(f"Erro ao criar observação: {e}")
            raise DatabaseError(f"Erro ao criar observação: {str(e)}")
    
    async def get_observation_by_id(self, observation_id: str, user_id: Optional[str] = None) -> Observation:
        """Busca observação por ID"""
        try:
            # Query com join para obter dados do usuário
            query = self.supabase.table(self.observations_table).select(
                "*, users(name, avatar_url)"
            ).eq("id", observation_id)
            
            result = query.execute()
            
            if not result.data:
                raise ObservationNotFoundError(f"Observação {observation_id} não encontrada")
            
            obs_data = result.data[0]
            
            # Calcular se o usuário pode validar
            user_can_validate = False
            if user_id and user_id != obs_data["user_id"]:
                # Verificar se já validou
                validation_check = self.supabase.table(self.validations_table).select("id").eq(
                    "observation_id", observation_id
                ).eq("user_id", user_id).execute()
                
                user_can_validate = len(validation_check.data) == 0
            
            # Construir objeto Observation
            observation = Observation(
                **obs_data,
                user_name=obs_data.get("users", {}).get("name") if obs_data.get("users") else None,
                user_avatar=obs_data.get("users", {}).get("avatar_url") if obs_data.get("users") else None,
                user_can_validate=user_can_validate
            )
            
            return observation
            
        except ObservationNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar observação {observation_id}: {e}")
            raise DatabaseError(f"Erro ao buscar observação: {str(e)}")
    
    async def get_by_user_id(self, user_id: str, limit: int = 20, offset: int = 0) -> List[Observation]:
        """Busca observações de um usuário"""
        try:
            response = (
                self.supabase.table(self.observations_table)
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            if response.data:
                return [Observation(**obs) for obs in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar observações do usuário: {e}")
            pass
        
        # Dados mockados para desenvolvimento
        mock_observations = self._get_mock_observations()
        user_observations = [obs for obs in mock_observations if obs.user_id == user_id]
        return user_observations[offset:offset + limit]
    
    async def get_by_location(
        self, 
        latitude: float, 
        longitude: float, 
        radius_km: float = 10.0,
        limit: int = 50
    ) -> List[Observation]:
        """Busca observações próximas a uma localização"""
        try:
            # Query com função PostGIS para busca geográfica
            # Nota: Requer extensão PostGIS no Supabase
            response = (
                self.supabase.rpc(
                    "get_observations_near_location",
                    {
                        "lat": latitude,
                        "lng": longitude,
                        "radius_km": radius_km,
                        "limit_count": limit
                    }
                ).execute()
            )
            if response.data:
                return [Observation(**obs) for obs in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar observações por localização: {e}")
            pass
        
        # Fallback: busca simples por proximidade
        mock_observations = self._get_mock_observations()
        nearby_observations = []
        
        for obs in mock_observations:
            distance = self._calculate_distance(
                latitude, longitude, obs.latitude, obs.longitude
            )
            if distance <= radius_km:
                nearby_observations.append(obs)
        
        # Ordena por distância
        nearby_observations.sort(
            key=lambda obs: self._calculate_distance(
                latitude, longitude, obs.latitude, obs.longitude
            )
        )
        
        return nearby_observations[:limit]
    
    async def update(self, observation_id: str, update_data: Dict[str, Any]) -> Optional[Observation]:
        """Atualiza dados da observação"""
        try:
            response = (
                self.supabase.table(self.observations_table)
                .update(update_data)
                .eq("id", observation_id)
                .execute()
            )
            if response.data:
                return Observation(**response.data[0])
        except Exception as e:
            logger.error(f"Erro ao atualizar observação: {e}")
            pass
        
        # Modo desenvolvimento - simula atualização
        observation = await self.get_by_id(observation_id)
        if observation:
            obs_dict = observation.dict()
            obs_dict.update(update_data)
            return Observation(**obs_dict)
        return None
    
    async def delete(self, observation_id: str) -> bool:
        """Remove observação"""
        try:
            response = self.supabase.table(self.observations_table).delete().eq("id", observation_id).execute()
            return bool(response.data)
        except Exception as e:
            logger.error(f"Erro ao deletar observação: {e}")
            return False
    
    async def add_validation(
        self, 
        observation_id: str, 
        validator_user_id: str, 
        is_valid: bool
    ) -> bool:
        """Registra validação de uma observação"""
        try:
            validation_data = {
                "observation_id": observation_id,
                "validator_user_id": validator_user_id,
                "is_valid": is_valid,
                "created_at": datetime.utcnow().isoformat()
            }
            response = self.supabase.table(self.validations_table).insert(validation_data).execute()
            return bool(response.data)
        except Exception as e:
            logger.error(f"Erro ao adicionar validação: {e}")
            return False
    
    async def get_recent(self, limit: int = 20) -> List[Observation]:
        """Retorna observações mais recentes"""
        try:
            response = (
                self.supabase.table(self.observations_table)
                .select("*")
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [Observation(**obs) for obs in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar observações recentes: {e}")
            pass
        
        # Dados mockados para desenvolvimento
        mock_observations = self._get_mock_observations()
        return sorted(mock_observations, key=lambda x: x.created_at, reverse=True)[:limit]
    
    async def get_validated(self, limit: int = 50) -> List[Observation]:
        """Retorna observações validadas"""
        try:
            response = (
                self.supabase.table(self.observations_table)
                .select("*")
                .eq("is_validated", True)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data:
                return [Observation(**obs) for obs in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar observações validadas: {e}")
            pass
        
        # Dados mockados para desenvolvimento
        mock_observations = self._get_mock_observations()
        validated = [obs for obs in mock_observations if obs.is_validated]
        return sorted(validated, key=lambda x: x.created_at, reverse=True)[:limit]
    
    async def search(
        self, 
        query: str, 
        observation_type: Optional[str] = None,
        limit: int = 20
    ) -> List[Observation]:
        """Busca observações por texto"""
        try:
            query_builder = (
                self.supabase.table(self.observations_table)
                .select("*")
                .or_(f"description.ilike.%{query}%,location_name.ilike.%{query}%")
            )
            
            if observation_type:
                query_builder = query_builder.eq("observation_type", observation_type)
            
            response = query_builder.limit(limit).execute()
            
            if response.data:
                return [Observation(**obs) for obs in response.data]
        except Exception as e:
            logger.error(f"Erro ao buscar observações: {e}")
            pass
        
        # Busca mockada para desenvolvimento
        mock_observations = self._get_mock_observations()
        query_lower = query.lower()
        
        filtered = [
            obs for obs in mock_observations
            if (query_lower in obs.description.lower() or 
                (obs.location_name and query_lower in obs.location_name.lower())) and
               (not observation_type or obs.observation_type == observation_type)
        ]
        
        return filtered[:limit]
    
    async def get_global_stats(self) -> ObservationStats:
        """Retorna estatísticas globais"""
        try:
            # Queries para estatísticas reais
            total_response = self.supabase.table(self.observations_table).select("id", count="exact").execute()
            validated_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("is_validated", True)
                .execute()
            )
            pending_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("status", ObservationStatus.PENDING.value)
                .execute()
            )
            rejected_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("status", ObservationStatus.REJECTED.value)
                .execute()
            )
            
            # Buscar observações por tipo
            type_response = self.supabase.table(self.observations_table).select("observation_type").execute()
            observations_by_type = {}
            if type_response.data:
                for obs in type_response.data:
                    obs_type = obs.get("observation_type", "other")
                    observations_by_type[obs_type] = observations_by_type.get(obs_type, 0) + 1
            
            # Buscar observações recentes (últimos 7 dias)
            from datetime import datetime, timedelta
            week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
            recent_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .gte("created_at", week_ago)
                .execute()
            )
            
            total_count = total_response.count if total_response.count else 0
            validated_count = validated_response.count if validated_response.count else 0
            pending_count = pending_response.count if pending_response.count else 0
            rejected_count = rejected_response.count if rejected_response.count else 0
            recent_count = recent_response.count if recent_response.count else 0
            
            return ObservationStats(
                total_observations=total_count,
                pending_observations=pending_count,
                validated_observations=validated_count,
                rejected_observations=rejected_count,
                observations_by_type=observations_by_type,
                recent_observations=recent_count
            )
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas globais: {e}")
            pass
        
        # Estatísticas mockadas para desenvolvimento
        mock_observations = self._get_mock_observations()
        total = len(mock_observations)
        validated = len([obs for obs in mock_observations if obs.is_validated])
        pending = len([obs for obs in mock_observations if obs.status == ObservationStatus.PENDING])
        rejected = len([obs for obs in mock_observations if obs.status == ObservationStatus.REJECTED])
        
        # Contar por tipo
        observations_by_type = {}
        for obs in mock_observations:
            obs_type = obs.observation_type.value if hasattr(obs.observation_type, 'value') else str(obs.observation_type)
            observations_by_type[obs_type] = observations_by_type.get(obs_type, 0) + 1
        
        # Observações recentes (últimos 7 dias)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent = len([obs for obs in mock_observations if obs.created_at >= week_ago])
        
        return ObservationStats(
            total_observations=total,
            pending_observations=pending,
            validated_observations=validated,
            rejected_observations=rejected,
            observations_by_type=observations_by_type,
            recent_observations=recent
        )
    
    async def get_user_stats(self, user_id: str, days: Optional[int] = None) -> ObservationStats:
        """Retorna estatísticas de um usuário específico"""
        try:
            # Query base para observações do usuário
            base_query = self.supabase.table(self.observations_table).select("id", count="exact").eq("user_id", user_id)
            
            # Total de observações do usuário
            total_response = base_query.execute()
            
            # Observações validadas
            validated_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("user_id", user_id)
                .eq("is_validated", True)
                .execute()
            )
            
            # Observações pendentes
            pending_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("user_id", user_id)
                .eq("status", ObservationStatus.PENDING.value)
                .execute()
            )
            
            # Observações rejeitadas
            rejected_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("user_id", user_id)
                .eq("status", ObservationStatus.REJECTED.value)
                .execute()
            )
            
            # Buscar observações por tipo do usuário
            type_response = (
                self.supabase.table(self.observations_table)
                .select("observation_type")
                .eq("user_id", user_id)
                .execute()
            )
            observations_by_type = {}
            if type_response.data:
                for obs in type_response.data:
                    obs_type = obs.get("observation_type", "other")
                    observations_by_type[obs_type] = observations_by_type.get(obs_type, 0) + 1
            
            # Observações recentes (últimos N dias ou 7 dias por padrão)
            days_filter = days if days else 7
            from datetime import datetime, timedelta
            days_ago = (datetime.utcnow() - timedelta(days=days_filter)).isoformat()
            recent_response = (
                self.supabase.table(self.observations_table)
                .select("id", count="exact")
                .eq("user_id", user_id)
                .gte("created_at", days_ago)
                .execute()
            )
            
            total_count = total_response.count if total_response.count else 0
            validated_count = validated_response.count if validated_response.count else 0
            pending_count = pending_response.count if pending_response.count else 0
            rejected_count = rejected_response.count if rejected_response.count else 0
            recent_count = recent_response.count if recent_response.count else 0
            
            return ObservationStats(
                total_observations=total_count,
                pending_observations=pending_count,
                validated_observations=validated_count,
                rejected_observations=rejected_count,
                observations_by_type=observations_by_type,
                recent_observations=recent_count
            )
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas do usuário {user_id}: {e}")
            pass
        
        # Estatísticas mockadas para desenvolvimento
        mock_observations = self._get_mock_observations()
        user_observations = [obs for obs in mock_observations if obs.user_id == user_id]
        
        total = len(user_observations)
        validated = len([obs for obs in user_observations if obs.is_validated])
        pending = len([obs for obs in user_observations if obs.status == ObservationStatus.PENDING])
        rejected = len([obs for obs in user_observations if obs.status == ObservationStatus.REJECTED])
        
        # Contar por tipo
        observations_by_type = {}
        for obs in user_observations:
            obs_type = obs.observation_type.value if hasattr(obs.observation_type, 'value') else str(obs.observation_type)
            observations_by_type[obs_type] = observations_by_type.get(obs_type, 0) + 1
        
        # Observações recentes (últimos N dias)
        days_filter = days if days else 7
        from datetime import datetime, timedelta
        days_ago = datetime.utcnow() - timedelta(days=days_filter)
        recent = len([obs for obs in user_observations if obs.created_at >= days_ago])
        
        return ObservationStats(
            total_observations=total,
            pending_observations=pending,
            validated_observations=validated,
            rejected_observations=rejected,
            observations_by_type=observations_by_type,
            recent_observations=recent
        )
    
    def _get_mock_observations(self) -> List[Observation]:
        """Retorna observações mockadas para desenvolvimento"""
        from datetime import datetime
        
        return [
            Observation(
                id="obs-1",
                user_id="mock-user-id",
                title="Vegetação ciliar em bom estado",
                description="Vegetação ciliar em bom estado, com presença de espécies nativas.",
                observation_type="vegetation_health",
                latitude=-23.5873,
                longitude=-46.6573,
                location_name="Parque Ibirapuera, São Paulo, SP",
                tags=["vegetação", "ciliar", "nativas"],
                metadata={},
                status="validated",
                images=["https://example.com/photo1.jpg"],
                validation_count=5,
                confirmed_validations=4,
                disputed_validations=1,
                created_at=datetime(2024, 1, 15, 10, 30, 0),
                updated_at=datetime(2024, 1, 15, 10, 30, 0),
                user_name="João Silva",
                user_avatar=None,
                user_can_validate=False
            ),
            Observation(
                id="obs-2",
                user_id="maria-user-id",
                title="Poluição no Rio Tietê",
                description="Água com coloração escura e presença de lixo nas margens.",
                observation_type="water_quality",
                latitude=-22.9068,
                longitude=-47.0653,
                location_name="Rio Tietê, Campinas, SP",
                tags=["poluição", "água", "lixo"],
                metadata={},
                status="validated",
                images=["https://example.com/photo2.jpg"],
                validation_count=3,
                confirmed_validations=3,
                disputed_validations=0,
                created_at=datetime(2024, 1, 14, 14, 20, 0),
                updated_at=datetime(2024, 1, 14, 14, 20, 0),
                user_name="Maria Santos",
                user_avatar=None,
                user_can_validate=False
            ),
            Observation(
                id="obs-3",
                user_id="joao-user-id",
                title="Erosão nas margens do córrego",
                description="Erosão visível nas margens, necessita intervenção urgente.",
                observation_type="degradation",
                latitude=-23.5505,
                longitude=-46.6333,
                location_name="Córrego do Sapateiro, São Paulo, SP",
                tags=["erosão", "margens", "urgente"],
                metadata={},
                status="pending",
                images=["https://example.com/photo3.jpg"],
                validation_count=1,
                confirmed_validations=0,
                disputed_validations=1,
                created_at=datetime(2024, 1, 13, 9, 15, 0),
                updated_at=datetime(2024, 1, 13, 9, 15, 0),
                user_name="João Oliveira",
                user_avatar=None,
                user_can_validate=False
            )
        ]
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula distância entre duas coordenadas em km (fórmula de Haversine)"""
        import math
        R = 6371  # Raio da Terra em km
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat/2) * math.sin(dlat/2) + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon/2) * math.sin(dlon/2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = R * c
        
        return distance