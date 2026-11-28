"""Pesos públicos do índice de prioridade por trecho (Fase F1).

Pesos iniciais aprovados pelo usuário; literatura-base: frameworks de
priorização ripária multicritério (WIREs Water 2024: NDVI + conectividade +
lógica resist-accept-direct; CRI Sentinel-2 2026; RQI validado em campo).

Princípio: peso é juízo de valor → fica em arquivo próprio, versionado e
servido em GET /api/v2/methods. Muda sem deploy de lógica.
"""

from __future__ import annotations

METHODS_VERSION = "f2-2026-11"

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


METHODS_TEXT = """Índice de prioridade por trecho de APP (v4 F1).

Janelas Sentinel-2 (mesma estação, jun–ago; mediana top-3, nuvens < 20%):
- baseline: 2023-06-01..2023-08-31 (referência same-season, antes da enchente);
- regen: 2026-06-01..2026-08-31 (janela atual, usada na severidade);
- regen_2025: 2025-06-01..2025-08-31 (comparação de um ano de recuperação);
- pre: 2024-01-01..2024-03-31 e pos: 2024-06-01..2024-08-31
  (evento de mai/2024 e diff com a v3).

Componentes (todos 0..1, maior = mais prioritário):
- severity: fração de pixels críticos (NDVI<0,2) na janela atual (regen 2026).
- no_regen: déficit de NDVI baseline→pos não recuperado em pos→regen
  (mesma estação; evita confundir sazonalidade com dano).
- connectivity: 1 - NDVI médio dos trechos vizinhos (fragmento isolado = pior).
- risk: surgimento de criticidade versus a baseline
  (frac_critico_pos - frac_critico_baseline), i.e. dano criado pelo evento.
- cost: heurística F1 (1 - área_a_restaurar_ha/25); será calibrada com
  tabelas de custo de campo (ex.: programa MUDA) na F2.

Limitações declaradas: sem validação de campo o escore é prospecção, não
diagnóstico; trechos com baixa fração válida carregam incerteza (ver campo
`valid_fraction` por trecho); pesos são ajustáveis e versionados.

Medição no buffer (v4): as estatísticas de NDVI passam a ser calculadas dentro
do buffer ripário de 200 m, rasterizado na grade de 10 m do composite. O bbox
de busca STAC é derivado dos limites do buffer + 30 m de margem. `frac_critico`
e `frac_moderado` são relativas aos pixels válidos do buffer; `frac_validos` é
relativa aos pixels do buffer. As janelas e o método da máscara ficam no
`manifest.json`/`methods.json` de cada versão.
"""
