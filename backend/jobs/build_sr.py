#!/usr/bin/env python3
"""Build de SR (offline, batch) — NDVI 2,5 m + tiles nos top-N trechos.

Lê backend/data/basins/<basin>/<version>/reaches.geojson (job build_basin),
roda SEN2SRLite nos top-N por score e escreve, de forma atômica:
    sr/<reach_id>/sr_rgbn.tif        (COG 2,5 m, 4 bandas)
    sr/<reach_id>/ndvi_sr.tif        (COG 2,5 m, NaN fora da máscara)
    sr/<reach_id>/tiles/ndvi_sr/{z}/{x}/{y}.png   (XYZ 13–17, paleta YlGn)
    sr_summary.json                   (gates G1/G2 por trecho + proveniência)

Trecho que reprova gate entra com sr_status FAILED + motivo (nunca omisso).

Uso (com backend/jobs/requirements.txt + extras SR instalados):
    python backend/jobs/build_sr.py --basin pardo --version v1 --top-n 12
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import shutil
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

REGEN_DEFAULT = ("2025-06-01", "2025-08-31")
ZOOMS = (13, 14, 15, 16, 17)
TILE_SIZE = 256


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Build de SR 2,5 m por trecho")
    p.add_argument("--basin", default="pardo")
    p.add_argument("--version", default="v1")
    p.add_argument("--top-n", type=int, default=12)
    p.add_argument("--regen-start", default=REGEN_DEFAULT[0])
    p.add_argument("--regen-end", default=REGEN_DEFAULT[1])
    p.add_argument("--cloud-max", type=int, default=20)
    p.add_argument("--data-root", default=None,
                   help="Raiz de bacias (default: JOBS_DATA_DIR)")
    return p.parse_args(argv)


def _data_root(args) -> Path:
    if args.data_root:
        return Path(args.data_root)
    from app.core.config import settings

    return REPO_ROOT / "backend" / settings.JOBS_DATA_DIR


def render_tiles(src_tif: Path, out_dir: Path, vmin=-0.2, vmax=1.0,
                 zooms=ZOOMS) -> int:
    """COG (qualquer CRS) → XYZ PNG WebMercator com paleta YlGn. Lazy deps."""
    import mercantile
    import numpy as np
    from matplotlib import colormaps
    from PIL import Image
    import rasterio
    from rasterio.warp import transform_bounds

    cmap = colormaps["YlGn"]
    n = 0
    with rasterio.open(src_tif) as src:
        w, s, e, no = transform_bounds(src.crs, "EPSG:4326", *src.bounds)
        for z in zooms:
            for tile in mercantile.tiles(w, s, e, no, zooms=[z]):
                img = _render_tile(src, tile, cmap, vmin, vmax)
                if img is None:
                    continue
                dest = out_dir / str(z) / str(tile.x) / f"{tile.y}.png"
                dest.parent.mkdir(parents=True, exist_ok=True)
                img.save(dest)
                n += 1
    return n


def _render_tile(src, tile, cmap, vmin, vmax):
    import mercantile
    import numpy as np
    from PIL import Image
    from rasterio.enums import Resampling
    from rasterio.warp import transform_bounds
    from rasterio.windows import from_bounds

    b = mercantile.xy_bounds(tile)
    try:
        win = from_bounds(b.left, b.bottom, b.right, b.top,
                          transform=src.transform).round_offsets().round_lengths()
    except Exception:
        return None
    if win.width <= 0 or win.height <= 0:
        return None
    arr = src.read(1, window=win, out_shape=(TILE_SIZE, TILE_SIZE),
                   resampling=Resampling.bilinear, boundless=True)
    nodata = src.nodata
    if nodata is not None:
        mask = (arr == nodata) | ~np.isfinite(arr)
    else:
        mask = ~np.isfinite(arr)
    if mask.all():
        return None
    norm = np.clip((np.nan_to_num(arr, nan=vmin) - vmin) / (vmax - vmin), 0, 1)
    rgba = (cmap(norm) * 255).astype("uint8")
    rgba[mask, 3] = 0
    return Image.fromarray(rgba)


def process_reach(reach: dict, args, sr_model, sr_device, tmp_version: Path) -> dict:
    """Um trecho: composite → SR → COGs → tiles → gates. Retorna registro."""
    import numpy as np

    from app.services import s2_service as s2
    from app.services import sr_service as sr

    rid = reach["properties"]["id"]
    lon, lat = _reach_center(reach)
    # janela 224 px @10 m ao redor do centroide (cobre o trecho de 500 m)
    dlat = 1120 / 111320.0
    dlon = 1120 / (111320.0 * max(abs(np.cos(np.radians(lat))), 0.2))
    bbox = (lon - dlon, lat - dlat, lon + dlon, lat + dlat)

    rec: dict = {"id": rid, "sr_status": "FAILED", "reason": None}
    try:
        comp = s2.composite_rgbn(bbox, args.regen_start, args.regen_end,
                                 args.cloud_max, top_n=3)
        rgbn = np.stack([(comp.bands[b].where(comp.valid).values / 10000.0)
                         .astype("float32") for b in sr.BAND_ORDER])
        out, info = sr.super_resolve(sr_model, rgbn, sr_device)
        y0, x0 = info["crop_y0"], info["crop_x0"]
        valid_crop = np.asarray(comp.valid.values)[y0:y0 + info["crop_hw"][0],
                                                   x0:x0 + info["crop_hw"][1]]
        v25 = sr.upsample_valid_mask(valid_crop)
        ndvi_sr, diag = sr.ndvi_from_sr(out, v25)

        rdir = tmp_version / "sr" / rid
        rdir.mkdir(parents=True, exist_ok=True)
        _write_cog(rdir / "sr_rgbn.tif", out, bbox, y0, x0, comp.epsg)
        _write_cog(rdir / "ndvi_sr.tif", ndvi_sr[None].astype("float32"),
                   bbox, y0, x0, comp.epsg, nodata=float("nan"))
        n_tiles = render_tiles(rdir / "ndvi_sr.tif", rdir / "tiles" / "ndvi_sr")

        red10 = (comp.bands["B04"].where(comp.valid).values / 10000.0)
        nir10 = (comp.bands["B08"].where(comp.valid).values / 10000.0)
        h = slice(y0, y0 + info["crop_hw"][0])
        w = slice(x0, x0 + info["crop_hw"][1])
        g1 = sr.wald_gates(out, red10[h, w], nir10[h, w])
        g2 = sr.soil_bias(ndvi_sr,
                          red10[h, w], nir10[h, w],
                          np.asarray(comp.scl.values)[h, w])
        passed = g1["status"] == "PASS" and g2["status"] in ("PASS", "SKIPPED")
        rec.update({
            "sr_status": "PASS" if passed else "FAILED",
            "reason": None if passed else {"g1": g1, "g2": g2},
            "g1": g1, "g2": g2,
            "ndvi_sr": {k: (round(v, 4) if isinstance(v, float) else v)
                        for k, v in diag.items()},
            "n_tiles": n_tiles,
            "files": ["sr_rgbn.tif", "ndvi_sr.tif", "tiles/ndvi_sr/{z}/{x}/{y}.png"],
        })
    except Exception as e:  # noqa: BLE001 — trecho falho entra no summary, não aborta
        rec["reason"] = f"{type(e).__name__}: {e}"
    return rec


def _reach_center(reach: dict):
    import numpy as np

    coords = np.asarray(reach["geometry"]["coordinates"], dtype=float).reshape(-1, 2)
    return float(coords[:, 0].mean()), float(coords[:, 1].mean())


def _write_cog(path: Path, arr, bbox, y0: int, x0: int, epsg: int,
               nodata=None) -> None:
    import numpy as np
    import rasterio
    from rasterio.transform import from_origin

    _, h, w = arr.shape
    west = bbox[0] + x0 * 10.0
    north = bbox[3] - y0 * 10.0
    transform = from_origin(west, north, 2.5, 2.5)
    profile = {"driver": "GTiff", "height": h, "width": w, "count": arr.shape[0],
               "dtype": "float32", "crs": f"EPSG:{epsg}", "transform": transform,
               "tiled": True, "compress": "deflate"}
    if nodata is not None and not (isinstance(nodata, float) and np.isnan(nodata)):
        profile["nodata"] = nodata
    with rasterio.open(path, "w", **profile) as dst:
        dst.write(np.asarray(arr, dtype="float32"))


def main(argv=None) -> int:
    args = parse_args(argv)
    vdir = _data_root(args) / args.basin / args.version
    fc = json.loads((vdir / "reaches.geojson").read_text())
    feats = sorted(fc["features"],
                   key=lambda f: f["properties"].get("score", 0), reverse=True)
    top = feats[: args.top_n]
    print(f"trechos SR: {len(top)} (top-{args.top_n} de {len(feats)})")

    from app.services import sr_service as sr

    sr.ensure_weights()
    model, device = sr.load_model()
    print(f"modelo OK em {device}; pesos sha={sr.weights_sha()[:12]}…")

    tmp = Path(tempfile.mkdtemp(prefix="build_sr_"))
    records = []
    try:
        for i, reach in enumerate(top):
            print(f"[{i + 1}/{len(top)}] {reach['properties']['id']} …")
            rec = process_reach(reach, args, model, device, tmp)
            print(f"  -> {rec['sr_status']}", rec.get("reason") or "")
            records.append(rec)
        summary = {
            "basin": args.basin,
            "version": args.version,
            "built_at": dt.datetime.now(dt.timezone.utc).isoformat(),
            "model": {"variant": sr.VARIANT_RGBN_X4,
                      "weights_sha256": sr.weights_sha()},
            "n_reaches": len(records),
            "n_pass": sum(1 for r in records if r["sr_status"] == "PASS"),
            "reaches": records,
        }
        (tmp / "sr_summary.json").write_text(json.dumps(summary, indent=2) + "\n")
        # publica atomicamente dentro da versão (sr/ + sr_summary.json)
        sdir = vdir / "sr"
        if sdir.exists():
            shutil.rmtree(sdir)
        shutil.move(str(tmp / "sr"), str(sdir))
        shutil.move(str(tmp / "sr_summary.json"), str(vdir / "sr_summary.json"))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    ok = sum(1 for r in records if r["sr_status"] == "PASS")
    print(f"OK: {ok}/{len(records)} PASS → {vdir}/sr")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
