-- Migração para criar tabela ndvi_history
-- Execute este script no Supabase SQL Editor

-- Tabela de dados NDVI históricos por município
CREATE TABLE IF NOT EXISTS ndvi_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação do município
    municipality_code VARCHAR(10) NOT NULL,
    municipality_name VARCHAR(255),
    
    -- Geometria da área analisada
    geometry GEOMETRY(POLYGON, 4326),
    center_latitude DECIMAL(10, 8),
    center_longitude DECIMAL(11, 8),
    
    -- Dados NDVI
    ndvi_value DECIMAL(4, 3) NOT NULL,
    average_ndvi DECIMAL(4, 3),
    min_ndvi DECIMAL(4, 3),
    max_ndvi DECIMAL(4, 3),
    
    -- Período de análise
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    acquisition_date DATE NOT NULL,
    
    -- Metadados da imagem
    satellite VARCHAR(50) DEFAULT 'Sentinel-2',
    cloud_coverage DECIMAL(5, 2),
    data_quality VARCHAR(20) DEFAULT 'good',
    
    -- Análise de tendência
    trend VARCHAR(20), -- 'improving', 'stable', 'declining'
    vegetation_status VARCHAR(20), -- 'excellent', 'good', 'moderate', 'poor', 'critical'
    
    -- Parâmetros da consulta
    max_cloud INTEGER DEFAULT 30,
    superres BOOLEAN DEFAULT false,
    
    -- Fonte dos dados
    data_source VARCHAR(50) DEFAULT 'sentinel_hub',
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para performance
    UNIQUE(municipality_code, acquisition_date, start_date, end_date)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ndvi_history_municipality ON ndvi_history(municipality_code);
CREATE INDEX IF NOT EXISTS idx_ndvi_history_date ON ndvi_history(acquisition_date);
CREATE INDEX IF NOT EXISTS idx_ndvi_history_period ON ndvi_history(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ndvi_history_geometry ON ndvi_history USING GIST (geometry);

-- Comentários para documentação
COMMENT ON TABLE ndvi_history IS 'Histórico de dados NDVI por município para análise de tendências';
COMMENT ON COLUMN ndvi_history.municipality_code IS 'Código IBGE do município';
COMMENT ON COLUMN ndvi_history.ndvi_value IS 'Valor NDVI atual';
COMMENT ON COLUMN ndvi_history.trend IS 'Tendência: improving, stable, declining';
COMMENT ON COLUMN ndvi_history.vegetation_status IS 'Status da vegetação: excellent, good, moderate, poor, critical';
