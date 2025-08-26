# Fluxo de Dados na Experiência do Usuário

## Visão Geral

Este documento descreve o fluxo completo de dados desde a entrada do usuário até a apresentação das informações na plataforma OrBee.Online.

## 1. Entrada de Dados do Usuário

### 1.1 Localização
- **Campo**: `latitude` (float, -90 a 90)
- **Campo**: `longitude` (float, -180 a 180)
- **Campo**: `location` (string, nome da cidade/região)
- **Fonte**: Geolocalização do navegador ou busca por cidade

### 1.2 Autenticação
- **Campo**: `email` (string, formato email)
- **Campo**: `password` (string, mínimo 8 caracteres)
- **Campo**: `name` (string, nome completo)
- **Campo**: `avatar_url` (string, URL da imagem)

### 1.3 Observações Comunitárias
- **Campo**: `observation_type` (enum: DEFORESTATION, RECOVERY, FIRE, WATER_STRESS, HEALTHY)
- **Campo**: `description` (string, 10-1000 caracteres)
- **Campo**: `images` (array[string], máximo 5 URLs)
- **Campo**: `rating` (integer, 1-5)
- **Campo**: `latitude` (float)
- **Campo**: `longitude` (float)

### 1.4 Validações
- **Campo**: `observation_id` (string, UUID)
- **Campo**: `status` (enum: CONFIRMED, DISPUTED, PENDING)
- **Campo**: `comment` (string, máximo 1000 caracteres)
- **Campo**: `confidence_level` (integer, 1-5)
- **Campo**: `evidence_images` (array[string], máximo 3 URLs)

## 2. Processamento de Dados NDVI

### 2.1 Requisição para Sentinel Hub
- **Campo**: `bbox` (array[float], coordenadas do bounding box)
- **Campo**: `time` (string, período de análise)
- **Campo**: `width` (integer, largura da imagem)
- **Campo**: `height` (integer, altura da imagem)
- **Campo**: `format` (string, formato de saída)

### 2.2 Resposta NDVI
- **Campo**: `ndvi_value` (float, 0-1)
- **Campo**: `ndvi_date` (datetime, data da captura)
- **Campo**: `cloud_coverage` (float, percentual de nuvens)
- **Campo**: `quality_score` (float, qualidade dos dados)

## 3. Dados de Saída para o Frontend

### 3.1 Mapa Interativo
- **Campo**: `geojson` (object, dados geoespaciais)
- **Campo**: `ndvi_layers` (array[object], camadas NDVI)
- **Campo**: `observations` (array[Observation], observações da região)
- **Campo**: `center` (array[float], centro do mapa)
- **Campo**: `zoom` (integer, nível de zoom)

### 3.2 Gráfico Temporal
- **Campo**: `time_series` (array[NDVIDataPoint])
  - `date` (datetime)
  - `ndvi_value` (float)
  - `quality` (string)
- **Campo**: `trend` (string, INCREASING, DECREASING, STABLE)
- **Campo**: `seasonal_pattern` (array[float], padrão sazonal)

### 3.3 Recomendações
- **Campo**: `id` (string, UUID)
- **Campo**: `title` (string, título da recomendação)
- **Campo**: `description` (string, descrição detalhada)
- **Campo**: `priority` (string, HIGH, MEDIUM, LOW)
- **Campo**: `category` (string, tipo de recomendação)
- **Campo**: `applicable_regions` (array[string], regiões aplicáveis)
- **Campo**: `created_at` (datetime)

### 3.4 Estatísticas
- **Campo**: `total_observations` (integer)
- **Campo**: `pending_observations` (integer)
- **Campo**: `validated_observations` (integer)
- **Campo**: `rejected_observations` (integer)
- **Campo**: `observations_by_type` (object, contagem por tipo)
- **Campo**: `recent_observations` (integer, últimos 7 dias)

## 4. Fluxo de Validação Comunitária

### 4.1 Entrada de Validação
1. Usuário seleciona observação para validar
2. Sistema verifica se usuário pode validar (não é autor, não validou antes)
3. Usuário preenche formulário de validação
4. Sistema salva validação no banco
5. Sistema atualiza contadores da observação

### 4.2 Cálculo de Status da Observação
- **Regra**: Mínimo 3 validações para determinar status
- **Validada**: 70% ou mais confirmações
- **Rejeitada**: 70% ou mais disputas
- **Em análise**: Entre 30-70% de cada tipo
- **Pendente**: Menos de 3 validações

## 5. Sistema de Pontuação

### 5.1 Pontos por Ação
- **Observação criada**: 10 pontos
- **Validação realizada**: 5 pontos
- **Observação validada pela comunidade**: +15 pontos bônus
- **Primeira observação em área**: +20 pontos bônus

### 5.2 Níveis de Usuário
- **Iniciante**: 0-99 pontos
- **Observador**: 100-499 pontos
- **Guardião**: 500-1499 pontos
- **Especialista**: 1500+ pontos

## 6. Notificações e Alertas

### 6.1 Tipos de Notificação
- **Campo**: `type` (string, EMAIL, WHATSAPP, PUSH)
- **Campo**: `title` (string, título da notificação)
- **Campo**: `message` (string, conteúdo)
- **Campo**: `data` (object, dados adicionais)
- **Campo**: `scheduled_for` (datetime, agendamento)

### 6.2 Preferências do Usuário
- **Campo**: `email_alerts` (boolean, padrão true)
- **Campo**: `whatsapp_alerts` (boolean, padrão false)
- **Campo**: `weekly_reports` (boolean, padrão true)
- **Campo**: `community_updates` (boolean, padrão true)

## 7. Integração com APIs Externas

### 7.1 Copernicus/Sentinel Hub
- **Endpoint**: `/api/v1/process`
- **Autenticação**: OAuth2 Bearer Token
- **Rate Limit**: 1000 requisições/mês (plano gratuito)
- **Formato**: GeoTIFF ou PNG

### 7.2 Geocoding (Nominatim)
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Formato**: JSON
- **Rate Limit**: 1 requisição/segundo

## 8. Armazenamento de Dados

### 8.1 Banco Principal (Supabase PostgreSQL)
- **Tabelas**: users, observations, validations, recommendations, alerts
- **Índices**: Geoespaciais (PostGIS), temporais, por usuário
- **Backup**: Automático diário

### 8.2 Armazenamento de Imagens
- **Serviço**: Supabase Storage
- **Formato**: WebP (otimizado)
- **Tamanho máximo**: 5MB por imagem
- **CDN**: Distribuição global automática

## 9. Cache e Performance

### 9.1 Cache de Dados NDVI
- **TTL**: 24 horas para dados recentes
- **TTL**: 7 dias para dados históricos
- **Estratégia**: Cache-aside pattern

### 9.2 Cache de Recomendações
- **TTL**: 1 hora
- **Invalidação**: Por mudança de dados base
- **Estratégia**: Write-through cache