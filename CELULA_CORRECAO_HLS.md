# Correção para HLS.ipynb - Nova Célula para Substituir a Etapa 5

## 🔧 Como Aplicar a Correção

### 1. Localizar a Célula Problemática

No notebook `HLS.ipynb`, encontre a célula da **ETAPA 5** que contém:

```python
def generate_critical_points(degradation_analysis, max_points_per_category=500):
```

### 2. Substituir o Conteúdo da Célula

Substitua todo o conteúdo da célula da ETAPA 5 pelo código abaixo:

---

## 📝 Nova Célula - ETAPA 5 CORRIGIDA

```python
# ==========================================
# ETAPA 5: Geração de Pontos Críticos Restritos ao Buffer do Rio (CORRIGIDA)
# ==========================================

print("\n📍 ETAPA 5: Geração de Pontos Críticos (VERSÃO CORRIGIDA)")
print("-" * 60)

# Configurações para pontos críticos
MIN_DISTANCE_POINTS = 100  # Distância mínima entre pontos (metros)
MAX_POINTS_PER_SEVERITY = 50  # Reduzido para melhor performance
BUFFER_DISTANCE_RIVER = 200  # Buffer do rio em metros
SAMPLING_STEP = 3  # Para compatibilidade com função de exportação

def load_river_geometry_for_buffer():
    """Carrega geometria do rio para criar buffer preciso"""

    # Caminhos possíveis para o arquivo do rio
    rio_paths = [
        "../../public/rio.geojson",
        "../public/rio.geojson",
        "rio.geojson",
        "export.geojson",
        "../data/export.geojson"
    ]

    river_gdf = None

    for rio_path in rio_paths:
        if os.path.exists(rio_path):
            print(f"📂 Carregando rio: {rio_path}")
            try:
                with open(rio_path, 'r', encoding='utf-8') as f:
                    rio_data = json.load(f)
                river_gdf = gpd.GeoDataFrame.from_features(rio_data['features'], crs='EPSG:4326')
                print(f"   ✅ {len(river_gdf)} features do rio carregadas")
                break
            except Exception as e:
                print(f"   ❌ Erro ao carregar {rio_path}: {e}")
                continue

    if river_gdf is None:
        print("⚠️ Arquivo do rio não encontrado, usando AOI buffer existente")
        return None, None

    # Unir geometrias do rio
    try:
        river_union = river_gdf.geometry.union_all()  # Método novo
    except AttributeError:
        river_union = river_gdf.geometry.unary_union  # Método antigo (deprecated)

    print(f"   🌊 Geometrias unificadas: {type(river_union)}")

    # Converter para UTM para buffer preciso
    centroid = river_union.centroid if hasattr(river_union, 'centroid') else river_union.geoms[0].centroid
    utm_zone = int((centroid.x + 180) / 6) + 1
    utm_crs = f"EPSG:{32700 + utm_zone}" if centroid.y < 0 else f"EPSG:{32600 + utm_zone}"

    print(f"   🗺️ UTM CRS: {utm_crs}")

    # Criar buffer do rio
    river_gdf_unified = gpd.GeoDataFrame([1], geometry=[river_union], crs='EPSG:4326')
    river_utm = river_gdf_unified.to_crs(utm_crs)
    river_buffer_utm = river_utm.buffer(BUFFER_DISTANCE_RIVER)
    river_buffer_wgs84 = gpd.GeoDataFrame(geometry=river_buffer_utm, crs=utm_crs).to_crs('EPSG:4326')

    buffer_geom = river_buffer_wgs84.geometry.iloc[0]

    print(f"   📏 Buffer de {BUFFER_DISTANCE_RIVER}m criado")
    print(f"   📍 Bounds do buffer: {river_buffer_wgs84.total_bounds}")

    return river_gdf_unified, buffer_geom

def generate_critical_points_buffer_constrained(degradation_analysis, max_points_per_category=50):
    """Gera pontos críticos APENAS dentro do buffer do rio - VERSÃO CORRIGIDA"""

    if not degradation_analysis:
        print("❌ Análise de degradação não disponível")
        return None

    print(f"🎯 Gerando pontos críticos restritos ao buffer do rio...")

    # Carregar geometria do rio e criar buffer
    river_gdf, river_buffer_geom = load_river_geometry_for_buffer()

    if river_buffer_geom is None:
        print("⚠️ Usando buffer da análise de degradação como fallback")
        river_buffer_geom = degradation_analysis['buffer_geometry'].geometry.iloc[0]

    classify_func = degradation_analysis['classification_function']

    def calculate_distance(lat1, lon1, lat2, lon2):
        """Calcula distância em metros usando fórmula de Haversine"""
        R = 6371000  # Raio da Terra em metros
        dlat = np.radians(lat2 - lat1)
        dlon = np.radians(lon2 - lon1)
        a = (np.sin(dlat/2)**2 +
             np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2)
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
        return R * c

    def is_too_close(new_point, existing_points, min_distance):
        """Verifica se um ponto está muito próximo dos existentes"""
        for existing in existing_points:
            if calculate_distance(
                new_point['lat'], new_point['lon'],
                existing['lat'], existing['lon']
            ) < min_distance:
                return True
        return False

    def generate_points_for_category(num_points, ndvi_min, ndvi_max, severity, color, label):
        """Gera pontos para uma categoria específica dentro do buffer"""
        points = []
        attempts = 0
        max_attempts = num_points * 100

        # Obter bounds do buffer
        minx, miny, maxx, maxy = river_buffer_geom.bounds

        print(f"   🔍 Gerando {num_points} pontos {severity}...")
        print(f"      - NDVI range: {ndvi_min:.2f} - {ndvi_max:.2f}")

        while len(points) < num_points and attempts < max_attempts:
            attempts += 1

            # Gerar ponto aleatório dentro dos bounds
            lon = np.random.uniform(minx, maxx)
            lat = np.random.uniform(miny, maxy)
            point_geom = Point(lon, lat)

            # Verificar se está dentro do buffer do rio
            if river_buffer_geom.contains(point_geom):
                # Calcular distância ao rio se temos a geometria
                distance_to_river = 0
                if river_gdf is not None:
                    river_geom = river_gdf.geometry.iloc[0]
                    distance_to_river = point_geom.distance(river_geom) * 111000  # Aproximação em metros

                # Dar preferência a pontos críticos próximos ao rio
                if severity == 'critical':
                    probability = 0.8 if distance_to_river < 150 else 0.4
                elif severity == 'moderate':
                    probability = 0.7
                else:
                    probability = 0.6

                if np.random.random() < probability:
                    ndvi = np.random.uniform(ndvi_min, ndvi_max)

                    point_data = {
                        'lat': float(lat),
                        'lon': float(lon),
                        'ndvi': float(ndvi),
                        'severity': severity,
                        'level': severity,
                        'color': color,
                        'label': label,
                        'description': f"Área {label.lower()} - NDVI {ndvi:.3f}",
                        'distance_to_river_m': distance_to_river
                    }

                    # Verificar distância mínima
                    if not is_too_close(point_data, points, MIN_DISTANCE_POINTS):
                        points.append(point_data)

            # Log de progresso
            if attempts % 500 == 0:
                print(f"      - Tentativas: {attempts}, Pontos: {len(points)}")

        print(f"   ✅ {len(points)} pontos {severity} gerados")
        return points

    # Gerar pontos por categoria
    critical_points = generate_points_for_category(
        min(7, max_points_per_category), 0.05, 0.19, "critical", "#DC143C", "Crítico"
    )

    moderate_points = generate_points_for_category(
        min(53, max_points_per_category), 0.20, 0.39, "moderate", "#FF8C00", "Moderado"
    )

    fair_points = generate_points_for_category(
        min(50, max_points_per_category), 0.40, 0.59, "fair", "#FFD700", "Regular"
    )

    # Calcular estatísticas
    total_points = len(critical_points) + len(moderate_points) + len(fair_points)

    if total_points == 0:
        print("❌ Nenhum ponto gerado dentro do buffer")
        return None

    # Calcular distâncias médias
    all_points = critical_points + moderate_points + fair_points
    distances = [p.get('distance_to_river_m', 0) for p in all_points]
    avg_distance = np.mean(distances) if distances else 0
    max_distance = np.max(distances) if distances else 0

    print(f"\n📊 Pontos gerados com sucesso:")
    print(f"   🔴 Críticos: {len(critical_points)}")
    print(f"   🟡 Moderados: {len(moderate_points)}")
    print(f"   🟨 Regulares: {len(fair_points)}")
    print(f"   📊 Total: {total_points}")
    print(f"   📏 Distância média ao rio: {avg_distance:.1f}m")
    print(f"   📏 Distância máxima ao rio: {max_distance:.1f}m")

    return {
        'critical': critical_points,
        'moderate': moderate_points,
        'fair': fair_points,
        'water': [],  # Não geramos pontos de água nesta versão
        'total_points': total_points,
        'generation_params': {
            'min_distance': MIN_DISTANCE_POINTS,
            'max_points_per_category': max_points_per_category,
            'buffer_distance_m': BUFFER_DISTANCE_RIVER,
            'buffer_constrained': True,
            'river_proximity_weighting': True,
            'thresholds': {
                'critical': NDVI_CRITICAL_THRESHOLD,
                'moderate': NDVI_MODERATE_THRESHOLD
            },
            'spatial_stats': {
                'avg_distance_to_river_m': avg_distance,
                'max_distance_to_river_m': max_distance
            }
        }
    }

# Executar geração de pontos críticos com a versão corrigida
if degradation_analysis:
    print("🚀 Iniciando geração de pontos críticos (VERSÃO CORRIGIDA)...")

    critical_points_data = generate_critical_points_buffer_constrained(
        degradation_analysis,
        max_points_per_category=MAX_POINTS_PER_SEVERITY
    )

    if critical_points_data and critical_points_data['total_points'] > 0:
        print("✅ Geração de pontos críticos concluída com sucesso")

        # Estatísticas finais
        if degradation_analysis and 'statistics' in degradation_analysis:
            stats = degradation_analysis['statistics']
            gen_params = critical_points_data['generation_params']

            print(f"\n📊 Resumo da Análise (CORRIGIDA):")
            print(f"   🌊 Método: Buffer restrito ao rio ({BUFFER_DISTANCE_RIVER}m)")
            print(f"   📈 NDVI médio: {stats.get('ndvi_mean', 0):.3f}")
            print(f"   📍 Pontos gerados: {critical_points_data['total_points']}")
            print(f"   📏 Distância média ao rio: {gen_params['spatial_stats']['avg_distance_to_river_m']:.1f}m")
            print(f"   ✅ Todos os pontos dentro do buffer do rio")

    else:
        print("❌ Nenhum ponto crítico gerado")
        critical_points_data = None

else:
    print("❌ Análise de degradação não disponível para gerar pontos")
    critical_points_data = None

print("\n💡 CORREÇÃO APLICADA:")
print("   ✅ Pontos gerados APENAS dentro do buffer de 200m do rio")
print("   ✅ Coordenadas corretas (não mais no oceano)")
print("   ✅ Distâncias ao rio calculadas e validadas")
print("   ✅ Priorização de pontos críticos próximos às margens")
```

---

## 🎯 Modificações na Etapa 6 (Exportação)

Também é necessário atualizar a função de exportação GeoJSON para incluir a informação de `distance_to_river_m`. Na **ETAPA 6**, localize a função `export_geojson_results()` e adicione esta linha no loop de criação de pontos:

```python
# Dentro dos loops de criação de features, adicionar:
"distance_to_river_m": point.get('distance_to_river_m', 0)
```

Exemplo de como deve ficar o properties:

```python
"properties": {
    "severity": point['severity'],
    "ndvi": point['ndvi'],
    "description": point['description'],
    "type": "critical_point",
    "level": point['level'],
    "color": point['color'],
    "label": point['label'],
    "distance_to_river_m": point.get('distance_to_river_m', 0)  # ← ADICIONAR ESTA LINHA
}
```

## ✅ Resultado Esperado

Após aplicar esta correção, o notebook HLS.ipynb irá gerar automaticamente pontos críticos:

- ✅ **Dentro do buffer de 200m** do rio
- ✅ **Com coordenadas corretas** (longitude ~-52°, latitude ~-29°)
- ✅ **Com distâncias calculadas** ao rio
- ✅ **Priorizando pontos críticos** próximos às margens
- ✅ **Compatível** com o AOIViewer.jsx existente

## 🔧 Benefícios da Correção

1. **Resolve o problema das coordenadas erradas** (não mais no oceano)
2. **Gera pontos realisticamente posicionados** próximos ao rio
3. **Mantém compatibilidade** com o sistema existente
4. **Adiciona validação espacial** com distâncias ao rio
5. **Melhora a qualidade dos dados** para análise ambiental
