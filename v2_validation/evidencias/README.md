# Evidências da sessão Colab (Fase 0, 2026-09-06)

- `ndvi10m_series_colab.png` — série NDVI 10 m (pre/pos/regen), saída da Célula 3.
- `gates_intermediario_celula6.json` — gates após a Célula 6 **antes** do SR
  (só G5 PASS; G1–G3 aguardavam a Célula 4). Preservado como intermediário.
- `gates_final.json` — **veredito final transcrito da sessão** (G1/G2/G3 PASS
  após as Células 4c/4d/4e/4f-fix; ver `../README.md`). Transcrito porque o
  download do `gates.json` final não foi feito antes do fim da sessão.

Pendente (não resgatado): nada — resgate completo em 2026-09-06.

## Sessão completa do Colab (canônica)

- `fase0_sessao_colab.ipynb` — notebook executado, 28 células (14 de código,
  todas com outputs): Células 0–6 + 4b/4c/4d/4e/4f-fix (correção do bug de
  borda do `predict_large`, máscara válida do NDVI-SR, correção de CRS na
  amostragem dos pontos). Este arquivo substitui `../fase0_ndvi_sr_validacao.ipynb`
  como registro fiel do que rodou; o da raiz segue como template limpo.
- `ndvi_sr_25m.png` — histograma + mapa NDVI 2,5 m da Célula 4d (1440×480).
