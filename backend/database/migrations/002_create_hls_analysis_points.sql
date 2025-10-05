-- Migração 002: Tabela para pontos de análise HLS com IDs únicos
-- Esta tabela armazena os pontos críticos gerados pela análise HLS
-- com IDs únicos para acompanhamento temporal

-- Tabela de pontos de análise HLS
CREATE TABLE IF NOT EXISTS hls_analysis_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- ID único do ponto (gerado pela análise HLS)
    point_id VARCHAR(50) UNIQUE NOT NULL, -- formato: hls_point_<hash>
    
    -- Localização
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_point GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    
    -- Dados da análise
    ndvi_value DECIMAL(6, 6) NOT NULL, -- Valor NDVI com maior precisão
    severity VARCHAR(20) NOT NULL, -- critical, moderate, healthy
    level VARCHAR(20) NOT NULL, -- very_sparse, sparse, dense
    distance_to_river_m DECIMAL(8, 2), -- Distância do rio em metros
    
    -- Metadados da análise
    analysis_date TIMESTAMP WITH TIME ZONE NOT NULL,
    data_source VARCHAR(50) DEFAULT 'HLS', -- HLS, Sentinel-2, Landsat, etc.
    analysis_method VARCHAR(50) DEFAULT 'real_ndvi_based',
    
    -- Parâmetros da análise
    buffer_distance_m INTEGER DEFAULT 200,
    cloud_coverage_max INTEGER DEFAULT 50,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status do ponto
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, false_positive
    is_validated BOOLEAN DEFAULT false,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de histórico temporal dos pontos HLS
CREATE TABLE IF NOT EXISTS hls_point_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    point_id VARCHAR(50) NOT NULL REFERENCES hls_analysis_points(point_id) ON DELETE CASCADE,
    
    -- Dados temporais
    analysis_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ndvi_value DECIMAL(6, 6) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    level VARCHAR(20) NOT NULL,
    
    -- Mudanças detectadas
    ndvi_change DECIMAL(6, 6), -- Mudança em relação à análise anterior
    severity_change VARCHAR(20), -- Mudança de severidade
    trend VARCHAR(20), -- improving, stable, declining
    
    -- Metadados da análise
    data_source VARCHAR(50) DEFAULT 'HLS',
    analysis_method VARCHAR(50) DEFAULT 'real_ndvi_based',
    cloud_coverage DECIMAL(5, 2),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índice único para evitar duplicatas
    UNIQUE(point_id, analysis_date)
);

-- Adicionar campo de referência na tabela de observações
ALTER TABLE observations 
ADD COLUMN IF NOT EXISTS hls_point_id VARCHAR(50) REFERENCES hls_analysis_points(point_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_point_id ON hls_analysis_points(point_id);
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_location ON hls_analysis_points USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_analysis_date ON hls_analysis_points(analysis_date);
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_severity ON hls_analysis_points(severity);
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_status ON hls_analysis_points(status);
CREATE INDEX IF NOT EXISTS idx_hls_analysis_points_ndvi ON hls_analysis_points(ndvi_value);

CREATE INDEX IF NOT EXISTS idx_hls_point_history_point_id ON hls_point_history(point_id);
CREATE INDEX IF NOT EXISTS idx_hls_point_history_analysis_date ON hls_point_history(analysis_date);
CREATE INDEX IF NOT EXISTS idx_hls_point_history_trend ON hls_point_history(trend);

CREATE INDEX IF NOT EXISTS idx_observations_hls_point_id ON observations(hls_point_id);

-- Trigger para updated_at na tabela hls_analysis_points
CREATE TRIGGER update_hls_analysis_points_updated_at BEFORE UPDATE ON hls_analysis_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE hls_analysis_points IS 'Pontos críticos de análise HLS com IDs únicos para acompanhamento temporal';
COMMENT ON TABLE hls_point_history IS 'Histórico temporal das análises de cada ponto HLS';
COMMENT ON COLUMN hls_analysis_points.point_id IS 'ID único gerado pela análise HLS no formato hls_point_<hash>';
COMMENT ON COLUMN hls_analysis_points.ndvi_value IS 'Valor NDVI com precisão de 6 casas decimais';
COMMENT ON COLUMN observations.hls_point_id IS 'Referência ao ponto de análise HLS relacionado à observação';
