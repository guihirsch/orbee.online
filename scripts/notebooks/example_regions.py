#!/usr/bin/env python3
"""
Exemplo de configuração de regiões para o HLS Complete Analysis
Este arquivo mostra como configurar diferentes regiões para análise
"""

# Exemplos de regiões válidas para análise HLS
REGIONS_EXAMPLES = {
    "Sinimbu, Rio Grande do Sul, Brasil": {
        "description": "Município de Sinimbu no RS - região rural com rios mapeados",
        "expected_rivers": ["Rio Pardinho", "Rio Pardo", "Rio Pequeno"],
        "buffer_distance": 200,
        "notes": "Região bem mapeada no OSM, boa cobertura HLS"
    },
    
    "Caxias do Sul, Rio Grande do Sul, Brasil": {
        "description": "Maior cidade da serra gaúcha",
        "expected_rivers": ["Rio das Antas", "Rio Carreiro"],
        "buffer_distance": 300,
        "notes": "Região urbana, pode ter menos rios mapeados"
    },
    
    "Porto Alegre, Rio Grande do Sul, Brasil": {
        "description": "Capital do Rio Grande do Sul",
        "expected_rivers": ["Rio Guaíba", "Rio Jacuí", "Rio dos Sinos"],
        "buffer_distance": 500,
        "notes": "Região metropolitana, muitos rios mapeados"
    },
    
    "São Paulo, São Paulo, Brasil": {
        "description": "Maior cidade do Brasil",
        "expected_rivers": ["Rio Tietê", "Rio Pinheiros", "Rio Tamanduateí"],
        "buffer_distance": 400,
        "notes": "Região altamente urbanizada, rios poluídos"
    },
    
    "Brasília, Distrito Federal, Brasil": {
        "description": "Capital do Brasil",
        "expected_rivers": ["Rio Paranoá", "Rio Descoberto"],
        "buffer_distance": 300,
        "notes": "Região do cerrado, boa cobertura HLS"
    },
    
    "Manaus, Amazonas, Brasil": {
        "description": "Capital do Amazonas",
        "expected_rivers": ["Rio Negro", "Rio Solimões", "Rio Amazonas"],
        "buffer_distance": 1000,
        "notes": "Região amazônica, muitos rios, cobertura HLS limitada por nuvens"
    }
}

def print_region_examples():
    """Imprime exemplos de regiões configuradas"""
    print("🌍 EXEMPLOS DE REGIÕES PARA ANÁLISE HLS")
    print("=" * 60)
    
    for region, info in REGIONS_EXAMPLES.items():
        print(f"\n📍 {region}")
        print(f"   📝 {info['description']}")
        print(f"   🌊 Rios esperados: {', '.join(info['expected_rivers'])}")
        print(f"   📏 Buffer sugerido: {info['buffer_distance']}m")
        print(f"   💡 {info['notes']}")

def get_region_config(region_name):
    """Retorna configuração para uma região específica"""
    if region_name in REGIONS_EXAMPLES:
        return REGIONS_EXAMPLES[region_name]
    else:
        return {
            "description": "Região personalizada",
            "expected_rivers": ["Rios a serem descobertos"],
            "buffer_distance": 200,
            "notes": "Configure conforme necessário"
        }

if __name__ == "__main__":
    print_region_examples()
    
    print("\n" + "="*60)
    print("💡 COMO USAR:")
    print("1. Copie a região desejada")
    print("2. Cole na variável REGION_NAME em hls_complete_analysis.py")
    print("3. Execute: python hls_complete_analysis.py")
    print("4. O script buscará automaticamente os rios da região")
    print("5. Filtrará apenas rios dentro dos limites administrativos")
    print("6. Gerará pontos críticos de degradação da mata ciliar")
