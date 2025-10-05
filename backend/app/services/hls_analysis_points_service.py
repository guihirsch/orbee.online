#!/usr/bin/env python3
"""
HLS Analysis Points Service
Serviço para gerenciar pontos de análise HLS com IDs únicos
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

from app.core.database import get_db
from app.models.schemas import HLSAnalysisPoint, HLSPointHistory, HLSAnalysisPointCreate, HLSPointHistoryCreate

logger = logging.getLogger(__name__)

class HLSAnalysisPointsService:
    """Serviço para gerenciar pontos de análise HLS"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_analysis_point(self, point_data: HLSAnalysisPointCreate) -> HLSAnalysisPoint:
        """Cria um novo ponto de análise HLS"""
        try:
            # Verificar se o ponto já existe
            existing_point = self.get_point_by_id(point_data.point_id)
            if existing_point:
                logger.warning(f"Ponto HLS {point_data.point_id} já existe")
                return existing_point
            
            # Criar novo ponto
            db_point = HLSAnalysisPoint(
                point_id=point_data.point_id,
                latitude=point_data.latitude,
                longitude=point_data.longitude,
                ndvi_value=point_data.ndvi_value,
                severity=point_data.severity,
                level=point_data.level,
                distance_to_river_m=point_data.distance_to_river_m,
                analysis_date=point_data.analysis_date,
                data_source=point_data.data_source,
                analysis_method=point_data.analysis_method,
                buffer_distance_m=point_data.buffer_distance_m,
                cloud_coverage_max=point_data.cloud_coverage_max,
                start_date=point_data.start_date,
                end_date=point_data.end_date,
                status=point_data.status or 'active'
            )
            
            self.db.add(db_point)
            self.db.commit()
            self.db.refresh(db_point)
            
            logger.info(f"Ponto HLS {point_data.point_id} criado com sucesso")
            return db_point
            
        except Exception as e:
            logger.error(f"Erro ao criar ponto HLS {point_data.point_id}: {e}")
            self.db.rollback()
            raise
    
    def get_point_by_id(self, point_id: str) -> Optional[HLSAnalysisPoint]:
        """Busca um ponto pelo ID único"""
        try:
            return self.db.query(HLSAnalysisPoint).filter(
                HLSAnalysisPoint.point_id == point_id,
                HLSAnalysisPoint.deleted_at.is_(None)
            ).first()
        except Exception as e:
            logger.error(f"Erro ao buscar ponto HLS {point_id}: {e}")
            return None
    
    def get_points_by_severity(self, severity: str) -> List[HLSAnalysisPoint]:
        """Busca pontos por severidade"""
        try:
            return self.db.query(HLSAnalysisPoint).filter(
                HLSAnalysisPoint.severity == severity,
                HLSAnalysisPoint.deleted_at.is_(None),
                HLSAnalysisPoint.status == 'active'
            ).all()
        except Exception as e:
            logger.error(f"Erro ao buscar pontos por severidade {severity}: {e}")
            return []
    
    def get_points_in_area(self, min_lat: float, max_lat: float, 
                          min_lon: float, max_lon: float) -> List[HLSAnalysisPoint]:
        """Busca pontos em uma área geográfica"""
        try:
            return self.db.query(HLSAnalysisPoint).filter(
                HLSAnalysisPoint.latitude.between(min_lat, max_lat),
                HLSAnalysisPoint.longitude.between(min_lon, max_lon),
                HLSAnalysisPoint.deleted_at.is_(None),
                HLSAnalysisPoint.status == 'active'
            ).all()
        except Exception as e:
            logger.error(f"Erro ao buscar pontos na área: {e}")
            return []
    
    def add_point_history(self, point_id: str, history_data: HLSPointHistoryCreate) -> HLSPointHistory:
        """Adiciona entrada ao histórico temporal de um ponto"""
        try:
            # Verificar se o ponto existe
            point = self.get_point_by_id(point_id)
            if not point:
                raise ValueError(f"Ponto HLS {point_id} não encontrado")
            
            # Verificar se já existe histórico para esta data
            existing_history = self.db.query(HLSPointHistory).filter(
                HLSPointHistory.point_id == point_id,
                HLSPointHistory.analysis_date == history_data.analysis_date
            ).first()
            
            if existing_history:
                logger.warning(f"Histórico já existe para ponto {point_id} na data {history_data.analysis_date}")
                return existing_history
            
            # Criar nova entrada no histórico
            db_history = HLSPointHistory(
                point_id=point_id,
                analysis_date=history_data.analysis_date,
                ndvi_value=history_data.ndvi_value,
                severity=history_data.severity,
                level=history_data.level,
                ndvi_change=history_data.ndvi_change,
                severity_change=history_data.severity_change,
                trend=history_data.trend,
                data_source=history_data.data_source,
                analysis_method=history_data.analysis_method,
                cloud_coverage=history_data.cloud_coverage
            )
            
            self.db.add(db_history)
            self.db.commit()
            self.db.refresh(db_history)
            
            logger.info(f"Histórico adicionado para ponto HLS {point_id}")
            return db_history
            
        except Exception as e:
            logger.error(f"Erro ao adicionar histórico para ponto HLS {point_id}: {e}")
            self.db.rollback()
            raise
    
    def get_point_history(self, point_id: str) -> List[HLSPointHistory]:
        """Busca o histórico temporal de um ponto"""
        try:
            return self.db.query(HLSPointHistory).filter(
                HLSPointHistory.point_id == point_id
            ).order_by(HLSPointHistory.analysis_date.desc()).all()
        except Exception as e:
            logger.error(f"Erro ao buscar histórico do ponto HLS {point_id}: {e}")
            return []
    
    def update_point_status(self, point_id: str, status: str) -> bool:
        """Atualiza o status de um ponto"""
        try:
            point = self.get_point_by_id(point_id)
            if not point:
                return False
            
            point.status = status
            point.updated_at = datetime.now()
            
            self.db.commit()
            logger.info(f"Status do ponto HLS {point_id} atualizado para {status}")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao atualizar status do ponto HLS {point_id}: {e}")
            self.db.rollback()
            return False
    
    def get_points_with_trends(self) -> List[Dict[str, Any]]:
        """Busca pontos com informações de tendência"""
        try:
            query = text("""
                SELECT 
                    p.point_id,
                    p.latitude,
                    p.longitude,
                    p.ndvi_value,
                    p.severity,
                    p.level,
                    h.trend,
                    h.ndvi_change,
                    h.analysis_date as last_analysis_date
                FROM hls_analysis_points p
                LEFT JOIN LATERAL (
                    SELECT trend, ndvi_change, analysis_date
                    FROM hls_point_history h
                    WHERE h.point_id = p.point_id
                    ORDER BY h.analysis_date DESC
                    LIMIT 1
                ) h ON true
                WHERE p.deleted_at IS NULL 
                AND p.status = 'active'
                ORDER BY p.analysis_date DESC
            """)
            
            result = self.db.execute(query)
            return [dict(row._mapping) for row in result]
            
        except Exception as e:
            logger.error(f"Erro ao buscar pontos com tendências: {e}")
            return []
    
    def bulk_create_points(self, points_data: List[HLSAnalysisPointCreate]) -> int:
        """Cria múltiplos pontos em lote"""
        try:
            created_count = 0
            
            for point_data in points_data:
                # Verificar se já existe
                existing = self.get_point_by_id(point_data.point_id)
                if existing:
                    continue
                
                # Criar ponto
                db_point = HLSAnalysisPoint(
                    point_id=point_data.point_id,
                    latitude=point_data.latitude,
                    longitude=point_data.longitude,
                    ndvi_value=point_data.ndvi_value,
                    severity=point_data.severity,
                    level=point_data.level,
                    distance_to_river_m=point_data.distance_to_river_m,
                    analysis_date=point_data.analysis_date,
                    data_source=point_data.data_source,
                    analysis_method=point_data.analysis_method,
                    buffer_distance_m=point_data.buffer_distance_m,
                    cloud_coverage_max=point_data.cloud_coverage_max,
                    start_date=point_data.start_date,
                    end_date=point_data.end_date,
                    status=point_data.status or 'active'
                )
                
                self.db.add(db_point)
                created_count += 1
            
            self.db.commit()
            logger.info(f"{created_count} pontos HLS criados em lote")
            return created_count
            
        except Exception as e:
            logger.error(f"Erro ao criar pontos HLS em lote: {e}")
            self.db.rollback()
            return 0

def get_hls_analysis_points_service(db: Session = None) -> HLSAnalysisPointsService:
    """Factory function para criar instância do serviço"""
    if db is None:
        db = next(get_db())
    return HLSAnalysisPointsService(db)
