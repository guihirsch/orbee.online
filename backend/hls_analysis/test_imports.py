#!/usr/bin/env python3
"""
Teste de Importação dos Módulos HLS
"""

import sys
import os
from pathlib import Path

# Adicionar o diretório atual ao path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def test_imports():
    """Testa a importação de todos os módulos"""
    
    print("Testando importacao dos modulos HLS...")
    print("=" * 50)
    
    try:
        # Testar importação individual dos módulos
        print("1. Testando hls_analysis...")
        from hls_analysis import check_hls_coverage, load_aoi_data
        print("   OK - hls_analysis importado")
        
        print("2. Testando hls_ndvi_processing...")
        from hls_ndvi_processing import load_and_process_hls_data
        print("   OK - hls_ndvi_processing importado")
        
        print("3. Testando hls_degradation_analysis...")
        from hls_degradation_analysis import analyze_riparian_forest_degradation
        print("   OK - hls_degradation_analysis importado")
        
        print("4. Testando hls_export...")
        from hls_export import export_geojson_results
        print("   OK - hls_export importado")
        
        print("5. Testando hls_complete_analysis...")
        from hls_complete_analysis import main
        print("   OK - hls_complete_analysis importado")
        
        print("\n" + "=" * 50)
        print("SUCESSO: Todos os modulos foram importados corretamente!")
        print("A organizacao do projeto esta funcionando.")
        
        return True
        
    except Exception as e:
        print(f"\nERRO: Falha na importacao: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
