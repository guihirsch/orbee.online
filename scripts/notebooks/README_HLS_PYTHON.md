# HLS Analysis - Scripts Python

Este diretório contém os scripts Python convertidos do notebook `HLS.ipynb` para análise de mata ciliar com dados HLS (Harmonized Landsat Sentinel).

## 📁 Arquivos

### Scripts Principais
- **`hls_complete_analysis.py`** - Script principal que executa toda a análise
- **`hls_analysis.py`** - Funções de busca e carregamento de dados HLS
- **`hls_ndvi_processing.py`** - Processamento NDVI e máscaras de qualidade
- **`hls_degradation_analysis.py`** - Análise de degradação e geração de pontos críticos
- **`hls_export.py`** - Exportação de resultados (GeoJSON, GeoTIFF, Log)

### Arquivos de Configuração
- **`requirements_hls.txt`** - Dependências Python necessárias
- **`README_HLS_PYTHON.md`** - Este arquivo de documentação

## 🚀 Como Usar

### 1. Instalação das Dependências

```bash
# Instalar dependências
pip install -r requirements_hls.txt

# Ou instalar individualmente
pip install pystac-client planetary-computer rasterio rioxarray geopandas shapely matplotlib numpy pandas requests stackstac xarray dask pyproj
```

### 2. Execução do Script Principal

```bash
# Executar análise completa
python hls_complete_analysis.py

# Ou executar módulos individuais
python hls_analysis.py
python hls_ndvi_processing.py
python hls_degradation_analysis.py
python hls_export.py
```

### 3. Configuração

Edite as variáveis no início de cada script para personalizar:

```python
# Configurações principais
START_DATE = "2022-06-01"
END_DATE = "2022-09-30"
CLOUD_COVERAGE_MAX = 50
BUFFER_DISTANCE = 200  # metros
NDVI_CRITICAL_THRESHOLD = 0.2
NDVI_MODERATE_THRESHOLD = 0.5
```

## 📊 Saídas Geradas

### Arquivos de Resultado
- **`critical_points_mata_ciliar.geojson`** - Pontos críticos de degradação
- **`ndvi_mata_ciliar_wgs84_normalized.geotiff`** - Raster NDVI processado
- **`processamento_notebook.log`** - Log detalhado do processamento

### Estrutura do GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      },
      "properties": {
        "severity": "critical|moderate|fair",
        "ndvi": 0.123,
        "description": "Descrição da área",
        "type": "critical_point|moderate_point|fair_point",
        "level": "very_sparse|sparse|dense",
        "color": "#DC143C",
        "label": "Vegetação muito rala / solo exposto"
      }
    }
  ],
  "metadata": {
    "analysis_date": "2024-01-01T12:00:00",
    "data_source": "HLS (Harmonized Landsat Sentinel)",
    "statistics": { ... }
  }
}
```

## 🔧 Funcionalidades

### 1. Busca de Dados HLS
- Conexão com Microsoft Planetary Computer
- Busca automática de dados HLS Landsat e Sentinel-2
- Filtros por cobertura de nuvens e período
- Seleção dos melhores itens baseada em qualidade

### 2. Processamento NDVI
- Carregamento de bandas espectrais (Red, NIR)
- Aplicação de máscaras de qualidade (Fmask)
- Cálculo de NDVI com validação
- Composição de múltiplas cenas

### 3. Análise de Degradação
- Classificação de vegetação por NDVI
- Análise estatística da mata ciliar
- Detecção de áreas críticas e moderadas
- Geração de pontos críticos baseados em dados reais

### 4. Exportação de Resultados
- GeoJSON compatível com aplicação web
- GeoTIFF com valores reais de NDVI
- Log detalhado do processamento
- Validação de consistência dos dados

## 📋 Requisitos do Sistema

### Python
- Python 3.8 ou superior
- pip para instalação de dependências

### Dependências Principais
- **pystac-client**: Cliente STAC para busca de dados
- **planetary-computer**: Acesso ao Microsoft Planetary Computer
- **rasterio**: Processamento de dados raster
- **rioxarray**: Extensão xarray para dados geoespaciais
- **geopandas**: Manipulação de dados geoespaciais
- **shapely**: Geometrias espaciais
- **xarray**: Arrays multidimensionais
- **numpy**: Computação numérica
- **pandas**: Manipulação de dados tabulares

### Dependências Opcionais
- **folium**: Visualização de mapas interativos
- **contextily**: Mapas de fundo
- **matplotlib**: Visualizações estáticas

## 🐛 Solução de Problemas

### Erro de Conexão
```
❌ Erro crítico na busca HLS: Connection error
```
**Solução**: Verificar conexão com internet e acesso ao Microsoft Planetary Computer

### Erro de Dependências
```
ModuleNotFoundError: No module named 'pystac_client'
```
**Solução**: Instalar dependências com `pip install -r requirements_hls.txt`

### Erro de Dados
```
❌ Nenhum item HLS encontrado
```
**Solução**: Verificar período de análise e cobertura de nuvens, tentar região diferente

### Erro de Memória
```
MemoryError: Unable to allocate array
```
**Solução**: Reduzir área de análise ou usar processamento em chunks menores

## 📚 Documentação Adicional

- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/)
- [HLS Data Documentation](https://hls.gsfc.nasa.gov/)
- [STAC Specification](https://stacspec.org/)
- [Rasterio Documentation](https://rasterio.readthedocs.io/)
- [GeoPandas Documentation](https://geopandas.org/)

## 🤝 Contribuição

Para contribuir com melhorias nos scripts:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste com dados reais
5. Submeta um pull request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação acima
2. Consulte os logs de processamento
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**Nota**: Estes scripts foram convertidos do notebook Jupyter `HLS.ipynb` para facilitar a execução em ambientes de produção e automação.
