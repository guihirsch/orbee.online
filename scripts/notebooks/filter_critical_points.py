#!/usr/bin/env python3
"""
Filter Critical Points - Filtra apenas pontos críticos do GeoJSON existente
Script para filtrar o GeoJSON atual e manter apenas pontos com NDVI < 0.2
"""

import json
import os

def filter_critical_points_only(input_geojson_path, output_geojson_path):
    """
    Filtra o GeoJSON para manter apenas pontos críticos (NDVI < 0.2)
    """
    
    print(f"Carregando GeoJSON: {input_geojson_path}")
    
    # Carregar GeoJSON existente
    with open(input_geojson_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
    
    print(f"Total de pontos originais: {len(geojson_data['features'])}")
    
    # Filtrar apenas pontos críticos
    critical_features = []
    critical_count = 0
    moderate_count = 0
    healthy_count = 0
    
    for feature in geojson_data['features']:
        properties = feature['properties']
        ndvi = properties.get('ndvi', 0)
        severity = properties.get('severity', '')
        
        # Contar por severidade
        if severity == 'critical':
            critical_count += 1
        elif severity == 'moderate':
            moderate_count += 1
        elif severity == 'healthy':
            healthy_count += 1
        
        # Manter apenas pontos críticos (NDVI < 0.2)
        if ndvi < 0.2:
            critical_features.append(feature)
    
    print(f"Pontos encontrados por severidade:")
    print(f"  - Criticos: {critical_count}")
    print(f"  - Moderados: {moderate_count}")
    print(f"  - Saudaveis: {healthy_count}")
    print(f"  - Total filtrado (NDVI < 0.2): {len(critical_features)}")
    
    # Criar novo GeoJSON apenas com pontos críticos
    filtered_geojson = {
        "type": "FeatureCollection",
        "features": critical_features,
        "metadata": {
            **geojson_data.get('metadata', {}),
            "filtered_for_critical_only": True,
            "original_total_points": len(geojson_data['features']),
            "critical_points_only": len(critical_features),
            "filter_criteria": "NDVI < 0.2",
            "filter_date": "2025-01-27T00:00:00Z"
        }
    }
    
    # Salvar GeoJSON filtrado
    with open(output_geojson_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_geojson, f, indent=2, ensure_ascii=False)
    
    print(f"GeoJSON filtrado salvo: {output_geojson_path}")
    print(f"Arquivo contem apenas {len(critical_features)} pontos criticos")
    
    return len(critical_features)

def main():
    """Função principal"""
    print("Filtro de Pontos Criticos - Apenas NDVI < 0.2")
    print("=" * 50)
    
    # Caminhos dos arquivos
    input_path = "critical_points_mata_ciliar.geojson"
    output_path = "critical_points_mata_ciliar_filtered.geojson"
    
    # Verificar se arquivo de entrada existe
    if not os.path.exists(input_path):
        print(f"ERRO: Arquivo {input_path} nao encontrado")
        print("Execute este script na pasta onde esta o GeoJSON original")
        return
    
    # Filtrar pontos críticos
    try:
        critical_count = filter_critical_points_only(input_path, output_path)
        
        print("\nSUCESSO!")
        print("=" * 30)
        print(f"Arquivo original: {input_path}")
        print(f"Arquivo filtrado: {output_path}")
        print(f"Pontos criticos: {critical_count}")
        print("\nProximos passos:")
        print("1. Copie o arquivo filtrado para public/ do seu projeto")
        print("2. Renomeie para critical_points_mata_ciliar.geojson")
        print("3. Teste no AOIViewer.jsx")
        
    except Exception as e:
        print(f"ERRO: {e}")

if __name__ == "__main__":
    main()
