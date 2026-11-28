#!/usr/bin/env python3
"""Build de bacia (offline, batch) — gera artefatos versionados da v2.

Uso típico (com backend/jobs/requirements.txt instalado):
    python backend/jobs/build_basin.py --basin pardo \\
        --region "Sinimbu, Rio Grande do Sul, Brasil" \\
        --pilot-bbox -52.7608 -29.5547 -52.4759 -29.3064 \\
        --limit-reaches 0 --out backend/data/basins/pardo/v1

Modo sintético (sem rede/deps geo; p/ validar pipeline e API):
    python backend/jobs/build_basin.py --basin pardo --synthetic 8 \\
        --out backend/data/basins/pardo/v1

Saídas (build atômico: escreve em <out>.tmp e renomeia no fim):
    reaches.geojson, summary.json, methods.json, manifest.json

Janelas padrão espelham a Fase 0 (v2_validation/).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import shutil
import sys
import tempfile
from pathlib import Path

# Permite `python backend/jobs/build_basin.py` de qualquer cwd
REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

WINDOWS_DEFAULT = {
    # v4: baseline de mesma estação (inverno/2023) e janela atual (2026);
    # 2025 fica como regen_2025 para comparação de um vs dois anos.
    "baseline": ("2023-06-01", "2023-08-31"),
    "pre": ("2024-01-01", "2024-03-31"),
    "pos": ("2024-06-01", "2024-08-31"),
    "regen_2025": ("2025-06-01", "2025-08-31"),
    "regen": ("2026-06-01", "2026-08-31"),
}
BASELINE_WINDOW = "baseline"


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Build de artefatos v2 por bacia")
    p.add_argument("--basin", default="pardo")
    p.add_argument("--region", default="Sinimbu, Rio Grande do Sul, Brasil")
    p.add_argument("--buffer-m", type=float, default=200.0)
    p.add_argument("--buffer-margin-m", type=float, default=30.0,
                   help="Margem (m) somada ao buffer no bbox de busca STAC")
    p.add_argument("--reach-length-m", type=float, default=500.0)
    p.add_argument("--cloud-max", type=int, default=20)
    p.add_argument("--top-n", type=int, default=3)
    p.add_argument("--retries", type=int, default=2,
                   help="Tentativas extras por janela em erro transitório de S2")
    p.add_argument("--pilot-bbox", nargs=4, type=float, default=None,
                   metavar=("MINX", "MINY", "MAXX", "MAXY"),
                   help="Restringe a trechos com centroide dentro do bbox (piloto)")
    p.add_argument("--limit-reaches", type=int, default=0,
                   help="0 = sem limite; N > 0 processa só os N primeiros")
    p.add_argument("--river", type=str, default=None,
                   help="Filtra river_key por substring (ex. taquari)")
    p.add_argument("--reaches-from", default=None,
                   help="GeoJSON de trechos já segmentados (ex. v3): pula OSM "
                        "e refaz só as estatísticas/composite do build")
    p.add_argument("--sample", type=int, default=0, metavar="K",
                   help="0 = sem amostragem; K > 0 escolhe K trechos espaçados "
                        "uniformemente por latitude (rio N→S) em vez dos N primeiros")
    p.add_argument("--synthetic", type=int, default=0, metavar="N",
                   help="Gera N trechos sintéticos (sem rede/deps geo)")
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--out", required=True, help="Diretório de saída versionado")
    return p.parse_args(argv)


def _union_bbox(reaches: list) -> list | None:
    boxes = [r.get("search_bbox") for r in reaches if r.get("search_bbox")]
    if not boxes:
        return None
    return [
        round(min(b[0] for b in boxes), 6),
        round(min(b[1] for b in boxes), 6),
        round(max(b[2] for b in boxes), 6),
        round(max(b[3] for b in boxes), 6),
    ]


def _manifest(basin: str, args: argparse.Namespace, n_reaches: int,
              reaches: list | None = None) -> dict:
    synthetic = bool(args.synthetic)
    return {
        "basin": basin,
        "built_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "methods_version": _methods_version(),
        "region": args.region,
        "buffer_m": args.buffer_m,
        "buffer_margin_m": args.buffer_margin_m,
        "bbox_method": "buffer_bounds_plus_margin",
        "mask_method": (
            "synthetic_rasterized_buffer_polygon" if synthetic
            else "rasterized_buffer_polygon"
        ),
        "stats_relative_to": "buffer_pixels",
        "baseline_window": list(WINDOWS_DEFAULT[BASELINE_WINDOW]),
        "windows": {w: list(v) for w, v in WINDOWS_DEFAULT.items()},
        "search_bbox": _union_bbox(reaches or []),
        "reach_length_m": args.reach_length_m,
        "cloud_max": args.cloud_max,
        "top_n": args.top_n,
        "pilot_bbox": args.pilot_bbox,
        "river": getattr(args, "river", None),
        "sample": getattr(args, "sample", 0),
        "n_reaches": n_reaches,
        "synthetic": synthetic,
        "files": ["reaches.geojson", "summary.json", "methods.json"],
    }


def _methods_version() -> str:
    from app.core.priority_weights import METHODS_VERSION

    return METHODS_VERSION


def _write_json(path: Path, obj: dict) -> None:
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n")


def run_synthetic(args: argparse.Namespace, out: Path) -> dict:
    """Pipeline completo com stats sintéticas (sem rede, sem deps geo).

    As stats imitam o contrato da v4 (máscara do buffer), inclusive
    `n_pixels_buffer`/`n_pixels_validos` e o bbox derivado, para o teste de
    contrato exercitar o mesmo schema publicado pelo build real.
    """
    import random

    from app.services.reaches_service import stable_reach_id

    rng = random.Random(args.seed)
    # Corredor aproximado do Pardinho em Sinimbu (piloto F1)
    lon0, lat0 = -52.65, -29.43
    base_px = round(
        (2 * args.buffer_m * args.reach_length_m
         + math.pi * args.buffer_m ** 2) / 100.0
    )

    def stats(mean: float, crit: float, valid: float, bbox: list) -> dict:
        n_valid = round(base_px * valid)
        return {
            "n_cenas": 3,
            "ndvi_mean": round(mean, 3),
            "ndvi_min": round(mean - 0.3, 3),
            "ndvi_max": round(mean + 0.3, 3),
            "frac_validos": n_valid / base_px,
            "frac_critico": round(crit, 4),
            "frac_moderado": 0.25,
            "n_pixels_buffer": base_px,
            "n_pixels_validos": n_valid,
            "bbox": bbox,
            "mask_method": "synthetic_rasterized_buffer_polygon",
        }

    reaches = []
    for i in range(args.synthetic):
        order = i
        mx = lon0 + i * 0.004
        my = lat0 + (rng.random() - 0.5) * 0.01
        # Segmento sintético de ~500 m (não um quadrado de ~1 km).
        coords = [[mx, my], [mx + 0.00517, my + 0.0008]]
        lons = [c[0] for c in coords]
        lats = [c[1] for c in coords]
        c_lon = sum(lons) / len(lons)
        c_lat = sum(lats) / len(lats)
        pad_lon, pad_lat = 0.0032, 0.0028  # ~230 m do buffer + margem
        bbox = [
            round(min(lons) - pad_lon, 6),
            round(min(lats) - pad_lat, 6),
            round(max(lons) + pad_lon, 6),
            round(max(lats) + pad_lat, 6),
        ]
        degraded = rng.random() < 0.4
        pre_m = 0.55 + rng.random() * 0.2
        baseline_m = pre_m + 0.01 + rng.random() * 0.02
        pos_m = pre_m - (rng.random() * 0.15 if degraded else rng.random() * 0.03)
        regen25_m = pos_m + (rng.random() * 0.02 if degraded else rng.random() * 0.03)
        regen_m = regen25_m + rng.random() * 0.02
        reaches.append(
            {
                "id": stable_reach_id("pardinho", order, c_lon, c_lat),
                "river_key": "pardinho",
                "order": order,
                "length_m": 500.0,
                "area_ha": 20.0,
                "centroid": [c_lon, c_lat],
                "geometry": {"type": "LineString", "coordinates": coords},
                "search_bbox": bbox,
                "mask_method": "synthetic_rasterized_buffer_polygon",
                "stats_baseline": stats(baseline_m, 0.0, 0.97, bbox),
                "stats_pre": stats(pre_m, 0.01, 0.97, bbox),
                "stats_pos": stats(
                    pos_m, 0.04 if degraded else 0.01, 0.94, bbox),
                "stats_regen_2025": stats(
                    regen25_m, 0.035 if degraded else 0.01, 0.95, bbox),
                "stats_regen": stats(
                    regen_m, 0.035 if degraded else 0.01, 0.96, bbox),
            }
        )
    return reaches


def load_reaches_geojson(path: Path) -> list:
    """Lê trechos de um `reaches.geojson` anterior (sem OSM).

    Preserva id/ordem/geometria publicados e recomputa o centroide a partir da
    geometria (o build usa o centroide só para filtro de piloto e logs).
    """
    from shapely.geometry import shape

    fc = json.loads(Path(path).read_text())
    reaches = []
    for f in fc.get("features", []):
        p = f.get("properties") or {}
        geom = f.get("geometry")
        if not geom:
            continue
        c = shape(geom).centroid
        reaches.append({
            "id": p.get("id"),
            "river_key": p.get("river"),
            "order": p.get("order", 0),
            "length_m": p.get("length_m"),
            "area_ha": p.get("area_ha", 5.0),
            "centroid": [round(c.x, 6), round(c.y, 6)],
            "geometry": geom,
        })
    if not reaches:
        raise ValueError(f"nenhum trecho em {path}")
    return reaches


def run_real(args: argparse.Namespace) -> list:
    """Pipeline real: OSM → segmentos → S2 por trecho (lento; job offline).

    v4: bbox de busca derivado do buffer + margem e stats recortadas pela
    máscara do buffer rasterizada na grade do NDVI (10 m).
    """
    import time

    from app.services.buffer_geometry import search_bbox
    from app.services.reaches_service import build_reaches
    from app.services.s2_service import (
        S2BufferOutside,
        S2Error,
        S2NoScenes,
        composite_ndvi,
    )

    if args.reaches_from:
        reaches = load_reaches_geojson(Path(args.reaches_from))
        print(f"trechos carregados de {args.reaches_from}: {len(reaches)}",
              flush=True)
    else:
        reaches = build_reaches(
            args.region, args.buffer_m, args.reach_length_m,
            bbox=tuple(args.pilot_bbox) if args.pilot_bbox else None,
        )
        print(f"trechos OSM: {len(reaches)}", flush=True)

    if args.pilot_bbox and not args.reaches_from:
        minx, miny, maxx, maxy = args.pilot_bbox
        reaches = [r for r in reaches
                   if minx <= r["centroid"][0] <= maxx and miny <= r["centroid"][1] <= maxy]
        print(f"trechos no piloto: {len(reaches)}", flush=True)

    if args.river:
        key = args.river.lower()
        reaches = [r for r in reaches if key in r["river_key"]]
        print(f"trechos no rio '{args.river}': {len(reaches)}", flush=True)

    if args.limit_reaches > 0:
        reaches = reaches[: args.limit_reaches]
        print(f"trechos (limit): {len(reaches)}", flush=True)

    if args.sample > 0 and len(reaches) > args.sample:
        ordered = sorted(reaches, key=lambda r: r["centroid"][1])
        step = len(ordered) / args.sample
        reaches = [ordered[int(i * step)] for i in range(args.sample)]
        print(f"trechos (sample {args.sample} N→S): {len(reaches)}", flush=True)

    windows = WINDOWS_DEFAULT
    t0 = time.time()
    for i, r in enumerate(reaches):
        lon, lat = r["centroid"]
        # bbox v4: limites do buffer (200 m) + margem de 30 m, em EPSG:4326.
        bb = search_bbox(
            r["geometry"], args.buffer_m, args.buffer_margin_m
        )
        r["search_bbox"] = list(bb)
        stats = {}
        for w, (ini, fim) in windows.items():
            attempt = 0
            while True:
                try:
                    res = composite_ndvi(
                        bb, ini, fim, args.cloud_max, args.top_n,
                        buffer_geometry=r["geometry"],
                        buffer_m=args.buffer_m,
                        buffer_margin_m=args.buffer_margin_m,
                    )
                    stats[w] = res.stats
                    break
                except S2NoScenes as e:
                    print(f"  reach {r['id']}: {w} sem cenas ({e})", flush=True)
                    stats[w] = {
                        "n_cenas": 0,
                        "frac_critico": 0.0,
                        "ndvi_mean": 0.0,
                        "frac_validos": 0.0,
                        "n_pixels_buffer": 0,
                        "n_pixels_validos": 0,
                        "bbox": list(bb),
                        "mask_method": "rasterized_buffer_polygon",
                    }
                    break
                except S2BufferOutside:
                    # Falha rápido: nunca publicar máscara vazia/buffer fora.
                    raise
                except S2Error as e:
                    if attempt >= args.retries:
                        raise
                    attempt += 1
                    wait = 2 * attempt
                    print(f"  reach {r['id']}: {w} erro transitório "
                          f"({e}); retry {attempt}/{args.retries} em {wait}s",
                          flush=True)
                    time.sleep(wait)
        r["stats_baseline"] = stats["baseline"]
        r["stats_pre"] = stats["pre"]
        r["stats_pos"] = stats["pos"]
        r["stats_regen_2025"] = stats["regen_2025"]
        r["stats_regen"] = stats["regen"]
        r["mask_method"] = "rasterized_buffer_polygon"
        if (i + 1) % 5 == 0 or i + 1 == len(reaches):
            elapsed = time.time() - t0
            eta = elapsed / (i + 1) * (len(reaches) - i - 1)
            print(f"  {i + 1}/{len(reaches)} trechos "
                  f"({elapsed / 60:.1f} min, ETA {eta / 60:.1f} min)",
                  flush=True)
    return reaches


def main(argv=None) -> int:
    args = parse_args(argv)
    out = Path(args.out)

    if args.synthetic:
        reaches_raw = run_synthetic(args, out)
    else:
        reaches_raw = run_real(args)

    from app.services.reaches_service import score_all, to_geojson

    scored = score_all(reaches_raw)
    fc = to_geojson(scored)

    bands: dict[str, int] = {}
    for r in scored:
        bands[r["band"]] = bands.get(r["band"], 0) + 1
    summary = {
        "basin": args.basin,
        "n_reaches": len(scored),
        "bands": bands,
        "score_mean": round(sum(r["score"] for r in scored) / max(len(scored), 1), 4),
        "frac_critical_reaches": round(
            sum(1 for r in scored if r["band"] in ("Urgente", "Alta")) / max(len(scored), 1), 4),
    }

    from app.core.priority_weights import METHODS_TEXT, WEIGHTS
    from app.services.buffer_geometry import buffer_metadata

    tmp = Path(tempfile.mkdtemp(prefix="build_basin_"))
    try:
        (tmp / "reaches.geojson").write_text(
            json.dumps(fc, ensure_ascii=False) + "\n")
        _write_json(tmp / "summary.json", summary)
        _write_json(tmp / "methods.json", {
            "methods_version": _methods_version(),
            "weights": WEIGHTS,
            "text": METHODS_TEXT,
            "buffer": buffer_metadata(args.buffer_m, args.buffer_margin_m),
            "baseline_window": list(WINDOWS_DEFAULT[BASELINE_WINDOW]),
            "windows": {w: list(v) for w, v in WINDOWS_DEFAULT.items()},
        })
        _write_json(tmp / "manifest.json",
                    _manifest(args.basin, args, len(scored), reaches_raw))
        if out.exists():
            shutil.rmtree(out)
        shutil.move(str(tmp), str(out))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print(f"OK: {len(scored)} trechos → {out}")
    print("bands:", bands)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
