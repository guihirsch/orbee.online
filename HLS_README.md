# HLS.ipynb - Análise de Mata Ciliar com Dados HLS (Harmonized Landsat Sentinel)

## Visão Geral

O notebook `HLS.ipynb` foi desenvolvido para processar dados HLS (Harmonized Landsat Sentinel) da NASA para análise de mata ciliar no projeto Orbee. Este notebook integra dados harmonizados de múltiplas missões satelitais para fornecer análise NDVI de alta qualidade e cobertura temporal consistente.

## O que é HLS?

HLS (Harmonized Landsat Sentinel) é um produto da NASA que combina dados de:

- **Landsat 8/9 OLI** (Operational Land Imager)
- **Sentinel-2A/2B MSI** (MultiSpectral Instrument)

Os dados são harmonizados para:

- Resolução espacial consistente (30m)
- Correções atmosféricas padronizadas
- Calibração radiométrica unificada
- Cobertura temporal melhorada (2-3 dias)

## Funcionalidades do Notebook

### 1. Carregamento e Preparação de Dados

- **Área de Interesse (AOI)**: Carrega geometrias de mata ciliar do arquivo `export.geojson`
- **Período de Análise**: Define janela temporal para busca de dados HLS
- **Filtros de Qualidade**: Aplica máscaras de nuvens e qualidade de pixel

### 2. Busca e Download de Dados HLS

- **API NASA Earthdata**: Conecta com o catálogo HLS via STAC
- **Seleção Automática**: Escolhe cenas com menor cobertura de nuvens
- **Bandas Espectrais**: Baixa bandas necessárias para cálculo NDVI:
   - Banda 4 (Red): 665nm
   - Banda 5 (NIR): 865nm

### 3. Processamento NDVI

- **Cálculo NDVI**: `(NIR - Red) / (NIR + Red)`
- **Máscara de Qualidade**: Remove pixels de nuvens, sombras e água
- **Normalização**: Valores NDVI entre -1 e +1

### 4. Análise de Mata Ciliar

- **Detecção de Degradação**: Identifica áreas com NDVI baixo
- **Classificação de Severidade**:
   - **Crítico**: NDVI < 0.2 (vegetação severamente degradada)
   - **Moderado**: NDVI 0.2-0.4 (vegetação parcialmente degradada)
   - **Saudável**: NDVI > 0.4 (vegetação densa)

### 5. Geração de Pontos Críticos

- **Algoritmo de Detecção**: Identifica pixels com degradação significativa
- **Filtragem Espacial**: Remove pontos muito próximos (densidade controlada)
- **Metadados**: Adiciona informações de severidade, coordenadas e estatísticas

### 6. Exportação de Resultados

- **GeoJSON**: Pontos críticos para visualização web
- **GeoTIFF**: Raster NDVI para análise GIS
- **Estatísticas**: Relatório de cobertura e degradação

## Vantagens dos Dados HLS

### Cobertura Temporal Melhorada

- **Landsat**: Revisita a cada 16 dias
- **Sentinel-2**: Revisita a cada 10 dias (5 dias com ambos os satélites)
- **HLS Combinado**: Revisita a cada 2-3 dias

### Qualidade Radiométrica

- **Calibração Cruzada**: Dados harmonizados entre sensores
- **Correção Atmosférica**: Processamento consistente
- **Detecção de Nuvens**: Algoritmos avançados de mascaramento

### Resolução Espacial

- **30 metros**: Adequada para análise de mata ciliar
- **Cobertura Global**: Disponível mundialmente
- **Histórico Longo**: Dados desde 2013

## Integração com o Sistema Orbee

### Pipeline de Dados

1. **HLS.ipynb** → Processa dados satelitais brutos
2. **critical_points_mata_ciliar.geojson** → Pontos críticos detectados
3. **AOIViewer.jsx** → Visualização web interativa
4. **Backend API** → Serve dados para aplicação

### Arquivos de Saída

- `public/critical_points_mata_ciliar.geojson`: Pontos críticos para mapa web
- `public/ndvi_mata_ciliar_wgs84_normalized.geotiff`: Raster NDVI processado
- `scripts/notebooks/processamento_notebook.log`: Log de execução

## Configurações e Parâmetros

### Parâmetros de Qualidade

```python
CLOUD_COVERAGE_MAX = 30  # Máximo 30% de nuvens
NDVI_CRITICAL_THRESHOLD = 0.2  # Limite para degradação crítica
NDVI_MODERATE_THRESHOLD = 0.4  # Limite para degradação moderada
MIN_VALID_PIXELS = 0.05  # Mínimo 5% de pixels válidos
```

### Configurações Espaciais

```python
BUFFER_DISTANCE = 200  # Buffer de mata ciliar (metros)
MIN_DISTANCE_POINTS = 100  # Distância mínima entre pontos críticos
TILE_SIZE = 512  # Tamanho do tile para processamento
```

## Dependências Principais

### Bibliotecas Python

- `pystac_client`: Acesso ao catálogo STAC
- `planetary_computer`: Autenticação Microsoft Planetary Computer
- `rasterio`: Manipulação de dados raster
- `geopandas`: Processamento de dados geoespaciais
- `numpy`: Cálculos numéricos
- `matplotlib`: Visualização de dados

### APIs e Serviços

- **NASA Earthdata**: Catálogo de dados HLS
- **Microsoft Planetary Computer**: Acesso aos dados via STAC
- **USGS Earth Explorer**: Fonte alternativa de dados

## Execução

### Pré-requisitos

1. Conta NASA Earthdata (gratuita)
2. Arquivo `export.geojson` com geometria da mata ciliar
3. Ambiente Python com dependências instaladas

### Passos de Execução

1. **Configurar Credenciais**: NASA Earthdata login
2. **Definir AOI**: Carregar geometria da mata ciliar
3. **Executar Notebook**: Processar células sequencialmente
4. **Verificar Resultados**: Validar arquivos de saída
5. **Integrar ao Sistema**: Copiar arquivos para `public/`

## Monitoramento e Logs

### Arquivo de Log

- **Localização**: `scripts/notebooks/processamento_notebook.log`
- **Conteúdo**: Timestamps, estatísticas, erros
- **Rotação**: Logs são anexados a cada execução

### Métricas de Qualidade

- **Cobertura de Nuvens**: Percentual por cena
- **Pixels Válidos**: Quantidade após mascaramento
- **Pontos Detectados**: Número de pontos críticos
- **Área Analisada**: Extensão total processada

## Troubleshooting

### Problemas Comuns

1. **Erro de Autenticação**: Verificar credenciais NASA Earthdata
2. **Sem Dados Disponíveis**: Ajustar período ou área de busca
3. **Muitas Nuvens**: Expandir janela temporal
4. **Memória Insuficiente**: Reduzir tamanho do tile

### Otimizações

- **Processamento em Lote**: Dividir AOI em tiles menores
- **Cache Local**: Reutilizar dados baixados
- **Paralelização**: Processar múltiplos tiles simultaneamente

## Status Atual

⚠️ **NOTA**: O arquivo `HLS.ipynb` está atualmente vazio e precisa ser implementado. Este documento descreve a funcionalidade planejada baseada na arquitetura do sistema e nos notebooks relacionados (`Integrated_NDVI_SuperResolution.ipynb` e `HLS_COMPLETE_COVERAGE.ipynb`).

## Próximos Passos

1. **Implementar Notebook**: Desenvolver código baseado na especificação
2. **Testar Pipeline**: Validar com dados reais de Sinimbu/RS
3. **Otimizar Performance**: Melhorar velocidade de processamento
4. **Documentar API**: Criar documentação técnica detalhada
5. **Integrar CI/CD**: Automatizar execução e deploy
