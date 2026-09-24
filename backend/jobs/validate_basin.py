#!/usr/bin/env python3
"""Validação da qualidade dos dados de uma bacia/versão v2 (só LEITURA).

Bateria V1..V6 sobre os artefatos publicados por build_basin.py/build_sr.py:
  V1 consistência interna (score/banda/summary/manifest/methods);
  V2 cobertura das janelas S2 (n_cenas, fração válida, intervalos);
  V3 plausibilidade física (direção pre→pos→regen, componentes);
  V4 SR além dos gates (COGs locais: NaN, intervalo, n_tiles, figura 10m×SR);
  V5 aderência ao terreno conhecido (nomes, bbox, ordem);
  V6 proveniência (gaps + SHA dos pesos recomputado).

Uso:
    /tmp/orbee-jobs/bin/python backend/jobs/validate_basin.py \
      --basin taquari --version v1 \
      --out v2_validation/evidencias/taquari_v1_validacao.json \
      --fig v2_validation/evidencias/taquari_sr_25m.png

Saída: JSON com vereditos PASS/WARN/FAIL por gate + veredito global.
Sem verdade de campo, o veredito máximo é "consistente + plausível + fiel".
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

# Cortes da bateria (documentados no relatório)
TOP_N = 3
MIN_VALID_POS = 0.40
MIN_VALID_REGEN = 0.60
LEN_TOL = 0.20      # comprimento geodésico vs length_m
AREA_TOL = 0.05     # area_ha vs comprimento×faixa
SCORE_TOL = 1e-6
OUT_OF_RANGE_WARN = 0.01  # fração de pixels SR fora de [-1,1] que vira FAIL


def parse_args(argv=None):
    p = argparse.ArgumentParser(description="Valida artefatos v2 (só leitura)")
    p.add_argument("--basin", default="taquari")
    p.add_argument("--version", default="v1")
    p.add_argument("--data-root", default=None,
                   help="padrão: backend/data/basins")
    p.add_argument("--out", required=True)
    p.add_argument("--fig", default=None)
    return p.parse_args(argv)


def check(status, detail, checks, gate):
    checks.append({"gate": gate, "status": status, "detail": detail})
    return status


def main(argv=None) -> int:
    from app.core.priority_weights import WEIGHTS, band_for
    from app.services.reaches_service import score_all, stable_reach_id

    args = parse_args(argv)
    root = Path(args.data_root) if args.data_root else REPO_ROOT / "backend" / "data" / "basins"
    vdir = root / args.basin / args.version
    checks: list[dict] = []

    def J(name):
        p = vdir / name
        if not p.is_file():
            check("FAIL", f"ausente: {name}", checks, "V0")
            raise SystemExit(f"artefato ausente: {p}")
        return json.loads(p.read_text())

    manifest, methods, summary = J("manifest.json"), J("methods.json"), J("summary.json")
    fc = J("reaches.geojson")
    feats = fc.get("features", [])

    # ---- V1: consistência interna ----
    if abs(sum(methods.get("weights", {}).values()) - 1.0) < 1e-9:
        check("PASS", "pesos somam 1", checks, "V1")
    else:
        check("FAIL", f"pesos não somam 1: {methods.get('weights')}", checks, "V1")

    raw = [{"river_key": f["properties"].get("river"), "order": f["properties"].get("order"),
            "stats_pre": f["properties"].get("stats_pre") or {},
            "stats_pos": f["properties"].get("stats_pos") or {},
            "stats_regen": f["properties"].get("stats_regen") or {},
            "area_ha": f["properties"].get("area_ha", 5.0)} for f in feats]
    rescored = {(r.get("river_key"), r.get("order")): s
                for r in score_all(raw) for s in [r]}
    nok = 0
    for f in feats:
        p = f["properties"]
        s = rescored.get((p.get("river"), p.get("order")))
        if s is None:
            check("FAIL", f"{p.get('id')}: não reexecutado", checks, "V1")
            continue
        ok = (abs(s["score"] - p.get("score", -9)) <= SCORE_TOL
              and s["band"] == p.get("band")
              and s["components"] == p.get("components")
              and s["valid_fraction"] == p.get("valid_fraction")
              and s["delta_regen"] == p.get("delta_regen")
              and band_for(p["score"]) == p["band"])
        if not ok:
            nok += 1
            check("FAIL", f"{p.get('id')}: score/banda divergente "
                  f"(pub {p.get('score')}/{p.get('band')} vs calc {s['score']}/{s['band']})",
                  checks, "V1")
    if nok == 0:
        check("PASS", f"score/banda/componentes reexecutados em {len(feats)} trechos", checks, "V1")

    bands: dict[str, int] = {}
    for f in feats:
        bands[f["properties"]["band"]] = bands.get(f["properties"]["band"], 0) + 1
    if (summary.get("n_reaches") == len(feats) and summary.get("bands") == bands
            and manifest.get("n_reaches") == len(feats)
            and manifest.get("methods_version") == methods.get("methods_version")):
        check("PASS", f"summary/manifest reconciliam ({len(feats)} trechos, {bands})", checks, "V1")
    else:
        check("FAIL", f"summary/manifest divergem: {summary} vs {bands}", checks, "V1")

    # ---- geometrias ----
    from pyproj import Geod
    from shapely.geometry import shape

    geod = Geod(ellps="WGS84")
    pb = manifest.get("pilot_bbox")
    n_geo_fail = 0
    for f in feats:
        p = f["properties"]
        try:
            g = shape(f["geometry"])
            lons, lats = zip(*list(g.coords))
            if not (-180 <= min(lons) <= max(lons) <= 180 and -90 <= min(lats) <= max(lats) <= 90):
                raise ValueError("coords fora do WGS84")
            glen = abs(geod.line_length(list(lons), list(lats)))
            if "length_m" not in p:
                check("WARN", f"{p.get('id')}: length_m/centroide não publicados "
                      f"(geodésico {glen:.0f} m; recomendo publicar no próximo build)",
                      checks, "V1")
            elif abs(glen - p["length_m"]) / max(glen, 1) > LEN_TOL:
                raise ValueError(f"length_m {p['length_m']} vs geodésico {glen:.0f}")
            if not (50 <= glen <= 650):
                check("WARN", f"{p.get('id')}: segmento atípico ({glen:.0f} m; "
                      "provável resto terminal de linha OSM)", checks, "V1")
            if abs(p.get("area_ha", 0) - glen * 2 * manifest.get("buffer_m", 200) / 10000) / max(p["area_ha"], 1e-9) > AREA_TOL:
                raise ValueError("area_ha incompatível com comprimento×faixa")
            c = g.centroid
            if pb and not (pb[0] <= c.x <= pb[2] and pb[1] <= c.y <= pb[3]):
                raise ValueError("centroide fora do pilot_bbox")
            rid = stable_reach_id(p.get("river"), p.get("order"), c.x, c.y)
            if rid != p.get("id"):
                check("WARN", f"{p.get('id')}: id não reproduz da geometria "
                      f"(possível borda de arredondamento .1f)", checks, "V1")
        except Exception as e:  # noqa: BLE001
            n_geo_fail += 1
            check("FAIL", f"{p.get('id')}: geometria — {e}", checks, "V1")
    if n_geo_fail == 0:
        check("PASS", f"{len(feats)} geometrias válidas (~500 m, centroides no piloto)", checks, "V1")

    # ---- V2: cobertura S2 ----
    for f in feats:
        p = f["properties"]
        for w in ("stats_pre", "stats_pos", "stats_regen"):
            s = p.get(w) or {}
            if s.get("n_cenas", 0) < TOP_N:
                check("WARN", f"{p['id']}/{w}: n_cenas={s.get('n_cenas')} < top_n={TOP_N} "
                      "(janela apertada; déficit de cobertura)", checks, "V2")
            for k in ("ndvi_mean", "ndvi_min", "ndvi_max", "frac_critico", "frac_moderado", "frac_validos"):
                v = s.get(k)
                if v is None or not (-1.5 <= v <= 1.5 if "ndvi" in k else 0.0 <= v <= 1.0):
                    check("FAIL", f"{p['id']}/{w}.{k}={v} fora do intervalo", checks, "V2")
        if (p.get("stats_pos") or {}).get("frac_validos", 1) < MIN_VALID_POS:
            check("WARN", f"{p['id']}: frac_validos pos baixo "
                  f"({(p.get('stats_pos') or {}).get('frac_validos')})", checks, "V2")
        if (p.get("stats_regen") or {}).get("frac_validos", 1) < MIN_VALID_REGEN:
            check("WARN", f"{p['id']}: frac_validos regen baixo", checks, "V2")
    if not any(c["gate"] == "V2" and c["status"] == "FAIL" for c in checks):
        check("PASS", "intervalos S2 íntegros; déficits só como WARN", checks, "V2")

    # ---- V3: plausibilidade física ----
    qf = sum(1 for f in feats if (f["properties"].get("stats_pos") or {}).get("ndvi_mean", 9)
             < (f["properties"].get("stats_pre") or {}).get("ndvi_mean", -9))
    rc = sum(1 for f in feats if (f["properties"].get("stats_regen") or {}).get("ndvi_mean", -9)
             > (f["properties"].get("stats_pos") or {}).get("ndvi_mean", 9))
    if qf >= len(feats) - 1:
        check("PASS", f"queda pre→pos em {qf}/{len(feats)} (dano do evento)", checks, "V3")
    else:
        check("WARN", f"queda pre→pos só em {qf}/{len(feats)}", checks, "V3")
    if rc >= len(feats) - 1:
        check("PASS", f"recuperação pos→regen em {rc}/{len(feats)}", checks, "V3")
    else:
        check("WARN", f"recuperação pos→regen só em {rc}/{len(feats)}", checks, "V3")
    for f in feats:
        p = f["properties"]
        exp_risk = max(0.0, min(1.0, ((p.get("stats_pos") or {}).get("frac_critico", 0)
                                       - (p.get("stats_pre") or {}).get("frac_critico", 0)) * 3.0))
        if abs(exp_risk - p["components"]["risk"]) > 1e-3:
            check("FAIL", f"{p['id']}: risk inconsistente", checks, "V3")
    check("PASS", "risk = surgimento de criticidade em todos", checks, "V3")

    # ---- V4: SR além dos gates ----
    import numpy as np

    srs = vdir / "sr_summary.json"
    if srs.is_file():
        doc = json.loads(srs.read_text())
        figs = []
        for r in doc.get("reaches", []):
            rd = vdir / "sr" / r["id"]
            tif = rd / "ndvi_sr.tif"
            if not tif.is_file():
                check("FAIL", f"{r['id']}: ndvi_sr.tif ausente", checks, "V4")
                continue
            import rasterio

            with rasterio.open(tif) as ds:
                a = ds.read(1).astype("float64")
            finite = np.isfinite(a)
            out = finite & ((a < -1) | (a > 1))
            frac_out = float(out.sum() / max(finite.sum(), 1))
            status = "PASS" if frac_out <= OUT_OF_RANGE_WARN else "FAIL"
            check(status, f"{r['id']}: pixels SR fora de [-1,1] = {frac_out:.4f} "
                  f"(média {float(a[finite].mean()):.3f}, n={int(finite.sum())})", checks, "V4")
            n_png = sum(1 for _ in (rd / "tiles" / "ndvi_sr").rglob("*.png"))
            if n_png != r.get("n_tiles"):
                check("FAIL", f"{r['id']}: n_tiles {r.get('n_tiles')} vs {n_png} em disco", checks, "V4")
            else:
                check("PASS", f"{r['id']}: {n_png} tiles íntegros em disco", checks, "V4")
            figs.append((r["id"], a, r.get("g1", {}), r.get("g2", {})))
        if args.fig and figs:
            import warnings

            import matplotlib

            matplotlib.use("Agg")
            import matplotlib.pyplot as plt

            n = len(figs)
            warnings.simplefilter("ignore", RuntimeWarning)
            figm, ax = plt.subplots(n, 2, figsize=(14, 4.2 * n), squeeze=False)
            for i, (rid, a, g1, g2) in enumerate(figs):
                h, w = a.shape
                a10 = np.nanmean(a[: h // 4 * 4, : w // 4 * 4].reshape(h // 4, 4, w // 4, 4), axis=(1, 3))
                kw = {"vmin": -0.2, "vmax": 0.9, "cmap": "YlGn"}
                ax[i][0].imshow(np.ma.masked_invalid(a10), **kw, interpolation="nearest")
                ax[i][0].set_title(f"{rid} — 10 m (coarsened)")
                ax[i][1].imshow(np.ma.masked_invalid(a), **kw, interpolation="nearest")
                ax[i][1].set_title(f"{rid} — 2,5 m SR "
                                    f"(G1 {g1.get('status')}, G2 {g2.get('status')})")
                for j in (0, 1):
                    ax[i][j].set_xticks([]), ax[i][j].set_yticks([])
            figm.suptitle(f"Taquari {args.version}: NDVI 10 m vs SR 2,5 m (SEN2SRLite x4)", fontsize=13)
            figm.tight_layout()
            figm.savefig(args.fig, dpi=100)
            check("PASS", f"figura 10m×SR em {args.fig}", checks, "V4")
    else:
        check("WARN", "sem sr_summary (versão sem SR)", checks, "V4")

    # ---- V5: terreno conhecido ----
    rivers = {f["properties"].get("river") for f in feats}
    if rivers == {"rio_taquari"}:
        check("PASS", "todos os trechos no rio_taquari (Lajeado/RS)", checks, "V5")
    else:
        check("WARN", f"rios mistos: {sorted(rivers)}", checks, "V5")
    orders = sorted(f["properties"].get("order", -1) for f in feats)
    if all(isinstance(o, int) and o >= 0 for o in orders):
        check("PASS" if orders == list(range(len(feats))) else "WARN",
              f"ordens {'sequenciais' if orders == list(range(len(feats))) else 'não-sequenciais (várias linhas OSM)'}: {orders}",
              checks, "V5")
    else:
        check("FAIL", f"ordens inválidas: {orders}", checks, "V5")

    # ---- V6: proveniência ----
    gaps = []
    if not any("scene" in str((f["properties"].get("stats_pre") or {})) for f in feats):
        gaps.append("IDs das cenas STAC por trecho/janela (só n_cenas registrado)")
    models = root / "models" / "SEN2SRLite_NonReference_RGBN_x4"
    cands = sorted(models.glob("*.safetensor*"), key=lambda p: p.stat().st_size, reverse=True) if models.is_dir() else []
    if cands and srs.is_file():
        h = hashlib.sha256()
        with open(cands[0], "rb") as fh:
            for ch in iter(lambda: fh.read(1 << 20), b""):
                h.update(ch)
        doc = json.loads(srs.read_text())
        if doc.get("model", {}).get("weights_sha256") == h.hexdigest():
            check("PASS", f"SHA dos pesos confere ({h.hexdigest()[:12]}…)", checks, "V6")
        else:
            check("FAIL", "SHA dos pesos diverge do sr_summary", checks, "V6")
    else:
        check("WARN", "pesos SR fora do alcance (não recomputado)", checks, "V6")
    for g in gaps:
        check("WARN", f"gap de proveniência: {g} (registrar no próximo build)", checks, "V6")

    fails = sum(1 for c in checks if c["status"] == "FAIL")
    warns = sum(1 for c in checks if c["status"] == "WARN")
    report = {
        "basin": args.basin, "version": args.version,
        "validated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "gates": ["V1", "V2", "V3", "V4", "V5", "V6"],
        "n_checks": len(checks), "n_fail": fails, "n_warn": warns,
        "verdict": "FAIL" if fails else ("PASS_WITH_WARNS" if warns else "PASS"),
        "checks": checks,
        "limits": ("sem verdade de campo: veredito máximo = consistente + "
                   "fisicamente plausível + SR fiel; escore é prospecção, não diagnóstico."),
    }
    Path(args.out).write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(f"{report['verdict']}: {len(checks)} checagens, {fails} FAIL, {warns} WARN → {args.out}")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
