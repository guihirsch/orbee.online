"""
HLS Analysis Package - Análise de Mata Ciliar com Dados HLS
Pacote para análise de degradação da mata ciliar usando dados HLS (Harmonized Landsat Sentinel)

Módulos principais:
- hls_analysis: Busca e carregamento de dados HLS
- hls_ndvi_processing: Processamento de dados NDVI
- hls_degradation_analysis: Análise de degradação da mata ciliar
- hls_export: Exportação de resultados
- hls_complete_analysis: Script principal integrado

Dependências:
- Microsoft Planetary Computer API
- OpenStreetMap (via OSMnx)
- Dados reais de satélites Landsat e Sentinel-2
"""

__version__ = "1.0.0"
__author__ = "Orbee Online Team"
__description__ = "Análise de Mata Ciliar com Dados HLS"

# Imports principais para facilitar o uso
from .hls_analysis import (
    check_hls_coverage,
    load_aoi_data,
    search_hls_data,
    select_best_item,
    convert_numpy_types
)

from .hls_ndvi_processing import (
    load_and_process_hls_data,
    create_ndvi_composite
)

from .hls_degradation_analysis import (
    analyze_riparian_forest_degradation,
    load_river_geometry_for_buffer,
    generate_points_from_real_ndvi
)

from .hls_export import (
    ensure_output_directory,
    export_geojson_results,
    export_geotiff_results,
    create_processing_log,
    validate_ndvi_consistency
)

# Importar o script principal
from . import hls_complete_analysis

__all__ = [
    # hls_analysis
    'check_hls_coverage',
    'load_aoi_data', 
    'search_hls_data',
    'select_best_item',
    'convert_numpy_types',
    
    # hls_ndvi_processing
    'load_and_process_hls_data',
    'create_ndvi_composite',
    
    # hls_degradation_analysis
    'analyze_riparian_forest_degradation',
    'load_river_geometry_for_buffer',
    'generate_points_from_real_ndvi',
    
    # hls_export
    'ensure_output_directory',
    'export_geojson_results',
    'export_geotiff_results',
    'create_processing_log',
    'validate_ndvi_consistency'
]
