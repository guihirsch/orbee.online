# HLS Complete Analysis - Versão Atualizada

## 🚀 Novas Funcionalidades

### ✨ Filtro Inteligente por Região

O script agora busca automaticamente rios de **qualquer região brasileira** com filtro preciso por limites administrativos:

- 🎯 **Busca automática**: Digite o nome da região e o script encontra os rios
- 🔍 **Filtro preciso**: Apenas rios realmente dentro dos limites do município
- 📊 **Relatório detalhado**: Mostra a porcentagem de cada rio dentro da região
- 🚫 **Sem "rios extras"**: Elimina rios de municípios vizinhos

### 🌍 Regiões Suportadas

- ✅ Qualquer município brasileiro
- ✅ Regiões com rios mapeados no OpenStreetMap
- ✅ Filtro automático por limites administrativos
- ✅ Validação de cobertura de dados HLS

## 📋 Como Usar

### 1. Configuração Básica

```python
# Em hls_complete_analysis.py, edite a variável:
REGION_NAME = "Sua Região, Estado, Brasil"
```

### 2. Exemplos de Regiões

```python
# Exemplos válidos:
REGION_NAME = "Sinimbu, Rio Grande do Sul, Brasil"
REGION_NAME = "Caxias do Sul, Rio Grande do Sul, Brasil"
REGION_NAME = "Porto Alegre, RS"
REGION_NAME = "São Paulo, SP"
REGION_NAME = "Brasília, DF"
```

### 3. Execução

```bash
cd scripts/notebooks
python hls_complete_analysis.py
```

## 🔧 Configurações Avançadas

### Parâmetros Principais

```python
# Região para análise
REGION_NAME = "Sinimbu, Rio Grande do Sul, Brasil"

# Buffer de mata ciliar (metros)
BUFFER_DISTANCE = 200

# Período para busca HLS
START_DATE = "2022-06-01"
END_DATE = "2022-09-30"

# Máxima cobertura de nuvens aceita (%)
CLOUD_COVERAGE_MAX = 50

# Limiares de NDVI
NDVI_CRITICAL_THRESHOLD = 0.2  # Crítico
NDVI_MODERATE_THRESHOLD = 0.5  # Moderado
```

### Parâmetros de Pontos Críticos

```python
# Distância mínima entre pontos (metros)
MIN_DISTANCE_POINTS = 100

# Máximo de pontos por categoria de severidade
MAX_POINTS_PER_SEVERITY = 50

# Buffer do rio para análise (metros)
BUFFER_DISTANCE_RIVER = 200
```

## 📊 Resultados Gerados

### Arquivos de Saída

1. **`critical_points_mata_ciliar.geojson`**
   - Pontos críticos de degradação da mata ciliar
   - Atributos: severidade, NDVI, coordenadas, metadados

2. **`ndvi_mata_ciliar_wgs84_normalized.geotiff`**
   - Mapa NDVI processado e normalizado
   - Formato GeoTIFF para visualização

3. **`processamento_notebook.log`**
   - Log detalhado do processamento
   - Estatísticas e informações de debug

### Metadados da AOI

- Região analisada
- Número de rios encontrados
- Área total da AOI
- Buffer aplicado
- Data de criação

## 🌊 Processo de Filtragem de Rios

### 1. Busca de Limites Administrativos

```
📍 Obtendo limites administrativos...
✅ Limites do município carregados
```

### 2. Busca de Rios na Região

```
🌊 Buscando rios na região...
📊 Encontrados X rios na região
📏 X rios com geometrias lineares
```

### 3. Filtro por Limites

```
🔍 Filtrando rios dentro dos limites do município...
✅ Rio Principal: 100.0% dentro do município
✅ Rio Secundário: 85.3% dentro do município
❌ Rio Vizinho: apenas 2.1% dentro do município
```

### 4. Criação da AOI

```
🏞️ Criando AOI unificada com buffer de 200m...
📏 Área da AOI: XX.XX km²
✅ X rios dentro dos limites do município
```

## 🎯 Vantagens da Nova Abordagem

### ✅ Precisão

- Apenas rios realmente da região
- Filtro por limites administrativos reais
- Validação de porcentagem de cobertura

### ✅ Flexibilidade

- Qualquer região brasileira
- Configuração simples
- Adaptação automática a diferentes regiões

### ✅ Confiabilidade

- Elimina rios de municípios vizinhos
- Relatório detalhado de filtragem
- Validação de cobertura HLS

### ✅ Eficiência

- Busca otimizada
- Cache de dados OSM
- Processamento inteligente

## 🔍 Exemplos de Uso

### Análise de Sinimbu/RS

```python
REGION_NAME = "Sinimbu, Rio Grande do Sul, Brasil"
# Resultado: 15 rios filtrados, AOI de 17.1 km²
```

### Análise de Porto Alegre/RS

```python
REGION_NAME = "Porto Alegre, Rio Grande do Sul, Brasil"
# Resultado: Múltiplos rios da região metropolitana
```

### Análise de São Paulo/SP

```python
REGION_NAME = "São Paulo, São Paulo, Brasil"
# Resultado: Rios urbanos como Tietê e Pinheiros
```

## 🚨 Limitações e Considerações

### Regiões com Poucos Rios

- Algumas regiões podem ter poucos rios mapeados no OSM
- O script informa quando não encontra rios suficientes

### Cobertura HLS

- Regiões muito ao norte podem ter cobertura limitada
- O script verifica automaticamente a cobertura disponível

### Qualidade dos Dados

- Depende da qualidade dos dados no OpenStreetMap
- Rios não mapeados não serão incluídos na análise

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique se a região está corretamente formatada
2. Confirme se há rios mapeados no OpenStreetMap
3. Verifique a cobertura HLS da região
4. Consulte os logs de processamento

## 🔄 Atualizações Futuras

- [ ] Suporte a outros países
- [ ] Integração com outras fontes de dados
- [ ] Interface gráfica para configuração
- [ ] Análise de séries temporais
- [ ] Exportação para outros formatos
