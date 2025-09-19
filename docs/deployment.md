# Guia de Deploy - OrBee.Online

## Visão Geral

O OrBee.Online utiliza uma arquitetura moderna com deploy automatizado e infraestrutura escalável. Este guia cobre o processo completo de deploy da aplicação, desde o desenvolvimento local até a produção.

**Stack de Deploy:**

- **Frontend**: Railway (deploy automático via Git)
- **Backend**: FastAPI (futuro)
- **Banco de Dados**: Supabase (PostgreSQL gerenciado)
- **CDN**: Railway Edge Network
- **Monitoramento**: Railway Analytics + Supabase Dashboard

---

## Preparação para Deploy

### 1. Build de Produção

#### Verificação Pré-Deploy

```bash
# Instalar dependências
npm install

# Executar linting
npm run lint

# Executar testes (quando implementados)
npm run test

# Build de produção
npm run build

# Preview local do build
npm run preview
```

#### Otimizações Automáticas

O Vite automaticamente aplica as seguintes otimizações no build:

- **Minificação**: JavaScript, CSS e HTML
- **Tree Shaking**: Remoção de código não utilizado
- **Code Splitting**: Divisão automática de chunks
- **Asset Optimization**: Compressão de imagens e assets
- **CSS Purging**: Remoção de CSS não utilizado (Tailwind)

---

## Deploy no Railway

### 1. Configuração Inicial

#### Pré-requisitos

- Conta no [Railway](https://railway.app)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Variáveis de ambiente configuradas

#### Conectar Repositório

1. **Acesse o Railway Dashboard**

   ```
   https://railway.app/dashboard
   ```

2. **Criar Novo Projeto**

   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório `orbee.online`

3. **Configuração Automática**
   - Railway detecta automaticamente o projeto Vite
   - Configura build command: `npm run build`
   - Define start command: `npm run preview`

### 2. Variáveis de Ambiente

#### Configuração no Railway

```bash
# Variáveis obrigatórias
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_MAPBOX_ACCESS_TOKEN=seu-token-mapbox

# Variáveis opcionais
VITE_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.orbee.online
VITE_SENTRY_DSN=sua-dsn-sentry
```

#### Configuração via CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Definir variáveis
railway variables set VITE_SUPABASE_URL=https://seu-projeto.supabase.co
railway variables set VITE_SUPABASE_ANON_KEY=sua-chave-anonima
railway variables set VITE_MAPBOX_ACCESS_TOKEN=seu-token-mapbox
```

### 3. Configuração de Build

#### railway.json (Opcional)

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

#### Dockerfile (Alternativo)

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. Deploy Automático

#### Configuração de CI/CD

O Railway automaticamente:

- Detecta pushes para a branch `main`
- Executa o build automaticamente
- Faz deploy da nova versão
- Mantém rollback automático em caso de falha

#### Branches e Ambientes

```bash
# Produção (main branch)
git push origin main

# Staging (develop branch)
git push origin develop

# Preview (feature branches)
git push origin feature/nova-funcionalidade
```

---

## Configuração do Supabase

### 1. Setup do Projeto

#### Criar Projeto Supabase

1. **Acesse o Supabase Dashboard**

   ```
   https://app.supabase.com
   ```

2. **Criar Novo Projeto**

   - Nome: `orbee-online`
   - Região: `South America (São Paulo)`
   - Plano: `Free` (para desenvolvimento)

3. **Configurar Banco de Dados**
   ```sql
   -- Habilitar extensões necessárias
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "postgis";
   ```

### 2. Schema do Banco

#### Tabelas Principais

```sql
-- Usuários (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Zonas de monitoramento
CREATE TABLE public.zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  geometry GEOMETRY(POLYGON, 4326) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados NDVI
CREATE TABLE public.ndvi_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  ndvi_value DECIMAL(4,3) NOT NULL,
  satellite_source TEXT DEFAULT 'sentinel-2',
  cloud_coverage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Observações da comunidade
CREATE TABLE public.community_observations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  observation_type TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  location GEOMETRY(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Políticas de Segurança (RLS)

```sql
-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ndvi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_observations ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para zones
CREATE POLICY "Users can view all zones" ON public.zones
  FOR SELECT USING (true);

CREATE POLICY "Users can create own zones" ON public.zones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own zones" ON public.zones
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para NDVI data
CREATE POLICY "Users can view all NDVI data" ON public.ndvi_data
  FOR SELECT USING (true);

-- Políticas para observações
CREATE POLICY "Users can view all observations" ON public.community_observations
  FOR SELECT USING (true);

CREATE POLICY "Users can create own observations" ON public.community_observations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Configuração de Storage

#### Bucket para Imagens

```sql
-- Criar bucket para fotos da comunidade
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-photos', 'community-photos', true);

-- Política de upload
CREATE POLICY "Users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'community-photos' AND
    auth.role() = 'authenticated'
  );

-- Política de visualização
CREATE POLICY "Photos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-photos');
```

---

## Configuração de Domínio

### 1. Domínio Personalizado no Railway

#### Configuração DNS

```bash
# Adicionar registros DNS
Type: CNAME
Name: www
Value: seu-projeto.up.railway.app

Type: A
Name: @
Value: [IP fornecido pelo Railway]
```

#### Configuração no Railway

1. **Acessar Settings do Projeto**
2. **Ir para "Domains"**
3. **Adicionar Custom Domain**
   - Domain: `orbee.online`
   - Subdomain: `www.orbee.online`
4. **Aguardar Verificação SSL**

### 2. Redirecionamentos

#### nginx.conf (se usando Nginx)

```nginx
server {
    listen 80;
    server_name orbee.online www.orbee.online;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Monitoramento e Analytics

### 1. Railway Analytics

#### Métricas Disponíveis

- **Performance**: Response time, throughput
- **Recursos**: CPU, memória, rede
- **Logs**: Application logs, build logs
- **Uptime**: Disponibilidade e health checks

#### Configuração de Alertas

```bash
# Via Railway CLI
railway alerts create --name "High CPU Usage" --metric cpu --threshold 80
railway alerts create --name "Memory Usage" --metric memory --threshold 90
railway alerts create --name "Response Time" --metric response_time --threshold 2000
```

### 2. Supabase Analytics

#### Dashboard Nativo

- **Database**: Queries, connections, performance
- **Auth**: Usuários ativos, registros, logins
- **Storage**: Uso de espaço, uploads
- **API**: Requests, latência, erros

#### Configuração de Alertas

```sql
-- Trigger para monitorar novos usuários
CREATE OR REPLACE FUNCTION notify_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Enviar notificação (webhook, email, etc.)
  PERFORM pg_notify('new_user', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_user();
```

### 3. Monitoramento Externo (Opcional)

#### Sentry para Error Tracking

```javascript
// src/lib/sentry.js
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    tracesSampleRate: 0.1,
  });
}
```

#### Uptime Monitoring

```bash
# Configurar health check endpoint
# src/pages/Health.jsx
export default function Health() {
  return new Response('OK', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}
```

---

## Otimizações de Performance

### 1. Build Optimizations

#### vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mapbox: ["mapbox-gl"],
          charts: ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
  },
});
```

### 2. CDN e Caching

#### Headers de Cache

```javascript
// _headers (para Netlify) ou similar
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/api/*
  Cache-Control: public, max-age=300
```

### 3. Lazy Loading

#### Componentes

```javascript
// Lazy loading de páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Community = lazy(() => import("./pages/Community"));

// Lazy loading de mapas
const NDVIMap = lazy(() => import("./components/NDVIMap"));
```

---

## Segurança

### 1. Variáveis de Ambiente

#### Boas Práticas

```bash
# ✅ Correto - prefixo VITE_ para variáveis públicas
VITE_SUPABASE_URL=https://projeto.supabase.co
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# ❌ Incorreto - chaves privadas não devem ter prefixo VITE_
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MAPBOX_SECRET_KEY=sk.eyJ1...
```

### 2. Content Security Policy

#### Headers de Segurança

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://api.mapbox.com;
  style-src 'self' 'unsafe-inline' https://api.mapbox.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://*.supabase.co https://api.mapbox.com;
  font-src 'self' https://fonts.gstatic.com;
"
/>
```

### 3. Rate Limiting (Supabase)

```sql
-- Função para rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
  user_id UUID,
  action_type TEXT,
  max_requests INTEGER DEFAULT 100,
  time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM rate_limit_log
  WHERE user_id = $1
    AND action_type = $2
    AND created_at > NOW() - time_window;

  IF request_count >= max_requests THEN
    RETURN FALSE;
  END IF;

  INSERT INTO rate_limit_log (user_id, action_type)
  VALUES (user_id, action_type);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## Troubleshooting

### 1. Problemas Comuns de Deploy

#### Build Failures

```bash
# Erro: "Module not found"
# Solução: Verificar imports e dependências
npm install
npm run build

# Erro: "Out of memory"
# Solução: Aumentar limite de memória
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Erro: "Environment variables not found"
# Solução: Verificar configuração no Railway
railway variables
```

#### Runtime Errors

```bash
# Erro 404 em rotas SPA
# Solução: Configurar fallback para index.html

# Erro de CORS
# Solução: Configurar headers no Supabase

# Erro de SSL
# Solução: Aguardar propagação DNS (até 48h)
```

### 2. Logs e Debugging

#### Railway Logs

```bash
# Via CLI
railway logs

# Logs em tempo real
railway logs --follow

# Logs de build
railway logs --build
```

#### Supabase Logs

```sql
-- Logs de queries lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Logs de conexões
SELECT *
FROM pg_stat_activity
WHERE state = 'active';
```

---

## Checklist de Deploy

### ✅ Pré-Deploy

- [ ] Testes passando
- [ ] Build local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências atualizadas
- [ ] Linting sem erros

### ✅ Deploy

- [ ] Railway conectado ao repositório
- [ ] Supabase configurado
- [ ] Domínio configurado (se aplicável)
- [ ] SSL ativo
- [ ] Health checks funcionando

### ✅ Pós-Deploy

- [ ] Aplicação acessível
- [ ] Funcionalidades principais testadas
- [ ] Monitoramento ativo
- [ ] Logs sendo coletados
- [ ] Performance adequada

---

## Rollback e Recovery

### 1. Rollback Automático

O Railway oferece rollback automático:

- Detecta falhas de health check
- Reverte para versão anterior estável
- Notifica via email/Slack

### 2. Rollback Manual

```bash
# Via Railway CLI
railway rollback

# Rollback para versão específica
railway rollback --to-deployment <deployment-id>

# Via Git
git revert <commit-hash>
git push origin main
```

### 3. Backup do Banco

```bash
# Backup automático (Supabase Pro)
# Configurado no dashboard do Supabase

# Backup manual
pg_dump -h db.projeto.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.projeto.supabase.co -U postgres -d postgres < backup.sql
```

---

## Próximos Passos

### 1. Melhorias de Infraestrutura

- [ ] Implementar CDN global
- [ ] Configurar múltiplas regiões
- [ ] Otimizar cache strategies
- [ ] Implementar service workers

### 2. Monitoramento Avançado

- [ ] Real User Monitoring (RUM)
- [ ] Performance budgets
- [ ] Alertas inteligentes
- [ ] Dashboard customizado

### 3. Automação

- [ ] Deploy automático por ambiente
- [ ] Testes de integração
- [ ] Smoke tests pós-deploy
- [ ] Notificações automáticas

---

## Recursos e Links Úteis

- [Railway Documentation](https://docs.railway.app/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)

---

**Importante**: Mantenha este guia atualizado conforme a infraestrutura evolui. Documente todas as mudanças e compartilhe com a equipe.
