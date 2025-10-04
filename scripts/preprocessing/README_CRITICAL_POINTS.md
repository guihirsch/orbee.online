# Pontos Críticos e Moderados - Guia de Uso

## 📁 Arquivos Gerados

### 1. `critical_points.geojson`

**Todos os pontos críticos gerados**

- **Conteúdo**: 8.184 pontos de análise ao longo dos rios
- **Atributos**: `river_name`, `station_m`, `side`, `offset_m`, `x`, `y`, `region`, `created_at`
- **Uso**: Análise completa de todos os pontos de monitoramento

### 2. `critical_moderate_points.geojson` ⭐ **NOVO**

**Apenas pontos críticos e moderados de NDVI**

- **Conteúdo**: 7.554 pontos filtrados (92.3% do total)
- **Atributos**: Todos os atributos originais + `ndvi`, `severity`, `ndvi_category`
- **Uso**: Foco em áreas que precisam de atenção imediata

## 🎯 Classificação de Severidade

### Critérios de NDVI

- **🔴 Crítico**: NDVI < 0.2 (5.899 pontos)
- **🟡 Moderado**: 0.2 ≤ NDVI < 0.5 (1.655 pontos)
- **🟢 Bom**: NDVI ≥ 0.5 (630 pontos - excluídos do arquivo)

### Atributos Adicionais

```json
{
   "ndvi": 0.47487699379149961,
   "severity": "moderate",
   "ndvi_category": "Moderado",
   "analysis_date": "2025-10-04T19:35:40.593357",
   "total_points": 7554,
   "critical_count": 5899,
   "moderate_count": 1655
}
```

## 🚀 Como Usar

### 1. Script Principal (Integrado)

```bash
cd scripts/preprocessing
python generate_aoi_points.py
```

**Gera**: `critical_points.geojson` + `critical_moderate_points.geojson`

### 2. Script Independente

```bash
cd scripts/preprocessing
python generate_critical_moderate_only.py
```

**Gera**: Apenas `critical_moderate_points.geojson` (filtra arquivo existente)

### 3. Uso no Frontend

```javascript
// Carregar pontos críticos e moderados
fetch("/public/critical_moderate_points.geojson")
   .then((response) => response.json())
   .then((data) => {
      // Filtrar por severidade
      const critical = data.features.filter(
         (f) => f.properties.severity === "critical"
      );
      const moderate = data.features.filter(
         (f) => f.properties.severity === "moderate"
      );

      // Aplicar estilos diferentes
      critical.forEach((point) => {
         // Estilo para pontos críticos (vermelho)
         point.properties.style = { color: "red", size: "large" };
      });

      moderate.forEach((point) => {
         // Estilo para pontos moderados (amarelo)
         point.properties.style = { color: "orange", size: "medium" };
      });
   });
```

## 📊 Estatísticas por Rio

### Distribuição dos Pontos Críticos/Moderados

- **Rio Pardinho**: 3.402 pontos (45.1%)
- **Rio Pequeno**: 2.034 pontos (26.9%)
- **Rio Pardo**: 1.458 pontos (19.3%)
- **Arroio Marcondes**: 936 pontos (12.4%)
- **Arroio Primavera**: 126 pontos (1.7%)

### Distribuição por Severidade

- **🔴 Críticos**: 5.899 pontos (78.1%)
- **🟡 Moderados**: 1.655 pontos (21.9%)

## 🎨 Visualização Sugerida

### Cores Recomendadas

- **🔴 Crítico**: `#FF0000` (Vermelho)
- **🟡 Moderado**: `#FFA500` (Laranja)
- **🟢 Bom**: `#00FF00` (Verde) - se incluído

### Tamanhos de Ponto

- **Crítico**: 8-10px
- **Moderado**: 6-8px
- **Bom**: 4-6px

### Opacidade

- **Crítico**: 0.8-1.0
- **Moderado**: 0.6-0.8
- **Bom**: 0.4-0.6

## 🔧 Configurações Avançadas

### Limiares de NDVI (Personalizáveis)

```python
# Em generate_critical_moderate_only.py
CRITICAL_THRESHOLD = 0.2    # NDVI < 0.2 = Crítico
MODERATE_THRESHOLD = 0.5    # 0.2 ≤ NDVI < 0.5 = Moderado
```

### Filtros Adicionais

```python
# Filtrar por rio específico
rio_pardinho = critical_moderate[critical_moderate['river_name'] == 'Rio Pardinho']

# Filtrar por lado do rio
lado_esquerdo = critical_moderate[critical_moderate['side'] == 'left']

# Filtrar por distância do rio
proximo_rio = critical_moderate[critical_moderate['offset_m'] <= 60]
```

## 📈 Análises Possíveis

### 1. Análise por Rio

- Qual rio tem mais pontos críticos?
- Qual rio tem maior percentual de degradação?

### 2. Análise por Posição

- Pontos próximos ao rio são mais críticos?
- Há padrões espaciais na degradação?

### 3. Análise Temporal

- Como a degradação evolui ao longo do tempo?
- Quais áreas precisam de monitoramento contínuo?

### 4. Análise de Severidade

- Distribuição de severidade por região
- Identificação de hotspots de degradação

## 🚨 Aplicações Práticas

### 1. Monitoramento Ambiental

- Identificar áreas prioritárias para restauração
- Planejar ações de conservação
- Monitorar efetividade de intervenções

### 2. Gestão de Recursos Hídricos

- Proteger áreas de recarga
- Identificar fontes de poluição
- Planejar corredores ecológicos

### 3. Planejamento Urbano

- Evitar ocupação em áreas críticas
- Planejar infraestrutura verde
- Desenvolver políticas de uso do solo

## 🔄 Atualizações Futuras

- [ ] Integração com dados HLS reais
- [ ] Análise de séries temporais
- [ ] Alertas automáticos
- [ ] Dashboard interativo
- [ ] Exportação para outros formatos
- [ ] Integração com APIs de monitoramento

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique se os arquivos de entrada existem
2. Confirme as permissões de escrita
3. Consulte os logs de processamento
4. Valide os dados GeoJSON gerados
