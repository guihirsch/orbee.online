#!/usr/bin/env python3
"""
Script de diagnóstico para verificar coordenadas do NDVI vs Rio
"""

import geopandas as gpd
import json
import numpy as np
from shapely.geometry import Point

def debug_coordinates():
    """Diagnostica problemas de coordenadas entre NDVI e rio"""
    
    print("🔍 DIAGNÓSTICO DE COORDENADAS")
    print("=" * 50)
    
    # 1. Carregar rio
    print("\n📍 1. CARREGANDO RIO:")
    with open('../../public/rio.geojson', 'r') as f:
        rio_data = json.load(f)
    
    rio_gdf = gpd.GeoDataFrame.from_features(rio_data['features'], crs='EPSG:4326')
    rio_bounds = rio_gdf.total_bounds
    print(f"   Rio bounds WGS84: {rio_bounds}")
    rio_center_lon = (rio_bounds[0] + rio_bounds[2])/2
    rio_center_lat = (rio_bounds[1] + rio_bounds[3])/2
    print(f"   Rio center: ({rio_center_lon}, {rio_center_lat})")
    
    # 2. Converter rio para UTM
    centroid = rio_gdf.geometry.centroid.iloc[0]
    utm_zone = int((centroid.x + 180) / 6) + 1
    utm_crs_sul = f"EPSG:{32700 + utm_zone}"
    utm_crs_norte = f"EPSG:{32600 + utm_zone}"
    
    print(f"\n🗺️ 2. CONVERSÃO UTM:")
    print(f"   Zona UTM: {utm_zone}")
    print(f"   UTM Sul: {utm_crs_sul}")
    print(f"   UTM Norte: {utm_crs_norte}")
    
    # Testar ambas as conversões
    rio_utm_sul = rio_gdf.to_crs(utm_crs_sul)
    rio_utm_norte = rio_gdf.to_crs(utm_crs_norte)
    
    print(f"\n   UTM Sul bounds: {rio_utm_sul.total_bounds}")
    print(f"   UTM Norte bounds: {rio_utm_norte.total_bounds}")
    
    # 3. Simular coordenadas NDVI do log
    print(f"\n📊 3. COORDENADAS NDVI DO LOG:")
    ndvi_bounds_log = (348300.0, -3274650.0, 358320.0, -3250440.0)
    print(f"   NDVI bounds: {ndvi_bounds_log}")
    print(f"   NDVI center: ({(ndvi_bounds_log[0] + ndvi_bounds_log[2])/2}, {(ndvi_bounds_log[1] + ndvi_bounds_log[3])/2})")
    
    # 4. Verificar se NDVI está no hemisfério correto
    ndvi_y_center = (ndvi_bounds_log[1] + ndvi_bounds_log[3]) / 2
    print(f"\n🔍 4. ANÁLISE DE HEMISFÉRIO:")
    print(f"   NDVI Y center: {ndvi_y_center}")
    print(f"   Rio Y center (UTM Sul): {(rio_utm_sul.total_bounds[1] + rio_utm_sul.total_bounds[3])/2}")
    print(f"   Rio Y center (UTM Norte): {(rio_utm_norte.total_bounds[1] + rio_utm_norte.total_bounds[3])/2}")
    
    if ndvi_y_center < 0:
        print(f"   ✅ NDVI está no hemisfério SUL (Y negativo)")
        print(f"   ✅ Deveria usar UTM Sul: {utm_crs_sul}")
    else:
        print(f"   ❌ NDVI está no hemisfério NORTE (Y positivo)")
        print(f"   ❌ Mas deveria ser SUL para o Brasil!")
    
    # 5. Testar alguns pontos específicos do log mais recente (UTM Sul correto)
    print(f"\n📍 5. TESTANDO PONTOS ESPECÍFICOS (LOG MAIS RECENTE - UTM SUL):")
    pontos_teste = [
        (354135.0, 6730615.0, "Ponto aceito - WGS84: (-52.505474, -29.545636)"),
        (352335.0, 6732925.0, "Ponto aceito - WGS84: (-52.523733, -29.524583)"),
        (356685.0, 6726565.0, "Ponto aceito - WGS84: (-52.479695, -29.582472)")
    ]
    
    for x, y, status in pontos_teste:
        print(f"   {status}: ({x}, {y})")
        
        # Converter para WGS84 para verificar
        point_utm = Point(x, y)
        point_gdf = gpd.GeoDataFrame([1], geometry=[point_utm], crs=utm_crs_sul)
        point_wgs84 = point_gdf.to_crs('EPSG:4326')
        lon, lat = point_wgs84.geometry.iloc[0].x, point_wgs84.geometry.iloc[0].y
        
        print(f"      -> WGS84: ({lon:.6f}, {lat:.6f})")
        
        # Verificar se está próximo do rio
        rio_center_lon = (rio_bounds[0] + rio_bounds[2]) / 2
        rio_center_lat = (rio_bounds[1] + rio_bounds[3]) / 2
        dist_lon = abs(lon - rio_center_lon)
        dist_lat = abs(lat - rio_center_lat)
        
        print(f"      -> Distância do centro do rio: {dist_lon:.6f}° lon, {dist_lat:.6f}° lat")
        
        if dist_lon < 0.1 and dist_lat < 0.1:
            print(f"      -> ✅ Próximo do rio")
        else:
            print(f"      -> ❌ Muito longe do rio!")

if __name__ == "__main__":
    debug_coordinates()
