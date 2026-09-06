"""Pesos públicos do índice de prioridade por trecho (Fase F1).

Pesos iniciais aprovados pelo usuário; literatura-base: frameworks de
priorização ripária multicritério (WIREs Water 2024: NDVI + conectividade +
lógica resist-accept-direct; CRI Sentinel-2 2026; RQI validado em campo).

Princípio: peso é juízo de valor → fica em arquivo próprio, versionado e
servido em GET /api/v2/methods. Muda sem deploy de lógica.
"""

from __future__ import annotations

METHODS_VERSION = "f1-2026-09"

# Ordem aprovada: severidade > sem-regeneração > conectividade > risco > custo
WEIGHTS = {
    "severity": 0.35,  # fração crítica atual (NDVI < 0,2 na janela regen)
    "no_regen": 0.25,  # ausência de regeneração pos→regen (mesma estação)
    "connectivity": 0.20,  # isolamento de fragmentos vizinhos (1 - NDVI vizinhos)
    "risk": 0.15,  # surgimento de área crítica nova (pós - pré)
    "cost": 0.05,  # heurística: áreas menores = intervenção mais barata
}

assert abs(sum(WEIGHTS.values()) - 1.0) < 1e-9, "pesos devem somar 1"

# Faixas de prioridade (mesmos rótulos do plan.py v1)
BANDS = [
    (0.66, "Urgente"),
    (0.40, "Alta"),
    (0.20, "Média"),
    (0.00, "Baixa"),
]


def band_for(score: float) -> str:
    for cutoff, label in BANDS:
        if score >= cutoff:
            return label
    return "Baixa"


METHODS_TEXT = """Índice de prioridade por trecho de APP (v2 F1).

Componentes (todos 0..1, maior = mais prioritário):
- severity: fração de pixels críticos (NDVI<0,2) na janela mais recente.
- no_regen: 1 - regeneração pos→regen normalizada (janelas de mesma estação;
  trata a ressalva sazonal da Fase 0: pre vs pos mistura estação+enchente).
- connectivity: 1 - NDVI médio dos trechos vizinhos (fragmento isolado = pior).
- risk: surgimento de criticidade (frac_critico_pos - frac_critico_pre), i.e.
  dano criado pelo evento = urgência de intervenção.
- cost: heurística F1 (1 - área_a_restaurar_ha/25); será calibrada com
  tabelas de custo de campo (ex.: programa MUDA) na F2.

Limitações declaradas: sem validação de campo o escore é prospecção, não
diagnóstico; trechos com baixa fração válida carregam incerteza (ver campo
`valid_fraction` por trecho); pesos são ajustáveis e versionados.
"""
