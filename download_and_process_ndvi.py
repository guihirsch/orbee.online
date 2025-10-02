#!/usr/bin/env python3
"""
Script para processar arquivo NDVI do Colab e preparar para AOIViewer
"""

import os
import shutil

def main():
    print("🔄 Processando arquivo NDVI para AOIViewer...")
    
    # Verificar se existe arquivo na pasta atual (baixado do Colab)
    # PRIORIZAR arquivo SEM normalização para manter valores originais
    possible_files = [
        "ndvi_mata_ciliar_wgs84.geotiff",  # Arquivo WGS84 original (SEM normalização)
        "ndvi_mata_ciliar.geotiff",        # Arquivo original (SEM normalização)
        "ndvi_mata_ciliar_wgs84_normalized.geotiff"  # Último recurso (normalizado)
    ]
    
    source_file = None
    for filename in possible_files:
        if os.path.exists(filename):
            source_file = filename
            break
    
    if not source_file:
        print("❌ Nenhum arquivo NDVI encontrado!")
        print("📋 Instruções:")
        print("1. No Google Colab, execute as células 1-13 (SEM executar célula 15)")
        print("2. Baixe o arquivo 'ndvi_mata_ciliar_wgs84.geotiff' (SEM normalização)")
        print("3. Coloque o arquivo na pasta raiz do projeto")
        print("4. Execute este script novamente")
        print("⚠️  IMPORTANTE: Use o arquivo SEM normalização para manter cores originais!")
        return False
    
    print(f"📁 Arquivo encontrado: {source_file}")
    
    # Verificar se pasta public existe
    if not os.path.exists("public"):
        print("❌ Pasta 'public' não encontrada!")
        return False
    
    # Copiar arquivo para public com nome correto
    target_file = "public/ndvi_mosaic_super_resolved.tif"
    
    try:
        shutil.copy2(source_file, target_file)
        print(f"✅ Arquivo copiado com sucesso!")
        print(f"   Origem: {source_file}")
        print(f"   Destino: {target_file}")
        
        # Verificar tamanho
        file_size = os.path.getsize(target_file) / (1024*1024)
        print(f"📊 Tamanho: {file_size:.2f} MB")
        
        print("\n🎉 SUCESSO! Arquivo pronto para o AOIViewer!")
        print("🌐 Acesse: http://localhost:3000/aoi-viewer")
        print("🎨 Ative a camada NDVI no controle lateral")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao copiar arquivo: {e}")
        return False

if __name__ == "__main__":
    main()
