# HLS Analysis - Riparian Forest Analysis

Python package for riparian forest degradation analysis using HLS (Harmonized Landsat Sentinel) data.

## 📁 Package Structure

```
hls_analysis/
├── __init__.py                    # Python package
├── hls_analysis.py               # HLS data search and loading
├── hls_ndvi_processing.py        # NDVI data processing
├── hls_degradation_analysis.py   # Riparian forest degradation analysis
├── hls_export.py                 # Results export
├── hls_complete_analysis.py      # Main integrated script
├── run_analysis.py               # Main execution script
├── config_hls.py                 # System configurations
├── requirements_hls.txt          # Python dependencies
└── README.md                     # This file
```

## 🚀 How to Use

### Quick Execution

```bash
cd scripts/hls_analysis
python run_analysis.py
```

### Main Script Execution

```bash
cd scripts/hls_analysis
python hls_complete_analysis.py
```

### Usage as Module

```python
from scripts.hls_analysis import hls_complete_analysis

# Execute analysis
hls_complete_analysis.main()
```

## 📊 Data Sources

### Real Data Sources

-  **Microsoft Planetary Computer**: HLS data (Landsat + Sentinel-2)
-  **OpenStreetMap**: River geometries and administrative boundaries
-  **Satellite Data**: Real spectral bands for NDVI calculation

### Processing

-  **Real NDVI**: Calculated from real spectral bands
-  **Degradation Analysis**: Based on real satellite pixels
-  **Critical Points**: Generated from real NDVI data

## ⚙️ Configuration

### Default Region

-  **Region**: Sinimbu, Rio Grande do Sul, Brasil
-  **Period**: 2025-06-01 to 2025-09-30
-  **Buffer**: 200m riparian forest
-  **Thresholds**: Critical < 0.2, Moderate < 0.5

### Customization

Edit the variables at the beginning of `hls_complete_analysis.py`:

```python
REGION_NAME = "Your Region, State, Country"
START_DATE = "2025-06-01"
END_DATE = "2025-09-30"
BUFFER_DISTANCE = 200
```

## 📋 Dependencies

Install the dependencies:

```bash
pip install -r requirements_hls.txt
```

### Main Libraries

-  `pystac-client`: Microsoft Planetary Computer access
-  `osmnx`: OpenStreetMap geographic data
-  `rioxarray`: Raster data processing
-  `geopandas`: Geospatial data manipulation
-  `rasterio`: Raster file reading/writing

## 📤 Results

### Generated Files

-  `critical_points_mata_ciliar.geojson`: Critical degradation points
-  `ndvi_mata_ciliar_wgs84_normalized.geotiff`: Processed NDVI map
-  `processamento_notebook.log`: Detailed processing log

### Metadata

All files include complete metadata about:

-  Data source (real HLS)
-  Processing parameters
-  Degradation statistics
-  Consistency validation

## 🔍 Data Validation

### Integrity Guarantees

-  ✅ **Real data only**: No invented or simulated data
-  ✅ **Coverage validation**: Verifies HLS availability
-  ✅ **Quality masks**: Filters valid pixels
-  ✅ **Coordinate conversion**: Precise UTM ↔ WGS84
-  ✅ **NDVI consistency**: Validates points vs analysis

### Removed Fallbacks

-  ❌ **No sample data**: Fails if real data unavailable
-  ❌ **No simulations**: Only real satellite data
-  ❌ **No invented values**: NDVI calculated from real bands

## 🛠️ Development

### Modular Structure

-  **hls_analysis**: Search and loading
-  **hls_ndvi_processing**: NDVI processing
-  **hls_degradation_analysis**: Degradation analysis
-  **hls_export**: Results export

### Testing

```bash
# Test import
python -c "from hls_analysis import hls_complete_analysis; print('✅ OK')"

# Test execution
python run_analysis.py
```

## 📞 Support

For questions or issues:

1. Check processing logs
2. Confirm connectivity with Microsoft Planetary Computer
3. Validate the specified region in OpenStreetMap
4. Verify installed dependencies

---

**Developed by**: Orbee Online Team  
**Version**: 1.0.0  
**License**: MIT
