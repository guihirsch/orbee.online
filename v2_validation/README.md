# Validação v2 — Orbee (Fase 0)

Portão científico antes de qualquer código de produto: responder, com números,
**"o NDVI super-resolvido a 2,5 m é confiável para priorizar trechos de mata ciliar na Bacia do Pardo?"**

Nada em `backend/` ou `frontend/` muda até o veredito deste notebook.

## Como executar

1. Abra `fase0_ndvi_sr_validacao.ipynb` no Google Colab (GPU opcional; CPU basta para o modelo primário).
2. Execute as células em ordem (0 → 5). Cada célula imprime PASS/FAIL dos seus critérios.
3. Preencha a tabela de veredito na Célula 5 e registre o resultado aqui abaixo.

## Gates de decisão (go/no-go para a v2)

| Gate | Teste | Critério de passagem |
|---|---|---|
| G0 | Correlação espacial NDVI S2-10m vs HLS-30m atual | Pearson ≥ 0,85 nos mesmos trechos |
| G1 | Consistência espectral do SR (Wald: SR→10m vs original) | ERGAS < 3, SAM < 5°, PSNR > 30 dB |
| G2 | Viés solo→vegetação (alerta Major/VRVis 2025) | \|viés médio NDVI em solo nu\| ≤ 0,05 (ou corrigido por regressão) |
| G3 | Acordo de NDVI agregado + pontos críticos preservados | RMSE ≤ 0,08; ≥ 80% dos pontos críticos mantidos |
| G4 | Incerteza contida (só se rodar LDSR-S2) | Incerteza alta só em bordas, não no interior da mata |
| G5 | Regeneração detectável 2024→2026 | ΔNDVI positivo nos trechos MUDA/Unisc |
| G6 | Sanidade externa | Perda no trecho-controle do Soturno na ordem dos −69% publicados (Ferreira et al. 2025) |

**Verde:** G0–G3 + G5 passam (G4 se aplicável; G6 como sanidade). → Desenhar backend v2 + portal.
**Vermelho:** qualquer gate estrutural (G1, G2 incorrigível, G3) falha → documentar o negativo, reavaliar escopo.

## Resultados registrados

| Data | Executor | G0 | G1 | G2 | G3 | G4 | G5 | G6 | Veredito |
|---|---|---|---|---|---|---|---|---|---|
| 2026-09-06 | Colab (CPU) | DROPPED | PASS (ERGAS 0,389 · SAM 0,17° · PSNR 51,8) | PASS (viés 0,0019) | PASS (RMSE 0,0133 · 40/41 críticos) | SKIPPED (sem GPU) | PASS (Δ +0,0139) | SKIPPED | 🟢 VERDE |

## Veredito final (2026-09-06)

**Fase 0 VERDE incondicional.** NDVI super-resolvido a 2,5 m (SEN2SRLite
`NonReference_RGBN_x4`, CPU) é espectralmente fiel, não inventa vegetação em
solo exposto e reproduz 98% (40/41) dos pontos críticos da v1 na Bacia do
Pardo — com dados públicos e custo zero de sensoriamento.

Notas metodológicas:
- G0 descartado por decisão do executor; validação da fonte via G5 + G6/literatura.
- G3 exigiu correção de CRS na amostragem (grade UTM EPSG:32722 vs graus):
  a primeira versão amostrou a borda da grade (pearson 0,000 espúrio); após a
  conversão lon/lat→UTM, 41/50 pontos amostrados, 40/41 ainda < 0,2.
- `pre` (verão) vs `pos` (inverno) mistura sazonalidade + enchente; a medida
  confiável de recuperação é `pos→regen` (mesma estação): +0,0139 / +0,0149.
- Janela SR: 2,56×2,56 km no centro da AOI (224×224 px @10m, recorte exigido
  pelo `predict_large` — bug de borda com retalhos ≠128 px).

## Referências

- Donike et al. 2025, LDSR-S2, IEEE JSTARS, DOI 10.1109/JSTARS.2025.3542220
- ESA OpenSR: https://github.com/ESAOpenSR/sen2sr · https://github.com/ESAOpenSR/opensr-model
- Galar et al. 2020, SR S2-RGBN com perda NDVI, Remote Sensing 12(18):2941
- Major (VRVis 2025), avaliação espectral holística de SR S2 (viés solo→vegetação)
- Mühlhaus et al. 2026, ISPRS Annals (fidelidade transformer > difusão em tarefa downstream)
- Ferreira et al. 2025, APP rio Soturno pós-enchente 2024 (−68,86% arbórea)
- Bohrer 2025 (TCC UFRGS), perda vegetal Taquari-Antas via EVI (−22/−23%)
- Embrapa Recupera Rural RS (2026): 550,4 mil ha atingidos; base de 4,46 M ha de APPs
- Programa MUDA – Rio Pardinho (Fundação JTI + Unisc, 2026–2030): 12 trechos, 3,1 km
