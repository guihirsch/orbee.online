#!/usr/bin/env python3
"""
HLS Analysis - Riparian Forest Analysis with HLS Data (Harmonized Landsat Sentinel)
This script processes NASA HLS data for riparian forest analysis:
- Automatic HLS data search via STAC API
- NDVI processing with quality masks
- Critical degradation points detection
- Results export for web integration
"""

import os
import sys
import json
import warnings
from datetime import datetime, timedelta
from pathlib import Path

# Warning configurations
warnings.filterwarnings('ignore')

# Import centralized configurations
try:
    from .config_hls import get_config
except ImportError:
    from config_hls import get_config

# Main imports
import pystac_client
import planetary_computer as pc
import rasterio
from rasterio.mask import mask
from rasterio.features import rasterize
from rasterio.transform import from_bounds
import rioxarray as rxr
import geopandas as gpd
from shapely.geometry import shape, Point, box, Polygon
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
import stackstac
import xarray as xr
from pyproj import Transformer

# Load centralized configurations
config = get_config()

# Global configurations (using centralized configurations)
AOI_FILE = "export.geojson"
BUFFER_DISTANCE = config['degradation']['buffer_distance']
CRS_WGS84 = "EPSG:4326"
START_DATE = config['search']['start_date']
END_DATE = config['search']['end_date']
CLOUD_COVERAGE_MAX = config['search']['cloud_coverage_max']
NDVI_CRITICAL_THRESHOLD = config['ndvi']['critical_threshold']
NDVI_MODERATE_THRESHOLD = config['ndvi']['moderate_threshold']
MIN_VALID_PIXELS = config['ndvi']['min_valid_pixels']
MIN_DISTANCE_POINTS = config['points']['min_distance']
MAX_POINTS_PER_SEVERITY = config['points']['max_per_severity']
BUFFER_DISTANCE_RIVER = config['degradation']['buffer_distance_river']
SAMPLING_STEP = config['points']['sampling_step']

# HLS collection names
HLS_COLLECTIONS = [
    "hls2-l30",  # HLS Landsat 30m v2.0
    "hls2-s30"   # HLS Sentinel-2 30m v2.0
]

def check_hls_coverage(bounds):
    """Checks if the region has theoretical HLS coverage"""
    minx, miny, maxx, maxy = bounds

    print("🌍 Checking HLS coverage for the region...")

    # Check if within reasonable global limits
    if miny < -60 or maxy > 80:
        print("⚠️ Region may have limited coverage (extreme latitudes)")
        return False

    # Check if region is not too small
    area_deg = (maxx - minx) * (maxy - miny)
    if area_deg < 0.001:  # Too small
        print("⚠️ Region too small - expanding slightly...")
        return False

    # Check if not too large
    if area_deg > 10:  # Too large
        print("⚠️ Region too large - may need to be divided")
        return False

    print("✅ Region within expected parameters for HLS")
    return True

def load_aoi_data(region_name=None):
    """
    Loads AOI data ONLY from real sources.
    If region_name is provided, searches for rivers in the region with precise filtering.
    If unable to load real data, raises error.
    
    Args:
        region_name: Region name to search for rivers (e.g., "Sinimbu, Rio Grande do Sul, Brasil")
    
    Returns:
        tuple: (AOI GeoDataFrame, source path)
        
    Raises:
        ValueError: If unable to load real AOI data
    """
    
    # If a region was specified, search for rivers in the region
    if region_name:
        print(f"🌍 Searching AOI for region: {region_name}")
        try:
            aoi_gdf = find_rivers_in_region_with_filter(region_name)
            return aoi_gdf, f"rios_region_{region_name.replace(',', '_').replace(' ', '_')}"
        except Exception as e:
            print(f"⚠️ Error searching for rivers in region: {e}")
            print("🔄 Trying to load local file...")
    
    # Option 1: Try to load local project file
    local_paths = [
        "../../public/aoi.geojson",
        "../../export.geojson",
        "../data/export.geojson",
        "export.geojson",
        "../scripts/data/export.geojson"
    ]

    for path in local_paths:
        if os.path.exists(path):
            print(f"📂 Loading local AOI: {path}")
            with open(path) as f:
                data = json.load(f)
            gdf = gpd.GeoDataFrame.from_features(data["features"], crs=CRS_WGS84)
            return gdf, path

    # If we got here, it was not possible to load real data
    print("❌ ERROR: Unable to load real AOI data")
    print("   Check if:")
    print("   1. The specified region is valid")
    print("   2. There is internet connection (for OpenStreetMap)")
    print("   3. Local GeoJSON files exist in the project folder")
    print("   4. The region has rivers mapped in OpenStreetMap")
    raise ValueError("Unable to load real AOI data. Check region and connection.")

def find_rivers_in_region_with_filter(regiao: str, buffer_distance: float = 200) -> gpd.GeoDataFrame:
    """
    Searches for all rivers in the specified region with precise filtering by administrative boundaries.
    Creates a unified AOI with buffer for riparian forest analysis.
    
    Args:
        regiao: Region name to search for rivers
        buffer_distance: Buffer distance in meters
    
    Returns:
        GeoDataFrame: Unified AOI of rivers in the region
    """
    import osmnx as ox
    
    print(f"🔍 Buscando rios na região '{regiao}'...")
    
    try:
        # 1. Busca os limites administrativos do município
        print("  📍 Obtendo limites administrativos...")
        boundary = ox.geocode_to_gdf(regiao)
        municipality_bounds = boundary.geometry.iloc[0]
        
        # 2. Busca todos os rios na região
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
        
        # 5. Cria AOI unificada com buffer
        print(f"  🏞️ Criando AOI unificada com buffer de {buffer_distance}m...")
        
        # Converte para CRS métrico para buffer
        rivers_gdf = gpd.GeoDataFrame(rivers_within_municipality, crs=rivers.crs)
        
        # Converte para UTM para cálculos em metros
        centroid = rivers_gdf.geometry.centroid.iloc[0]
        utm_zone = int((centroid.x + 180) / 6) + 1
        utm_crs = f"EPSG:{32700 + utm_zone}" if centroid.y < 0 else f"EPSG:{32600 + utm_zone}"
        
        rivers_utm = rivers_gdf.to_crs(utm_crs)
        
        # Cria buffer para cada rio
        rivers_buffered = rivers_utm.buffer(buffer_distance)
        
        # Unifica todos os buffers
        unified_buffer = rivers_buffered.unary_union
        
        # Cria GeoDataFrame da AOI unificada
        aoi_gdf = gpd.GeoDataFrame(
            [1], 
            geometry=[unified_buffer], 
            crs=utm_crs
        ).to_crs(CRS_WGS84)
        
        # Adiciona metadados
        aoi_gdf['region'] = regiao
        aoi_gdf['created_at'] = pd.Timestamp.now().isoformat()
        aoi_gdf['total_rivers'] = len(rivers_within_municipality)
        aoi_gdf['buffer_distance'] = buffer_distance
        
        # Calcula área
        area_km2 = unified_buffer.area / 1_000_000
        print(f"  📏 Área da AOI: {area_km2:.2f} km²")
        
        print(f"✅ {len(rivers_within_municipality)} rios dentro dos limites do município")
        print(f"✅ AOI unificada criada com área de {area_km2:.2f} km²")
        
        return aoi_gdf
        
    except Exception as e:
        print(f"❌ Erro ao buscar rios: {e}")
        raise

def search_hls_data(bounds, start_date, end_date, max_cloud=50):
    """Busca dados HLS via Microsoft Planetary Computer STAC API"""
    
    print(f"🔍 Buscando dados HLS...")
    print(f"   📅 Período: {start_date} a {end_date}")
    print(f"   ☁️ Máx. nuvens: {max_cloud}%")
    print(f"   📍 Bounds: {bounds}")

    try:
        # Conectar ao catálogo STAC do Microsoft Planetary Computer
        print("🌐 Conectando ao Microsoft Planetary Computer...")
        catalog = pystac_client.Client.open(
            "https://planetarycomputer.microsoft.com/api/stac/v1",
            modifier=pc.sign_inplace
        )
        print("✅ Conexão estabelecida com Microsoft Planetary Computer")

        # Verificar coleções HLS disponíveis
        print("📋 Verificando coleções HLS no Microsoft Planetary Computer...")
        available_collections = []

        for collection_id in HLS_COLLECTIONS:
            try:
                collection = catalog.get_collection(collection_id)
                available_collections.append(collection_id)
                print(f"   ✅ {collection_id}: Disponível")
            except Exception as e:
                print(f"   ❌ {collection_id}: Não disponível ({e})")

        if not available_collections:
            print("❌ Nenhuma coleção HLS disponível!")
            return None

        # Buscar itens HLS
        all_items = []

        for collection in available_collections:
            print(f"\n🛰️ Buscando coleção: {collection}")

            try:
                # Busca inicial sem filtro de nuvens
                print("   🔍 Busca inicial (sem filtro de nuvens)...")
                search_initial = catalog.search(
                    collections=[collection],
                    bbox=bounds,
                    datetime=f"{start_date}/{end_date}"
                )

                initial_items = list(search_initial.items())
                print(f"   📊 Total de itens no período: {len(initial_items)}")

                if len(initial_items) == 0:
                    print("   ⚠️ Nenhum item encontrado no período especificado")
                    continue

                # Aplicar filtro de nuvens
                print(f"   ☁️ Aplicando filtro de nuvens (< {max_cloud}%)...")
                filtered_items = []

                for item in initial_items:
                    cloud_cover = item.properties.get("eo:cloud_cover", 100)
                    if cloud_cover < max_cloud:
                        filtered_items.append(item)

                print(f"   ✅ Itens após filtro: {len(filtered_items)}")
                all_items.extend(filtered_items)

            except Exception as e:
                print(f"   ❌ Erro na busca {collection}: {e}")
                continue

        if not all_items:
            print("\n❌ DIAGNÓSTICO: Nenhum item HLS encontrado!")
            return None

        # Ordenar por cobertura de nuvens
        all_items.sort(key=lambda x: x.properties.get("eo:cloud_cover", 100))

        print(f"\n📊 RESULTADO FINAL:")
        print(f"   ✅ Total de itens encontrados: {len(all_items)}")

        return all_items

    except Exception as e:
        print(f"❌ Erro crítico na busca HLS: {e}")
        return None

def select_best_item(items, max_items=3):
    """Seleciona os melhores itens HLS baseado em critérios de qualidade"""
    
    if not items:
        return None

    print(f"\n🎯 Selecionando melhores itens (máx: {max_items})...")

    # Filtrar e ordenar
    filtered_items = []

    for item in items:
        cloud_cover = item.properties.get("eo:cloud_cover", 100)
        date = item.properties.get("datetime", "")

        # Critérios de seleção
        if cloud_cover <= CLOUD_COVERAGE_MAX:
            filtered_items.append({
                'item': item,
                'cloud_cover': cloud_cover,
                'date': date,
                'score': 100 - cloud_cover
            })

    # Ordenar por score
    filtered_items.sort(key=lambda x: x['score'], reverse=True)

    # Selecionar os melhores
    selected_items = filtered_items[:max_items]

    print("✅ Itens selecionados:")
    for i, sel in enumerate(selected_items):
        item = sel['item']
        print(f"   {i+1}. {item.collection_id} | {sel['date'][:10]} | ☁️ {sel['cloud_cover']}%")

    return [sel['item'] for sel in selected_items]

def convert_numpy_types(obj):
    """Converte tipos NumPy para tipos Python nativos recursivamente"""
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj

def main():
    """Função principal do script"""
    print("🚀 Iniciando HLS Analysis - Análise de Mata Ciliar")
    print("📡 Processamento de dados HLS (Harmonized Landsat Sentinel)")
    print("🌿 Foco: Detecção de degradação em mata ciliar")
    print("=" * 60)

    # ETAPA 1: Carregamento da AOI
    print("\n📍 ETAPA 1: Carregamento da Área de Interesse")
    print("-" * 50)
    
    try:
        aoi_gdf, source_path = load_aoi_data()
        
        print(f"✅ AOI carregada: {source_path}")
        print(f"📊 Informações da AOI:")
        print(f"   - Geometrias: {len(aoi_gdf)}")
        print(f"   - Tipo: {aoi_gdf.geometry.geom_type.iloc[0]}")
        print(f"   - CRS: {aoi_gdf.crs}")
        print(f"   - Bounds: {aoi_gdf.total_bounds}")

        # Criar buffer para mata ciliar
        print(f"🌊 Criando buffer de mata ciliar ({BUFFER_DISTANCE}m)...")
        
        # Converter para UTM para buffer em metros
        centroid = aoi_gdf.geometry.centroid.iloc[0]
        utm_zone = int((centroid.x + 180) / 6) + 1
        utm_crs = f"EPSG:{32700 + utm_zone}" if centroid.y < 0 else f"EPSG:{32600 + utm_zone}"

        print(f"🗺️ Convertendo para UTM: {utm_crs}")
        aoi_utm = aoi_gdf.to_crs(utm_crs)
        aoi_buffer_utm = aoi_utm.buffer(BUFFER_DISTANCE)
        aoi_buffer_gdf = gpd.GeoDataFrame(geometry=aoi_buffer_utm, crs=utm_crs).to_crs(CRS_WGS84)

        # Calcular área total
        area_km2 = aoi_buffer_utm.area.sum() / 1_000_000
        print(f"📏 Área total com buffer: {area_km2:.2f} km²")

        # Definir bounds para busca HLS
        bounds = aoi_buffer_gdf.total_bounds
        print(f"🎯 Bounds para busca HLS: {bounds}")

        # Verificar cobertura HLS
        hls_coverage_ok = check_hls_coverage(bounds)
        if not hls_coverage_ok:
            print("⚠️ Região pode ter cobertura HLS limitada")

    except Exception as e:
        print(f"❌ Erro ao carregar AOI: {e}")
        return

    # ETAPA 2: Busca de dados HLS
    print("\n📡 ETAPA 2: Busca de Dados HLS")
    print("-" * 50)
    
    try:
        print("🚀 Iniciando busca HLS...")
        hls_items = search_hls_data(bounds, START_DATE, END_DATE, CLOUD_COVERAGE_MAX)

        if hls_items and len(hls_items) > 0:
            selected_hls_items = select_best_item(hls_items, max_items=3)
            print(f"\n✅ {len(selected_hls_items)} itens HLS selecionados para processamento")
        else:
            print("\n❌ FALHA TOTAL: Nenhum item HLS encontrado")
            selected_hls_items = None

    except Exception as e:
        print(f"❌ Erro crítico na busca HLS: {e}")
        selected_hls_items = None

    print("\n🎯 Script HLS Analysis criado com sucesso!")
    print("📋 Para usar:")
    print("1. Execute: python hls_analysis.py")
    print("2. Configure os parâmetros conforme necessário")
    print("3. Os resultados serão salvos na pasta atual")

if __name__ == "__main__":
    main()
