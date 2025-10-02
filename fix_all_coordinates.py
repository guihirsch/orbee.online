#!/usr/bin/env python3
"""
Script para converter TODAS as coordenadas do GeoJSON de UTM para WGS84
"""
import json
import pyproj

def fix_geojson_coordinates():
    """Converte coordenadas UTM para WGS84 no GeoJSON"""
    
    # Definir transformação UTM Zone 22S -> WGS84
    transformer = pyproj.Transformer.from_crs("EPSG:32622", "EPSG:4326", always_xy=True)
    
    input_file = "public/critical_points_mata_ciliar.geojson"
    
    print("🔄 Carregando GeoJSON...")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
        
        if geojson_data.get("type") != "FeatureCollection":
            print("❌ Arquivo não é um FeatureCollection válido")
            return False
        
        total_features = len(geojson_data["features"])
        print(f"📊 Processando {total_features} pontos...")
        
        converted_count = 0
        
        for i, feature in enumerate(geojson_data["features"]):
            if feature.get("geometry", {}).get("type") == "Point":
                coords = feature["geometry"]["coordinates"]
                
                # Coordenadas UTM (x, y)
                x_utm, y_utm = coords[0], coords[1]
                
                # Converter para WGS84 (lon, lat)
                lon_wgs84, lat_wgs84 = transformer.transform(x_utm, y_utm)
                
                # Atualizar coordenadas
                feature["geometry"]["coordinates"] = [lon_wgs84, lat_wgs84]
                converted_count += 1
                
                # Progress
                if (i + 1) % 50 == 0:
                    print(f"   Processados: {i + 1}/{total_features}")
        
        print(f"✅ Convertidas {converted_count} coordenadas")
        
        # Salvar arquivo corrigido
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(geojson_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Arquivo salvo: {input_file}")
        
        # Mostrar exemplo das coordenadas convertidas
        if geojson_data["features"]:
            example_coords = geojson_data["features"][0]["geometry"]["coordinates"]
            print(f"📍 Exemplo convertido: [{example_coords[0]:.6f}, {example_coords[1]:.6f}]")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ Arquivo não encontrado: {input_file}")
        return False
    except Exception as e:
        print(f"❌ Erro ao processar: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Convertendo coordenadas UTM → WGS84...")
    success = fix_geojson_coordinates()
    
    if success:
        print("\n🎉 SUCESSO! Coordenadas convertidas.")
        print("   Recarregue a página para ver os pins!")
    else:
        print("\n❌ FALHA na conversão.")
