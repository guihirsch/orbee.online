"""Geometria do buffer ripário na grade do NDVI (ticket #5).

Sem rede e sem I/O: recebe uma geometria de trecho em EPSG:4326, devolve o
polígono do buffer, o bbox derivado (buffer + margem) e a máscara rasterizada
na grade do composite. Os imports geo (shapely/pyproj/rasterio) são LAZY para
o processo web e o build sintético continuarem sem deps de geo.
"""

from __future__ import annotations

from typing import Any, Dict, Tuple

Bbox = Tuple[float, float, float, float]

_DEFAULT_QUAD_SEGS = 16  # círculo/cápsula suave o suficiente em 10 m


def _utm_epsg(lon: float, lat: float) -> int:
    zone = int((lon + 180.0) / 6.0) + 1
    return (32700 if lat < 0 else 32600) + zone


def _as_line(geometry: Any) -> Any:
    """Normaliza GeoJSON/shapely LineString|MultiLineString em shapely 4326."""
    from shapely.geometry import shape

    geom = shape(geometry) if isinstance(geometry, dict) else geometry
    if geom.geom_type not in ("LineString", "MultiLineString"):
        raise ValueError(
            f"geometria deve ser LineString ou MultiLineString, veio {geom.geom_type}"
        )
    if geom.is_empty or geom.length <= 0:
        raise ValueError("geometria vazia: não é possível derivar o buffer")
    return geom


def buffer_polygon(
    geometry: Any,
    buffer_m: float,
    epsg: int | None = None,
    quad_segs: int = _DEFAULT_QUAD_SEGS,
) -> Any:
    """Polígono do buffer (m) em EPSG:4326, construído no UTM local.

    O buffer é aplicado em metros no UTM (não em graus) e reprojetado para
    EPSG:4326 — é a geometria que o STAC e a máscara usam.
    """
    from pyproj import Transformer
    from shapely.geometry import mapping
    from shapely.ops import transform as shp_transform
    from shapely.validation import make_valid

    if not (buffer_m > 0):
        raise ValueError(f"buffer_m deve ser > 0, veio {buffer_m}")
    geom = _as_line(geometry)
    c = geom.centroid
    utm = epsg or _utm_epsg(c.x, c.y)
    fwd = Transformer.from_crs("EPSG:4326", f"EPSG:{utm}", always_xy=True)
    inv = Transformer.from_crs(f"EPSG:{utm}", "EPSG:4326", always_xy=True)

    line_utm = shp_transform(fwd.transform, geom)
    buf_utm = line_utm.buffer(
        buffer_m, quad_segs=quad_segs, cap_style="round", join_style="round"
    )
    if buf_utm.is_empty or buf_utm.area <= 0:
        raise ValueError("buffer vazio: verifique a geometria e o buffer_m")
    buf_wgs = shp_transform(inv.transform, buf_utm)
    # Garante que o resultado é um Polygon válido e serializável.
    if buf_wgs.geom_type != "Polygon" or not buf_wgs.is_valid:
        buf_wgs = make_valid(buf_wgs)
    mapping(buf_wgs)  # falha cedo se a geometria não for serializável
    return buf_wgs


def search_bbox(
    geometry: Any,
    buffer_m: float = 200.0,
    margin_m: float = 30.0,
    epsg: int | None = None,
) -> Bbox:
    """Bbox (minx, miny, maxx, maxy) do buffer + margem, em EPSG:4326.

    A margem é aplicada em metros no UTM junto do buffer; o resultado são os
    limites do polígono resultante. Substitui o quadrado fixo centroid±0.005°
    da v3, que truncava a máscara e incluía ~80% de pasto.
    """
    if margin_m < 0:
        raise ValueError(f"margin_m deve ser >= 0, veio {margin_m}")
    poly = buffer_polygon(geometry, buffer_m + margin_m, epsg=epsg)
    minx, miny, maxx, maxy = poly.bounds
    return (
        round(minx, 6),
        round(miny, 6),
        round(maxx, 6),
        round(maxy, 6),
    )


def _grid_transform(ndvi: Any) -> Tuple[Any, Tuple[int, int]]:
    """Affine (pixel→CRS) e shape a partir das coords x/y do NDVI."""
    import numpy as np
    from rasterio.transform import Affine

    if "x" not in ndvi.coords or "y" not in ndvi.coords:
        raise ValueError("ndvi precisa de coordenadas x/y para rasterizar o buffer")
    xs = np.asarray(ndvi["x"].values, dtype="float64")
    ys = np.asarray(ndvi["y"].values, dtype="float64")
    if xs.ndim != 1 or ys.ndim != 1 or xs.size < 2 or ys.size < 2:
        raise ValueError("coordenadas x/y do ndvi devem ser vetores 1-D com 2+ pontos")
    dx = float(xs[1] - xs[0])
    dy = float(ys[1] - ys[0])
    if dx == 0 or dy == 0:
        raise ValueError("resolução x/y do ndvi é zero")
    # x[0]/y[0] são centros de pixel; a origem do Affine é a borda.
    transform = Affine(dx, 0.0, float(xs[0]) - dx / 2.0,
                       0.0, dy, float(ys[0]) - dy / 2.0)
    shape = (int(np.asarray(ndvi).shape[-2]), int(np.asarray(ndvi).shape[-1]))
    if shape != (ys.size, xs.size):
        raise ValueError(
            f"shape do ndvi {shape} não casa com x/y ({ys.size}, {xs.size})"
        )
    return transform, shape


def rasterize_buffer_mask(
    ndvi: Any,
    polygon: Any,
    epsg: int | None = None,
    all_touched: bool = False,
) -> Any:
    """Máscara booleana do polígono do buffer na grade do NDVI.

    `polygon` está em EPSG:4326; a grade do composite está em UTM (`epsg`).
    Pixels cujo centro cai dentro do buffer entram; o resto fica fora.
    Retorna numpy bool com o mesmo shape 2-D de `ndvi`.
    """
    import numpy as np
    import rasterio.features
    from pyproj import Transformer
    from shapely.ops import transform as shp_transform

    transform, shape = _grid_transform(ndvi)
    if epsg is None:
        crs = getattr(getattr(ndvi, "rio", None), "crs", None)
        epsg = crs.to_epsg() if crs is not None else None
    if epsg is None:
        raise ValueError("epsg da grade do ndvi é obrigatório para rasterizar o buffer")

    fwd = Transformer.from_crs("EPSG:4326", f"EPSG:{epsg}", always_xy=True)
    poly_utm = shp_transform(fwd.transform, polygon)
    if poly_utm.is_empty:
        return np.zeros(shape, dtype=bool)

    raster = rasterio.features.rasterize(
        [(poly_utm, 1)],
        out_shape=shape,
        transform=transform,
        fill=0,
        all_touched=all_touched,
        dtype="uint8",
    )
    return raster.astype(bool)


def buffer_metadata(buffer_m: float, margin_m: float = 30.0) -> Dict[str, Any]:
    """Metadados do método do buffer p/ methods.json/manifest (sem geo)."""
    return {
        "buffer_m": buffer_m,
        "bbox_margin_m": margin_m,
        "bbox_method": "buffer_bounds_plus_margin",
        "mask_method": "rasterized_buffer_polygon",
        "stats_relative_to": "buffer_pixels",
        "resolution_m": 10.0,
    }
