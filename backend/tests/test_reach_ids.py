"""Regressão — id estável não pode colidir entre trechos vizinhos.

O esquema antigo usava centroide com 1 casa decimal (~11 km), então vários
trechos do mesmo `order`/rio caíam no mesmo `reach_*`. A v3 do Taquari expôs
isso: 144 features para 76 ids únicos.
"""

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.reaches_service import stable_reach_id  # noqa: E402


def test_same_input_is_deterministic():
    a = stable_reach_id("rio_taquari", 0, -51.9, -29.4)
    b = stable_reach_id("rio_taquari", 0, -51.9, -29.4)
    assert a == b
    assert a.startswith("reach_") and len(a) == len("reach_") + 10


def test_centroids_01_degree_apart_do_not_collide():
    # Mesmo rio/ordem, ~11 km de distância: o esquema de 1 casa colidia.
    a = stable_reach_id("rio_taquari", 0, -51.90, -29.40)
    b = stable_reach_id("rio_taquari", 0, -52.00, -29.40)
    assert a != b


def test_neighbor_centroids_within_1km_do_not_collide():
    # 6 casas (~0,1 m) precisam separar trechos consecutivos de ~500 m.
    a = stable_reach_id("rio_taquari", 3, -51.900000, -29.400000)
    b = stable_reach_id("rio_taquari", 3, -51.904500, -29.400000)
    assert a != b


def test_different_order_or_river_still_changes_id():
    base = stable_reach_id("rio_taquari", 0, -51.9, -29.4)
    assert base != stable_reach_id("rio_taquari", 1, -51.9, -29.4)
    assert base != stable_reach_id("rio_forqueta", 0, -51.9, -29.4)
