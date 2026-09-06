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
