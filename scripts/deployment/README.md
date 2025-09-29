# 🚀 Deployment - Scripts de Deploy

Esta pasta contém scripts de deploy, configuração e execução dos serviços.

## 📁 Arquivos

### Scripts de Execução

#### `run_preload.sh`

**Função:** Script shell para executar pré-processamento no Linux/macOS

**Características:**

- Execução do pré-processamento
- Configuração de ambiente
- Logs de execução
- Tratamento de erros

**Uso:**

```bash
cd deployment/
chmod +x run_preload.sh
./run_preload.sh
```

#### `run_preload.bat`

**Função:** Script batch para executar pré-processamento no Windows

**Características:**

- Execução no Windows
- Configuração de ambiente
- Logs de execução
- Tratamento de erros

**Uso:**

```bash
cd deployment/
run_preload.bat
```

### Dependências

#### `requirements.txt`

**Função:** Dependências básicas para pré-processamento

**Conteúdo:**

```
asyncio
httpx
sqlalchemy
schedule
numpy
pandas
```

#### `requirements_ai.txt`

**Função:** Dependências para processamento com IA

**Conteúdo:**

```
torch
torchvision
numpy
pillow
opencv-python
folium
geopandas
```

## 🔧 Configuração

### Variáveis de Ambiente:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/orbee

# API
API_BASE_URL=http://localhost:8000

# Cache
CACHE_DURATION_HOURS=24
MAX_CONCURRENT_MUNICIPALITIES=5

# AI
CUDA_VISIBLE_DEVICES=0
TORCH_DEVICE=cuda
```

### Instalação de Dependências:

```bash
# Básicas
pip install -r requirements.txt

# Com IA
pip install -r requirements_ai.txt

# Todas
pip install -r requirements.txt -r requirements_ai.txt
```

## 🚀 Execução

### Pré-processamento Básico:

```bash
cd deployment/
./run_preload.sh
```

### Pré-processamento com IA:

```bash
cd deployment/
export USE_AI=true
./run_preload.sh
```

### Agendador:

```bash
cd deployment/
python ../preprocessing/scheduler.py
```

## 📊 Monitoramento

### Logs:

- **Execução:** Logs de processo
- **Erros:** Tratamento de falhas
- **Performance:** Métricas de tempo
- **Resultados:** Estatísticas de sucesso

### Métricas:

- **Taxa de sucesso:** % de municípios processados
- **Tempo de execução:** Duração total
- **Uso de recursos:** CPU, RAM, GPU
- **Qualidade dos dados:** Validação de resultados

## 🔄 Automação

### Cron Jobs (Linux/macOS):

```bash
# Execução diária às 2:00 AM
0 2 * * * /path/to/scripts/deployment/run_preload.sh

# Execução semanal aos domingos às 3:00 AM
0 3 * * 0 /path/to/scripts/deployment/run_preload.sh
```

### Task Scheduler (Windows):

- **Trigger:** Diário às 2:00 AM
- **Action:** Executar `run_preload.bat`
- **Conditions:** Apenas se conectado à internet

### Docker:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements*.txt ./
RUN pip install -r requirements.txt -r requirements_ai.txt

COPY . .
CMD ["./deployment/run_preload.sh"]
```

## 🛠️ Troubleshooting

### Problemas Comuns:

#### 1. Dependências não encontradas:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2. Erro de conexão com banco:

```bash
# Verificar variável de ambiente
echo $DATABASE_URL

# Testar conexão
python -c "import psycopg2; print('OK')"
```

#### 3. Erro de permissão:

```bash
chmod +x run_preload.sh
```

#### 4. Erro de memória:

```bash
# Reduzir concorrência
export MAX_CONCURRENT_MUNICIPALITIES=2
```

### Logs de Debug:

```bash
# Executar com debug
export DEBUG=true
./run_preload.sh

# Ver logs em tempo real
tail -f logs/preload.log
```

## 📈 Performance

### Otimizações:

- **Paralelização:** Processamento concorrente
- **Cache:** Reutilização de dados
- **Batch processing:** Processamento em lotes
- **Resource management:** Controle de recursos

### Monitoramento:

- **CPU:** Uso de processador
- **RAM:** Consumo de memória
- **GPU:** Uso de GPU (se disponível)
- **Network:** Tráfego de rede

## 🔒 Segurança

### Boas Práticas:

- **Variáveis de ambiente:** Credenciais seguras
- **Logs:** Não expor informações sensíveis
- **Permissões:** Acesso restrito
- **Validação:** Verificação de dados

### Configuração:

```bash
# Usar variáveis de ambiente
export DATABASE_URL="postgresql://user:password@localhost:5432/orbee"

# Não hardcodar credenciais
# Evitar logs de senhas
# Usar HTTPS para APIs
```

## 🚀 Próximos Passos

1. **CI/CD:** Integração contínua
2. **Monitoramento:** Métricas em tempo real
3. **Alertas:** Notificações de falhas
4. **Escalabilidade:** Processamento distribuído
5. **Backup:** Estratégias de backup
