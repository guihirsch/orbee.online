#!/usr/bin/env python3
"""
Script Principal para Execução da Análise HLS
Executa a análise completa de mata ciliar com dados HLS
"""

import sys
import os
from pathlib import Path

# Adicionar o diretório atual ao path para imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Importar e executar a análise completa
from hls_complete_analysis import main

if __name__ == "__main__":
    print("Iniciando Analise HLS de Mata Ciliar")
    print("=" * 50)
    print(f"Diretorio de trabalho: {current_dir}")
    print(f"Regiao configurada: Sinimbu, Rio Grande do Sul, Brasil")
    print("=" * 50)
    
    try:
        main()
    except KeyboardInterrupt:
        print("\nAnalise interrompida pelo usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\nErro durante a analise: {e}")
        sys.exit(1)
