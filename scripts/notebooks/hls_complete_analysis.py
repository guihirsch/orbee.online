#!/usr/bin/env python3
"""
HLS Complete Analysis - Análise Completa de Mata Ciliar com Dados HLS
Script principal que integra todas as funcionalidades do notebook HLS.ipynb
"""

import os
import sys
import warnings
from datetime import datetime

# Configurações de warnings
warnings.filterwarnings('ignore')

# Importar módulos locais
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

# Configurações globais
BUFFER_DISTANCE = 200
START_DATE = "2022-06-01"
END_DATE = "2022-09-30"
CLOUD_COVERAGE_MAX = 50
NDVI_CRITICAL_THRESHOLD = 0.2
NDVI_MODERATE_THRESHOLD = 0.5
MIN_DISTANCE_POINTS = 100
MAX_POINTS_PER_SEVERITY = 50
BUFFER_DISTANCE_RIVER = 200

def main():
    """Função principal do script"""
    print("🚀 Iniciando HLS Complete Analysis - Análise de Mata Ciliar")
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
        aoi_buffer_gdf = aoi_utm.to_crs("EPSG:4326")

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

    # ETAPA 5: Geração de Pontos Críticos
    print("\n📍 ETAPA 5: Geração de Pontos Críticos")
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

        if critical_points_data and critical_points_data['total_points'] > 0:
            print("✅ Geração de pontos críticos concluída com sucesso")
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
            # Caminhos de saída
            geojson_path = "critical_points_mata_ciliar.geojson"
            geotiff_path = "ndvi_mata_ciliar_wgs84_normalized.geotiff"
            log_path = "processamento_notebook.log"

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
    print("📋 Para usar:")
    print("1. Execute: python hls_complete_analysis.py")
    print("2. Configure os parâmetros conforme necessário")
    print("3. Os resultados serão salvos na pasta atual")

if __name__ == "__main__":
    main()
