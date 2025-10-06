#!/usr/bin/env python3
"""
Configuration for HLS Analysis
Centralized configuration file for customizing the analysis
"""

# =============================================================================
# HLS DATA SEARCH CONFIGURATIONS
# =============================================================================

# Analysis period
START_DATE = "2025-06-01"
END_DATE = "2025-09-30"

# Maximum cloud coverage (0-100%)
CLOUD_COVERAGE_MAX = 50

# HLS collections to be used
HLS_COLLECTIONS = [
    "hls2-l30",  # HLS Landsat 30m v2.0
    "hls2-s30"   # HLS Sentinel-2 30m v2.0
]

# =============================================================================
# NDVI PROCESSING CONFIGURATIONS
# =============================================================================

# Vegetation classification thresholds
NDVI_CRITICAL_THRESHOLD = 0.2   # Threshold for areas without vegetation or very sparse
NDVI_MODERATE_THRESHOLD = 0.5   # Threshold to separate sparse from dense vegetation

# Minimum valid pixels for analysis (fraction 0-1)
MIN_VALID_PIXELS = 0.05

# =============================================================================
# DEGRADATION ANALYSIS CONFIGURATIONS
# =============================================================================

# Riparian forest buffer in meters
BUFFER_DISTANCE = 200

# Specific river buffer in meters
BUFFER_DISTANCE_RIVER = 200

# =============================================================================
# CRITICAL POINTS GENERATION CONFIGURATIONS
# =============================================================================

# Minimum distance between critical points (meters)
MIN_DISTANCE_POINTS = 100

# Maximum points per severity category
MAX_POINTS_PER_SEVERITY = 50

# Sampling configurations
SAMPLING_STEP = 3

# =============================================================================
# EXPORT CONFIGURATIONS
# =============================================================================

# Output directory
OUTPUT_DIR = "."

# Output file names
GEOJSON_FILENAME = "critical_points_mata_ciliar.geojson"
GEOTIFF_FILENAME = "ndvi_mata_ciliar_wgs84_normalized.geotiff"
LOG_FILENAME = "processamento_notebook.log"


# =============================================================================
# CONFIGURATION FUNCTIONS
# =============================================================================

def get_config():
    """Returns all configurations as a dictionary"""
    return {
        'search': {
            'start_date': START_DATE,
            'end_date': END_DATE,
            'cloud_coverage_max': CLOUD_COVERAGE_MAX,
            'hls_collections': HLS_COLLECTIONS
        },
        'ndvi': {
            'critical_threshold': NDVI_CRITICAL_THRESHOLD,
            'moderate_threshold': NDVI_MODERATE_THRESHOLD,
            'min_valid_pixels': MIN_VALID_PIXELS
        },
        'degradation': {
            'buffer_distance': BUFFER_DISTANCE,
            'buffer_distance_river': BUFFER_DISTANCE_RIVER
        },
        'points': {
            'min_distance': MIN_DISTANCE_POINTS,
            'max_per_severity': MAX_POINTS_PER_SEVERITY,
            'sampling_step': SAMPLING_STEP
        },
        'export': {
            'output_dir': OUTPUT_DIR,
            'geojson_filename': GEOJSON_FILENAME,
            'geotiff_filename': GEOTIFF_FILENAME,
            'log_filename': LOG_FILENAME
        }
    }

def update_config(**kwargs):
    """Updates specific configurations"""
    global START_DATE, END_DATE, CLOUD_COVERAGE_MAX
    global NDVI_CRITICAL_THRESHOLD, NDVI_MODERATE_THRESHOLD
    global BUFFER_DISTANCE, BUFFER_DISTANCE_RIVER
    global MIN_DISTANCE_POINTS, MAX_POINTS_PER_SEVERITY
    global OUTPUT_DIR, GEOJSON_FILENAME, GEOTIFF_FILENAME, LOG_FILENAME
    
    # Update search configurations
    if 'start_date' in kwargs:
        START_DATE = kwargs['start_date']
    if 'end_date' in kwargs:
        END_DATE = kwargs['end_date']
    if 'cloud_coverage_max' in kwargs:
        CLOUD_COVERAGE_MAX = kwargs['cloud_coverage_max']
    
    # Update NDVI configurations
    if 'critical_threshold' in kwargs:
        NDVI_CRITICAL_THRESHOLD = kwargs['critical_threshold']
    if 'moderate_threshold' in kwargs:
        NDVI_MODERATE_THRESHOLD = kwargs['moderate_threshold']
    
    # Update buffer configurations
    if 'buffer_distance' in kwargs:
        BUFFER_DISTANCE = kwargs['buffer_distance']
    if 'buffer_distance_river' in kwargs:
        BUFFER_DISTANCE_RIVER = kwargs['buffer_distance_river']
    
    # Update points configurations
    if 'min_distance' in kwargs:
        MIN_DISTANCE_POINTS = kwargs['min_distance']
    if 'max_per_severity' in kwargs:
        MAX_POINTS_PER_SEVERITY = kwargs['max_per_severity']
    
    # Update export configurations
    if 'output_dir' in kwargs:
        OUTPUT_DIR = kwargs['output_dir']
    if 'geojson_filename' in kwargs:
        GEOJSON_FILENAME = kwargs['geojson_filename']
    if 'geotiff_filename' in kwargs:
        GEOTIFF_FILENAME = kwargs['geotiff_filename']
    if 'log_filename' in kwargs:
        LOG_FILENAME = kwargs['log_filename']

def print_config():
    """Prints current configurations"""
    config = get_config()
    
    print("🔧 CURRENT CONFIGURATIONS - HLS ANALYSIS")
    print("=" * 50)
    
    for section, settings in config.items():
        print(f"\n📋 {section.upper()}:")
        for key, value in settings.items():
            print(f"   {key}: {value}")

if __name__ == "__main__":
    print_config()
