# Guia de Deploy - Template

> Este arquivo serve como template para documentar processos de deploy e infraestrutura. Adapte conforme necessário.

## Visão Geral

### Arquitetura de Deploy
- **Frontend**: [Plataforma] (ex: Vercel, Netlify)
- **Backend**: [Plataforma] (ex: Railway, Heroku)
- **Banco de Dados**: [Serviço] (ex: Supabase, PostgreSQL)
- **CDN**: [Serviço] (ex: Cloudflare)
- **Monitoramento**: [Ferramenta] (ex: Sentry)

### Ambientes
- **Development**: Ambiente local
- **Staging**: Ambiente de testes
- **Production**: Ambiente de produção

## Configuração de Ambientes

### Variáveis de Ambiente

#### Desenvolvimento
```env
# .env.development
NODE_ENV=development
API_URL=http://localhost:8000
DATABASE_URL=postgresql://user:pass@localhost:5432/db_dev
REDIS_URL=redis://localhost:6379
```

#### Staging
```env
# .env.staging
NODE_ENV=staging
API_URL=https://api-staging.exemplo.com
DATABASE_URL=postgresql://user:pass@staging-db:5432/db_staging
REDIS_URL=redis://staging-redis:6379
```

#### Produção
```env
# .env.production
NODE_ENV=production
API_URL=https://api.exemplo.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/db_prod
REDIS_URL=redis://prod-redis:6379

# Secrets
JWT_SECRET=seu_jwt_secret_super_seguro
API_KEY_EXTERNAL=sua_api_key_externa
```

## Deploy Frontend

### Vercel

#### Configuração Inicial
1. Conectar repositório GitHub
2. Configurar build settings:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

#### Variáveis de Ambiente
```bash
# Via Vercel CLI
vercel env add VITE_API_URL production
vercel env add VITE_APP_NAME production
```

#### Deploy Manual
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Netlify

#### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## Deploy Backend

### Railway

#### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python main.py",
    "healthcheckPath": "/health"
  }
}
```

#### Configuração
1. Conectar repositório
2. Configurar variáveis de ambiente
3. Configurar domínio customizado

### Docker

#### Dockerfile
```dockerfile
# Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## CI/CD Pipeline

### GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: |
          # Deploy commands for staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          # Deploy commands for production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Banco de Dados

### Migrações

#### Desenvolvimento
```bash
# Criar migração
npm run migration:create nome_da_migracao

# Executar migrações
npm run migration:run

# Reverter migração
npm run migration:revert
```

#### Produção
```bash
# Backup antes da migração
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Executar migrações
npm run migration:run:prod
```

### Backup e Restore

```bash
# Backup automático (cron job)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Restore
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

## Monitoramento

### Health Checks

#### Frontend
```javascript
// public/health
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

#### Backend
```python
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "database": "connected" if db.is_connected() else "disconnected"
    }
```

### Logs

#### Estrutura de Logs
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "message": "User logged in",
  "user_id": "123",
  "request_id": "abc-def-ghi",
  "environment": "production"
}
```

#### Agregação
- **Development**: Console logs
- **Staging/Production**: Centralized logging (ex: LogRocket, Sentry)

### Métricas

#### Performance
- **Response Time**: < 200ms (95th percentile)
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%

#### Business
- **Daily Active Users**
- **Conversion Rate**
- **Feature Usage**

## Segurança

### HTTPS
- Certificados SSL automáticos
- Redirect HTTP → HTTPS
- HSTS headers

### Headers de Segurança
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Secrets Management
- Nunca commitar secrets
- Usar variáveis de ambiente
- Rotacionar chaves regularmente
- Usar serviços de secrets (AWS Secrets Manager, etc.)

## Rollback

### Estratégia
1. **Identificar problema**
2. **Avaliar impacto**
3. **Decidir: fix forward ou rollback**
4. **Executar rollback se necessário**
5. **Comunicar status**

### Comandos

#### Vercel
```bash
# Listar deployments
vercel ls

# Promover deployment anterior
vercel promote [deployment-url]
```

#### Railway
```bash
# Via dashboard ou CLI
railway rollback [deployment-id]
```

## Troubleshooting

### Problemas Comuns

#### Build Failures
1. Verificar logs de build
2. Testar build localmente
3. Verificar dependências
4. Verificar variáveis de ambiente

#### Performance Issues
1. Verificar métricas
2. Analisar logs
3. Verificar banco de dados
4. Verificar CDN

#### Database Issues
1. Verificar conexões
2. Analisar queries lentas
3. Verificar espaço em disco
4. Verificar locks

### Comandos Úteis

```bash
# Verificar status dos serviços
curl -f https://api.exemplo.com/health

# Verificar logs
vercel logs
railway logs

# Verificar métricas
top
htop
df -h
```

## Checklist de Deploy

### Pré-Deploy
- [ ] Testes passando
- [ ] Code review aprovado
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco realizado
- [ ] Comunicação para stakeholders

### Durante Deploy
- [ ] Monitorar logs
- [ ] Verificar health checks
- [ ] Testar funcionalidades críticas
- [ ] Verificar métricas

### Pós-Deploy
- [ ] Smoke tests
- [ ] Verificar alertas
- [ ] Comunicar sucesso
- [ ] Documentar mudanças
- [ ] Planejar próximos passos

## Contatos de Emergência

- **DevOps**: [email/slack]
- **Backend**: [email/slack]
- **Frontend**: [email/slack]
- **Suporte**: [email/telefone]