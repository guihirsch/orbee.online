-- Dados iniciais para o banco de dados OrBee.Online

-- Inserir conquistas (achievements)
INSERT INTO achievements (name, description, icon, category, criteria, points_reward, rarity) VALUES
-- Conquistas de Observador
('Primeiro Olhar', 'Faça sua primeira observação ambiental', 'eye', 'observer', '{"observations_count": 1}', 10, 'common'),
('Observador Dedicado', 'Faça 10 observações ambientais', 'binoculars', 'observer', '{"observations_count": 10}', 50, 'common'),
('Guardião da Natureza', 'Faça 50 observações ambientais', 'shield', 'observer', '{"observations_count": 50}', 200, 'rare'),
('Sentinela Verde', 'Faça 100 observações ambientais', 'tree', 'observer', '{"observations_count": 100}', 500, 'epic'),
('Protetor Ambiental', 'Faça 250 observações ambientais', 'award', 'observer', '{"observations_count": 250}', 1000, 'legendary'),

-- Conquistas de Validador
('Primeira Validação', 'Valide sua primeira observação', 'check', 'validator', '{"validations_count": 1}', 15, 'common'),
('Validador Confiável', 'Valide 25 observações', 'check-circle', 'validator', '{"validations_count": 25}', 100, 'common'),
('Especialista Comunitário', 'Valide 100 observações', 'star', 'validator', '{"validations_count": 100}', 300, 'rare'),
('Autoridade Verde', 'Valide 500 observações', 'crown', 'validator', '{"validations_count": 500}', 1500, 'epic'),

-- Conquistas de Explorador
('Explorador Local', 'Faça observações em 3 locais diferentes', 'map-pin', 'explorer', '{"unique_locations": 3}', 25, 'common'),
('Andarilho Verde', 'Faça observações em 10 locais diferentes', 'compass', 'explorer', '{"unique_locations": 10}', 75, 'common'),
('Desbravador Ambiental', 'Faça observações em 25 locais diferentes', 'globe', 'explorer', '{"unique_locations": 25}', 200, 'rare'),

-- Conquistas de Guardião
('Guardião Iniciante', 'Monitore sua primeira área', 'home', 'guardian', '{"monitored_areas": 1}', 20, 'common'),
('Protetor Regional', 'Monitore 5 áreas diferentes', 'map', 'guardian', '{"monitored_areas": 5}', 100, 'rare'),
('Guardião Supremo', 'Monitore 10 áreas por mais de 6 meses', 'shield-check', 'guardian', '{"monitored_areas": 10, "monitoring_months": 6}', 500, 'epic'),

-- Conquistas Especiais
('Detector de Mudanças', 'Identifique uma mudança significativa no NDVI', 'trending-down', 'special', '{"ndvi_change_detected": true}', 100, 'rare'),
('Restaurador', 'Documente uma área em processo de restauração', 'trending-up', 'special', '{"restoration_documented": true}', 150, 'rare'),
('Cientista Cidadão', 'Contribua com dados para pesquisa científica', 'microscope', 'special', '{"scientific_contribution": true}', 200, 'epic'),
('Embaixador Verde', 'Convide 5 pessoas para a plataforma', 'users', 'special', '{"referrals": 5}', 300, 'epic');

-- Inserir recomendações por tipo e contexto
INSERT INTO recommendations (recommendation_type, target_audience, min_ndvi, max_ndvi, season, biome, title, description, action_items, priority, effectiveness_score) VALUES

-- Recomendações para NDVI baixo (vegetação em estresse)
('restoration', 'farmer', 0.0, 0.3, 'all', 'cerrado', 
 'Recuperação de Área Degradada', 
 'Sua área apresenta sinais de degradação severa. É necessário implementar técnicas de recuperação para restaurar a cobertura vegetal.',
 '["Remover fatores de degradação (gado, fogo, erosão)", "Plantar espécies nativas adaptadas ao cerrado", "Implementar sistema de irrigação temporário", "Monitorar o crescimento mensalmente"]',
 5, 4.5),

('conservation', 'citizen', 0.0, 0.3, 'all', 'mata_atlantica',
 'Alerta: Vegetação Crítica',
 'A vegetação nesta área está em estado crítico. Reporte às autoridades ambientais e evite atividades que possam causar mais danos.',
 '["Reportar às autoridades ambientais locais", "Documentar com fotos para evidência", "Evitar pisoteio e atividades na área", "Mobilizar a comunidade local"]',
 5, 4.0),

-- Recomendações para NDVI moderado
('monitoring', 'researcher', 0.3, 0.5, 'all', 'amazonia',
 'Monitoramento Intensivo Necessário',
 'A área apresenta sinais de estresse moderado. Recomenda-se monitoramento mais frequente para identificar tendências.',
 '["Aumentar frequência de monitoramento para semanal", "Coletar dados de precipitação local", "Verificar presença de pragas ou doenças", "Analisar fatores antropogênicos"]',
 4, 4.2),

('conservation', 'government', 0.3, 0.5, 'dry', 'caatinga',
 'Medidas Preventivas de Conservação',
 'Durante o período seco, a vegetação da caatinga necessita de proteção especial contra queimadas e sobrepastoreio.',
 '["Implementar brigadas de prevenção a incêndios", "Controlar acesso de animais", "Criar corredores ecológicos", "Educar comunidade local"]',
 4, 3.8),

-- Recomendações para NDVI bom
('conservation', 'farmer', 0.5, 0.7, 'all', 'cerrado',
 'Manutenção de Boas Práticas',
 'Sua área está em bom estado. Continue as práticas atuais e considere melhorias incrementais.',
 '["Manter práticas atuais de manejo", "Considerar plantio de espécies complementares", "Implementar rotação de culturas", "Monitorar sazonalmente"]',
 3, 3.5),

('monitoring', 'citizen', 0.5, 0.7, 'all', 'mata_atlantica',
 'Área Estável - Monitoramento Regular',
 'A vegetação está saudável. Continue o monitoramento regular para detectar mudanças precocemente.',
 '["Manter monitoramento mensal", "Documentar mudanças sazonais", "Compartilhar dados com pesquisadores", "Engajar vizinhos no monitoramento"]',
 2, 3.0),

-- Recomendações para NDVI excelente
('conservation', 'researcher', 0.7, 1.0, 'all', 'amazonia',
 'Área de Referência para Conservação',
 'Esta área apresenta vegetação excelente e pode servir como referência para estudos e conservação.',
 '["Documentar espécies presentes", "Estabelecer como área de referência", "Estudar fatores de sucesso", "Replicar práticas em outras áreas"]',
 2, 4.8),

('expansion', 'government', 0.7, 1.0, 'all', 'cerrado',
 'Oportunidade de Expansão',
 'Área com excelente cobertura vegetal. Considere expandir a conservação para áreas adjacentes.',
 '["Mapear áreas adjacentes", "Criar corredores ecológicos", "Implementar unidade de conservação", "Desenvolver ecoturismo sustentável"]',
 3, 4.0),

-- Recomendações sazonais específicas
('restoration', 'farmer', 0.2, 0.4, 'rainy', 'cerrado',
 'Plantio na Estação Chuvosa',
 'Aproveite o período chuvoso para implementar ações de restauração com maior chance de sucesso.',
 '["Preparar mudas de espécies nativas", "Fazer plantio no início das chuvas", "Implementar cobertura morta", "Monitorar estabelecimento das plantas"]',
 4, 4.3),

('prevention', 'citizen', 0.4, 0.8, 'dry', 'cerrado',
 'Prevenção de Incêndios',
 'Durante a estação seca, reforce as medidas de prevenção contra incêndios florestais.',
 '["Criar aceiros ao redor da propriedade", "Manter equipamentos de combate a incêndio", "Monitorar focos de calor", "Coordenar com vizinhos"]',
 5, 4.1),

-- Recomendações por bioma específico
('restoration', 'government', 0.1, 0.4, 'all', 'mata_atlantica',
 'Restauração de Mata Atlântica',
 'A Mata Atlântica é um dos biomas mais ameaçados. Priorize ações de restauração com espécies nativas.',
 '["Usar espécies nativas regionais", "Implementar nucleação", "Controlar espécies invasoras", "Conectar fragmentos florestais"]',
 5, 4.7),

('monitoring', 'researcher', 0.3, 0.9, 'all', 'pantanal',
 'Monitoramento de Áreas Úmidas',
 'O Pantanal tem dinâmica sazonal única. Adapte o monitoramento aos ciclos de cheia e seca.',
 '["Monitorar ciclos hidrológicos", "Documentar espécies migratórias", "Avaliar impacto do gado", "Estudar conectividade aquática"]',
 3, 4.0);

-- Inserir dados NDVI de exemplo para algumas localizações
INSERT INTO ndvi_data (latitude, longitude, ndvi_value, acquisition_date, satellite, cloud_coverage, data_quality, data_source) VALUES
-- Brasília e região
(-15.7942, -47.8822, 0.65, '2024-01-15', 'Sentinel-2', 5.2, 'excellent', 'sentinel_hub'),
(-15.7942, -47.8822, 0.62, '2024-01-22', 'Sentinel-2', 12.1, 'good', 'sentinel_hub'),
(-15.7942, -47.8822, 0.68, '2024-01-29', 'Sentinel-2', 8.3, 'good', 'sentinel_hub'),
(-15.7942, -47.8822, 0.71, '2024-02-05', 'Sentinel-2', 3.7, 'excellent', 'sentinel_hub'),
(-15.7942, -47.8822, 0.69, '2024-02-12', 'Sentinel-2', 15.4, 'fair', 'sentinel_hub'),

-- São Paulo
(-23.5505, -46.6333, 0.45, '2024-01-15', 'Sentinel-2', 25.8, 'fair', 'sentinel_hub'),
(-23.5505, -46.6333, 0.43, '2024-01-22', 'Sentinel-2', 18.2, 'good', 'sentinel_hub'),
(-23.5505, -46.6333, 0.47, '2024-01-29', 'Sentinel-2', 22.1, 'fair', 'sentinel_hub'),
(-23.5505, -46.6333, 0.49, '2024-02-05', 'Sentinel-2', 8.9, 'good', 'sentinel_hub'),
(-23.5505, -46.6333, 0.46, '2024-02-12', 'Sentinel-2', 31.2, 'poor', 'sentinel_hub'),

-- Manaus
(-3.1190, -60.0217, 0.82, '2024-01-15', 'Sentinel-2', 45.3, 'poor', 'sentinel_hub'),
(-3.1190, -60.0217, 0.85, '2024-01-22', 'Sentinel-2', 12.7, 'good', 'sentinel_hub'),
(-3.1190, -60.0217, 0.83, '2024-01-29', 'Sentinel-2', 28.4, 'fair', 'sentinel_hub'),
(-3.1190, -60.0217, 0.87, '2024-02-05', 'Sentinel-2', 8.1, 'excellent', 'sentinel_hub'),
(-3.1190, -60.0217, 0.84, '2024-02-12', 'Sentinel-2', 19.6, 'good', 'sentinel_hub'),

-- Salvador
(-12.9714, -38.5014, 0.58, '2024-01-15', 'Sentinel-2', 15.2, 'good', 'sentinel_hub'),
(-12.9714, -38.5014, 0.55, '2024-01-22', 'Sentinel-2', 22.8, 'fair', 'sentinel_hub'),
(-12.9714, -38.5014, 0.61, '2024-01-29', 'Sentinel-2', 9.4, 'good', 'sentinel_hub'),
(-12.9714, -38.5014, 0.59, '2024-02-05', 'Sentinel-2', 18.7, 'good', 'sentinel_hub'),
(-12.9714, -38.5014, 0.57, '2024-02-12', 'Sentinel-2', 26.3, 'fair', 'sentinel_hub'),

-- Curitiba
(-25.4284, -49.2733, 0.72, '2024-01-15', 'Sentinel-2', 8.9, 'good', 'sentinel_hub'),
(-25.4284, -49.2733, 0.69, '2024-01-22', 'Sentinel-2', 14.3, 'good', 'sentinel_hub'),
(-25.4284, -49.2733, 0.75, '2024-01-29', 'Sentinel-2', 6.1, 'excellent', 'sentinel_hub'),
(-25.4284, -49.2733, 0.73, '2024-02-05', 'Sentinel-2', 11.7, 'good', 'sentinel_hub'),
(-25.4284, -49.2733, 0.71, '2024-02-12', 'Sentinel-2', 19.2, 'good', 'sentinel_hub');

-- Inserir usuário de exemplo (senha: 'password123' - hash bcrypt)
INSERT INTO users (email, username, full_name, password_hash, bio, location, points, level, observations_count, validations_count) VALUES
('admin@orbee.online', 'admin', 'Administrador OrBee', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'Administrador da plataforma OrBee.Online', 'Brasília, DF', 1000, 5, 25, 50),
('pesquisador@orbee.online', 'pesquisador', 'Dr. João Silva', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'Pesquisador em sensoriamento remoto e ecologia', 'São Paulo, SP', 750, 4, 18, 35),
('cidadao@orbee.online', 'cidadao_verde', 'Maria Santos', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'Cidadã engajada na preservação ambiental', 'Curitiba, PR', 320, 2, 8, 12);

-- Inserir algumas observações de exemplo
INSERT INTO observations (user_id, latitude, longitude, observation_type, title, description, severity_level, ndvi_value, validation_score, validation_count, is_validated, status) VALUES
((SELECT id FROM users WHERE username = 'admin'), -15.7942, -47.8822, 'vegetation_health', 'Vegetação Saudável no Parque da Cidade', 'Área com boa cobertura vegetal, vegetação nativa bem preservada.', 1, 0.68, 4.2, 3, true, 'validated'),
((SELECT id FROM users WHERE username = 'pesquisador'), -23.5505, -46.6333, 'deforestation', 'Desmatamento em Área Urbana', 'Remoção de vegetação para construção, impacto significativo na cobertura verde.', 4, 0.32, 4.8, 5, true, 'validated'),
((SELECT id FROM users WHERE username = 'cidadao_verde'), -25.4284, -49.2733, 'restoration', 'Área em Recuperação', 'Projeto de reflorestamento em andamento, mudas plantadas recentemente.', 2, 0.45, 3.9, 2, true, 'validated'),
((SELECT id FROM users WHERE username = 'admin'), -12.9714, -38.5014, 'vegetation_health', 'Mata Atlântica Preservada', 'Fragmento de mata atlântica em excelente estado de conservação.', 1, 0.78, 4.5, 4, true, 'validated'),
((SELECT id FROM users WHERE username = 'pesquisador'), -3.1190, -60.0217, 'monitoring', 'Monitoramento Amazônico', 'Área de floresta primária para estudos de longo prazo.', 1, 0.85, 4.7, 6, true, 'validated');

-- Inserir áreas monitoradas de exemplo
INSERT INTO monitored_areas (user_id, name, description, center_latitude, center_longitude, radius_meters, alert_threshold, monitoring_frequency, observations_count, last_ndvi_value, last_ndvi_date) VALUES
((SELECT id FROM users WHERE username = 'admin'), 'Parque da Cidade - Brasília', 'Monitoramento da vegetação do Parque da Cidade', -15.7942, -47.8822, 2000, 0.4, 'weekly', 1, 0.68, '2024-02-12'),
((SELECT id FROM users WHERE username = 'pesquisador'), 'Fragmento Urbano SP', 'Estudo de fragmento de mata atlântica em área urbana', -23.5505, -46.6333, 1500, 0.3, 'daily', 1, 0.46, '2024-02-12'),
((SELECT id FROM users WHERE username = 'cidadao_verde'), 'Área de Reflorestamento', 'Acompanhamento de projeto de restauração florestal', -25.4284, -49.2733, 1000, 0.35, 'monthly', 1, 0.71, '2024-02-12');

-- Inserir algumas validações de exemplo
INSERT INTO observation_validations (observation_id, validator_id, validation_type, score, comment, expertise_level) VALUES
((SELECT id FROM observations WHERE title = 'Vegetação Saudável no Parque da Cidade'), (SELECT id FROM users WHERE username = 'pesquisador'), 'confirm', 4, 'Confirmado, vegetação em bom estado.', 'expert'),
((SELECT id FROM observations WHERE title = 'Vegetação Saudável no Parque da Cidade'), (SELECT id FROM users WHERE username = 'cidadao_verde'), 'confirm', 4, 'Concordo, área bem preservada.', 'citizen'),
((SELECT id FROM observations WHERE title = 'Desmatamento em Área Urbana'), (SELECT id FROM users WHERE username = 'admin'), 'confirm', 5, 'Situação crítica confirmada.', 'expert'),
((SELECT id FROM observations WHERE title = 'Desmatamento em Área Urbana'), (SELECT id FROM users WHERE username = 'cidadao_verde'), 'confirm', 5, 'Realmente preocupante.', 'citizen');

-- Inserir alguns alertas de exemplo
INSERT INTO alerts (user_id, monitored_area_id, alert_type, severity, latitude, longitude, title, description, current_value, threshold_value, change_percentage, status) VALUES
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM monitored_areas WHERE name = 'Fragmento Urbano SP'), 'ndvi_drop', 'high', -23.5505, -46.6333, 'Queda Significativa no NDVI', 'Detectada redução de 15% no NDVI da área monitorada.', 0.46, 0.54, -15.0, 'active'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM monitored_areas WHERE name = 'Parque da Cidade - Brasília'), 'anomaly', 'medium', -15.7942, -47.8822, 'Anomalia Detectada', 'Padrão atípico nos dados de vegetação.', 0.68, 0.65, 4.6, 'acknowledged');

-- Atribuir algumas conquistas aos usuários
INSERT INTO user_achievements (user_id, achievement_id, progress, is_unlocked, unlocked_at) VALUES
-- Admin
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Primeiro Olhar'), '{}', true, NOW() - INTERVAL '30 days'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Observador Dedicado'), '{}', true, NOW() - INTERVAL '20 days'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Guardião da Natureza'), '{}', true, NOW() - INTERVAL '10 days'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Primeira Validação'), '{}', true, NOW() - INTERVAL '25 days'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Validador Confiável'), '{}', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM achievements WHERE name = 'Guardião Iniciante'), '{}', true, NOW() - INTERVAL '28 days'),

-- Pesquisador
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM achievements WHERE name = 'Primeiro Olhar'), '{}', true, NOW() - INTERVAL '25 days'),
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM achievements WHERE name = 'Observador Dedicado'), '{}', true, NOW() - INTERVAL '18 days'),
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM achievements WHERE name = 'Primeira Validação'), '{}', true, NOW() - INTERVAL '22 days'),
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM achievements WHERE name = 'Validador Confiável'), '{}', true, NOW() - INTERVAL '12 days'),
((SELECT id FROM users WHERE username = 'pesquisador'), (SELECT id FROM achievements WHERE name = 'Cientista Cidadão'), '{}', true, NOW() - INTERVAL '8 days'),

-- Cidadão Verde
((SELECT id FROM users WHERE username = 'cidadao_verde'), (SELECT id FROM achievements WHERE name = 'Primeiro Olhar'), '{}', true, NOW() - INTERVAL '20 days'),
((SELECT id FROM users WHERE username = 'cidadao_verde'), (SELECT id FROM achievements WHERE name = 'Primeira Validação'), '{}', true, NOW() - INTERVAL '18 days'),
((SELECT id FROM users WHERE username = 'cidadao_verde'), (SELECT id FROM achievements WHERE name = 'Guardião Iniciante'), '{}', true, NOW() - INTERVAL '15 days'),
((SELECT id FROM users WHERE username = 'cidadao_verde'), (SELECT id FROM achievements WHERE name = 'Explorador Local'), '{}', true, NOW() - INTERVAL '10 days');

-- Atualizar contadores dos usuários baseado nos dados inseridos
UPDATE users SET 
    observations_count = (SELECT COUNT(*) FROM observations WHERE user_id = users.id),
    validations_count = (SELECT COUNT(*) FROM observation_validations WHERE validator_id = users.id)
WHERE id IN (
    SELECT id FROM users WHERE username IN ('admin', 'pesquisador', 'cidadao_verde')
);