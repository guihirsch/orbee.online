"""
HLS Analysis Package - Riparian Forest Analysis with HLS Data
Package for riparian forest degradation analysis using HLS (Harmonized Landsat Sentinel) data

Main modules:
- hls_analysis: HLS data search and loading
- hls_ndvi_processing: NDVI data processing
- hls_degradation_analysis: Riparian forest degradation analysis
- hls_export: Results export
- hls_complete_analysis: Main integrated script

Dependencies:
- Microsoft Planetary Computer API
- OpenStreetMap (via OSMnx)
- Real Landsat and Sentinel-2 satellite data
"""

__version__ = "1.0.0"
__author__ = "Orbee Online Team"
__description__ = "Riparian Forest Analysis with HLS Data"

# Main imports for easy usage
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

# Import main script
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
