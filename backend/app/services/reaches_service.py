"""Reaches Service — segmentação de rios em trechos + índice de prioridade.

- Geometria (OSM → UTM → segmentos ~500 m): imports LAZY (só o job usa).
- Scoring (`score_reach`, `score_all`): funções PURAS, sem deps geo,
  testáveis em qualquer ambiente. É aqui que vive a metodologia.

Convenção de ID estável por trecho: `{river_key}:{order:04d}` + hash de
coordenadas (mesma filosofia dos `hls_point_*` da v1).
"""

from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Optional

from app.core.priority_weights import METHODS_VERSION, WEIGHTS, band_for

REACH_LENGTH_M = 500.0
RESTORE_REF_HA = 25.0  # heurística de custo F1 (ver priority_weights)


def _clamp01(x: float) -> float:
    try:
        v = float(x)
    except (TypeError, ValueError):
        return 0.0
    if v != v:  # NaN
        return 0.0
    return max(0.0, min(1.0, v))


def stable_reach_id(river_key: str, order: int, mx: float, my: float) -> str:
    base = f"{river_key}:{order:04d}:{mx:.1f}:{my:.1f}"
    h = hashlib.sha256(base.encode()).hexdigest()[:10]
    return f"reach_{h}"


def score_reach(
    stats_pre: Dict[str, Any],
    stats_pos: Dict[str, Any],
    stats_regen: Dict[str, Any],
    neighbor_regen_mean: float = 0.5,
    reach_area_ha: float = 5.0,
    ndvi_critical: float = 0.2,
) -> Dict[str, Any]:
    """Escore 0..1 + breakdown. Entradas: dicts `stats` do s2_service."""

    def g(s: Dict[str, Any], k: str, default: float = 0.0) -> float:
        try:
            v = float(s.get(k, default))
            return v if v == v else default
        except (TypeError, ValueError):
            return default

    severity = _clamp01(g(stats_regen, "frac_critico"))

    # no_regen só conta se houve déficit a recuperar (evita punir mata estável):
    # fração do déficit (pre→pos) NÃO recuperada em pos→regen.
    deficit = max(0.0, g(stats_pre, "ndvi_mean") - g(stats_pos, "ndvi_mean"))
    regen_gain = g(stats_regen, "ndvi_mean") - g(stats_pos, "ndvi_mean")
    if deficit <= 1e-9:
        no_regen = 0.0
    else:
        recovered = _clamp01(regen_gain / deficit)
        no_regen = (1.0 - recovered) * _clamp01(deficit / 0.1)

    connectivity = 1.0 - _clamp01(neighbor_regen_mean)

    emergence = g(stats_pos, "frac_critico") - g(stats_pre, "frac_critico")
    risk = _clamp01(emergence * 3.0)

    restore_ha = severity * max(reach_area_ha, 0.0)
    cost = _clamp01(1.0 - restore_ha / RESTORE_REF_HA)

    components = {
        "severity": round(severity, 4),
        "no_regen": round(no_regen, 4),
        "connectivity": round(connectivity, 4),
        "risk": round(risk, 4),
        "cost": round(cost, 4),
    }
    score = round(sum(WEIGHTS[k] * components[k] for k in WEIGHTS), 4)
    return {
        "score": score,
        "band": band_for(score),
        "components": components,
        "valid_fraction": round(g(stats_regen, "frac_validos"), 4),
        "delta_regen": round(regen_gain, 4),
    }


def score_all(reaches: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Aplica score com conectividade entre vizinhos do mesmo rio.

    Cada reach: {"river_key", "order", "stats_pre/pos/regen", "area_ha", ...}.
    Vizinhos = ordens adjacentes do mesmo river_key (usa ndvi_mean regen).
    """
    by_river: Dict[str, List[Dict[str, Any]]] = {}
    for r in reaches:
        by_river.setdefault(r.get("river_key", "?"), []).append(r)
    for lst in by_river.values():
        lst.sort(key=lambda r: r.get("order", 0))

    out = []
    for lst in by_river.values():
        means = [
            float((r.get("stats_regen") or {}).get("ndvi_mean", 0.5)) for r in lst
        ]
        for i, r in enumerate(lst):
            neigh = []
            if i > 0:
                neigh.append(means[i - 1])
            if i < len(lst) - 1:
                neigh.append(means[i + 1])
            nmean = sum(neigh) / len(neigh) if neigh else means[i]
            scored = score_reach(
                r.get("stats_pre") or {},
                r.get("stats_pos") or {},
                r.get("stats_regen") or {},
                neighbor_regen_mean=nmean,
                reach_area_ha=float(r.get("area_ha", 5.0)),
            )
            out.append({**r, **scored, "methods_version": METHODS_VERSION})
    return out


def to_geojson(reaches: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Scored reaches → FeatureCollection (geometrias já em EPSG:4326)."""
    features = []
    for r in reaches:
        geom = r.get("geometry")
        if not geom:
            continue
        props = {
            "id": r.get("id"),
            "river": r.get("river_key"),
            "order": r.get("order"),
            "score": r.get("score"),
            "band": r.get("band"),
            "components": r.get("components"),
            "delta_regen": r.get("delta_regen"),
            "valid_fraction": r.get("valid_fraction"),
            "area_ha": r.get("area_ha"),
            "stats_pre": r.get("stats_pre"),
            "stats_pos": r.get("stats_pos"),
            "stats_regen": r.get("stats_regen"),
            "methods_version": r.get("methods_version", METHODS_VERSION),
        }
        features.append({"type": "Feature", "properties": props, "geometry": geom})
    return {"type": "FeatureCollection", "features": features}


# ---------------------------------------------------------------------------
# Geometria (job offline; deps lazy)


def build_reaches(
    region: str,
    buffer_m: float = 200.0,
    reach_length_m: float = REACH_LENGTH_M,
    min_inside_pct: float = 10.0,
) -> List[Dict[str, Any]]:
    """Rios OSM → buffer não usado aqui; segmenta linhas em trechos ~500 m.

    Retorna reaches com geometria EPSG:4326, river_key, order, area_ha
    (área = comprimento × 2×buffer aproximada via bbox do segmento? usa
    comprimento × faixa fixa) e centroides. Stats vêm do job (s2_service).
    """
    try:
        import osmnx as ox
        import geopandas as gpd
        from shapely.ops import substring
    except ImportError as e:
        raise RuntimeError(
            "build_reaches exige osmnx/geopandas/shapely "
            "(backend/jobs/requirements.txt)"
        ) from e

    boundary = ox.geocode_to_gdf(region)
    muni = boundary.geometry.iloc[0]
    rivers = ox.features_from_place(region, tags={"waterway": "river"})
    linear = rivers[rivers.geometry.type.isin(["LineString", "MultiLineString"])]
    if linear.empty:
        raise ValueError(f"Nenhum rio linear em '{region}'")

    c = linear.geometry.centroid.iloc[0]
    zone = int((c.x + 180) / 6) + 1
    utm = f"EPSG:{32700 + zone}" if c.y < 0 else f"EPSG:{32600 + zone}"
    utm_gdf = linear.to_crs(utm)

    reaches: List[Dict[str, Any]] = []
    for idx, row in utm_gdf.iterrows():
        geom = row.geometry
        parts = (
            [geom] if geom.geom_type == "LineString" else list(geom.geoms)
        )
        name = str(row.get("name", f"rio_{idx}"))
        river_key = "".join(ch if ch.isalnum() else "_" for ch in name.lower())[:40]
        order = 0
        for part in parts:
            if not part.intersects(muni):
                continue
            total = part.length
            d = 0.0
            while d < total:
                seg = substring(part, d, min(d + reach_length_m, total))
                if seg.is_empty or seg.length < 50:
                    break
                seg_wgs = (
                    gpd.GeoDataFrame(geometry=[seg], crs=utm)
                    .to_crs(4326)
                    .geometry.iloc[0]
                )
                mx, my = seg.centroid.x, seg.centroid.y
                # área aprox: faixa buffer_m×2 ao longo do segmento
                area_ha = seg.length * buffer_m * 2 / 10000.0
                reaches.append(
                    {
                        "id": stable_reach_id(river_key, order, mx, my),
                        "river_key": river_key,
                        "order": order,
                        "length_m": round(seg.length, 1),
                        "area_ha": round(area_ha, 2),
                        "centroid": [round(mx, 6), round(my, 6)],
                        "geometry": seg_wgs.__geo_interface__,
                    }
                )
                order += 1
                d += reach_length_m
    if not reaches:
        raise ValueError("Nenhum trecho dentro do município")
    return reaches
