#!/usr/bin/env python3
"""
Script para corrigir coordenadas UTM em GeoJSON para WGS84
- Detecta automaticamente se as coordenadas estão em UTM
- Faz backup automático do arquivo original
- Converte para WGS84 com ordem correta [lon, lat]
"""

import json
import shutil
import os
from pyproj import Transformer

def convert_utm_to_wgs84(easting, northing, zone=22, southern=True):
    """
    Converte (easting, northing) da zona UTM para (lon, lat) WGS84.
    - zone: número da zona UTM (22 para sua região).
    - southern: True para Hemisfério Sul (usa EPSG:327xx). False para Norte (EPSG:326xx).
    Retorna: (lon, lat)
    """
    src_epsg = 32700 + zone if southern else 32600 + zone
    transformer = Transformer.from_crs(f"EPSG:{src_epsg}", "EPSG:4326", always_xy=True)
    lon, lat = transformer.transform(easting, northing)
    return lon, lat

def _is_probably_utm(coords):
    """Verifica se as coordenadas parecem estar em UTM (valores grandes em metros)"""
    def find_pair(c):
        if isinstance(c[0], (list, tuple)):
            return find_pair(c[0])
        return c
    try:
        x, y = find_pair(coords)
        return (abs(x) > 10000) and (abs(y) > 10000)
    except Exception:
        return False

def _transform_coords_recursive(coords, transformer_func):
    """Transforma recursivamente uma estrutura de coords do GeoJSON"""
    if isinstance(coords[0], (list, tuple)):
        return [_transform_coords_recursive(c, transformer_func) for c in coords]
    else:
        x, y = coords
        lon, lat = transformer_func(x, y)
        return [lon, lat]

def convert_geojson_file(input_path, output_path, zone=22, southern=True, force=False):
    """
    Converte coordenadas UTM para WGS84 em um arquivo GeoJSON
    
    Args:
        input_path: Caminho do arquivo GeoJSON de entrada
        output_path: Caminho do arquivo GeoJSON de saída
        zone: Zona UTM (padrão: 22)
        southern: Se é hemisfério sul (padrão: True)
        force: Forçar conversão mesmo se não detectar UTM
    """
    print(f"🔄 Convertendo GeoJSON: {input_path}")
    
    # Backup do arquivo original
    backup_path = input_path + ".bak"
    if not os.path.exists(backup_path):
        shutil.copyfile(input_path, backup_path)
        print(f"✅ Backup criado: {backup_path}")
    
    # Carregar GeoJSON
    with open(input_path, 'r', encoding='utf-8') as f:
        gj = json.load(f)

    transformer = lambda x, y: convert_utm_to_wgs84(x, y, zone=zone, southern=southern)
    
    converted_count = 0
    total_features = len(gj.get("features", []))
    
    print(f"📊 Processando {total_features} features...")

    for i, feat in enumerate(gj.get("features", [])):
        geom = feat.get("geometry")
        if not geom:
            continue
        coords = geom.get("coordinates")
        if coords is None:
            continue

        if force or _is_probably_utm(coords):
            try:
                new_coords = _transform_coords_recursive(coords, transformer)
                geom["coordinates"] = new_coords
                converted_count += 1
                
                # Mostrar progresso a cada 10 features
                if (i + 1) % 10 == 0:
                    print(f"   📍 Processadas {i + 1}/{total_features} features...")
                    
            except Exception as e:
                print(f"⚠️ Erro ao transformar feature {i}: {e}")
        else:
            if not force:
                print(f"   ⏭️ Feature {i}: Coordenadas parecem não estar em UTM (skipping)")

    # Salvar arquivo convertido
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(gj, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Conversão concluída!")
    print(f"   📊 Features convertidas: {converted_count}/{total_features}")
    print(f"   💾 Arquivo salvo: {output_path}")
    
    return converted_count

def test_coordinate_conversion():
    """Teste unitário para validar a conversão"""
    print("🧪 Testando conversão de coordenadas...")
    
    # Coordenadas conhecidas de Sinimbu/RS
    test_lon, test_lat = -52.46, -29.38
    
    # Converter para UTM (aproximado)
    test_easting, test_northing = 358311.315, 6749026.673
    
    # Converter de volta para WGS84
    result_lon, result_lat = convert_utm_to_wgs84(test_easting, test_northing, zone=22, southern=True)
    
    print(f"   📍 Coordenadas originais: ({test_lon}, {test_lat})")
    print(f"   📍 UTM (teste): ({test_easting}, {test_northing})")
    print(f"   📍 WGS84 convertido: ({result_lon:.6f}, {result_lat:.6f})")
    
    # Verificar se a conversão está correta (tolerância de 0.01 graus)
    if abs(result_lon - test_lon) < 0.01 and abs(result_lat - test_lat) < 0.01:
        print("   ✅ Teste de conversão PASSOU!")
        return True
    else:
        print("   ❌ Teste de conversão FALHOU!")
        return False

if __name__ == "__main__":
    print("🚀 Script de Correção de Coordenadas GeoJSON")
    print("=" * 50)
    
    # Testar conversão primeiro
    if not test_coordinate_conversion():
        print("❌ Teste falhou. Verifique a configuração do pyproj.")
        exit(1)
    
    # Converter o arquivo
    input_file = "critical_points_mata_ciliar.geojson"
    output_file = "critical_points_mata_ciliar_fixed.geojson"
    
    if os.path.exists(input_file):
        convert_geojson_file(
            input_path=input_file,
            output_path=output_file,
            zone=22,
            southern=True,
            force=True  # Forçar conversão
        )
        
        print(f"\n🎉 Processo concluído!")
        print(f"   📄 Arquivo original: {input_file}")
        print(f"   📄 Arquivo corrigido: {output_file}")
        print(f"   💾 Backup: {input_file}.bak")
    else:
        print(f"❌ Arquivo não encontrado: {input_file}")
