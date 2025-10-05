from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
from uuid import UUID


class ObservationType(str, Enum):
    VEGETATION = "vegetation"
    WATER = "water"
    WILDLIFE = "wildlife"
    POLLUTION = "pollution"
    OTHER = "other"


class HealthStatus(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    MODERATE = "moderate"
    POOR = "poor"
    CRITICAL = "critical"


# User Models
class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    location: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None


class User(UserBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True
    points: int = 0
    observations_count: int = 0
    validations_count: int = 0

    class Config:
        from_attributes = True


# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Observation Models
class ObservationBase(BaseModel):
    location: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=1000)
    observation_type: ObservationType
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    rating: Optional[int] = Field(None, ge=1, le=5)


class ObservationCreate(ObservationBase):
    pass


class ObservationUpdate(BaseModel):
    description: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class Observation(ObservationBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    verified: bool = False
    verification_count: int = 0
    images: List[str] = []

    class Config:
        from_attributes = True


# NDVI Data Models
class NDVIDataPoint(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    ndvi_value: float = Field(..., ge=-1, le=1)
    date: datetime
    health_status: HealthStatus


class NDVIRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    radius_km: Optional[float] = Field(1.0, ge=0.1, le=50)


class NDVIResponse(BaseModel):
    current_ndvi: float
    health_status: HealthStatus
    trend: str  # "increasing", "decreasing", "stable"
    last_update: datetime
    historical_data: List[NDVIDataPoint] = []


# Area Monitoring Models
class MonitoredAreaBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(..., ge=0.1, le=50)


class MonitoredAreaCreate(MonitoredAreaBase):
    pass


class MonitoredArea(MonitoredAreaBase):
    id: str
    user_id: str
    created_at: datetime
    is_active: bool = True
    alert_threshold: float = 0.3  # NDVI threshold for alerts

    class Config:
        from_attributes = True


# Recommendation Models
class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    priority: str  # "high", "medium", "low"
    category: str  # "preservation", "restoration", "monitoring"
    applicable_regions: List[str] = []
    created_at: datetime


# Notification Models
class NotificationPreferences(BaseModel):
    email_alerts: bool = True
    whatsapp_alerts: bool = False
    weekly_reports: bool = True
    community_updates: bool = True


class NotificationUpdate(BaseModel):
    email_alerts: Optional[bool] = None
    whatsapp_alerts: Optional[bool] = None
    weekly_reports: Optional[bool] = None
    community_updates: Optional[bool] = None


# Achievement Models
class Achievement(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    points_required: int
    category: str  # "observations", "validations", "monitoring"


class UserAchievement(BaseModel):
    achievement_id: str
    earned_at: datetime
    achievement: Achievement


# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True


# HLS Analysis Points Models
class HLSAnalysisPointBase(BaseModel):
    """Schema base para pontos de análise HLS"""
    point_id: str = Field(..., description="ID único do ponto no formato hls_point_<hash>")
    latitude: float = Field(..., ge=-90, le=90, description="Latitude do ponto")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude do ponto")
    ndvi_value: float = Field(..., ge=-1, le=1, description="Valor NDVI")
    severity: str = Field(..., description="Severidade: critical, moderate, healthy")
    level: str = Field(..., description="Nível: very_sparse, sparse, dense")
    distance_to_river_m: Optional[float] = Field(None, ge=0, description="Distância do rio em metros")
    analysis_date: datetime = Field(..., description="Data da análise")
    data_source: str = Field("HLS", description="Fonte dos dados")
    analysis_method: str = Field("real_ndvi_based", description="Método de análise")
    buffer_distance_m: int = Field(200, ge=0, description="Distância do buffer em metros")
    cloud_coverage_max: int = Field(50, ge=0, le=100, description="Cobertura de nuvens máxima")
    start_date: date = Field(..., description="Data de início do período analisado")
    end_date: date = Field(..., description="Data de fim do período analisado")
    status: str = Field("active", description="Status do ponto: active, resolved, false_positive")


class HLSAnalysisPointCreate(HLSAnalysisPointBase):
    """Schema para criação de pontos de análise HLS"""
    pass


class HLSAnalysisPointUpdate(BaseModel):
    """Schema para atualização de pontos de análise HLS"""
    status: Optional[str] = Field(None, description="Status do ponto")
    is_validated: Optional[bool] = Field(None, description="Se o ponto foi validado")


class HLSAnalysisPoint(HLSAnalysisPointBase):
    """Schema completo para pontos de análise HLS"""
    id: UUID
    is_validated: bool = False
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class HLSPointHistoryBase(BaseModel):
    """Schema base para histórico de pontos HLS"""
    point_id: str = Field(..., description="ID do ponto")
    analysis_date: datetime = Field(..., description="Data da análise")
    ndvi_value: float = Field(..., ge=-1, le=1, description="Valor NDVI")
    severity: str = Field(..., description="Severidade")
    level: str = Field(..., description="Nível")
    ndvi_change: Optional[float] = Field(None, description="Mudança no NDVI")
    severity_change: Optional[str] = Field(None, description="Mudança na severidade")
    trend: Optional[str] = Field(None, description="Tendência: improving, stable, declining")
    data_source: str = Field("HLS", description="Fonte dos dados")
    analysis_method: str = Field("real_ndvi_based", description="Método de análise")
    cloud_coverage: Optional[float] = Field(None, ge=0, le=100, description="Cobertura de nuvens")


class HLSPointHistoryCreate(HLSPointHistoryBase):
    """Schema para criação de histórico de pontos HLS"""
    pass


class HLSPointHistory(HLSPointHistoryBase):
    """Schema completo para histórico de pontos HLS"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class HLSPointTrend(BaseModel):
    """Schema para informações de tendência de um ponto"""
    point_id: str
    latitude: float
    longitude: float
    ndvi_value: float
    severity: str
    level: str
    trend: Optional[str]
    ndvi_change: Optional[float]
    last_analysis_date: datetime


class HLSAnalysisSummary(BaseModel):
    """Schema para resumo da análise HLS"""
    total_points: int
    critical_points: int
    moderate_points: int
    healthy_points: int
    analysis_date: Optional[datetime]
    data_source: str
    analysis_method: str
    buffer_distance_m: int
    start_date: Optional[date]
    end_date: Optional[date]
    cloud_coverage_max: int


class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int