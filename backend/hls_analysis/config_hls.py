#!/usr/bin/env python3
"""
Configurações para HLS Analysis
Arquivo centralizado de configurações para personalizar a análise
"""

# =============================================================================
# CONFIGURAÇÕES DE BUSCA DE DADOS HLS
# =============================================================================

# Período de análise
START_DATE = "2022-06-01"
END_DATE = "2022-09-30"

# Cobertura máxima de nuvens (0-100%)
CLOUD_COVERAGE_MAX = 50

# Coleções HLS a serem utilizadas
HLS_COLLECTIONS = [
    "hls2-l30",  # HLS Landsat 30m v2.0
    "hls2-s30"   # HLS Sentinel-2 30m v2.0
]

# Máximo de itens HLS a serem processados
MAX_HLS_ITEMS = 3

# =============================================================================
# CONFIGURAÇÕES DE PROCESSAMENTO NDVI
# =============================================================================

# Thresholds de classificação de vegetação
NDVI_CRITICAL_THRESHOLD = 0.2   # Limite para áreas sem vegetação ou muito ralas
NDVI_MODERATE_THRESHOLD = 0.5   # Limite para separar vegetação esparsa de densa

# Mínimo de pixels válidos para análise (fração 0-1)
MIN_VALID_PIXELS = 0.05

# Configurações de escala HLS
HLS_SCALE_FACTOR = 10000.0  # Fator para converter valores HLS para reflectância

# =============================================================================
# CONFIGURAÇÕES DE ANÁLISE DE DEGRADAÇÃO
# =============================================================================

# Buffer de mata ciliar em metros
BUFFER_DISTANCE = 200

# Buffer específico do rio em metros
BUFFER_DISTANCE_RIVER = 200

# Configurações de classificação de status geral
STATUS_THRESHOLDS = {
    'severely_degraded': 0.3,    # Fração crítica > 30%
    'moderately_degraded': 0.1,  # Fração crítica > 10% OU moderada > 40%
    'at_risk': 0.2,              # Fração moderada > 20%
    'healthy': 0.0                # Demais casos
}

# =============================================================================
# CONFIGURAÇÕES DE GERAÇÃO DE PONTOS CRÍTICOS
# =============================================================================

# Distância mínima entre pontos críticos (metros)
MIN_DISTANCE_POINTS = 100

# Máximo de pontos por categoria de severidade
MAX_POINTS_PER_SEVERITY = 50

# Configurações de amostragem
SAMPLING_STEP = 3

# =============================================================================
# CONFIGURAÇÕES DE EXPORTAÇÃO
# =============================================================================

# Diretório de saída
OUTPUT_DIR = "."

# Nomes dos arquivos de saída
GEOJSON_FILENAME = "critical_points_mata_ciliar.geojson"
GEOTIFF_FILENAME = "ndvi_mata_ciliar_wgs84_normalized.geotiff"
LOG_FILENAME = "processamento_notebook.log"

# Configurações do GeoTIFF
GEOTIFF_CONFIG = {
    'driver': 'GTiff',
    'compress': 'lzw',
    'dtype': 'float32'
}

# =============================================================================
# CONFIGURAÇÕES DE VISUALIZAÇÃO
# =============================================================================

# Configurações de cores para classificação
COLORS = {
    'no_data': '#808080',
    'non_vegetated': '#0066CC',
    'very_sparse': '#DC143C',
    'sparse': '#FF8C00',
    'dense': '#228B22',
    'extremely_dense': '#006400'
}

# Configurações de labels
LABELS = {
    'no_data': 'Sem Dados',
    'non_vegetated': 'Sem vegetação (água/nuvem/neve/rocha)',
    'very_sparse': 'Vegetação muito rala / solo exposto',
    'sparse': 'Vegetação esparsa / em regeneração',
    'dense': 'Vegetação densa e saudável',
    'extremely_dense': 'Cobertura extremamente densa (rara)'
}

# =============================================================================
# CONFIGURAÇÕES DE LOGGING
# =============================================================================

# Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
LOG_LEVEL = "INFO"

# Formato do log
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# =============================================================================
# CONFIGURAÇÕES DE PERFORMANCE
# =============================================================================

# Tamanho dos chunks para processamento
CHUNK_SIZE = {'x': 512, 'y': 512}

# Configurações de memória
MEMORY_LIMIT = "2GB"  # Limite de memória para processamento

# Configurações de paralelização
PARALLEL_WORKERS = 4

# =============================================================================
# CONFIGURAÇÕES DE FALLBACK
# =============================================================================

# Caminhos para arquivos de fallback
FALLBACK_PATHS = {
    'aoi': [
        "../../export.geojson",
        "../data/export.geojson",
        "export.geojson",
        "../scripts/data/export.geojson"
    ],
    'rio': [
        "../../public/rio.geojson",
        "../public/rio.geojson",
        "rio.geojson",
        "export.geojson",
        "../data/export.geojson"
    ]
}

# Configurações de AOI de exemplo
EXAMPLE_AOI = {
    'name': 'Sinimbu/RS',
    'coordinates': [
        [-52.5, -29.4], [-52.4, -29.4],
        [-52.4, -29.5], [-52.5, -29.5], [-52.5, -29.4]
    ]
}

# =============================================================================
# CONFIGURAÇÕES DE VALIDAÇÃO
# =============================================================================

# Tolerância para validação de consistência
VALIDATION_TOLERANCE = 0.2  # 20%

# Configurações de validação de coordenadas
COORDINATE_VALIDATION = {
    'min_lat': -90.0,
    'max_lat': 90.0,
    'min_lon': -180.0,
    'max_lon': 180.0
}

# =============================================================================
# CONFIGURAÇÕES DE METADADOS
# =============================================================================

# Metadados padrão para exportação
DEFAULT_METADATA = {
    'data_source': 'HLS (Harmonized Landsat Sentinel)',
    'processing_software': 'HLS Analysis Python Scripts',
    'version': '1.0.0',
    'contact': 'orbee.online',
    'license': 'MIT'
}

# =============================================================================
# FUNÇÕES DE CONFIGURAÇÃO
# =============================================================================

def get_config():
    """Retorna todas as configurações como um dicionário"""
    return {
        'search': {
            'start_date': START_DATE,
            'end_date': END_DATE,
            'cloud_coverage_max': CLOUD_COVERAGE_MAX,
            'hls_collections': HLS_COLLECTIONS,
            'max_hls_items': MAX_HLS_ITEMS
        },
        'ndvi': {
            'critical_threshold': NDVI_CRITICAL_THRESHOLD,
            'moderate_threshold': NDVI_MODERATE_THRESHOLD,
            'min_valid_pixels': MIN_VALID_PIXELS,
            'scale_factor': HLS_SCALE_FACTOR
        },
        'degradation': {
            'buffer_distance': BUFFER_DISTANCE,
            'buffer_distance_river': BUFFER_DISTANCE_RIVER,
            'status_thresholds': STATUS_THRESHOLDS
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
            'log_filename': LOG_FILENAME,
            'geotiff_config': GEOTIFF_CONFIG
        },
        'visualization': {
            'colors': COLORS,
            'labels': LABELS
        },
        'logging': {
            'level': LOG_LEVEL,
            'format': LOG_FORMAT
        },
        'performance': {
            'chunk_size': CHUNK_SIZE,
            'memory_limit': MEMORY_LIMIT,
            'parallel_workers': PARALLEL_WORKERS
        },
        'fallback': {
            'paths': FALLBACK_PATHS,
            'example_aoi': EXAMPLE_AOI
        },
        'validation': {
            'tolerance': VALIDATION_TOLERANCE,
            'coordinate_validation': COORDINATE_VALIDATION
        },
        'metadata': DEFAULT_METADATA
    }

def update_config(**kwargs):
    """Atualiza configurações específicas"""
    global START_DATE, END_DATE, CLOUD_COVERAGE_MAX
    global NDVI_CRITICAL_THRESHOLD, NDVI_MODERATE_THRESHOLD
    global BUFFER_DISTANCE, BUFFER_DISTANCE_RIVER
    global MIN_DISTANCE_POINTS, MAX_POINTS_PER_SEVERITY
    global OUTPUT_DIR, GEOJSON_FILENAME, GEOTIFF_FILENAME, LOG_FILENAME
    
    # Atualizar configurações de busca
    if 'start_date' in kwargs:
        START_DATE = kwargs['start_date']
    if 'end_date' in kwargs:
        END_DATE = kwargs['end_date']
    if 'cloud_coverage_max' in kwargs:
        CLOUD_COVERAGE_MAX = kwargs['cloud_coverage_max']
    
    # Atualizar configurações de NDVI
    if 'critical_threshold' in kwargs:
        NDVI_CRITICAL_THRESHOLD = kwargs['critical_threshold']
    if 'moderate_threshold' in kwargs:
        NDVI_MODERATE_THRESHOLD = kwargs['moderate_threshold']
    
    # Atualizar configurações de buffer
    if 'buffer_distance' in kwargs:
        BUFFER_DISTANCE = kwargs['buffer_distance']
    if 'buffer_distance_river' in kwargs:
        BUFFER_DISTANCE_RIVER = kwargs['buffer_distance_river']
    
    # Atualizar configurações de pontos
    if 'min_distance' in kwargs:
        MIN_DISTANCE_POINTS = kwargs['min_distance']
    if 'max_per_severity' in kwargs:
        MAX_POINTS_PER_SEVERITY = kwargs['max_per_severity']
    
    # Atualizar configurações de exportação
    if 'output_dir' in kwargs:
        OUTPUT_DIR = kwargs['output_dir']
    if 'geojson_filename' in kwargs:
        GEOJSON_FILENAME = kwargs['geojson_filename']
    if 'geotiff_filename' in kwargs:
        GEOTIFF_FILENAME = kwargs['geotiff_filename']
    if 'log_filename' in kwargs:
        LOG_FILENAME = kwargs['log_filename']

def print_config():
    """Imprime as configurações atuais"""
    config = get_config()
    
    print("🔧 CONFIGURAÇÕES ATUAIS - HLS ANALYSIS")
    print("=" * 50)
    
    for section, settings in config.items():
        print(f"\n📋 {section.upper()}:")
        for key, value in settings.items():
            print(f"   {key}: {value}")

if __name__ == "__main__":
    print_config()
