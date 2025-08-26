from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class ValidationStatus(str, Enum):
    """Status da validação"""
    CONFIRMED = "confirmed"
    DISPUTED = "disputed"
    PENDING = "pending"


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


class ValidationStats(BaseModel):
    """Estatísticas de validações"""
    total_validations: int
    confirmed_validations: int
    disputed_validations: int
    average_confidence: float
    validations_by_user: Dict[str, int]


class ValidationSummary(BaseModel):
    """Resumo geral das validações"""
    total_validations: int
    recent_validations: int  # Últimos 7 dias
    confirmed_percentage: float
    disputed_percentage: float
    average_confidence: float
    top_validators: List[Dict[str, Any]]  # Top 5 validadores
    validation_trends: Dict[str, int]  # Validações por dia nos últimos 7 dias