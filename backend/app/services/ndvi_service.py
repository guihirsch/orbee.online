from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
import numpy as np
from PIL import Image
import io
import base64

from app.models.schemas import NDVIDataPoint, NDVIRequest, NDVIResponse
from app.core.config import settings


class NDVIService:
    def __init__(self):
        self.sentinel_hub_url = "https://services.sentinel-hub.com/api/v1"
        self.client_id = settings.SENTINEL_HUB_CLIENT_ID
        self.client_secret = settings.SENTINEL_HUB_CLIENT_SECRET
        self._access_token = None
        self._token_expires_at = None
    
    async def _get_access_token(self) -> str:
        """Obtém token de acesso da API Sentinel Hub"""
        if self._access_token and self._token_expires_at and datetime.now() < self._token_expires_at:
            return self._access_token
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.sentinel_hub_url}/oauth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret
                    }
                )
                
                if response.status_code == 200:
                    token_data = response.json()
                    self._access_token = token_data["access_token"]
                    expires_in = token_data.get("expires_in", 3600)
                    self._token_expires_at = datetime.now() + timedelta(seconds=expires_in - 60)
                    return self._access_token
                else:
                    raise Exception(f"Erro ao obter token: {response.status_code}")
        except Exception as e:
            # Fallback para desenvolvimento sem API real
            return "mock_token_for_development"
    
    async def get_ndvi_data(self, request: NDVIRequest) -> NDVIResponse:
        """Obtém dados NDVI para uma área e período específicos"""
        try:
            # Tenta obter dados reais da API
            real_data = await self._fetch_real_ndvi_data(request)
            if real_data:
                return real_data
        except Exception as e:
            print(f"Erro ao buscar dados reais: {e}")
        
        # Fallback: dados mockados para desenvolvimento
        return await self._generate_mock_ndvi_data(request)
    
    async def _fetch_real_ndvi_data(self, request: NDVIRequest) -> Optional[NDVIResponse]:
        """Busca dados NDVI reais da API Sentinel Hub"""
        token = await self._get_access_token()
        
        # Calcula bbox expandida para a área
        bbox_size = 0.01  # ~1km
        bbox = [
            request.longitude - bbox_size,
            request.latitude - bbox_size,
            request.longitude + bbox_size,
            request.latitude + bbox_size
        ]
        
        # Configura período de busca
        end_date = request.end_date or datetime.now().date()
        start_date = request.start_date or (end_date - timedelta(days=90))
        
        # Payload para a API Sentinel Hub
        payload = {
            "input": {
                "bounds": {
                    "bbox": bbox,
                    "properties": {"crs": "http://www.opengis.net/def/crs/EPSG/0/4326"}
                },
                "data": [{
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": start_date.isoformat() + "T00:00:00Z",
                            "to": end_date.isoformat() + "T23:59:59Z"
                        },
                        "maxCloudCoverage": 30
                    }
                }]
            },
            "output": {
                "width": 100,
                "height": 100,
                "responses": [{
                    "identifier": "default",
                    "format": {"type": "image/tiff"}
                }]
            },
            "evalscript": """
                //VERSION=3
                function setup() {
                    return {
                        input: ["B04", "B08", "SCL"],
                        output: { bands: 1, sampleType: "FLOAT32" }
                    };
                }
                
                function evaluatePixel(sample) {
                    // Máscara de nuvens
                    if (sample.SCL == 3 || sample.SCL == 8 || sample.SCL == 9 || sample.SCL == 10 || sample.SCL == 11) {
                        return [NaN];
                    }
                    
                    // Cálculo NDVI
                    let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
                    return [ndvi];
                }
            """
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.sentinel_hub_url}/process",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    # Processa dados TIFF retornados
                    return await self._process_sentinel_response(response.content, request)
                else:
                    print(f"Erro na API Sentinel: {response.status_code}")
                    return None
        except Exception as e:
            print(f"Erro na requisição Sentinel: {e}")
            return None
    
    async def _process_sentinel_response(self, tiff_data: bytes, request: NDVIRequest) -> NDVIResponse:
        """Processa resposta TIFF da API Sentinel Hub"""
        try:
            # TODO: Implementar processamento real do TIFF com rasterio
            # Por enquanto, retorna dados mockados baseados na resposta
            return await self._generate_mock_ndvi_data(request)
        except Exception as e:
            print(f"Erro ao processar TIFF: {e}")
            return await self._generate_mock_ndvi_data(request)
    
    async def _generate_mock_ndvi_data(self, request: NDVIRequest) -> NDVIResponse:
        """Gera dados NDVI mockados para desenvolvimento"""
        # Simula variação sazonal e tendências
        base_ndvi = 0.6  # NDVI base para vegetação saudável
        
        # Fatores que influenciam NDVI
        seasonal_factor = self._get_seasonal_factor(datetime.now().month)
        location_factor = self._get_location_factor(request.latitude, request.longitude)
        
        current_ndvi = base_ndvi * seasonal_factor * location_factor
        current_ndvi = max(0.0, min(1.0, current_ndvi))  # Clamp entre 0 e 1
        
        # Gera série temporal
        end_date = request.end_date or datetime.now().date()
        start_date = request.start_date or (end_date - timedelta(days=90))
        
        time_series = []
        current_date = start_date
        
        while current_date <= end_date:
            # Simula variação temporal
            days_from_start = (current_date - start_date).days
            temporal_variation = np.sin(days_from_start * 0.1) * 0.1
            
            # Adiciona ruído realista
            noise = np.random.normal(0, 0.05)
            
            ndvi_value = current_ndvi + temporal_variation + noise
            ndvi_value = max(0.0, min(1.0, ndvi_value))
            
            time_series.append(NDVIDataPoint(
                date=current_date,
                ndvi_value=round(ndvi_value, 3),
                confidence=0.85,
                cloud_coverage=np.random.uniform(0, 30)
            ))
            
            current_date += timedelta(days=7)  # Dados semanais
        
        # Calcula estatísticas
        ndvi_values = [point.ndvi_value for point in time_series]
        
        # Determina status da vegetação
        avg_ndvi = np.mean(ndvi_values)
        if avg_ndvi > 0.7:
            vegetation_status = "excellent"
        elif avg_ndvi > 0.5:
            vegetation_status = "good"
        elif avg_ndvi > 0.3:
            vegetation_status = "moderate"
        elif avg_ndvi > 0.1:
            vegetation_status = "poor"
        else:
            vegetation_status = "critical"
        
        # Calcula tendência
        if len(ndvi_values) >= 2:
            recent_avg = np.mean(ndvi_values[-4:])  # Últimas 4 semanas
            older_avg = np.mean(ndvi_values[:4])    # Primeiras 4 semanas
            
            if recent_avg > older_avg + 0.05:
                trend = "improving"
            elif recent_avg < older_avg - 0.05:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        return NDVIResponse(
            location=f"Lat: {request.latitude}, Lon: {request.longitude}",
            time_series=time_series,
            current_ndvi=round(current_ndvi, 3),
            average_ndvi=round(avg_ndvi, 3),
            vegetation_status=vegetation_status,
            trend=trend,
            last_updated=datetime.now(),
            data_source="Sentinel-2 (Simulado)"
        )
    
    def _get_seasonal_factor(self, month: int) -> float:
        """Retorna fator sazonal para o NDVI (Hemisfério Sul)"""
        # Verão: Dez-Mar (meses 12, 1, 2, 3)
        # Outono: Mar-Jun (meses 3, 4, 5, 6)
        # Inverno: Jun-Set (meses 6, 7, 8, 9)
        # Primavera: Set-Dez (meses 9, 10, 11, 12)
        
        seasonal_factors = {
            1: 1.1,   # Janeiro - Verão
            2: 1.05,  # Fevereiro - Verão
            3: 1.0,   # Março - Outono
            4: 0.9,   # Abril - Outono
            5: 0.8,   # Maio - Outono
            6: 0.7,   # Junho - Inverno
            7: 0.65,  # Julho - Inverno
            8: 0.7,   # Agosto - Inverno
            9: 0.8,   # Setembro - Primavera
            10: 0.9,  # Outubro - Primavera
            11: 1.0,  # Novembro - Primavera
            12: 1.1   # Dezembro - Verão
        }
        
        return seasonal_factors.get(month, 1.0)
    
    def _get_location_factor(self, latitude: float, longitude: float) -> float:
        """Retorna fator baseado na localização (bioma, clima)"""
        # Simula diferentes biomas brasileiros
        
        # Amazônia (Norte)
        if latitude > -10:
            return 1.2  # Vegetação densa
        
        # Cerrado (Centro-Oeste)
        elif -20 < latitude <= -10:
            return 0.9  # Vegetação de savana
        
        # Mata Atlântica (Sudeste/Sul)
        elif latitude <= -20:
            return 1.0  # Vegetação moderada a densa
        
        return 1.0
    
    async def get_ndvi_alerts(self, latitude: float, longitude: float) -> List[Dict[str, Any]]:
        """Retorna alertas baseados em mudanças no NDVI"""
        # Simula alertas baseados em dados históricos
        alerts = []
        
        # Simula diferentes tipos de alertas
        alert_types = [
            {
                "type": "vegetation_decline",
                "severity": "medium",
                "message": "Declínio na vegetação detectado nas últimas 2 semanas",
                "recommendation": "Verificar possíveis causas: seca, pragas ou atividade humana"
            },
            {
                "type": "seasonal_change",
                "severity": "low",
                "message": "Mudança sazonal normal detectada",
                "recommendation": "Monitoramento contínuo recomendado"
            }
        ]
        
        # Retorna alertas aleatórios para demonstração
        import random
        if random.random() > 0.7:  # 30% de chance de ter alertas
            alerts.append(random.choice(alert_types))
        
        return alerts