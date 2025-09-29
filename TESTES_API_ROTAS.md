# Testes das Principais Rotas - OrBee.Online API

Este documento contém exemplos de testes para as principais rotas da API OrBee.Online, organizadas por funcionalidade.

## 📋 Índice

- [Configuração Base](#configuração-base)
- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Observações](#observações)
- [Validações](#validações)
- [Dados NDVI](#dados-ndvi)
- [Recomendações](#recomendações)
- [Geolocalização](#geolocalização)
- [Planos de Ação](#planos-de-ação)
- [Áreas de Interesse](#áreas-de-interesse)
- [Health Check](#health-check)

## 📊 Resumo de Progresso

### 🔐 Autenticação (7 rotas)

- [ ] Registro de Usuário
- [ ] Login
- [ ] Teste de Registro
- [ ] Token de Teste
- [ ] Informações do Usuário
- [ ] Renovar Token
- [ ] Logout

### 👥 Usuários (2 rotas)

- [ ] Listar Usuários (Admin)
- [ ] Perfil Público

### 📊 Observações (12 rotas)

- [ ] Criar Observação
- [ ] Listar Observações
- [ ] Buscar Observações
- [ ] Observações Próximas
- [ ] Observações Recentes
- [ ] Observações Validadas
- [ ] Estatísticas
- [ ] Minhas Observações
- [ ] Obter por ID
- [ ] Atualizar
- [ ] Deletar
- [ ] Verificar Validação

### ✅ Validações (9 rotas)

- [ ] Criar Validação
- [ ] Listar Validações
- [ ] Validações Recentes
- [ ] Estatísticas
- [ ] Resumo
- [ ] Minhas Validações
- [ ] Obter por ID
- [ ] Atualizar
- [ ] Deletar

### 🌱 Dados NDVI (9 rotas)

- [ ] Dados por Coordenadas (POST)
- [ ] Dados por Coordenadas (GET)
- [ ] NDVI por AOI
- [ ] Alertas NDVI
- [ ] NDVI Atual
- [ ] Série Temporal
- [ ] Saúde da Vegetação
- [ ] Histórico por Município
- [ ] Análise de Tendência

### 💡 Recomendações (6 rotas)

- [ ] Buscar Recomendações
- [ ] Recomendações Personalizadas
- [ ] Recomendações por NDVI
- [ ] Categorias
- [ ] Biomas
- [ ] Públicos-Alvo

### 🗺️ Geolocalização (4 rotas)

- [ ] Buscar Municípios (Local)
- [ ] Buscar Municípios (IBGE)
- [ ] Buscar Municípios (OSM)
- [ ] Geometria do Município

### 📋 Planos de Ação (2 rotas)

- [ ] Plano para Município
- [ ] Plano para Município (Teste)

### 🎯 Áreas de Interesse (1 rota)

- [ ] AOI Mata Ciliar Sinimbu

### 🏥 Health Check (2 rotas)

- [ ] Status da API
- [ ] Health Check

**Total: 44 rotas para testar**

---

## 🔧 Configuração Base

**Base URL:** `http://localhost:8000`  
**API Version:** `/api/v1`  
**Content-Type:** `application/json`

### Headers Necessários

```http
Content-Type: application/json
Authorization: Bearer <token>
```

---

## 🔐 Autenticação

### 1. Registro de Usuário

- [x] **POST** `/api/v1/auth/register`

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "full_name": "João Silva",
  "username": "joao_silva"
}
```

**Resposta de Sucesso (201):**

```json
{
   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
   "token_type": "bearer",
   "expires_in": 1800,
   "user": {
      "id": "uuid-do-usuario",
      "email": "usuario@exemplo.com",
      "full_name": "João Silva",
      "username": "joao_silva",
      "role": "citizen",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "observation_count": 0,
      "validation_count": 0,
      "points": 0,
      "level": 1
   }
}
```

### 2. Login

- [x] **POST** `/api/v1/auth/login`

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### 3. Teste de Registro (Desenvolvimento)

- [x] **POST** `/api/v1/auth/test-register`

```http
POST /api/v1/auth/test-register
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "senha123",
  "full_name": "Usuário Teste",
  "username": "usuario_teste"
}
```

### 4. Obter Token de Teste

- [x] **POST** `/api/v1/auth/test-token`

```http
POST /api/v1/auth/test-token
```

### 5. Informações do Usuário Atual

- [x] **GET** `/api/v1/auth/me`

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### 6. Renovar Token

- [x] **POST** `/api/v1/auth/refresh`

```http
POST /api/v1/auth/refresh
Authorization: Bearer <token>
```

### 7. Logout

- [x] **POST** `/api/v1/auth/logout`

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

## 👥 Usuários

### 1. Listar Usuários (Admin)

- [x] **GET** `/api/v1/users/`

```http
GET /api/v1/users/?skip=0&limit=20
Authorization: Bearer <admin_token>
```

### 2. Perfil Público do Usuário

- [x] **GET** `/api/v1/users/profile/{user_id}`

```http
GET /api/v1/users/profile/{user_id}
```

---

## 📊 Observações

### 1. Criar Observação

- [x] **POST** `/api/v1/observations/`

```http
POST /api/v1/observations/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Degradação na mata ciliar",
  "description": "Área com sinais de desmatamento próximo ao rio",
  "observation_type": "degradation",
  "latitude": -29.7175,
  "longitude": -52.4264,
  "location_name": "Sinimbu, RS",
  "tags": ["mata-ciliar", "degradação"],
  "images": ["url1.jpg", "url2.jpg"]
}
```

### 2. Listar Observações

- [x] **GET** `/api/v1/observations/`

```http
GET /api/v1/observations/?skip=0&limit=20&observation_type=degradation&status=pending
Authorization: Bearer <token>
```

### 3. Buscar Observações

- [x] **GET** `/api/v1/observations/search`

```http
GET /api/v1/observations/search?q=degradacao&skip=0&limit=20
Authorization: Bearer <token>
```

### 4. Observações Próximas

- [x] **GET** `/api/v1/observations/nearby`

```http
GET /api/v1/observations/nearby?lat=-29.7175&lon=-52.4264&radius_km=5&limit=10
Authorization: Bearer <token>
```

### 5. Observações Recentes

- [x] **GET** `/api/v1/observations/recent`

```http
GET /api/v1/observations/recent?days=7&limit=20
```

### 6. Observações Validadas

- [x] **GET** `/api/v1/observations/validated`

```http
GET /api/v1/observations/validated?skip=0&limit=20
```

### 7. Estatísticas de Observações

- [x] **GET** `/api/v1/observations/stats`

```http
GET /api/v1/observations/stats?user_id=uuid&days=30
Authorization: Bearer <token>
```

### 8. Minhas Observações

- [x] **GET** `/api/v1/observations/my`

```http
GET /api/v1/observations/my?skip=0&limit=20
Authorization: Bearer <token>
```

### 9. Obter Observação por ID

- [ ] **GET** `/api/v1/observations/{observation_id}`

```http
GET /api/v1/observations/{observation_id}
Authorization: Bearer <token>
```

### 10. Atualizar Observação

- [ ] **PUT** `/api/v1/observations/{observation_id}`

```http
PUT /api/v1/observations/{observation_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "status": "validated"
}
```

### 11. Deletar Observação

- [ ] **DELETE** `/api/v1/observations/{observation_id}`

```http
DELETE /api/v1/observations/{observation_id}
Authorization: Bearer <token>
```

### 12. Verificar se Pode Validar

- [ ] **GET** `/api/v1/observations/{observation_id}/can-validate`

```http
GET /api/v1/observations/{observation_id}/can-validate
Authorization: Bearer <token>
```

---

## ✅ Validações

### 1. Criar Validação

- [ ] **POST** `/api/v1/validations/`

```http
POST /api/v1/validations/
Authorization: Bearer <token>
Content-Type: application/json

{
  "observation_id": "uuid-da-observacao",
  "validation_type": "confirm",
  "comment": "Confirma a degradação observada",
  "confidence_level": "high"
}
```

### 2. Listar Validações

- [ ] **GET** `/api/v1/validations/`

```http
GET /api/v1/validations/?skip=0&limit=20&observation_id=uuid&user_id=uuid
Authorization: Bearer <token>
```

### 3. Validações Recentes

- [ ] **GET** `/api/v1/validations/recent`

```http
GET /api/v1/validations/recent?limit=20
```

### 4. Estatísticas de Validações

- [ ] **GET** `/api/v1/validations/stats`

```http
GET /api/v1/validations/stats?user_id=uuid
Authorization: Bearer <token>
```

### 5. Resumo de Validações

- [ ] **GET** `/api/v1/validations/summary`

```http
GET /api/v1/validations/summary
```

### 6. Minhas Validações

- [ ] **GET** `/api/v1/validations/my`

```http
GET /api/v1/validations/my?skip=0&limit=20
Authorization: Bearer <token>
```

### 7. Obter Validação por ID

- [ ] **GET** `/api/v1/validations/{validation_id}`

```http
GET /api/v1/validations/{validation_id}
```

### 8. Atualizar Validação

- [ ] **PUT** `/api/v1/validations/{validation_id}`

```http
PUT /api/v1/validations/{validation_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "validation_type": "reject",
  "comment": "Não confirma a observação",
  "confidence_level": "medium"
}
```

### 9. Deletar Validação

- [ ] **DELETE** `/api/v1/validations/{validation_id}`

```http
DELETE /api/v1/validations/{validation_id}
Authorization: Bearer <token>
```

---

## 🌱 Dados NDVI

### 1. Dados NDVI por Coordenadas (POST)

- [ ] **POST** `/api/v1/ndvi/data`

```http
POST /api/v1/ndvi/data
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": -29.7175,
  "longitude": -52.4264,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### 2. Dados NDVI por Coordenadas (GET)

- [ ] **GET** `/api/v1/ndvi/data`

```http
GET /api/v1/ndvi/data?latitude=-29.7175&longitude=-52.4264&start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>
```

### 3. NDVI por Área de Interesse

- [ ] **POST** `/api/v1/ndvi/aoi`

```http
POST /api/v1/ndvi/aoi
Authorization: Bearer <token>
Content-Type: application/json

{
  "municipality_code": "4320676",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-52.6, -29.45], [-52.3, -29.45], [-52.3, -29.75], [-52.6, -29.75], [-52.6, -29.45]]]
  },
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "max_cloud": 30,
  "superres": false
}
```

### 4. Alertas NDVI

- [ ] **GET** `/api/v1/ndvi/alerts`

```http
GET /api/v1/ndvi/alerts?latitude=-29.7175&longitude=-52.4264
Authorization: Bearer <token>
```

### 5. NDVI Atual

- [ ] **GET** `/api/v1/ndvi/current`

```http
GET /api/v1/ndvi/current?latitude=-29.7175&longitude=-52.4264
Authorization: Bearer <token>
```

### 6. Série Temporal NDVI

- [ ] **GET** `/api/v1/ndvi/timeseries`

```http
GET /api/v1/ndvi/timeseries?latitude=-29.7175&longitude=-52.4264&days=90
Authorization: Bearer <token>
```

### 7. Saúde da Vegetação

- [ ] **GET** `/api/v1/ndvi/health`

```http
GET /api/v1/ndvi/health?latitude=-29.7175&longitude=-52.4264
Authorization: Bearer <token>
```

### 8. Histórico NDVI por Município

- [ ] **GET** `/api/v1/ndvi/history/{municipality_code}`

```http
GET /api/v1/ndvi/history/4320676?days=90&limit=100
Authorization: Bearer <token>
```

### 9. Análise de Tendência NDVI

- [ ] **GET** `/api/v1/ndvi/trend/{municipality_code}`

```http
GET /api/v1/ndvi/trend/4320676?days=30
Authorization: Bearer <token>
```

---

## 💡 Recomendações

### 1. Buscar Recomendações

- [ ] **GET** `/api/v1/recommendations/`

```http
GET /api/v1/recommendations/?latitude=-29.7175&longitude=-52.4264&ndvi_value=0.3&biome=cerrado&target_audience=citizen&limit=10
```

### 2. Recomendações Personalizadas

- [ ] **GET** `/api/v1/recommendations/personalized`

```http
GET /api/v1/recommendations/personalized?latitude=-29.7175&longitude=-52.4264&ndvi_value=0.3&limit=5
Authorization: Bearer <token>
```

### 3. Recomendações por NDVI

- [ ] **GET** `/api/v1/recommendations/by-ndvi`

```http
GET /api/v1/recommendations/by-ndvi?ndvi_value=0.3&biome=cerrado&target_audience=citizen&limit=5
```

### 4. Categorias de Recomendações

- [ ] **GET** `/api/v1/recommendations/categories`

```http
GET /api/v1/recommendations/categories
```

### 5. Biomas Disponíveis

- [ ] **GET** `/api/v1/recommendations/biomes`

```http
GET /api/v1/recommendations/biomes
```

### 6. Públicos-Alvo

- [ ] **GET** `/api/v1/recommendations/audiences`

```http
GET /api/v1/recommendations/audiences
```

---

## 🗺️ Geolocalização

### 1. Buscar Municípios

- [ ] **GET** `/api/v1/geo/search`

```http
GET /api/v1/geo/search?q=sinimbu&source=local
```

**Com IBGE:**

- [ ] **GET** `/api/v1/geo/search` (IBGE)

```http
GET /api/v1/geo/search?q=sinimbu&source=ibge
```

**Com OSM:**

- [ ] **GET** `/api/v1/geo/search` (OSM)

```http
GET /api/v1/geo/search?q=sinimbu&source=osm
```

### 2. Geometria do Município

- [ ] **GET** `/api/v1/geo/municipalities/{code}/geometry`

```http
GET /api/v1/geo/municipalities/4320676/geometry?source=osm
```

---

## 📋 Planos de Ação

### 1. Plano de Ação para Município

- [ ] **GET** `/api/v1/plan/municipality/{code}`

```http
GET /api/v1/plan/municipality/4320676?source=osm
Authorization: Bearer <token>
```

### 2. Plano de Ação para Município (Teste)

- [ ] **GET** `/api/v1/plan/municipality/{code}/test`

```http
GET /api/v1/plan/municipality/4320676/test?source=osm
```

---

## 🎯 Áreas de Interesse

### 1. AOI Mata Ciliar Sinimbu

- [ ] **GET** `/api/v1/aoi/sinimbu/riparian`

```http
GET /api/v1/aoi/sinimbu/riparian
```

---

## 🏥 Health Check

### 1. Status da API

- [ ] **GET** `/`

```http
GET /
```

### 2. Health Check

- [ ] **GET** `/health`

```http
GET /health
```

---

## 📝 Exemplos de Respostas

### Resposta de Erro (400)

```json
{
   "detail": "Dados inválidos fornecidos"
}
```

### Resposta de Erro (401)

```json
{
   "detail": "Token de acesso inválido ou expirado"
}
```

### Resposta de Erro (403)

```json
{
   "detail": "Acesso negado. Permissões insuficientes"
}
```

### Resposta de Erro (404)

```json
{
   "detail": "Recurso não encontrado"
}
```

### Resposta de Erro (500)

```json
{
   "detail": "Erro interno do servidor"
}
```

---

## 🧪 Scripts de Teste

### Teste com cURL - Registro

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "full_name": "Usuário Teste",
    "username": "usuario_teste"
  }'
```

### Teste com cURL - Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

### Teste com cURL - Dados NDVI

```bash
curl -X GET "http://localhost:8000/api/v1/ndvi/current?latitude=-29.7175&longitude=-52.4264" \
  -H "Authorization: Bearer <seu_token>"
```

### Teste com cURL - Buscar Municípios

```bash
curl -X GET "http://localhost:8000/api/v1/geo/search?q=sinimbu&source=local"
```

---

## 📊 Códigos de Status HTTP

| Código | Significado           | Uso                                    |
| ------ | --------------------- | -------------------------------------- |
| 200    | OK                    | Requisição bem-sucedida                |
| 201    | Created               | Recurso criado com sucesso             |
| 204    | No Content            | Operação bem-sucedida sem retorno      |
| 400    | Bad Request           | Dados inválidos                        |
| 401    | Unauthorized          | Token inválido ou ausente              |
| 403    | Forbidden             | Permissões insuficientes               |
| 404    | Not Found             | Recurso não encontrado                 |
| 422    | Unprocessable Entity  | Dados válidos mas processamento falhou |
| 500    | Internal Server Error | Erro interno do servidor               |

---

## 🔍 Parâmetros de Query Comuns

### Paginação

- `skip`: Número de registros para pular (padrão: 0)
- `limit`: Número máximo de registros (padrão: 20, máximo: 100)

### Filtros de Data

- `start_date`: Data inicial (formato: YYYY-MM-DD)
- `end_date`: Data final (formato: YYYY-MM-DD)
- `days`: Número de dias para buscar (padrão: 7-365)

### Coordenadas

- `latitude`: Latitude (-90 a 90)
- `longitude`: Longitude (-180 a 180)
- `radius_km`: Raio em quilômetros (padrão: 5, máximo: 50)

### NDVI

- `ndvi_value`: Valor NDVI (0.0 a 1.0)
- `max_cloud`: Máximo de cobertura de nuvens (0-100)

---

## 🚀 Como Executar os Testes

1. **Inicie o servidor:**

   ```bash
   cd backend
   python main.py
   ```

2. **Teste a conectividade:**

   ```bash
   curl http://localhost:8000/health
   ```

3. **Execute os testes de autenticação:**
   - Registre um usuário
   - Faça login
   - Use o token nas requisições autenticadas

4. **Teste as funcionalidades principais:**
   - Dados NDVI
   - Observações
   - Validações
   - Recomendações

---

## 📚 Documentação Adicional

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`

---

_Este documento foi gerado automaticamente baseado na estrutura da API OrBee.Online. Para informações mais detalhadas, consulte a documentação interativa no Swagger UI._
