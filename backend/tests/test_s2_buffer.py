"""Ticket #5 — stats do composite recortadas pela máscara do buffer.

Sem STAC/rede: a grade e a geometria são sintéticas. Garante o contrato que o
build v4 usa: `frac_critico`/`frac_validos` só contam pixels dentro do buffer,
e máscara vazia/buffer fora do raster falha alto (não publica zero silencioso).
"""

import sys
from pathlib import Path

import numpy as np
import pytest
import xarray as xr
from pyproj import Transformer
from shapely.geometry import LineString

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.buffer_geometry import buffer_polygon  # noqa: E402
from app.services.s2_service import (  # noqa: E402
    S2BufferOutside,
    buffer_stats_for_ndvi,
)

LINE = {
    "type": "LineString",
    "coordinates": [[-52.0, -29.5], [-51.9948, -29.5008]],
}
UTM = 32722


def _grid(cx: float, cy: float, value: float) -> xr.DataArray:
    xs = np.arange(cx - 1000.0, cx + 1000.0, 10.0)
    ys = np.arange(cy + 1000.0, cy - 1000.0, -10.0)
    return xr.DataArray(
        np.full((ys.size, xs.size), value),
        coords={"y": ys, "x": xs},
        dims=("y", "x"),
    )


def _center() -> tuple[float, float]:
    tr = Transformer.from_crs("EPSG:4326", f"EPSG:{UTM}", always_xy=True)
    (x0, y0), (x1, y1) = [tr.transform(*c) for c in LINE["coordinates"]]
    return (x0 + x1) / 2, (y0 + y1) / 2


def test_stats_do_buffer_ignoram_pixels_criticos_fora_da_mascara():
    cx, cy = _center()
    ndvi = _grid(cx, cy, 0.60)
    valid = xr.DataArray(
        np.ones(ndvi.shape, dtype=bool), coords=ndvi.coords, dims=ndvi.dims
    )
    polygon = buffer_polygon(LINE, 200.0)

    # Fora do buffer: crítico. Dentro: saudável e válido.
    ndvi.values[:] = 0.0
    stats, mask = buffer_stats_for_ndvi(ndvi, valid, polygon, epsg=UTM)
    ndvi.values[mask] = 0.60

    stats, mask = buffer_stats_for_ndvi(ndvi, valid, polygon, epsg=UTM)

    assert stats["n_pixels_buffer"] == int(mask.sum())
    assert stats["n_pixels_buffer"] > 0
    assert stats["n_pixels_validos"] == stats["n_pixels_buffer"]
    assert stats["ndvi_mean"] == pytest.approx(0.60)
    assert stats["frac_critico"] == pytest.approx(0.0)
    assert stats["frac_moderado"] == pytest.approx(0.0)
    assert stats["frac_validos"] == pytest.approx(1.0)


def test_frac_validos_do_buffer_usa_so_pixels_do_buffer_no_denominador():
    cx, cy = _center()
    ndvi = _grid(cx, cy, 0.60)
    valid = xr.DataArray(
        np.ones(ndvi.shape, dtype=bool), coords=ndvi.coords, dims=ndvi.dims
    )
    polygon = buffer_polygon(LINE, 200.0)
    _, mask = buffer_stats_for_ndvi(ndvi, valid, polygon, epsg=UTM)

    # Metade dos pixels do buffer é inválida; fora dele, tudo inválido também.
    # `frac_validos` deve ser ~0,5 (denominador = buffer), não ~0,25 (raster).
    idx = np.argwhere(mask)
    valid.values[:] = False
    for r, c in idx[: len(idx) // 2]:
        valid.values[r, c] = True

    stats, _ = buffer_stats_for_ndvi(ndvi, valid, polygon, epsg=UTM)
    assert stats["frac_validos"] == pytest.approx(0.5, abs=0.02)
    assert stats["n_pixels_validos"] == pytest.approx(
        stats["n_pixels_buffer"] / 2, abs=2
    )


def test_buffer_fora_do_raster_falha_alto():
    cx, cy = _center()
    ndvi = _grid(cx + 5000.0, cy, 0.60)  # grade a 5 km do trecho
    valid = xr.DataArray(
        np.ones(ndvi.shape, dtype=bool), coords=ndvi.coords, dims=ndvi.dims
    )

    with pytest.raises(S2BufferOutside, match="fora do raster|máscara vazia"):
        buffer_stats_for_ndvi(
            ndvi, valid, buffer_polygon(LINE, 200.0), epsg=UTM
        )
