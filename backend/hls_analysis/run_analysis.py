#!/usr/bin/env python3
"""
Main Script for HLS Analysis Execution
Executes complete riparian forest analysis with HLS data
Includes automatic river distance correction
"""

import sys
import os
from pathlib import Path

# Add current directory to path for imports
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Import and execute complete analysis
from hls_complete_analysis import main
from river_distance_fixer import ensure_river_distances_correct

if __name__ == "__main__":
    print("Starting HLS Riparian Forest Analysis")
    print("=" * 50)
    print(f"Working directory: {current_dir}")
    print(f"Configured region: Sinimbu, Rio Grande do Sul, Brasil")
    print("=" * 50)
    
    try:
        # Execute main analysis
        main()
        
        # Check and correct river distances if necessary
        geojson_path = "critical_points_mata_ciliar.geojson"
        if os.path.exists(geojson_path):
            print("\n🔧 Checking river distances...")
            ensure_river_distances_correct(geojson_path)
            
            # Copy to frontend if correction was successful
            frontend_path = "../../frontend/public/critical_points_mata_ciliar.geojson"
            try:
                import shutil
                shutil.copy2(geojson_path, frontend_path)
                print(f"✅ Updated file copied to frontend: {frontend_path}")
            except Exception as e:
                print(f"⚠️ Error copying to frontend: {e}")
        
    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nError during analysis: {e}")
        sys.exit(1)
