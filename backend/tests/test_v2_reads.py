"""F1-6 — API v2: leitura pública, sem auth, sem banco, sem rede.

Roda com: python3 -m pytest backend/tests/test_v2_reads.py -q
(ou python3 backend/tests/test_v2_reads.py para smoke sem pytest)
"""

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


@pytest.fixture()
def client(tmp_path, monkeypatch):
    data = tmp_path / "basins"
    r = subprocess.run(
        [sys.executable, str(BACKEND / "jobs" / "build_basin.py"),
         "--basin", "pardo", "--synthetic", "6", "--seed", "7",
         "--out", str(data / "pardo" / "v1")],
        capture_output=True, text=True,
    )
    assert r.returncode == 0, r.stderr
    monkeypatch.setattr(config_mod.settings, "JOBS_DATA_DIR", str(data))
    app = FastAPI()
    app.include_router(v2_router, prefix="/api/v2")
    return TestClient(app)


def test_basins_public(client):
    r = client.get("/api/v2/basins")
    assert r.status_code == 200
    assert r.json()[0]["basin"] == "pardo"
    assert r.json()[0]["latest"] == "v1"


def test_reaches_schema_and_filters(client):
    r = client.get("/api/v2/reaches", params={"basin": "pardo"})
    assert r.status_code == 200
    feats = r.json()["features"]
    assert len(feats) == 6
    props = feats[0]["properties"]
    for k in ("id", "score", "band", "components", "stats_pre",
              "stats_pos", "stats_regen", "methods_version"):
        assert k in props, k
    assert set(feats[0]["properties"]["components"]) == {
        "severity", "no_regen", "connectivity", "risk", "cost"}

    r2 = client.get("/api/v2/reaches",
                    params={"basin": "pardo", "min_priority": "Alta"})
    bands = {f["properties"]["band"] for f in r2.json()["features"]}
    assert bands <= {"Alta", "Urgente"}

    r3 = client.get("/api/v2/reaches", params={"basin": "pardo", "band": "Nope"})
    assert r3.status_code == 422


def test_reach_detail_and_404(client):
    rid = client.get("/api/v2/reaches").json()["features"][0]["properties"]["id"]
    r = client.get(f"/api/v2/reaches/{rid}")
    assert r.status_code == 200
    assert r.json()["properties"]["id"] == rid
    assert client.get("/api/v2/reaches/reach_inexistente").status_code == 404
    assert client.get("/api/v2/reaches", params={"basin": "nope"}).status_code == 404


def test_methods_summary_manifest(client):
    m = client.get("/api/v2/methods").json()
    assert m["methods_version"] == "f1-2026-09"
    assert abs(sum(m["weights"].values()) - 1.0) < 1e-9
    assert "limita" in m["text"] or "Limita" in m["text"]
    s = client.get("/api/v2/summary").json()
    assert s["n_reaches"] == 6 and s["basin"] == "pardo"
    mf = client.get("/api/v2/manifest").json()
    assert mf["synthetic"] is True and mf["n_reaches"] == 6


if __name__ == "__main__":
    # smoke sem pytest: executa as funções com fixture manual
    import tempfile

    tmp = Path(tempfile.mkdtemp())
    data = tmp / "basins"
    r = subprocess.run(
        [sys.executable, str(BACKEND / "jobs" / "build_basin.py"),
         "--basin", "pardo", "--synthetic", "6", "--seed", "7",
         "--out", str(data / "pardo" / "v1")],
        capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    config_mod.settings.JOBS_DATA_DIR = str(data)
    app = FastAPI()
    app.include_router(v2_router, prefix="/api/v2")
    c = TestClient(app)

    class C:
        def get(self, *a, **k):
            return c.get(*a, **k)

    cc = C()
    test_basins_public(cc)
    test_reaches_schema_and_filters(cc)
    test_reach_detail_and_404(cc)
    test_methods_summary_manifest(cc)
    print("SMOKE v2 OK")
