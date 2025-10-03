#!/usr/bin/env python3
"""
Script de teste para verificar instalação do HLS Analysis
"""

def test_imports():
    """Testa se todos os módulos podem ser importados"""
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
    """Testa funcionalidade básica"""
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
        print("\n🎉 Instalação verificada com sucesso!")
        print("💡 Você pode agora executar: python hls_complete_analysis.py")
    else:
        print("\n❌ Problemas encontrados na instalação")
        print("💡 Verifique os erros acima e reinstale se necessário")
