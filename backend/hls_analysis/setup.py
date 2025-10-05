#!/usr/bin/env python3
"""
Setup Script para HLS Analysis
Configura e instala dependencias necessarias
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Instala as dependencias do requirements_hls.txt"""
    
    print("Instalando dependencias do HLS Analysis...")
    print("=" * 50)
    
    try:
        # Verificar se o arquivo requirements existe
        requirements_file = Path(__file__).parent / "requirements_hls.txt"
        
        if not requirements_file.exists():
            print("ERRO: Arquivo requirements_hls.txt nao encontrado!")
            return False
        
        # Instalar dependencias
        result = subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("SUCESSO: Dependencias instaladas com sucesso!")
            return True
        else:
            print(f"ERRO: Falha na instalacao das dependencias:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"ERRO: Excecao durante instalacao: {e}")
        return False

def test_installation():
    """Testa se a instalacao foi bem-sucedida"""
    
    print("\nTestando instalacao...")
    print("-" * 30)
    
    try:
        # Testar imports principais
        import pystac_client
        import planetary_computer
        import osmnx
        import rioxarray
        import geopandas
        import rasterio
        
        print("OK - Todas as dependencias principais estao disponiveis")
        return True
        
    except ImportError as e:
        print(f"ERRO: Dependencia nao encontrada: {e}")
        return False

def main():
    """Funcao principal do setup"""
    
    print("HLS Analysis - Setup e Configuracao")
    print("=" * 50)
    
    # Instalar dependencias
    if not install_requirements():
        print("\nFALHA: Nao foi possivel instalar as dependencias")
        sys.exit(1)
    
    # Testar instalacao
    if not test_installation():
        print("\nFALHA: Instalacao nao foi bem-sucedida")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("SUCESSO: HLS Analysis configurado com sucesso!")
    print("\nPara executar a analise:")
    print("  python run_simple.py")
    print("\nPara testar os modulos:")
    print("  python test_imports.py")

if __name__ == "__main__":
    main()
