"""Ticket #5 — geometria do buffer ripário (sem rede, sem STAC).

Contrato (spec #3, ticket #5):
- o bbox de busca STAC é derivado dos limites do buffer + margem;
- o buffer de 200 m é rasterizado na grade do NDVI (10 m);
- pixels fora do buffer não entram em nenhuma estatística.
"""

import math
import sys
from pathlib import Path

import numpy as np
import pytest
import xarray as xr
from pyproj import Geod, Transformer
from shapely.geometry import LineString, shape

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.buffer_geometry import (  # noqa: E402
    buffer_polygon,
    rasterize_buffer_mask,
    search_bbox,
)
from app.services.buffer_stats import buffer_stats  # noqa: E402

# Trecho sintético ~500 m no Vale do Taquari (EPSG:4326).
LINE = {
    "type": "LineString",
    "coordinates": [[-52.0, -29.5], [-51.9948, -29.5008]],
}
UTM = 32722  # zona 22S


def _utm_line() -> LineString:
    tr = Transformer.from_crs("EPSG:4326", f"EPSG:{UTM}", always_xy=True)
    return LineString([tr.transform(*c) for c in LINE["coordinates"]])


def test_bbox_de_busca_e_derivado_do_buffer_mais_margem():
    tight = buffer_polygon(LINE, 200.0).bounds
    bbox = search_bbox(LINE, 200.0, margin_m=30.0)
    wide = buffer_polygon(LINE, 230.0).bounds

    # O bbox é exatamente os limites do buffer + margem (mesma geometria).
    for a, b in zip(bbox, wide):
        assert a == pytest.approx(b, abs=1e-6)

    # E é estritamente maior que o buffer sem margem em todos os lados.
    assert bbox[0] < tight[0] and bbox[1] < tight[1]
    assert bbox[2] > tight[2] and bbox[3] > tight[3]

    # A folga corresponde a ~30 m, não ao quadrado fixo de ~1 km da v3.
    geod = Geod(ellps="WGS84")
    _, _, west = geod.inv(bbox[0], -29.5, tight[0], -29.5)
    _, _, south = geod.inv(-52.0, bbox[1], -52.0, tight[1])
    assert 20.0 <= abs(west) <= 45.0
    assert 20.0 <= abs(south) <= 45.0

    width_m = abs(geod.inv(bbox[0], -29.5, bbox[2], -29.5)[2])
    height_m = abs(geod.inv(-52.0, bbox[1], -52.0, bbox[3])[2])
    # A v3 usava ±0,005° (~1,1 km de altura) ao redor do centroide; o bbox do
    # buffer acompanha o trecho (~550 m de altura p/ uma linha ~500 m).
    assert height_m < 700.0
    assert width_m < 1100.0


def test_mascara_rasterizada_na_grade_do_ndvi_exclui_fora_do_buffer():
    tr = Transformer.from_crs("EPSG:4326", f"EPSG:{UTM}", always_xy=True)
    x0, y0 = tr.transform(*LINE["coordinates"][0])
    x1, y1 = tr.transform(*LINE["coordinates"][1])
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

    # Grade de 10 m, 2 km × 2 km, no mesmo CRS do composite (UTM 22S).
    xs = np.arange(cx - 1000.0, cx + 1000.0, 10.0)
    ys = np.arange(cy + 1000.0, cy - 1000.0, -10.0)
    ndvi = xr.DataArray(
        np.full((ys.size, xs.size), 0.60),  # dentro: saudável
        coords={"y": ys, "x": xs},
        dims=("y", "x"),
    )
    # Fora do buffer, tudo crítico (0,0): se vazar, frac_critico > 0.
    polygon = buffer_polygon(LINE, 200.0)
    mask = rasterize_buffer_mask(ndvi, polygon, epsg=UTM)
    ndvi.values[~mask] = 0.0
    valid = np.ones_like(ndvi.values, dtype=bool)

    assert mask.dtype == bool
    assert mask.any()
    assert not mask[0, 0] and not mask[-1, -1]

    # Área do buffer / área do pixel (10 m): cápsula ~500×400 + pontas.
    utm_poly = LineString([tr.transform(*c) for c in LINE["coordinates"]]).buffer(200.0)
    expected_px = utm_poly.area / 100.0
    assert mask.sum() == pytest.approx(expected_px, rel=0.05)

    stats = buffer_stats(ndvi, valid, mask)
    assert stats["frac_critico"] == pytest.approx(0.0)
    assert stats["frac_validos"] == pytest.approx(1.0)
    assert stats["ndvi_mean"] == pytest.approx(0.60)


def test_mascara_vazia_quando_buffer_cai_fora_do_raster():
    tr = Transformer.from_crs("EPSG:4326", f"EPSG:{UTM}", always_xy=True)
    x0, y0 = tr.transform(*LINE["coordinates"][0])
    # Grade a ~5 km do trecho: o buffer de 200 m não toca nenhum pixel.
    xs = np.arange(x0 + 5000.0, x0 + 7000.0, 10.0)
    ys = np.arange(y0 + 2000.0, y0, -10.0)
    ndvi = xr.DataArray(
        np.full((ys.size, xs.size), 0.6),
        coords={"y": ys, "x": xs},
        dims=("y", "x"),
    )

    mask = rasterize_buffer_mask(ndvi, buffer_polygon(LINE, 200.0), epsg=UTM)

    assert mask.shape == ndvi.shape
    assert mask.sum() == 0


def test_linha_invalida_falha_alto():
    with pytest.raises(ValueError, match="geometria"):
        buffer_polygon({"type": "Point", "coordinates": [0, 0]}, 200.0)

    with pytest.raises(ValueError, match="buffer_m"):
        buffer_polygon(LINE, 0.0)


def test_ndvi_sem_coordenadas_x_y_falha_alto():
    ndvi = xr.DataArray(np.zeros((2, 2)), dims=("a", "b"))
    with pytest.raises(ValueError, match="x/y"):
        rasterize_buffer_mask(ndvi, buffer_polygon(LINE, 200.0), epsg=UTM)


def test_geometria_aceita_multilinestring():
    shape_ = {
        "type": "MultiLineString",
        "coordinates": [
            [[-52.0, -29.5], [-51.997, -29.5]],
            [[-51.997, -29.5], [-51.9948, -29.5008]],
        ],
    }
    poly = buffer_polygon(shape_, 200.0)
    assert math.isfinite(poly.area)
    assert poly.area > 0
    assert shape(poly.__geo_interface__).is_valid
