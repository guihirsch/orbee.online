#!/usr/bin/env python3
"""
HLS Analysis Points Models
Modelos SQLAlchemy para pontos de análise HLS
"""

from sqlalchemy import Column, String, Float, Integer, DateTime, Date, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class HLSAnalysisPoint(Base):
    """Modelo para pontos de análise HLS"""
    
    __tablename__ = "hls_analysis_points"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    point_id = Column(String(50), unique=True, nullable=False, index=True)
    
    # Localização
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Dados da análise
    ndvi_value = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)
    level = Column(String(20), nullable=False)
    distance_to_river_m = Column(Float)
    
    # Metadados da análise
    analysis_date = Column(DateTime(timezone=True), nullable=False)
    data_source = Column(String(50), default='HLS')
    analysis_method = Column(String(50), default='real_ndvi_based')
    
    # Parâmetros da análise
    buffer_distance_m = Column(Integer, default=200)
    cloud_coverage_max = Column(Integer, default=50)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # Status do ponto
    status = Column(String(20), default='active')
    is_validated = Column(Boolean, default=False)
    
    # Metadados
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

class HLSPointHistory(Base):
    """Modelo para histórico temporal dos pontos HLS"""
    
    __tablename__ = "hls_point_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    point_id = Column(String(50), nullable=False, index=True)
    
    # Dados temporais
    analysis_date = Column(DateTime(timezone=True), nullable=False)
    ndvi_value = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)
    level = Column(String(20), nullable=False)
    
    # Mudanças detectadas
    ndvi_change = Column(Float)
    severity_change = Column(String(20))
    trend = Column(String(20))
    
    # Metadados da análise
    data_source = Column(String(50), default='HLS')
    analysis_method = Column(String(50), default='real_ndvi_based')
    cloud_coverage = Column(Float)
    
    # Metadados
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Índice único para evitar duplicatas
    __table_args__ = (
        {'extend_existing': True}
    )
