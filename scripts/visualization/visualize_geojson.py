#!/usr/bin/env python3
"""
Script para visualizar dados GeoJSON no mapa
Suporta tanto o arquivo export.geojson (rios) quanto critical_points_sr.json (pontos críticos)
"""

import json
import folium
import geopandas as gpd
from shapely.geometry import Point
import numpy as np

def load_geojson(file_path):
    """Carrega arquivo GeoJSON"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_map_with_rivers_and_points():
    """Cria mapa com rios e pontos críticos"""
    
    # Carregar dados
    print("Carregando dados...")
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
    
    print(f"Centro do mapa: {center_lat:.6f}, {center_lon:.6f}")
    print(f"Total de pontos críticos: {len(critical_points_data['features'])}")
    
    # Criar mapa
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=12,
        tiles='OpenStreetMap'
    )
    
    # Adicionar rios
    print("Adicionando rios ao mapa...")
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
    print("Adicionando pontos críticos ao mapa...")
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
    print(f"Mapa salvo como: {output_file}")
    
    return m

def create_simple_map():
    """Cria um mapa mais simples apenas com pontos críticos"""
    
    # Carregar pontos críticos
    with open("critical_points_sr (1).json", 'r') as f:
        data = json.load(f)
    
    # Calcular centro
    lats = [feature['geometry']['coordinates'][1] for feature in data['features']]
    lons = [feature['geometry']['coordinates'][0] for feature in data['features']]
    center_lat = np.mean(lats)
    center_lon = np.mean(lons)
    
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
    m.save("pontos_criticos_simples.html")
    print("Mapa simples salvo como: pontos_criticos_simples.html")

if __name__ == "__main__":
    print("=== Visualizador de GeoJSON ===")
    print("1. Mapa completo (rios + pontos críticos)")
    print("2. Mapa simples (apenas pontos críticos)")
    
    try:
        choice = input("Escolha uma opção (1 ou 2): ").strip()
        
        if choice == "1":
            create_map_with_rivers_and_points()
        elif choice == "2":
            create_simple_map()
        else:
            print("Opção inválida. Criando mapa completo...")
            create_map_with_rivers_and_points()
            
    except FileNotFoundError as e:
        print(f"Erro: Arquivo não encontrado - {e}")
        print("Certifique-se de que os arquivos estão no diretório correto:")
        print("- export.geojson")
        print("- critical_points_sr (1).json")
    except Exception as e:
        print(f"Erro: {e}")
