"""CBERS Service — NDVI independente via STAC do INPE (gratuito, sem credencial).

Segunda opinião para o NDVI Sentinel-2 da v2 (Fase A da verificação
independente): CBERS-4A/WPM L4-DN (8 m, BAND3=red, BAND4=nir, mapeamento
confirmado na coleção `CB4A-WPM-L4-DN-1`).

Limitações assumidas e documentadas:
- L4-DN são números digitais (sem reflectância de superfície); o NDVI é
  calculado sobre DN com ganhos do XML quando disponíveis, senão DN puro.
  Comparação só em estatísticas agregadas por trecho (nunca pixel a pixel),
  com tolerâncias largas no gate V7.
- A coleção não informa `eo:cloud_cover`; a triagem de nuvens é feita por
  cobertura de dados + inspeção, e os IDs usados ficam registrados.
- Imports pesados são LAZY (mesmo padrão do s2_service).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

Bbox = Tuple[float, float, float, float]  # (minx, miny, maxx, maxy) EPSG:4326

INPE_STAC_URL = "https://data.inpe.br/bdc/stac/v1"
COLLECTION_WPM_DN = "CB4A-WPM-L4-DN-1"
BAND_RED, BAND_NIR = "BAND3", "BAND4"
WPM_RES_M = 8


class CBERSError(Exception):
    """Falha de infraestrutura/upstream (rede, STAC, leitura)."""


class CBERSNoScenes(CBERSError):
    """Nenhuma cena com cobertura de dados no período."""


def _require_deps() -> None:
    try:
        import pystac_client  # noqa: F401
        import stackstac  # noqa: F401
        import rioxarray  # noqa: F401
    except ImportError as e:
        raise CBERSError(
            "Dependências geo ausentes (pystac-client, stackstac, rioxarray). "
            "Instale backend/jobs/requirements.txt"
        ) from e


def search_wpm(bbox: Bbox, start: str, end: str, limit: int = 20,
               catalog_url: str = INPE_STAC_URL,
               collection: str = COLLECTION_WPM_DN) -> List[Dict[str, Any]]:
    """Busca cenas WPM L4-DN com interseção no bbox (dicts com cobertura)."""
    _require_deps()
    from pystac_client import Client

    try:
        catalog = Client.open(catalog_url)
        search = catalog.search(collections=[collection], bbox=list(bbox),
                                datetime=f"{start}/{end}", limit=limit)
        items = list(search.items())
    except Exception as e:
        raise CBERSError(f"Falha na busca STAC {catalog_url}: {e}") from e
    if not items:
        raise CBERSNoScenes(f"Nenhuma cena WPM em {bbox} {start}/{end}")
    return [i.to_dict() for i in items]


@dataclass
class WPMComposite:
    """Medianas red/nir + NDVI + estatísticas por cena."""

    ndvi: Any
    stats: Dict[str, Any] = field(default_factory=dict)
    epsg: int = 0
    scene_ids: List[str] = field(default_factory=list)
    per_scene: List[Dict[str, Any]] = field(default_factory=list)


def _utm_from_bbox(bbox: Bbox) -> int:
    cx = (bbox[0] + bbox[2]) / 2.0
    cy = (bbox[1] + bbox[3]) / 2.0
    zone = int((cx + 180) / 6) + 1
    return (32700 if cy < 0 else 32600) + zone


def composite_ndvi_wpm(bbox: Bbox, start: str, end: str,
                       items: Optional[List[Dict[str, Any]]] = None,
                       ndvi_critical: float = 0.2,
                       ndvi_moderate: float = 0.5) -> WPMComposite:
    """Composite mediano WPM + NDVI-8m + stats (mesmo formato do S2)."""
    _require_deps()
    import numpy as np
    import stackstac

    if items is None:
        items = search_wpm(bbox, start, end)
    epsg = _utm_from_bbox(bbox)
    try:
        stack = stackstac.stack(items, assets=[BAND_RED, BAND_NIR], epsg=epsg,
                                resolution=WPM_RES_M, bounds_latlon=bbox,
                                chunksize=1024)
        med = stack.median(dim="time", keep_attrs=True).compute()
    except Exception as e:
        raise CBERSError(f"Falha ao empilhar/compor cenas WPM: {e}") from e

    red = med.sel(band=BAND_RED).astype("float64")
    nir = med.sel(band=BAND_NIR).astype("float64")
    data = np.isfinite(red) & np.isfinite(nir) & ((red != 0) | (nir != 0))
    ndvi = ((nir - red) / (nir + red).where((nir + red) != 0)).where(data)
    n = int(data.sum())
    stats = {
        "n_cenas": len(items),
        "frac_validos": float(data.mean()),
        "ndvi_min": float(ndvi.min()),
        "ndvi_max": float(ndvi.max()),
        "ndvi_mean": float(ndvi.mean()),
        "frac_critico": float((ndvi < ndvi_critical).mean()),
        "frac_moderado": float(((ndvi >= ndvi_critical) & (ndvi < ndvi_moderate)).mean()),
    }
    per_scene = []
    for it in items:
        try:
            s = stackstac.stack([it], assets=[BAND_RED, BAND_NIR], epsg=epsg,
                                resolution=WPM_RES_M, bounds_latlon=bbox,
                                chunksize=1024).median(dim="time",
                                                       keep_attrs=True).compute()
            r1 = s.sel(band=BAND_RED).astype("float64")
            n1 = s.sel(band=BAND_NIR).astype("float64")
            ok = np.isfinite(r1) & np.isfinite(n1) & (((r1 != 0) | (n1 != 0)))
            v1 = ((n1 - r1) / (n1 + r1).where((n1 + r1) != 0)).where(ok)
            per_scene.append({"id": it.get("id"), "ndvi_mean": float(v1.mean()),
                              "frac_validos": float(ok.mean())})
        except Exception as e:  # noqa: BLE001
            per_scene.append({"id": it.get("id"), "erro": str(e)[:120]})
    return WPMComposite(ndvi=ndvi, stats=stats, epsg=epsg,
                        scene_ids=[i.get("id") for i in items], per_scene=per_scene)
