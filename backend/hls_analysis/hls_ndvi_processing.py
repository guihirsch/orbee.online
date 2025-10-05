#!/usr/bin/env python3
"""
HLS NDVI Processing - Processamento NDVI com Máscaras de Qualidade
Funções para processamento de dados HLS e cálculo de NDVI
"""

import numpy as np
import xarray as xr
import rioxarray as rxr
import rasterio
from pyproj import Transformer
import planetary_computer as pc

# Configurações globais
NDVI_CRITICAL_THRESHOLD = 0.2
NDVI_MODERATE_THRESHOLD = 0.5
MIN_VALID_PIXELS = 0.05

def load_and_process_hls_data(item, aoi_bounds):
    """Carrega e processa dados HLS para cálculo NDVI"""
    
    print(f"📥 Processando item: {item.collection_id}")
    print(f"   📅 Data: {item.properties.get('datetime', 'N/A')[:10]}")
    print(f"   ☁️ Nuvens: {item.properties.get('eo:cloud_cover', 'N/A')}%")

    try:
        # Definir bandas necessárias para NDVI - HLS v2.0
        if "hls2-l30" in item.collection_id:  # HLS Landsat
            red_band = "B04"    # Red (665nm)
            nir_band = "B05"    # NIR (865nm) - Landsat usa B05 para NIR
            qa_band = "Fmask"   # Quality mask
            print(f"   🛰️ Tipo: HLS Landsat (L30)")
        else:  # HLS Sentinel-2
            red_band = "B04"    # Red (665nm)
            nir_band = "B08"    # NIR (842nm) - Sentinel-2 usa B08 para NIR
            qa_band = "Fmask"   # Quality mask
            print(f"   🛰️ Tipo: HLS Sentinel-2 (S30)")

        bands_to_load = [red_band, nir_band, qa_band]
        print(f"   📊 Bandas: {bands_to_load}")

        # Carregar dados HLS
        print(f"   📥 Carregando dados HLS...")

        # Determinar CRS dos dados HLS baseado no tile
        item_id = item.id
        print(f"   🗺️ Item ID: {item_id}")

        # Extrair zona UTM do tile HLS
        import re
        tile_match = re.search(r'T(\d{2})([A-Z])', item_id)

        if tile_match:
            zone_num = int(tile_match.group(1))
            lat_band = tile_match.group(2)

            if lat_band < 'N':
                hls_crs = f"EPSG:{32700 + zone_num}"
                hemisphere = "Sul"
            else:
                hls_crs = f"EPSG:{32600 + zone_num}"
                hemisphere = "Norte"

            print(f"   🌍 Zona UTM: {zone_num}{lat_band} ({hemisphere})")
        else:
            hls_crs = "EPSG:32722"
            print(f"   ⚠️ Usando CRS padrão: 22S")

        print(f"   🗺️ CRS detectado: {hls_crs}")

        # Carregar bandas individualmente
        print("   🔄 Carregando bandas individualmente...")
        band_arrays = {}

        for band in bands_to_load:
            print(f"      📊 Carregando banda {band}...")

            # Obter URL da banda
            band_asset = item.assets[band]
            band_url = band_asset.href

            # Assinar URL se necessário (Microsoft Planetary Computer)
            if 'planetarycomputer' in band_url:
                band_url = pc.sign(band_url)

            # Carregar com rioxarray
            try:
                band_data = rxr.open_rasterio(
                    band_url,
                    chunks={'x': 512, 'y': 512}  # Chunking para performance
                )

                # CORREÇÃO: Forçar reprojeção para o CRS correto se necessário
                if str(band_data.rio.crs) != hls_crs:
                    print(f"      🔄 Reprojetando {band} de {band_data.rio.crs} para {hls_crs}")
                    band_data = band_data.rio.reproject(hls_crs)
                    print(f"      ✅ {band} reprojetado para {hls_crs}")

                # Reprojetar para bounds se necessário
                if str(band_data.rio.crs) != "EPSG:4326":
                    # Reprojetar bounds para CRS da banda
                    transformer = Transformer.from_crs("EPSG:4326", band_data.rio.crs, always_xy=True)
                    minx_proj, miny_proj = transformer.transform(aoi_bounds[0], aoi_bounds[1])
                    maxx_proj, maxy_proj = transformer.transform(aoi_bounds[2], aoi_bounds[3])

                    # Recortar para AOI
                    band_data = band_data.rio.clip_box(minx_proj, miny_proj, maxx_proj, maxy_proj)
                else:
                    # Recortar diretamente
                    band_data = band_data.rio.clip_box(*aoi_bounds)

                band_arrays[band] = band_data.squeeze()
                print(f"      ✅ {band}: {band_data.shape}")

            except Exception as band_error:
                print(f"      ❌ Erro ao carregar {band}: {band_error}")
                raise band_error

        # Verificar se todas as bandas foram carregadas
        if len(band_arrays) != len(bands_to_load):
            raise Exception("Nem todas as bandas foram carregadas")

        # Extrair bandas individuais
        red = band_arrays[red_band]
        nir = band_arrays[nir_band]
        qa = band_arrays[qa_band]

        print(f"   ✅ Todas as bandas carregadas com sucesso!")
        print(f"   📐 Dimensões Red: {red.shape}")
        print(f"   📐 Dimensões NIR: {nir.shape}")
        print(f"   📐 Dimensões QA: {qa.shape}")
        print(f"   🗺️ CRS: {red.rio.crs}")

        # Aplicar escala HLS se necessário
        red_max = float(np.nanmax(red.values))
        nir_max = float(np.nanmax(nir.values))

        print(f"   📈 Valores máximos: Red={red_max:.3f}, NIR={nir_max:.3f}")

        # Se os valores estão acima de 1, aplicar escala (dados em 0-10000)
        if red_max > 1.5 or nir_max > 1.5:
            print("   🔢 Aplicando escala HLS (dividindo por 10000)...")
            red = red / 10000.0
            nir = nir / 10000.0

            # Verificar valores após escala
            red_scaled_max = float(np.nanmax(red.values))
            nir_scaled_max = float(np.nanmax(nir.values))
            print(f"   📊 Valores após escala: Red={red_scaled_max:.3f}, NIR={nir_scaled_max:.3f}")
        else:
            print("   ✅ Dados já estão em escala de reflectância (0-1)")

        # Verificar se há valores válidos nas bandas
        red_valid = np.sum(np.isfinite(red.values) & (red.values > 0))
        nir_valid = np.sum(np.isfinite(nir.values) & (nir.values > 0))
        print(f"   📊 Pixels com valores válidos: Red={red_valid}, NIR={nir_valid}")

        # Aplicar máscara de qualidade (Fmask HLS)
        print("   🎭 Aplicando máscara de qualidade...")

        # Investigar os valores da máscara QA
        qa_unique = np.unique(qa.values)
        qa_counts = {val: int(np.sum(qa.values == val)) for val in qa_unique}
        print(f"   📊 Valores únicos na máscara QA: {qa_unique}")
        print(f"   📈 Contagem por valor: {qa_counts}")

        # Máscara mais permissiva inicialmente para diagnóstico
        valid_mask = (qa == 0) | (qa == 1) | (qa == 2)

        # Se ainda não há pixels válidos, ser ainda mais permissivo
        valid_pixels_count = int(np.sum(valid_mask.values))
        print(f"   🔍 Pixels válidos com máscara padrão: {valid_pixels_count}")

        if valid_pixels_count == 0:
            print("   ⚠️ Nenhum pixel válido com máscara padrão, tentando máscara mais permissiva...")
            valid_mask = (qa != 255) & (qa != 4)
            valid_pixels_count = int(np.sum(valid_mask.values))
            print(f"   🔍 Pixels válidos com máscara permissiva: {valid_pixels_count}")

        if valid_pixels_count == 0:
            print("   ⚠️ Ainda sem pixels válidos, usando todos os pixels para diagnóstico...")
            valid_mask = qa >= 0  # Todos os pixels
            valid_pixels_count = int(np.sum(valid_mask.values))
            print(f"   🔍 Total de pixels: {valid_pixels_count}")

        # Calcular NDVI
        print("   🧮 Calculando NDVI...")
        denominator = nir + red

        # Criar máscara combinada de forma segura
        print("   🎭 Criando máscara combinada...")

        # Componentes da máscara
        denom_ok = (denominator != 0)
        red_ok = (red >= 0) & np.isfinite(red)
        nir_ok = (nir >= 0) & np.isfinite(nir)

        # Diagnósticos das máscaras
        print(f"   📊 Diagnóstico das máscaras:")
        print(f"      - Denominador OK: {int(np.sum(denom_ok.values))}")
        print(f"      - Red OK: {int(np.sum(red_ok.values))}")
        print(f"      - NIR OK: {int(np.sum(nir_ok.values))}")
        print(f"      - QA válido: {valid_pixels_count}")

        # Máscara combinada
        combined_mask = denom_ok & valid_mask & red_ok & nir_ok
        combined_valid = int(np.sum(combined_mask.values))
        print(f"      - Máscara combinada: {combined_valid}")

        # Calcular NDVI com máscara segura
        ndvi = xr.where(
            combined_mask,
            (nir - red) / denominator,
            np.nan
        )

        # Se ainda não há pixels válidos, tentar NDVI sem máscara QA
        if combined_valid == 0:
            print("   🔄 Tentando NDVI sem máscara de qualidade...")
            simple_mask = denom_ok & red_ok & nir_ok
            simple_valid = int(np.sum(simple_mask.values))
            print(f"   📊 Pixels válidos sem QA: {simple_valid}")

            if simple_valid > 0:
                ndvi = xr.where(
                    simple_mask,
                    (nir - red) / denominator,
                    np.nan
                )
                combined_valid = simple_valid

        # Estatísticas
        valid_pixels = np.sum(~np.isnan(ndvi.values))
        total_pixels = ndvi.size
        valid_fraction = valid_pixels / total_pixels

        print(f"   📊 Estatísticas NDVI:")
        print(f"      - Pixels válidos: {valid_pixels:,} ({valid_fraction:.1%})")
        print(f"      - NDVI min: {np.nanmin(ndvi.values):.3f}")
        print(f"      - NDVI max: {np.nanmax(ndvi.values):.3f}")
        print(f"      - NDVI médio: {np.nanmean(ndvi.values):.3f}")

        # Critério mais flexível para áreas pequenas
        min_threshold = min(MIN_VALID_PIXELS, 0.01)  # Pelo menos 1% ou o mínimo configurado

        if valid_fraction < min_threshold:
            print(f"   ⚠️ Poucos pixels válidos ({valid_fraction:.1%} < {min_threshold:.1%})")

            # Se há pelo menos alguns pixels, continuar mesmo assim
            if valid_pixels > 10:  # Pelo menos 10 pixels
                print(f"   💡 Continuando com {valid_pixels} pixels para análise...")
            else:
                print(f"   ❌ Insuficiente para análise (apenas {valid_pixels} pixels)")
                return None

        return {
            'ndvi': ndvi,
            'red': red,
            'nir': nir,
            'qa': qa,
            'valid_mask': valid_mask,
            'valid_fraction': valid_fraction,
            'item': item,
            'stats': {
                'min': float(np.nanmin(ndvi.values)),
                'max': float(np.nanmax(ndvi.values)),
                'mean': float(np.nanmean(ndvi.values)),
                'std': float(np.nanstd(ndvi.values)),
                'valid_pixels': int(valid_pixels),
                'total_pixels': int(total_pixels)
            }
        }

    except Exception as e:
        print(f"   ❌ Erro no processamento: {e}")
        return None

def create_ndvi_composite(processed_items):
    """Cria composição NDVI a partir de múltiplos itens"""
    
    if not processed_items:
        return None

    print(f"\n🎨 Criando composição NDVI de {len(processed_items)} itens...")

    # Se apenas um item, retornar diretamente
    if len(processed_items) == 1:
        return processed_items[0]

    # Múltiplos itens: criar composição baseada na qualidade
    ndvi_arrays = []
    weights = []

    for item_data in processed_items:
        ndvi_arrays.append(item_data['ndvi'])
        # Peso baseado na fração de pixels válidos
        weights.append(item_data['valid_fraction'])

    # Composição ponderada
    ndvi_stack = xr.concat(ndvi_arrays, dim='time')
    weights_array = xr.DataArray(weights, dims=['time'])

    # Média ponderada ignorando NaN
    composite_ndvi = ndvi_stack.weighted(weights_array).mean(dim='time', skipna=True)

    print("✅ Composição NDVI criada")
    print(f"   📊 NDVI final min: {np.nanmin(composite_ndvi.values):.3f}")
    print(f"   📊 NDVI final max: {np.nanmax(composite_ndvi.values):.3f}")
    print(f"   📊 NDVI final médio: {np.nanmean(composite_ndvi.values):.3f}")

    return {
        'ndvi': composite_ndvi,
        'source_items': processed_items,
        'stats': {
            'min': float(np.nanmin(composite_ndvi.values)),
            'max': float(np.nanmax(composite_ndvi.values)),
            'mean': float(np.nanmean(composite_ndvi.values)),
            'std': float(np.nanstd(composite_ndvi.values))
        }
    }
