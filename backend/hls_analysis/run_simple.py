#!/usr/bin/env python3
"""
Script Simples para Execucao da Analise HLS
Versao sem emojis para compatibilidade com Windows
Inclui correcao automatica das distancias do rio
"""

import sys
import os
from pathlib import Path

# Adicionar o diretorio atual ao path para imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def main():
    """Executa a analise HLS"""
    
    print("=" * 60)
    print("HLS Complete Analysis - Analise de Mata Ciliar")
    print("Processamento de dados HLS (Harmonized Landsat Sentinel)")
    print("Foco: Deteccao de degradacao em mata ciliar")
    print("=" * 60)
    
    print(f"Diretorio de trabalho: {current_dir}")
    print("Regiao configurada: Sinimbu, Rio Grande do Sul, Brasil")
    print("")
    
    try:
        # Importar e executar a analise completa
        from hls_complete_analysis import main as run_analysis
        run_analysis()
        
        # Verificar e corrigir distancias do rio se necessario
        geojson_path = "critical_points_mata_ciliar.geojson"
        if os.path.exists(geojson_path):
            print("\nVerificando distancias do rio...")
            try:
                from river_distance_fixer import ensure_river_distances_correct
                ensure_river_distances_correct(geojson_path)
                
                # Copiar para frontend se correcao foi bem-sucedida
                frontend_path = "../../frontend/public/critical_points_mata_ciliar.geojson"
                try:
                    import shutil
                    shutil.copy2(geojson_path, frontend_path)
                    print(f"Arquivo atualizado copiado para frontend: {frontend_path}")
                    
                    # Importar dados para o banco de dados
                    try:
                        import sys
                        sys.path.append("../../backend")
                        from app.utils.hls_data_import import import_geojson_to_database
                        
                        print("\nImportando dados para o banco de dados...")
                        result = import_geojson_to_database(geojson_path)
                        print(f"✅ Dados importados com sucesso:")
                        print(f"   - Pontos criados: {result['created_count']}")
                        print(f"   - Pontos pulados: {result['skipped_count']}")
                        print(f"   - Data da análise: {result['analysis_date']}")
                        
                    except Exception as e:
                        print(f"⚠️ Erro ao importar para banco de dados: {e}")
                        print("   Os dados foram salvos no GeoJSON, mas não foram importados para o banco")
                        
                except Exception as e:
                    print(f"Erro ao copiar para frontend: {e}")
                    
            except Exception as e:
                print(f"Erro ao corrigir distancias do rio: {e}")
        
    except KeyboardInterrupt:
        print("\nAnalise interrompida pelo usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\nErro durante a analise: {e}")
        print("Verifique se todas as dependencias estao instaladas:")
        print("pip install -r requirements_hls.txt")
        sys.exit(1)

if __name__ == "__main__":
    main()
