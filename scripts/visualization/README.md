# 🗺️ Visualization - Scripts de Visualização

Esta pasta contém scripts e templates para visualização de dados geoespaciais.

## 📁 Arquivos

### Scripts Python

#### `visualize_geojson.py`

**Função:** Script principal para visualização de dados GeoJSON

**Características:**

- Suporte a rios e pontos críticos
- Mapas interativos com Folium
- Legenda personalizada
- Popups informativos

#### `visualize_geojson_simple.py`

**Função:** Versão simplificada para execução automática

**Características:**

- Execução sem input do usuário
- Múltiplos formatos de saída
- Análise automática de dados
- Relatórios estatísticos

#### `visualize_geojson_fixed.py`

**Função:** Versão corrigida com múltiplas opções de tiles

**Características:**

- Múltiplas opções de tiles
- Controle de camadas
- Debug de coordenadas
- Fallback para tiles offline

#### `visualize_geojson_auto.py`

**Função:** Versão automática com análise completa

**Características:**

- Análise automática de dados
- Relatórios estatísticos
- Múltiplos formatos de saída
- Validação de dados

### Templates HTML

#### `mapa_offline.html`

**Função:** Visualização offline dos dados

**Características:**

- Funciona 100% offline
- Dados incorporados no HTML
- Estatísticas completas
- Lista de pontos com cores

#### `mapa_simples.html`

**Função:** Visualização simples com carregamento dinâmico

**Características:**

- Carregamento dinâmico de dados
- Estatísticas em tempo real
- Interface responsiva
- Validação de dados

#### `pontos_criticos_*.html`

**Função:** Visualizações específicas de pontos críticos

**Características:**

- Foco em pontos críticos
- Análise de NDVI
- Coordenadas para uso externo
- Exportação de dados

#### `debug_map.html`

**Função:** Mapa de debug para desenvolvimento

**Características:**

- Debug de coordenadas
- Validação de dados
- Testes de tiles
- Desenvolvimento

## 🎨 Recursos de Visualização

### Cores por NDVI:

- 🔴 **Vermelho:** NDVI < 0.1 (muito baixo)
- 🟠 **Laranja:** NDVI 0.1-0.2 (baixo)
- 🟡 **Amarelo:** NDVI 0.2-0.3 (médio)
- ⚫ **Cinza:** NDVI N/A

### Tipos de Mapa:

- **Completo:** Rios + pontos críticos
- **Simples:** Apenas pontos críticos
- **Debug:** Para desenvolvimento
- **Offline:** Sem dependências externas

## 🚀 Como Usar

### Executar Script Python:

```bash
cd visualization/
python visualize_geojson_simple.py
```

### Abrir Template HTML:

```bash
cd visualization/
start mapa_offline.html
```

### Criar Mapa Personalizado:

```bash
cd visualization/
python visualize_geojson.py
# Escolha opção 1 ou 2
```

## 📊 Dados Suportados

### Formatos:

- **GeoJSON** - Dados geoespaciais
- **JSON** - Dados de pontos críticos
- **CSV** - Dados tabulares

### Tipos de Geometria:

- **Point** - Pontos críticos
- **LineString** - Rios e estradas
- **MultiLineString** - Rios complexos
- **Polygon** - Áreas municipais

## 🔧 Configuração

### Dependências:

```bash
pip install folium geopandas numpy
```

### Arquivos Necessários:

- `critical_points_sr (1).json` - Pontos críticos
- `export.geojson` - Dados de rios

## 📈 Recursos Avançados

### Análise Estatística:

- NDVI mínimo, máximo e médio
- Distribuição por faixas
- Coordenadas de centro
- Range de coordenadas

### Exportação:

- HTML interativo
- Dados para Google Earth
- Coordenadas para QGIS
- Relatórios estatísticos

## 🎯 Casos de Uso

1. **Validação de Dados:** Verificar se os pontos estão corretos
2. **Análise Espacial:** Entender distribuição dos dados
3. **Apresentações:** Usar mapas em relatórios
4. **Desenvolvimento:** Debug de coordenadas
5. **Offline:** Trabalhar sem internet
