# HLS Analysis - Análise de Mata Ciliar

Pacote Python para análise de degradação da mata ciliar usando dados HLS (Harmonized Landsat Sentinel).

## 📁 Estrutura do Pacote

```
hls_analysis/
├── __init__.py                    # Pacote Python
├── hls_analysis.py               # Busca e carregamento de dados HLS
├── hls_ndvi_processing.py        # Processamento de dados NDVI
├── hls_degradation_analysis.py   # Análise de degradação da mata ciliar
├── hls_export.py                 # Exportação de resultados
├── hls_complete_analysis.py      # Script principal integrado
├── run_analysis.py               # Script de execução principal
├── config_hls.py                 # Configurações do sistema
├── requirements_hls.txt          # Dependências Python
└── README.md                     # Este arquivo
```

## 🚀 Como Usar

### Execução Rápida

```bash
cd scripts/hls_analysis
python run_analysis.py
```

### Execução do Script Principal

```bash
cd scripts/hls_analysis
python hls_complete_analysis.py
```

### Uso como Módulo

```python
from scripts.hls_analysis import hls_complete_analysis

# Executar análise
hls_complete_analysis.main()
```

## 📊 Dados Utilizados

### Fontes de Dados Reais

- **Microsoft Planetary Computer**: Dados HLS (Landsat + Sentinel-2)
- **OpenStreetMap**: Geometrias de rios e limites administrativos
- **Dados de Satélite**: Bandas espectrais reais para cálculo NDVI

### Processamento

- **NDVI Real**: Calculado a partir de bandas espectrais reais
- **Análise de Degradação**: Baseada em pixels reais de satélite
- **Pontos Críticos**: Gerados a partir de dados NDVI reais

## ⚙️ Configurações

### Região Padrão

- **Região**: Sinimbu, Rio Grande do Sul, Brasil
- **Período**: 2025-06-01 a 2025-09-30
- **Buffer**: 200m de mata ciliar
- **Thresholds**: Crítico < 0.2, Moderado < 0.5

### Personalização

Edite as variáveis no início de `hls_complete_analysis.py`:

```python
REGION_NAME = "Sua Região, Estado, Brasil"
START_DATE = "2025-06-01"
END_DATE = "2025-09-30"
BUFFER_DISTANCE = 200
```

## 📋 Dependências

Instale as dependências:

```bash
pip install -r requirements_hls.txt
```

### Principais Bibliotecas

- `pystac-client`: Acesso ao Microsoft Planetary Computer
- `osmnx`: Dados geográficos do OpenStreetMap
- `rioxarray`: Processamento de dados raster
- `geopandas`: Manipulação de dados geoespaciais
- `rasterio`: Leitura/escrita de arquivos raster

## 📤 Resultados

### Arquivos Gerados

- `critical_points_mata_ciliar.geojson`: Pontos críticos de degradação
- `ndvi_mata_ciliar_wgs84_normalized.geotiff`: Mapa NDVI processado
- `processamento_notebook.log`: Log detalhado do processamento

### Metadados

Todos os arquivos incluem metadados completos sobre:

- Fonte dos dados (HLS real)
- Parâmetros de processamento
- Estatísticas de degradação
- Validação de consistência

## 🔍 Validação de Dados

### Garantias de Integridade

- ✅ **Apenas dados reais**: Sem dados inventados ou simulados
- ✅ **Validação de cobertura**: Verifica disponibilidade HLS
- ✅ **Máscaras de qualidade**: Filtra pixels válidos
- ✅ **Conversão de coordenadas**: UTM ↔ WGS84 precisa
- ✅ **Consistência NDVI**: Valida pontos vs análise

### Fallbacks Removidos

- ❌ **Sem dados de exemplo**: Falha se não conseguir dados reais
- ❌ **Sem simulações**: Apenas dados de satélite reais
- ❌ **Sem valores inventados**: NDVI calculado de bandas reais

## 🛠️ Desenvolvimento

### Estrutura Modular

- **hls_analysis**: Busca e carregamento
- **hls_ndvi_processing**: Processamento NDVI
- **hls_degradation_analysis**: Análise de degradação
- **hls_export**: Exportação de resultados

### Testes

```bash
# Testar importação
python -c "from hls_analysis import hls_complete_analysis; print('✅ OK')"

# Testar execução
python run_analysis.py
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs de processamento
2. Confirme a conectividade com Microsoft Planetary Computer
3. Valide a região especificada no OpenStreetMap
4. Verifique as dependências instaladas

---

**Desenvolvido por**: Orbee Online Team  
**Versão**: 1.0.0  
**Licença**: MIT
