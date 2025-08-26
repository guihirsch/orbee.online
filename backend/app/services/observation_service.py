from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import logging
from math import radians, cos, sin, asin, sqrt

from app.models.observation import (
    Observation,
    ObservationCreate,
    ObservationUpdate,
    ObservationFilter,
    ObservationResponse,
    ObservationStats,
    NearbyObservation,
    ObservationType,
    ObservationStatus
)
from app.repositories.observation_repository import ObservationRepository
from app.repositories.validation_repository import ValidationRepository
from app.core.exceptions import (
    ObservationNotFoundError,
    ValidationError,
    DatabaseError
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class ObservationService:
    """Serviço para lógica de negócio das observações"""
    
    def __init__(
        self, 
        observation_repo: ObservationRepository,
        validation_repo: ValidationRepository
    ):
        self.observation_repo = observation_repo
        self.validation_repo = validation_repo
    
    async def create_observation(
        self, 
        observation_data: ObservationCreate, 
        user_id: str
    ) -> Observation:
        """Cria nova observação"""
        try:
            # Validar dados específicos
            await self._validate_observation_data(observation_data)
            
            # Verificar se há observações muito próximas (evitar spam)
            nearby_obs = await self.get_nearby_observations(
                lat=observation_data.latitude,
                lon=observation_data.longitude,
                radius_km=0.1,  # 100 metros
                user_id=user_id
            )
            
            # Permitir apenas uma observação por usuário em raio de 100m nas últimas 24h
            recent_nearby = [
                obs for obs in nearby_obs 
                if obs.user_id == user_id and 
                (datetime.utcnow() - obs.created_at).total_seconds() < 86400  # 24h
            ]
            
            if recent_nearby:
                raise ValidationError(
                    "Você já criou uma observação próxima nas últimas 24 horas"
                )
            
            observation = await self.observation_repo.create_observation(
                observation_data, user_id
            )
            
            logger.info(f"Observação criada: {observation.id} por usuário {user_id}")
            return observation
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao criar observação: {e}")
            raise DatabaseError(f"Erro ao criar observação: {str(e)}")
    
    async def get_observation_by_id(
        self, 
        observation_id: str, 
        user_id: Optional[str] = None
    ) -> Observation:
        """Busca observação por ID"""
        try:
            observation = await self.observation_repo.get_observation_by_id(
                observation_id, user_id
            )
            
            # Buscar validações da observação
            validations = await self.validation_repo.get_validations_by_observation(
                observation_id
            )
            
            # Adicionar validações ao objeto observação
            observation.validations = validations
            
            return observation
            
        except ObservationNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar observação {observation_id}: {e}")
            raise DatabaseError(f"Erro ao buscar observação: {str(e)}")
    
    async def get_observations(
        self,
        filters: ObservationFilter,
        user_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> ObservationResponse:
        """Busca observações com filtros"""
        try:
            observations = await self.observation_repo.get_observations(
                filters=filters,
                user_id=user_id,
                skip=skip,
                limit=limit
            )
            
            # Contar total para paginação
            total = await self.observation_repo.count_observations(filters)
            
            return ObservationResponse(
                observations=observations,
                total=total,
                skip=skip,
                limit=limit,
                has_next=skip + limit < total
            )
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações: {e}")
            raise DatabaseError(f"Erro ao buscar observações: {str(e)}")
    
    async def get_nearby_observations(
        self,
        lat: float,
        lon: float,
        radius_km: float = 5.0,
        user_id: Optional[str] = None,
        limit: int = 10
    ) -> List[NearbyObservation]:
        """Busca observações próximas a uma localização"""
        try:
            observations = await self.observation_repo.get_observations_by_location(
                lat=lat,
                lon=lon,
                radius_km=radius_km,
                limit=limit
            )
            
            nearby_observations = []
            for obs in observations:
                distance = self._calculate_distance(lat, lon, obs.latitude, obs.longitude)
                
                nearby_obs = NearbyObservation(
                    **obs.dict(),
                    distance_km=round(distance, 2)
                )
                nearby_observations.append(nearby_obs)
            
            # Ordenar por distância
            nearby_observations.sort(key=lambda x: x.distance_km)
            
            return nearby_observations
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações próximas: {e}")
            raise DatabaseError(f"Erro ao buscar observações próximas: {str(e)}")
    
    async def update_observation(
        self,
        observation_id: str,
        observation_data: ObservationUpdate,
        user_id: str
    ) -> Observation:
        """Atualiza observação (apenas o autor pode atualizar)"""
        try:
            # Verificar se a observação existe e pertence ao usuário
            existing = await self.get_observation_by_id(observation_id, user_id)
            if existing.user_id != user_id:
                raise ValidationError("Apenas o autor pode atualizar a observação")
            
            # Validar novos dados se fornecidos
            if observation_data.dict(exclude_unset=True):
                await self._validate_observation_update(observation_data)
            
            observation = await self.observation_repo.update_observation(
                observation_id, observation_data
            )
            
            logger.info(f"Observação atualizada: {observation_id} por usuário {user_id}")
            return observation
            
        except (ObservationNotFoundError, ValidationError):
            raise
        except Exception as e:
            logger.error(f"Erro ao atualizar observação {observation_id}: {e}")
            raise DatabaseError(f"Erro ao atualizar observação: {str(e)}")
    
    async def delete_observation(self, observation_id: str, user_id: str) -> bool:
        """Remove observação (apenas o autor pode remover)"""
        try:
            # Verificar se a observação existe e pertence ao usuário
            existing = await self.get_observation_by_id(observation_id, user_id)
            if existing.user_id != user_id:
                raise ValidationError("Apenas o autor pode remover a observação")
            
            success = await self.observation_repo.delete_observation(observation_id)
            
            if success:
                logger.info(f"Observação removida: {observation_id} por usuário {user_id}")
            
            return success
            
        except (ObservationNotFoundError, ValidationError):
            raise
        except Exception as e:
            logger.error(f"Erro ao remover observação {observation_id}: {e}")
            raise DatabaseError(f"Erro ao remover observação: {str(e)}")
    
    async def get_user_observations(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> ObservationResponse:
        """Busca observações de um usuário específico"""
        try:
            observations = await self.observation_repo.get_observations_by_user(
                user_id=user_id,
                skip=skip,
                limit=limit
            )
            
            # Contar total do usuário
            filters = ObservationFilter(user_id=user_id)
            total = await self.observation_repo.count_observations(filters)
            
            return ObservationResponse(
                observations=observations,
                total=total,
                skip=skip,
                limit=limit,
                has_next=skip + limit < total
            )
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações do usuário {user_id}: {e}")
            raise DatabaseError(f"Erro ao buscar observações do usuário: {str(e)}")
    
    async def get_recent_observations(
        self,
        days: int = 7,
        limit: int = 20
    ) -> List[Observation]:
        """Busca observações recentes"""
        try:
            since_date = datetime.utcnow() - timedelta(days=days)
            
            observations = await self.observation_repo.get_recent_observations(
                since_date=since_date,
                limit=limit
            )
            
            return observations
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações recentes: {e}")
            raise DatabaseError(f"Erro ao buscar observações recentes: {str(e)}")
    
    async def get_validated_observations(
        self,
        skip: int = 0,
        limit: int = 20
    ) -> ObservationResponse:
        """Busca observações validadas pela comunidade"""
        try:
            filters = ObservationFilter(status=ObservationStatus.VALIDATED)
            
            return await self.get_observations(
                filters=filters,
                skip=skip,
                limit=limit
            )
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações validadas: {e}")
            raise DatabaseError(f"Erro ao buscar observações validadas: {str(e)}")
    
    async def get_observation_stats(
        self,
        user_id: Optional[str] = None,
        days: Optional[int] = None
    ) -> ObservationStats:
        """Obtém estatísticas de observações"""
        try:
            stats = await self.observation_repo.get_observation_stats(
                user_id=user_id,
                days=days
            )
            
            return stats
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas de observações: {e}")
            raise DatabaseError(f"Erro ao obter estatísticas: {str(e)}")
    
    async def search_observations(
        self,
        query: str,
        user_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> ObservationResponse:
        """Busca observações por texto"""
        try:
            observations = await self.observation_repo.search_observations(
                query=query,
                skip=skip,
                limit=limit
            )
            
            # Para busca, não temos contagem total precisa
            return ObservationResponse(
                observations=observations,
                total=len(observations),
                skip=skip,
                limit=limit,
                has_next=len(observations) == limit
            )
            
        except Exception as e:
            logger.error(f"Erro ao buscar observações por texto: {e}")
            raise DatabaseError(f"Erro na busca: {str(e)}")
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula distância entre dois pontos usando fórmula de Haversine"""
        # Converter para radianos
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        
        # Fórmula de Haversine
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        
        # Raio da Terra em km
        r = 6371
        
        return c * r
    
    async def _validate_observation_data(self, observation_data: ObservationCreate):
        """Valida dados da observação"""
        # Validar coordenadas
        if not (-90 <= observation_data.latitude <= 90):
            raise ValidationError("Latitude deve estar entre -90 e 90")
        
        if not (-180 <= observation_data.longitude <= 180):
            raise ValidationError("Longitude deve estar entre -180 e 180")
        
        # Validar título
        if len(observation_data.title.strip()) < 3:
            raise ValidationError("Título deve ter pelo menos 3 caracteres")
        
        # Validar descrição
        if len(observation_data.description.strip()) < 10:
            raise ValidationError("Descrição deve ter pelo menos 10 caracteres")
        
        # Validar imagens (máximo 5)
        if observation_data.images and len(observation_data.images) > 5:
            raise ValidationError("Máximo de 5 imagens por observação")
        
        # Validar tags (máximo 10)
        if observation_data.tags and len(observation_data.tags) > 10:
            raise ValidationError("Máximo de 10 tags por observação")
    
    async def _validate_observation_update(self, observation_data: ObservationUpdate):
        """Valida dados de atualização da observação"""
        # Validar título se fornecido
        if observation_data.title and len(observation_data.title.strip()) < 3:
            raise ValidationError("Título deve ter pelo menos 3 caracteres")
        
        # Validar descrição se fornecida
        if observation_data.description and len(observation_data.description.strip()) < 10:
            raise ValidationError("Descrição deve ter pelo menos 10 caracteres")
        
        # Validar imagens se fornecidas
        if observation_data.images and len(observation_data.images) > 5:
            raise ValidationError("Máximo de 5 imagens por observação")
        
        # Validar tags se fornecidas
        if observation_data.tags and len(observation_data.tags) > 10:
            raise ValidationError("Máximo de 10 tags por observação")