from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
from supabase import Client

from app.models.schemas import Recommendation
from app.core.exceptions import DatabaseError

logger = logging.getLogger(__name__)


class RecommendationService:
    """Serviço para lógica de negócio das recomendações"""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.recommendations_table = "recommendations"
    
    async def get_recommendations(
        self,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        ndvi_value: Optional[float] = None,
        biome: Optional[str] = None,
        target_audience: Optional[str] = None,
        limit: int = 10
    ) -> List[Recommendation]:
        """Busca recomendações baseadas em critérios"""
        try:
            query = self.supabase.table(self.recommendations_table).select("*")
            
            # Filtrar por valor NDVI se fornecido
            if ndvi_value is not None:
                query = query.lte("min_ndvi", ndvi_value).gte("max_ndvi", ndvi_value)
            
            # Filtrar por bioma se fornecido
            if biome:
                query = query.eq("biome", biome)
            
            # Filtrar por público-alvo se fornecido
            if target_audience:
                query = query.eq("target_audience", target_audience)
            
            # Ordenar por prioridade e efetividade
            query = query.order("priority", desc=True).order("effectiveness_score", desc=True)
            
            # Limitar resultados
            query = query.limit(limit)
            
            result = query.execute()
            
            recommendations = []
            for rec_data in result.data:
                # Converter action_items de JSON string para lista
                action_items = rec_data.get("action_items", [])
                if isinstance(action_items, str):
                    import json
                    try:
                        action_items = json.loads(action_items)
                    except json.JSONDecodeError:
                        action_items = []
                
                recommendation = Recommendation(
                    id=rec_data["id"],
                    title=rec_data["title"],
                    description=rec_data["description"],
                    priority=str(rec_data["priority"]),
                    category=rec_data["recommendation_type"],
                    applicable_regions=action_items,  # Usando action_items como regiões aplicáveis
                    created_at=datetime.fromisoformat(rec_data["created_at"].replace("Z", "+00:00"))
                )
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Erro ao buscar recomendações: {e}")
            raise DatabaseError(f"Erro ao buscar recomendações: {str(e)}")
    
    async def get_personalized_recommendations(
        self,
        user_id: str,
        latitude: float,
        longitude: float,
        ndvi_value: Optional[float] = None,
        limit: int = 5
    ) -> List[Recommendation]:
        """Busca recomendações personalizadas para um usuário"""
        try:
            # Determinar bioma baseado na localização (simplificado)
            biome = await self._determine_biome(latitude, longitude)
            
            # Determinar público-alvo baseado no perfil do usuário (simplificado)
            target_audience = "citizen"  # Padrão
            
            # Buscar recomendações
            recommendations = await self.get_recommendations(
                latitude=latitude,
                longitude=longitude,
                ndvi_value=ndvi_value,
                biome=biome,
                target_audience=target_audience,
                limit=limit
            )
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Erro ao buscar recomendações personalizadas: {e}")
            raise DatabaseError(f"Erro ao buscar recomendações personalizadas: {str(e)}")
    
    async def get_recommendations_by_ndvi(
        self,
        ndvi_value: float,
        biome: Optional[str] = None,
        target_audience: str = "citizen",
        limit: int = 5
    ) -> List[Recommendation]:
        """Busca recomendações baseadas no valor NDVI"""
        try:
            return await self.get_recommendations(
                ndvi_value=ndvi_value,
                biome=biome,
                target_audience=target_audience,
                limit=limit
            )
            
        except Exception as e:
            logger.error(f"Erro ao buscar recomendações por NDVI: {e}")
            raise DatabaseError(f"Erro ao buscar recomendações por NDVI: {str(e)}")
    
    async def get_categories(self) -> List[str]:
        """Lista todas as categorias de recomendações"""
        try:
            result = self.supabase.table(self.recommendations_table).select(
                "recommendation_type"
            ).execute()
            
            categories = list(set(rec["recommendation_type"] for rec in result.data))
            return sorted(categories)
            
        except Exception as e:
            logger.error(f"Erro ao buscar categorias: {e}")
            raise DatabaseError(f"Erro ao buscar categorias: {str(e)}")
    
    async def get_biomes(self) -> List[str]:
        """Lista todos os biomas disponíveis"""
        try:
            result = self.supabase.table(self.recommendations_table).select(
                "biome"
            ).execute()
            
            biomes = list(set(rec["biome"] for rec in result.data if rec["biome"]))
            return sorted(biomes)
            
        except Exception as e:
            logger.error(f"Erro ao buscar biomas: {e}")
            raise DatabaseError(f"Erro ao buscar biomas: {str(e)}")
    
    async def get_target_audiences(self) -> List[str]:
        """Lista todos os públicos-alvo disponíveis"""
        try:
            result = self.supabase.table(self.recommendations_table).select(
                "target_audience"
            ).execute()
            
            audiences = list(set(rec["target_audience"] for rec in result.data))
            return sorted(audiences)
            
        except Exception as e:
            logger.error(f"Erro ao buscar públicos-alvo: {e}")
            raise DatabaseError(f"Erro ao buscar públicos-alvo: {str(e)}")
    
    async def _determine_biome(self, latitude: float, longitude: float) -> str:
        """Determina o bioma baseado na localização (implementação simplificada)"""
        # Implementação simplificada baseada em coordenadas
        # Em uma implementação real, isso seria feito com dados geoespaciais
        
        if -33.0 <= latitude <= 5.0 and -73.0 <= longitude <= -34.0:
            # Região do Brasil
            if latitude > -15.0:
                if longitude > -50.0:
                    return "cerrado"
                else:
                    return "amazonia"
            else:
                if longitude > -50.0:
                    return "mata_atlantica"
                else:
                    return "cerrado"
        
        return "cerrado"  # Padrão
    
    def get_health_recommendations(self, ndvi_value: float) -> List[str]:
        """Gera recomendações baseadas na saúde da vegetação (método síncrono para compatibilidade)"""
        if ndvi_value > 0.7:
            return [
                "Vegetação em excelente estado",
                "Continue o monitoramento regular",
                "Considere expandir a área de conservação"
            ]
        elif ndvi_value > 0.5:
            return [
                "Vegetação em bom estado",
                "Monitore mudanças sazonais",
                "Mantenha práticas de conservação"
            ]
        elif ndvi_value > 0.3:
            return [
                "Vegetação com sinais de estresse",
                "Investigue possíveis causas",
                "Considere ações de recuperação"
            ]
        else:
            return [
                "Vegetação em estado crítico",
                "Ação imediata necessária",
                "Consulte especialistas locais"
            ]