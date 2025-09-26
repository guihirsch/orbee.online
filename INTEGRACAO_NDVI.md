### Integração NDVI (Sentinel-1/2) com melhoria por IA para Sinimbu/RS

Este guia descreve o passo a passo para entregar um mapa NDVI web dinâmico, com opção de melhoria de resolução (super-resolução) e delimitação específica das matas ciliares do município de Sinimbu/RS.

Observação: a base do backend já existe em FastAPI, com serviço NDVI e endpoints; aqui documentamos como ativar o fluxo real e evoluir para IA e AOI.

---

### 1) Preparar variáveis de ambiente

Crie/atualize `.env` no backend:

```bash
SENTINEL_HUB_CLIENT_ID=seu_client_id
SENTINEL_HUB_CLIENT_SECRET=seu_client_secret
SENTINEL_HUB_INSTANCE_ID=opcional

# Provedor e IA
NDVI_PROVIDER=sentinel_hub           # ou earth_engine | sentinel_hub_mock
ENABLE_SUPER_RESOLUTION=false        # true para ativar
SUPER_RES_MODEL=bicubic              # bicubic | dr-3.0 | esrgan

# Supabase (para cache/armazenamento)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
```

---

### 2) Endpoints disponíveis (atual + dinâmico)

- NDVI (coordenadas/período):
   - `GET /api/v1/ndvi/data?latitude=..&longitude=..&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
   - `POST /api/v1/ndvi/data` (body `NDVIRequest`)
- NDVI atual (ponto):
   - `GET /api/v1/ndvi/current?latitude=..&longitude=..`
- Série temporal NDVI:
   - `GET /api/v1/ndvi/timeseries?latitude=..&longitude=..&days=90`
- GEO dinâmico:
   - `GET /api/v1/geo/search?q=&source=ibge|osm|local` → busca municípios
   - `GET /api/v1/geo/municipalities/:code/geometry?source=osm|local[&q=texto]` → GeoJSON
- AOI ripária (dinâmico por município):
   - `GET /api/v1/aoi/municipality/:code/riparian?buffer_m=30` → GeoJSON (planejado)
- AOI Sinimbu (ripárias – placeholder existente):
   - `GET /api/v1/aoi/sinimbu/riparian`
- NDVI por AOI/município:
   - `POST /api/v1/ndvi/aoi` body: `{ municipality_code | geometry, start_date, end_date, max_cloud, superres }`
- Histórico NDVI:
   - `GET /api/v1/ndvi/history/{municipality_code}?days=90&limit=100` → série temporal
   - `GET /api/v1/ndvi/trend/{municipality_code}?days=30` → análise de tendência

Testes rápidos:

```bash
curl -s "http://localhost:8000/api/v1/ndvi/current?latitude=-29.55&longitude=-52.45" | jq
curl -s "http://localhost:8000/api/v1/aoi/sinimbu/riparian" | jq
curl -s "http://localhost:8000/api/v1/geo/search?q=Sinimbu&source=ibge" | jq
curl -s "http://localhost:8000/api/v1/geo/search?q=Sinimbu&source=osm" | jq
curl -s -X POST "http://localhost:8000/api/v1/ndvi/aoi" \
  -H "Content-Type: application/json" \
  -d '{"municipality_code":"4320676","start_date":"2024-06-01","end_date":"2024-08-31","max_cloud":30,"superres":false}' | jq
```

---

### 3) Mapa e Frontend

- Componente `src/components/NDVIMap.jsx` já renderiza mapa Mapbox e consome `ndviService`.
- Próximos ajustes:
   - Autocomplete de município: usa `GET /geo/search` e guarda `{ ibge_code, bbox }`.
   - Carregar limite municipal via `GET /geo/municipalities/:code/geometry` e desenhar layer.
   - Carregar AOI ripária dinâmica (quando disponível) ou placeholder (Sinimbu).
   - `POST /ndvi/aoi` para buscar NDVI/estatísticas por município/AOI e pintar camada.
   - Permitir alternar NDVI real vs. simulado; toggle de super-res.

---

### 3.1) Fluxo do usuário (end-to-end)

1. Usuário abre a página da plataforma e digita o município no campo de busca.
2. Frontend chama `GET /api/v1/geo/search?q=&source=osm|ibge|local` e exibe sugestões.
3. Ao selecionar um município:
   - Frontend chama `GET /api/v1/geo/municipalities/:code/geometry?source=osm|local[&q=texto]` e desenha o limite municipal (AOI) no `NDVIMap` (fit bounds automático).
   - Em paralelo, chama `GET /api/v1/plan/municipality/{code}?source=osm` e recebe o "plano de ação" (resumo NDVI + zonas A/B/C) com dados dos últimos 30 dias.
   - A UI substitui os cards estáticos pelos cards dinâmicos de `response.zones` e exibe um pequeno resumo (`response.summary`) se desejado.
4. **Automático**: O backend busca automaticamente os dados NDVI dos últimos 30 dias e salva no banco para histórico/tendência. Não há necessidade de o usuário selecionar período.
5. Cache: buscas e geometrias são atendidas via cache TTL; chamadas repetidas ao mesmo município/período retornam mais rápido.

Observações de UX:

- Fonte padrão de busca recomendada: `osm` (melhor bbox/geojson). `ibge` garante códigos oficiais; usar como fallback/validação.
- Quando `plan` estiver carregado, a grade de cards deve usar `plan.zones`. Se falhar, manter cards estáticos atuais.

---

### 4) NDVI real (Sentinel Hub)

- O serviço `backend/app/services/ndvi_service.py` já tem estrutura para chamar a API `/process` do Sentinel Hub com evalscript NDVI (B08/B04) e máscara de nuvem via `SCL`.
- Próximos incrementos:
   1. Implementar processamento real do TIFF (usar `rasterio`/`numpy` para extrair estatísticas e, se necessário, gerar GeoTIFF/PNG base64).
   2. Suportar `bbox` da AOI (em vez de um ponto + raio) quando fornecido.
   3. Adicionar filtro de cobertura de nuvens e estratégia de fallback (última imagem boa no período).

Dependências sugeridas no backend:

```bash
pip install rasterio shapely geojson httpx numpy pillow
```

---

### 5) AOI municipal (matas ciliares dinâmicas)

- Endpoints dinâmicos:
   - `GET /api/v1/geo/municipalities/:code/geometry` → GeoJSON do município.
   - `GET /api/v1/aoi/municipality/:code/riparian?buffer_m=XXX` → GeoJSON (planejado).
- Placeholder existente para testes: `GET /api/v1/aoi/sinimbu/riparian`.
- Etapas:
   1. Ingestão de limites IBGE e rede hidrográfica OSM/HydroSHEDS para Supabase.
   2. Cálculo de buffer (ex.: 30–500 m) e recorte pelo limite municipal.
   3. Simplificação/validação e publicação como GeoJSON/TopoJSON.
   4. Parametrização de `buffer_m` via query.

Bibliotecas úteis: `shapely`, `pyproj`, `osmnx` (para extração OSM), ou pré-processar offline e armazenar no Supabase Storage.

---

### 6) Melhoria por IA (Super-Resolução)

Referência: "Sentinel-2 Deep Resolution 3.0" (`https://medium.com/@ya_71389/sentinel-2-deep-resolution-3-0-c71a601a2253`).

Estratégia incremental:

1. Começar com upscale bicúbico (rápido) quando `ENABLE_SUPER_RESOLUTION=true`.
2. Integrar um modelo leve (ex.: ESRGAN/Real-ESRGAN) ou serviço externo para super-res.
3. Pipeline: Raster NDVI → corte por AOI → upscale (IA) → normalização → publicação (tile/WMTS, tiles XYZ ou GeoTIFF/PNG no Storage).

No backend, expor parâmetro `superres=true` em endpoints NDVI e respeitar `SUPER_RES_MODEL`.

---

### 7) Cache/Armazenamento no Supabase

- Objetivo: reduzir custo/latência de processar sempre o mesmo período/área.
- Armazenar:
   - Resultados raster por chave: `{aoi_hash}_{date_range}_{cloud_max}_{superres}`.
   - GeoJSONs de AOI derivados (e versões).
   - Estatísticas agregadas (médias, tendência).
- Estratégia:
   1. Cache em memória (TTL) imediato para `geo/search`, geometrias e NDVI por AOI (implementado).
   2. Evoluir para Supabase Storage/Tabela (chave: `{aoi_hash}_{date_range}_{cloud_max}_{superres}`) e CDN.
   3. Consultar cache antes da chamada ao provedor; salvar/renovar TTL após processamento.

### 7.1) Histórico NDVI no Banco de Dados

- **Tabela `ndvi_history`** (implementar):

   ```sql
   CREATE TABLE ndvi_history (
     id SERIAL PRIMARY KEY,
     municipality_code VARCHAR(10) NOT NULL,
     geometry GEOMETRY(POLYGON, 4326),
     ndvi_value DECIMAL(4,3),
     date_observed DATE,
     cloud_coverage INTEGER,
     source VARCHAR(20), -- 'sentinel_hub', 'earth_engine', etc.
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

- **Benefícios**:
   - Tendências históricas automáticas (últimos 30 dias, 3 meses, 1 ano).
   - Análise de degradação/recuperação por zona.
   - Alertas baseados em mudanças significativas de NDVI.
   - Redução de chamadas à API externa (cache persistente).

### 7.2) Aplicar Migração no Supabase

Execute o script de migração no Supabase SQL Editor:

```sql
-- Execute: database/migrations/001_create_ndvi_history.sql
-- Ou copie o conteúdo do arquivo e execute no Supabase
```

**Verificação:**

- Acesse o Table Editor do Supabase
- Verifique se a tabela `ndvi_history` foi criada
- Confirme que os índices foram aplicados

---

### 8) Integração no Frontend

- Atualizar `src/services/ndviService.js` para suportar:
   - Busca por AOI (GeoJSON) e NDVI por AOI/período.
   - Parâmetro `superres=true`.
   - Exibir camadas: AOI (linha/preenchimento) + raster/tiles NDVI.
- Atualizar `NDVIMap.jsx`:
   - Adicionar camada do AOI de Sinimbu.
   - Adicionar controle para ativar super-res.
   - Mostrar NDVI atual e série temporal.

---

### 9) Observabilidade, limites e custos

- Rate limiting e cache forte para evitar excesso de chamadas ao Sentinel/EE.
- Logs de latência e taxa de acerto de cache.
- Monitorar cobertura de nuvens média por período.

---

### 10) Deploy

- Backend: garantir variáveis setadas no ambiente.
- Rodar migrações/seed conforme necessário.
- Verificar CORS (frontend em produção em `orbee.online`).

Checklist rápido:

- [ ] `.env` preenchido
- [ ] NDVI real com processamento TIFF ativado
- [ ] AOI ripária municipal (dinâmico) gerado de fonte oficial
- [ ] Super-res (bicubic → IA) funcionando
- [x] Cache Supabase operante (tabela `ndvi_history` criada)
- [x] Frontend consumindo AOI/NDVI e exibindo camadas
- [x] Salvamento automático de histórico NDVI implementado
- [x] Endpoints de histórico e tendência funcionando

---

### Referências

- Sentinel Hub Process API (evalscript NDVI)
- Super-Resolução S2 DR 3.0: `https://medium.com/@ya_71389/sentinel-2-deep-resolution-3-0-c71a601a2253`
- OSM/IBGE para limites e hidrografia
