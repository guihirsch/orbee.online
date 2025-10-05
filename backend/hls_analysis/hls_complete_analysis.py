#!/usr/bin/env python3
"""
HLS Complete Analysis - Análise Completa de Mata Ciliar com Dados HLS
Script principal que integra todas as funcionalidades do notebook HLS.ipynb
"""

import os
import sys
import warnings
import hashlib
from datetime import datetime

# Configurações de warnings
warnings.filterwarnings('ignore')

# Importar módulos locais
try:
    # Tentar imports relativos (quando usado como módulo)
    from .config_hls import get_config
    from .hls_analysis import (
        check_hls_coverage, load_aoi_data, search_hls_data, 
        select_best_item, convert_numpy_types
    )
    from .hls_ndvi_processing import load_and_process_hls_data, create_ndvi_composite
    from .hls_degradation_analysis import (
        analyze_riparian_forest_degradation, load_river_geometry_for_buffer,
        generate_points_from_real_ndvi
    )
    from .hls_export import (
        ensure_output_directory, export_geojson_results, export_geotiff_results,
        create_processing_log, validate_ndvi_consistency
    )
except ImportError:
    # Fallback para imports absolutos (quando executado diretamente)
    from config_hls import get_config
    from hls_analysis import (
        check_hls_coverage, load_aoi_data, search_hls_data, 
        select_best_item, convert_numpy_types
    )
    from hls_ndvi_processing import load_and_process_hls_data, create_ndvi_composite
    from hls_degradation_analysis import (
        analyze_riparian_forest_degradation, load_river_geometry_for_buffer,
        generate_points_from_real_ndvi
    )
    from hls_export import (
        ensure_output_directory, export_geojson_results, export_geotiff_results,
        create_processing_log, validate_ndvi_consistency
    )

# Carregar configurações centralizadas
config = get_config()

# Configurações globais (com fallback para compatibilidade)
REGION_NAME = "Sinimbu, Rio Grande do Sul, Brasil" 
BUFFER_DISTANCE = config['degradation']['buffer_distance']
START_DATE = config['search']['start_date']
END_DATE = config['search']['end_date']
CLOUD_COVERAGE_MAX = config['search']['cloud_coverage_max']
NDVI_CRITICAL_THRESHOLD = config['ndvi']['critical_threshold']
NDVI_MODERATE_THRESHOLD = config['ndvi']['moderate_threshold']
MIN_DISTANCE_POINTS = config['points']['min_distance']
MAX_POINTS_PER_SEVERITY = config['points']['max_per_severity']
BUFFER_DISTANCE_RIVER = config['degradation']['buffer_distance_river']

def generate_unique_point_id(lat, lon, ndvi_value=None, timestamp=None):
    """
    Gera um ID único para cada ponto baseado APENAS nas coordenadas geográficas
    Isso permite referenciar o mesmo local em análises futuras
    
    Args:
        lat: Latitude do ponto (WGS84)
        lon: Longitude do ponto (WGS84)
        ndvi_value: Valor NDVI (não usado no ID, apenas para compatibilidade)
        timestamp: Timestamp (não usado no ID, apenas para compatibilidade)
    
    Returns:
        str: ID único no formato 'hls_point_<hash>' baseado apenas nas coordenadas
    """
    # Criar string única baseada APENAS nas coordenadas
    # Usar precisão de 6 casas decimais para coordenadas (aproximadamente 0.1m de precisão)
    # Isso garante que o mesmo local geográfico sempre tenha o mesmo ID
    unique_string = f"{lat:.6f}_{lon:.6f}"
    
    # Gerar hash SHA-256 e usar primeiros 12 caracteres
    hash_object = hashlib.sha256(unique_string.encode())
    hash_hex = hash_object.hexdigest()[:12]
    
    return f"hls_point_{hash_hex}"

def ensure_unique_ids_for_points(critical_points_data):
    """
    Garante que todos os pontos críticos tenham IDs únicos baseados em coordenadas
    
    Args:
        critical_points_data: Dados dos pontos críticos
    
    Returns:
        dict: Dados dos pontos com IDs únicos garantidos
    """
    if not critical_points_data or 'critical_points' not in critical_points_data:
        return critical_points_data
    
    print("🔧 Garantindo IDs únicos baseados em coordenadas...")
    
    critical_points = critical_points_data['critical_points']
    updated_count = 0
    
    for point in critical_points:
        # Verificar se já tem ID válido baseado em coordenadas
        current_id = point.get('id', '')
        
        if not current_id or not current_id.startswith('hls_point_'):
            # Gerar novo ID baseado nas coordenadas
            lat_wgs84 = point.get('lat_wgs84', point.get('lat', 0))
            lon_wgs84 = point.get('lon_wgs84', point.get('lon', 0))
            
            # Se as coordenadas estão em UTM, converter para WGS84
            if 'lat_wgs84' not in point and 'lon_wgs84' not in point:
                # Assumir que lat/lon estão em UTM e converter
                try:
                    from pyproj import Transformer
                    transformer = Transformer.from_crs("EPSG:32722", "EPSG:4326", always_xy=True)
                    lon_wgs84, lat_wgs84 = transformer.transform(point['lon'], point['lat'])
                except:
                    # Fallback: usar coordenadas como estão
                    lat_wgs84 = point.get('lat', 0)
                    lon_wgs84 = point.get('lon', 0)
            
            # Gerar ID único baseado nas coordenadas WGS84
            point_id = generate_unique_point_id(lat_wgs84, lon_wgs84)
            point['id'] = point_id
            updated_count += 1
            
            print(f"   🔧 ID gerado para ponto: {point_id}")
    
    if updated_count > 0:
        print(f"✅ {updated_count} pontos receberam IDs únicos baseados em coordenadas")
    else:
        print("✅ Todos os pontos já possuem IDs únicos válidos")
    
    return critical_points_data

def configure_region():
    """Configura a região para análise"""
    print("🌍 CONFIGURAÇÃO DA REGIÃO")
    print("=" * 40)
    print(f"📍 Região atual: {REGION_NAME}")
    print("\n💡 Para alterar a região, edite a variável REGION_NAME no início do script")
    print("   Exemplos de regiões válidas:")
    print("   - 'Sinimbu, Rio Grande do Sul, Brasil'")
    print("   - 'Caxias do Sul, Rio Grande do Sul, Brasil'")
    print("   - 'Porto Alegre, RS'")
    print("   - 'São Paulo, SP'")
    print("   - 'Brasília, DF'")
    print("=" * 40)
    return REGION_NAME

def main():
    """Função principal do script"""
    print("🚀 Iniciando HLS Complete Analysis - Análise de Mata Ciliar")
    print("📡 Processamento de dados HLS (Harmonized Landsat Sentinel)")
    print("🌿 Foco: Detecção de degradação em mata ciliar")
    print("=" * 60)
    
    # Configurar região
    region = configure_region()

    # ETAPA 1: Carregamento da AOI
    print("\n📍 ETAPA 1: Carregamento da Área de Interesse")
    print("-" * 50)
    print(f"🌍 Região configurada: {region}")
    
    try:
        # Carregar AOI com filtro preciso por região
        aoi_gdf, source_path = load_aoi_data(region_name=region)
        
        print(f"✅ AOI carregada: {source_path}")
        print(f"📊 Informações da AOI:")
        print(f"   - Geometrias: {len(aoi_gdf)}")
        print(f"   - Tipo: {aoi_gdf.geometry.geom_type.iloc[0]}")
        print(f"   - CRS: {aoi_gdf.crs}")
        print(f"   - Bounds: {aoi_gdf.total_bounds}")
        
        # Verificar se a AOI tem metadados da região
        if 'region' in aoi_gdf.columns:
            print(f"   - Região: {aoi_gdf['region'].iloc[0]}")
        if 'total_rivers' in aoi_gdf.columns:
            print(f"   - Rios encontrados: {aoi_gdf['total_rivers'].iloc[0]}")
        if 'buffer_distance' in aoi_gdf.columns:
            print(f"   - Buffer aplicado: {aoi_gdf['buffer_distance'].iloc[0]}m")

        # Se a AOI já tem buffer aplicado, usar diretamente
        if 'buffer_distance' in aoi_gdf.columns and aoi_gdf['buffer_distance'].iloc[0] == BUFFER_DISTANCE:
            print(f"✅ AOI já possui buffer de {BUFFER_DISTANCE}m aplicado")
            aoi_buffer_gdf = aoi_gdf
        else:
            # Criar buffer adicional se necessário
            print(f"🌊 Aplicando buffer adicional de mata ciliar ({BUFFER_DISTANCE}m)...")
            
            # Converter para UTM para buffer em metros
            centroid = aoi_gdf.geometry.centroid.iloc[0]
            utm_zone = int((centroid.x + 180) / 6) + 1
            utm_crs = f"EPSG:{32700 + utm_zone}" if centroid.y < 0 else f"EPSG:{32600 + utm_zone}"

            print(f"🗺️ Convertendo para UTM: {utm_crs}")
            aoi_utm = aoi_gdf.to_crs(utm_crs)
            aoi_buffer_utm = aoi_utm.buffer(BUFFER_DISTANCE)
            aoi_buffer_gdf = aoi_utm.to_crs("EPSG:4326")

        # Calcular área total
        area_km2 = aoi_buffer_gdf.geometry.area.sum() * 1e-10  # Convertendo de graus² para km²
        print(f"📏 Área total da AOI: {area_km2:.2f} km²")

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

    # ETAPA 3: Processamento NDVI
    print("\n🌿 ETAPA 3: Processamento NDVI")
    print("-" * 50)
    
    processed_hls_data = []
    
    if selected_hls_items:
        print("🚀 Processando itens HLS selecionados...")

        for i, item in enumerate(selected_hls_items):
            print(f"\n📊 Processando item {i+1}/{len(selected_hls_items)}...")

            processed_data = load_and_process_hls_data(item, bounds)

            if processed_data:
                processed_hls_data.append(processed_data)
                print("   ✅ Processamento concluído")
            else:
                print("   ❌ Processamento falhou")

        # Criar composição final
        if processed_hls_data:
            final_ndvi_data = create_ndvi_composite(processed_hls_data)
            print(f"\n✅ Processamento NDVI concluído com {len(processed_hls_data)} itens")
        else:
            print("\n❌ Nenhum item HLS processado com sucesso")
            final_ndvi_data = None
    else:
        print("❌ Nenhum item HLS disponível para processamento")
        final_ndvi_data = None

    # ETAPA 4: Análise de Degradação
    print("\n🌊 ETAPA 4: Análise de Degradação da Mata Ciliar")
    print("-" * 50)
    
    if final_ndvi_data and 'aoi_buffer_gdf' in locals():
        print("🚀 Iniciando análise de degradação da mata ciliar...")

        degradation_analysis = analyze_riparian_forest_degradation(
            final_ndvi_data,
            aoi_buffer_gdf
        )

        if degradation_analysis:
            print("✅ Análise de degradação concluída")
        else:
            print("❌ Análise de degradação falhou")
            degradation_analysis = None
    else:
        print("❌ Dados necessários não disponíveis para análise de degradação")
        degradation_analysis = None

    # ETAPA 5: Geração de Pontos Críticos (apenas críticos)
    print("\n📍 ETAPA 5: Geração de Pontos Críticos (apenas críticos)")
    print("-" * 50)
    
    if degradation_analysis:
        print("🚀 Iniciando geração de pontos críticos...")

        # Carregar geometria do rio
        river_gdf, river_buffer_geom = load_river_geometry_for_buffer()
        
        if river_buffer_geom is None:
            print("⚠️ Usando buffer da análise de degradação como fallback")
            river_buffer_geom = degradation_analysis['buffer_geometry'].geometry.iloc[0]

        critical_points_data = generate_points_from_real_ndvi(
            degradation_analysis,
            river_buffer_geom,
            max_points_per_category=MAX_POINTS_PER_SEVERITY
        )

        # Validar consistência entre análise e pontos críticos
        if critical_points_data:
            validate_ndvi_consistency(degradation_analysis, critical_points_data)
            
            # GARANTIR IDs únicos baseados em coordenadas para todos os pontos
            critical_points_data = ensure_unique_ids_for_points(critical_points_data)

        if critical_points_data and critical_points_data['total_points'] > 0:
            print("✅ Geração de pontos críticos concluída com sucesso")
            print(f"   🔴 Total de pontos críticos: {critical_points_data['total_points']}")
            print("   🆔 IDs únicos baseados em coordenadas garantidos")
        else:
            print("❌ Nenhum ponto crítico gerado")
            critical_points_data = None
    else:
        print("❌ Análise de degradação não disponível para gerar pontos")
        critical_points_data = None

    # ETAPA 6: Exportação de Resultados
    print("\n💾 ETAPA 6: Exportação de Resultados")
    print("-" * 50)
    
    if critical_points_data and degradation_analysis:
        print("🚀 Iniciando exportação de resultados...")

        # Garantir diretório de saída
        if ensure_output_directory("."):
            # Caminhos de saída (usando configurações centralizadas)
            geojson_path = config['export']['geojson_filename']
            geotiff_path = config['export']['geotiff_filename']
            log_path = config['export']['log_filename']

            print(f"📍 Caminhos de saída:")
            print(f"   📄 GeoJSON: {geojson_path}")
            print(f"   🗺️ GeoTIFF: {geotiff_path}")
            print(f"   📝 Log: {log_path}")

            # Exportar GeoJSON
            geojson_success = export_geojson_results(
                critical_points_data,
                degradation_analysis,
                geojson_path
            )

            # Exportar GeoTIFF
            geotiff_success = export_geotiff_results(
                final_ndvi_data,
                degradation_analysis,
                geotiff_path
            )

            # Criar log
            log_success = create_processing_log(
                critical_points_data,
                degradation_analysis,
                final_ndvi_data,
                log_path
            )

            # Resumo final
            print(f"\n🎉 PROCESSAMENTO HLS CONCLUÍDO!")
            print("=" * 60)
            print(f"✅ GeoJSON: {'Sucesso' if geojson_success else 'Falhou'}")
            print(f"✅ GeoTIFF: {'Sucesso' if geotiff_success else 'Falhou'}")
            print(f"✅ Log: {'Sucesso' if log_success else 'Falhou'}")

            # Verificar se arquivos foram realmente criados
            print(f"\n🔍 VERIFICAÇÃO DE ARQUIVOS:")
            files_created = []

            if os.path.exists(geojson_path):
                size_mb = os.path.getsize(geojson_path) / (1024*1024)
                print(f"   ✅ {geojson_path} ({size_mb:.2f} MB)")
                files_created.append(geojson_path)
            else:
                print(f"   ❌ {geojson_path} NÃO ENCONTRADO")

            if os.path.exists(geotiff_path):
                size_mb = os.path.getsize(geotiff_path) / (1024*1024)
                print(f"   ✅ {geotiff_path} ({size_mb:.2f} MB)")
                files_created.append(geotiff_path)
            else:
                print(f"   ❌ {geotiff_path} NÃO ENCONTRADO")

            if os.path.exists(log_path):
                size_kb = os.path.getsize(log_path) / 1024
                print(f"   ✅ {log_path} ({size_kb:.1f} KB)")
                files_created.append(log_path)
            else:
                print(f"   ❌ {log_path} NÃO ENCONTRADO")

            if files_created:
                print(f"\n📁 Arquivos criados na pasta atual:")
                for file_path in files_created:
                    print(f"   📄 {file_path}")

                print(f"\n🌐 Próximos passos:")
                print(f"   1. Copiar arquivos para a pasta public/ do seu projeto")
                print(f"   2. Testar visualização no AOIViewer.jsx")
                print(f"   3. Validar pontos críticos no mapa web")
            else:
                print(f"\n❌ NENHUM ARQUIVO FOI CRIADO!")
                print(f"   Verifique os erros nas etapas anteriores")

        else:
            print("❌ Falha ao criar diretório de saída")

    else:
        print("❌ Dados insuficientes para exportação")
        print("   Verifique se todas as etapas anteriores foram executadas com sucesso")

    print("\n🎯 Script HLS Complete Analysis finalizado!")
    print("📋 INSTRUÇÕES DE USO:")
    print("=" * 50)
    print("1. Execute: python hls_complete_analysis.py")
    print("2. Para alterar a região, edite a variável REGION_NAME no início do script")
    print("3. Os resultados serão salvos na pasta atual")
    print("\n🌍 REGIÕES SUPORTADAS:")
    print("- Qualquer município brasileiro (ex: 'São Paulo, SP')")
    print("- Regiões com rios mapeados no OpenStreetMap")
    print("- O script filtra automaticamente apenas rios dentro dos limites administrativos")
    print("\n📊 RESULTADOS GERADOS:")
    print("- critical_points_mata_ciliar.geojson: Pontos críticos de degradação (apenas críticos)")
    print("  🆔 Cada ponto possui ID único baseado em coordenadas geográficas")
    print("  📍 Permite referência temporal do mesmo local em análises futuras")
    print("- ndvi_mata_ciliar_wgs84_normalized.geotiff: Mapa NDVI processado")
    print("- processamento_notebook.log: Log detalhado do processamento")
    print("\n🔧 CONFIGURAÇÕES AVANÇADAS:")
    print("- BUFFER_DISTANCE: Distância do buffer de mata ciliar (metros)")
    print("- START_DATE/END_DATE: Período para busca de dados HLS")
    print("- CLOUD_COVERAGE_MAX: Máxima cobertura de nuvens aceita (%)")
    print("- NDVI_CRITICAL_THRESHOLD: Limiar crítico de NDVI")
    print("- NDVI_MODERATE_THRESHOLD: Limiar moderado de NDVI")
    print("\n🆔 SISTEMA DE IDs ÚNICOS:")
    print("- IDs baseados APENAS em coordenadas geográficas (WGS84)")
    print("- Precisão de 6 casas decimais (~0.1m de precisão)")
    print("- Mesmo local geográfico sempre terá o mesmo ID")
    print("- Ideal para acompanhamento temporal e comparação de NDVI")

if __name__ == "__main__":
    main()
