"""Estatísticas puras de NDVI sobre uma máscara de buffer (ticket #4).

Módulo sem rede e sem I/O: numpy in, dict out. É o seam que permite testar o
recorte do buffer sem STAC. A função é usada pelo `s2_service` com uma máscara
"tudo verdadeiro" (preserva o pipeline atual) e, a partir da v4, com a máscara
rasterizada do buffer de 200 m.
"""

from __future__ import annotations

from typing import Any, Dict


def buffer_stats(
    ndvi: Any,
    valid: Any,
    mask: Any,
    ndvi_critical: float = 0.2,
    ndvi_moderate: float = 0.5,
) -> Dict[str, float]:
    """Média/mín/máx de NDVI e frações dentro do buffer."""
    import numpy as np

    ndvi = np.asarray(ndvi, dtype=np.float64)
    valid = np.asarray(valid).astype(bool)
    mask = np.asarray(mask).astype(bool)

    if ndvi.shape != valid.shape or ndvi.shape != mask.shape:
        raise ValueError(
            f"ndvi, valid e mask devem ter o mesmo shape: "
            f"{ndvi.shape}, {valid.shape}, {mask.shape}"
        )

    n_buffer = int(mask.sum())
    # Só pixels do buffer, válidos pela máscara e com NDVI finito contam.
    ok = mask & valid & np.isfinite(ndvi)
    n_valid = int(ok.sum())
    if n_buffer == 0 or n_valid == 0:
        return {
            "ndvi_mean": float("nan"),
            "ndvi_min": float("nan"),
            "ndvi_max": float("nan"),
            "frac_validos": 0.0,
            "frac_critico": 0.0,
            "frac_moderado": 0.0,
        }

    vals = ndvi[ok]
    return {
        "ndvi_mean": float(vals.mean()),
        "ndvi_min": float(vals.min()),
        "ndvi_max": float(vals.max()),
        "frac_validos": n_valid / n_buffer,
        "frac_critico": float((vals < ndvi_critical).mean()),
        "frac_moderado": float(
            ((vals >= ndvi_critical) & (vals < ndvi_moderate)).mean()
        ),
    }
