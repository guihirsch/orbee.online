# Jobs offline da v2

Scripts batch que **não rodam no processo web**. Geram artefatos versionados
servidos pela API v2 como arquivos estáticos.

## build_basin.py

Gera `reaches.geojson + summary.json + methods.json + manifest.json` por
bacia/versão a partir de rios OSM + Sentinel-2 (Planetary Computer) + índice
de prioridade (`app/core/priority_weights.py`).

```bash
pip install -r backend/jobs/requirements.txt

# Piloto Pardo (trechos v1 + Pardinho), só 2 trechos (smoke real):
python backend/jobs/build_basin.py --basin pardo \
  --region "Sinimbu, Rio Grande do Sul, Brasil" \
  --pilot-bbox -52.7608 -29.5547 -52.4759 -29.3064 \
  --limit-reaches 2 --out backend/data/basins/pardo/v1

# Sintético (sem rede/deps geo — valida pipeline + API):
python backend/jobs/build_basin.py --basin pardo --synthetic 8 \
  --out backend/data/basins/pardo/v1
```

Build atômico: escreve em diretório temporário e renomeia no fim; nunca
publica artefato parcial. Reprocessar = nova pasta de versão (`v2/`, …).
Janelas padrão (`pre/pos/regen`) espelham a Fase 0 (`v2_validation/`).

### v4 — medição no buffer de 200 m

A partir da pasta `v4`, o job mede o NDVI **dentro do buffer ripário**, não no
quadrado de ~1 km ao redor do centroide:

- o bbox de busca STAC é derivado dos limites do buffer + `--buffer-margin-m`
  (padrão 30 m), em vez de `centroide ± 0.005°`;
- o buffer é rasterizado na grade do NDVI (10 m) e as estatísticas usam
  `app/services/buffer_stats.py` (`frac_critico` relativa aos pixels válidos do
  buffer; `frac_validos` relativa aos pixels do buffer);
- o build falha rápido (`S2BufferOutside`) se a máscara vier vazia ou se o
  buffer cair fora/truncado no raster;
- `manifest.json`/`methods.json` registram `buffer_m`, margem, método da
  máscara, bbox derivado e as janelas; cada trecho publica `search_bbox`,
  `n_pixels_buffer`/`n_pixels_validos` e as stats por janela.

### v4 — baseline jun–ago/2023 e janela 2026

A v4 compara a estação certa (ticket #6):

- `baseline`: 2023-06-01..2023-08-31 (referência same-season, antes da enchente);
- `regen`: 2026-06-01..2026-08-31 (janela atual, usada na severidade);
- `regen_2025`: 2025-06-01..2025-08-31 (comparação de um ano);
- `pre`/`pos` (2024) continuam para o evento e o diff com a v3.

`risk` compara `frac_critico_pos` com `frac_critico_baseline`; o déficit do
`no_regen` é `ndvi_mean_baseline - ndvi_mean_pos`. As cinco janelas elevam o
tempo de STAC/composite em ~2/3 sobre a v3. O manifest/methods publicam
`baseline_window` e `windows`; o payload por trecho ganha `stats_baseline` e
`stats_regen_2025`.

```bash
python backend/jobs/build_basin.py --basin taquari \
  --region "Lajeado, Rio Grande do Sul, Brasil" \
  --pilot-bbox -52.15 -29.62 -51.75 -29.28 \
  --river taquari --out backend/data/basins/taquari/v4

python backend/jobs/validate_basin.py --basin taquari --version v4 \
  --out v2_validation/evidencias/taquari_v4_validacao.json
```

Para refazer só o composite (sem OSM), reuse os trechos de uma versão
anterior com `--reaches-from backend/data/basins/taquari/v3/reaches.geojson`.
As geometrias/ids são preservados e o build recalcula bbox do buffer e stats.

O gate V8 do `validate_basin.py` verifica buffer/máscara/bbox e rejeita
`n_pixels_buffer=0`. O gate V9 exige a baseline jun–ago/2023 declarada no
manifest/methods e `stats_baseline` em todos os trechos (mesma estação).

## build_sr.py

SR 2,5 m (SEN2SRLite `NonReference_RGBN_x4`) nos top-N trechos por score:

```bash
pip install -r backend/jobs/requirements.txt
pip install torch sen2sr mlstac cubo   # extras SR (CPU basta)

python backend/jobs/build_sr.py --basin pardo --version v1 --top-n 12
```

Pesos: baixados via `mlstac` de
`huggingface.co/tacofoundation/sen2sr` (licença CC0/MIT) para
`<JOBS_DATA_DIR>/models/` — **fora do repo**; SHA-256 registrado no
`sr_summary.json`. Saídas por trecho: `sr_rgbn.tif` + `ndvi_sr.tif` (COGs) e
`tiles/ndvi_sr/{z}/{x}/{y}.png` (zooms 13–17, paleta YlGn). Gates G1/G2
revalidados por trecho (`sr_status` PASS/FAILED + motivo).
