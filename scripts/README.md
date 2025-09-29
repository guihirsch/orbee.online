# 📁 Scripts - Organização e Estrutura

Esta pasta contém todos os scripts utilitários do projeto Orbee, organizados por funcionalidade para facilitar manutenção e desenvolvimento.

## 🗂️ Estrutura de Pastas

### 📊 `preprocessing/`

Scripts de pré-processamento e cache de dados municipais

- **`preload_municipalities.py`** - Pré-carregamento de dados municipais em cache
- **`preload_municipalities_ai.py`** - Versão com IA para super-resolução
- **`scheduler.py`** - Agendador para execução periódica dos scripts

### 🗺️ `visualization/`

Scripts e templates para visualização de dados geoespaciais

- **`visualize_geojson*.py`** - Scripts para criar mapas interativos
- **`mapa_*.html`** - Templates HTML para visualização offline
- **`pontos_criticos_*.html`** - Visualizações específicas de pontos críticos
- **`debug_map.html`** - Mapa de debug para desenvolvimento

### 📦 `data/`

Arquivos de dados geoespaciais e configurações

- **`*.json`** - Dados de pontos críticos e configurações
- **`*.geojson`** - Dados geoespaciais (rios, limites, etc.)

### 🤖 `ai_models/`

Modelos de IA e processamento avançado

- **`dr30_integration.py`** - Integração com Sentinel-2 Deep Resolution 3.0

### 📓 `notebooks/`

Jupyter notebooks para análise e desenvolvimento

- **`NDVI.ipynb`** - Análise de dados NDVI
- **`NDVI copy.ipynb`** - Backup do notebook principal

### 🚀 `deployment/`

Scripts de deploy e configuração

- **`run_preload.*`** - Scripts para executar pré-processamento
- **`requirements*.txt`** - Dependências específicas

## 🎯 Justificativa da Organização

### ✅ **Benefícios da Estrutura Atual:**

1. **Separação por Responsabilidade**
   - Cada pasta tem uma função específica e bem definida
   - Facilita localização de arquivos relacionados
   - Reduz confusão sobre onde colocar novos scripts

2. **Escalabilidade**
   - Estrutura preparada para crescimento do projeto
   - Fácil adição de novos scripts em categorias apropriadas
   - Organização clara para novos desenvolvedores

3. **Manutenção**
   - Scripts relacionados ficam próximos
   - Facilita refatoração e atualizações
   - Reduz dependências cruzadas

4. **Deploy e CI/CD**
   - Scripts de deploy isolados
   - Dependências específicas por funcionalidade
   - Facilita automação de processos

### 🔄 **Fluxo de Trabalho:**

```
preprocessing/ → data/ → visualization/ → deployment/
     ↓              ↓           ↓            ↓
   Cache        Dados      Mapas      Deploy
```

## 📋 Como Usar

### Executar Pré-processamento:

```bash
cd preprocessing/
python preload_municipalities.py
```

### Criar Visualizações:

```bash
cd visualization/
python visualize_geojson_simple.py
```

### Executar com IA:

```bash
cd ai_models/
python dr30_integration.py
```

### Deploy:

```bash
cd deployment/
./run_preload.sh
```

## 🚀 Próximos Passos

1. **Adicionar testes** em cada pasta
2. **Criar documentação** específica por funcionalidade
3. **Implementar CI/CD** para cada categoria
4. **Adicionar monitoramento** de performance
5. **Criar templates** para novos scripts

---

_Esta organização foi criada para otimizar o desenvolvimento e manutenção do projeto Orbee, seguindo boas práticas de engenharia de software._
