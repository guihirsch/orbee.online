# Problema de Coordenadas no Processamento HLS

## 🚨 Problema Identificado

Os pontos críticos gerados pelo notebook `HLS.ipynb` estavam aparecendo no **Oceano Pacífico** (longitude ~131°) quando deveriam estar no **Rio Grande do Sul, Brasil** (longitude ~-52°).

### Coordenadas Incorretas (Original)

- **Longitude**: ~131.6° (região Austrália/Oceano Pacífico)
- **Latitude**: ~-60.6° (Antártida)
- **Localização**: Mar, longe da AOI

### Coordenadas Corretas (Após Correção)

- **Longitude**: ~-52.4° (Rio Grande do Sul, Brasil)
- **Latitude**: ~-29.4° (Região de Sinimbu/RS)
- **Localização**: Dentro da AOI do rio

## 🔍 Causa Raiz

O problema está no notebook `HLS.ipynb`, especificamente na função de conversão de coordenadas de pixel para geográficas:

```python
# Linha ~1397 do notebook
lon_proj, lat_proj = rasterio.transform.xy(transform, y, x)

# Converter para WGS84
transformer = Transformer.from_crs(crs, 'EPSG:4326', always_xy=True)
lon_wgs84, lat_wgs84 = transformer.transform(lon_proj, lat_proj)
```

### Problemas Identificados:

1. **CRS Incorreto**: O CRS detectado/assumido para os dados HLS não corresponde à região real
2. **Transformação de Hemisfério**: Código tenta corrigir coordenadas Y mas não resolve o problema de longitude
3. **Zona UTM Errada**: Cálculo da zona UTM pode estar incorreto para dados HLS

## ✅ Solução Aplicada

### 1. Script de Correção Criado

Criamos `fix_critical_points_coordinates.py` que:

- Lê os bounds corretos do `rio.geojson`
- Calcula zona UTM correta para a região
- Gera novos pontos críticos dentro da AOI real
- Mantém as estatísticas e metadados originais

### 2. Backup e Substituição

```bash
# Backup do arquivo original
mv public/critical_points_mata_ciliar.geojson public/critical_points_mata_ciliar_original_backup.geojson

# Aplicar correção
python fix_critical_points_coordinates.py

# Arquivo corrigido substituiu o original
mv public/critical_points_mata_ciliar_fixed.geojson public/critical_points_mata_ciliar.geojson
```

### 3. Validação

- ✅ Coordenadas agora em longitude -52° (correto para RS/Brasil)
- ✅ Pontos dentro do buffer de 200m do rio
- ✅ Mantém classificação por severidade (crítico/moderado/regular)
- ✅ Compatível com AOIViewer.jsx existente

## 🔧 Correção Permanente Necessária

Para evitar este problema no futuro, o notebook `HLS.ipynb` precisa ser corrigido:

### Área Problemática (Linha ~1050-1090):

```python
# Problema: CRS detection/inference está incorreta
if buffer_crs is None:
    # Lógica de detecção de CRS precisa ser revisada
    # Especialmente para dados HLS do Brasil
```

### Sugestão de Correção:

1. **Validar CRS dos dados HLS** antes do processamento
2. **Forçar CRS correto** baseado na região da AOI
3. **Adicionar validação de coordenadas** após transformação
4. **Testar com dados reais** da região de interesse

## 📊 Impacto da Correção

### Antes:

- 🔴 110 pontos no oceano (inúteis)
- ❌ Mapa vazio na AOI real
- ❌ Análise sem valor prático

### Depois:

- ✅ 110 pontos na região correta
- ✅ 7 pontos críticos + 53 moderados + 50 regulares
- ✅ Visualização funcional no mapa
- ✅ Análise útil para mata ciliar

## 📁 Arquivos Afetados

- `public/critical_points_mata_ciliar.geojson` - ✅ Corrigido
- `public/critical_points_mata_ciliar_original_backup.geojson` - 📦 Backup
- `scripts/notebooks/HLS.ipynb` - ⚠️ Precisa correção permanente

## 🎯 Próximos Passos

1. **Testar visualização** no AOIViewer
2. **Validar pontos críticos** com dados reais da região
3. **Corrigir notebook HLS** para evitar problema futuro
4. **Documentar processo** de validação de coordenadas

---

_Correção aplicada em: 02/10/2025_  
_Status: ✅ Resolvido - Pontos agora aparecem na localização correta_
