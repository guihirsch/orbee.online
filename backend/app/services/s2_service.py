"""S2 Service — NDVI real via Planetary Computer STAC (gratuito, sem credencial).

Port fiel das Células 2-3 do notebook de validação (v2_validation/,
Fase 0 VERDE em 2026-09-06). Caminho real de NDVI da v2; substitui o
Sentinel Hub pago (cujo TODO retornava mock).

Os imports pesados (pystac_client/stackstac/rioxarray) são LAZY (dentro das
funções): o processo web pode importar este módulo sem as deps de geo.
Elas vivem em backend/jobs/requirements.txt e são exercidas pelo job
offline backend/jobs/build_basin.py.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

Bbox = Tuple[float, float, float, float]  # (minx, miny, maxx, maxy) EPSG:4326

S2_BANDS = ["B02", "B03", "B04", "B08", "SCL"]
SCL_VALID_DEFAULT = [4, 5]  # vegetação + solo exposto (Fase 0)
SCALE_FACTOR = 10000.0


class S2Error(Exception):
    """Falha de infraestrutura/upstream (rede, STAC, leitura)."""


class S2NoScenes(S2Error):
    """Nenhuma cena dentro do filtro de nuvens/período."""


class S2BufferOutside(S2Error):
    """Máscara do buffer vazia ou buffer fora/truncado pelo raster do NDVI."""


@dataclass
class CompositeResult:
    """Composite mediano + NDVI + estatísticas (chaves idênticas às do notebook)."""

    ndvi: Any  # xarray.DataArray (import lazy; Any p/ não quebrar sem xarray)
    stats: Dict[str, Any] = field(default_factory=dict)
    epsg: int = 0
    n_scenes: int = 0
    mask: Any = None  # máscara booleana do buffer na grade (None = bbox inteiro)
    bbox: Optional[Bbox] = None
    mask_method: str = ""


def epsg_from_bbox(bbox: Bbox) -> int:
    """UTM da AOI a partir do centroide (nunca hardcodado — lição da Fase 0)."""
    cx = (bbox[0] + bbox[2]) / 2.0
    cy = (bbox[1] + bbox[3]) / 2.0
    zone = int((cx + 180) / 6) + 1
    return (32700 if cy < 0 else 32600) + zone


def _require_deps() -> None:
    try:
        import pystac_client  # noqa: F401
        import planetary_computer  # noqa: F401
        import stackstac  # noqa: F401
        import rioxarray  # noqa: F401
    except ImportError as e:
        raise S2Error(
            "Dependências geo ausentes (pystac-client, planetary-computer, "
            "stackstac, rioxarray). Instale backend/jobs/requirements.txt "
            "ou rode via backend/jobs/build_basin.py"
        ) from e


def search_scenes(
    bbox: Bbox,
    start: str,
    end: str,
    cloud_max: int = 20,
    top_n: int = 3,
    catalog_url: Optional[str] = None,
    collection: str = "sentinel-2-l2a",
) -> List[Dict[str, Any]]:
    """Busca e assina itens S2 L2A; retorna os top_n menos nublados (dicts)."""
    _require_deps()
    from pystac_client import Client
    import planetary_computer as pc

    if catalog_url is None:
        from app.core.config import settings

        catalog_url = settings.PC_STAC_URL
        collection = settings.PC_COLLECTION_S2L2A

    try:
        catalog = Client.open(catalog_url)
        search = catalog.search(
            collections=[collection],
            bbox=list(bbox),
            datetime=f"{start}/{end}",
            query={"eo:cloud_cover": {"lt": cloud_max}},
        )
        items = sorted(
            search.items(), key=lambda i: i.properties.get("eo:cloud_cover", 100)
        )[:top_n]
    except Exception as e:
        raise S2Error(f"Falha na busca STAC {catalog_url}: {e}") from e

    if not items:
        raise S2NoScenes(f"Nenhuma cena S2 em {bbox} {start}/{end} (nuvens<{cloud_max}%)")
    return [pc.sign(i).to_dict() for i in items]


@dataclass
class RgbnComposite:
    """Medianas por banda + SCL + máscara (base p/ SR e NDVI)."""

    bands: Dict[str, Any]  # B02/B03/B04/B08(/SCL) como DataArrays
    scl: Any
    valid: Any
    epsg: int
    n_scenes: int


def composite_rgbn(
    bbox: Bbox,
    start: str,
    end: str,
    cloud_max: int = 20,
    top_n: int = 3,
    catalog_url: Optional[str] = None,
    collection: str = "sentinel-2-l2a",
) -> RgbnComposite:
    """Composite mediano com todas as bandas (S2_BANDS). Núcleo compartilhado."""
    _require_deps()
    import stackstac

    signed = search_scenes(bbox, start, end, cloud_max, top_n, catalog_url, collection)
    epsg = epsg_from_bbox(bbox)
    try:
        stack = stackstac.stack(
            signed,
            assets=S2_BANDS,
            epsg=epsg,
            resolution=10,
            bounds_latlon=bbox,
            chunksize=1024,
        )
        med = stack.median(dim="time", keep_attrs=True).compute()
    except Exception as e:
        raise S2Error(f"Falha ao empilhar/compor cenas S2: {e}") from e

    scl = med.sel(band="SCL")
    valid = scl.isin(SCL_VALID_DEFAULT)
    bands = {b: med.sel(band=b) for b in S2_BANDS if b != "SCL"}
    return RgbnComposite(bands=bands, scl=scl, valid=valid,
                         epsg=epsg, n_scenes=len(signed))


def buffer_stats_for_ndvi(
    ndvi: Any,
    valid: Any,
    polygon: Any,
    epsg: int,
    ndvi_critical: float = 0.2,
    ndvi_moderate: float = 0.5,
) -> Tuple[Dict[str, Any], Any]:
    """Rasteriza o buffer na grade do NDVI e calcula stats só dentro dele.

    Falha alto (`S2BufferOutside`) se a máscara vier vazia ou se o buffer
    estiver truncado pelo raster — nunca publica zero silencioso.
    """
    import numpy as np

    from app.services.buffer_geometry import rasterize_buffer_mask
    from app.services.buffer_stats import buffer_stats

    mask = rasterize_buffer_mask(ndvi, polygon, epsg=epsg)
    n_buffer = int(mask.sum())
    if n_buffer == 0:
        raise S2BufferOutside(
            "máscara do buffer vazia: o buffer caiu fora do raster do NDVI"
        )

    # Sanidade de cobertura: a máscara deve ter ~área do buffer / área do pixel.
    xs = np.asarray(ndvi["x"].values, dtype="float64")
    ys = np.asarray(ndvi["y"].values, dtype="float64")
    px_area = abs(float(xs[1] - xs[0]) * float(ys[1] - ys[0]))
    expected = _polygon_area_m2(polygon, epsg) / px_area
    if expected > 0 and n_buffer < 0.5 * expected:
        raise S2BufferOutside(
            f"buffer truncado pelo raster: {n_buffer} pixels de "
            f"~{expected:.0f} esperados (buffer fora do raster?)"
        )

    valid_arr = np.asarray(valid).astype(bool)
    finite = np.isfinite(np.asarray(ndvi, dtype="float64"))
    stats = buffer_stats(
        ndvi, valid, mask,
        ndvi_critical=ndvi_critical, ndvi_moderate=ndvi_moderate,
    )
    stats["n_pixels_buffer"] = n_buffer
    stats["n_pixels_validos"] = int((mask & valid_arr & finite).sum())
    return stats, mask


def _polygon_area_m2(polygon: Any, epsg: int) -> float:
    """Área do polígono (EPSG:4326) no UTM, em m²."""
    from pyproj import Transformer
    from shapely.ops import transform as shp_transform

    fwd = Transformer.from_crs("EPSG:4326", f"EPSG:{epsg}", always_xy=True)
    return float(shp_transform(fwd.transform, polygon).area)


def composite_ndvi(
    bbox: Bbox,
    start: str,
    end: str,
    cloud_max: int = 20,
    top_n: int = 3,
    ndvi_critical: float = 0.2,
    ndvi_moderate: float = 0.5,
    catalog_url: Optional[str] = None,
    collection: str = "sentinel-2-l2a",
    buffer_geometry: Optional[Dict[str, Any]] = None,
    buffer_m: float = 200.0,
    buffer_margin_m: float = 30.0,
) -> CompositeResult:
    """Composite mediano + NDVI-10m + stats (port da Célula 3 do notebook).

    Com `buffer_geometry` (GeoJSON do trecho), o bbox de busca é derivado do
    buffer + margem e as estatísticas são recortadas pela máscara rasterizada
    do buffer. Sem ele, mantém o comportamento v3 (bbox inteiro) usando a
    função pura `buffer_stats` com máscara toda verdadeira.
    """
    search_bbox_used = bbox
    if buffer_geometry is not None:
        from app.services.buffer_geometry import search_bbox as _search_bbox

        search_bbox_used = _search_bbox(
            buffer_geometry, buffer_m, buffer_margin_m
        )

    comp = composite_rgbn(search_bbox_used, start, end, cloud_max, top_n,
                          catalog_url, collection)
    valid = comp.valid
    red = comp.bands["B04"].where(valid) / SCALE_FACTOR
    nir = comp.bands["B08"].where(valid) / SCALE_FACTOR
    ndvi = ((nir - red) / (nir + red)).where((nir + red) != 0)

    mask = None
    mask_method = "bbox_all_true"
    if buffer_geometry is not None:
        from app.services.buffer_geometry import buffer_polygon

        polygon = buffer_polygon(buffer_geometry, buffer_m, epsg=comp.epsg)
        stats, mask = buffer_stats_for_ndvi(
            ndvi, valid, polygon, epsg=comp.epsg,
            ndvi_critical=ndvi_critical, ndvi_moderate=ndvi_moderate,
        )
        mask_method = "rasterized_buffer_polygon"
        stats["bbox"] = list(search_bbox_used)
        stats["mask_method"] = mask_method
    else:
        import numpy as np

        from app.services.buffer_stats import buffer_stats

        ones = np.ones(np.asarray(ndvi).shape, dtype=bool)
        stats = buffer_stats(
            ndvi, valid, ones,
            ndvi_critical=ndvi_critical, ndvi_moderate=ndvi_moderate,
        )
        finite = np.isfinite(np.asarray(ndvi, dtype="float64"))
        stats["n_pixels_buffer"] = int(ones.sum())
        stats["n_pixels_validos"] = int(
            (ones & np.asarray(valid).astype(bool) & finite).sum()
        )

    stats["n_cenas"] = comp.n_scenes
    return CompositeResult(
        ndvi=ndvi, stats=stats, epsg=comp.epsg, n_scenes=comp.n_scenes,
        mask=mask, bbox=search_bbox_used, mask_method=mask_method,
    )


async def composite_ndvi_async(*args: Any, **kwargs: Any) -> CompositeResult:
    """Wrapper async (roda o sync em thread; não bloqueia o event loop)."""
    return await asyncio.to_thread(composite_ndvi, *args, **kwargs)
