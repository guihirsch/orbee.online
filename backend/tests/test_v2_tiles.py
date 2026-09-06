"""F2-5 — sr_service (lógica pura, sem torch) + endpoints de tiles.

Roda com: python3 -m pytest backend/tests/test_v2_tiles.py -q
(ou python3 backend/tests/test_v2_tiles.py para smoke sem pytest)
"""

import base64
import json
import subprocess
import sys
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND = REPO_ROOT / "backend"
sys.path.insert(0, str(BACKEND))

from app.api.v2.api import router as v2_router  # noqa: E402
from app.core import config as config_mod  # noqa: E402
from app.services import sr_service as sr  # noqa: E402

PNG_1PX = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk"
    "+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")


def _fixture(tmp_path: Path) -> str:
    data = tmp_path / "basins"
    r = subprocess.run(
        [sys.executable, str(BACKEND / "jobs" / "build_basin.py"),
         "--basin", "pardo", "--synthetic", "4", "--seed", "3",
         "--out", str(data / "pardo" / "v1")],
        capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    vdir = data / "pardo" / "v1"
    fc = json.loads((vdir / "reaches.geojson").read_text())
    rid = fc["features"][0]["properties"]["id"]
    tdir = vdir / "sr" / rid / "tiles" / "ndvi_sr" / "14" / "1"
    tdir.mkdir(parents=True)
    (tdir / "2.png").write_bytes(PNG_1PX)
    (vdir / "sr_summary.json").write_text(json.dumps({
        "basin": "pardo", "version": "v1", "n_reaches": 1, "n_pass": 1,
        "model": {"variant": "NonReference_RGBN_x4", "weights_sha256": "x"},
        "reaches": [{"id": rid, "sr_status": "PASS",
                     "g1": {"status": "PASS"}, "g2": {"status": "PASS"}}],
    }))
    return rid


@pytest.fixture()
def client(tmp_path, monkeypatch):
    rid = _fixture(tmp_path)
    monkeypatch.setattr(config_mod.settings, "JOBS_DATA_DIR",
                        str(tmp_path / "basins"))
    app = FastAPI()
    app.include_router(v2_router, prefix="/api/v2")
    return TestClient(app), rid


def test_sr_pure_masking():
    import numpy as np

    c = sr.center_crop_hw(np.zeros((4, 259, 261), np.float32))
    assert c.shape == (4, 224, 224)
    valid = np.zeros((56, 56), bool)
    valid[10:40, 10:40] = True
    v25 = sr.upsample_valid_mask(valid)
    assert v25.shape == (224, 224) and v25.sum() == 30 * 30 * 16
    out = np.full((4, 224, 224), 0.3, np.float32)
    out[3] = 0.5
    out[:, :10, :10] = 1e-7  # lixo fora da máscara
    ndvi, diag = sr.ndvi_from_sr(out, v25)
    assert np.isnan(ndvi[0, 0])  # fora da máscara: NaN, sem explosão
    assert diag["frac_fora_11"] == 0.0
    assert abs(diag["ndvi_mean"] - 0.25) < 1e-6


def test_sr_pure_gates_identity():
    import numpy as np

    r10 = np.full((40, 40), 0.25)
    n10 = np.full((40, 40), 0.45)
    up = np.repeat(np.repeat(r10, 4, 0), 4, 1)
    un = np.repeat(np.repeat(n10, 4, 0), 4, 1)
    sq = np.stack([up, up, up, un]).astype(np.float32)
    g1 = sr.wald_gates(sq, r10, n10)
    assert g1["status"] == "PASS" and g1["ergas"] == 0.0
    ndvi, _ = sr.ndvi_from_sr(sq, np.ones((160, 160), bool))
    scl = np.full((40, 40), 5)
    g2 = sr.soil_bias(np.where(ndvi < 0.2, ndvi, 0.3), r10, n10, scl)
    assert g2["status"] in ("PASS", "SKIPPED")


def test_tiles_and_tilejson(client):
    c, rid = client
    r = c.get(f"/api/v2/tiles/pardo/{rid}/ndvi_sr/14/1/2.png")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert r.content == PNG_1PX
    assert c.get(f"/api/v2/tiles/pardo/{rid}/ndvi_sr/12/1/2.png").status_code == 404
    assert c.get(f"/api/v2/tiles/pardo/{rid}/ndvi_sr/14/9/2.png").status_code == 404
    assert c.get(f"/api/v2/tiles/pardo/{rid}/rgb/14/1/2.png").status_code == 422
    assert c.get("/api/v2/tiles/pardo/../x/ndvi_sr/14/1/2.png").status_code in (404, 422)
    tj = c.get("/api/v2/tilejson",
               params={"basin": "pardo", "reach_id": rid}).json()
    assert tj["tilejson"] == "2.2.0" and "{z}/{x}/{y}.png" in tj["tiles"][0]
    assert tj["minzoom"] == 13 and tj["maxzoom"] == 17
    d = c.get(f"/api/v2/reaches/{rid}").json()
    assert d["sr"]["sr_status"] == "PASS"
    assert c.get("/api/v2/sr-summary").json()["n_pass"] == 1


if __name__ == "__main__":
    import tempfile

    tmp = Path(tempfile.mkdtemp())
    rid = _fixture(tmp)
    config_mod.settings.JOBS_DATA_DIR = str(tmp / "basins")
    app = FastAPI()
    app.include_router(v2_router, prefix="/api/v2")
    test_sr_pure_masking()
    test_sr_pure_gates_identity()
    test_tiles_and_tilejson((TestClient(app), rid))
    print("SMOKE v2 tiles OK")
