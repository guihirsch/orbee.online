#!/usr/bin/env python3
"""Crosscheck S2 × CBERS-4A (Fase A da verificação independente, offline).

Para cada trecho da bacia/versão, compõe o NDVI WPM-8m (INPE STAC, janela
`regen`) na mesma micro-bbox de ~1 km do build e compara com as stats S2
publicadas. Gate V7 por trecho:
  |Δ ndvi_mean| ≤ 0,08 e |Δ frac_critico| ≤ 0,10 → PASS
  |Δ ndvi_mean| ≤ 0,15 e |Δ frac_critico| ≤ 0,20 → WARN, senão FAIL.

Saídas (build atômico): crosscheck.json no vdir (inclui os IDs WPM usados —
inaugura o registro de IDs de cena) + figura S2×CBERS opcional.

Uso:
    /tmp/orbee-jobs/bin/python backend/jobs/build_crosscheck.py \
      --basin taquari --version v1 \
      --fig v2_validation/evidencias/taquari_cbers_x_s2.png
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

TOL_MEAN_PASS, TOL_MEAN_WARN = 0.08, 0.15
TOL_CRIT_PASS, TOL_CRIT_WARN = 0.10, 0.20
REGEN = ("2025-06-01", "2025-08-31")


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Crosscheck S2 x CBERS-4A")
    p.add_argument("--basin", default="taquari")
    p.add_argument("--version", default="v1")
    p.add_argument("--fig", default=None)
    return p.parse_args(argv)


def main(argv=None) -> int:
    from shapely.geometry import shape

    from app.services import cbers_service as cb

    args = parse_args(argv)
    vdir = REPO_ROOT / "backend" / "data" / "basins" / args.basin / args.version
    fc = json.loads((vdir / "reaches.geojson").read_text())

    tmp = Path(tempfile.mkdtemp(prefix="crosscheck_"))
    records = []
    try:
        for feat in fc["features"]:
            p = feat["properties"]
            c = shape(feat["geometry"]).centroid
            bb = (c.x - 0.005, c.y - 0.005, c.x + 0.005, c.y + 0.005)
            print(f"{p['id']} …")
            try:
                comp = cb.composite_ndvi_wpm(bb, *REGEN)
                # triagem de nuvens/lacunas: só cenas com ≥80% de dados no bbox
                # (a coleção não informa cloud_cover; documentado em per_scene)
                clean = [s["id"] for s in comp.per_scene
                         if s.get("frac_validos", 0) >= 0.8]
                if len(clean) < len(comp.scene_ids):
                    all_items = cb.search_wpm(bb, *REGEN)
                    comp = cb.composite_ndvi_wpm(
                        bb, *REGEN,
                        items=[i for i in all_items if i.get("id") in clean])
                    print(f"  triagem: {len(clean)}/{len(comp.scene_ids)} cenas limpas")
            except Exception as e:  # noqa: BLE001
                records.append({"id": p["id"], "status": "FAIL",
                                "reason": f"CBERS indisponível: {str(e)[:150]}"})
                print(f"  FAIL ({e})")
                continue
            s2 = p.get("stats_regen") or {}
            d_mean = abs(comp.stats["ndvi_mean"] - s2.get("ndvi_mean", 0))
            d_crit = abs(comp.stats["frac_critico"] - s2.get("frac_critico", 0))
            if d_mean <= TOL_MEAN_PASS and d_crit <= TOL_CRIT_PASS:
                st = "PASS"
            elif d_mean <= TOL_MEAN_WARN and d_crit <= TOL_CRIT_WARN:
                st = "WARN"
            else:
                st = "FAIL"
            records.append({
                "id": p["id"], "status": st,
                "s2_ndvi_mean": round(s2.get("ndvi_mean", 0), 4),
                "cbers_ndvi_mean": round(comp.stats["ndvi_mean"], 4),
                "delta_ndvi_mean": round(comp.stats["ndvi_mean"] - s2.get("ndvi_mean", 0), 4),
                "s2_frac_critico": round(s2.get("frac_critico", 0), 4),
                "cbers_frac_critico": round(comp.stats["frac_critico"], 4),
                "delta_frac_critico": round(comp.stats["frac_critico"] - s2.get("frac_critico", 0), 4),
                "scene_ids": comp.scene_ids,
                "per_scene": comp.per_scene,
            })
            print(f"  {st} Δmean={records[-1]['delta_ndvi_mean']} "
                  f"Δcrit={records[-1]['delta_frac_critico']}")
        doc = {
            "basin": args.basin, "version": args.version,
            "built_at": dt.datetime.now(dt.timezone.utc).isoformat(),
            "sensor": "CBERS-4A/WPM L4-DN (8 m, NDVI sobre DN, BAND3/BAND4)",
            "stac": cbers_service_url(),
            "window": {"regen": list(REGEN)},
            "tolerances": {"delta_ndvi_mean": [TOL_MEAN_PASS, TOL_MEAN_WARN],
                           "delta_frac_critico": [TOL_CRIT_PASS, TOL_CRIT_WARN]},
            "n_reaches": len(records),
            "n_pass": sum(1 for r in records if r["status"] == "PASS"),
            "rank_corr_spearman": rank_corr(records),
            "bias_median_delta": median_delta(records),
            "reaches": records,
        }
        (tmp / "crosscheck.json").write_text(
            json.dumps(doc, ensure_ascii=False, indent=2) + "\n")
        fig = None
        if args.fig:
            fig = make_fig(records, args)
            (tmp / "fig.png").write_bytes(fig)
        shutil.move(str(tmp / "crosscheck.json"), str(vdir / "crosscheck.json"))
        if fig:
            Path(args.fig).write_bytes(fig)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    ok = sum(1 for r in records if r["status"] in ("PASS", "WARN"))
    print(f"V7: {ok}/{len(records)} PASS+WARN → {vdir / 'crosscheck.json'}")
    return 0 if ok >= len(records) - 1 else 1


def rank_corr(records) -> float | None:
    """Spearman S2×CBERS na ordenação dos trechos (robusto a viés absoluto)."""
    s2 = [r.get("s2_ndvi_mean") for r in records]
    cb = [r.get("cbers_ndvi_mean") for r in records]
    if any(v is None for v in s2 + cb) or len(s2) < 2:
        return None
    rs = sorted(range(len(s2)), key=lambda i: s2[i])
    rc = sorted(range(len(cb)), key=lambda i: cb[i])
    pr, pc = [0] * len(s2), [0] * len(cb)
    for rank, i in enumerate(rs):
        pr[i] = rank
    for rank, i in enumerate(rc):
        pc[i] = rank
    n = len(s2)
    d2 = sum((a - b) ** 2 for a, b in zip(pr, pc))
    return round(1 - 6 * d2 / (n * (n * n - 1)), 3)


def median_delta(records) -> float | None:
    ds = sorted(r["delta_ndvi_mean"] for r in records if "delta_ndvi_mean" in r)
    if not ds:
        return None
    m = len(ds) // 2
    return round((ds[m - 1] + ds[m]) / 2 if len(ds) % 2 == 0 else ds[m], 4)


def cbers_service_url() -> str:
    from app.services.cbers_service import INPE_STAC_URL, COLLECTION_WPM_DN

    return f"{INPE_STAC_URL} / {COLLECTION_WPM_DN}"


def make_fig(records, args) -> bytes:
    import io

    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    ids = [r["id"][-6:] for r in records]
    s2m = [r.get("s2_ndvi_mean", float("nan")) for r in records]
    cbm = [r.get("cbers_ndvi_mean", float("nan")) for r in records]
    fig, ax = plt.subplots(1, 2, figsize=(13, 4.5))
    x = range(len(ids))
    ax[0].bar([i - 0.2 for i in x], s2m, 0.4, label="S2 10 m")
    ax[0].bar([i + 0.2 for i in x], cbm, 0.4, label="CBERS 8 m (DN)")
    ax[0].set_xticks(list(x), ids, rotation=20, fontsize=9)
    ax[0].set_ylabel("NDVI médio (regen)")
    ax[0].set_title(f"{args.basin} {args.version}: S2 × CBERS por trecho")
    ax[0].legend()
    cols = {"PASS": "green", "WARN": "orange", "FAIL": "red"}
    ax[1].scatter(s2m, cbm, c=[cols.get(r.get("status"), "gray") for r in records], s=60)
    for i, t in enumerate(ids):
        ax[1].annotate(t, (s2m[i], cbm[i]), fontsize=8)
    ax[1].plot([0, 1], [0, 1], "k--", lw=1)
    ax[1].set_xlabel("S2 ndvi_mean")
    ax[1].set_ylabel("CBERS ndvi_mean")
    ax[1].set_title("Concordância (y=x)")
    fig.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=100)
    plt.close(fig)
    return buf.getvalue()


if __name__ == "__main__":
    raise SystemExit(main())
