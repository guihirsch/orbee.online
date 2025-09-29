from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ObservationType(str, Enum):
    """Tipos de observação"""
    VEGETATION_HEALTH = "vegetation_health"
    WATER_QUALITY = "water_quality"
    DEFORESTATION = "deforestation"
    RESTORATION = "restoration"
    WILDLIFE = "wildlife"
    POLLUTION = "pollution"
    DEGRADATION = "degradation"
    OTHER = "other"


class ObservationStatus(str, Enum):
    """Status da observação"""
    PENDING = "pending"
    VALIDATED = "validated"
    REJECTED = "rejected"
    UNDER_REVIEW = "under_review"


class ValidationStatus(str, Enum):
    """Status da validação"""
    CONFIRMED = "confirmed"
    DISPUTED = "disputed"
    NEEDS_MORE_INFO = "needs_more_info"


class ObservationBase(BaseModel):
    """Modelo base para observações"""
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    observation_type: ObservationType
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_name: Optional[str] = Field(None, max_length=200)
    tags: Optional[List[str]] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

    @validator('tags')
    def validate_tags(cls, v):
        if v and len(v) > 10:
            raise ValueError('Máximo 10 tags permitidas')
        return v


class ObservationCreate(ObservationBase):
    """Modelo para criação de observação"""
    images: Optional[List[str]] = Field(default_factory=list, max_items=5)
    
    @validator('images')
    def validate_images(cls, v):
        if v and len(v) > 5:
            raise ValueError('Máximo 5 imagens permitidas')
        return v


class ObservationUpdate(BaseModel):
    """Modelo para atualização de observação"""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    observation_type: Optional[ObservationType] = None
    location_name: Optional[str] = Field(None, max_length=200)
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    images: Optional[List[str]] = None


class ObservationInDB(ObservationBase):
    """Modelo de observação no banco de dados"""
    id: str
    user_id: str
    status: ObservationStatus = ObservationStatus.PENDING
    images: List[str] = Field(default_factory=list)
    ndvi_value: Optional[float] = None
    ndvi_date: Optional[datetime] = None
    validation_count: int = 0
    validation_score: float = 0.0
    is_validated: bool = False
    created_at: datetime
    updated_at: datetime


class Observation(ObservationInDB):
    """Modelo completo de observação"""
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    distance_km: Optional[float] = None  # Distância do usuário atual
    user_can_validate: bool = False  # Se o usuário atual pode validar
    confirmed_validations: int = 0  # Computado das validações
    disputed_validations: int = 0  # Computado das validações


class ValidationBase(BaseModel):
    """Modelo base para validação"""
    observation_id: str
    status: ValidationStatus
    comment: Optional[str] = Field(None, max_length=1000)
    confidence_level: int = Field(..., ge=1, le=5)
    evidence_images: Optional[List[str]] = Field(default_factory=list, max_items=3)


class ValidationCreate(ValidationBase):
    """Modelo para criação de validação"""
    pass


class ValidationUpdate(BaseModel):
    """Modelo para atualização de validação"""
    status: Optional[ValidationStatus] = None
    comment: Optional[str] = Field(None, max_length=1000)
    confidence_level: Optional[int] = Field(None, ge=1, le=5)
    evidence_images: Optional[List[str]] = None


class ValidationInDB(ValidationBase):
    """Modelo de validação no banco de dados"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class Validation(ValidationInDB):
    """Modelo completo de validação"""
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    user_level: Optional[int] = None


class ObservationStats(BaseModel):
    """Estatísticas de observações"""
    total_observations: int
    pending_observations: int
    validated_observations: int
    rejected_observations: int
    observations_by_type: Dict[str, int]
    recent_observations: int  # Últimos 7 dias


class ValidationStats(BaseModel):
    """Estatísticas de validações"""
    total_validations: int
    confirmed_validations: int
    disputed_validations: int
    average_confidence: float
    validations_by_user: Dict[str, int]


class ObservationFilter(BaseModel):
    """Filtros para busca de observações"""
    observation_type: Optional[ObservationType] = None
    status: Optional[ObservationStatus] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = Field(None, ge=0.1, le=100)
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    user_id: Optional[str] = None
    tags: Optional[List[str]] = None
    has_images: Optional[bool] = None
    min_validations: Optional[int] = Field(None, ge=0)


class ObservationResponse(BaseModel):
    """Resposta com observações e metadados"""
    observations: List[Observation]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool


class NearbyObservation(BaseModel):
    """Observação próxima com distância"""
    id: str
    title: str
    observation_type: ObservationType
    status: ObservationStatus
    latitude: float
    longitude: float
    distance_km: float
    created_at: datetime
    validation_count: int
    user_name: Optional[str] = None