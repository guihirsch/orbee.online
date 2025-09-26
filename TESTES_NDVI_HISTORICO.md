# Testes dos Novos Endpoints NDVI

## 1. Testar Salvamento Automático de Histórico

```bash
# 1. Buscar plano de ação para um município (salva automaticamente no histórico)
curl -X GET "http://localhost:8000/api/v1/plan/municipality/4320676?source=osm" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" | jq

# 2. Verificar se foi salvo no histórico
curl -X GET "http://localhost:8000/api/v1/ndvi/history/4320676?days=30&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN" | jq
```

## 2. Testar Análise de Tendência

```bash
# Análise de tendência dos últimos 30 dias
curl -X GET "http://localhost:8000/api/v1/ndvi/trend/4320676?days=30" \
  -H "Authorization: Bearer SEU_TOKEN" | jq
```

## 3. Verificar no Supabase

1. Acesse o Supabase Dashboard
2. Vá para Table Editor
3. Verifique a tabela `ndvi_history`
4. Deve haver registros com:
   - `municipality_code`: "4320676"
   - `ndvi_value`: valor do NDVI
   - `trend`: "improving", "stable", ou "declining"
   - `vegetation_status`: "excellent", "good", "moderate", "poor", "critical"

## 4. Teste de Múltiplos Municípios

```bash
# Testar com diferentes municípios
curl -X GET "http://localhost:8000/api/v1/plan/municipality/3550308?source=osm" \
  -H "Authorization: Bearer SEU_TOKEN" | jq  # São Paulo

curl -X GET "http://localhost:8000/api/v1/plan/municipality/3304557?source=osm" \
  -H "Authorization: Bearer SEU_TOKEN" | jq  # Rio de Janeiro
```

## 5. Verificar Logs do Backend

No terminal do backend, deve aparecer:

```
INFO: Histórico NDVI salvo para município 4320676
```

## 6. Teste de Performance

```bash
# Testar cache - segunda chamada deve ser mais rápida
time curl -X GET "http://localhost:8000/api/v1/plan/municipality/4320676?source=osm" \
  -H "Authorization: Bearer SEU_TOKEN" | jq
```
