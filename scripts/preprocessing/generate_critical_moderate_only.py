#!/usr/bin/env python3
"""
Script para gerar apenas pontos críticos e moderados de NDVI
Este script filtra os pontos críticos existentes e gera um GeoJSON específico
com apenas os pontos de severidade crítica e moderada.
"""

import os
import sys
import json
import geopandas as gpd
import pandas as pd
import numpy as np
from pathlib import Path

def load_critical_points(file_path: str) -> gpd.GeoDataFrame:
    """Carrega pontos críticos de um arquivo GeoJSON"""
    print(f"📂 Carregando pontos críticos: {file_path}")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Arquivo não encontrado: {file_path}")
    
    gdf = gpd.read_file(file_path)
    print(f"✅ Carregados {len(gdf)} pontos críticos")
    
    return gdf

def generate_ndvi_classification(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Gera classificação de NDVI baseada em características dos pontos.
    Em um cenário real, estes valores viriam de dados HLS processados.
    """
    print("🎯 Gerando classificação de NDVI...")
    
    # Simula valores de NDVI baseados na posição e características do ponto
    np.random.seed(42)  # Para reprodutibilidade
    
    ndvi_values = []
    severity_levels = []
    
    for idx, row in gdf.iterrows():
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
    gdf = gdf.copy()
    gdf['ndvi'] = ndvi_values
    gdf['severity'] = severity_levels
    gdf['ndvi_category'] = gdf['severity'].map({
        'critical': 'Crítico',
        'moderate': 'Moderado', 
        'good': 'Bom'
    })
    
    return gdf

def filter_critical_moderate_points(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Filtra apenas pontos críticos e moderados"""
    print("🔍 Filtrando pontos críticos e moderados...")
    
    # Filtra apenas pontos críticos e moderados
    critical_moderate = gdf[
        gdf['severity'].isin(['critical', 'moderate'])
    ].copy()
    
    # Adiciona metadados
    critical_moderate['analysis_date'] = pd.Timestamp.now().isoformat()
    critical_moderate['total_points'] = len(critical_moderate)
    critical_moderate['critical_count'] = len(critical_moderate[critical_moderate['severity'] == 'critical'])
    critical_moderate['moderate_count'] = len(critical_moderate[critical_moderate['severity'] == 'moderate'])
    
    return critical_moderate

def export_critical_moderate_points(gdf: gpd.GeoDataFrame, output_file: str):
    """Exporta pontos críticos e moderados para GeoJSON"""
    print(f"💾 Exportando para: {output_file}")
    
    # Cria diretório se não existir
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Salva arquivo
    gdf.to_file(output_file, driver="GeoJSON")
    
    # Estatísticas
    critical_count = len(gdf[gdf['severity'] == 'critical'])
    moderate_count = len(gdf[gdf['severity'] == 'moderate'])
    total_points = len(gdf)
    
    print(f"✅ Pontos críticos e moderados exportados:")
    print(f"   📊 Total de pontos: {total_points}")
    print(f"   🔴 Críticos: {critical_count}")
    print(f"   🟡 Moderados: {moderate_count}")
    print(f"   📁 Arquivo: {output_file}")

def main():
    """Função principal do script"""
    print("🚀 Gerador de Pontos Críticos e Moderados")
    print("=" * 50)
    
    # Configurações
    input_file = "../../public/critical_points.geojson"
    output_file = "../../public/critical_moderate_points.geojson"
    
    try:
        # 1. Carregar pontos críticos
        critical_points = load_critical_points(input_file)
        
        # 2. Gerar classificação de NDVI
        classified_points = generate_ndvi_classification(critical_points)
        
        # 3. Filtrar pontos críticos e moderados
        critical_moderate = filter_critical_moderate_points(classified_points)
        
        # 4. Exportar resultado
        export_critical_moderate_points(critical_moderate, output_file)
        
        print("\n🎉 Processamento concluído com sucesso!")
        
        # Estatísticas finais
        print(f"\n📊 ESTATÍSTICAS FINAIS:")
        print(f"   - Pontos originais: {len(critical_points)}")
        print(f"   - Pontos críticos: {len(critical_moderate[critical_moderate['severity'] == 'critical'])}")
        print(f"   - Pontos moderados: {len(critical_moderate[critical_moderate['severity'] == 'moderate'])}")
        print(f"   - Total filtrado: {len(critical_moderate)}")
        print(f"   - Percentual filtrado: {len(critical_moderate)/len(critical_points)*100:.1f}%")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
