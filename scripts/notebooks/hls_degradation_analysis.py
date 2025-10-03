#!/usr/bin/env python3
"""
HLS Degradation Analysis - Análise de Degradação da Mata Ciliar
Funções para análise de degradação e geração de pontos críticos
"""

import os
import json
import numpy as np
import geopandas as gpd
from shapely.geometry import Point
import rasterio
from pyproj import Transformer

# Configurações globais
NDVI_CRITICAL_THRESHOLD = 0.2
NDVI_MODERATE_THRESHOLD = 0.5
MIN_DISTANCE_POINTS = 100
MAX_POINTS_PER_SEVERITY = 50
BUFFER_DISTANCE_RIVER = 200

def classify_vegetation_degradation(ndvi_value):
    """Classifica a cobertura/condição da vegetação baseada no NDVI"""
    
    if np.isnan(ndvi_value):
        return {
            'level': 'no_data',
            'color': '#808080',
            'label': 'Sem Dados',
            'severity': 'unknown'
        }
    elif ndvi_value < 0.0:
        return {
            'level': 'non_vegetated',
            'color': '#0066CC',
            'label': 'Sem vegetação (água/nuvem/neve/rocha)',
            'severity': 'non_vegetated'
        }
    elif ndvi_value < 0.2:
        return {
            'level': 'very_sparse',
            'color': '#DC143C',
            'label': 'Vegetação muito rala / solo exposto',
            'severity': 'very_sparse'
        }
    elif ndvi_value < 0.5:
        return {
            'level': 'sparse',
            'color': '#FF8C00',
            'label': 'Vegetação esparsa / em regeneração',
            'severity': 'sparse'
        }
    elif ndvi_value < 0.8:
        return {
            'level': 'dense',
            'color': '#228B22',
            'label': 'Vegetação densa e saudável',
            'severity': 'dense'
        }
    else:
        return {
            'level': 'extremely_dense',
            'color': '#006400',
            'label': 'Cobertura extremamente densa (rara)',
            'severity': 'extremely_dense'
        }

def analyze_riparian_forest_degradation(ndvi_data, aoi_buffer_gdf):
    """Analisa degradação da mata ciliar dentro do buffer"""
    
    if not ndvi_data or 'ndvi' not in ndvi_data:
        print("❌ Dados NDVI não disponíveis para análise")
        return None

    ndvi_array = ndvi_data['ndvi']
    print(f"📊 Analisando degradação da mata ciliar...")
    print(f"   📐 Dimensões NDVI: {ndvi_array.shape}")

    # Converter buffer para o CRS do NDVI
    buffer_crs = ndvi_array.rio.crs
    if buffer_crs is None:
        print("❌ NDVI array não possui CRS definido! Tentando definir manualmente...")

        # Verificar se temos dados de origem com CRS
        if 'source_items' in ndvi_data and len(ndvi_data['source_items']) > 0:
            # Usar CRS do primeiro item processado
            first_item_data = ndvi_data['source_items'][0]
            if 'ndvi' in first_item_data and first_item_data['ndvi'].rio.crs is not None:
                buffer_crs = first_item_data['ndvi'].rio.crs
                ndvi_array = ndvi_array.rio.write_crs(buffer_crs, inplace=True)
                print(f"✅ CRS herdado dos dados HLS originais: {buffer_crs}")
            else:
                # Fallback: usar UTM baseado na localização do AOI
                centroid = aoi_buffer_gdf.geometry.centroid.iloc[0]
                utm_zone = int((centroid.x + 180) / 6) + 1
                # Forçar hemisfério sul para esta região específica
                if centroid.y < 0:  # Hemisfério sul
                    buffer_crs = f"EPSG:{32700 + utm_zone}"
                    print(f"✅ CRS definido para hemisfério sul: {buffer_crs}")
                else:  # Hemisfério norte
                    buffer_crs = f"EPSG:{32600 + utm_zone}"
                    print(f"✅ CRS definido para hemisfério norte: {buffer_crs}")
                ndvi_array = ndvi_array.rio.write_crs(buffer_crs, inplace=True)
        else:
            # Inferir CRS baseado nos bounds do NDVI
            ndvi_bounds = ndvi_array.rio.bounds()
            ndvi_y_center = (ndvi_bounds[1] + ndvi_bounds[3]) / 2

            # Se Y é negativo, estamos no hemisfério sul
            if ndvi_y_center < 0:
                # Estimar zona UTM baseada no AOI
                centroid = aoi_buffer_gdf.geometry.centroid.iloc[0]
                utm_zone = int((centroid.x + 180) / 6) + 1
                buffer_crs = f"EPSG:{32700 + utm_zone}"  # Hemisfério sul
                print(f"✅ CRS inferido dos bounds NDVI (hemisfério sul): {buffer_crs}")
            else:
                # Hemisfério norte
                centroid = aoi_buffer_gdf.geometry.centroid.iloc[0]
                utm_zone = int((centroid.x + 180) / 6) + 1
                buffer_crs = f"EPSG:{32600 + utm_zone}"  # Hemisfério norte
                print(f"✅ CRS inferido dos bounds NDVI (hemisfério norte): {buffer_crs}")

            ndvi_array = ndvi_array.rio.write_crs(buffer_crs, inplace=True)

    print(f"   🔄 Reprojetando buffer de {aoi_buffer_gdf.crs} para {buffer_crs}...")
    buffer_reproj = aoi_buffer_gdf.to_crs(buffer_crs)

    # Verificar se a reprojeção está no hemisfério correto
    reproj_bounds = buffer_reproj.total_bounds
    reproj_y_center = (reproj_bounds[1] + reproj_bounds[3]) / 2

    # Se esperamos hemisfério sul mas temos coordenadas positivas, há problema
    crs_code = int(str(buffer_crs).split(':')[-1])
    is_south_utm = 32700 <= crs_code <= 32799
    if is_south_utm and reproj_y_center > 0:
        print(f"   ⚠️ Problema detectado: CRS Sul mas coordenadas Norte!")
        print(f"   🔧 Corrigindo reprojeção...")

        # Corrigir coordenadas Y usando offset baseado nos dados NDVI
        ndvi_bounds = ndvi_array.rio.bounds()
        if ndvi_bounds[1] < 0:  # NDVI está no hemisfério sul
            print(f"   🔧 Aplicando correção de hemisfério baseada nos dados NDVI...")

            # Calcular offset necessário para colocar Y no hemisfério correto
            y_offset = -10000000  # Forçar hemisfério sul

            # Função para corrigir coordenadas
            def fix_coordinates(geom):
                def coord_transform(x, y, z=None):
                    return (x, y + y_offset, z) if z is not None else (x, y + y_offset)

                from shapely.ops import transform
                return transform(coord_transform, geom)

            # Aplicar correção
            corrected_geoms = buffer_reproj.geometry.apply(fix_coordinates)
            buffer_reproj = gpd.GeoDataFrame(geometry=corrected_geoms, crs=buffer_crs)
            print(f"   ✅ Coordenadas corrigidas para hemisfério sul")

    print(f"   🗺️ CRS NDVI: {buffer_crs}")
    print(f"   🌊 Buffer reprojetado para análise")
    print(f"   📍 Buffer original bounds: {aoi_buffer_gdf.total_bounds}")
    print(f"   📍 Buffer reprojetado bounds: {buffer_reproj.total_bounds}")

    # Criar máscara do buffer
    try:
        # Diagnóstico de bounds antes do clipping
        print(f"   🔍 Diagnóstico de bounds:")
        ndvi_bounds = ndvi_array.rio.bounds()
        buffer_bounds = buffer_reproj.total_bounds
        print(f"      - NDVI bounds: {ndvi_bounds}")
        print(f"      - Buffer bounds: {buffer_bounds}")

        # Verificar se há intersecção
        ndvi_minx, ndvi_miny, ndvi_maxx, ndvi_maxy = ndvi_bounds
        buf_minx, buf_miny, buf_maxx, buf_maxy = buffer_bounds

        intersects = not (buf_maxx < ndvi_minx or buf_minx > ndvi_maxx or
                         buf_maxy < ndvi_miny or buf_miny > ndvi_maxy)

        print(f"      - Intersecção detectada: {intersects}")

        if not intersects:
            print("❌ Buffer não intersecta com dados NDVI!")
            return None

        # Usar rioxarray para clip
        print(f"   ✂️ Executando clipping...")
        ndvi_clipped = ndvi_array.rio.clip(buffer_reproj.geometry, buffer_reproj.crs)
        print(f"   ✅ NDVI recortado para buffer da mata ciliar")
        print(f"   📐 Dimensões após clipping: {ndvi_clipped.shape}")

        # Estatísticas dentro do buffer
        valid_ndvi = ndvi_clipped.values[~np.isnan(ndvi_clipped.values)]

        print(f"   📊 Pixels após clipping:")
        print(f"      - Total: {ndvi_clipped.size}")
        print(f"      - Válidos: {len(valid_ndvi)}")
        print(f"      - NaN: {ndvi_clipped.size - len(valid_ndvi)}")

        if len(valid_ndvi) == 0:
            print("❌ Nenhum pixel NDVI válido dentro do buffer")
            return None

        # Calcular estatísticas de degradação
        critical_pixels = np.sum(valid_ndvi < NDVI_CRITICAL_THRESHOLD)
        moderate_pixels = np.sum((valid_ndvi >= NDVI_CRITICAL_THRESHOLD) &
                                (valid_ndvi < NDVI_MODERATE_THRESHOLD))
        healthy_pixels = np.sum(valid_ndvi >= NDVI_MODERATE_THRESHOLD)
        total_valid_pixels = len(valid_ndvi)

        # Frações
        critical_fraction = critical_pixels / total_valid_pixels
        moderate_fraction = moderate_pixels / total_valid_pixels
        healthy_fraction = healthy_pixels / total_valid_pixels

        # Classificação geral da mata ciliar
        if critical_fraction > 0.3:
            overall_status = 'severely_degraded'
            status_color = '#DC143C'
        elif critical_fraction > 0.1 or moderate_fraction > 0.4:
            overall_status = 'moderately_degraded'
            status_color = '#FF8C00'
        elif moderate_fraction > 0.2:
            overall_status = 'at_risk'
            status_color = '#FFD700'
        else:
            overall_status = 'healthy'
            status_color = '#228B22'

        # Estatísticas detalhadas
        stats = {
            'total_pixels': int(total_valid_pixels),
            'critical_pixels': int(critical_pixels),
            'moderate_pixels': int(moderate_pixels),
            'healthy_pixels': int(healthy_pixels),
            'critical_fraction': float(critical_fraction),
            'moderate_fraction': float(moderate_fraction),
            'healthy_fraction': float(healthy_fraction),
            'ndvi_min': float(np.min(valid_ndvi)),
            'ndvi_max': float(np.max(valid_ndvi)),
            'ndvi_mean': float(np.mean(valid_ndvi)),
            'ndvi_std': float(np.std(valid_ndvi)),
            'overall_status': overall_status,
            'status_color': status_color
        }

        print(f"📊 Análise de Degradação da Mata Ciliar:")
        print(f"   🔴 Crítico: {critical_pixels:,} pixels ({critical_fraction:.1%})")
        print(f"   🟡 Moderado: {moderate_pixels:,} pixels ({moderate_fraction:.1%})")
        print(f"   🟢 Saudável: {healthy_pixels:,} pixels ({healthy_fraction:.1%})")
        print(f"   📈 NDVI médio: {stats['ndvi_mean']:.3f}")
        print(f"   🏥 Status geral: {overall_status}")

        return {
            'ndvi_clipped': ndvi_clipped,
            'buffer_geometry': buffer_reproj,
            'statistics': stats,
            'classification_function': classify_vegetation_degradation
        }

    except Exception as e:
        print(f"❌ Erro na análise de degradação: {e}")
        return None

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

    # Criar buffer do rio EXCLUINDO a área de água
    river_gdf_unified = gpd.GeoDataFrame([1], geometry=[river_union], crs='EPSG:4326')
    river_utm = river_gdf_unified.to_crs(utm_crs)
    
    # Criar buffer de 200m ao redor do rio
    river_buffer_utm = river_utm.buffer(BUFFER_DISTANCE_RIVER)
    
    # Criar um buffer interno do rio para representar a área de água (expandir o rio)
    # Usar um buffer de 10m para representar a largura do rio
    river_width_buffer = river_utm.buffer(10)  # 10 metros de largura do rio
    
    # EXCLUIR a área expandida do rio do buffer (para não analisar na água)
    river_geom_utm = river_width_buffer.geometry.iloc[0]
    buffer_excluding_water = river_buffer_utm.geometry.iloc[0].difference(river_geom_utm)
    
    # Converter de volta para WGS84
    buffer_excluding_water_gdf = gpd.GeoDataFrame([1], geometry=[buffer_excluding_water], crs=utm_crs)
    buffer_wgs84 = buffer_excluding_water_gdf.to_crs('EPSG:4326')
    buffer_geom = buffer_wgs84.geometry.iloc[0]

    print(f"   📏 Buffer de {BUFFER_DISTANCE_RIVER}m criado EXCLUINDO área de água")
    print(f"   📍 Bounds do buffer: {buffer_wgs84.total_bounds}")
    print(f"   🌊 Área do rio (10m de largura) excluída do buffer para análise")

    return river_gdf_unified, buffer_geom

def generate_points_from_real_ndvi(degradation_analysis, river_buffer_geom, max_points_per_category=50):
    """Gera pontos críticos baseados no NDVI real da análise de degradação"""
    
    if not degradation_analysis or 'ndvi_clipped' not in degradation_analysis:
        print("❌ Dados NDVI não disponíveis para geração de pontos")
        return None
    
    ndvi_clipped = degradation_analysis['ndvi_clipped']
    valid_ndvi = ndvi_clipped.values[~np.isnan(ndvi_clipped.values)]
    
    if len(valid_ndvi) == 0:
        print("❌ Nenhum pixel NDVI válido para gerar pontos")
        return None
    
    print(f"📊 Gerando pontos baseados em {len(valid_ndvi)} pixels NDVI reais")
    
    # Diagnóstico do buffer do rio
    print(f"   🔍 Diagnóstico do buffer do rio:")
    print(f"      - Tipo: {type(river_buffer_geom)}")
    print(f"      - Bounds: {river_buffer_geom.bounds}")
    print(f"      - Área: {river_buffer_geom.area:.2f} graus²")
    
    # Converter buffer do rio para o mesmo CRS do NDVI
    ndvi_crs = ndvi_clipped.rio.crs
    print(f"   🔄 Convertendo buffer do rio para CRS do NDVI: {ndvi_crs}")
    
    # Verificar se o CRS está correto (agora as bandas já vêm com CRS correto)
    print(f"   ✅ NDVI já está no CRS correto: {ndvi_crs}")
    
    # Criar GeoDataFrame temporário para conversão
    river_gdf_temp = gpd.GeoDataFrame([1], geometry=[river_buffer_geom], crs='EPSG:4326')
    river_buffer_utm = river_gdf_temp.to_crs(ndvi_crs)
    river_buffer_geom_utm = river_buffer_utm.geometry.iloc[0]
    
    print(f"   ✅ Buffer convertido para UTM")
    print(f"      - Bounds UTM: {river_buffer_geom_utm.bounds}")
    print(f"      - Área UTM: {river_buffer_geom_utm.area:.2f} m²")
    
    # Verificar se há problema de hemisfério (coordenadas Y negativas vs positivas)
    ndvi_bounds = ndvi_clipped.rio.bounds()
    ndvi_y_center = (ndvi_bounds[1] + ndvi_bounds[3]) / 2
    buffer_y_center = (river_buffer_geom_utm.bounds[1] + river_buffer_geom_utm.bounds[3]) / 2
    
    print(f"   🔍 Diagnóstico de coordenadas:")
    print(f"      - NDVI Y center: {ndvi_y_center}")
    print(f"      - Buffer Y center: {buffer_y_center}")
    
    # Se há incompatibilidade de hemisfério, corrigir
    if (ndvi_y_center < 0 and buffer_y_center > 0) or (ndvi_y_center > 0 and buffer_y_center < 0):
        print(f"   ⚠️ Incompatibilidade de hemisfério detectada!")
        print(f"   🔧 Aplicando correção de hemisfério...")
        
        # Aplicar offset de 10,000,000m para corrigir hemisfério
        y_offset = -10000000 if ndvi_y_center < 0 else 10000000
        
        def fix_hemisphere(geom):
            def coord_transform(x, y, z=None):
                return (x, y + y_offset, z) if z is not None else (x, y + y_offset)
            
            from shapely.ops import transform
            return transform(coord_transform, geom)
        
        river_buffer_geom_utm = fix_hemisphere(river_buffer_geom_utm)
        print(f"   ✅ Hemisfério corrigido")
        print(f"      - Bounds UTM corrigido: {river_buffer_geom_utm.bounds}")
        print(f"      - Área UTM corrigido: {river_buffer_geom_utm.area:.2f} m²")
    
    # Classificar pixels reais por severidade no array 2D
    ndvi_values = ndvi_clipped.values
    valid_mask = ~np.isnan(ndvi_values)
    
    critical_mask_2d = (ndvi_values < NDVI_CRITICAL_THRESHOLD) & valid_mask
    moderate_mask_2d = (ndvi_values >= NDVI_CRITICAL_THRESHOLD) & (ndvi_values < NDVI_MODERATE_THRESHOLD) & valid_mask
    healthy_mask_2d = (ndvi_values >= NDVI_MODERATE_THRESHOLD) & valid_mask
    
    critical_pixels_count = np.sum(critical_mask_2d)
    moderate_pixels_count = np.sum(moderate_mask_2d)
    healthy_pixels_count = np.sum(healthy_mask_2d)
    
    print(f"   🔴 Pixels críticos reais: {critical_pixels_count}")
    print(f"   🟡 Pixels moderados reais: {moderate_pixels_count}")
    print(f"   🟢 Pixels saudáveis reais: {healthy_pixels_count}")
    
    # Função auxiliar para encontrar coordenadas de pixels
    def find_pixel_coordinates(ndvi_array, mask_2d, n_points):
        """Encontra coordenadas de pixels específicos"""
        if np.sum(mask_2d) == 0:
            return []
        
        # Encontrar índices 2D dos pixels que atendem ao critério
        y_indices, x_indices = np.where(mask_2d)
        
        # Amostrar pixels se necessário
        if len(y_indices) > n_points:
            sampled_idx = np.random.choice(len(y_indices), n_points, replace=False)
            y_indices = y_indices[sampled_idx]
            x_indices = x_indices[sampled_idx]
        
        points = []
        transform = ndvi_array.rio.transform()
        
        for y_idx, x_idx in zip(y_indices, x_indices):
            # Converter para coordenadas UTM (rasterio.transform.xy retorna x=easting, y=northing)
            easting, northing = rasterio.transform.xy(transform, y_idx, x_idx)
            
            # Verificar se está dentro do buffer do rio (usar buffer UTM)
            point_geom = Point(easting, northing)
            is_inside = river_buffer_geom_utm.contains(point_geom)
            
            # Debug: mostrar alguns pontos para diagnóstico
            if len(points) < 3:  # Mostrar apenas os primeiros 3 para debug
                print(f"      Debug - Ponto {len(points)+1}: ({easting:.6f}, {northing:.6f}) - Dentro do buffer: {is_inside}")
            
            if is_inside:
                ndvi_value = float(ndvi_array.values[y_idx, x_idx])
                
                # Determinar categoria baseada no valor NDVI
                if ndvi_value < NDVI_CRITICAL_THRESHOLD:
                    severity = 'critical'
                    level = 'very_sparse'
                    color = '#DC143C'
                    label = 'Vegetação muito rala / solo exposto'
                elif ndvi_value < NDVI_MODERATE_THRESHOLD:
                    severity = 'moderate'
                    level = 'sparse'
                    color = '#FF8C00'
                    label = 'Vegetação esparsa / em regeneração'
                else:
                    severity = 'healthy'
                    level = 'dense'
                    color = '#228B22'
                    label = 'Vegetação densa e saudável'
                
                points.append({
                    'lat': northing,  # northing é a coordenada Y UTM
                    'lon': easting,   # easting é a coordenada X UTM
                    'ndvi': ndvi_value,
                    'severity': severity,
                    'level': level,
                    'color': color,
                    'label': label,
                    'description': f"Área real - NDVI {ndvi_value:.3f}",
                    'source': 'real_ndvi_analysis'
                })
        
        return points
    
    # Gerar pontos para cada categoria
    critical_points = find_pixel_coordinates(ndvi_clipped, critical_mask_2d, 
                                        min(max_points_per_category, critical_pixels_count))
    moderate_points = find_pixel_coordinates(ndvi_clipped, moderate_mask_2d, 
                                        min(max_points_per_category, moderate_pixels_count))
    healthy_points = find_pixel_coordinates(ndvi_clipped, healthy_mask_2d, 
                                        min(max_points_per_category, healthy_pixels_count))
    
    total_points = len(critical_points) + len(moderate_points) + len(healthy_points)
    
    print(f"\n📊 Pontos gerados com NDVI real:")
    print(f"   🔴 Críticos: {len(critical_points)}")
    print(f"   🟡 Moderados: {len(moderate_points)}")
    print(f"   🟢 Saudáveis: {len(healthy_points)}")
    print(f"   📊 Total: {total_points}")
    
    return {
        'critical': critical_points,
        'moderate': moderate_points,
        'fair': healthy_points,  # Manter compatibilidade
        'water': [],
        'total_points': total_points,
        'generation_method': 'real_ndvi_based',
        'generation_params': {
            'min_distance': MIN_DISTANCE_POINTS,
            'max_points_per_category': max_points_per_category,
            'buffer_distance_m': BUFFER_DISTANCE_RIVER,
            'buffer_constrained': True,
            'real_ndvi_based': True,
            'thresholds': {
                'critical': NDVI_CRITICAL_THRESHOLD,
                'moderate': NDVI_MODERATE_THRESHOLD
            }
        }
    }
