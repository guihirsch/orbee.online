from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordBearer

from app.models.schemas import NDVIRequest, NDVIResponse, User
from app.services.ndvi_service import NDVIService
from app.api.deps import get_current_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_ndvi_service():
    """Dependency para obter o serviço NDVI"""
    return NDVIService()


@router.post("/data", response_model=NDVIResponse)
async def get_ndvi_data(
    request: NDVIRequest,
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém dados NDVI para uma localização e período específicos"""
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        return ndvi_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter dados NDVI: {str(e)}"
        )


@router.get("/data", response_model=NDVIResponse)
async def get_ndvi_data_by_coordinates(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: Optional[date] = Query(None, description="Data inicial (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Data final (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém dados NDVI usando parâmetros de query"""
    request = NDVIRequest(
        latitude=latitude,
        longitude=longitude,
        start_date=start_date,
        end_date=end_date
    )
    
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        return ndvi_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter dados NDVI: {str(e)}"
        )


@router.get("/alerts")
async def get_ndvi_alerts(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém alertas NDVI para uma localização"""
    try:
        alerts = await ndvi_service.get_ndvi_alerts(latitude, longitude)
        return {
            "location": f"Lat: {latitude}, Lon: {longitude}",
            "alerts": alerts,
            "alert_count": len(alerts),
            "last_check": datetime.now()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter alertas NDVI: {str(e)}"
        )


@router.get("/current")
async def get_current_ndvi(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém apenas o valor NDVI atual para uma localização"""
    request = NDVIRequest(
        latitude=latitude,
        longitude=longitude,
        start_date=datetime.now().date(),
        end_date=datetime.now().date()
    )
    
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        return {
            "location": ndvi_data.location,
            "current_ndvi": ndvi_data.current_ndvi,
            "vegetation_status": ndvi_data.vegetation_status,
            "last_updated": ndvi_data.last_updated,
            "data_source": ndvi_data.data_source
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter NDVI atual: {str(e)}"
        )


@router.get("/timeseries")
async def get_ndvi_timeseries(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(90, ge=7, le=365, description="Número de dias para buscar"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém série temporal NDVI para uma localização"""
    end_date = datetime.now().date()
    start_date = date.fromordinal(end_date.toordinal() - days)
    
    request = NDVIRequest(
        latitude=latitude,
        longitude=longitude,
        start_date=start_date,
        end_date=end_date
    )
    
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        return {
            "location": ndvi_data.location,
            "time_series": ndvi_data.time_series,
            "average_ndvi": ndvi_data.average_ndvi,
            "trend": ndvi_data.trend,
            "period": {
                "start_date": start_date,
                "end_date": end_date,
                "days": days
            },
            "data_source": ndvi_data.data_source
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao obter série temporal NDVI: {str(e)}"
        )


@router.get("/health")
async def get_vegetation_health(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Obtém análise de saúde da vegetação para uma localização"""
    request = NDVIRequest(
        latitude=latitude,
        longitude=longitude
    )
    
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        alerts = await ndvi_service.get_ndvi_alerts(latitude, longitude)
        
        # Análise de saúde baseada no NDVI
        health_analysis = {
            "overall_status": ndvi_data.vegetation_status,
            "current_ndvi": ndvi_data.current_ndvi,
            "average_ndvi": ndvi_data.average_ndvi,
            "trend": ndvi_data.trend,
            "health_score": min(100, int(ndvi_data.current_ndvi * 100)),
            "recommendations": [],
            "alerts": alerts
        }
        
        # Gera recomendações baseadas no status
        if ndvi_data.vegetation_status == "critical":
            health_analysis["recommendations"].extend([
                "Intervenção urgente necessária",
                "Verificar causas de degradação",
                "Considerar replantio ou restauração"
            ])
        elif ndvi_data.vegetation_status == "poor":
            health_analysis["recommendations"].extend([
                "Monitoramento intensivo recomendado",
                "Investigar possíveis estressores",
                "Implementar medidas de conservação"
            ])
        elif ndvi_data.vegetation_status == "moderate":
            health_analysis["recommendations"].extend([
                "Manter monitoramento regular",
                "Considerar práticas de manejo sustentável"
            ])
        else:
            health_analysis["recommendations"].extend([
                "Vegetação em bom estado",
                "Continuar práticas atuais de conservação"
            ])
        
        return health_analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao analisar saúde da vegetação: {str(e)}"
        )