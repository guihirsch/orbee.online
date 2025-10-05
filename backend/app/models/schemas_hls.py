#!/usr/bin/env python3
"""
HLS Analysis Points Schemas
Schemas Pydantic para validação de dados dos pontos de análise HLS
"""

from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field, validator
from uuid import UUID

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
    
    @validator('point_id')
    def validate_point_id(cls, v):
        if not v.startswith('hls_point_'):
            raise ValueError('point_id deve começar com "hls_point_"')
        if len(v) < 20:  # hls_point_ + pelo menos 12 caracteres do hash
            raise ValueError('point_id deve ter pelo menos 20 caracteres')
        return v
    
    @validator('severity')
    def validate_severity(cls, v):
        allowed_values = ['critical', 'moderate', 'healthy']
        if v not in allowed_values:
            raise ValueError(f'severity deve ser um dos valores: {allowed_values}')
        return v
    
    @validator('level')
    def validate_level(cls, v):
        allowed_values = ['very_sparse', 'sparse', 'dense']
        if v not in allowed_values:
            raise ValueError(f'level deve ser um dos valores: {allowed_values}')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        allowed_values = ['active', 'resolved', 'false_positive']
        if v not in allowed_values:
            raise ValueError(f'status deve ser um dos valores: {allowed_values}')
        return v

class HLSAnalysisPointCreate(HLSAnalysisPointBase):
    """Schema para criação de pontos de análise HLS"""
    pass

class HLSAnalysisPointUpdate(BaseModel):
    """Schema para atualização de pontos de análise HLS"""
    status: Optional[str] = Field(None, description="Status do ponto")
    is_validated: Optional[bool] = Field(None, description="Se o ponto foi validado")
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None:
            allowed_values = ['active', 'resolved', 'false_positive']
            if v not in allowed_values:
                raise ValueError(f'status deve ser um dos valores: {allowed_values}')
        return v

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
    
    @validator('trend')
    def validate_trend(cls, v):
        if v is not None:
            allowed_values = ['improving', 'stable', 'declining']
            if v not in allowed_values:
                raise ValueError(f'trend deve ser um dos valores: {allowed_values}')
        return v

class HLSPointHistoryCreate(HLSPointHistoryBase):
    """Schema para criação de histórico de pontos HLS"""
    pass

class HLSPointHistory(HLSPointHistoryBase):
    """Schema completo para histórico de pontos HLS"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class HLSPointWithHistory(HLSAnalysisPoint):
    """Schema para ponto HLS com histórico"""
    history: List[HLSPointHistory] = []

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
    analysis_date: datetime
    data_source: str
    analysis_method: str
    buffer_distance_m: int
    start_date: date
    end_date: date
    cloud_coverage_max: int
