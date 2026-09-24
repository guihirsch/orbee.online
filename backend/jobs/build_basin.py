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
import os
import shutil
import sys
import tempfile
from pathlib import Path

# Permite `python backend/jobs/build_basin.py` de qualquer cwd
REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

WINDOWS_DEFAULT = {
    "pre": ("2024-01-01", "2024-03-31"),
    "pos": ("2024-06-01", "2024-08-31"),
    "regen": ("2025-06-01", "2025-08-31"),
}


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Build de artefatos v2 por bacia")
    p.add_argument("--basin", default="pardo")
    p.add_argument("--region", default="Sinimbu, Rio Grande do Sul, Brasil")
    p.add_argument("--buffer-m", type=float, default=200.0)
    p.add_argument("--reach-length-m", type=float, default=500.0)
    p.add_argument("--cloud-max", type=int, default=20)
    p.add_argument("--top-n", type=int, default=3)
    p.add_argument("--pilot-bbox", nargs=4, type=float, default=None,
                   metavar=("MINX", "MINY", "MAXX", "MAXY"),
                   help="Restringe a trechos com centroide dentro do bbox (piloto)")
    p.add_argument("--limit-reaches", type=int, default=0,
                   help="0 = sem limite; N > 0 processa só os N primeiros")
    p.add_argument("--river", type=str, default=None,
                   help="Filtra river_key por substring (ex. taquari)")
    p.add_argument("--sample", type=int, default=0, metavar="K",
                   help="0 = sem amostragem; K > 0 escolhe K trechos espaçados "
                        "uniformemente por latitude (rio N→S) em vez dos N primeiros")
    p.add_argument("--synthetic", type=int, default=0, metavar="N",
                   help="Gera N trechos sintéticos (sem rede/deps geo)")
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--out", required=True, help="Diretório de saída versionado")
    return p.parse_args(argv)


def _manifest(basin: str, args: argparse.Namespace, n_reaches: int) -> dict:
    return {
        "basin": basin,
        "built_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "methods_version": _methods_version(),
        "region": args.region,
        "buffer_m": args.buffer_m,
        "reach_length_m": args.reach_length_m,
        "cloud_max": args.cloud_max,
        "top_n": args.top_n,
        "pilot_bbox": args.pilot_bbox,
        "river": getattr(args, "river", None),
        "sample": getattr(args, "sample", 0),
        "n_reaches": n_reaches,
        "synthetic": bool(args.synthetic),
        "files": ["reaches.geojson", "summary.json", "methods.json"],
    }


def _methods_version() -> str:
    from app.core.priority_weights import METHODS_VERSION

    return METHODS_VERSION


def _write_json(path: Path, obj: dict) -> None:
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n")


def run_synthetic(args: argparse.Namespace, out: Path) -> dict:
    """Pipeline completo com stats sintéticas (sem rede, sem deps geo)."""
    import random

    from app.services.reaches_service import score_all, stable_reach_id, to_geojson

    rng = random.Random(args.seed)
    # Corredor aproximado do Pardinho em Sinimbu (piloto F1)
    lon0, lat0 = -52.65, -29.43
    reaches = []
    for i in range(args.synthetic):
        order = i
        mx = lon0 + i * 0.004
        my = lat0 + (rng.random() - 0.5) * 0.01
        degraded = rng.random() < 0.4
        pre_m = 0.55 + rng.random() * 0.2
        pos_m = pre_m - (rng.random() * 0.15 if degraded else rng.random() * 0.03)
        regen_m = pos_m + (rng.random() * 0.02 if degraded else rng.random() * 0.03)
        reaches.append(
            {
                "id": stable_reach_id("pardinho", order, mx, my),
                "river_key": "pardinho",
                "order": order,
                "length_m": 500.0,
                "area_ha": 20.0,
                "centroid": [mx, my],
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[mx, my], [mx + 0.004, my + 0.001]],
                },
                "stats_pre": {"frac_critico": 0.005, "ndvi_mean": round(pre_m, 3),
                              "frac_validos": 0.97},
                "stats_pos": {"frac_critico": round(0.04 if degraded else 0.005, 3),
                              "ndvi_mean": round(pos_m, 3), "frac_validos": 0.94},
                "stats_regen": {"frac_critico": round(0.035 if degraded else 0.005, 3),
                                "ndvi_mean": round(regen_m, 3), "frac_validos": 0.95},
            }
        )
    return reaches


def run_real(args: argparse.Namespace) -> list:
    """Pipeline real: OSM → segmentos → S2 por trecho (lento; job offline)."""
    from app.services.reaches_service import build_reaches
    from app.services.s2_service import S2NoScenes, composite_ndvi

    reaches = build_reaches(
        args.region, args.buffer_m, args.reach_length_m,
        bbox=tuple(args.pilot_bbox) if args.pilot_bbox else None,
    )
    print(f"trechos OSM: {len(reaches)}")

    if args.pilot_bbox:
        minx, miny, maxx, maxy = args.pilot_bbox
        reaches = [r for r in reaches
                   if minx <= r["centroid"][0] <= maxx and miny <= r["centroid"][1] <= maxy]
        print(f"trechos no piloto: {len(reaches)}")

    if args.river:
        key = args.river.lower()
        reaches = [r for r in reaches if key in r["river_key"]]
        print(f"trechos no rio '{args.river}': {len(reaches)}")

    if args.limit_reaches > 0:
        reaches = reaches[: args.limit_reaches]
        print(f"trechos (limit): {len(reaches)}")

    if args.sample > 0 and len(reaches) > args.sample:
        ordered = sorted(reaches, key=lambda r: r["centroid"][1])
        step = len(ordered) / args.sample
        reaches = [ordered[int(i * step)] for i in range(args.sample)]
        print(f"trechos (sample {args.sample} N→S): {len(reaches)}")

    windows = WINDOWS_DEFAULT
    for i, r in enumerate(reaches):
        lon, lat = r["centroid"]
        # micro-bbox ~1 km ao redor do centroide (rápido e representativo)
        bb = (lon - 0.005, lat - 0.005, lon + 0.005, lat + 0.005)
        stats = {}
        for w, (ini, fim) in windows.items():
            try:
                res = composite_ndvi(bb, ini, fim, args.cloud_max, args.top_n)
                stats[w] = res.stats
            except S2NoScenes as e:
                print(f"  reach {r['id']}: {w} sem cenas ({e})")
                stats[w] = {"frac_critico": 0.0, "ndvi_mean": 0.0, "frac_validos": 0.0}
        r["stats_pre"], r["stats_pos"], r["stats_regen"] = (
            stats["pre"], stats["pos"], stats["regen"])
        if (i + 1) % 5 == 0:
            print(f"  {i + 1}/{len(reaches)} trechos")
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

    tmp = Path(tempfile.mkdtemp(prefix="build_basin_"))
    try:
        (tmp / "reaches.geojson").write_text(
            json.dumps(fc, ensure_ascii=False) + "\n")
        _write_json(tmp / "summary.json", summary)
        _write_json(tmp / "methods.json", {
            "methods_version": _methods_version(),
            "weights": WEIGHTS,
            "text": METHODS_TEXT,
        })
        _write_json(tmp / "manifest.json", _manifest(args.basin, args, len(scored)))
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
