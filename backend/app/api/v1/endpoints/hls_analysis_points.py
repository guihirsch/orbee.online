#!/usr/bin/env python3
"""
HLS Analysis Points Endpoints
Endpoints para gerenciar pontos de análise HLS
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.services.hls_analysis_points_service import get_hls_analysis_points_service, HLSAnalysisPointsService
from app.models.schemas_hls import (
    HLSAnalysisPoint, HLSAnalysisPointCreate, HLSAnalysisPointUpdate,
    HLSPointHistory, HLSPointHistoryCreate, HLSPointTrend, HLSAnalysisSummary
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/hls-analysis-points", tags=["HLS Analysis Points"])

@router.post("/", response_model=HLSAnalysisPoint)
async def create_analysis_point(
    point_data: HLSAnalysisPointCreate,
    db: Session = Depends(get_db)
):
    """Cria um novo ponto de análise HLS"""
    try:
        service = get_hls_analysis_points_service(db)
        return service.create_analysis_point(point_data)
    except Exception as e:
        logger.error(f"Erro ao criar ponto de análise HLS: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/bulk", response_model=dict)
async def bulk_create_analysis_points(
    points_data: List[HLSAnalysisPointCreate],
    db: Session = Depends(get_db)
):
    """Cria múltiplos pontos de análise HLS em lote"""
    try:
        service = get_hls_analysis_points_service(db)
        created_count = service.bulk_create_points(points_data)
        return {
            "message": f"{created_count} pontos criados com sucesso",
            "total_requested": len(points_data),
            "created_count": created_count,
            "skipped_count": len(points_data) - created_count
        }
    except Exception as e:
        logger.error(f"Erro ao criar pontos de análise HLS em lote: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/{point_id}", response_model=HLSAnalysisPoint)
async def get_analysis_point(
    point_id: str,
    db: Session = Depends(get_db)
):
    """Busca um ponto de análise HLS pelo ID único"""
    try:
        service = get_hls_analysis_points_service(db)
        point = service.get_point_by_id(point_id)
        if not point:
            raise HTTPException(status_code=404, detail="Ponto não encontrado")
        return point
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar ponto de análise HLS {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/", response_model=List[HLSAnalysisPoint])
async def get_analysis_points(
    severity: Optional[str] = Query(None, description="Filtrar por severidade"),
    min_lat: Optional[float] = Query(None, description="Latitude mínima"),
    max_lat: Optional[float] = Query(None, description="Latitude máxima"),
    min_lon: Optional[float] = Query(None, description="Longitude mínima"),
    max_lon: Optional[float] = Query(None, description="Longitude máxima"),
    db: Session = Depends(get_db)
):
    """Lista pontos de análise HLS com filtros opcionais"""
    try:
        service = get_hls_analysis_points_service(db)
        
        if severity:
            points = service.get_points_by_severity(severity)
        elif all(coord is not None for coord in [min_lat, max_lat, min_lon, max_lon]):
            points = service.get_points_in_area(min_lat, max_lat, min_lon, max_lon)
        else:
            # Se nenhum filtro específico, retornar pontos críticos por padrão
            points = service.get_points_by_severity("critical")
        
        return points
    except Exception as e:
        logger.error(f"Erro ao listar pontos de análise HLS: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/trends/", response_model=List[HLSPointTrend])
async def get_points_with_trends(
    db: Session = Depends(get_db)
):
    """Lista pontos de análise HLS com informações de tendência"""
    try:
        service = get_hls_analysis_points_service(db)
        trends = service.get_points_with_trends()
        return trends
    except Exception as e:
        logger.error(f"Erro ao buscar pontos com tendências: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.put("/{point_id}", response_model=HLSAnalysisPoint)
async def update_analysis_point(
    point_id: str,
    update_data: HLSAnalysisPointUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza um ponto de análise HLS"""
    try:
        service = get_hls_analysis_points_service(db)
        point = service.get_point_by_id(point_id)
        if not point:
            raise HTTPException(status_code=404, detail="Ponto não encontrado")
        
        # Atualizar campos fornecidos
        if update_data.status is not None:
            point.status = update_data.status
        if update_data.is_validated is not None:
            point.is_validated = update_data.is_validated
        
        db.commit()
        db.refresh(point)
        return point
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar ponto de análise HLS {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/{point_id}/history", response_model=HLSPointHistory)
async def add_point_history(
    point_id: str,
    history_data: HLSPointHistoryCreate,
    db: Session = Depends(get_db)
):
    """Adiciona entrada ao histórico temporal de um ponto"""
    try:
        service = get_hls_analysis_points_service(db)
        return service.add_point_history(point_id, history_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao adicionar histórico para ponto HLS {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/{point_id}/history", response_model=List[HLSPointHistory])
async def get_point_history(
    point_id: str,
    db: Session = Depends(get_db)
):
    """Busca o histórico temporal de um ponto"""
    try:
        service = get_hls_analysis_points_service(db)
        history = service.get_point_history(point_id)
        return history
    except Exception as e:
        logger.error(f"Erro ao buscar histórico do ponto HLS {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.patch("/{point_id}/status")
async def update_point_status(
    point_id: str,
    status: str,
    db: Session = Depends(get_db)
):
    """Atualiza o status de um ponto"""
    try:
        service = get_hls_analysis_points_service(db)
        success = service.update_point_status(point_id, status)
        if not success:
            raise HTTPException(status_code=404, detail="Ponto não encontrado")
        
        return {"message": f"Status do ponto {point_id} atualizado para {status}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar status do ponto HLS {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/summary/", response_model=HLSAnalysisSummary)
async def get_analysis_summary(
    db: Session = Depends(get_db)
):
    """Retorna resumo da análise HLS"""
    try:
        service = get_hls_analysis_points_service(db)
        
        # Buscar estatísticas básicas
        critical_points = service.get_points_by_severity("critical")
        moderate_points = service.get_points_by_severity("moderate")
        healthy_points = service.get_points_by_severity("healthy")
        
        total_points = len(critical_points) + len(moderate_points) + len(healthy_points)
        
        # Usar dados do primeiro ponto para metadados (assumindo que todos têm os mesmos parâmetros)
        if critical_points:
            first_point = critical_points[0]
            return HLSAnalysisSummary(
                total_points=total_points,
                critical_points=len(critical_points),
                moderate_points=len(moderate_points),
                healthy_points=len(healthy_points),
                analysis_date=first_point.analysis_date,
                data_source=first_point.data_source,
                analysis_method=first_point.analysis_method,
                buffer_distance_m=first_point.buffer_distance_m,
                start_date=first_point.start_date,
                end_date=first_point.end_date,
                cloud_coverage_max=first_point.cloud_coverage_max
            )
        else:
            # Retornar valores padrão se não houver pontos
            return HLSAnalysisSummary(
                total_points=0,
                critical_points=0,
                moderate_points=0,
                healthy_points=0,
                analysis_date=None,
                data_source="HLS",
                analysis_method="real_ndvi_based",
                buffer_distance_m=200,
                start_date=None,
                end_date=None,
                cloud_coverage_max=50
            )
    except Exception as e:
        logger.error(f"Erro ao gerar resumo da análise HLS: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
