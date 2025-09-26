from typing import Dict, Any, List, Optional
from datetime import date, datetime
from app.core.database import get_supabase_client
import logging

logger = logging.getLogger(__name__)


class NDVIHistoryService:
    """Serviço para gerenciar histórico de dados NDVI por município"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        if self.supabase is None:
            logger.warning("NDVIHistoryService: Supabase não disponível - modo desenvolvimento")
    
    async def save_ndvi_history(
        self,
        municipality_code: str,
        municipality_name: str,
        geometry: Dict[str, Any],
        ndvi_data: Dict[str, Any],
        start_date: date,
        end_date: date,
        acquisition_date: Optional[date] = None
    ) -> bool:
        """
        Salva dados NDVI no histórico do município
        
        Args:
            municipality_code: Código IBGE do município
            municipality_name: Nome do município
            geometry: GeoJSON da geometria do município
            ndvi_data: Dados NDVI retornados pelo serviço
            start_date: Data inicial do período analisado
            end_date: Data final do período analisado
            acquisition_date: Data de aquisição da imagem (default: end_date)
        
        Returns:
            bool: True se salvou com sucesso
        """
        try:
            # Verificar se Supabase está disponível
            if self.supabase is None:
                logger.warning(f"Supabase não disponível - não salvando histórico para {municipality_code}")
                return False
                
            if acquisition_date is None:
                acquisition_date = end_date
            
            # Extrair coordenadas do centro da geometria
            center_lat = None
            center_lon = None
            if geometry and "bbox" in geometry:
                bbox = geometry["bbox"]
                center_lat = (bbox[1] + bbox[3]) / 2
                center_lon = (bbox[0] + bbox[2]) / 2
            
            # Preparar dados para inserção
            history_record = {
                "municipality_code": municipality_code,
                "municipality_name": municipality_name,
                "center_latitude": center_lat,
                "center_longitude": center_lon,
                "ndvi_value": float(ndvi_data.get("current_ndvi", 0.0)),
                "average_ndvi": float(ndvi_data.get("average_ndvi", 0.0)),
                "min_ndvi": float(ndvi_data.get("min_ndvi", 0.0)),
                "max_ndvi": float(ndvi_data.get("max_ndvi", 0.0)),
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "acquisition_date": acquisition_date.isoformat(),
                "satellite": ndvi_data.get("satellite", "Sentinel-2"),
                "cloud_coverage": float(ndvi_data.get("cloud_coverage", 0.0)),
                "data_quality": ndvi_data.get("data_quality", "good"),
                "trend": ndvi_data.get("trend", "stable"),
                "vegetation_status": ndvi_data.get("vegetation_status", "moderate"),
                "max_cloud": int(ndvi_data.get("max_cloud", 30)),
                "superres": bool(ndvi_data.get("superres", False)),
                "data_source": ndvi_data.get("data_source", "sentinel_hub")
            }
            
            # Inserir no Supabase
            result = self.supabase.table("ndvi_history").insert(history_record).execute()
            
            if result.data:
                logger.info(f"Histórico NDVI salvo para município {municipality_code}")
                return True
            else:
                logger.warning(f"Falha ao salvar histórico NDVI para município {municipality_code}")
                return False
                
        except Exception as e:
            logger.error(f"Erro ao salvar histórico NDVI: {str(e)}")
            return False
    
    async def get_ndvi_history(
        self,
        municipality_code: str,
        days: int = 90,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Recupera histórico NDVI de um município
        
        Args:
            municipality_code: Código IBGE do município
            days: Número de dias para buscar (default: 90)
            limit: Limite de registros (default: 100)
        
        Returns:
            List[Dict]: Lista de registros históricos
        """
        try:
            # Verificar se Supabase está disponível
            if self.supabase is None:
                logger.warning(f"Supabase não disponível - retornando lista vazia para {municipality_code}")
                return []
                
            # Calcular data limite
            end_date = datetime.now().date()
            start_date = date.fromordinal(end_date.toordinal() - days)
            
            # Buscar registros
            result = (
                self.supabase.table("ndvi_history")
                .select("*")
                .eq("municipality_code", municipality_code)
                .gte("acquisition_date", start_date.isoformat())
                .lte("acquisition_date", end_date.isoformat())
                .order("acquisition_date", desc=True)
                .limit(limit)
                .execute()
            )
            
            return result.data if result.data else []
            
        except Exception as e:
            logger.error(f"Erro ao buscar histórico NDVI: {str(e)}")
            return []
    
    async def get_ndvi_trend_analysis(
        self,
        municipality_code: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Analisa tendência NDVI de um município
        
        Args:
            municipality_code: Código IBGE do município
            days: Período para análise (default: 30 dias)
        
        Returns:
            Dict: Análise de tendência
        """
        try:
            history = await self.get_ndvi_history(municipality_code, days)
            
            if not history:
                return {
                    "trend": "unknown",
                    "change_percentage": 0.0,
                    "status": "no_data",
                    "records_count": 0
                }
            
            # Calcular tendência simples
            recent_values = [float(record["ndvi_value"]) for record in history[:7]]  # Últimos 7 registros
            older_values = [float(record["ndvi_value"]) for record in history[7:14]]  # Registros anteriores
            
            if len(recent_values) >= 3 and len(older_values) >= 3:
                recent_avg = sum(recent_values) / len(recent_values)
                older_avg = sum(older_values) / len(older_values)
                
                change_percentage = ((recent_avg - older_avg) / older_avg) * 100 if older_avg > 0 else 0
                
                if change_percentage > 5:
                    trend = "improving"
                elif change_percentage < -5:
                    trend = "declining"
                else:
                    trend = "stable"
            else:
                trend = "stable"
                change_percentage = 0.0
            
            # Status baseado no último valor
            last_ndvi = float(history[0]["ndvi_value"])
            if last_ndvi >= 0.7:
                status = "excellent"
            elif last_ndvi >= 0.5:
                status = "good"
            elif last_ndvi >= 0.3:
                status = "moderate"
            elif last_ndvi >= 0.1:
                status = "poor"
            else:
                status = "critical"
            
            return {
                "trend": trend,
                "change_percentage": round(change_percentage, 2),
                "status": status,
                "last_ndvi": last_ndvi,
                "records_count": len(history),
                "period_days": days
            }
            
        except Exception as e:
            logger.error(f"Erro ao analisar tendência NDVI: {str(e)}")
            return {
                "trend": "error",
                "change_percentage": 0.0,
                "status": "error",
                "records_count": 0
            }
