#!/usr/bin/env python3
"""
Exemplo de Uso dos Scripts HLS Analysis
Demonstra como usar os módulos individuais para análise personalizada
"""

import os
import sys
from datetime import datetime

# Adicionar o diretório atual ao path para importar módulos locais
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importar módulos
from hls_analysis import load_aoi_data, search_hls_data, select_best_item
from hls_ndvi_processing import load_and_process_hls_data, create_ndvi_composite
from hls_degradation_analysis import analyze_riparian_forest_degradation, generate_points_from_real_ndvi
from hls_export import export_geojson_results, export_geotiff_results

def exemplo_analise_basica():
    """Exemplo de análise básica de mata ciliar"""
    
    print("🔍 EXEMPLO: Análise Básica de Mata Ciliar")
    print("=" * 50)
    
    # 1. Carregar AOI
    print("1. Carregando Área de Interesse...")
    aoi_gdf, source_path = load_aoi_data()
    print(f"   ✅ AOI carregada: {source_path}")
    
    # 2. Buscar dados HLS
    print("\n2. Buscando dados HLS...")
    bounds = aoi_gdf.total_bounds
    hls_items = search_hls_data(bounds, "2022-06-01", "2022-09-30", 50)
    
    if hls_items:
        print(f"   ✅ {len(hls_items)} itens HLS encontrados")
        
        # 3. Selecionar melhores itens
        print("\n3. Selecionando melhores itens...")
        selected_items = select_best_item(hls_items, max_items=2)
        
        if selected_items:
            print(f"   ✅ {len(selected_items)} itens selecionados")
            
            # 4. Processar NDVI
            print("\n4. Processando NDVI...")
            processed_data = []
            
            for i, item in enumerate(selected_items):
                print(f"   Processando item {i+1}/{len(selected_items)}...")
                data = load_and_process_hls_data(item, bounds)
                if data:
                    processed_data.append(data)
            
            if processed_data:
                print(f"   ✅ {len(processed_data)} itens processados")
                
                # 5. Criar composição
                print("\n5. Criando composição NDVI...")
                final_ndvi = create_ndvi_composite(processed_data)
                
                if final_ndvi:
                    print("   ✅ Composição NDVI criada")
                    
                    # 6. Análise de degradação
                    print("\n6. Analisando degradação...")
                    degradation = analyze_riparian_forest_degradation(final_ndvi, aoi_gdf)
                    
                    if degradation:
                        print("   ✅ Análise de degradação concluída")
                        
                        # 7. Gerar pontos críticos
                        print("\n7. Gerando pontos críticos...")
                        river_gdf, river_buffer = load_river_geometry_for_buffer()
                        
                        if river_buffer:
                            points = generate_points_from_real_ndvi(degradation, river_buffer, 20)
                            
                            if points:
                                print(f"   ✅ {points['total_points']} pontos gerados")
                                
                                # 8. Exportar resultados
                                print("\n8. Exportando resultados...")
                                
                                # Exportar GeoJSON
                                geojson_success = export_geojson_results(
                                    points, degradation, "exemplo_pontos_criticos.geojson"
                                )
                                
                                # Exportar GeoTIFF
                                geotiff_success = export_geotiff_results(
                                    final_ndvi, degradation, "exemplo_ndvi.geotiff"
                                )
                                
                                if geojson_success and geotiff_success:
                                    print("   ✅ Resultados exportados com sucesso!")
                                    print("   📄 Arquivos criados:")
                                    print("      - exemplo_pontos_criticos.geojson")
                                    print("      - exemplo_ndvi.geotiff")
                                else:
                                    print("   ❌ Erro na exportação")
                            else:
                                print("   ❌ Nenhum ponto crítico gerado")
                        else:
                            print("   ⚠️ Geometria do rio não encontrada")
                    else:
                        print("   ❌ Análise de degradação falhou")
                else:
                    print("   ❌ Composição NDVI falhou")
            else:
                print("   ❌ Nenhum item processado com sucesso")
        else:
            print("   ❌ Nenhum item selecionado")
    else:
        print("   ❌ Nenhum item HLS encontrado")

def exemplo_analise_personalizada():
    """Exemplo de análise com parâmetros personalizados"""
    
    print("\n🔧 EXEMPLO: Análise Personalizada")
    print("=" * 50)
    
    # Parâmetros personalizados
    periodo_inicio = "2022-01-01"
    periodo_fim = "2022-12-31"
    cobertura_nuvens_max = 30  # Mais restritivo
    buffer_mata_ciliar = 300   # Maior buffer
    threshold_critico = 0.15   # Mais sensível
    threshold_moderado = 0.45  # Mais sensível
    
    print(f"📋 Parâmetros personalizados:")
    print(f"   - Período: {periodo_inicio} a {periodo_fim}")
    print(f"   - Cobertura de nuvens: {cobertura_nuvens_max}%")
    print(f"   - Buffer mata ciliar: {buffer_mata_ciliar}m")
    print(f"   - Threshold crítico: {threshold_critico}")
    print(f"   - Threshold moderado: {threshold_moderado}")
    
    # Carregar AOI
    aoi_gdf, _ = load_aoi_data()
    bounds = aoi_gdf.total_bounds
    
    # Buscar dados com parâmetros personalizados
    print("\n🔍 Buscando dados com parâmetros personalizados...")
    hls_items = search_hls_data(bounds, periodo_inicio, periodo_fim, cobertura_nuvens_max)
    
    if hls_items:
        print(f"   ✅ {len(hls_items)} itens encontrados")
        
        # Processar apenas o melhor item
        selected_items = select_best_item(hls_items, max_items=1)
        
        if selected_items:
            print("   ✅ Melhor item selecionado")
            
            # Processar NDVI
            processed_data = load_and_process_hls_data(selected_items[0], bounds)
            
            if processed_data:
                print("   ✅ NDVI processado")
                
                # Análise de degradação com thresholds personalizados
                print("   🔧 Aplicando thresholds personalizados...")
                
                # Aqui você poderia modificar os thresholds globalmente
                # ou passar como parâmetros para as funções
                
                print("   ✅ Análise personalizada concluída")
            else:
                print("   ❌ Processamento NDVI falhou")
        else:
            print("   ❌ Nenhum item selecionado")
    else:
        print("   ❌ Nenhum item encontrado com parâmetros personalizados")

def exemplo_exportacao_customizada():
    """Exemplo de exportação customizada"""
    
    print("\n📤 EXEMPLO: Exportação Customizada")
    print("=" * 50)
    
    # Simular dados de exemplo
    dados_exemplo = {
        'critical': [
            {
                'lat': -29.5,
                'lon': -52.4,
                'ndvi': 0.15,
                'severity': 'critical',
                'level': 'very_sparse',
                'color': '#DC143C',
                'label': 'Vegetação muito rala',
                'description': 'Área crítica - NDVI 0.15'
            }
        ],
        'moderate': [
            {
                'lat': -29.5,
                'lon': -52.3,
                'ndvi': 0.35,
                'severity': 'moderate',
                'level': 'sparse',
                'color': '#FF8C00',
                'label': 'Vegetação esparsa',
                'description': 'Área moderada - NDVI 0.35'
            }
        ],
        'fair': [],
        'water': [],
        'total_points': 2,
        'generation_params': {
            'thresholds': {'critical': 0.2, 'moderate': 0.5}
        }
    }
    
    # Metadados de exemplo
    metadados_exemplo = {
        'statistics': {
            'total_pixels': 1000,
            'ndvi_mean': 0.4,
            'critical_fraction': 0.1,
            'moderate_fraction': 0.3,
            'overall_status': 'moderately_degraded'
        }
    }
    
    print("📄 Exportando dados de exemplo...")
    
    # Exportar GeoJSON customizado
    sucesso = export_geojson_results(
        dados_exemplo,
        metadados_exemplo,
        "exemplo_customizado.geojson"
    )
    
    if sucesso:
        print("   ✅ GeoJSON customizado exportado")
        print("   📄 Arquivo: exemplo_customizado.geojson")
    else:
        print("   ❌ Erro na exportação customizada")

def main():
    """Função principal do exemplo"""
    
    print("🚀 EXEMPLOS DE USO - HLS Analysis")
    print("=" * 60)
    print("Este script demonstra como usar os módulos HLS Analysis")
    print("para diferentes cenários de análise de mata ciliar.")
    print("=" * 60)
    
    try:
        # Exemplo 1: Análise básica
        exemplo_analise_basica()
        
        # Exemplo 2: Análise personalizada
        exemplo_analise_personalizada()
        
        # Exemplo 3: Exportação customizada
        exemplo_exportacao_customizada()
        
        print("\n🎉 EXEMPLOS CONCLUÍDOS!")
        print("=" * 60)
        print("📋 Próximos passos:")
        print("1. Execute o script completo: python hls_complete_analysis.py")
        print("2. Personalize os parâmetros conforme necessário")
        print("3. Integre os módulos em seu próprio código")
        print("4. Consulte a documentação para mais detalhes")
        
    except Exception as e:
        print(f"\n❌ Erro durante execução dos exemplos: {e}")
        print("💡 Verifique se todas as dependências estão instaladas")
        print("   pip install -r requirements_hls.txt")

if __name__ == "__main__":
    main()
