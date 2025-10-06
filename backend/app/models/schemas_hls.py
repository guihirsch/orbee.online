#!/usr/bin/env python3
"""
HLS Analysis Points Schemas
Pydantic schemas for HLS analysis points data validation
"""

from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field, validator
from uuid import UUID

class HLSAnalysisPointBase(BaseModel):
    """Base schema for HLS analysis points"""
    point_id: str = Field(..., description="Unique point ID in format hls_point_<hash>")
    latitude: float = Field(..., ge=-90, le=90, description="Point latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Point longitude")
    ndvi_value: float = Field(..., ge=-1, le=1, description="NDVI value")
    severity: str = Field(..., description="Severity: critical, moderate, healthy")
    level: str = Field(..., description="Level: very_sparse, sparse, dense")
    distance_to_river_m: Optional[float] = Field(None, ge=0, description="Distance to river in meters")
    analysis_date: datetime = Field(..., description="Analysis date")
    data_source: str = Field("HLS", description="Data source")
    analysis_method: str = Field("real_ndvi_based", description="Analysis method")
    buffer_distance_m: int = Field(200, ge=0, description="Buffer distance in meters")
    cloud_coverage_max: int = Field(50, ge=0, le=100, description="Maximum cloud coverage")
    start_date: date = Field(..., description="Start date of analyzed period")
    end_date: date = Field(..., description="End date of analyzed period")
    status: str = Field("active", description="Point status: active, resolved, false_positive")
    
    @validator('point_id')
    def validate_point_id(cls, v):
        if not v.startswith('hls_point_'):
            raise ValueError('point_id must start with "hls_point_"')
        if len(v) < 20:  # hls_point_ + at least 12 characters from hash
            raise ValueError('point_id must have at least 20 characters')
        return v
    
    @validator('severity')
    def validate_severity(cls, v):
        allowed_values = ['critical', 'moderate', 'healthy']
        if v not in allowed_values:
            raise ValueError(f'severity must be one of the values: {allowed_values}')
        return v
    
    @validator('level')
    def validate_level(cls, v):
        allowed_values = ['very_sparse', 'sparse', 'dense']
        if v not in allowed_values:
            raise ValueError(f'level must be one of the values: {allowed_values}')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        allowed_values = ['active', 'resolved', 'false_positive']
        if v not in allowed_values:
            raise ValueError(f'status must be one of the values: {allowed_values}')
        return v

class HLSAnalysisPointCreate(HLSAnalysisPointBase):
    """Schema for creating HLS analysis points"""
    pass

class HLSAnalysisPointUpdate(BaseModel):
    """Schema for updating HLS analysis points"""
    status: Optional[str] = Field(None, description="Point status")
    is_validated: Optional[bool] = Field(None, description="Whether the point has been validated")
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None:
            allowed_values = ['active', 'resolved', 'false_positive']
            if v not in allowed_values:
                raise ValueError(f'status must be one of the values: {allowed_values}')
        return v

class HLSAnalysisPoint(HLSAnalysisPointBase):
    """Complete schema for HLS analysis points"""
    id: UUID
    is_validated: bool = False
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class HLSPointHistoryBase(BaseModel):
    """Base schema for HLS points history"""
    point_id: str = Field(..., description="Point ID")
    analysis_date: datetime = Field(..., description="Analysis date")
    ndvi_value: float = Field(..., ge=-1, le=1, description="NDVI value")
    severity: str = Field(..., description="Severity")
    level: str = Field(..., description="Level")
    ndvi_change: Optional[float] = Field(None, description="NDVI change")
    severity_change: Optional[str] = Field(None, description="Severity change")
    trend: Optional[str] = Field(None, description="Trend: improving, stable, declining")
    data_source: str = Field("HLS", description="Data source")
    analysis_method: str = Field("real_ndvi_based", description="Analysis method")
    cloud_coverage: Optional[float] = Field(None, ge=0, le=100, description="Cloud coverage")
    
    @validator('trend')
    def validate_trend(cls, v):
        if v is not None:
            allowed_values = ['improving', 'stable', 'declining']
            if v not in allowed_values:
                raise ValueError(f'trend must be one of the values: {allowed_values}')
        return v

class HLSPointHistoryCreate(HLSPointHistoryBase):
    """Schema for creating HLS points history"""
    pass

class HLSPointHistory(HLSPointHistoryBase):
    """Complete schema for HLS points history"""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class HLSPointWithHistory(HLSAnalysisPoint):
    """Schema for HLS point with history"""
    history: List[HLSPointHistory] = []

class HLSPointTrend(BaseModel):
    """Schema for point trend information"""
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
    """Schema for HLS analysis summary"""
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
