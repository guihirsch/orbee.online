# Configuração do Supabase - OrBee.Online

## 1. Criar arquivo .env

Copie o arquivo `env.example` para `.env` e configure suas credenciais:

```bash
# No PowerShell (Windows)
copy env.example .env

# No Linux/Mac
cp env.example .env
```

## 2. Obter credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá para **Settings** → **API**
4. Copie as seguintes informações:

```env
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_KEY=sua_chave_service_aqui
```

## 3. Aplicar migração da tabela ndvi_history

1. No Supabase Dashboard, vá para **SQL Editor**
2. Execute o script: `database/migrations/001_create_ndvi_history.sql`
3. Verifique se a tabela `ndvi_history` foi criada no **Table Editor**

## 4. Configurar Sentinel Hub (opcional)

Para dados NDVI reais:

1. Acesse [sentinel-hub.com](https://sentinel-hub.com)
2. Crie uma conta e obtenha:
   - Client ID
   - Client Secret
   - Instance ID (opcional)

```env
SENTINEL_HUB_CLIENT_ID=seu_client_id_aqui
SENTINEL_HUB_CLIENT_SECRET=seu_client_secret_aqui
SENTINEL_HUB_INSTANCE_ID=opcional
```

## 5. Modo Desenvolvimento (sem Supabase)

Se não quiser configurar o Supabase agora, o sistema funcionará em modo desenvolvimento:

- ✅ Endpoints funcionam normalmente
- ⚠️ Histórico NDVI não é salvo
- ⚠️ Análise de tendências retorna dados mockados
- ✅ Busca de municípios funciona
- ✅ Planos de ação são gerados

## 6. Testar configuração

```bash
# Iniciar servidor
python main.py

# Testar endpoint
curl -X GET "http://localhost:8000/api/v1/plan/municipality/4320676?source=osm" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 7. Verificar logs

No terminal, você deve ver:

- ✅ "Cliente Supabase inicializado" (se configurado)
- ⚠️ "Configurações do Supabase não encontradas - modo desenvolvimento" (se não configurado)
