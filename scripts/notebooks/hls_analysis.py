#!/usr/bin/env python3
"""
HLS Analysis - Análise de Mata Ciliar com Dados HLS (Harmonized Landsat Sentinel)
Este script processa dados HLS da NASA para análise de mata ciliar:
- Busca automática de dados HLS via STAC API
- Processamento NDVI com máscaras de qualidade
- Detecção de pontos críticos de degradação
- Exportação de resultados para integração web
"""

import os
import sys
import json
import warnings
from datetime import datetime, timedelta
from pathlib import Path

# Configurações de warnings
warnings.filterwarnings('ignore')

# Importações principais
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

# Configurações globais
AOI_FILE = "export.geojson"
BUFFER_DISTANCE = 200  # Buffer de mata ciliar em metros
CRS_WGS84 = "EPSG:4326"
START_DATE = "2022-06-01"
END_DATE = "2022-09-30"
CLOUD_COVERAGE_MAX = 50
NDVI_CRITICAL_THRESHOLD = 0.2
NDVI_MODERATE_THRESHOLD = 0.5
MIN_VALID_PIXELS = 0.05
MIN_DISTANCE_POINTS = 100
MAX_POINTS_PER_SEVERITY = 50
BUFFER_DISTANCE_RIVER = 200
SAMPLING_STEP = 3

# Nomes das coleções HLS
HLS_COLLECTIONS = [
    "hls2-l30",  # HLS Landsat 30m v2.0
    "hls2-s30"   # HLS Sentinel-2 30m v2.0
]

def check_hls_coverage(bounds):
    """Verifica se a região tem cobertura HLS teórica"""
    minx, miny, maxx, maxy = bounds

    print("🌍 Verificando cobertura HLS para a região...")

    # Verificar se está dentro dos limites globais razoáveis
    if miny < -60 or maxy > 80:
        print("⚠️ Região pode ter cobertura limitada (latitudes extremas)")
        return False

    # Verificar se a região não é muito pequena
    area_deg = (maxx - minx) * (maxy - miny)
    if area_deg < 0.001:  # Muito pequena
        print("⚠️ Região muito pequena - expandindo ligeiramente...")
        return False

    # Verificar se não é muito grande
    if area_deg > 10:  # Muito grande
        print("⚠️ Região muito grande - pode ser necessário dividir")
        return False

    print("✅ Região dentro dos parâmetros esperados para HLS")
    return True

def load_aoi_data(region_name=None):
    """
    Carrega dados da AOI com múltiplas opções de fonte.
    Se region_name for fornecido, busca rios da região com filtro preciso.
    
    Args:
        region_name: Nome da região para buscar rios (ex: "Sinimbu, Rio Grande do Sul, Brasil")
    
    Returns:
        tuple: (GeoDataFrame da AOI, caminho da fonte)
    """
    
    # Se uma região foi especificada, buscar rios da região
    if region_name:
        print(f"🌍 Buscando AOI para região: {region_name}")
        try:
            aoi_gdf = find_rivers_in_region_with_filter(region_name)
            return aoi_gdf, f"rios_region_{region_name.replace(',', '_').replace(' ', '_')}"
        except Exception as e:
            print(f"⚠️ Erro ao buscar rios da região: {e}")
            print("🔄 Tentando carregar arquivo local...")
    
    # Opção 1: Tentar carregar arquivo local do projeto
    local_paths = [
        "../../public/aoi.geojson",
        "../../export.geojson",
        "../data/export.geojson",
        "export.geojson",
        "../scripts/data/export.geojson"
    ]

    for path in local_paths:
        if os.path.exists(path):
            print(f"📂 Carregando AOI local: {path}")
            with open(path) as f:
                data = json.load(f)
            gdf = gpd.GeoDataFrame.from_features(data["features"], crs=CRS_WGS84)
            return gdf, path

    # Opção 2: AOI de exemplo (Sinimbu/RS)
    print("⚠️ Usando AOI de exemplo - Sinimbu/RS")
    example_coords = [
        [-52.5, -29.4], [-52.4, -29.4],
        [-52.4, -29.5], [-52.5, -29.5], [-52.5, -29.4]
    ]
    example_geom = Polygon(example_coords)
    gdf = gpd.GeoDataFrame([1], geometry=[example_geom], crs=CRS_WGS84)
    return gdf, "exemplo_sinimbu"

def find_rivers_in_region_with_filter(regiao: str, buffer_distance: float = 200) -> gpd.GeoDataFrame:
    """
    Busca todos os rios na região especificada com filtro preciso por limites administrativos.
    Cria uma AOI unificada com buffer para análise de mata ciliar.
    
    Args:
        regiao: Nome da região para buscar rios
        buffer_distance: Distância do buffer em metros
    
    Returns:
        GeoDataFrame: AOI unificada dos rios da região
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
