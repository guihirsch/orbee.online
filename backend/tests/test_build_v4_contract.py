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

STATS_WINDOWS = (
    "stats_baseline", "stats_pre", "stats_pos",
    "stats_regen_2025", "stats_regen",
)
N_REACHES = 8


def _window_keys(manifest: dict) -> dict:
    return manifest["windows"]


def test_manifest_registra_janelas_baseline_e_2026(v4_dir):
    manifest = _load(v4_dir, "manifest.json")
    windows = _window_keys(manifest)
    assert windows["baseline"] == ["2023-06-01", "2023-08-31"]
    assert windows["regen"] == ["2026-06-01", "2026-08-31"]
    assert windows["regen_2025"] == ["2025-06-01", "2025-08-31"]
    assert manifest["baseline_window"] == ["2023-06-01", "2023-08-31"]
    # A janela de evento (pré/pós 2024) continua publicada para o diff v3.
    assert windows["pre"] == ["2024-01-01", "2024-03-31"]
    assert windows["pos"] == ["2024-06-01", "2024-08-31"]


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


def test_methods_documentam_o_buffer_e_as_janelas(v4_dir):
    methods = _load(v4_dir, "methods.json")
    assert methods["methods_version"] == "f2-2026-11"
    assert methods["buffer"]["buffer_m"] == 200.0
    assert "buffer" in methods["buffer"]["mask_method"]
    assert "buffer" in methods["text"].lower()
    assert methods["windows"]["baseline"] == ["2023-06-01", "2023-08-31"]
    assert methods["windows"]["regen"] == ["2026-06-01", "2026-08-31"]
    assert methods["baseline_window"] == ["2023-06-01", "2023-08-31"]
    texto = methods["text"].lower()
    assert "baseline" in texto and "2023" in texto and "2026" in texto
    assert "regen_2025" in texto


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


def test_gate_v9_passa_com_baseline_e_rejeita_ausente_ou_fora_da_estacao(
    v4_dir, tmp_path
):
    report = _validate(v4_dir, tmp_path / "validation.json")
    v9 = [c for c in report["checks"] if c["gate"] == "V9"]
    assert v9, "gate V9 ausente"
    assert not [c for c in v9 if c["status"] == "FAIL"], v9
    assert any("mesma esta" in c["detail"].lower() for c in v9)

    # Baseline ausente no manifest e nos trechos → FAIL.
    bad = tmp_path / "bad" / "taquari" / "v4"
    bad.parent.mkdir(parents=True)
    bad.mkdir()
    for name in ("reaches.geojson", "summary.json", "methods.json",
                 "manifest.json"):
        (bad / name).write_text((v4_dir / name).read_text())
    manifest = json.loads((bad / "manifest.json").read_text())
    manifest.pop("baseline_window")
    manifest["windows"].pop("baseline")
    (bad / "manifest.json").write_text(json.dumps(manifest))
    fc = json.loads((bad / "reaches.geojson").read_text())
    for f in fc["features"]:
        f["properties"].pop("stats_baseline", None)
    (bad / "reaches.geojson").write_text(json.dumps(fc))

    bad_report = _validate(bad, tmp_path / "bad9_validation.json")
    v9_bad = [c for c in bad_report["checks"] if c["gate"] == "V9"]
    assert [c for c in v9_bad if c["status"] == "FAIL"], v9_bad

    # Baseline em estação errada (verão) → FAIL mesmo presente.
    (bad / "manifest.json").write_text((v4_dir / "manifest.json").read_text())
    manifest = json.loads((bad / "manifest.json").read_text())
    manifest["windows"]["baseline"] = ["2023-01-01", "2023-03-31"]
    manifest["baseline_window"] = ["2023-01-01", "2023-03-31"]
    (bad / "manifest.json").write_text(json.dumps(manifest))
    (bad / "reaches.geojson").write_text((v4_dir / "reaches.geojson").read_text())

    bad_report2 = _validate(bad, tmp_path / "bad9b_validation.json")
    v9_bad2 = [c for c in bad_report2["checks"] if c["gate"] == "V9"]
    assert [c for c in v9_bad2 if c["status"] == "FAIL"], v9_bad2


def test_score_publicado_usa_a_baseline_nao_o_pre(v4_dir):
    from app.services.reaches_service import score_all

    fc = _load(v4_dir, "reaches.geojson")
    raw = [{
        "id": f["properties"]["id"],
        "river_key": f["properties"]["river"],
        "order": f["properties"]["order"],
        "stats_baseline": f["properties"]["stats_baseline"],
        "stats_pre": f["properties"]["stats_pre"],
        "stats_pos": f["properties"]["stats_pos"],
        "stats_regen": f["properties"]["stats_regen"],
        "area_ha": f["properties"]["area_ha"],
    } for f in fc["features"]]
    com = {r["id"]: r for r in score_all(raw)}
    sem = {r["id"]: r for r in score_all(
        [{k: v for k, v in r.items() if k != "stats_baseline"} for r in raw]
    )}

    diferencia = None
    for f in fc["features"]:
        p = f["properties"]
        assert com[p["id"]]["score"] == pytest.approx(p["score"]), p["id"]
        if com[p["id"]]["score"] != sem[p["id"]]["score"]:
            diferencia = p["id"]
    assert diferencia, (
        "o build sintético precisa de baseline diferente do pré para o teste "
        "provar que o score publicado usa a baseline"
    )


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
