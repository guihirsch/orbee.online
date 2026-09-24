# Evidências da sessão Colab (Fase 0, 2026-09-06)

- `ndvi10m_series_colab.png` — série NDVI 10 m (pre/pos/regen), saída da Célula 3.
- `gates_intermediario_celula6.json` — gates após a Célula 6 **antes** do SR
  (só G5 PASS; G1–G3 aguardavam a Célula 4). Preservado como intermediário.
- `gates_final.json` — **veredito final transcrito da sessão** (G1/G2/G3 PASS
  após as Células 4c/4d/4e/4f-fix; ver `../README.md`). Transcrito porque o
  download do `gates.json` final não foi feito antes do fim da sessão.

Pendente (não resgatado): nada — resgate completo em 2026-09-06.

## Validação do build Taquari v1 (Lajeado/RS, 2026-09-24)

- `taquari_v1_validacao.json` — bateria V1–V6 (`backend/jobs/validate_basin.py`, só leitura):
  **PASS_WITH_WARNS, 31 checagens, 0 FAIL, 14 WARN**. Score/banda/componentes
  reexecutados nos 6 trechos, summary/manifest reconciliados, geometrias ~500 m
  com centroides no piloto, IDs estáveis reproduzidos, intervalos S2 íntegros,
  direção pre→pos→regen coerente com pós-enchente, tiles íntegros em disco,
  SHA dos pesos confere (`c895c7da…`). WARNs documentados: `pos` com 2 cenas
  (< top_n=3), `length_m`/centroide não publicados, ordens não-sequenciais
  (várias linhas OSM), IDs das cenas STAC não registrados, 0,05% dos pixels SR
  fora de [-1,1]. Limite: sem verdade de campo, veredito máximo = consistente +
  plausível + fiel (escore é prospecção, não diagnóstico).
- `taquari_sr_25m.png` — NDVI 10 m (coarsened) vs SR 2,5 m nos 3 trechos PASS
  (G1/G2): corredor do rio nítido, sem artefato de retalho.

## Fase A — crosscheck S2 × CBERS-4A (2026-09-24, segunda opinião)

- `taquari_crosscheck.json` — NDVI WPM-8 m (INPE STAC, janela regen,
  `backend/jobs/build_crosscheck.py`) vs S2 publicado, por trecho, com os IDs
  das cenas WPM usadas. Viés sistemático S2−CBERS ≈ −0,11 (DN sem correção
  atmosférica; causa conhecida e documentada), Spearman da ordenação 0,429
  (n=6, inconclusivo).
- `taquari_cbers_x_s2.png` — barras S2×CBERS por trecho + dispersão (y=x):
  offset sistemático visível, mesma direção nos 6 trechos.
- `taquari_v1_validacao.json` (atualizado) — bateria V1–**V7**: o V7 registra
  3 FAIL + 3 WARN no acordo absoluto inter-sensores; V1–V6 seguem íntegros.
  Veredito global honesto: **FAIL localizado no V7** — os valores absolutos
  entre sensores divergem por calibração; a ordenação é inconclusiva com n=6.
  Decisão: campo, não mais pixel.

## Sessão completa do Colab (canônica)

- `fase0_sessao_colab.ipynb` — notebook executado, 28 células (14 de código,
  todas com outputs): Células 0–6 + 4b/4c/4d/4e/4f-fix (correção do bug de
  borda do `predict_large`, máscara válida do NDVI-SR, correção de CRS na
  amostragem dos pontos). Este arquivo substitui `../fase0_ndvi_sr_validacao.ipynb`
  como registro fiel do que rodou; o da raiz segue como template limpo.
- `ndvi_sr_25m.png` — histograma + mapa NDVI 2,5 m da Célula 4d (1440×480).
