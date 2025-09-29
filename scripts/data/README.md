# 📦 Data - Arquivos de Dados

Esta pasta contém todos os arquivos de dados geoespaciais e configurações do projeto.

## 📁 Arquivos

### Dados Geoespaciais

#### `export.geojson`

**Função:** Dados de rios e corpos d'água da região

**Características:**

- Geometrias de rios e arroios
- Propriedades de tipo de via d'água
- Coordenadas em formato GeoJSON
- Dados extraídos do OpenStreetMap

**Estrutura:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[lon, lat], ...]
      },
      "properties": {
        "name": "Nome do Rio",
        "waterway": "river"
      }
    }
  ]
}
```

#### `critical_points_sr (1).json`

**Função:** Pontos críticos com valores NDVI baixos

**Características:**

- 83 pontos críticos identificados
- Valores NDVI < 0.3
- Coordenadas precisas
- Dados para análise de degradação

**Estrutura:**

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
        "ndvi": 0.0803
      }
    }
  ]
}
```

#### `critical_points.json`

**Função:** Arquivo de pontos críticos (vazio - template)

**Características:**

- Template para novos dados
- Estrutura padrão GeoJSON
- Pronto para preenchimento

## 📊 Estatísticas dos Dados

### Pontos Críticos:

- **Total:** 83 pontos
- **NDVI mínimo:** -0.1103
- **NDVI máximo:** 0.2884
- **NDVI médio:** 0.0818

### Distribuição por Faixas:

- **NDVI < 0.1:** 57 pontos (68.7%)
- **NDVI 0.1-0.2:** 16 pontos (19.3%)
- **NDVI 0.2-0.3:** 10 pontos (12.0%)

### Localização:

- **Centro:** -29.484170, -52.514294
- **Região:** Santa Cruz do Sul, RS, Brasil
- **Range Lat:** -29.592403 a -29.375411
- **Range Lon:** -52.566230 a -52.459853

## 🗺️ Uso dos Dados

### Visualização:

```bash
cd ../visualization/
python visualize_geojson_simple.py
```

### Análise:

```bash
cd ../notebooks/
jupyter notebook NDVI.ipynb
```

### Integração:

```bash
cd ../preprocessing/
python preload_municipalities.py
```

## 🔧 Formato dos Dados

### GeoJSON:

- **Padrão:** RFC 7946
- **Sistema de Coordenadas:** WGS84 (EPSG:4326)
- **Precisão:** 6 casas decimais
- **Encoding:** UTF-8

### Propriedades:

- **NDVI:** Valores entre -1 e 1
- **Coordenadas:** [longitude, latitude]
- **Nomes:** UTF-8 com acentos
- **Tipos:** Categorização por tipo

## 📈 Qualidade dos Dados

### Validação:

- ✅ Formato GeoJSON válido
- ✅ Coordenadas dentro do Brasil
- ✅ Valores NDVI realistas
- ✅ Propriedades consistentes

### Limitações:

- ⚠️ Dados de uma região específica
- ⚠️ Pontos críticos de um período
- ⚠️ Dependência de dados externos

## 🚀 Atualização dos Dados

### Processo:

1. **Coleta:** Dados de satélite
2. **Processamento:** Análise NDVI
3. **Validação:** Verificação de qualidade
4. **Atualização:** Substituição de arquivos
5. **Versionamento:** Controle de versões

### Frequência:

- **Pontos críticos:** Semanal
- **Rios:** Mensal
- **Validação:** Diária

## 📋 Manutenção

### Backup:

- Arquivos versionados no Git
- Backup automático semanal
- Retenção de 30 dias

### Limpeza:

- Remoção de dados obsoletos
- Compressão de arquivos grandes
- Otimização de formato

## 🔍 Troubleshooting

### Problemas Comuns:

1. **Arquivo não encontrado:** Verificar caminho
2. **Formato inválido:** Validar GeoJSON
3. **Coordenadas incorretas:** Verificar sistema de coordenadas
4. **Dados vazios:** Verificar fonte dos dados

### Soluções:

- Usar validadores GeoJSON online
- Verificar encoding UTF-8
- Confirmar sistema de coordenadas
- Validar estrutura JSON
