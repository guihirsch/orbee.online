"""
Endpoints para cache de dados municipais
Fornece dados pré-processados para resposta rápida
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import logging

from app.core.database import get_db
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/municipality/{code}/cached")
async def get_cached_municipality_data(
    code: str,
    include_geometry: bool = Query(True),
    include_plan: bool = Query(True),
    include_ndvi: bool = Query(True),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Retorna dados municipais do cache (resposta rápida)
    """
    try:
        result = {
            "municipality_code": code,
            "cached": True,
            "timestamp": datetime.now().isoformat()
        }
        
        # Busca geometria se solicitada
        if include_geometry:
            geometry_result = db.execute("""
                SELECT municipality_name, state, geometry_data, bbox, source, updated_at
                FROM municipality_geometry_cache 
                WHERE municipality_code = :code AND expires_at > NOW()
            """, {"code": code}).fetchone()
            
            if geometry_result:
                result["geometry"] = {
                    "name": geometry_result[0],
                    "state": geometry_result[1],
                    "geometry": json.loads(geometry_result[2]),
                    "bbox": json.loads(geometry_result[3]),
                    "source": geometry_result[4],
                    "updated_at": geometry_result[5].isoformat()
                }
            else:
                result["geometry"] = None
        
        # Busca plano se solicitado
        if include_plan:
            plan_result = db.execute("""
                SELECT municipality_name, state, plan_data, ndvi_data, zones_data, summary_data, updated_at
                FROM municipality_plan_cache 
                WHERE municipality_code = :code AND expires_at > NOW()
            """, {"code": code}).fetchone()
            
            if plan_result:
                result["plan"] = {
                    "name": plan_result[0],
                    "state": plan_result[1],
                    "plan": json.loads(plan_result[2]),
                    "ndvi_data": json.loads(plan_result[3]) if plan_result[3] else None,
                    "zones": json.loads(plan_result[4]) if plan_result[4] else None,
                    "summary": json.loads(plan_result[5]) if plan_result[5] else None,
                    "updated_at": plan_result[6].isoformat()
                }
            else:
                result["plan"] = None
        
        # Busca NDVI se solicitado
        if include_ndvi:
            ndvi_results = db.execute("""
                SELECT date_observed, ndvi_value, cloud_coverage, statistics
                FROM municipality_ndvi_cache 
                WHERE municipality_code = :code AND expires_at > NOW()
                ORDER BY date_observed DESC
                LIMIT 30
            """, {"code": code}).fetchall()
            
            if ndvi_results:
                time_series = []
                for row in ndvi_results:
                    time_series.append({
                        "date": row[0].isoformat(),
                        "ndvi": float(row[1]) if row[1] else None,
                        "cloud_coverage": row[2],
                        "statistics": json.loads(row[3]) if row[3] else None
                    })
                
                result["ndvi"] = {
                    "time_series": time_series,
                    "count": len(time_series)
                }
            else:
                result["ndvi"] = None
        
        # Verifica se todos os dados estão disponíveis
        missing_data = []
        if include_geometry and not result.get("geometry"):
            missing_data.append("geometry")
        if include_plan and not result.get("plan"):
            missing_data.append("plan")
        if include_ndvi and not result.get("ndvi"):
            missing_data.append("ndvi")
        
        if missing_data:
            result["missing_data"] = missing_data
            result["cache_status"] = "partial"
        else:
            result["cache_status"] = "complete"
        
        return result
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados em cache para município {code}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/municipality/{code}/status")
async def get_municipality_cache_status(
    code: str,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Retorna status do cache para um município
    """
    try:
        # Verifica status de cada tipo de cache
        status = {
            "municipality_code": code,
            "timestamp": datetime.now().isoformat(),
            "cache_status": {}
        }
        
        # Status da geometria
        geometry_status = db.execute("""
            SELECT COUNT(*) as count, MAX(updated_at) as last_update, MIN(expires_at) as expires_at
            FROM municipality_geometry_cache 
            WHERE municipality_code = :code AND expires_at > NOW()
        """, {"code": code}).fetchone()
        
        status["cache_status"]["geometry"] = {
            "available": geometry_status[0] > 0,
            "count": geometry_status[0],
            "last_update": geometry_status[1].isoformat() if geometry_status[1] else None,
            "expires_at": geometry_status[2].isoformat() if geometry_status[2] else None
        }
        
        # Status do plano
        plan_status = db.execute("""
            SELECT COUNT(*) as count, MAX(updated_at) as last_update, MIN(expires_at) as expires_at
            FROM municipality_plan_cache 
            WHERE municipality_code = :code AND expires_at > NOW()
        """, {"code": code}).fetchone()
        
        status["cache_status"]["plan"] = {
            "available": plan_status[0] > 0,
            "count": plan_status[0],
            "last_update": plan_status[1].isoformat() if plan_status[1] else None,
            "expires_at": plan_status[2].isoformat() if plan_status[2] else None
        }
        
        # Status do NDVI
        ndvi_status = db.execute("""
            SELECT COUNT(*) as count, MAX(date_observed) as last_date, MIN(expires_at) as expires_at
            FROM municipality_ndvi_cache 
            WHERE municipality_code = :code AND expires_at > NOW()
        """, {"code": code}).fetchone()
        
        status["cache_status"]["ndvi"] = {
            "available": ndvi_status[0] > 0,
            "count": ndvi_status[0],
            "last_date": ndvi_status[1].isoformat() if ndvi_status[1] else None,
            "expires_at": ndvi_status[2].isoformat() if ndvi_status[2] else None
        }
        
        # Status geral
        all_available = all([
            status["cache_status"]["geometry"]["available"],
            status["cache_status"]["plan"]["available"],
            status["cache_status"]["ndvi"]["available"]
        ])
        
        status["overall_status"] = "complete" if all_available else "partial" if any([
            status["cache_status"]["geometry"]["available"],
            status["cache_status"]["plan"]["available"],
            status["cache_status"]["ndvi"]["available"]
        ]) else "missing"
        
        return status
        
    except Exception as e:
        logger.error(f"Erro ao verificar status do cache para município {code}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/municipalities/stats")
async def get_cache_statistics(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Retorna estatísticas gerais do cache
    """
    try:
        stats = {
            "timestamp": datetime.now().isoformat(),
            "cache_statistics": {}
        }
        
        # Estatísticas da geometria
        geometry_stats = db.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active,
                COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired
            FROM municipality_geometry_cache
        """).fetchone()
        
        stats["cache_statistics"]["geometry"] = {
            "total": geometry_stats[0],
            "active": geometry_stats[1],
            "expired": geometry_stats[2]
        }
        
        # Estatísticas do plano
        plan_stats = db.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active,
                COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired
            FROM municipality_plan_cache
        """).fetchone()
        
        stats["cache_statistics"]["plan"] = {
            "total": plan_stats[0],
            "active": plan_stats[1],
            "expired": plan_stats[2]
        }
        
        # Estatísticas do NDVI
        ndvi_stats = db.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active,
                COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired
            FROM municipality_ndvi_cache
        """).fetchone()
        
        stats["cache_statistics"]["ndvi"] = {
            "total": ndvi_stats[0],
            "active": ndvi_stats[1],
            "expired": ndvi_stats[2]
        }
        
        # Estatísticas gerais
        stats["cache_statistics"]["overall"] = {
            "total_municipalities": len(set([
                row[0] for row in db.execute("SELECT DISTINCT municipality_code FROM municipality_geometry_cache").fetchall()
            ])),
            "cache_hit_rate": "N/A",  # Seria calculado com métricas de uso
            "last_update": datetime.now().isoformat()
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas do cache: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.delete("/municipality/{code}/cache")
async def clear_municipality_cache(
    code: str,
    cache_type: str = Query("all", regex="^(all|geometry|plan|ndvi)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Limpa cache de um município específico (requer autenticação)
    """
    try:
        if current_user.role not in ["admin", "moderator"]:
            raise HTTPException(status_code=403, detail="Permissão negada")
        
        deleted_count = 0
        
        if cache_type in ["all", "geometry"]:
            result = db.execute("""
                DELETE FROM municipality_geometry_cache 
                WHERE municipality_code = :code
            """, {"code": code})
            deleted_count += result.rowcount
        
        if cache_type in ["all", "plan"]:
            result = db.execute("""
                DELETE FROM municipality_plan_cache 
                WHERE municipality_code = :code
            """, {"code": code})
            deleted_count += result.rowcount
        
        if cache_type in ["all", "ndvi"]:
            result = db.execute("""
                DELETE FROM municipality_ndvi_cache 
                WHERE municipality_code = :code
            """, {"code": code})
            deleted_count += result.rowcount
        
        db.commit()
        
        return {
            "municipality_code": code,
            "cache_type": cache_type,
            "deleted_records": deleted_count,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Erro ao limpar cache para município {code}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
