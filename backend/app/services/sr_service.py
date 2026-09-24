"""SR Service — super-resolução Sentinel-2 RGBN 10 m → 2,5 m (SEN2SRLite).

Port fiel das Células 4c/4d do notebook de validação (Fase 0 VERDE), incluindo
as duas lições aprendidas na sessão:
  1. `predict_large` quebra em retalhos de borda ≠128 px → recorte central
     para 224×224 (= 128 + 96) antes da inferência.
  2. NDVI-SR calculado SÓ dentro da máscara válida (fora dela o denominador
     ~0 explode: min=-85483 observado) + guarda de intervalo.

Pesos: baixados via mlstac (HuggingFace tacofoundation/sen2sr) para
JOBS_DATA_DIR/models — fora do repo, com SHA no manifest. Roda em CPU.

Imports pesados (torch/sen2sr/mlstac) são LAZY. Lógica numpy pura
(`center_crop_hw`, `upsample_valid_mask`, `ndvi_from_sr`, métricas) é
testável sem torch.
"""

from __future__ import annotations

import asyncio
import hashlib
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Convenção ESA OpenSR (128→512) + ordem oficial de bandas do exemplo RGBN
PATCH, OVERLAP, FACTOR = 128, 32, 4
CROP_HW = 224  # 128 + 96: tiles exatos, sem retalho de borda
BAND_ORDER = ["B04", "B03", "B02", "B08"]
RED_IDX, NIR_IDX = 0, 3
DEN_FLOOR = 1e-4  # denominador mínimo (lição do G2 espúrio)

VARIANT_RGBN_X4 = "NonReference_RGBN_x4"
MLM_URL = ("https://huggingface.co/tacofoundation/sen2sr/resolve/main/"
           "SEN2SRLite/{variant}/mlm.json")


class SRError(Exception):
    """Falha de infraestrutura/upstream do SR."""


class SRBackendMissing(SRError):
    """torch/sen2sr/mlstac ausentes (jobs/requirements + extras de SR)."""


class SRWeightsMissing(SRError):
    """Checkpoint não baixado (ver ensure_weights)."""


def _require_backend():
    try:
        import torch  # noqa: F401
        import sen2sr  # noqa: F401
        import mlstac  # noqa: F401
    except ImportError as e:
        raise SRBackendMissing(
            "SR exige torch + sen2sr + mlstac (+ cubo p/ cubos). "
            "Instale os extras de SR de backend/jobs/requirements.txt"
        ) from e


# ---------------------------------------------------------------------------
# Lógica pura (sem torch; testável em qualquer ambiente)


def center_crop_hw(arr, hw: int = CROP_HW):
    """Recorta (C,H,W) ao centro para ≤hw×hw. Puro numpy."""
    import numpy as np

    _, h, w = arr.shape
    h1, w1 = min(h, hw), min(w, hw)
    y0, x0 = (h - h1) // 2, (w - w1) // 2
    return np.ascontiguousarray(arr[:, y0:y0 + h1, x0:x0 + w1])


def upsample_valid_mask(valid_10m, factor: int = FACTOR):
    """Máscara válida 10 m → 2,5 m (nearest). Puro numpy."""
    import numpy as np

    v = np.asarray(valid_10m).astype(bool)
    return np.repeat(np.repeat(v, factor, axis=0), factor, axis=1)


def ndvi_from_sr(sr_rgbn, valid_25m) -> Tuple[Any, Dict[str, float]]:
    """NDVI-SR mascarado + diagnósticos. Puro numpy.

    sr_rgbn: (4,H,W) float32 0..1, ordem BAND_ORDER. valid_25m: bool (H,W).
    Retorna (ndvi_sr com NaN fora da máscara, {"frac_fora_11", ...}).
    """
    import numpy as np

    red = np.asarray(sr_rgbn[RED_IDX], dtype=np.float64)
    nir = np.asarray(sr_rgbn[NIR_IDX], dtype=np.float64)
    vmask = np.asarray(valid_25m).astype(bool)
    assert vmask.shape == red.shape, (vmask.shape, red.shape)
    den = nir + red
    ok = vmask & (den > DEN_FLOOR)
    ndvi = np.where(ok, (nir - red) / np.clip(den, DEN_FLOOR, None), np.nan)
    vv = ndvi[vmask]
    diag = {
        "n_validos": int(vmask.sum()),
        "frac_fora_11": float((np.abs(vv) > 1).mean()) if vv.size else float("nan"),
        "ndvi_min": float(np.nanmin(ndvi)) if vv.size else float("nan"),
        "ndvi_max": float(np.nanmax(ndvi)) if vv.size else float("nan"),
        "ndvi_mean": float(np.nanmean(ndvi)) if vv.size else float("nan"),
    }
    return ndvi, diag


def _finite(a, b):
    import numpy as np

    a = np.asarray(a, dtype=np.float64)
    b = np.asarray(b, dtype=np.float64)
    m = np.isfinite(a) & np.isfinite(b)
    return a[m], b[m]


def rmse(a, b) -> float:
    import numpy as np

    a, b = _finite(a, b)
    return float(np.sqrt(np.mean((a - b) ** 2))) if a.size else float("nan")


def psnr(a, b, peak: float = 2.0) -> float:
    import numpy as np

    r = rmse(a, b)
    return float(20 * np.log10(peak / r)) if r > 0 else float("inf")


def ergas(sr_bands, ref_bands, scale: int = FACTOR) -> float:
    import numpy as np

    terms = []
    for s, r in zip(sr_bands, ref_bands):
        sv, rv = _finite(s, r)
        mu = rv.mean()
        terms.append(((sv - rv) ** 2).mean() / mu ** 2 if mu else float("nan"))
    return float(100 / scale * np.sqrt(np.nanmean(terms)))


def sam(red_s, nir_s, red_r, nir_r) -> float:
    import numpy as np

    s = np.stack([np.asarray(red_s).ravel(), np.asarray(nir_s).ravel()], -1)
    r = np.stack([np.asarray(red_r).ravel(), np.asarray(nir_r).ravel()], -1)
    ok = np.isfinite(s).all(1) & np.isfinite(r).all(1)
    s, r = s[ok], r[ok]
    cosang = (s * r).sum(1) / (
        np.linalg.norm(s, axis=1) * np.linalg.norm(r, axis=1) + 1e-12)
    return float(np.degrees(np.arccos(np.clip(cosang, -1, 1))).mean())


def coarsen_4x(arr):
    """Média 4×4 ignorando NaN (Wald: SR→10 m). Puro numpy."""
    import warnings

    import numpy as np

    a = np.asarray(arr, dtype=np.float64)
    h, w = (d // 4 * 4 for d in a.shape)
    a = a[:h, :w].reshape(h // 4, 4, w // 4, 4)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        return np.nanmean(a, axis=(1, 3))


def wald_gates(sr_rgbn, red10, nir10) -> Dict[str, Any]:
    """G1 (Wald) sobre bandas red/nir. Entradas já na mesma grade 10 m? Não:
    faz o coarsen aqui. Retorna dict com status."""
    rs_c = coarsen_4x(sr_rgbn[RED_IDX])
    ns_c = coarsen_4x(sr_rgbn[NIR_IDX])
    h = min(rs_c.shape[0], red10.shape[0])
    w = min(rs_c.shape[1], red10.shape[1])
    e = ergas([rs_c[:h, :w], ns_c[:h, :w]], [red10[:h, :w], nir10[:h, :w]])
    s = sam(rs_c[:h, :w], ns_c[:h, :w], red10[:h, :w], nir10[:h, :w])
    p = psnr(ns_c[:h, :w], nir10[:h, :w])
    ok = bool(e < 3 and s < 5 and p > 30)
    return {"status": "PASS" if ok else "FAIL",
            "ergas": round(e, 3), "sam": round(s, 3), "psnr_nir": round(p, 2)}


def soil_bias(ndvi_sr, red10, nir10, scl10,
              ndvi_critical: float = 0.2) -> Dict[str, Any]:
    """G2: viés em solo nu válido (SCL==5, NDVI_10m<0,2)."""
    import numpy as np

    red10 = np.asarray(red10, dtype=np.float64)
    nir10 = np.asarray(nir10, dtype=np.float64)
    ndvi10 = (nir10 - red10) / np.clip(nir10 + red10, 1e-6, None)
    sr_c = coarsen_4x(np.where(np.isfinite(ndvi_sr), ndvi_sr, np.nan))
    h = min(sr_c.shape[0], ndvi10.shape[0])
    w = min(sr_c.shape[1], ndvi10.shape[1])
    solo = ((np.asarray(scl10)[:h, :w] == 5) & (ndvi10[:h, :w] < ndvi_critical)
            & np.isfinite(ndvi10[:h, :w]) & np.isfinite(sr_c[:h, :w]))
    if int(solo.sum()) <= 50:
        return {"status": "SKIPPED", "nota": "pouco solo nu válido"}
    vies = float((sr_c[:h, :w][solo] - ndvi10[:h, :w][solo]).mean())
    return {"status": "PASS" if abs(vies) <= 0.05 else "FAIL",
            "vies_solo": round(vies, 4), "n_solo": int(solo.sum())}


# ---------------------------------------------------------------------------
# Backend pesado (job offline; torch/sen2sr/mlstac)


def models_dir() -> Path:
    from app.core.config import settings

    # sr_service.py está em backend/app/services/ → parents[2] = backend/
    # (api.py usa parents[3] porque está um nível acima; não copiar)
    root = Path(__file__).resolve().parents[2] / settings.JOBS_DATA_DIR
    return root / "models"


def ensure_weights(variant: str = VARIANT_RGBN_X4,
                   dest: Optional[Path] = None) -> Path:
    """Baixa o checkpoint via mlstac (idempotente). Retorna o diretório."""
    _require_backend()
    import mlstac

    dest = dest or (models_dir() / f"SEN2SRLite_{variant}")
    if (dest / "mlm.json").is_file() and any(dest.glob("*.safetensor*")):
        return dest
    dest.mkdir(parents=True, exist_ok=True)
    mlstac.download(file=MLM_URL.format(variant=variant), output_dir=str(dest))
    return dest


def weights_sha(variant: str = VARIANT_RGBN_X4) -> str:
    """SHA-256 do maior .safetensors (proveniência p/ manifest)."""
    cands = sorted((models_dir() / f"SEN2SRLite_{variant}").glob("*.safetensor*"),
                   key=lambda p: p.stat().st_size, reverse=True)
    if not cands:
        raise SRWeightsMissing(f"sem pesos em {variant}; rode ensure_weights()")
    h = hashlib.sha256()
    with open(cands[0], "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_model(variant: str = VARIANT_RGBN_X4, device: Optional[str] = None):
    """Carrega modelo compilado mlstac. Retorna (model, device)."""
    _require_backend()
    import torch
    import mlstac

    d = models_dir() / f"SEN2SRLite_{variant}"
    if not (d / "mlm.json").is_file():
        raise SRWeightsMissing(f"checkpoint ausente em {d}; rode ensure_weights()")
    dev = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))
    model = mlstac.load(str(d)).compiled_model(device=dev)
    return model, dev


def super_resolve(model, rgbn_10m, device=None, overlap: int = OVERLAP):
    """RGBN (4,H,W) 0..1 → SR (4,H*4,W*4). Aplica o crop 224 (lição Fase 0).

    Retorna (sr, info) com crop_y0/x0/hw para georreferenciar a saída.
    """
    _require_backend()
    import numpy as np
    import torch
    import sen2sr

    arr = np.asarray(rgbn_10m, dtype=np.float32)
    _, h, w = arr.shape
    h1, w1 = min(h, CROP_HW), min(w, CROP_HW)
    y0, x0 = (h - h1) // 2, (w - w1) // 2
    x = np.ascontiguousarray(arr[:, y0:y0 + h1, x0:x0 + w1])
    dev = device or next(model.parameters()).device
    xt = torch.nan_to_num(torch.from_numpy(x).float().to(dev),
                          nan=0.0, posinf=0.0, neginf=0.0)
    with torch.no_grad():
        out = sen2sr.predict_large(model=model, X=xt, overlap=overlap)
    info = {"crop_y0": y0, "crop_x0": x0, "crop_hw": (h1, w1),
            "input_hw": (h, w)}
    return out.detach().cpu().numpy(), info


async def super_resolve_async(*args: Any, **kwargs: Any):
    """Wrapper async (thread; não bloqueia o event loop)."""
    return await asyncio.to_thread(super_resolve, *args, **kwargs)
