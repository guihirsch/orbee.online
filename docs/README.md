# OrBee.Online - Sistema de Monitoramento Ambiental

Plataforma React desenvolvida com Vite e Tailwind CSS para monitoramento da saúde da mata ciliar através de dados satelitais NDVI.

## Visão Geral

OrBee.Online é uma plataforma de monitoramento ambiental que combina dados satelitais NDVI (Índice de Vegetação por Diferença Normalizada) com validação comunitária para criar uma visão completa da saúde da mata ciliar e outros ecossistemas.

**Slogan:** "OrBee: inteligência coletiva para um futuro sustentável."

**Propósito:** Plataforma que conecta satélites, comunidades e governos para ações locais com impacto global.

## Estrutura da Documentação

Esta pasta contém toda a documentação técnica do projeto OrBee.Online:

- **[README.md](./README.md)**: Visão geral do projeto e documentação principal
- **[components.md](./components.md)**: Documentação detalhada dos componentes React
- **[design-system.md](./design-system.md)**: Tokens de design, cores, tipografia e padrões visuais
- **[setup.md](./setup.md)**: Guia de instalação e configuração do ambiente
- **[deployment.md](./deployment.md)**: Processos de deploy e infraestrutura
- **[storybook.md](./storybook.md)**: Configuração e uso do Storybook
- **[examples/](./examples/)**: Templates de documentação reutilizáveis para outros projetos

## Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **Vite**: Ferramenta de build rápida e moderna
- **Tailwind CSS + DaisyUI**: Framework CSS utilitário para estilização eficiente
- **React Router**: Navegação entre páginas
- **Mapbox GL**: Mapas interativos para visualização NDVI
- **Recharts**: Gráficos e visualizações de dados
- **Framer Motion**: Animações e transições
- **Lucide React**: Biblioteca de ícones

### Backend (Em Desenvolvimento)
- **FastAPI**: Framework Python com padrão Service-Repository
- **Supabase**: Banco de dados e autenticação
- **Copernicus/Sentinel Hub API**: Fonte de dados NDVI

### Infraestrutura
- **Railway**: Plataforma de deploy

## Funcionalidades Implementadas

### Página Inicial (Landing Page)
- Hero section com apresentação da plataforma
- Seções explicativas sobre o problema e solução
- Preview do dashboard
- Depoimentos e FAQ
- Call-to-action para engajamento

### Dashboard de Monitoramento
- Visualização de mapas NDVI interativos
- Gráficos de evolução temporal da vegetação
- Cards informativos sobre saúde da mata ciliar
- Sistema de filtros por localização e período
- Métricas e indicadores ambientais

### Plataforma MeadowGreen
- Interface avançada com painéis redimensionáveis
- Sidebar com navegação contextual
- Visualização detalhada de dados NDVI
- Sistema de zonas e regiões de interesse
- Ferramentas de análise temporal

### Sistema de Comunidade
- Interface para validação comunitária
- Sistema de gamificação com pontos e conquistas
- Upload de fotos e relatos
- Ranking de guardiões ambientais

### Perfil do Usuário
- Gestão de dados pessoais
- Histórico de contribuições
- Configurações de alertas
- Estatísticas de engajamento

## Estrutura do Projeto

```
orbee.online/
├── docs/                    # Documentação do projeto
├── src/                     # Código fonte
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes de interface base
│   │   ├── Header.jsx      # Cabeçalho da aplicação
│   │   ├── Footer.jsx      # Rodapé
│   │   ├── Layout.jsx      # Layout principal
│   │   ├── NDVIMap.jsx     # Componente de mapa NDVI
│   │   ├── NDVIChart.jsx   # Gráficos de dados NDVI
│   │   ├── AppSidebar.jsx  # Sidebar da aplicação
│   │   └── ZoneCard.jsx    # Cards de zonas
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.jsx        # Página inicial
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   ├── MeadowGreen.jsx # Plataforma avançada
│   │   ├── Community.jsx   # Página da comunidade
│   │   └── Profile.jsx     # Perfil do usuário
│   ├── services/           # Serviços e APIs
│   │   └── ndviService.js  # Serviço de dados NDVI
│   ├── hooks/              # Custom hooks
│   ├── data/               # Dados mock e constantes
│   ├── lib/                # Utilitários
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Ponto de entrada
│   └── index.css           # Estilos globais
├── backend/                 # Backend FastAPI (em desenvolvimento)
├── database/               # Scripts de banco de dados
├── index.html              # Template HTML
├── package.json            # Dependências e scripts
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind
└── design-system-guide.md  # Guia do design system
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse: `http://localhost:5173`

## Público-Alvo

- **Comunidades locais**: Agricultores, ONGs, cidadãos engajados
- **Pesquisadores ambientais**: Cientistas e acadêmicos
- **Órgãos públicos**: Prefeituras e secretarias de meio ambiente

## Fluxo do Usuário

1. Usuário acessa a aplicação
2. Digita cidade ou compartilha localização
3. Visualiza mapa NDVI + evolução temporal
4. Recebe insights sobre a saúde da vegetação
5. Lê recomendações adaptadas à região
6. Pode validar com relatos ou fotos
7. Ganha pontos e reconhecimento
8. Configura alertas para monitoramento contínuo

## Status do Desenvolvimento

### ✅ Concluído
- [x] Estrutura inicial do frontend React
- [x] Layout responsivo com Tailwind CSS
- [x] Páginas principais (Home, Dashboard, Community, Profile)
- [x] Sistema de navegação e roteamento
- [x] Interface para validação comunitária
- [x] Sistema básico de gamificação
- [x] Componentes de mapa e gráficos NDVI
- [x] Design system consistente

### 🔄 Em Desenvolvimento
- [ ] Integração com Mapbox para visualização de mapas
- [ ] Conexão com API Copernicus/Sentinel Hub
- [ ] Backend FastAPI
- [ ] Autenticação de usuários
- [ ] Sistema de upload de imagens

### 📋 Próximos Passos
- [ ] Implementação de gráficos temporais
- [ ] Sistema de alertas e notificações
- [ ] Deploy na Railway
- [ ] Testes automatizados

## 📁 Estrutura da Documentação

A documentação foi organizada em duas pastas principais:

### 🎯 [Projeto OrBee.Online](./projeto/)
**Documentação específica do OrBee.Online**
- [Configuração](./projeto/setup.md) - Guia de configuração inicial
- [Componentes](./projeto/components.md) - Documentação dos componentes React
- [Design System](./projeto/design-system.md) - Sistema de design implementado
- [Deploy](./projeto/deployment.md) - Instruções de deploy na Railway
- [Contribuição](./projeto/contributing.md) - Guia para contribuidores

### 🚀 [Templates Genéricos](./generico/)
**Templates reutilizáveis para novos projetos**
- [Guia de Customização](./generico/customization-guide.md) - **COMECE AQUI** para novos projetos
- [Design Tokens Template](./generico/design-tokens-template.md) - Tokens de design genéricos
- [Design System Template](./generico/design-system-template.md) - Componentes base reutilizáveis
- [Styling Template](./generico/styling-template.md) - Guia de estilos com placeholders `[CUSTOMIZAR]`

---

## 🚀 Usando Esta Documentação

### Para o Projeto OrBee.Online
Se você está contribuindo ou trabalhando no OrBee.Online:
- Consulte a pasta **[projeto/](./projeto/)** para documentação específica
- Siga o [guia de contribuição](./projeto/contributing.md)
- Use o [setup](./projeto/setup.md) para configurar o ambiente

### Para Novos Projetos
Se você quer criar um projeto baseado no OrBee.Online:
- Comece pela pasta **[generico/](./generico/)**
- Leia o [Guia de Customização](./generico/customization-guide.md) primeiro
- Copie e customize os templates conforme sua necessidade

### Fluxo Rápido para Novos Projetos

```bash
# 1. Acesse a pasta de templates
cd generico/

# 2. Leia o guia de customização
open customization-guide.md

# 3. Copie os templates necessários
cp design-tokens-template.md ../meu-projeto/design-tokens.md
cp design-system-template.md ../meu-projeto/design-system.md
cp styling-template.md ../meu-projeto/styling.md

# 4. Customize substituindo [CUSTOMIZAR] pelos seus valores
```

### Benefícios da Organização

- 🎯 **Separação clara** entre projeto específico e templates genéricos
- 📁 **Organização intuitiva** com pastas temáticas
- 🔄 **Reutilização facilitada** com templates isolados
- 📚 **Documentação focada** para cada contexto de uso
- 🚀 **Início mais rápido** em novos projetos

## Templates de Documentação

A pasta **[examples/](./examples/)** contém templates de documentação reutilizáveis que podem ser aplicados em outros projetos para manter consistência e qualidade na documentação técnica.

### Templates Disponíveis

- **[components.example.md](./examples/components.example.md)**: Template para documentar componentes React/UI
- **[setup.example.md](./examples/setup.example.md)**: Template para guias de instalação e configuração
- **[design-system.example.md](./examples/design-system.example.md)**: Template para documentar design systems e tokens
- **[deployment.example.md](./examples/deployment.example.md)**: Template para processos de deploy e infraestrutura
- **[storybook.example.md](./examples/storybook.example.md)**: Template para configuração e uso do Storybook

### Como Usar

1. **Escolha o template** apropriado para seu tipo de documentação
2. **Copie o arquivo** para seu projeto: `cp docs/examples/template.example.md docs/template.md`
3. **Adapte o conteúdo** substituindo placeholders pelos valores reais
4. **Mantenha atualizado** junto com mudanças no código

Estes templates foram criados com base nas melhores práticas de documentação técnica e podem acelerar significativamente o processo de criação de documentação em novos projetos.

---

## Contribuição

Para contribuir com o projeto, consulte o [guia de contribuição](./contributing.md).

## Métricas de Sucesso

- Número de usuários ativos
- Número de observações validadas
- Cobertura geográfica (municípios monitorados)
- Engajamento comunitário (relatos e fotos)
- Precisão entre dados NDVI e validação comunitária

---

**OrBee.Online** - Conectando tecnologia satelital com conhecimento local para um futuro mais sustentável. 🌍🛰️🌱