#!/usr/bin/env python3
"""
Script Principal para Execução da Análise HLS
Executa a análise completa de mata ciliar com dados HLS
Inclui correção automática das distâncias do rio
"""

import sys
import os
from pathlib import Path

# Adicionar o diretório atual ao path para imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Importar e executar a análise completa
from hls_complete_analysis import main
from river_distance_fixer import ensure_river_distances_correct

if __name__ == "__main__":
    print("Iniciando Analise HLS de Mata Ciliar")
    print("=" * 50)
    print(f"Diretorio de trabalho: {current_dir}")
    print(f"Regiao configurada: Sinimbu, Rio Grande do Sul, Brasil")
    print("=" * 50)
    
    try:
        # Executar análise principal
        main()
        
        # Verificar e corrigir distâncias do rio se necessário
        geojson_path = "critical_points_mata_ciliar.geojson"
        if os.path.exists(geojson_path):
            print("\n🔧 Verificando distâncias do rio...")
            ensure_river_distances_correct(geojson_path)
            
            # Copiar para frontend se correção foi bem-sucedida
            frontend_path = "../../frontend/public/critical_points_mata_ciliar.geojson"
            try:
                import shutil
                shutil.copy2(geojson_path, frontend_path)
                print(f"✅ Arquivo atualizado copiado para frontend: {frontend_path}")
            except Exception as e:
                print(f"⚠️ Erro ao copiar para frontend: {e}")
        
    except KeyboardInterrupt:
        print("\nAnalise interrompida pelo usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\nErro durante a analise: {e}")
        sys.exit(1)
