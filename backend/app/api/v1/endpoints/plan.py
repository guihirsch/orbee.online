from fastapi import APIRouter, Query, HTTPException, Depends
from datetime import datetime, date
from typing import Dict, Any

from app.services.ndvi_history_service import NDVIHistoryService
from app.api.v1.endpoints.geo import get_municipality_geometry
from app.services.ndvi_service import NDVIService
from app.api.deps import get_current_user
from app.models.schemas import User


router = APIRouter()


def _status_from_ndvi(value: float) -> str:
    if value >= 0.7:
        return "Excelente"
    if value >= 0.5:
        return "Boa"
    if value >= 0.3:
        return "Moderada"
    return "Severa"


def _priority_from_status(status: str) -> str:
    return {
        "Severa": "Urgente",
        "Moderada": "Alta",
        "Boa": "Média",
        "Excelente": "Baixa",
    }.get(status, "Média")


@router.get("/municipality/{code}")
async def get_action_plan_for_municipality(
    code: str,
    source: str = Query("osm"),
    # Removido: período será automático (últimos 30 dias)
    current_user: User = Depends(get_current_user),
):
    try:
        # 1) Geometria do município (GeoJSON)
        geometry_fc = await get_municipality_geometry(code=code, source=source, q=None)

        # 2) NDVI para a AOI do município
        ndvi_service = NDVIService()
        # Período automático: últimos 30 dias
        from datetime import datetime, timedelta
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        payload = {
            "municipality_code": code,
            "geometry": geometry_fc["features"][0],
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "max_cloud": 30,
            "superres": False,
        }
        ndvi = await ndvi_service.get_ndvi_for_aoi(payload)

        current_ndvi = float(ndvi.get("current_ndvi", 0.0))
        trend = ndvi.get("trend", "stable")
        status = _status_from_ndvi(current_ndvi)
        priority = _priority_from_status(status)

        # 3) Plano de ação simples (3 zonas sintéticas baseadas em status)
        zones = [
            {
                "id": "A",
                "name": "Zona Crítica A",
                "priority": "Urgente" if status in ("Severa",) else "Alta",
                "area": "2.1 ha",
                "ndvi": round(max(0.0, current_ndvi - 0.02), 2),
                "degradation": "Severa" if status in ("Severa",) else status,
                "coordinates": "-29.7175, -52.4264",
                "evolution": {
                    "last": round(max(0.0, current_ndvi - 0.02), 2),
                    "trend": "Declinando" if trend == "declining" else ("Estável" if trend == "stable" else "Melhorando"),
                },
            },
            {
                "id": "B",
                "name": "Zona Crítica B",
                "priority": "Alta" if status in ("Severa", "Moderada") else "Média",
                "area": "1.8 ha",
                "ndvi": round(current_ndvi, 2),
                "degradation": status,
                "coordinates": "-29.7185, -52.4274",
                "evolution": {
                    "last": round(current_ndvi, 2),
                    "trend": "Declinando" if trend == "declining" else ("Estável" if trend == "stable" else "Melhorando"),
                },
            },
            {
                "id": "C",
                "name": "Zona Atenção C",
                "priority": "Moderada" if status in ("Boa", "Excelente") else "Média",
                "area": "3.2 ha",
                "ndvi": round(min(1.0, current_ndvi + 0.13), 2),
                "degradation": "Moderada" if status in ("Severa", "Moderada") else "Moderada",
                "coordinates": "-29.7195, -52.4284",
                "evolution": {
                    "last": round(min(1.0, current_ndvi + 0.13), 2),
                    "trend": "Melhorando" if trend != "declining" else "Declinando",
                },
            },
        ]

        # 4) Salvar no banco para histórico
        history_service = NDVIHistoryService()
        municipality_name = geometry_fc.get("features", [{}])[0].get("properties", {}).get("name", f"Município {code}")
        
        await history_service.save_ndvi_history(
            municipality_code=code,
            municipality_name=municipality_name,
            geometry=geometry_fc,
            ndvi_data=ndvi,
            start_date=start_date,
            end_date=end_date
        )

        return {
            "municipality_code": code,
            "geometry": geometry_fc,
            "ndvi": ndvi,
            "summary": {
                "current_ndvi": current_ndvi,
                "trend": trend,
                "status": status,
                "priority": priority,
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "period": f"{start_date.isoformat()} a {end_date.isoformat()}",
            },
            "zones": zones,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar plano de ação: {e}")


@router.get("/municipality/{code}/test")
async def get_action_plan_for_municipality_test(
    code: str,
    source: str = Query("osm"),
):
    try:
        # 1) Geometria do município (GeoJSON)
        geometry_fc = await get_municipality_geometry(code=code, source=source, q=None)

        # 2) NDVI para a AOI do município
        ndvi_service = NDVIService()
        # Período automático: últimos 30 dias
        from datetime import datetime, timedelta
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        payload = {
            "municipality_code": code,
            "geometry": geometry_fc["features"][0],
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "max_cloud": 30,
            "superres": False,
        }
        ndvi = await ndvi_service.get_ndvi_for_aoi(payload)

        current_ndvi = float(ndvi.get("current_ndvi", 0.0))
        trend = ndvi.get("trend", "stable")
        status = _status_from_ndvi(current_ndvi)
        priority = _priority_from_status(status)

        # 3) Plano de ação simples (3 zonas sintéticas baseadas em status)
        zones = [
            {
                "id": "A",
                "name": "Zona Crítica A",
                "priority": "Urgente" if status in ("Severa",) else "Alta",
                "area": "2.1 ha",
                "ndvi": round(max(0.0, current_ndvi - 0.02), 2),
                "degradation": "Severa" if status in ("Severa",) else status,
                "coordinates": "-29.7175, -52.4264",
                "evolution": {
                    "last": round(max(0.0, current_ndvi - 0.02), 2),
                    "trend": "Declinando" if trend == "declining" else ("Estável" if trend == "stable" else "Melhorando"),
                },
            },
            {
                "id": "B",
                "name": "Zona Crítica B",
                "priority": "Alta" if status in ("Severa", "Moderada") else "Média",
                "area": "1.8 ha",
                "ndvi": round(current_ndvi, 2),
                "degradation": status,
                "coordinates": "-29.7185, -52.4274",
                "evolution": {
                    "last": round(current_ndvi, 2),
                    "trend": "Declinando" if trend == "declining" else ("Estável" if trend == "stable" else "Melhorando"),
                },
            },
            {
                "id": "C",
                "name": "Zona Atenção C",
                "priority": "Moderada" if status in ("Boa", "Excelente") else "Média",
                "area": "3.2 ha",
                "ndvi": round(min(1.0, current_ndvi + 0.13), 2),
                "degradation": "Moderada" if status in ("Severa", "Moderada") else "Moderada",
                "coordinates": "-29.7195, -52.4284",
                "evolution": {
                    "last": round(min(1.0, current_ndvi + 0.13), 2),
                    "trend": "Melhorando" if trend != "declining" else "Declinando",
                },
            },
        ]

        # 4) Salvar no banco para histórico (opcional - modo desenvolvimento)
        try:
            history_service = NDVIHistoryService()
            municipality_name = geometry_fc.get("features", [{}])[0].get("properties", {}).get("name", f"Município {code}")
            
            await history_service.save_ndvi_history(
                municipality_code=code,
                municipality_name=municipality_name,
                geometry=geometry_fc,
                ndvi_data=ndvi,
                start_date=start_date,
                end_date=end_date
            )
        except Exception as e:
            print(f"Erro ao salvar histórico (modo desenvolvimento): {e}")

        return {
            "municipality_code": code,
            "geometry": geometry_fc,
            "ndvi": ndvi,
            "summary": {
                "current_ndvi": current_ndvi,
                "trend": trend,
                "status": status,
                "priority": priority,
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "period": f"{start_date.isoformat()} a {end_date.isoformat()}",
            },
            "zones": zones,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar plano de ação: {e}")


