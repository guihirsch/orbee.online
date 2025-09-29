-- Schema do banco de dados OrBee.Online - Versão Segura
-- Supabase PostgreSQL - Execução segura (ignora objetos existentes)

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    
    -- Gamificação
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    observations_count INTEGER DEFAULT 0,
    validations_count INTEGER DEFAULT 0,
    
    -- Configurações
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    privacy_level VARCHAR(20) DEFAULT 'public', -- public, friends, private
    
    -- Metadados
    role VARCHAR(20) DEFAULT 'citizen', -- citizen, scientist, moderator, admin
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de observações
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Localização
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    
    -- Dados da observação
    observation_type VARCHAR(50) NOT NULL, -- vegetation_health, deforestation, restoration, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5), -- 1=baixo, 5=crítico
    
    -- Mídia
    images JSONB DEFAULT '[]'::jsonb, -- Array de URLs das imagens
    
    -- Dados ambientais
    ndvi_value DECIMAL(4, 3), -- Valor NDVI no momento da observação
    weather_conditions JSONB, -- Condições climáticas
    
    -- Validação comunitária
    validation_score DECIMAL(3, 2) DEFAULT 0, -- 0-5.0
    validation_count INTEGER DEFAULT 0,
    is_validated BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, validated, rejected, resolved
    visibility VARCHAR(20) DEFAULT 'public', -- public, private
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de validações de observações
CREATE TABLE IF NOT EXISTS observation_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observation_id UUID NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
    validator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Validação
    validation_type VARCHAR(20) NOT NULL, -- confirm, dispute, additional_info
    score INTEGER CHECK (score >= 1 AND score <= 5), -- 1=discorda totalmente, 5=concorda totalmente
    comment TEXT,
    
    -- Dados adicionais
    additional_images JSONB DEFAULT '[]'::jsonb,
    expertise_level VARCHAR(20) DEFAULT 'citizen', -- citizen, expert, researcher
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evita validações duplicadas
    UNIQUE(observation_id, validator_id)
);

-- Tabela de áreas monitoradas
CREATE TABLE IF NOT EXISTS monitored_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Informações da área
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Geometria da área
    center_latitude DECIMAL(10, 8) NOT NULL,
    center_longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER DEFAULT 1000, -- Raio em metros
    
    -- Configurações de monitoramento
    alert_threshold DECIMAL(4, 3) DEFAULT 0.3, -- Threshold NDVI para alertas
    monitoring_frequency VARCHAR(20) DEFAULT 'weekly', -- daily, weekly, monthly
    
    -- Estatísticas
    observations_count INTEGER DEFAULT 0,
    last_ndvi_value DECIMAL(4, 3),
    last_ndvi_date DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de dados NDVI históricos por município
CREATE TABLE IF NOT EXISTS ndvi_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação do município
    municipality_code VARCHAR(10) NOT NULL,
    municipality_name VARCHAR(255),
    
    -- Geometria da área analisada
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

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    monitored_area_id UUID REFERENCES monitored_areas(id) ON DELETE CASCADE,
    
    -- Tipo e severidade do alerta
    alert_type VARCHAR(50) NOT NULL, -- ndvi_drop, deforestation, anomaly
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    
    -- Localização
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Dados do alerta
    title VARCHAR(255) NOT NULL,
    description TEXT,
    current_value DECIMAL(4, 3),
    threshold_value DECIMAL(4, 3),
    change_percentage DECIMAL(5, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, acknowledged, resolved, false_positive
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES users(id),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de recomendações
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contexto
    recommendation_type VARCHAR(50) NOT NULL, -- conservation, restoration, monitoring
    target_audience VARCHAR(50) NOT NULL, -- farmer, researcher, government, citizen
    
    -- Condições de aplicação
    min_ndvi DECIMAL(4, 3),
    max_ndvi DECIMAL(4, 3),
    season VARCHAR(20), -- spring, summer, autumn, winter, all
    biome VARCHAR(50), -- cerrado, mata_atlantica, amazonia, caatinga, etc.
    
    -- Conteúdo da recomendação
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_items JSONB DEFAULT '[]'::jsonb, -- Lista de ações específicas
    resources JSONB DEFAULT '[]'::jsonb, -- Links e recursos adicionais
    
    -- Prioridade e eficácia
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    effectiveness_score DECIMAL(3, 2) DEFAULT 3.0, -- 1.0-5.0
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conquistas/achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Informações da conquista
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(100), -- Nome do ícone
    category VARCHAR(50) NOT NULL, -- observer, validator, guardian, explorer
    
    -- Critérios
    criteria JSONB NOT NULL, -- Critérios para desbloquear
    points_reward INTEGER DEFAULT 0,
    
    -- Raridade
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conquistas dos usuários
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Progresso
    progress JSONB DEFAULT '{}'::jsonb, -- Progresso atual
    is_unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evita duplicatas
    UNIQUE(user_id, achievement_id)
);

-- Índices para performance (apenas se não existirem)
CREATE INDEX IF NOT EXISTS idx_observations_user_id ON observations(user_id);
CREATE INDEX IF NOT EXISTS idx_observations_type ON observations(observation_type);
CREATE INDEX IF NOT EXISTS idx_observations_created_at ON observations(created_at);
CREATE INDEX IF NOT EXISTS idx_observations_status ON observations(status);

CREATE INDEX IF NOT EXISTS idx_ndvi_history_municipality ON ndvi_history(municipality_code);
CREATE INDEX IF NOT EXISTS idx_ndvi_history_date ON ndvi_history(acquisition_date);
CREATE INDEX IF NOT EXISTS idx_ndvi_history_period ON ndvi_history(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_monitored_areas_user_id ON monitored_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_monitored_areas_active ON monitored_areas(is_active);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Função para updated_at (apenas se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at (apenas se não existirem)
DO $$
BEGIN
    -- Trigger para users
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para observations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_observations_updated_at') THEN
        CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON observations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para monitored_areas
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_monitored_areas_updated_at') THEN
        CREATE TRIGGER update_monitored_areas_updated_at BEFORE UPDATE ON monitored_areas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para alerts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_alerts_updated_at') THEN
        CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para recommendations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_recommendations_updated_at') THEN
        CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para user_achievements
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_achievements_updated_at') THEN
        CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
