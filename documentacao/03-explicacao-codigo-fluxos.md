# Explicação do Código de Cada Fluxo

## Visão Geral

Este documento explica de forma didática como cada fluxo da experiência do usuário é implementado no código, seguindo o padrão arquitetural Service-Repository e as melhores práticas de desenvolvimento.

## 1. Arquitetura Geral

### 1.1 Padrão Service-Repository
```
Frontend (React) ↔ API (FastAPI) ↔ Service Layer ↔ Repository Layer ↔ Database (Supabase)
```

**Responsabilidades:**
- **Frontend**: Interface do usuário e experiência
- **API**: Endpoints REST e validação de entrada
- **Service**: Lógica de negócio e orquestração
- **Repository**: Acesso a dados e queries
- **Database**: Persistência e integridade dos dados

### 1.2 Estrutura de Pastas
```
backend/
├── app/
│   ├── api/v1/endpoints/     # Endpoints da API
│   ├── services/             # Lógica de negócio
│   ├── repositories/         # Acesso a dados
│   ├── models/              # Modelos de dados
│   └── core/                # Configurações e utilitários
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Chamadas para API
│   ├── hooks/              # Hooks customizados
│   └── utils/              # Utilitários
```

## 2. Fluxo de Autenticação

### 2.1 Backend - Endpoint de Login
**Arquivo**: `backend/app/api/v1/endpoints/auth.py`

```python
@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # 1. Valida formato dos dados de entrada
    # 2. Chama service para autenticar usuário
    # 3. Retorna token JWT ou erro de autenticação
```

**Decisão Técnica**: Usar JWT para autenticação stateless, permitindo escalabilidade horizontal.

### 2.2 Service - Lógica de Autenticação
**Arquivo**: `backend/app/services/auth_service.py`

```python
class AuthService:
    async def authenticate_user(self, email: str, password: str):
        # 1. Busca usuário no repository
        user = await self.user_repo.get_by_email(email)
        
        # 2. Verifica se usuário existe
        if not user:
            raise UserNotFoundError()
        
        # 3. Valida senha usando bcrypt
        if not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError()
        
        # 4. Gera token JWT
        token = create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}
```

**Decisão Técnica**: Usar bcrypt para hash de senhas, garantindo segurança mesmo se o banco for comprometido.

### 2.3 Frontend - Hook de Autenticação
**Arquivo**: `frontend/src/hooks/useAuth.js`

```javascript
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      // 1. Chama API de login
      const response = await authService.login(email, password);
      
      // 2. Salva token no localStorage
      localStorage.setItem('token', response.access_token);
      
      // 3. Decodifica token para obter dados do usuário
      const userData = jwt_decode(response.access_token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};
```

**Decisão Técnica**: Usar Context API para gerenciar estado global de autenticação, evitando prop drilling.

## 3. Fluxo de Dados NDVI

### 3.1 Service - Integração com Sentinel Hub
**Arquivo**: `backend/app/services/ndvi_service.py`

```python
class NDVIService:
    async def get_ndvi_data(self, bbox: List[float], date_range: str):
        # 1. Valida parâmetros de entrada
        self._validate_bbox(bbox)
        
        # 2. Verifica cache primeiro
        cache_key = f"ndvi_{bbox}_{date_range}"
        cached_data = await self.cache.get(cache_key)
        if cached_data:
            return cached_data
        
        # 3. Constrói request para Sentinel Hub
        request_payload = {
            "input": {
                "bounds": {"bbox": bbox},
                "data": [{
                    "type": "sentinel-2-l2a",
                    "dataFilter": {"timeRange": {"from": date_range}}
                }]
            },
            "output": {"width": 512, "height": 512}
        }
        
        # 4. Faz requisição para API externa
        response = await self.http_client.post(
            f"{SENTINEL_HUB_URL}/api/v1/process",
            json=request_payload,
            headers={"Authorization": f"Bearer {self.sentinel_token}"}
        )
        
        # 5. Processa resposta e calcula NDVI
        ndvi_data = self._calculate_ndvi(response.content)
        
        # 6. Salva no cache com TTL
        await self.cache.set(cache_key, ndvi_data, ttl=86400)  # 24h
        
        return ndvi_data
```

**Decisão Técnica**: Implementar cache com TTL para reduzir custos da API externa e melhorar performance.

### 3.2 Frontend - Componente de Mapa
**Arquivo**: `frontend/src/components/NDVIMap.jsx`

```javascript
const NDVIMap = ({ center, zoom }) => {
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();

  const loadNDVIData = useCallback(async (bounds) => {
    setLoading(true);
    try {
      // 1. Converte bounds do mapa para bbox
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(), 
        bounds.getEast(),
        bounds.getNorth()
      ];
      
      // 2. Chama service para buscar dados NDVI
      const data = await ndviService.getNDVIData(bbox, '2024-01-01');
      
      // 3. Atualiza estado com novos dados
      setNdviData(data);
      
      // 4. Adiciona camada NDVI ao mapa
      if (mapRef.current) {
        mapRef.current.addSource('ndvi', {
          type: 'raster',
          tiles: [data.tile_url],
          tileSize: 256
        });
        
        mapRef.current.addLayer({
          id: 'ndvi-layer',
          type: 'raster',
          source: 'ndvi',
          paint: {
            'raster-opacity': 0.7
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados NDVI:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega dados quando mapa se move
  const handleMoveEnd = useCallback(() => {
    const bounds = mapRef.current.getBounds();
    loadNDVIData(bounds);
  }, [loadNDVIData]);
};
```

**Decisão Técnica**: Usar Mapbox GL JS para renderização eficiente de dados geoespaciais e suporte a WebGL.

## 4. Fluxo de Observações Comunitárias

### 4.1 Repository - Persistência de Observações
**Arquivo**: `backend/app/repositories/observation_repository.py`

```python
class ObservationRepository:
    async def create_observation(self, observation_data: ObservationCreate, user_id: str):
        # 1. Prepara dados para inserção
        db_observation = {
            **observation_data.dict(),
            "user_id": user_id,
            "created_at": datetime.utcnow(),
            "status": "PENDING"
        }
        
        # 2. Executa query de inserção
        query = """
            INSERT INTO observations (user_id, observation_type, description, 
                                    latitude, longitude, images, rating, created_at, status)
            VALUES (:user_id, :observation_type, :description, :latitude, 
                   :longitude, :images, :rating, :created_at, :status)
            RETURNING *
        """
        
        result = await self.db.fetch_one(query, db_observation)
        return Observation(**result)
    
    async def get_observations_by_region(self, bbox: List[float], limit: int = 50):
        # 1. Query com filtro geoespacial usando PostGIS
        query = """
            SELECT o.*, u.name as user_name, u.avatar_url as user_avatar
            FROM observations o
            JOIN users u ON o.user_id = u.id
            WHERE ST_Within(
                ST_Point(o.longitude, o.latitude), 
                ST_MakeEnvelope(:west, :south, :east, :north, 4326)
            )
            ORDER BY o.created_at DESC
            LIMIT :limit
        """
        
        # 2. Executa query com parâmetros
        results = await self.db.fetch_all(query, {
            "west": bbox[0], "south": bbox[1],
            "east": bbox[2], "north": bbox[3],
            "limit": limit
        })
        
        return [Observation(**row) for row in results]
```

**Decisão Técnica**: Usar PostGIS para queries geoespaciais eficientes e índices espaciais otimizados.

### 4.2 Service - Lógica de Negócio
**Arquivo**: `backend/app/services/observation_service.py`

```python
class ObservationService:
    async def create_observation(self, observation_data: ObservationCreate, user_id: str):
        # 1. Valida dados de entrada
        await self._validate_observation_data(observation_data)
        
        # 2. Verifica se usuário pode criar observação na região
        can_create = await self._check_user_can_observe(user_id, 
                                                       observation_data.latitude, 
                                                       observation_data.longitude)
        if not can_create:
            raise ObservationLimitExceededError()
        
        # 3. Processa imagens se fornecidas
        if observation_data.images:
            processed_images = await self._process_images(observation_data.images)
            observation_data.images = processed_images
        
        # 4. Cria observação no repository
        observation = await self.observation_repo.create_observation(observation_data, user_id)
        
        # 5. Atualiza pontuação do usuário
        await self.user_service.add_points(user_id, 10, "OBSERVATION_CREATED")
        
        # 6. Envia notificações para usuários da região
        await self._notify_regional_users(observation)
        
        return observation
    
    async def _validate_observation_data(self, data: ObservationCreate):
        # Validações específicas de negócio
        if len(data.description) < 10:
            raise ValidationError("Descrição deve ter pelo menos 10 caracteres")
        
        if data.rating < 1 or data.rating > 5:
            raise ValidationError("Rating deve estar entre 1 e 5")
        
        # Valida coordenadas
        if not (-90 <= data.latitude <= 90):
            raise ValidationError("Latitude inválida")
        
        if not (-180 <= data.longitude <= 180):
            raise ValidationError("Longitude inválida")
```

**Decisão Técnica**: Separar validações técnicas (formato) das validações de negócio (regras específicas).

### 4.3 Frontend - Formulário de Observação
**Arquivo**: `frontend/src/components/ObservationForm.jsx`

```javascript
const ObservationForm = ({ location, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    observation_type: '',
    description: '',
    rating: 3,
    images: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Valida formulário no frontend
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSubmitting(true);
    try {
      // 2. Faz upload das imagens primeiro
      const uploadedImages = await Promise.all(
        formData.images.map(image => imageService.uploadImage(image))
      );
      
      // 3. Prepara dados para envio
      const observationData = {
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        images: uploadedImages.map(img => img.url)
      };
      
      // 4. Envia observação para API
      const result = await observationService.createObservation(observationData);
      
      // 5. Notifica sucesso e chama callback
      toast.success('Observação criada com sucesso!');
      onSubmit(result);
      
    } catch (error) {
      // 6. Trata erros específicos
      if (error.code === 'VALIDATION_ERROR') {
        setErrors(error.details);
      } else {
        toast.error('Erro ao criar observação. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.observation_type) {
      errors.observation_type = 'Tipo de observação é obrigatório';
    }
    
    if (data.description.length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }
    
    if (data.images.length > 5) {
      errors.images = 'Máximo 5 imagens permitidas';
    }
    
    return errors;
  };
};
```

**Decisão Técnica**: Implementar validação tanto no frontend (UX) quanto no backend (segurança).

## 5. Fluxo de Validação Comunitária

### 5.1 Service - Lógica de Validação
**Arquivo**: `backend/app/services/validation_service.py`

```python
class ValidationService:
    async def create_validation(self, validation_data: ValidationCreate, user_id: str):
        # 1. Verifica se usuário pode validar esta observação
        can_validate = await self.check_user_can_validate(user_id, validation_data.observation_id)
        if not can_validate:
            raise ValidationNotAllowedError()
        
        # 2. Busca observação original
        observation = await self.observation_repo.get_by_id(validation_data.observation_id)
        if not observation:
            raise ObservationNotFoundError()
        
        # 3. Cria validação
        validation = await self.validation_repo.create_validation(validation_data, user_id)
        
        # 4. Recalcula status da observação
        await self._update_observation_status(validation_data.observation_id)
        
        # 5. Atualiza pontuação do validador
        await self.user_service.add_points(user_id, 5, "VALIDATION_CREATED")
        
        # 6. Notifica autor da observação
        await self._notify_observation_author(observation, validation)
        
        return validation
    
    async def _update_observation_status(self, observation_id: str):
        # 1. Busca todas as validações da observação
        validations = await self.validation_repo.get_by_observation(observation_id)
        
        if len(validations) < 3:
            # Precisa de pelo menos 3 validações
            return
        
        # 2. Calcula percentuais
        confirmed = sum(1 for v in validations if v.status == "CONFIRMED")
        disputed = sum(1 for v in validations if v.status == "DISPUTED")
        total = len(validations)
        
        confirmed_pct = confirmed / total
        disputed_pct = disputed / total
        
        # 3. Define novo status baseado nas regras
        if confirmed_pct >= 0.7:
            new_status = "VALIDATED"
            # Bônus para autor da observação
            observation = await self.observation_repo.get_by_id(observation_id)
            await self.user_service.add_points(observation.user_id, 15, "OBSERVATION_VALIDATED")
        elif disputed_pct >= 0.7:
            new_status = "REJECTED"
        else:
            new_status = "UNDER_REVIEW"
        
        # 4. Atualiza status no banco
        await self.observation_repo.update_status(observation_id, new_status)
```

**Decisão Técnica**: Usar algoritmo de consenso simples (70%) para determinar validade das observações.

## 6. Fluxo de Recomendações

### 6.1 Service - Geração de Recomendações
**Arquivo**: `backend/app/services/recommendation_service.py`

```python
class RecommendationService:
    async def get_personalized_recommendations(self, user_id: str, latitude: float, longitude: float, ndvi_value: float):
        # 1. Busca perfil do usuário
        user = await self.user_repo.get_by_id(user_id)
        
        # 2. Determina bioma da região
        biome = await self._determine_biome(latitude, longitude)
        
        # 3. Analisa histórico de observações do usuário
        user_observations = await self.observation_repo.get_by_user(user_id)
        user_interests = self._analyze_user_interests(user_observations)
        
        # 4. Busca recomendações base por NDVI e bioma
        base_recommendations = await self.recommendation_repo.get_by_criteria(
            ndvi_range=self._get_ndvi_range(ndvi_value),
            biome=biome,
            target_audience=user.level
        )
        
        # 5. Personaliza recomendações baseado no perfil
        personalized = []
        for rec in base_recommendations:
            # Calcula score de relevância
            relevance_score = self._calculate_relevance(
                recommendation=rec,
                user_interests=user_interests,
                user_level=user.level,
                local_context={'ndvi': ndvi_value, 'biome': biome}
            )
            
            if relevance_score > 0.6:  # Threshold de relevância
                personalized.append({
                    **rec.dict(),
                    'relevance_score': relevance_score,
                    'personalization_reason': self._get_personalization_reason(rec, user_interests)
                })
        
        # 6. Ordena por relevância e retorna top 5
        personalized.sort(key=lambda x: x['relevance_score'], reverse=True)
        return personalized[:5]
    
    def _calculate_relevance(self, recommendation, user_interests, user_level, local_context):
        score = 0.5  # Score base
        
        # Ajusta por interesse do usuário
        if recommendation.category in user_interests:
            score += 0.3
        
        # Ajusta por nível do usuário
        if recommendation.target_audience == user_level:
            score += 0.2
        
        # Ajusta por contexto local (NDVI)
        if local_context['ndvi'] < 0.3 and recommendation.category == 'RECOVERY':
            score += 0.4  # Prioriza recuperação em áreas degradadas
        elif local_context['ndvi'] > 0.7 and recommendation.category == 'CONSERVATION':
            score += 0.3  # Prioriza conservação em áreas saudáveis
        
        return min(score, 1.0)  # Limita a 1.0
```

**Decisão Técnica**: Usar sistema de scoring para personalização, permitindo ajustes finos no algoritmo.

## 7. Fluxo de Notificações

### 7.1 Service - Sistema de Alertas
**Arquivo**: `backend/app/services/notification_service.py`

```python
class NotificationService:
    async def send_ndvi_alert(self, user_id: str, area_id: str, ndvi_change: float):
        # 1. Busca preferências do usuário
        user = await self.user_repo.get_by_id(user_id)
        preferences = await self.user_repo.get_notification_preferences(user_id)
        
        if not preferences.ndvi_alerts:
            return  # Usuário não quer receber alertas NDVI
        
        # 2. Busca informações da área
        area = await self.area_repo.get_by_id(area_id)
        
        # 3. Determina severidade do alerta
        severity = self._calculate_alert_severity(ndvi_change)
        
        # 4. Gera conteúdo personalizado
        alert_content = self._generate_alert_content(
            user_name=user.name,
            area_name=area.name,
            ndvi_change=ndvi_change,
            severity=severity
        )
        
        # 5. Envia por canais configurados
        notification_tasks = []
        
        if preferences.email_notifications:
            notification_tasks.append(
                self._send_email_alert(user.email, alert_content)
            )
        
        if preferences.whatsapp_notifications and user.whatsapp_number:
            notification_tasks.append(
                self._send_whatsapp_alert(user.whatsapp_number, alert_content)
            )
        
        if preferences.push_notifications:
            notification_tasks.append(
                self._send_push_notification(user_id, alert_content)
            )
        
        # 6. Executa envios em paralelo
        await asyncio.gather(*notification_tasks, return_exceptions=True)
        
        # 7. Registra notificação no histórico
        await self.notification_repo.create_notification({
            "user_id": user_id,
            "type": "NDVI_ALERT",
            "content": alert_content,
            "severity": severity,
            "area_id": area_id
        })
    
    def _generate_alert_content(self, user_name: str, area_name: str, ndvi_change: float, severity: str):
        if ndvi_change < -0.1:  # Degradação significativa
            return {
                "title": f"⚠️ Alerta: Degradação detectada em {area_name}",
                "message": f"Olá {user_name}, detectamos uma redução de {abs(ndvi_change):.1%} na saúde da vegetação em {area_name}. Isso pode indicar desmatamento, seca ou outros problemas ambientais.",
                "action_text": "Ver detalhes e contribuir",
                "action_url": f"/area/{area_name}"
            }
        elif ndvi_change > 0.1:  # Melhoria significativa
            return {
                "title": f"🌱 Boa notícia: Recuperação em {area_name}",
                "message": f"Olá {user_name}, a saúde da vegetação em {area_name} melhorou {ndvi_change:.1%}! Isso pode indicar recuperação natural ou ações de conservação efetivas.",
                "action_text": "Ver progresso",
                "action_url": f"/area/{area_name}"
            }
```

**Decisão Técnica**: Usar sistema de templates para personalização de mensagens e execução assíncrona para performance.

## 8. Tratamento de Erros e Logging

### 8.1 Middleware de Tratamento de Erros
**Arquivo**: `backend/app/core/error_handler.py`

```python
class ErrorHandler:
    @staticmethod
    async def handle_error(request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except ValidationError as e:
            logger.warning(f"Validation error: {e.message}", extra={
                "user_id": getattr(request.state, 'user_id', None),
                "endpoint": request.url.path,
                "method": request.method
            })
            return JSONResponse(
                status_code=400,
                content={"error": "VALIDATION_ERROR", "message": e.message, "details": e.details}
            )
        except DatabaseError as e:
            logger.error(f"Database error: {str(e)}", extra={
                "user_id": getattr(request.state, 'user_id', None),
                "endpoint": request.url.path,
                "traceback": traceback.format_exc()
            })
            return JSONResponse(
                status_code=500,
                content={"error": "DATABASE_ERROR", "message": "Erro interno do servidor"}
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", extra={
                "user_id": getattr(request.state, 'user_id', None),
                "endpoint": request.url.path,
                "traceback": traceback.format_exc()
            })
            return JSONResponse(
                status_code=500,
                content={"error": "INTERNAL_ERROR", "message": "Erro interno do servidor"}
            )
```

**Decisão Técnica**: Centralizar tratamento de erros para consistência e logging estruturado para debugging.

### 8.2 Frontend - Hook de Tratamento de Erros
**Arquivo**: `frontend/src/hooks/useErrorHandler.js`

```javascript
export const useErrorHandler = () => {
  const handleError = useCallback((error, context = {}) => {
    // 1. Log do erro para monitoramento
    console.error('Error occurred:', error, context);
    
    // 2. Determina tipo de erro e ação apropriada
    if (error.code === 'VALIDATION_ERROR') {
      // Erros de validação - mostrar detalhes ao usuário
      toast.error(error.message);
      return { type: 'validation', details: error.details };
    }
    
    if (error.code === 'AUTHENTICATION_ERROR') {
      // Erro de autenticação - redirecionar para login
      toast.error('Sessão expirada. Faça login novamente.');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return { type: 'auth' };
    }
    
    if (error.code === 'NETWORK_ERROR') {
      // Erro de rede - sugerir retry
      toast.error('Problema de conexão. Verifique sua internet.');
      return { type: 'network', retry: true };
    }
    
    // 3. Erro genérico
    toast.error('Algo deu errado. Tente novamente.');
    return { type: 'generic' };
  }, []);
  
  return { handleError };
};
```

**Decisão Técnica**: Padronizar tratamento de erros no frontend para melhor experiência do usuário.

## 9. Otimizações de Performance

### 9.1 Cache Redis
**Arquivo**: `backend/app/core/cache.py`

```python
class CacheService:
    def __init__(self):
        self.redis = redis.Redis.from_url(settings.REDIS_URL)
    
    async def get_or_set(self, key: str, fetch_func: Callable, ttl: int = 3600):
        # 1. Tenta buscar do cache primeiro
        cached_value = await self.redis.get(key)
        if cached_value:
            return json.loads(cached_value)
        
        # 2. Se não existe, executa função de busca
        value = await fetch_func()
        
        # 3. Salva no cache com TTL
        await self.redis.setex(key, ttl, json.dumps(value, default=str))
        
        return value
    
    async def invalidate_pattern(self, pattern: str):
        # Invalida múltiplas chaves por padrão
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)
```

**Decisão Técnica**: Usar Redis para cache distribuído, permitindo escalabilidade horizontal.

### 9.2 Frontend - Lazy Loading
**Arquivo**: `frontend/src/components/LazyMap.jsx`

```javascript
const LazyMap = lazy(() => 
  import('./NDVIMap').then(module => ({
    default: module.NDVIMap
  }))
);

const MapContainer = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3">Carregando mapa...</span>
      </div>
    }>
      <LazyMap />
    </Suspense>
  );
};
```

**Decisão Técnica**: Usar code splitting para reduzir bundle inicial e melhorar tempo de carregamento.

## 10. Testes e Qualidade

### 10.1 Testes de Service
**Arquivo**: `backend/tests/test_observation_service.py`

```python
class TestObservationService:
    @pytest.fixture
    async def service(self):
        # Setup de mocks para dependências
        mock_repo = AsyncMock(spec=ObservationRepository)
        mock_user_service = AsyncMock(spec=UserService)
        
        return ObservationService(
            observation_repo=mock_repo,
            user_service=mock_user_service
        )
    
    async def test_create_observation_success(self, service):
        # Arrange
        observation_data = ObservationCreate(
            observation_type="DEFORESTATION",
            description="Área desmatada para pasto",
            latitude=-15.7801,
            longitude=-47.9292,
            rating=4
        )
        user_id = "user123"
        
        # Mock das dependências
        service.observation_repo.create_observation.return_value = Observation(
            id="obs123",
            **observation_data.dict(),
            user_id=user_id,
            status="PENDING"
        )
        
        # Act
        result = await service.create_observation(observation_data, user_id)
        
        # Assert
        assert result.id == "obs123"
        assert result.status == "PENDING"
        service.user_service.add_points.assert_called_once_with(user_id, 10, "OBSERVATION_CREATED")
    
    async def test_create_observation_invalid_coordinates(self, service):
        # Arrange
        observation_data = ObservationCreate(
            observation_type="DEFORESTATION",
            description="Teste",
            latitude=91,  # Inválida
            longitude=-47.9292,
            rating=4
        )
        
        # Act & Assert
        with pytest.raises(ValidationError, match="Latitude inválida"):
            await service.create_observation(observation_data, "user123")
```

**Decisão Técnica**: Usar pytest com mocks para testes unitários isolados e rápidos.

### 10.2 Testes de Componente Frontend
**Arquivo**: `frontend/src/components/__tests__/ObservationForm.test.jsx`

```javascript
describe('ObservationForm', () => {
  const mockLocation = { lat: -15.7801, lng: -47.9292 };
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(
      <ObservationForm 
        location={mockLocation}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/tipo de observação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nível de confiança/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <ObservationForm 
        location={mockLocation}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Tenta submeter sem preencher campos obrigatórios
    fireEvent.click(screen.getByText(/criar observação/i));

    await waitFor(() => {
      expect(screen.getByText(/tipo de observação é obrigatório/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    // Mock do service
    jest.spyOn(observationService, 'createObservation').mockResolvedValue({
      id: 'obs123',
      status: 'PENDING'
    });

    render(
      <ObservationForm 
        location={mockLocation}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Preenche formulário
    fireEvent.change(screen.getByLabelText(/tipo de observação/i), {
      target: { value: 'DEFORESTATION' }
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Área desmatada para agricultura' }
    });

    // Submete
    fireEvent.click(screen.getByText(/criar observação/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: 'obs123',
        status: 'PENDING'
      });
    });
  });
});
```

**Decisão Técnica**: Usar React Testing Library para testes focados no comportamento do usuário.

## 11. Monitoramento e Observabilidade

### 11.1 Logging Estruturado
**Arquivo**: `backend/app/core/logging.py`

```python
import structlog

# Configuração do logger estruturado
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Exemplo de uso nos services
class ObservationService:
    async def create_observation(self, observation_data: ObservationCreate, user_id: str):
        logger.info(
            "Creating observation",
            user_id=user_id,
            observation_type=observation_data.observation_type,
            latitude=observation_data.latitude,
            longitude=observation_data.longitude
        )
        
        try:
            # Lógica de criação...
            result = await self.observation_repo.create_observation(observation_data, user_id)
            
            logger.info(
                "Observation created successfully",
                observation_id=result.id,
                user_id=user_id
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "Failed to create observation",
                user_id=user_id,
                error=str(e),
                exc_info=True
            )
            raise
```

**Decisão Técnica**: Usar logging estruturado para facilitar análise e monitoramento em produção.

## 12. Considerações de Segurança

### 12.1 Validação de Input
**Arquivo**: `backend/app/core/security.py`

```python
class SecurityValidator:
    @staticmethod
    def validate_coordinates(latitude: float, longitude: float):
        """Valida se coordenadas estão em ranges válidos"""
        if not (-90 <= latitude <= 90):
            raise ValidationError("Latitude deve estar entre -90 e 90")
        
        if not (-180 <= longitude <= 180):
            raise ValidationError("Longitude deve estar entre -180 e 180")
    
    @staticmethod
    def sanitize_text_input(text: str, max_length: int = 1000) -> str:
        """Remove caracteres perigosos e limita tamanho"""
        # Remove tags HTML
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove caracteres de controle
        text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
        
        # Limita tamanho
        text = text[:max_length]
        
        return text.strip()
    
    @staticmethod
    def validate_image_upload(file_content: bytes, filename: str):
        """Valida upload de imagem"""
        # Verifica tamanho (máximo 5MB)
        if len(file_content) > 5 * 1024 * 1024:
            raise ValidationError("Imagem muito grande (máximo 5MB)")
        
        # Verifica extensão
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        file_ext = Path(filename).suffix.lower()
        if file_ext not in allowed_extensions:
            raise ValidationError("Formato de imagem não suportado")
        
        # Verifica se é realmente uma imagem
        try:
            from PIL import Image
            import io
            Image.open(io.BytesIO(file_content))
        except Exception:
            raise ValidationError("Arquivo não é uma imagem válida")
```

**Decisão Técnica**: Implementar múltiplas camadas de validação para prevenir ataques de injeção e upload malicioso.

Esta documentação técnica fornece uma visão completa de como cada fluxo é implementado no código, destacando as decisões técnicas e padrões arquiteturais utilizados para garantir qualidade, segurança e manutenibilidade do sistema OrBee.Online.