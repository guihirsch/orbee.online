# 📊 Preprocessing - Scripts de Pré-processamento

Esta pasta contém scripts responsáveis pelo pré-processamento e cache de dados municipais.

## 📁 Arquivos

### `preload_municipalities.py`

**Função:** Pré-carregamento de dados municipais em cache para resposta rápida da API

**Características:**

- Cache de geometrias municipais
- Cache de planos de ação
- Cache de dados NDVI históricos
- Processamento paralelo de municípios
- Limpeza automática de cache expirado

**Uso:**

```bash
python preload_municipalities.py
```

### `preload_municipalities_ai.py`

**Função:** Versão com IA para super-resolução de imagens Sentinel-2

**Características:**

- Integração com modelos de IA
- Super-resolução de imagens
- Processamento avançado de NDVI
- Cache inteligente com IA

**Uso:**

```bash
python preload_municipalities_ai.py
```

### `scheduler.py`

**Função:** Agendador para execução periódica dos scripts de pré-processamento

**Características:**

- Execução a cada 6 horas
- Execução diária às 2:00 AM
- Execução semanal aos domingos às 3:00 AM
- Controle de concorrência
- Logs detalhados

**Uso:**

```bash
python scheduler.py
```

## 🔧 Configuração

### Variáveis de Ambiente:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/orbee
```

### Dependências:

```bash
pip install asyncio httpx sqlalchemy schedule
```

## 📊 Tabelas de Cache

### `municipality_geometry_cache`

- Geometrias municipais
- Bounding boxes
- Fonte dos dados (OSM)

### `municipality_plan_cache`

- Planos de ação
- Dados NDVI
- Zonas de interesse
- Resumos estatísticos

### `municipality_ndvi_cache`

- Séries temporais NDVI
- Cobertura de nuvens
- Estatísticas por data

## 🚀 Execução

### Manual:

```bash
cd preprocessing/
python preload_municipalities.py
```

### Agendado:

```bash
cd preprocessing/
python scheduler.py
```

### Com IA:

```bash
cd preprocessing/
python preload_municipalities_ai.py
```

## 📈 Monitoramento

- Logs detalhados de execução
- Métricas de performance
- Taxa de sucesso por município
- Tempo de processamento
- Uso de cache

## 🔄 Manutenção

- Limpeza automática de cache expirado
- Retry automático em caso de falha
- Controle de concorrência
- Logs de erro detalhados
