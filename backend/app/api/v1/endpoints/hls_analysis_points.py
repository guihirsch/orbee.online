#!/usr/bin/env python3
"""
HLS Analysis Points Endpoints
Endpoints for managing HLS analysis points
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
    """Creates a new HLS analysis point"""
    try:
        service = get_hls_analysis_points_service(db)
        return service.create_analysis_point(point_data)
    except Exception as e:
        logger.error(f"Error creating HLS analysis point: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/bulk", response_model=dict)
async def bulk_create_analysis_points(
    points_data: List[HLSAnalysisPointCreate],
    db: Session = Depends(get_db)
):
    """Creates multiple HLS analysis points in batch"""
    try:
        service = get_hls_analysis_points_service(db)
        created_count = service.bulk_create_points(points_data)
        return {
            "message": f"{created_count} points created successfully",
            "total_requested": len(points_data),
            "created_count": created_count,
            "skipped_count": len(points_data) - created_count
        }
    except Exception as e:
        logger.error(f"Error creating HLS analysis points in batch: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{point_id}", response_model=HLSAnalysisPoint)
async def get_analysis_point(
    point_id: str,
    db: Session = Depends(get_db)
):
    """Gets an HLS analysis point by unique ID"""
    try:
        service = get_hls_analysis_points_service(db)
        point = service.get_point_by_id(point_id)
        if not point:
            raise HTTPException(status_code=404, detail="Point not found")
        return point
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting HLS analysis point {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/", response_model=List[HLSAnalysisPoint])
async def get_analysis_points(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    min_lat: Optional[float] = Query(None, description="Minimum latitude"),
    max_lat: Optional[float] = Query(None, description="Maximum latitude"),
    min_lon: Optional[float] = Query(None, description="Minimum longitude"),
    max_lon: Optional[float] = Query(None, description="Maximum longitude"),
    db: Session = Depends(get_db)
):
    """Lists HLS analysis points with optional filters"""
    try:
        service = get_hls_analysis_points_service(db)
        
        if severity:
            points = service.get_points_by_severity(severity)
        elif all(coord is not None for coord in [min_lat, max_lat, min_lon, max_lon]):
            points = service.get_points_in_area(min_lat, max_lat, min_lon, max_lon)
        else:
            # If no specific filter, return critical points by default
            points = service.get_points_by_severity("critical")
        
        return points
    except Exception as e:
        logger.error(f"Error listing HLS analysis points: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/trends/", response_model=List[HLSPointTrend])
async def get_points_with_trends(
    db: Session = Depends(get_db)
):
    """Lists HLS analysis points with trend information"""
    try:
        service = get_hls_analysis_points_service(db)
        trends = service.get_points_with_trends()
        return trends
    except Exception as e:
        logger.error(f"Error getting points with trends: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{point_id}", response_model=HLSAnalysisPoint)
async def update_analysis_point(
    point_id: str,
    update_data: HLSAnalysisPointUpdate,
    db: Session = Depends(get_db)
):
    """Updates an HLS analysis point"""
    try:
        service = get_hls_analysis_points_service(db)
        point = service.get_point_by_id(point_id)
        if not point:
            raise HTTPException(status_code=404, detail="Point not found")
        
        # Update provided fields
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
        logger.error(f"Error updating HLS analysis point {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{point_id}/history", response_model=HLSPointHistory)
async def add_point_history(
    point_id: str,
    history_data: HLSPointHistoryCreate,
    db: Session = Depends(get_db)
):
    """Adds entry to temporal history of a point"""
    try:
        service = get_hls_analysis_points_service(db)
        return service.add_point_history(point_id, history_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error adding history for HLS point {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{point_id}/history", response_model=List[HLSPointHistory])
async def get_point_history(
    point_id: str,
    db: Session = Depends(get_db)
):
    """Gets temporal history of a point"""
    try:
        service = get_hls_analysis_points_service(db)
        history = service.get_point_history(point_id)
        return history
    except Exception as e:
        logger.error(f"Error getting history for HLS point {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.patch("/{point_id}/status")
async def update_point_status(
    point_id: str,
    status: str,
    db: Session = Depends(get_db)
):
    """Updates status of a point"""
    try:
        service = get_hls_analysis_points_service(db)
        success = service.update_point_status(point_id, status)
        if not success:
            raise HTTPException(status_code=404, detail="Point not found")
        
        return {"message": f"Point {point_id} status updated to {status}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating status for HLS point {point_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/summary/", response_model=HLSAnalysisSummary)
async def get_analysis_summary(
    db: Session = Depends(get_db)
):
    """Returns HLS analysis summary"""
    try:
        service = get_hls_analysis_points_service(db)
        
        # Get basic statistics
        critical_points = service.get_points_by_severity("critical")
        moderate_points = service.get_points_by_severity("moderate")
        healthy_points = service.get_points_by_severity("healthy")
        
        total_points = len(critical_points) + len(moderate_points) + len(healthy_points)
        
        # Use data from first point for metadata (assuming all have same parameters)
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
            # Return default values if no points
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
        logger.error(f"Error generating HLS analysis summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
