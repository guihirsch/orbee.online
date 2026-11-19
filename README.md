# OrBee.Online

Portal de monitoramento ambiental com dados satelitais e validação
comunitária. O foco atual é a bacia do Taquari e a análise de mata ciliar.

## Estrutura

- `frontend/` — React + Vite, MapLibre/Mapbox, Tailwind e Supabase.
- `backend/` — FastAPI, API v1/v2, schema SQL, jobs NDVI e endpoints HLS.
- `v2_validation/` — notebooks, crosschecks e evidências dos gates da v2.
- `backend/data/` — artefatos versionados por bacia/versão, quando presentes.

## Frontend

O `node_modules` está versionado neste repo; `npm ci` pode alterar milhares de
arquivos rastreados. Se possível, use o ambiente já presente.

```bash
cd frontend
npm run dev
```

Se precisar reinstalar as dependências:

```bash
npm ci
```

As variáveis usadas pelo frontend são `VITE_API_URL`, `VITE_API_V2_URL`,
`VITE_V2_STATIC` e `VITE_V2_DATA` (veja `frontend/src/lib/apiV2.js`). Os
arquivos `frontend/.env.example` e `frontend/env.example` estão desatualizados;
não use como referência. Não commite segredos.

Verificação:

```bash
npm run build
```

O build estático do portal usa `VITE_V2_STATIC=1`.

## Backend

Requer Python 3.12 (o pin de `pydantic-core` não compila em 3.14).

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install pytest
pytest tests -q
```

Esse fluxo cobre os testes da API v2. O comando de entrada é `python main.py`
(ou `uvicorn main:app --reload --port 8000`), mas o `main.py` importa também
dependências opcionais (por exemplo, SQLAlchemy) e o pin atual de `supabase`
pode precisar de ajuste para o boot completo; trate isso como um trabalho
separado. Quando a API está no ar, ela expõe `/health` e `/docs`.

A configuração local usa `backend/.env`. O arquivo atual está versionado e
contém credenciais; não adicione novas chaves. A limpeza e a rotação do
conteúdo atual são um incidente separado.

## Dados e jobs

Os jobs batch ficam em `backend/jobs/` e não rodam no processo web. Eles geram
`reaches.geojson`, `summary.json`, `methods.json`, `manifest.json` e tiles SR
por bacia/versão. O detalhamento e os comandos estão em
[`backend/jobs/README.md`](backend/jobs/README.md).

## Deploy

O portal estático é publicado no GitHub Pages pelo workflow
`.github/workflows/deploy-pages.yml` em push para `main` que toque
`frontend/**` ou o próprio workflow (ou via `workflow_dispatch`):

- instala o frontend com `npm ci`;
- faz o build com `VITE_V2_STATIC=1 npm run build -- --base=/orbee.online/`;
- publica `frontend/dist` com fallback SPA para `/bacias`.

## Validação

`v2_validation/` guarda notebooks, crosschecks e evidências dos gates da v2.
Veja [`v2_validation/README.md`](v2_validation/README.md).
