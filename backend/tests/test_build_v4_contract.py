"""Ticket #5 — contrato dos artefatos v4 (build sintético, sem rede).

Seam de artefato (spec #3): roda o build real do job em modo sintético e lê o
que o portal lê. Confirma buffer/máscara/bbox no manifest, stats recortadas e
o gate V8 rejeitando máscara vazia.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND = REPO_ROOT / "backend"
sys.path.insert(0, str(BACKEND))

STATS_WINDOWS = ("stats_pre", "stats_pos", "stats_regen")
N_REACHES = 8


def _run_build(out: Path, n: int = N_REACHES) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(BACKEND / "jobs" / "build_basin.py"),
         "--basin", "taquari", "--synthetic", str(n), "--seed", "7",
         "--out", str(out)],
        capture_output=True, text=True,
    )


def _load(out: Path, name: str):
    return json.loads((out / name).read_text())


@pytest.fixture(scope="module")
def v4_dir(tmp_path_factory) -> Path:
    out = tmp_path_factory.mktemp("v4") / "taquari" / "v4"
    r = _run_build(out)
    assert r.returncode == 0, r.stderr
    return out


def _validate(v4_dir: Path, report: Path) -> dict:
    r = subprocess.run(
        [sys.executable, str(BACKEND / "jobs" / "validate_basin.py"),
         "--basin", "taquari", "--version", "v4",
         "--data-root", str(v4_dir.parents[1]),
         "--out", str(report)],
        capture_output=True, text=True,
    )
    assert report.is_file(), r.stderr
    return json.loads(report.read_text())


def test_v4_publica_os_quatro_artefatos(v4_dir):
    for name in ("reaches.geojson", "summary.json", "methods.json",
                 "manifest.json"):
        assert (v4_dir / name).is_file(), name

    fc = _load(v4_dir, "reaches.geojson")
    assert len(fc["features"]) == N_REACHES
    summary = _load(v4_dir, "summary.json")
    assert summary["n_reaches"] == N_REACHES
    assert sum(summary["bands"].values()) == N_REACHES


def test_manifest_registra_buffer_mascara_e_bbox_derivado(v4_dir):
    manifest = _load(v4_dir, "manifest.json")
    assert manifest["buffer_m"] == 200.0
    assert manifest["buffer_margin_m"] == 30.0
    assert "buffer" in manifest["mask_method"]
    assert manifest["bbox_method"] == "buffer_bounds_plus_margin"

    bbox = manifest["search_bbox"]
    assert len(bbox) == 4
    assert -180 <= bbox[0] < bbox[2] <= 180
    assert -90 <= bbox[1] < bbox[3] <= 90

    fc = _load(v4_dir, "reaches.geojson")
    for f in fc["features"]:
        p = f["properties"]
        rb = p["search_bbox"]
        assert len(rb) == 4
        assert bbox[0] <= rb[0] < rb[2] <= bbox[2]
        assert bbox[1] <= rb[1] < rb[3] <= bbox[3]
        # O bbox de cada trecho contém a geometria publicada.
        lons = [c[0] for c in f["geometry"]["coordinates"]]
        lats = [c[1] for c in f["geometry"]["coordinates"]]
        assert rb[0] <= min(lons) and rb[2] >= max(lons)
        assert rb[1] <= min(lats) and rb[3] >= max(lats)


def test_stats_v4_tem_contrato_de_buffer(v4_dir):
    fc = _load(v4_dir, "reaches.geojson")
    for f in fc["features"]:
        p = f["properties"]
        for w in STATS_WINDOWS:
            s = p[w]
            for k in ("ndvi_mean", "ndvi_min", "ndvi_max", "frac_validos",
                      "frac_critico", "frac_moderado", "n_cenas",
                      "n_pixels_buffer", "n_pixels_validos", "bbox",
                      "mask_method"):
                assert k in s, f"{p['id']}/{w}: {k}"
            assert s["n_pixels_buffer"] > 0
            assert 0 <= s["n_pixels_validos"] <= s["n_pixels_buffer"]
            assert s["frac_validos"] == pytest.approx(
                s["n_pixels_validos"] / s["n_pixels_buffer"], abs=1e-6)
            assert 0.0 <= s["frac_critico"] <= 1.0
            assert 0.0 <= s["frac_moderado"] <= 1.0
            assert s["frac_critico"] + s["frac_moderado"] <= 1.0 + 1e-9
            assert s["bbox"] == p["search_bbox"]


def test_methods_documentam_o_buffer(v4_dir):
    methods = _load(v4_dir, "methods.json")
    assert methods["methods_version"] == "f2-2026-11"
    assert methods["buffer"]["buffer_m"] == 200.0
    assert "buffer" in methods["buffer"]["mask_method"]
    assert "buffer" in methods["text"].lower()


def test_gate_v8_passa_no_v4_sintetico_e_rejeita_mascara_vazia(v4_dir, tmp_path):
    report = _validate(v4_dir, tmp_path / "validation.json")
    v8 = [c for c in report["checks"] if c["gate"] == "V8"]
    assert v8, "gate V8 ausente"
    assert not [c for c in v8 if c["status"] == "FAIL"], v8
    assert any("buffer" in c["detail"].lower() for c in v8)

    # Corrompe um trecho: máscara vazia publicada não pode passar.
    bad = tmp_path / "bad" / "taquari" / "v4"
    bad.parent.mkdir(parents=True)
    bad.mkdir()
    for name in ("reaches.geojson", "summary.json", "methods.json",
                 "manifest.json"):
        (bad / name).write_text((v4_dir / name).read_text())
    fc = json.loads((bad / "reaches.geojson").read_text())
    fc["features"][0]["properties"]["stats_regen"]["n_pixels_buffer"] = 0
    fc["features"][0]["properties"]["stats_regen"]["n_pixels_validos"] = 0
    (bad / "reaches.geojson").write_text(json.dumps(fc))

    bad_report = _validate(bad, tmp_path / "bad_validation.json")
    v8_bad = [c for c in bad_report["checks"] if c["gate"] == "V8"]
    assert [c for c in v8_bad if c["status"] == "FAIL"], v8_bad
    assert bad_report["verdict"] == "FAIL"


def test_basins_json_lista_v4_como_preview_e_mantem_latest_v3():
    doc = json.loads(
        (REPO_ROOT / "frontend" / "public" / "data" / "basins" / "basins.json")
        .read_text()
    )
    taquari = next(b for b in doc if b["basin"] == "taquari")
    assert "v4" in taquari["versions"]
    assert taquari["latest"] == "v3"
    assert taquari["preview"] == "v4"


def test_reaches_from_reusa_geometrias_da_v3_sem_osm():
    from jobs.build_basin import load_reaches_geojson

    reaches = load_reaches_geojson(
        BACKEND / "data" / "basins" / "taquari" / "v3" / "reaches.geojson"
    )
    assert len(reaches) == 144
    assert len({r["id"] for r in reaches}) == 144
    for r in reaches:
        assert r["geometry"]["type"] in ("LineString", "MultiLineString")
        assert r["river_key"] == "rio_taquari"
        assert r["centroid"] and len(r["centroid"]) == 2
        assert r["area_ha"] > 0 and r["length_m"] > 0
