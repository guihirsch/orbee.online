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
    
    async def create_observation(self, observation_data: ObservationCreate, user_id: str) -> ObservationInDB:
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
                "location_name": observation_data.location_name,
                "tags": observation_data.tags or [],
                "metadata": observation_data.metadata or {},
                "images": observation_data.images or [],
                "status": ObservationStatus.PENDING.value,
                "validation_count": 0,
                "confirmed_validations": 0,
                "disputed_validations": 0
            }
            
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
                .or_(f"description.ilike.%{query}%,location.ilike.%{query}%")
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
                query_lower in obs.location.lower()) and
               (not observation_type or obs.observation_type == observation_type)
        ]
        
        return filtered[:limit]
    
    async def get_global_stats(self) -> Dict[str, Any]:
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
            
            total_count = total_response.count if total_response.count else 0
            validated_count = validated_response.count if validated_response.count else 0
            
            return {
                "total_observations": total_count,
                "validated_observations": validated_count,
                "validation_rate": validated_count / total_count if total_count > 0 else 0,
                "active_users": 0  # TODO: implementar contagem de usuários ativos
            }
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas globais: {e}")
            pass
        
        # Estatísticas mockadas para desenvolvimento
        mock_observations = self._get_mock_observations()
        total = len(mock_observations)
        validated = len([obs for obs in mock_observations if obs.is_validated])
        
        return {
            "total_observations": total,
            "validated_observations": validated,
            "validation_rate": validated / total if total > 0 else 0,
            "active_users": 15
        }
    
    def _get_mock_observations(self) -> List[Observation]:
        """Retorna observações mockadas para desenvolvimento"""
        return [
            Observation(
                id="obs-1",
                user_id="mock-user-id",
                location="Parque Ibirapuera, São Paulo, SP",
                latitude=-23.5873,
                longitude=-46.6573,
                observation_type="vegetation_health",
                description="Vegetação ciliar em bom estado, com presença de espécies nativas.",
                vegetation_health="good",
                photo_url="https://example.com/photo1.jpg",
                weather_conditions="sunny",
                created_at="2024-01-15T10:30:00Z",
                is_validated=True,
                validation_count=5,
                confidence_score=0.85
            ),
            Observation(
                id="obs-2",
                user_id="maria-user-id",
                location="Rio Tietê, Campinas, SP",
                latitude=-22.9068,
                longitude=-47.0653,
                observation_type="water_quality",
                description="Água com coloração escura e presença de lixo nas margens.",
                vegetation_health="poor",
                weather_conditions="cloudy",
                created_at="2024-01-14T14:20:00Z",
                is_validated=True,
                validation_count=3,
                confidence_score=0.75
            ),
            Observation(
                id="obs-3",
                user_id="joao-user-id",
                location="Córrego do Sapateiro, São Paulo, SP",
                latitude=-23.5505,
                longitude=-46.6333,
                observation_type="erosion",
                description="Erosão visível nas margens, necessita intervenção urgente.",
                vegetation_health="critical",
                weather_conditions="rainy",
                created_at="2024-01-13T09:15:00Z",
                is_validated=False,
                validation_count=1,
                confidence_score=0.6
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