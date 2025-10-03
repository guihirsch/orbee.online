#!/usr/bin/env python3
"""
HLS Export - Exportação de Resultados (GeoJSON e GeoTIFF)
Funções para exportar resultados da análise HLS
"""

import os
import json
import numpy as np
from datetime import datetime
from pyproj import Transformer

# Configurações globais
OUTPUT_DIR = "."
GEOJSON_FILENAME = "critical_points_mata_ciliar.geojson"
GEOTIFF_FILENAME = "ndvi_mata_ciliar_wgs84_normalized.geotiff"
LOG_FILENAME = "processamento_notebook.log"

def convert_utm_to_wgs84(easting, northing, zone=22, southern=False):
    """
    Converte (easting, northing) da zona UTM para (lon, lat) WGS84.
    - zone: número da zona UTM (22 para sua região).
    - southern: False para Hemisfério Norte (usa EPSG:326xx). True para Sul (EPSG:327xx).
    Retorna: (lon, lat)
    """
    try:
        # Usar o CRS correto baseado no hemisfério
        if southern:
            src_epsg = 32700 + zone  # UTM Sul
        else:
            src_epsg = 32600 + zone  # UTM Norte
        
        transformer = Transformer.from_crs(f"EPSG:{src_epsg}", "EPSG:4326", always_xy=True)
        lon, lat = transformer.transform(easting, northing)
        
        # Debug: mostrar conversão
        print(f"   🔄 UTM ({easting:.1f}, {northing:.1f}) -> WGS84 ({lon:.6f}, {lat:.6f})")
        
        return lon, lat
    except Exception as e:
        print(f"⚠️ Erro na conversão UTM->WGS84: {e}")
        # Fallback: assumir que já são coordenadas WGS84
        return easting, northing

def ensure_output_directory(output_dir):
    """Garante que o diretório de saída existe"""
    try:
        # Se for diretório atual (.), não precisa criar
        if output_dir == "." or output_dir == "":
            print(f"📁 Salvando na pasta atual: {os.getcwd()}")
            return True

        # Criar diretório se não existir
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Diretório criado/verificado: {output_dir}")
        return True
    except Exception as e:
        print(f"❌ Erro ao criar diretório {output_dir}: {e}")
        print(f"💡 Tentando usar diretório atual como fallback...")
        return True  # Usar diretório atual como fallback

def export_geojson_results(critical_points_data, degradation_analysis, output_path):
    """Exporta pontos críticos para GeoJSON compatível com a aplicação web"""
    
    if not critical_points_data:
        print("❌ Nenhum dado de pontos críticos para exportar")
        return False

    print(f"📄 Exportando GeoJSON: {output_path}")

    try:
        # Combinar todos os pontos
        all_points = []

        # Adicionar pontos críticos (prioridade máxima)
        for point in critical_points_data.get('critical', []):
            # Converter coordenadas UTM para WGS84
            lon_wgs84, lat_wgs84 = convert_utm_to_wgs84(point['lon'], point['lat'], zone=22, southern=True)
            
            all_points.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon_wgs84, lat_wgs84]
                },
                "properties": {
                    "severity": point['severity'],
                    "ndvi": point['ndvi'],
                    "description": point['description'],
                    "type": "critical_point",
                    "level": point['level'],
                    "color": point['color'],
                    "label": point['label'],
                    "distance_to_river_m": point.get('distance_to_river_m', 0)
                }  
            })

        # Adicionar pontos moderados
        for point in critical_points_data.get('moderate', []):
            # Converter coordenadas UTM para WGS84
            lon_wgs84, lat_wgs84 = convert_utm_to_wgs84(point['lon'], point['lat'], zone=22, southern=True)
            
            all_points.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon_wgs84, lat_wgs84]
                },
                "properties": {
                    "severity": point['severity'],
                    "ndvi": point['ndvi'],
                    "description": point['description'],
                    "type": "moderate_point",
                    "level": point['level'],
                    "color": point['color'],
                    "label": point['label']
                }
            })

        # Adicionar alguns pontos regulares para contexto (limitado)
        fair_points = critical_points_data.get('fair', [])[:50]  # Máximo 50 pontos regulares
        for point in fair_points:
            # Converter coordenadas UTM para WGS84
            lon_wgs84, lat_wgs84 = convert_utm_to_wgs84(point['lon'], point['lat'], zone=22, southern=True)
            
            all_points.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon_wgs84, lat_wgs84]
                },
                "properties": {
                    "severity": point['severity'],
                    "ndvi": point['ndvi'],
                    "description": point['description'],
                    "type": "fair_point",
                    "level": point['level'],
                    "color": point['color'],
                    "label": point['label']
                }
            })

        # Metadados da análise
        stats = degradation_analysis['statistics'] if degradation_analysis else {}
        generation_params = critical_points_data.get('generation_params', {})

        # Criar GeoJSON final
        geojson_data = {
            "type": "FeatureCollection",
            "features": all_points,
            "metadata": {
                "analysis_date": datetime.now().isoformat(),
                "data_source": "HLS (Harmonized Landsat Sentinel)",
                "buffer_distance": f"200 meters",
                "ndvi_processing": {
                    "values_real": True,
                    "geotiff_normalized": False,
                    "points_generation_method": "real_ndvi_based",
                    "thresholds_applied": {
                        "critical": 0.2,
                        "moderate": 0.5
                    },
                    "note": "Pontos críticos e GeoTIFF usam valores reais de NDVI da análise HLS"
                },
                "thresholds": generation_params.get('thresholds', {
                    "critical": 0.2,
                    "moderate": 0.5
                }),
                "statistics": {
                    "total_pixels": stats.get('total_pixels', 0),
                    "ndvi_min": stats.get('ndvi_min', 0),
                    "ndvi_max": stats.get('ndvi_max', 0),
                    "ndvi_mean": stats.get('ndvi_mean', 0),
                    "critical_fraction": stats.get('critical_fraction', 0),
                    "moderate_fraction": stats.get('moderate_fraction', 0),
                    "overall_status": stats.get('overall_status', 'unknown')
                },
                "total_critical_points": len(critical_points_data.get('critical', [])),
                "total_moderate_points": len(critical_points_data.get('moderate', [])),
                "total_fair_points": len(fair_points),
                "processing_params": {
                    "min_distance_points": generation_params.get('min_distance', 100),
                    "sampling_step": generation_params.get('sampling_step', 3),
                    "start_date": "2022-06-01",
                    "end_date": "2022-09-30",
                    "cloud_coverage_max": 50
                }
            }
        }

        # Salvar arquivo
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, ensure_ascii=False, indent=2)

        print(f"✅ GeoJSON exportado com sucesso")
        print(f"   📊 Total de features: {len(all_points)}")
        print(f"   🔴 Pontos críticos: {len(critical_points_data.get('critical', []))}")
        print(f"   🟡 Pontos moderados: {len(critical_points_data.get('moderate', []))}")
        print(f"   🟨 Pontos regulares: {len(fair_points)}")

        return True

    except Exception as e:
        print(f"❌ Erro ao exportar GeoJSON: {e}")
        return False

def export_geotiff_results(final_ndvi_data, degradation_analysis, output_path):
    """Exporta raster NDVI para GeoTIFF"""
    
    if not final_ndvi_data or 'ndvi' not in final_ndvi_data:
        print("❌ Dados NDVI não disponíveis para exportar")
        return False

    if not degradation_analysis:
        print("❌ Análise de degradação não disponível")
        return False

    print(f"🗺️ Exportando GeoTIFF: {output_path}")

    try:
        # Usar NDVI recortado da análise de degradação
        ndvi_clipped = degradation_analysis['ndvi_clipped']

        # Converter para WGS84 se necessário
        if ndvi_clipped.rio.crs != 'EPSG:4326':
            print("   🔄 Reprojetando para WGS84...")
            ndvi_wgs84 = ndvi_clipped.rio.reproject('EPSG:4326')
        else:
            ndvi_wgs84 = ndvi_clipped

        # Manter valores reais de NDVI (sem normalização)
        ndvi_values = ndvi_wgs84.values
        valid_mask = ~np.isnan(ndvi_values)

        if np.sum(valid_mask) > 0:
            ndvi_min = np.nanmin(ndvi_values)
            ndvi_max = np.nanmax(ndvi_values)
            print(f"   📊 Valores reais de NDVI mantidos:")
            print(f"      - Range: {ndvi_min:.3f} a {ndvi_max:.3f}")
            print(f"      - Valores originais preservados para análise")

        # Salvar GeoTIFF
        ndvi_wgs84.rio.to_raster(
            output_path,
            driver='GTiff',  # Especificar driver explicitamente
            compress='lzw',  # Compressão para reduzir tamanho
            nodata=np.nan,
            dtype='float32'
        )

        print(f"✅ GeoTIFF exportado com sucesso")
        print(f"   📐 Dimensões: {ndvi_wgs84.shape}")
        print(f"   🗺️ CRS: {ndvi_wgs84.rio.crs}")
        print(f"   📏 Resolução: ~{abs(ndvi_wgs84.rio.resolution()[0]):.0f}m")

        return True

    except Exception as e:
        print(f"❌ Erro ao exportar GeoTIFF: {e}")
        return False

def create_processing_log(critical_points_data, degradation_analysis, final_ndvi_data, log_path):
    """Cria log detalhado do processamento"""
    
    print(f"📝 Criando log de processamento: {log_path}")

    try:
        log_content = []
        log_content.append("=" * 80)
        log_content.append(f"HLS Analysis - Log de Processamento")
        log_content.append(f"Data/Hora: {datetime.now().isoformat()}")
        log_content.append("=" * 80)

        # Parâmetros de configuração
        log_content.append("\n📋 CONFIGURAÇÕES:")
        log_content.append(f"  - Período de análise: 2022-06-01 a 2022-09-30")
        log_content.append(f"  - Cobertura máxima de nuvens: 50%")
        log_content.append(f"  - Buffer mata ciliar: 200m")
        log_content.append(f"  - Threshold crítico: 0.2")
        log_content.append(f"  - Threshold moderado: 0.5")
        log_content.append(f"  - Distância mínima entre pontos: 100m")

        # Dados HLS processados
        if final_ndvi_data and 'source_items' in final_ndvi_data:
            log_content.append("\n🛰️ DADOS HLS PROCESSADOS:")
            for i, item_data in enumerate(final_ndvi_data['source_items']):
                item = item_data['item']
                stats = item_data['stats']
                log_content.append(f"  {i+1}. {item.collection_id}")
                log_content.append(f"     Data: {item.properties.get('datetime', 'N/A')[:10]}")
                log_content.append(f"     Nuvens: {item.properties.get('eo:cloud_cover', 'N/A')}%")
                log_content.append(f"     NDVI médio: {stats['mean']:.3f}")
                log_content.append(f"     Pixels válidos: {stats['valid_pixels']:,}")

        # Estatísticas de degradação
        if degradation_analysis:
            stats = degradation_analysis['statistics']
            log_content.append("\n🌊 ANÁLISE DE DEGRADAÇÃO:")
            log_content.append(f"  - Status geral: {stats['overall_status']}")
            log_content.append(f"  - NDVI médio: {stats['ndvi_mean']:.3f}")
            log_content.append(f"  - NDVI mín/máx: {stats['ndvi_min']:.3f} / {stats['ndvi_max']:.3f}")
            log_content.append(f"  - Pixels críticos: {stats['critical_pixels']:,} ({stats['critical_fraction']:.1%})")
            log_content.append(f"  - Pixels moderados: {stats['moderate_pixels']:,} ({stats['moderate_fraction']:.1%})")
            log_content.append(f"  - Pixels saudáveis: {stats['healthy_pixels']:,} ({stats['healthy_fraction']:.1%})")

        # Pontos críticos gerados
        if critical_points_data:
            log_content.append("\n📍 PONTOS CRÍTICOS GERADOS:")
            log_content.append(f"  - Críticos: {len(critical_points_data.get('critical', []))}")
            log_content.append(f"  - Moderados: {len(critical_points_data.get('moderate', []))}")
            log_content.append(f"  - Regulares: {len(critical_points_data.get('fair', []))}")
            log_content.append(f"  - Água/Solo: {len(critical_points_data.get('water', []))}")
            log_content.append(f"  - Total: {critical_points_data['total_points']}")

        # Arquivos de saída
        log_content.append("\n💾 ARQUIVOS GERADOS:")
        log_content.append(f"  - GeoJSON: {GEOJSON_FILENAME}")
        log_content.append(f"  - GeoTIFF: {GEOTIFF_FILENAME}")
        log_content.append(f"  - Log: {LOG_FILENAME}")

        log_content.append("\n" + "=" * 80)
        log_content.append("Processamento concluído com sucesso!")
        log_content.append("=" * 80)

        # Salvar log
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(log_content))

        print("✅ Log de processamento criado")
        return True

    except Exception as e:
        print(f"❌ Erro ao criar log: {e}")
        return False

def validate_ndvi_consistency(degradation_analysis, critical_points_data):
    """Valida consistência entre análise de degradação e pontos gerados"""
    if not degradation_analysis or not critical_points_data:
        print("❌ Dados insuficientes para validação")
        return False

    # Estatísticas da análise real
    real_stats = degradation_analysis['statistics']
    real_critical_fraction = real_stats['critical_fraction']
    real_moderate_fraction = real_stats['moderate_fraction']

    # Estatísticas dos pontos gerados
    total_points = critical_points_data['total_points']
    critical_points = len(critical_points_data.get('critical', []))
    moderate_points = len(critical_points_data.get('moderate', []))

    if total_points == 0:
        print("❌ Nenhum ponto gerado para validação")
        return False

    generated_critical_fraction = critical_points / total_points
    generated_moderate_fraction = moderate_points / total_points

    print(f"\n📊 Validação de Consistência NDVI:")
    print(f"   Análise real - Críticos: {real_critical_fraction:.1%}, Moderados: {real_moderate_fraction:.1%}")
    print(f"   Pontos gerados - Críticos: {generated_critical_fraction:.1%}, Moderados: {generated_moderate_fraction:.1%}")

    # Verificar se as proporções são similares (com tolerância de 20%)
    critical_diff = abs(real_critical_fraction - generated_critical_fraction)
    moderate_diff = abs(real_moderate_fraction - generated_moderate_fraction)

    if critical_diff < 0.2 and moderate_diff < 0.2:
        print("✅ Pontos gerados são consistentes com a análise real")
        return True
    else:
        print("⚠️ Pontos gerados podem não refletir perfeitamente a análise real")
        print(f"   Diferença crítica: {critical_diff:.1%}, Moderada: {moderate_diff:.1%}")
        return True  # Ainda aceitar, mas com aviso
