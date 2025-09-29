#!/usr/bin/env python3
"""
Script para visualizar dados GeoJSON no mapa - Versão Automática
Suporta tanto o arquivo export.geojson (rios) quanto critical_points_sr.json (pontos críticos)
"""

import json
import folium
import numpy as np
import os

def load_geojson(file_path):
    """Carrega arquivo GeoJSON"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_map_with_rivers_and_points():
    """Cria mapa com rios e pontos críticos"""
    
    # Verificar se os arquivos existem
    if not os.path.exists("export.geojson"):
        print("❌ Arquivo export.geojson não encontrado!")
        return None
    
    if not os.path.exists("critical_points_sr (1).json"):
        print("❌ Arquivo critical_points_sr (1).json não encontrado!")
        return None
    
    # Carregar dados
    print("📂 Carregando dados...")
    rivers_data = load_geojson("export.geojson")
    critical_points_data = load_geojson("critical_points_sr (1).json")
    
    # Calcular centro do mapa baseado nos dados
    all_coords = []
    
    # Coordenadas dos rios
    for feature in rivers_data['features']:
        if feature['geometry']['type'] == 'LineString':
            all_coords.extend(feature['geometry']['coordinates'])
        elif feature['geometry']['type'] == 'MultiLineString':
            for line in feature['geometry']['coordinates']:
                all_coords.extend(line)
    
    # Coordenadas dos pontos críticos
    for feature in critical_points_data['features']:
        all_coords.append(feature['geometry']['coordinates'])
    
    # Calcular centro
    lats = [coord[1] for coord in all_coords]
    lons = [coord[0] for coord in all_coords]
    center_lat = np.mean(lats)
    center_lon = np.mean(lons)
    
    print(f"📍 Centro do mapa: {center_lat:.6f}, {center_lon:.6f}")
    print(f"🔴 Total de pontos críticos: {len(critical_points_data['features'])}")
    print(f"🌊 Total de rios: {len(rivers_data['features'])}")
    
    # Criar mapa
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=12,
        tiles='OpenStreetMap'
    )
    
    # Adicionar rios
    print("🌊 Adicionando rios ao mapa...")
    for feature in rivers_data['features']:
        name = feature['properties'].get('name', 'Rio sem nome')
        waterway = feature['properties'].get('waterway', '')
        
        # Criar popup com informações
        popup_text = f"<b>{name}</b><br>Tipo: {waterway}"
        
        if feature['geometry']['type'] == 'LineString':
            coords = [[coord[1], coord[0]] for coord in feature['geometry']['coordinates']]
            folium.PolyLine(
                coords,
                color='blue',
                weight=3,
                opacity=0.8,
                popup=popup_text
            ).add_to(m)
        elif feature['geometry']['type'] == 'MultiLineString':
            for line in feature['geometry']['coordinates']:
                coords = [[coord[1], coord[0]] for coord in line]
                folium.PolyLine(
                    coords,
                    color='blue',
                    weight=3,
                    opacity=0.8,
                    popup=popup_text
                ).add_to(m)
    
    # Adicionar pontos críticos
    print("🔴 Adicionando pontos críticos ao mapa...")
    for feature in critical_points_data['features']:
        coords = feature['geometry']['coordinates']
        ndvi_value = feature['properties']['ndvi']
        
        # Definir cor baseada no valor NDVI
        if ndvi_value is None:
            color = 'gray'
        elif ndvi_value < 0.1:
            color = 'red'
        elif ndvi_value < 0.2:
            color = 'orange'
        else:
            color = 'yellow'
        
        # Criar popup
        popup_text = f"<b>Ponto Crítico</b><br>NDVI: {ndvi_value:.4f if ndvi_value else 'N/A'}<br>Coordenadas: {coords[1]:.6f}, {coords[0]:.6f}"
        
        folium.CircleMarker(
            location=[coords[1], coords[0]],
            radius=5,
            popup=popup_text,
            color='black',
            weight=1,
            fillColor=color,
            fillOpacity=0.8
        ).add_to(m)
    
    # Adicionar legenda
    legend_html = '''
    <div style="position: fixed; 
                bottom: 50px; left: 50px; width: 200px; height: 120px; 
                background-color: white; border:2px solid grey; z-index:9999; 
                font-size:14px; padding: 10px">
    <p><b>Legenda:</b></p>
    <p><i class="fa fa-circle" style="color:blue"></i> Rios</p>
    <p><i class="fa fa-circle" style="color:red"></i> NDVI < 0.1</p>
    <p><i class="fa fa-circle" style="color:orange"></i> NDVI 0.1-0.2</p>
    <p><i class="fa fa-circle" style="color:yellow"></i> NDVI 0.2-0.3</p>
    <p><i class="fa fa-circle" style="color:gray"></i> NDVI N/A</p>
    </div>
    '''
    m.get_root().html.add_child(folium.Element(legend_html))
    
    # Salvar mapa
    output_file = "mapa_visualizacao.html"
    m.save(output_file)
    print(f"✅ Mapa salvo como: {output_file}")
    
    return m

def create_simple_map():
    """Cria um mapa mais simples apenas com pontos críticos"""
    
    # Verificar se o arquivo existe
    if not os.path.exists("critical_points_sr (1).json"):
        print("❌ Arquivo critical_points_sr (1).json não encontrado!")
        return None
    
    # Carregar pontos críticos
    with open("critical_points_sr (1).json", 'r') as f:
        data = json.load(f)
    
    # Calcular centro
    lats = [feature['geometry']['coordinates'][1] for feature in data['features']]
    lons = [feature['geometry']['coordinates'][0] for feature in data['features']]
    center_lat = np.mean(lats)
    center_lon = np.mean(lons)
    
    print(f"📍 Centro do mapa: {center_lat:.6f}, {center_lon:.6f}")
    print(f"🔴 Total de pontos críticos: {len(data['features'])}")
    
    # Criar mapa
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=13
    )
    
    # Adicionar pontos
    for feature in data['features']:
        coords = feature['geometry']['coordinates']
        ndvi_value = feature['properties']['ndvi']
        
        # Cor baseada no NDVI
        if ndvi_value is None:
            color = 'gray'
        elif ndvi_value < 0.1:
            color = 'red'
        elif ndvi_value < 0.2:
            color = 'orange'
        else:
            color = 'yellow'
        
        folium.CircleMarker(
            location=[coords[1], coords[0]],
            radius=6,
            popup=f"NDVI: {ndvi_value:.4f if ndvi_value else 'N/A'}",
            color='black',
            weight=1,
            fillColor=color,
            fillOpacity=0.8
        ).add_to(m)
    
    # Salvar
    output_file = "pontos_criticos_simples.html"
    m.save(output_file)
    print(f"✅ Mapa simples salvo como: {output_file}")
    
    return m

def analyze_data():
    """Analisa os dados dos pontos críticos"""
    
    if not os.path.exists("critical_points_sr (1).json"):
        print("❌ Arquivo critical_points_sr (1).json não encontrado!")
        return
    
    with open("critical_points_sr (1).json", 'r') as f:
        data = json.load(f)
    
    print("\n📊 ANÁLISE DOS DADOS:")
    print("=" * 50)
    
    ndvi_values = []
    for feature in data['features']:
        ndvi = feature['properties']['ndvi']
        if ndvi is not None:
            ndvi_values.append(ndvi)
    
    if ndvi_values:
        print(f"📈 Estatísticas do NDVI:")
        print(f"   • Total de pontos: {len(data['features'])}")
        print(f"   • Pontos com NDVI válido: {len(ndvi_values)}")
        print(f"   • NDVI mínimo: {min(ndvi_values):.4f}")
        print(f"   • NDVI máximo: {max(ndvi_values):.4f}")
        print(f"   • NDVI médio: {np.mean(ndvi_values):.4f}")
        
        # Contar por faixas
        very_low = sum(1 for v in ndvi_values if v < 0.1)
        low = sum(1 for v in ndvi_values if 0.1 <= v < 0.2)
        medium = sum(1 for v in ndvi_values if 0.2 <= v < 0.3)
        
        print(f"\n🎯 Distribuição por faixas:")
        print(f"   • NDVI < 0.1 (muito baixo): {very_low} pontos")
        print(f"   • NDVI 0.1-0.2 (baixo): {low} pontos")
        print(f"   • NDVI 0.2-0.3 (médio): {medium} pontos")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    print("🗺️  === Visualizador de GeoJSON - Versão Automática ===")
    print()
    
    try:
        # Analisar dados primeiro
        analyze_data()
        
        # Criar mapa completo
        print("\n🗺️  Criando mapa completo...")
        create_map_with_rivers_and_points()
        
        # Criar mapa simples
        print("\n🗺️  Criando mapa simples...")
        create_simple_map()
        
        print("\n✅ Processo concluído!")
        print("📁 Arquivos gerados:")
        print("   • mapa_visualizacao.html (mapa completo)")
        print("   • pontos_criticos_simples.html (apenas pontos)")
        print("\n💡 Abra os arquivos HTML no seu navegador para visualizar os mapas!")
        
    except FileNotFoundError as e:
        print(f"❌ Erro: Arquivo não encontrado - {e}")
        print("📁 Certifique-se de que os arquivos estão no diretório correto:")
        print("   • export.geojson")
        print("   • critical_points_sr (1).json")
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()
