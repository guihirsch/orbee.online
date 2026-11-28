"""Ticket #4 — função pura de estatísticas do buffer (sem rede, sem I/O).

Contrato (spec #3):
- NDVI médio/mín/máx dentro do buffer.
- `frac_validos` é relativa aos pixels do buffer.
- `frac_critico`/`frac_moderado` são relativas aos pixels VÁLIDOS do buffer.
"""

import math
import sys
from pathlib import Path

import numpy as np
import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.buffer_stats import buffer_stats  # noqa: E402


def test_mascara_toda_verdadeira_preserva_estatisticas_do_bbox():
    # Raster 3x3 totalmente válido: valores esperados calculados à mão.
    ndvi = np.array([
        [0.10, 0.30, 0.60],
        [0.20, 0.50, 0.90],
        [0.05, 0.45, 0.70],
    ])
    valid = np.ones_like(ndvi, dtype=bool)
    mask = np.ones_like(ndvi, dtype=bool)

    s = buffer_stats(ndvi, valid, mask)

    assert s["ndvi_mean"] == pytest.approx(3.80 / 9)
    assert s["ndvi_min"] == pytest.approx(0.05)
    assert s["ndvi_max"] == pytest.approx(0.90)
    assert s["frac_validos"] == pytest.approx(1.0)
    assert s["frac_critico"] == pytest.approx(2.0 / 9)    # 0.10 e 0.05
    assert s["frac_moderado"] == pytest.approx(3.0 / 9)  # 0.30, 0.20 e 0.45
    assert set(s) == {
        "ndvi_mean", "ndvi_min", "ndvi_max",
        "frac_validos", "frac_critico", "frac_moderado",
    }


def test_buffer_recorta_pixels_e_invalidos_saem_do_denominador():
    # Buffer = bloco central 3x3. Fora dele, tudo 0.0 (crítico) — não pode contar.
    ndvi = np.array([
        [0.00, 0.00, 0.00, 0.00, 0.00],
        [0.00, 0.10, 0.30, 0.60, 0.00],
        [0.00, 0.20, 0.00, 0.90, 0.00],  # 0.00 central é inválido
        [0.00, 0.45, 0.70, 0.55, 0.00],
        [0.00, 0.00, 0.00, 0.00, 0.00],
    ])
    valid = np.ones_like(ndvi, dtype=bool)
    valid[2, 2] = False
    mask = np.zeros_like(ndvi, dtype=bool)
    mask[1:4, 1:4] = True

    s = buffer_stats(ndvi, valid, mask)

    # 8 pixels válidos no buffer; fora do buffer e inválido não entram.
    assert s["frac_validos"] == pytest.approx(8.0 / 9.0)
    assert s["frac_critico"] == pytest.approx(1.0 / 8.0)
    assert s["frac_moderado"] == pytest.approx(3.0 / 8.0)
    assert s["ndvi_mean"] == pytest.approx(3.80 / 8.0)
    assert s["ndvi_min"] == pytest.approx(0.10)
    assert s["ndvi_max"] == pytest.approx(0.90)


def test_nan_no_ndvi_e_ignorado():
    ndvi = np.array([
        [0.10, np.nan, 0.60],
        [0.20, 0.30, 0.40],
    ])
    valid = np.ones_like(ndvi, dtype=bool)
    mask = np.ones_like(ndvi, dtype=bool)

    s = buffer_stats(ndvi, valid, mask)

    assert s["frac_validos"] == pytest.approx(5.0 / 6.0)
    assert s["ndvi_mean"] == pytest.approx(1.60 / 5.0)
    assert s["ndvi_min"] == pytest.approx(0.10)
    assert s["ndvi_max"] == pytest.approx(0.60)
    assert s["frac_critico"] == pytest.approx(1.0 / 5.0)
    assert s["frac_moderado"] == pytest.approx(3.0 / 5.0)


def test_mascara_vazia_nao_publica_zero_enganoso():
    ndvi = np.full((2, 2), 0.1)
    valid = np.ones_like(ndvi, dtype=bool)
    mask = np.zeros_like(ndvi, dtype=bool)

    s = buffer_stats(ndvi, valid, mask)

    assert math.isnan(s["ndvi_mean"])
    assert math.isnan(s["ndvi_min"])
    assert math.isnan(s["ndvi_max"])
    assert s["frac_validos"] == 0.0
    assert s["frac_critico"] == 0.0
    assert s["frac_moderado"] == 0.0


def test_buffer_todo_invalido_nao_divide_por_zero():
    ndvi = np.full((2, 2), 0.1)
    valid = np.zeros_like(ndvi, dtype=bool)
    mask = np.ones_like(ndvi, dtype=bool)

    s = buffer_stats(ndvi, valid, mask)

    assert math.isnan(s["ndvi_mean"])
    assert math.isnan(s["ndvi_min"])
    assert math.isnan(s["ndvi_max"])
    assert s["frac_validos"] == 0.0
    assert s["frac_critico"] == 0.0
    assert s["frac_moderado"] == 0.0


def test_shapes_incompativeis_falham_alto():
    ndvi = np.zeros((2, 2))
    valid = np.ones((2, 2), dtype=bool)
    mask = np.ones((3, 3), dtype=bool)

    with pytest.raises(ValueError, match="mesmo shape"):
        buffer_stats(ndvi, valid, mask)
