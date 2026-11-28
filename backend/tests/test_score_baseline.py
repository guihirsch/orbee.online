"""Ticket #6 — score mede contra a baseline de mesma estação (jun–ago/2023).

`risk` compara a criticidade pós-evento com a baseline (não com o pré-2024 de
verão); o déficit do `no_regen` é `ndvi_baseline - ndvi_pos`. Sem baseline
(payloads v1–v3), o score cai no comportamento legado (pré-evento), para que a
reexecução dos artefatos antigos continue idêntica.
"""

import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.reaches_service import score_reach  # noqa: E402


def stats(ndvi_mean: float, frac_critico: float = 0.0) -> dict:
    return {"ndvi_mean": ndvi_mean, "frac_critico": frac_critico}


def test_risk_compara_pos_com_baseline_nao_com_pre():
    # Baseline (inverno/2023) já tinha 2% de crítico; o pré de verão/2024, 0%.
    # Pós-evento: 10% crítico → risco = (0.10 - 0.02) * 3 = 0.24.
    pre = stats(0.60, 0.00)
    baseline = stats(0.60, 0.02)
    pos = stats(0.40, 0.10)
    regen = stats(0.45, 0.10)

    out = score_reach(pre, pos, regen, stats_baseline=baseline)

    assert out["components"]["risk"] == pytest.approx(0.24)

    # Sem baseline, o legado compara com o pré (0.10 - 0.00) * 3 = 0.30.
    legado = score_reach(pre, pos, regen)
    assert legado["components"]["risk"] == pytest.approx(0.30)


def test_deficit_zero_nao_pune_mata_estavel():
    # Baseline e pós com o mesmo NDVI: não há déficit a recuperar, mesmo que a
    # janela atual (2026) esteja abaixo do pós.
    baseline = stats(0.50)
    pos = stats(0.50)
    regen = stats(0.40)

    out = score_reach(stats(0.50), pos, regen, stats_baseline=baseline)

    assert out["components"]["no_regen"] == pytest.approx(0.0)


def test_regeneracao_acima_do_deficit_zera_no_regen():
    # Déficit baseline→pós = 0.60 - 0.40 = 0.20; ganho pós→regen = 0.65 - 0.40
    # = 0.25, acima do déficit → recuperação completa, sem penalidade.
    baseline = stats(0.60)
    pos = stats(0.40)
    regen = stats(0.65)

    out = score_reach(stats(0.60), pos, regen, stats_baseline=baseline)

    assert out["components"]["no_regen"] == pytest.approx(0.0)


def test_deficit_parcialmente_recuperado_usa_a_baseline():
    # Déficit 0.20; recuperou 0.10 (50%) → sobra 50% do déficit, saturado em
    # déficit/0.1 = 2 → no_regen = 0.5.
    baseline = stats(0.60)
    pos = stats(0.40)
    regen = stats(0.50)

    out = score_reach(stats(0.60), pos, regen, stats_baseline=baseline)

    assert out["components"]["no_regen"] == pytest.approx(0.5)


def test_baseline_ausente_preserva_o_score_legado_do_pre():
    pre = stats(0.70, 0.00)
    baseline = stats(0.50, 0.01)
    pos = stats(0.30, 0.20)
    regen = stats(0.40, 0.10)

    com_baseline = score_reach(pre, pos, regen, stats_baseline=baseline)
    sem_baseline = score_reach(pre, pos, regen)
    com_pre_explicito = score_reach(pre, pos, regen, stats_baseline=pre)

    assert sem_baseline == com_pre_explicito
    assert com_baseline["components"]["risk"] != sem_baseline["components"]["risk"]


def test_baseline_sem_cenas_tambem_cai_no_pre():
    # S2NoScenes publica um dict de zeros; não pode virar referência válida.
    pre = stats(0.60, 0.01)
    baseline_vazia = {"n_cenas": 0, "n_pixels_buffer": 0,
                      "ndvi_mean": 0.0, "frac_critico": 0.0}
    pos = stats(0.40, 0.10)
    regen = stats(0.45, 0.08)

    sem = score_reach(pre, pos, regen)
    vazia = score_reach(pre, pos, regen, stats_baseline=baseline_vazia)

    assert vazia == sem
