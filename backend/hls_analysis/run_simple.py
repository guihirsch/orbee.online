#!/usr/bin/env python3
"""
Script Simples para Execucao da Analise HLS
Versao sem emojis para compatibilidade com Windows
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
