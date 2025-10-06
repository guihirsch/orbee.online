#!/usr/bin/env python3
"""
Simple Script for HLS Analysis Execution
Version without emojis for Windows compatibility
Includes automatic river distance correction
"""

import sys
import os
from pathlib import Path

# Add current directory to path for imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def main():
    """Executes HLS analysis"""
    
    print("=" * 60)
    print("HLS Complete Analysis - Riparian Forest Analysis")
    print("Processing HLS data (Harmonized Landsat Sentinel)")
    print("Focus: Riparian forest degradation detection")
    print("=" * 60)
    
    print(f"Working directory: {current_dir}")
    print("Configured region: Sinimbu, Rio Grande do Sul, Brasil")
    print("")
    
    try:
        # Import and execute complete analysis
        from hls_complete_analysis import main as run_analysis
        run_analysis()
        
        # Check and correct river distances if necessary
        geojson_path = "critical_points_mata_ciliar.geojson"
        if os.path.exists(geojson_path):
            print("\nChecking river distances...")
            try:
                from river_distance_fixer import ensure_river_distances_correct
                ensure_river_distances_correct(geojson_path)
                
                # Copy to frontend if correction was successful
                frontend_path = "../../frontend/public/critical_points_mata_ciliar.geojson"
                try:
                    import shutil
                    shutil.copy2(geojson_path, frontend_path)
                    print(f"Updated file copied to frontend: {frontend_path}")
                    
                    # Import data to database
                    try:
                        import sys
                        sys.path.append("../../backend")
                        from app.utils.hls_data_import import import_geojson_to_database
                        
                        print("\nImporting data to database...")
                        result = import_geojson_to_database(geojson_path)
                        print(f"✅ Data imported successfully:")
                        print(f"   - Points created: {result['created_count']}")
                        print(f"   - Points skipped: {result['skipped_count']}")
                        print(f"   - Analysis date: {result['analysis_date']}")
                        
                    except Exception as e:
                        print(f"⚠️ Error importing to database: {e}")
                        print("   Data was saved to GeoJSON, but not imported to database")
                        
                except Exception as e:
                    print(f"Error copying to frontend: {e}")
                    
            except Exception as e:
                print(f"Error correcting river distances: {e}")
        
    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nError during analysis: {e}")
        print("Check if all dependencies are installed:")
        print("pip install -r requirements_hls.txt")
        sys.exit(1)

if __name__ == "__main__":
    main()
