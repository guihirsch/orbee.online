"""API v2 — portal comunitário de bacias (leitura PÚBLICA, sem login).

Tudo aqui serve artefatos versionados gerados offline por
backend/jobs/build_basin.py. Sem acesso a banco, sem credencial externa,
sem import pesado: o processo web só lê arquivos JSON.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse

from app.core.config import settings

router = APIRouter()

CACHE_HEADERS = {"Cache-Control": "public, max-age=3600"}
CACHE_TILES = {"Cache-Control": "public, max-age=86400, immutable"}

_SAFE = re.compile(r"^[A-Za-z0-9_-]+$")
LAYERS = {"ndvi_sr"}
MIN_ZOOM, MAX_ZOOM = 13, 17


def _data_root() -> Path:
    # backend/data/basins (JOBS_DATA_DIR relativo à pasta backend/)
    root = Path(__file__).resolve().parents[3] / settings.JOBS_DATA_DIR
    return root


def _basin_dir(basin: str, version: Optional[str]) -> Path:
    root = _data_root()
    bdir = root / basin
    if not bdir.is_dir():
        raise HTTPException(status_code=404, detail=f"Bacia desconhecida: {basin}")
    if version is None:
        versions = sorted(p.name for p in bdir.iterdir() if p.is_dir())
        if not versions:
            raise HTTPException(status_code=404, detail=f"Bacia sem versões: {basin}")
        version = versions[-1]
    vdir = bdir / version
    if not vdir.is_dir():
        raise HTTPException(status_code=404, detail=f"Versão inexistente: {basin}/{version}")
    return vdir


def _read_json(path: Path) -> Any:
    if not path.is_file():
        raise HTTPException(status_code=404, detail=f"Artefato ausente: {path.name}")
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as e:
        raise HTTPException(status_code=500, detail=f"Artefato inválido: {path.name}") from e


def _ok(payload: Any) -> JSONResponse:
    return JSONResponse(content=payload, headers=CACHE_HEADERS)


@router.get("/basins")
async def list_basins() -> JSONResponse:
    """Lista bacias publicadas e suas versões."""
    root = _data_root()
    out: List[Dict[str, Any]] = []
    if root.is_dir():
        for bdir in sorted(root.iterdir()):
            if not bdir.is_dir():
                continue
            versions = sorted(p.name for p in bdir.iterdir() if p.is_dir())
            out.append({
                "basin": bdir.name,
                "versions": versions,
                "latest": versions[-1] if versions else None,
            })
    return _ok(out)


@router.get("/methods")
async def get_methods(
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Metodologia aberta do índice (pesos versionados — antídoto a greenwashing)."""
    vdir = _basin_dir(basin, version)
    return _ok(_read_json(vdir / "methods.json"))


@router.get("/reaches")
async def list_reaches(
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
    min_priority: Optional[str] = Query(
        None, description="Filtra banda mínima: Baixa|Média|Alta|Urgente"),
    band: Optional[str] = Query(None, description="Filtra banda exata"),
) -> JSONResponse:
    """GeoJSON de trechos com score + breakdown + stats por janela."""
    vdir = _basin_dir(basin, version)
    fc = _read_json(vdir / "reaches.geojson")
    feats = fc.get("features", [])
    order = {"Baixa": 0, "Média": 1, "Alta": 2, "Urgente": 3}
    if band is not None:
        if band not in order:
            raise HTTPException(status_code=422, detail=f"Banda inválida: {band}")
        feats = [f for f in feats if f["properties"].get("band") == band]
    if min_priority is not None:
        if min_priority not in order:
            raise HTTPException(status_code=422, detail=f"Banda inválida: {min_priority}")
        feats = [f for f in feats
                 if order.get(f["properties"].get("band"), -1) >= order[min_priority]]
    return _ok({**fc, "features": feats})


@router.get("/reaches/{reach_id}")
async def get_reach(
    reach_id: str,
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Detalhe de um trecho (score, componentes, stats, geometria)."""
    vdir = _basin_dir(basin, version)
    fc = _read_json(vdir / "reaches.geojson")
    for f in fc.get("features", []):
        if f["properties"].get("id") == reach_id:
            doc = _sr_summary(vdir)
            if doc:
                for r in doc.get("reaches", []):
                    if r.get("id") == reach_id:
                        return _ok({**f, "sr": r})
            return _ok(f)
    raise HTTPException(status_code=404, detail=f"Trecho inexistente: {reach_id}")


@router.get("/summary")
async def get_summary(
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Resumo agregado da bacia/versão."""
    vdir = _basin_dir(basin, version)
    return _ok(_read_json(vdir / "summary.json"))


@router.get("/manifest")
async def get_manifest(
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Proveniência do build (quando, como, com o quê)."""
    vdir = _basin_dir(basin, version)
    return _ok(_read_json(vdir / "manifest.json"))


def _sr_summary(vdir: Path) -> Optional[Dict[str, Any]]:
    p = vdir / "sr_summary.json"
    if not p.is_file():
        return None
    return _read_json(p)


@router.get("/sr-summary")
async def get_sr_summary(
    basin: str = Query("pardo"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Gates G1/G2 por trecho + proveniência do modelo (404 se sem SR)."""
    vdir = _basin_dir(basin, version)
    doc = _sr_summary(vdir)
    if doc is None:
        raise HTTPException(status_code=404, detail="Sem build de SR nesta versão")
    return _ok(doc)


def _checked(value: str, what: str) -> str:
    if not _SAFE.match(value or ""):
        raise HTTPException(status_code=422, detail=f"{what} inválido: {value}")
    return value


@router.get("/tilejson")
async def get_tilejson(
    basin: str = Query("pardo"),
    reach_id: str = Query(...),
    layer: str = Query("ndvi_sr"),
    version: Optional[str] = Query(None),
) -> JSONResponse:
    """Documento TileJSON 2.2.0 p/ consumo direto no MapLibre."""
    _checked(basin, "bacia")
    _checked(reach_id, "trecho")
    if layer not in LAYERS:
        raise HTTPException(status_code=422, detail=f"Camada inválida: {layer}")
    vdir = _basin_dir(basin, version)
    tdir = vdir / "sr" / reach_id / "tiles" / layer
    if not tdir.is_dir():
        raise HTTPException(status_code=404, detail="Tiles inexistentes p/ este trecho")
    # bounds do trecho (reaches.geojson), fallback: bacia toda
    bounds = [-52.8, -29.6, -52.4, -29.3]
    try:
        fc = _read_json(vdir / "reaches.geojson")
        for f in fc.get("features", []):
            if f["properties"].get("id") == reach_id:
                import math

                xs = [c[0] for c in f["geometry"]["coordinates"]]
                ys = [c[1] for c in f["geometry"]["coordinates"]]
                bounds = [min(xs), min(ys), max(xs), max(ys)]
                break
    except HTTPException:
        pass
    return _ok({
        "tilejson": "2.2.0",
        "name": f"{basin}/{reach_id}/{layer}",
        "tiles": [f"/api/v2/tiles/{basin}/{reach_id}/{layer}/{{z}}/{{x}}/{{y}}.png"],
        "bounds": bounds,
        "minzoom": MIN_ZOOM,
        "maxzoom": MAX_ZOOM,
        "tileSize": 256,
    })


@router.get("/tiles/{basin}/{reach_id}/{layer}/{z}/{x}/{y_png}")
async def get_tile(
    basin: str, reach_id: str, layer: str, z: int, x: int, y_png: str,
    version: Optional[str] = Query(None),
):
    """Tile PNG pré-renderizado (XYZ). Fora do range → 404."""
    _checked(basin, "bacia")
    _checked(reach_id, "trecho")
    if layer not in LAYERS:
        raise HTTPException(status_code=422, detail=f"Camada inválida: {layer}")
    if not (MIN_ZOOM <= z <= MAX_ZOOM and 0 <= x < 2 ** z):
        raise HTTPException(status_code=404, detail="Tile fora do range")
    if not y_png.endswith(".png") or not y_png[:-4].isdigit():
        raise HTTPException(status_code=404, detail="Tile inválido")
    y = int(y_png[:-4])
    if not (0 <= y < 2 ** z):
        raise HTTPException(status_code=404, detail="Tile fora do range")
    vdir = _basin_dir(basin, version)
    tile = (vdir / "sr" / reach_id / "tiles" / layer / str(z) / str(x) / f"{y}.png")
    try:
        resolved = tile.resolve()
        vdir_resolved = vdir.resolve()
    except OSError:
        raise HTTPException(status_code=404, detail="Tile inexistente")
    if not resolved.is_relative_to(vdir_resolved) or not resolved.is_file():
        raise HTTPException(status_code=404, detail="Tile inexistente")
    return FileResponse(resolved, media_type="image/png", headers=CACHE_TILES)
