# 📓 Notebooks - Análise e Desenvolvimento

Esta pasta contém Jupyter notebooks para análise de dados, desenvolvimento e experimentação com foco em dados HLS (Harmonized Landsat Sentinel) e análise de mata ciliar.

## 📁 Arquivos

### `HLS.ipynb` ⭐

**Função:** Notebook principal para análise de mata ciliar com dados HLS da NASA

**Características:**

- **Processamento HLS:** Dados Harmonized Landsat Sentinel via Microsoft Planetary Computer
- **Análise NDVI:** Cálculo automático com máscaras de qualidade
- **Mata Ciliar:** Detecção de degradação em buffers de rios (200m)
- **Pontos Críticos:** Geração inteligente com controle de densidade
- **Exportação:** GeoJSON e GeoTIFF para integração web
- **Correções:** Sistema robusto com fallbacks e diagnósticos

### `NDVI.ipynb`

**Função:** Notebook legado para análise básica de dados NDVI

**Características:**

- Análise de dados NDVI
- Visualização de pontos críticos
- Processamento de dados geoespaciais
- Experimentação com algoritmos

### `NDVI copy.ipynb`

**Função:** Backup do notebook legado

**Características:**

- Cópia de segurança
- Versionamento de experimentos
- Backup de análises importantes

### `Integrated_NDVI_SuperResolution.ipynb`

**Função:** Notebook avançado com super-resolução

**Características:**

- Processamento de super-resolução
- Integração NDVI avançada
- Pipeline de processamento completo

## 🚀 Como Usar

### 🌟 **Notebook Principal (HLS.ipynb):**

#### Google Colab (Recomendado):

```bash
# 1. Abrir no Google Colab
# 2. Fazer upload do arquivo export.geojson (AOI)
# 3. Executar todas as células sequencialmente
# 4. Download automático dos resultados
```

#### Jupyter Local:

```bash
cd scripts/notebooks/
jupyter notebook HLS.ipynb
```

#### Dependências HLS:

```bash
pip install pystac-client planetary_computer rasterio rioxarray geopandas
pip install shapely matplotlib numpy requests folium contextily stackstac xarray dask
```

### 📊 **Notebooks Legados:**

```bash
cd scripts/notebooks/
jupyter notebook NDVI.ipynb
# ou
jupyter lab NDVI.ipynb
```

## 📊 Conteúdo dos Notebooks

### 🛰️ **HLS.ipynb - Pipeline Completo:**

#### **ETAPA 1:** Carregamento da AOI

- Suporte múltiplas fontes (local, upload, exemplo)
- Validação de geometrias
- Conversão CRS automática
- Criação de buffer mata ciliar (200m)

#### **ETAPA 2:** Busca HLS via STAC API

- Conexão Microsoft Planetary Computer
- Busca automática Landsat + Sentinel-2
- Filtros inteligentes (nuvens, período)
- Fallbacks para diferentes períodos

#### **ETAPA 3:** Processamento NDVI

- Carregamento bandas Red/NIR/QA
- Máscaras de qualidade (Fmask)
- Cálculo NDVI com validação
- Composição temporal ponderada

#### **ETAPA 4:** Análise de Degradação

- Classificação por severidade
- Estatísticas dentro do buffer
- Status geral da mata ciliar
- Visualizações automáticas

#### **ETAPA 5:** Pontos Críticos (CORRIGIDA)

- Geração restrita ao buffer do rio
- Controle de densidade (100m mínimo)
- Priorização por proximidade ao rio
- Múltiplas categorias de severidade

#### **ETAPA 6:** Exportação

- **GeoJSON:** Compatível com aplicação web
- **GeoTIFF:** Raster NDVI normalizado
- **Log:** Detalhes completos do processamento
- **Download:** Automático no Colab

### 📊 **Notebooks Legados:**

#### **NDVI.ipynb:**

- Carregamento de dados básico
- Processamento de coordenadas
- Cálculo de estatísticas
- Visualização de resultados

#### **Experimentação:**

- Testes de algoritmos
- Validação de dados
- Otimização de parâmetros
- Comparação de métodos

## 🔧 Configuração

### 🌟 **Para HLS.ipynb (Principal):**

#### Dependências Essenciais:

```bash
# Dados satelitais e STAC
pip install pystac-client planetary-computer stackstac

# Processamento geoespacial
pip install rasterio rioxarray geopandas shapely

# Análise e visualização
pip install xarray dask matplotlib numpy pandas

# Mapas e web
pip install folium contextily requests

# Jupyter
pip install jupyter notebook ipywidgets
```

#### Google Colab (Mais Fácil):

```python
# Execute no Colab - instalação automática
!pip install pystac-client planetary_computer rasterio rioxarray geopandas shapely matplotlib numpy requests folium contextily stackstac xarray dask -q
```

### 📊 **Para Notebooks Legados:**

```bash
pip install jupyter notebook pandas numpy matplotlib seaborn folium geopandas
```

### 🔧 **Configuração Jupyter:**

```bash
jupyter notebook --generate-config
```

### 🚀 **Extensões Recomendadas:**

```bash
pip install jupyter-contrib-nbextensions
jupyter contrib nbextension install --user
```

## 📈 Recursos dos Notebooks

### 🛰️ **HLS.ipynb - Tecnologias Avançadas:**

#### **Dados Satelitais:**

- **STAC API:** Busca automática de dados
- **Microsoft Planetary Computer:** Hospedagem global
- **HLS v2.0:** Dados Landsat + Sentinel-2 harmonizados
- **Planetary Computer:** Autenticação e URLs assinadas

#### **Processamento Geoespacial:**

- **Rasterio:** Manipulação de rasters
- **RioXarray:** Interface xarray-rasterio
- **Stackstac:** Arrays STAC para análise
- **GeoPandas:** Operações vetoriais
- **Shapely:** Geometrias complexas

#### **Análise Científica:**

- **Xarray:** Arrays N-dimensionais
- **Dask:** Computação paralela
- **NumPy:** Operações matemáticas
- **Pandas:** Análise de dados

#### **Qualidade e Robustez:**

- **Máscaras Fmask:** Controle de qualidade
- **Fallbacks Inteligentes:** Períodos alternativos
- **Diagnósticos:** Validação em tempo real
- **Logs Detalhados:** Rastreabilidade completa

### 📊 **Notebooks Legados:**

#### **Análise de Dados:**

- **Pandas:** Manipulação de dados
- **NumPy:** Cálculos numéricos
- **Matplotlib:** Visualizações
- **Seaborn:** Gráficos estatísticos

#### **Geoespacial:**

- **Folium:** Mapas interativos
- **GeoPandas:** Dados geoespaciais
- **Shapely:** Geometrias
- **Fiona:** I/O de dados geoespaciais

#### **Visualização:**

- **Plotly:** Gráficos interativos
- **Bokeh:** Visualizações web
- **Altair:** Gramática de gráficos
- **IPython:** Widgets interativos

## 🎯 Casos de Uso

### 🌟 **HLS.ipynb - Produção:**

#### **1. Análise Operacional de Mata Ciliar:**

- Processamento automático de dados HLS
- Detecção de degradação em tempo real
- Geração de pontos críticos para campo
- Exportação para aplicação web

#### **2. Monitoramento Ambiental:**

- Análise temporal de NDVI
- Identificação de áreas prioritárias
- Relatórios de impacto ambiental
- Suporte à tomada de decisão

#### **3. Pesquisa Científica:**

- Validação de métodos de análise
- Comparação de diferentes períodos
- Estudos de caso regionais
- Publicação de resultados

#### **4. Integração de Sistemas:**

- Pipeline automatizado de dados
- Compatibilidade com aplicação web
- Suporte a múltiplas AOIs
- Escalabilidade para diferentes regiões

### 📊 **Notebooks Legados:**

#### **1. Análise Exploratória:**

- Exploração de dados
- Identificação de padrões
- Validação de qualidade
- Estatísticas descritivas

#### **2. Desenvolvimento:**

- Prototipagem de algoritmos
- Testes de funcionalidades
- Validação de resultados
- Documentação de processos

#### **3. Experimentação:**

- Testes de parâmetros
- Comparação de métodos
- Otimização de algoritmos
- Validação de hipóteses

#### **4. Apresentação:**

- Relatórios interativos
- Dashboards
- Apresentações
- Documentação

## 📋 Boas Práticas

### Organização:

- Células bem estruturadas
- Comentários explicativos
- Markdown para documentação
- Código limpo e legível

### Versionamento:

- Commits regulares
- Mensagens descritivas
- Backup de experimentos
- Controle de versões

### Performance:

- Otimização de código
- Uso eficiente de memória
- Caching de resultados
- Paralelização quando possível

## 🔄 Workflow

### Desenvolvimento:

1. **Exploração:** Análise inicial dos dados
2. **Prototipagem:** Desenvolvimento de algoritmos
3. **Validação:** Testes e validação
4. **Otimização:** Melhoria de performance
5. **Documentação:** Registro de resultados

### Análise:

1. **Carregamento:** Importação de dados
2. **Limpeza:** Preprocessamento
3. **Análise:** Processamento e cálculos
4. **Visualização:** Gráficos e mapas
5. **Interpretação:** Conclusões e insights

## 🚀 Próximos Passos

### 🌟 **HLS.ipynb - Melhorias:**

1. **Automação:** Scripts de execução batch
2. **Integração:** API REST para processamento
3. **Monitoramento:** Alertas automáticos de degradação
4. **Escalabilidade:** Processamento de múltiplas regiões
5. **Machine Learning:** Predição de degradação

### 📊 **Notebooks Legados:**

1. **Migração:** Atualização para HLS
2. **Templates:** Estruturas padronizadas
3. **Documentação:** Guias de uso
4. **Arquivamento:** Organização histórica

### 🔄 **Sistema Completo:**

1. **Pipeline Automatizado:** Processamento contínuo
2. **Dashboard:** Monitoramento em tempo real
3. **API Integration:** Conexão backend-notebook
4. **Deployment:** Ambiente de produção
5. **Documentação:** Guias técnicos completos

## 📚 Recursos Adicionais

### 🌐 **Links Úteis:**

- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/)
- [NASA HLS Data](https://www.earthdata.nasa.gov/news/blog/harmonized-landsat-sentinel-2-hls-data-now-available-microsofts-planetary-computer)
- [STAC Specification](https://stacspec.org/)
- [HLS User Guide](https://lpdaac.usgs.gov/documents/1698/HLS_User_Guide_V2.pdf)

### 📖 **Documentação Técnica:**

- **CELULA_CORRECAO_HLS.md:** Correções implementadas
- **PROBLEMA_COORDENADAS_HLS.md:** Soluções de CRS
- **CORRECAO_BUFFER_RIO.md:** Ajustes de buffer
- **HLS_README.md:** Guia detalhado do HLS

### 🎯 **Para Desenvolvedores:**

1. Sempre usar **HLS.ipynb** para novos projetos
2. Documentar mudanças nos arquivos markdown
3. Testar com diferentes AOIs antes do deploy
4. Validar saídas na aplicação web
5. Manter logs para auditoria
