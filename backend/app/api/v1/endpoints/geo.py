from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from app.core.cache import cache
import httpx


router = APIRouter()


# Mock/placeholder simples. Em produção, substituir por IBGE/Supabase.
_MUNICIPALITIES = [
    {
        "name": "Sinimbu",
        "ibge_code": "4320676",
        "state": "RS",
        "bbox": [-52.60, -29.45, -52.30, -29.75],
    }
]


@router.get("/search")
async def search_municipalities(q: str = Query(..., min_length=2), source: str = Query("local")) -> List[Dict[str, Any]]:
    q_lower = q.lower()
    cache_key = f"geo_search:{q_lower}:{source}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    # Fonte: IBGE localidades (nomes oficiais) – sem bbox
    if source == "ibge":
        try:
            url = f"https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome={q_lower}"
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url)
                resp.raise_for_status()
                data = resp.json()
                # Normaliza
                items = []
                for it in data[:10]:
                    items.append({
                        "name": it.get("nome"),
                        "ibge_code": str(it.get("id")),
                        "state": it.get("microrregiao", {}).get("mesorregiao", {}).get("UF", {}).get("sigla", ""),
                        "bbox": None,
                        "source": "ibge",
                    })
                cache.set(cache_key, items, ttl_seconds=3600)
                return items
        except Exception:
            # fallback continua abaixo
            pass

    # Fonte: OSM Nominatim (boa UX, com bbox)
    if source in ("osm", "nominatim"):
        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": q,
                "format": "jsonv2",
                "limit": 10,
                "addressdetails": 1,
                "polygon_geojson": 0,
            }
            headers = {"User-Agent": "orbee.online/1.0 (contact: admin@orbee.online)"}
            async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
                items = []
                for it in data:
                    # Apenas municípios (administrative)
                    if it.get("type") not in ("administrative", "city", "town", "municipality"):
                        continue
                    bbox = it.get("boundingbox")
                    bbox_num = [float(bbox[2]), float(bbox[0]), float(bbox[3]), float(bbox[1])] if bbox else None  # [minx,miny,maxx,maxy]
                    items.append({
                        "name": it.get("display_name", "").split(",")[0],
                        "ibge_code": None,
                        "state": (it.get("address", {}).get("state_code") or ""),
                        "bbox": bbox_num,
                        "osm_id": it.get("osm_id"),
                        "source": "osm",
                    })
                cache.set(cache_key, items, ttl_seconds=1800)
                return items
        except Exception:
            pass

    # Local fallback
    results = [m for m in _MUNICIPALITIES if q_lower in m["name"].lower()]
    cache.set(cache_key, results, ttl_seconds=3600)
    return results


@router.get("/municipalities/{code}/geometry")
async def get_municipality_geometry(code: str, source: str = Query("local"), q: str | None = Query(None)) -> Dict[str, Any]:
    cache_key = f"geo_geom:{code}:{source}:{q or ''}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    # Geometria via OSM/Nominatim (preferível pois retorna GeoJSON pronto)
    if source in ("osm", "nominatim"):
        try:
            # Se "q" for fornecido, usar busca direta; senão tentar pelo code como texto de busca
            search_q = q or code
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": search_q,
                "format": "jsonv2",
                "limit": 1,
                "polygon_geojson": 1,
                "addressdetails": 1,
            }
            headers = {"User-Agent": "orbee.online/1.0 (contact: admin@orbee.online)"}
            async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                data = resp.json()
                if not data:
                    raise HTTPException(status_code=404, detail="Geometria não encontrada no OSM")
                it = data[0]
                geom = it.get("geojson")
                if not geom:
                    raise HTTPException(status_code=404, detail="GeoJSON ausente no OSM")
                feature = {
                    "type": "Feature",
                    "properties": {
                        "name": it.get("display_name", "").split(",")[0],
                        "ibge_code": code if code.isdigit() else None,
                        "source": "osm",
                    },
                    "geometry": geom,
                }
                fc = {"type": "FeatureCollection", "features": [feature]}
                cache.set(cache_key, fc, ttl_seconds=3600)
                return fc
        except HTTPException:
            raise
        except Exception:
            pass

    # Fallback local (bbox aproximado do mock)
    m = next((m for m in _MUNICIPALITIES if m["ibge_code"] == code), None)
    if not m:
        raise HTTPException(status_code=404, detail="Município não encontrado")

    minx, miny, maxx, maxy = m["bbox"]
    feature = {
        "type": "Feature",
        "properties": {
            "name": m["name"],
            "ibge_code": m["ibge_code"],
            "state": m["state"],
            "source": "placeholder",
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[minx, miny], [maxx, miny], [maxx, maxy], [minx, maxy], [minx, miny]]],
        },
    }
    fc = {"type": "FeatureCollection", "features": [feature]}
    cache.set(cache_key, fc, ttl_seconds=3600)
    return fc


