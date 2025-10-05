#!/usr/bin/env python3
"""
Módulo para corrigir distâncias do rio nos pontos críticos
"""

import json
import os
import geopandas as gpd
from shapely.geometry import Point
import osmnx as ox
from pyproj import Transformer
import numpy as np

def fix_river_distances_in_geojson(geojson_path, region="Sinimbu, Rio Grande do Sul, Brasil"):
    """
    Corrige as distâncias do rio em um arquivo GeoJSON existente
    
    Args:
        geojson_path: Caminho para o arquivo GeoJSON
        region: Região para buscar rios
    
    Returns:
        bool: True se bem-sucedido, False caso contrário
    """
    
    print("🔧 Corrigindo distâncias do rio no GeoJSON...")
    
    if not os.path.exists(geojson_path):
        print(f"❌ Arquivo {geojson_path} não encontrado")
        return False
    
    print(f"📂 Carregando {geojson_path}...")
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Erro ao carregar GeoJSON: {e}")
        return False
    
    print(f"📊 Encontrados {len(data['features'])} pontos críticos")
    
    # Buscar rios na região
    print(f"🌊 Buscando rios na região: {region}")
    
    try:
        # Buscar rios
        rivers = ox.features_from_place(region, tags={'waterway': 'river'})
        
        if rivers.empty:
            print("❌ Nenhum rio encontrado na região")
            return False
        
        # Filtrar apenas geometrias lineares
        linear_rivers = rivers[rivers.geometry.type.isin(['LineString', 'MultiLineString'])]
        
        if linear_rivers.empty:
            print("❌ Nenhum rio com geometria linear encontrado")
            return False
        
        print(f"✅ Encontrados {len(linear_rivers)} rios lineares")
        
        # Converter para UTM para cálculo de distância
        centroid = rivers.geometry.centroid.iloc[0]
        utm_zone = int((centroid.x + 180) / 6) + 1
        utm_crs = f"EPSG:{32700 + utm_zone}" if centroid.y < 0 else f"EPSG:{32600 + utm_zone}"
        
        print(f"🗺️ Convertendo rios para UTM: {utm_crs}")
        
        # Converter rios para UTM
        rivers_utm = linear_rivers.to_crs(utm_crs)
        try:
            rivers_union = rivers_utm.geometry.unary_union
        except Exception:
            rivers_union = rivers_utm.geometry.union_all()
        
        # Calcular distâncias para cada ponto
        print("📏 Calculando distâncias do rio...")
        
        updated_features = []
        
        for i, feature in enumerate(data['features']):
            point_coords = feature['geometry']['coordinates']
            lon, lat = point_coords[0], point_coords[1]
            
            # Converter ponto para UTM
            transformer = Transformer.from_crs("EPSG:4326", utm_crs, always_xy=True)
            point_utm_x, point_utm_y = transformer.transform(lon, lat)
            point_utm = Point(point_utm_x, point_utm_y)
            
            # Calcular distância mínima até o conjunto de rios (métrico em metros)
            try:
                min_distance = point_utm.distance(rivers_union)
            except Exception:
                # Fallback: iterar se união falhar
                min_distance = float('inf')
                for _, river_row in rivers_utm.iterrows():
                    distance = point_utm.distance(river_row.geometry)
                    if distance < min_distance:
                        min_distance = distance
            
            # Atualizar propriedades
            updated_properties = feature['properties'].copy()
            # Sanitizar distância
            if min_distance is None or not np.isfinite(min_distance):
                updated_properties['distance_to_river_m'] = None
            else:
                updated_properties['distance_to_river_m'] = round(float(min_distance), 1)
            
            updated_feature = {
                "type": "Feature",
                "geometry": feature['geometry'],
                "properties": updated_properties
            }
            
            updated_features.append(updated_feature)
            
            # Debug: mostrar algumas distâncias
            if i < 3:
                safe_dist = updated_properties['distance_to_river_m']
                print(f"   Ponto {i+1}: ({lat:.6f}, {lon:.6f}) -> {safe_dist}m do rio")
        
        # Atualizar dados
        data['features'] = updated_features
        
        # Salvar arquivo atualizado
        with open(geojson_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Arquivo {geojson_path} atualizado com distâncias corretas")
        
        # Mostrar estatísticas das distâncias
        distances = [d for d in (f['properties'].get('distance_to_river_m') for f in updated_features) if isinstance(d, (int, float)) and np.isfinite(d)]
        if distances:
            print(f"\n📊 Estatísticas das distâncias:")
            print(f"   - Mínima: {min(distances):.1f}m")
            print(f"   - Máxima: {max(distances):.1f}m")
            print(f"   - Média: {sum(distances)/len(distances):.1f}m")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao calcular distâncias: {e}")
        return False

def ensure_river_distances_correct(geojson_path, region="Sinimbu, Rio Grande do Sul, Brasil"):
    """
    Verifica se as distâncias do rio estão corretas e as corrige se necessário
    
    Args:
        geojson_path: Caminho para o arquivo GeoJSON
        region: Região para buscar rios
    
    Returns:
        bool: True se as distâncias estão corretas ou foram corrigidas
    """
    
    if not os.path.exists(geojson_path):
        print(f"⚠️ Arquivo {geojson_path} não encontrado")
        return False
    
    # Verificar se as distâncias estão faltando/ruins (None/NaN/inf/<=0)
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        needs_fix = False
        for feature in data['features']:
            distance = feature['properties'].get('distance_to_river_m', None)
            if not isinstance(distance, (int, float)) or not np.isfinite(distance) or distance <= 0:
                needs_fix = True
                break
        
        if needs_fix:
            print("⚠️ Distâncias ausentes/inf/NaN/<=0 detectadas, recalculando...")
            return fix_river_distances_in_geojson(geojson_path, region)
        else:
            print("✅ Distâncias do rio já estão corretas")
            return True
            
    except Exception as e:
        print(f"❌ Erro ao verificar distâncias: {e}")
        return False
