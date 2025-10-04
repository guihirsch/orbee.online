#!/usr/bin/env python3
"""
Script para gerar AOI e pontos fixos de análise ao longo de um rio.

Este script:
1. Busca um rio específico no OpenStreetMap
2. Gera uma AOI com buffer de 210m por margem
3. Extrai o eixo principal do rio
4. Cria pontos de análise a cada 100m ao longo do eixo
5. Para cada ponto, gera 7 pontos por margem (30m, 60m, 90m, 120m, 150m, 180m, 210m)
6. Exporta os resultados em GeoJSON
"""

import os
import osmnx as ox
import geopandas as gpd
import pandas as pd
from shapely.geometry import LineString, Point
from shapely.ops import linemerge, unary_union
import numpy as np
from typing import List, Tuple, Dict, Any

# Configuração do OSMnx
ox.settings.use_cache = True
ox.settings.log_console = True

def find_rivers_in_region(regiao: str) -> gpd.GeoDataFrame:
    """
    Busca todos os rios na região especificada, filtrando apenas os que estão
    dentro dos limites administrativos do município.
    
    Args:
        regiao: Nome da região para buscar rios
    
    Returns:
        GeoDataFrame: Rios encontrados na região
    """
    print(f"🔍 Buscando rios na região '{regiao}'...")
    
    try:
        # 1. Busca os limites administrativos do município
        print("  📍 Obtendo limites administrativos...")
        boundary = ox.geocode_to_gdf(regiao)
        municipality_bounds = boundary.geometry.iloc[0]
        
        # 2. Busca todos os rios na região (área maior)
        print("  🌊 Buscando rios na região...")
        rivers = ox.features_from_place(regiao, tags={'waterway': 'river'})
        
        if rivers.empty:
            raise ValueError(f"Nenhum rio encontrado na região '{regiao}'")
        
        print(f"  📊 Encontrados {len(rivers)} rios na região")
        
        # 3. Filtra apenas geometrias lineares
        linear_rivers = rivers[rivers.geometry.type.isin(['LineString', 'MultiLineString'])]
        
        if linear_rivers.empty:
            raise ValueError("Nenhum rio com geometria linear encontrado")
        
        print(f"  📏 {len(linear_rivers)} rios com geometrias lineares")
        
        # 4. Filtra rios que intersectam com os limites do município
        print("  🔍 Filtrando rios dentro dos limites do município...")
        rivers_within_municipality = []
        
        for idx, river_row in linear_rivers.iterrows():
            river_geom = river_row.geometry
            
            # Verifica se o rio intersecta com os limites do município
            if river_geom.intersects(municipality_bounds):
                # Verifica se pelo menos 10% do rio está dentro do município
                intersection = river_geom.intersection(municipality_bounds)
                if intersection.length > 0:
                    # Calcula a porcentagem do rio dentro do município
                    river_length = river_geom.length
                    intersection_length = intersection.length
                    percentage = (intersection_length / river_length) * 100
                    
                    if percentage >= 10:  # Pelo menos 10% do rio deve estar no município
                        rivers_within_municipality.append(river_row)
                        print(f"    ✅ {river_row.get('name', 'Sem nome')}: {percentage:.1f}% dentro do município")
                    else:
                        print(f"    ❌ {river_row.get('name', 'Sem nome')}: apenas {percentage:.1f}% dentro do município")
        
        if not rivers_within_municipality:
            raise ValueError("Nenhum rio encontrado dentro dos limites do município")
        
        # Cria GeoDataFrame com os rios filtrados
        filtered_rivers = gpd.GeoDataFrame(rivers_within_municipality, crs=rivers.crs)
        
        print(f"✅ {len(filtered_rivers)} rios dentro dos limites do município")
        
        return filtered_rivers
        
    except Exception as e:
        print(f"❌ Erro ao buscar rios: {e}")
        raise

def create_unified_aoi(rivers_gdf: gpd.GeoDataFrame, buffer_distance: float = 90) -> gpd.GeoDataFrame:
    """
    Cria uma AOI unificada a partir de todos os rios da região.
    
    Args:
        rivers_gdf: GeoDataFrame com todos os rios
        buffer_distance: Distância do buffer em metros
    
    Returns:
        GeoDataFrame: AOI unificada
    """
    print(f"🏞️ Criando AOI unificada com buffer de {buffer_distance}m...")
    
    # Converte para CRS métrico para cálculo do buffer
    rivers_metric = rivers_gdf.to_crs('EPSG:3857')
    
    # Cria buffer para cada rio
    rivers_buffered = rivers_metric.buffer(buffer_distance)
    
    # Une todos os buffers
    unified_buffer = unary_union(rivers_buffered)
    
    # Converte de volta para WGS84
    unified_buffer_wgs84 = gpd.GeoSeries([unified_buffer], crs='EPSG:3857').to_crs('EPSG:4326').iloc[0]
    
    # Cria GeoDataFrame
    aoi_gdf = gpd.GeoDataFrame(
        [{'geometry': unified_buffer_wgs84, 'buffer_m': buffer_distance}],
        crs='EPSG:4326'
    )
    
    print(f"✅ AOI unificada criada com área de {unified_buffer_wgs84.area * 1e10:.2f} km²")
    
    return aoi_gdf

def create_aoi_buffer(centerline: LineString, buffer_distance: float = 210) -> gpd.GeoDataFrame:
    """
    Cria o buffer da AOI ao redor do eixo do rio.
    
    Args:
        centerline: Eixo principal do rio
        buffer_distance: Distância do buffer em metros
    
    Returns:
        GeoDataFrame: Buffer da AOI
    """
    print(f"🏞️ Criando AOI com buffer de {buffer_distance}m...")
    
    # Converte para CRS métrico para cálculo do buffer
    centerline_metric = gpd.GeoSeries([centerline], crs='EPSG:4326').to_crs('EPSG:3857').iloc[0]
    
    # Cria o buffer
    buffer_metric = centerline_metric.buffer(buffer_distance)
    
    # Converte de volta para WGS84
    buffer_wgs84 = gpd.GeoSeries([buffer_metric], crs='EPSG:3857').to_crs('EPSG:4326').iloc[0]
    
    # Cria GeoDataFrame
    aoi_gdf = gpd.GeoDataFrame(
        [{'geometry': buffer_wgs84, 'buffer_m': buffer_distance}],
        crs='EPSG:4326'
    )
    
    print(f"✅ AOI criada com área de {buffer_wgs84.area * 1e10:.2f} km²")
    
    return aoi_gdf

def generate_station_points(centerline: LineString, station_interval: float = 100) -> List[float]:
    """
    Gera pontos de estação ao longo do eixo do rio.
    
    Args:
        centerline: Eixo principal do rio
        station_interval: Intervalo entre estações em metros
    
    Returns:
        List[float]: Lista de distâncias ao longo do eixo
    """
    # Converte para CRS métrico para cálculos
    centerline_metric = gpd.GeoSeries([centerline], crs='EPSG:4326').to_crs('EPSG:3857').iloc[0]
    
    # Calcula comprimento total
    total_length = centerline_metric.length
    
    # Gera pontos de estação
    stations = []
    distance = 0
    while distance <= total_length:
        stations.append(distance)
        distance += station_interval
    
    print(f"📍 Geradas {len(stations)} estações a cada {station_interval}m")
    
    return stations

def calculate_perpendicular_points(centerline: LineString, station_distance: float, 
                                offsets: List[float]) -> List[Dict[str, Any]]:
    """
    Calcula pontos perpendiculares para uma estação específica.
    
    Args:
        centerline: Eixo principal do rio
        station_distance: Distância da estação ao longo do eixo
        offsets: Lista de offsets em metros
    
    Returns:
        List[Dict]: Lista de pontos com atributos
    """
    # Converte para CRS métrico
    centerline_metric = gpd.GeoSeries([centerline], crs='EPSG:4326').to_crs('EPSG:3857').iloc[0]
    
    # Ponto na estação
    station_point = centerline_metric.interpolate(station_distance)
    
    # Calcula direção tangente (usando pontos próximos)
    epsilon = 1.0  # 1 metro
    if station_distance + epsilon <= centerline_metric.length:
        next_point = centerline_metric.interpolate(station_distance + epsilon)
    elif station_distance - epsilon >= 0:
        prev_point = centerline_metric.interpolate(station_distance - epsilon)
        next_point = station_point
        station_point = prev_point
    else:
        # Fallback: usar direção do primeiro segmento
        coords = list(centerline_metric.coords)
        if len(coords) >= 2:
            next_point = Point(coords[1])
        else:
            raise ValueError("Não é possível calcular direção tangente")
    
    # Vetor tangente
    tangent = np.array([next_point.x - station_point.x, next_point.y - station_point.y])
    tangent = tangent / np.linalg.norm(tangent)
    
    # Vetor normal (perpendicular)
    normal = np.array([-tangent[1], tangent[0]])
    
    points = []
    
    # Gera pontos para cada offset
    for offset in offsets:
        for side in ['left', 'right']:
            # Calcula posição do ponto
            offset_vector = normal * offset if side == 'left' else normal * -offset
            point_coords = [station_point.x + offset_vector[0], station_point.y + offset_vector[1]]
            
            # Converte de volta para WGS84
            point_metric = Point(point_coords)
            point_wgs84 = gpd.GeoSeries([point_metric], crs='EPSG:3857').to_crs('EPSG:4326').iloc[0]
            
            points.append({
                'geometry': point_wgs84,
                'station_m': station_distance,
                'side': side,
                'offset_m': offset,
                'x': point_wgs84.x,
                'y': point_wgs84.y
            })
    
    return points

def generate_transect_points(centerline: LineString, stations: List[float], 
                           offsets: List[float]) -> gpd.GeoDataFrame:
    """
    Gera todos os pontos de transecto ao longo do rio.
    
    Args:
        centerline: Eixo principal do rio
        stations: Lista de distâncias das estações
        offsets: Lista de offsets em metros
    
    Returns:
        GeoDataFrame: Pontos de transecto
    """
    print(f"🎯 Gerando pontos de transecto para {len(stations)} estações...")
    
    all_points = []
    
    for station in stations:
        try:
            points = calculate_perpendicular_points(centerline, station, offsets)
            all_points.extend(points)
        except Exception as e:
            print(f"⚠️ Erro na estação {station}m: {e}")
            continue
    
    if not all_points:
        raise ValueError("Nenhum ponto de transecto foi gerado")
    
    # Cria GeoDataFrame
    gdf = gpd.GeoDataFrame(all_points, crs='EPSG:4326')
    
    print(f"✅ Gerados {len(gdf)} pontos de transecto")
    
    return gdf

def generate_critical_points_for_rivers(rivers_gdf: gpd.GeoDataFrame, station_interval: float = 100, 
                                       offsets: List[float] = [30, 60, 90]) -> gpd.GeoDataFrame:
    """
    Gera pontos críticos para todos os rios da região.
    
    Args:
        rivers_gdf: GeoDataFrame com todos os rios
        station_interval: Intervalo entre estações em metros
        offsets: Lista de offsets em metros
    
    Returns:
        GeoDataFrame: Pontos críticos de todos os rios
    """
    print(f"🎯 Gerando pontos críticos para {len(rivers_gdf)} rios...")
    
    all_critical_points = []
    
    for idx, river_row in rivers_gdf.iterrows():
        river_name = river_row.get('name', f'Rio_{idx}')
        river_geometry = river_row.geometry
        
        print(f"  📍 Processando: {river_name}")
        
        try:
            # Converte para CRS métrico para cálculos
            river_metric = gpd.GeoSeries([river_geometry], crs='EPSG:4326').to_crs('EPSG:3857').iloc[0]
            
            # Gera estações ao longo do rio
            total_length = river_metric.length
            stations = []
            distance = 0
            while distance <= total_length:
                stations.append(distance)
                distance += station_interval
            
            print(f"    - {len(stations)} estações ao longo de {total_length:.0f}m")
            
            # Gera pontos para cada estação
            for station in stations:
                try:
                    # Ponto na estação
                    station_point = river_metric.interpolate(station)
                    
                    # Calcula direção tangente
                    epsilon = 1.0  # 1 metro
                    if station + epsilon <= total_length:
                        next_point = river_metric.interpolate(station + epsilon)
                    elif station - epsilon >= 0:
                        prev_point = river_metric.interpolate(station - epsilon)
                        next_point = station_point
                        station_point = prev_point
                    else:
                        # Fallback: usar direção do primeiro segmento
                        coords = list(river_metric.coords)
                        if len(coords) >= 2:
                            next_point = Point(coords[1])
                        else:
                            continue
                    
                    # Vetor tangente
                    tangent = np.array([next_point.x - station_point.x, next_point.y - station_point.y])
                    tangent = tangent / np.linalg.norm(tangent)
                    
                    # Vetor normal (perpendicular)
                    normal = np.array([-tangent[1], tangent[0]])
                    
                    # Gera pontos para cada offset
                    for offset in offsets:
                        for side in ['left', 'right']:
                            # Calcula posição do ponto
                            offset_vector = normal * offset if side == 'left' else normal * -offset
                            point_coords = [station_point.x + offset_vector[0], station_point.y + offset_vector[1]]
                            
                            # Converte de volta para WGS84
                            point_metric = Point(point_coords)
                            point_wgs84 = gpd.GeoSeries([point_metric], crs='EPSG:3857').to_crs('EPSG:4326').iloc[0]
                            
                            all_critical_points.append({
                                'geometry': point_wgs84,
                                'river_name': river_name,
                                'station_m': station,
                                'side': side,
                                'offset_m': offset,
                                'x': point_wgs84.x,
                                'y': point_wgs84.y
                            })
                
                except Exception as e:
                    print(f"    ⚠️ Erro na estação {station}m: {e}")
                    continue
        
        except Exception as e:
            print(f"  ⚠️ Erro processando {river_name}: {e}")
            continue
    
    if not all_critical_points:
        raise ValueError("Nenhum ponto crítico foi gerado")
    
    # Cria GeoDataFrame
    critical_points_gdf = gpd.GeoDataFrame(all_critical_points, crs='EPSG:4326')
    
    print(f"✅ Gerados {len(critical_points_gdf)} pontos críticos")
    
    return critical_points_gdf

def generate_critical_moderate_points(critical_points_gdf: gpd.GeoDataFrame, output_file: str):
    """
    Gera um GeoJSON específico com pontos críticos e moderados baseados em NDVI simulado.
    
    Args:
        critical_points_gdf: GeoDataFrame com todos os pontos críticos
        output_file: Caminho do arquivo de saída
    """
    print("🎯 Gerando pontos críticos e moderados...")
    
    # Simula valores de NDVI para classificação
    # Em um cenário real, estes valores viriam de dados HLS processados
    np.random.seed(42)  # Para reprodutibilidade
    
    # Gera NDVI simulado baseado na posição e características do ponto
    ndvi_values = []
    severity_levels = []
    
    for idx, row in critical_points_gdf.iterrows():
        # Simula NDVI baseado na distância do rio e posição
        offset = row['offset_m']
        station = row['station_m']
        
        # NDVI tende a ser menor próximo ao rio e em pontos mais distantes
        base_ndvi = 0.6 - (offset / 1000) - (station / 10000)
        
        # Adiciona variação aleatória
        variation = np.random.normal(0, 0.15)
        ndvi = max(0, min(1, base_ndvi + variation))
        
        # Classifica severidade baseada no NDVI
        if ndvi < 0.2:
            severity = "critical"
        elif ndvi < 0.5:
            severity = "moderate"
        else:
            severity = "good"
        
        ndvi_values.append(ndvi)
        severity_levels.append(severity)
    
    # Adiciona colunas ao GeoDataFrame
    critical_points_gdf = critical_points_gdf.copy()
    critical_points_gdf['ndvi'] = ndvi_values
    critical_points_gdf['severity'] = severity_levels
    critical_points_gdf['ndvi_category'] = critical_points_gdf['severity'].map({
        'critical': 'Crítico',
        'moderate': 'Moderado', 
        'good': 'Bom'
    })
    
    # Filtra apenas pontos críticos e moderados
    critical_moderate = critical_points_gdf[
        critical_points_gdf['severity'].isin(['critical', 'moderate'])
    ].copy()
    
    # Adiciona metadados
    critical_moderate['analysis_date'] = pd.Timestamp.now().isoformat()
    critical_moderate['total_points'] = len(critical_moderate)
    critical_moderate['critical_count'] = len(critical_moderate[critical_moderate['severity'] == 'critical'])
    critical_moderate['moderate_count'] = len(critical_moderate[critical_moderate['severity'] == 'moderate'])
    
    # Salva arquivo
    critical_moderate.to_file(output_file, driver="GeoJSON")
    
    # Estatísticas
    critical_count = len(critical_moderate[critical_moderate['severity'] == 'critical'])
    moderate_count = len(critical_moderate[critical_moderate['severity'] == 'moderate'])
    total_points = len(critical_moderate)
    
    print(f"✅ Pontos críticos e moderados gerados:")
    print(f"   📊 Total de pontos: {total_points}")
    print(f"   🔴 Críticos: {critical_count}")
    print(f"   🟡 Moderados: {moderate_count}")
    print(f"   📁 Arquivo: {output_file}")
    
    return critical_moderate

def main():
    """Função principal do script."""
    
    # Configurações
    regiao = "Sinimbu, Rio Grande do Sul, Brasil"
    buffer_distance = 90  # metros
    station_interval = 100  # metros
    offsets = [30, 60, 90]  # metros
    
    print("🚀 Iniciando geração de AOI e pontos críticos...")
    print(f"🌍 Região: {regiao}")
    print(f"📏 Buffer: {buffer_distance}m")
    print(f"📍 Intervalo de estações: {station_interval}m")
    print(f"📐 Offsets: {offsets}m")
    
    try:
        # 1. Busca todos os rios da região
        rivers_gdf = find_rivers_in_region(regiao)
        
        # 2. Cria a AOI unificada
        aoi_gdf = create_unified_aoi(rivers_gdf, buffer_distance)
        
        # 3. Gera pontos críticos para todos os rios
        critical_points_gdf = generate_critical_points_for_rivers(rivers_gdf, station_interval, offsets)
        
        # 4. Adiciona metadados
        aoi_gdf['region'] = regiao
        aoi_gdf['created_at'] = pd.Timestamp.now().isoformat()
        aoi_gdf['total_rivers'] = len(rivers_gdf)
        
        critical_points_gdf['region'] = regiao
        critical_points_gdf['created_at'] = pd.Timestamp.now().isoformat()
        
        # 5. Cria diretório de saída
        output_dir = "../../public"
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Diretório de saída: {os.path.abspath(output_dir)}")
        
        # 6. Exporta arquivos
        aoi_file = os.path.join(output_dir, "aoi.geojson")
        rivers_file = os.path.join(output_dir, "rivers.geojson")
        critical_points_file = os.path.join(output_dir, "critical_points.geojson")
        
        aoi_gdf.to_file(aoi_file, driver="GeoJSON")
        rivers_gdf.to_file(rivers_file, driver="GeoJSON")
        critical_points_gdf.to_file(critical_points_file, driver="GeoJSON")
        
        # 7. Gera arquivo específico para pontos críticos e moderados
        critical_moderate_file = os.path.join(output_dir, "critical_moderate_points.geojson")
        generate_critical_moderate_points(critical_points_gdf, critical_moderate_file)
        
        print("\n✅ Arquivos gerados com sucesso!")
        print(f"📁 AOI: {aoi_file}")
        print(f"📁 Rios: {rivers_file}")
        print(f"📁 Pontos Críticos: {critical_points_file}")
        print(f"📁 Pontos Críticos/Moderados: {critical_moderate_file}")
        
        # Estatísticas
        print(f"\n📊 Estatísticas:")
        print(f"  - Total de rios: {len(rivers_gdf)}")
        print(f"  - Área da AOI: {aoi_gdf['geometry'].iloc[0].area * 1e10:.2f} km²")
        print(f"  - Total de pontos críticos: {len(critical_points_gdf)}")
        
        # Estatísticas por rio
        river_stats = critical_points_gdf.groupby('river_name').size().sort_values(ascending=False)
        print(f"\n🌊 Pontos por rio:")
        for river, count in river_stats.items():
            print(f"  - {river}: {count} pontos")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        raise

if __name__ == "__main__":
    main()
