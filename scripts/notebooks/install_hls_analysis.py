#!/usr/bin/env python3
"""
Instalador para HLS Analysis
Script para instalar dependências e configurar o ambiente
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Verifica se a versão do Python é compatível"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 ou superior é necessário")
        print(f"   Versão atual: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatível")
    return True

def check_pip():
    """Verifica se pip está disponível"""
    try:
        import pip
        print("✅ pip disponível")
        return True
    except ImportError:
        print("❌ pip não encontrado")
        print("💡 Instale pip: https://pip.pypa.io/en/stable/installation/")
        return False

def install_requirements():
    """Instala as dependências do requirements_hls.txt"""
    requirements_file = "requirements_hls.txt"
    
    if not os.path.exists(requirements_file):
        print(f"❌ Arquivo {requirements_file} não encontrado")
        return False
    
    print(f"📦 Instalando dependências de {requirements_file}...")
    
    try:
        # Comando de instalação
        cmd = [sys.executable, "-m", "pip", "install", "-r", requirements_file]
        
        # Executar instalação
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Dependências instaladas com sucesso!")
            return True
        else:
            print("❌ Erro na instalação das dependências:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Erro ao executar instalação: {e}")
        return False

def install_individual_packages():
    """Instala pacotes individuais como fallback"""
    packages = [
        "pystac-client>=0.7.0",
        "planetary-computer>=0.4.0",
        "rasterio>=1.3.0",
        "rioxarray>=0.15.0",
        "geopandas>=0.13.0",
        "shapely>=2.0.0",
        "matplotlib>=3.6.0",
        "numpy>=1.21.0",
        "pandas>=1.5.0",
        "requests>=2.28.0",
        "stackstac>=0.4.0",
        "xarray>=2022.12.0",
        "dask>=2022.12.0",
        "pyproj>=3.4.0"
    ]
    
    print("📦 Instalando pacotes individuais...")
    
    for package in packages:
        try:
            print(f"   Instalando {package}...")
            cmd = [sys.executable, "-m", "pip", "install", package]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"   ✅ {package} instalado")
            else:
                print(f"   ❌ Erro ao instalar {package}")
                print(f"      {result.stderr}")
                
        except Exception as e:
            print(f"   ❌ Erro ao instalar {package}: {e}")

def verify_installation():
    """Verifica se as dependências foram instaladas corretamente"""
    print("\n🔍 Verificando instalação...")
    
    required_modules = [
        "pystac_client",
        "planetary_computer", 
        "rasterio",
        "rioxarray",
        "geopandas",
        "shapely",
        "matplotlib",
        "numpy",
        "pandas",
        "requests",
        "stackstac",
        "xarray",
        "dask",
        "pyproj"
    ]
    
    installed = []
    failed = []
    
    for module in required_modules:
        try:
            __import__(module)
            installed.append(module)
            print(f"   ✅ {module}")
        except ImportError:
            failed.append(module)
            print(f"   ❌ {module}")
    
    print(f"\n📊 Resultado da verificação:")
    print(f"   ✅ Instalados: {len(installed)}")
    print(f"   ❌ Falharam: {len(failed)}")
    
    if failed:
        print(f"\n⚠️ Módulos que falharam: {', '.join(failed)}")
        print("💡 Tente instalar manualmente:")
        for module in failed:
            print(f"   pip install {module}")
        return False
    else:
        print("\n🎉 Todas as dependências foram instaladas com sucesso!")
        return True

def create_test_script():
    """Cria um script de teste para verificar a instalação"""
    test_script = """#!/usr/bin/env python3
\"\"\"
Script de teste para verificar instalação do HLS Analysis
\"\"\"

def test_imports():
    \"\"\"Testa se todos os módulos podem ser importados\"\"\"
    try:
        import pystac_client
        import planetary_computer
        import rasterio
        import rioxarray
        import geopandas
        import shapely
        import matplotlib
        import numpy
        import pandas
        import requests
        import stackstac
        import xarray
        import dask
        import pyproj
        
        print("✅ Todos os módulos importados com sucesso!")
        return True
        
    except ImportError as e:
        print(f"❌ Erro ao importar módulo: {e}")
        return False

def test_basic_functionality():
    \"\"\"Testa funcionalidade básica\"\"\"
    try:
        import numpy as np
        import geopandas as gpd
        from shapely.geometry import Point
        
        # Teste básico de numpy
        arr = np.array([1, 2, 3])
        print(f"✅ NumPy funcionando: {arr.sum()}")
        
        # Teste básico de geopandas
        gdf = gpd.GeoDataFrame([1], geometry=[Point(0, 0)], crs='EPSG:4326')
        print(f"✅ GeoPandas funcionando: {len(gdf)} geometrias")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na funcionalidade básica: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testando instalação do HLS Analysis...")
    
    imports_ok = test_imports()
    functionality_ok = test_basic_functionality()
    
    if imports_ok and functionality_ok:
        print("\\n🎉 Instalação verificada com sucesso!")
        print("💡 Você pode agora executar: python hls_complete_analysis.py")
    else:
        print("\\n❌ Problemas encontrados na instalação")
        print("💡 Verifique os erros acima e reinstale se necessário")
"""
    
    with open("test_installation.py", "w", encoding='utf-8') as f:
        f.write(test_script)
    
    print("📄 Script de teste criado: test_installation.py")

def main():
    """Função principal do instalador"""
    print("🚀 INSTALADOR HLS ANALYSIS")
    print("=" * 50)
    print("Este script instala as dependências necessárias")
    print("para executar a análise de mata ciliar com dados HLS.")
    print("=" * 50)
    
    # Verificar Python
    if not check_python_version():
        return False
    
    # Verificar pip
    if not check_pip():
        return False
    
    # Instalar dependências
    print("\n📦 INSTALAÇÃO DE DEPENDÊNCIAS")
    print("-" * 30)
    
    # Tentar instalar do requirements.txt primeiro
    if os.path.exists("requirements_hls.txt"):
        success = install_requirements()
        if not success:
            print("\n⚠️ Instalação do requirements.txt falhou, tentando pacotes individuais...")
            install_individual_packages()
    else:
        print("⚠️ requirements_hls.txt não encontrado, instalando pacotes individuais...")
        install_individual_packages()
    
    # Verificar instalação
    print("\n🔍 VERIFICAÇÃO DA INSTALAÇÃO")
    print("-" * 30)
    installation_ok = verify_installation()
    
    # Criar script de teste
    print("\n📄 CRIANDO SCRIPT DE TESTE")
    print("-" * 30)
    create_test_script()
    
    # Resumo final
    print("\n🎯 RESUMO DA INSTALAÇÃO")
    print("=" * 50)
    
    if installation_ok:
        print("✅ Instalação concluída com sucesso!")
        print("\n📋 Próximos passos:")
        print("1. Execute o teste: python test_installation.py")
        print("2. Execute a análise: python hls_complete_analysis.py")
        print("3. Consulte o README_HLS_PYTHON.md para mais informações")
    else:
        print("❌ Instalação incompleta")
        print("\n💡 Soluções:")
        print("1. Verifique os erros acima")
        print("2. Instale dependências manualmente")
        print("3. Execute: python test_installation.py")
        print("4. Consulte a documentação para troubleshooting")
    
    print("\n📚 Documentação:")
    print("   - README_HLS_PYTHON.md")
    print("   - example_usage.py")
    print("   - test_installation.py")
    
    return installation_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
