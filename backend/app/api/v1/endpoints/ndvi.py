from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi import Body
from fastapi.security import OAuth2PasswordBearer

from app.services.ndvi_history_service import NDVIHistoryService
from app.models.schemas import NDVIRequest, NDVIResponse, User
from app.services.ndvi_service import NDVIService
from app.api.deps import get_current_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_ndvi_service():
    """Dependency to get NDVI service"""
    return NDVIService()


@router.post("/data", response_model=NDVIResponse)
async def get_ndvi_data(
    request: NDVIRequest,
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets NDVI data for a specific location and period"""
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        return ndvi_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting NDVI data: {str(e)}"
        )

@router.post("/aoi")
async def get_ndvi_by_aoi(
    payload: dict = Body(...),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets NDVI by municipality (IBGE code) or AOI geometry (GeoJSON).
    Body example:
    {
      "municipality_code": "4320676",
      "geometry": { ...GeoJSON... },
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "max_cloud": 30,
      "superres": false
    }
    """
    try:
        result = await ndvi_service.get_ndvi_for_aoi(payload)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting NDVI by AOI: {str(e)}"
        )


@router.get("/data", response_model=NDVIResponse)
async def get_ndvi_data_by_coordinates(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets NDVI data using query parameters"""
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
            detail=f"Error getting NDVI data: {str(e)}"
        )


@router.get("/alerts")
async def get_ndvi_alerts(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets NDVI alerts for a location"""
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
            detail=f"Error getting NDVI alerts: {str(e)}"
        )


@router.get("/current")
async def get_current_ndvi(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets only the current NDVI value for a location"""
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
            detail=f"Error getting current NDVI: {str(e)}"
        )


@router.get("/timeseries")
async def get_ndvi_timeseries(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(90, ge=7, le=365, description="Number of days to search"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets NDVI time series for a location"""
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
            detail=f"Error getting NDVI time series: {str(e)}"
        )


@router.get("/health")
async def get_vegetation_health(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: User = Depends(get_current_user),
    ndvi_service: NDVIService = Depends(get_ndvi_service)
):
    """Gets vegetation health analysis for a location"""
    request = NDVIRequest(
        latitude=latitude,
        longitude=longitude
    )
    
    try:
        ndvi_data = await ndvi_service.get_ndvi_data(request)
        alerts = await ndvi_service.get_ndvi_alerts(latitude, longitude)
        
        # Health analysis based on NDVI
        health_analysis = {
            "overall_status": ndvi_data.vegetation_status,
            "current_ndvi": ndvi_data.current_ndvi,
            "average_ndvi": ndvi_data.average_ndvi,
            "trend": ndvi_data.trend,
            "health_score": min(100, int(ndvi_data.current_ndvi * 100)),
            "recommendations": [],
            "alerts": alerts
        }
        
        # Generate recommendations based on status
        if ndvi_data.vegetation_status == "critical":
            health_analysis["recommendations"].extend([
                "Urgent intervention required",
                "Check degradation causes",
                "Consider replanting or restoration"
            ])
        elif ndvi_data.vegetation_status == "poor":
            health_analysis["recommendations"].extend([
                "Intensive monitoring recommended",
                "Investigate possible stressors",
                "Implement conservation measures"
            ])
        elif ndvi_data.vegetation_status == "moderate":
            health_analysis["recommendations"].extend([
                "Maintain regular monitoring",
                "Consider sustainable management practices"
            ])
        else:
            health_analysis["recommendations"].extend([
                "Vegetation in good condition",
                "Continue current conservation practices"
            ])
        
        return health_analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing vegetation health: {str(e)}"
        )


@router.get("/history/{municipality_code}")
async def get_ndvi_history(
    municipality_code: str,
    days: int = Query(90, ge=7, le=365, description="Number of days to search"),
    limit: int = Query(100, ge=1, le=500, description="Record limit"),
    current_user: User = Depends(get_current_user)
):
    """Gets NDVI history for a municipality"""
    try:
        history_service = NDVIHistoryService()
        history = await history_service.get_ndvi_history(
            municipality_code=municipality_code,
            days=days,
            limit=limit
        )
        
        return {
            "municipality_code": municipality_code,
            "history": history,
            "records_count": len(history),
            "period_days": days,
            "last_updated": datetime.now().isoformat() + "Z"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting NDVI history: {str(e)}"
        )


@router.get("/trend/{municipality_code}")
async def get_ndvi_trend(
    municipality_code: str,
    days: int = Query(30, ge=7, le=90, description="Period for trend analysis"),
    current_user: User = Depends(get_current_user)
):
    """Gets NDVI trend analysis for a municipality"""
    try:
        history_service = NDVIHistoryService()
        trend_analysis = await history_service.get_ndvi_trend_analysis(
            municipality_code=municipality_code,
            days=days
        )
        
        return {
            "municipality_code": municipality_code,
            "trend_analysis": trend_analysis,
            "analysis_date": datetime.now().isoformat() + "Z"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing NDVI trend: {str(e)}"
        )