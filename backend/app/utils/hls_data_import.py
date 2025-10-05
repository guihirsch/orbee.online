#!/usr/bin/env python3
"""
HLS Data Import Utility
Utilitário para importar dados do GeoJSON para o banco de dados
"""

import json
import logging
from datetime import datetime, date
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.hls_analysis_points_service import get_hls_analysis_points_service
from app.models.schemas_hls import HLSAnalysisPointCreate

logger = logging.getLogger(__name__)

def import_geojson_to_database(geojson_path: str, db: Session = None) -> Dict[str, Any]:
    """
    Importa dados do GeoJSON para o banco de dados
    
    Args:
        geojson_path: Caminho para o arquivo GeoJSON
        db: Sessão do banco de dados (opcional)
    
    Returns:
        Dict com estatísticas da importação
    """
    try:
        if db is None:
            db = next(get_db())
        
        service = get_hls_analysis_points_service(db)
        
        # Ler arquivo GeoJSON
        with open(geojson_path, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
        
        if geojson_data.get('type') != 'FeatureCollection':
            raise ValueError("Arquivo GeoJSON deve ser do tipo FeatureCollection")
        
        features = geojson_data.get('features', [])
        metadata = geojson_data.get('metadata', {})
        
        logger.info(f"Importando {len(features)} pontos do arquivo {geojson_path}")
        
        # Extrair metadados da análise
        analysis_date = datetime.now()
        if 'analysis_date' in metadata:
            try:
                analysis_date = datetime.fromisoformat(metadata['analysis_date'].replace('Z', '+00:00'))
            except:
                logger.warning("Erro ao parsear data da análise, usando data atual")
        
        # Extrair datas do período analisado
        start_date = date(2022, 6, 1)  # Padrão
        end_date = date(2022, 9, 30)   # Padrão
        
        processing_params = metadata.get('processing_params', {})
        if 'start_date' in processing_params:
            try:
                start_date = datetime.strptime(processing_params['start_date'], '%Y-%m-%d').date()
            except:
                pass
        
        if 'end_date' in processing_params:
            try:
                end_date = datetime.strptime(processing_params['end_date'], '%Y-%m-%d').date()
            except:
                pass
        
        # Extrair outros parâmetros
        buffer_distance = metadata.get('buffer_distance', '200 meters')
        buffer_distance_m = 200
        if 'meters' in buffer_distance:
            try:
                buffer_distance_m = int(buffer_distance.split()[0])
            except:
                pass
        
        cloud_coverage_max = processing_params.get('cloud_coverage_max', 50)
        
        # Processar cada feature
        points_to_create = []
        skipped_count = 0
        
        for feature in features:
            if feature.get('type') != 'Feature':
                skipped_count += 1
                continue
            
            properties = feature.get('properties', {})
            geometry = feature.get('geometry', {})
            
            if geometry.get('type') != 'Point':
                skipped_count += 1
                continue
            
            coordinates = geometry.get('coordinates', [])
            if len(coordinates) != 2:
                skipped_count += 1
                continue
            
            lon, lat = coordinates
            
            # Verificar se o ponto tem ID único
            point_id = properties.get('id')
            if not point_id:
                logger.warning(f"Ponto sem ID único encontrado em ({lat}, {lon}), pulando...")
                skipped_count += 1
                continue
            
            # Criar objeto de ponto
            try:
                point_data = HLSAnalysisPointCreate(
                    point_id=point_id,
                    latitude=lat,
                    longitude=lon,
                    ndvi_value=properties.get('ndvi', 0.0),
                    severity=properties.get('severity', 'critical'),
                    level=properties.get('level', 'very_sparse'),
                    distance_to_river_m=properties.get('distance_to_river_m'),
                    analysis_date=analysis_date,
                    data_source=metadata.get('data_source', 'HLS'),
                    analysis_method=metadata.get('ndvi_processing', {}).get('points_generation_method', 'real_ndvi_based'),
                    buffer_distance_m=buffer_distance_m,
                    cloud_coverage_max=cloud_coverage_max,
                    start_date=start_date,
                    end_date=end_date,
                    status='active'
                )
                
                points_to_create.append(point_data)
                
            except Exception as e:
                logger.warning(f"Erro ao criar ponto {point_id}: {e}")
                skipped_count += 1
                continue
        
        # Criar pontos em lote
        created_count = service.bulk_create_points(points_to_create)
        
        result = {
            "total_features": len(features),
            "processed_points": len(points_to_create),
            "created_count": created_count,
            "skipped_count": skipped_count + (len(points_to_create) - created_count),
            "analysis_date": analysis_date.isoformat(),
            "data_source": metadata.get('data_source', 'HLS'),
            "buffer_distance_m": buffer_distance_m,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }
        
        logger.info(f"Importação concluída: {created_count} pontos criados, {result['skipped_count']} pulados")
        return result
        
    except Exception as e:
        logger.error(f"Erro ao importar GeoJSON: {e}")
        raise

def import_latest_analysis() -> Dict[str, Any]:
    """
    Importa a análise mais recente do diretório hls_analysis
    """
    try:
        # Buscar arquivo GeoJSON mais recente
        hls_dir = Path(__file__).parent.parent.parent.parent / "hls_analysis"
        geojson_files = list(hls_dir.glob("critical_points_mata_ciliar*.geojson"))
        
        if not geojson_files:
            raise FileNotFoundError("Nenhum arquivo GeoJSON encontrado no diretório hls_analysis")
        
        # Usar o arquivo mais recente
        latest_file = max(geojson_files, key=lambda f: f.stat().st_mtime)
        
        logger.info(f"Importando arquivo mais recente: {latest_file}")
        return import_geojson_to_database(str(latest_file))
        
    except Exception as e:
        logger.error(f"Erro ao importar análise mais recente: {e}")
        raise

if __name__ == "__main__":
    # Executar importação quando chamado diretamente
    try:
        result = import_latest_analysis()
        print("Importação concluída com sucesso!")
        print(f"Resultado: {result}")
    except Exception as e:
        print(f"Erro na importação: {e}")
