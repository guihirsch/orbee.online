from fastapi import APIRouter
from datetime import datetime


router = APIRouter()


@router.get("/sinimbu/riparian")
async def get_sinimbu_riparian_aoi():
    """
    AOI placeholder for riparian forests in Sinimbu/RS municipality.
    Note: Replace with dynamic generation (IBGE + OSM + buffer) in future stage.
    """
    # Simplified GeoJSON (approximate polygon) — replace with real data
    feature_collection = {
        "type": "FeatureCollection",
        "name": "sinimbu_riparian_placeholder",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Approximate riparian strip",
                    "source": "placeholder",
                    "generated_at": datetime.utcnow().isoformat() + "Z",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-52.514, -29.52],
                            [-52.36, -29.52],
                            [-52.36, -29.69],
                            [-52.514, -29.69],
                            [-52.514, -29.52],
                        ]
                    ],
                },
            }
        ],
    }

    return feature_collection


