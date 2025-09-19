# Componentes OrBee.Online

## Estrutura de Componentes

### Sistema de Efeitos Visuais (Atualizado)

O sistema de efeitos visuais foi aprimorado com melhorias significativas de contraste, legibilidade e organização visual.

#### Melhorias Implementadas:

- **Contraste Aprimorado**: Todos os textos foram ajustados para melhor legibilidade em fundo claro
- **Layout Reorganizado**: Header fixo com controles interativos mais visíveis
- **Cores Otimizadas**: Cards e elementos com cores adaptadas para melhor visibilidade
- **Controles Interativos**: Interface mais intuitiva com feedback visual

#### Componentes do Sistema:

**EffectDemo**: Componente wrapper para demonstração de efeitos
```jsx
const EffectDemo = ({ title, description, children, className = '', animate, showNoise }) => {
  // Implementação com noise texture e animações
};
```

**EffectButton**: Botão com efeitos visuais integrados
```jsx
const EffectButton = ({ variant = 'primary', animate, showNoise, children }) => {
  // Variantes: primary, secondary, outline
};
```

**AnimatedCard**: Card com animações e efeitos de hover
```jsx
const AnimatedCard = ({ children, className = '', animate, showNoise }) => {
  // Card responsivo com transições suaves
};
```

---

### App.jsx

Componente principal da aplicação que gerencia roteamento e tema global.

```jsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "orbee";
    document.documentElement.setAttribute("data-theme", savedTheme);
    localStorage.setItem("theme", savedTheme);
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meadow-green" element={<MeadowGreen />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}
```

#### Características:

- Gerenciamento de tema global (DaisyUI)
- Roteamento entre páginas principais
- Persistência de configurações no localStorage

---

### Layout.jsx

Componente de layout principal que define a estrutura base da aplicação.

```jsx
const Layout = ({ children }) => {
  return (
    <div
      data-theme="orbee"
      className="min-h-screen bg-gradient-to-br from-[#D9ED92] via-[#B5E48C] to-[#99D98C]"
    >
      <main className="mx-auto max-w-none flex-1">{children}</main>
    </div>
  );
};
```

#### Características:

- Layout responsivo com gradiente de fundo
- Aplicação do tema OrBee
- Container flexível para conteúdo

---

## Componentes de Interface

### Header.jsx

Cabeçalho da aplicação com navegação e branding.

#### Funcionalidades:

- Logo e branding OrBee com ícone de abelha SVG
- Menu de navegação responsivo
- Links de navegação suave (scroll behavior)
- Menu mobile com toggle

#### Estrutura:

```jsx
const Header = () => {
  const navItems = [
    { name: "Início", href: "#features" },
    { name: "Plataforma", href: "#how-it-works" },
    { name: "Comunidade", href: "/community" },
    { name: "FAQ", href: "#faq" },
  ];
  // ...
};
```

### Footer.jsx

Rodapé da aplicação com informações institucionais.

#### Características:

- Links para redes sociais
- Informações de contato
- Links úteis e navegação secundária
- Copyright e informações legais

---

## Componentes de Dados NDVI

### NDVIMap.jsx

Componente de mapa interativo para visualização de dados NDVI usando Mapbox GL.

#### Props:

- `latitude` (number): Latitude inicial do mapa
- `longitude` (number): Longitude inicial do mapa
- `zoom` (number): Nível de zoom inicial
- `onLocationSelect` (function): Callback para seleção de localização
- `ndviData` (object): Dados NDVI para exibição
- `showControls` (boolean): Exibir controles do mapa

#### Funcionalidades:

- Mapa satelital interativo
- Camadas NDVI sobrepostas
- Controles de navegação e escala
- Seleção de localização por clique
- Períodos temporais (atual, histórico)
- Marcadores e popups informativos

```jsx
const NDVIMap = ({
  latitude = -29.7175,
  longitude = -52.4264,
  zoom = 13,
  onLocationSelect,
  ndviData = null,
  showControls = true,
}) => {
  // Implementação do mapa
};
```

### NDVIChart.jsx

Componente de gráfico para visualização temporal de dados NDVI usando Recharts.

#### Props:

- `location` (object): Coordenadas da localização
- `period` (string): Período de análise ('30d', '90d', '180d', '1y')
- `height` (number): Altura do gráfico
- `showControls` (boolean): Exibir controles do gráfico

#### Funcionalidades:

- Gráfico de linha e área
- Múltiplos períodos de análise
- Tooltips informativos
- Indicadores de tendência
- Loading states
- Formatação de dados temporal

```jsx
const NDVIChart = ({
  location = null,
  period = "90d",
  height = 300,
  showControls = true,
}) => {
  const periods = [
    { value: "30d", label: "30 dias", days: 30 },
    { value: "90d", label: "90 dias", days: 90 },
    { value: "180d", label: "6 meses", days: 180 },
    { value: "1y", label: "1 ano", days: 365 },
  ];
  // ...
};
```

---

## Componentes de Zona e Monitoramento

### ZoneCard.jsx

Card informativo para exibição de dados de zonas de monitoramento.

#### Props:

- `zone` (object): Dados da zona
- `zoneData` (object): Dados detalhados da zona
- `selectedZone` (string): Zona atualmente selecionada
- `selectedZones` (array): Zonas selecionadas
- `zoneActivities` (object): Atividades da zona
- `onZoneClick` (function): Callback para clique na zona
- `onZoneToggle` (function): Callback para toggle da zona
- `onPhotoGalleryOpen` (function): Callback para abrir galeria

#### Funcionalidades:

- Status da zona (crítico, em progresso, concluído)
- Métricas NDVI e degradação
- Indicadores de tendência
- Barra de progresso de atividades
- Galeria de fotos
- Tooltips informativos

```jsx
const ZoneCard = ({
  zone,
  zoneData,
  selectedZone,
  selectedZones,
  zoneActivities,
  onZoneClick,
  onZoneToggle,
  onPhotoGalleryOpen,
}) => {
  const getZoneStatus = () => {
    if (degradation === "Severa" && totalActivities < 3) return "critical";
    if (totalActivities >= 7) return "completed";
    if (totalActivities >= 3) return "in_progress";
    return "pending";
  };
  // ...
};
```

### AppSidebar.jsx

Sidebar contextual para navegação entre seções da plataforma.

#### Funcionalidades:

- Menu de navegação contextual
- Estados expandido/colapsado
- Tooltips para itens do menu
- Responsividade mobile
- Integração com sistema de sidebar do Radix UI

#### Estrutura do Menu:

```jsx
const menuItems = [
  {
    id: "inicio",
    title: "Início",
    icon: Home,
    tooltip: "Dashboard pessoal",
    description: "Conquistas, pesquisas e monitoramento",
  },
  {
    id: "caracteristicas",
    title: "Características",
    icon: Globe,
    tooltip: "Características da região",
    description: "Localização e dados da região",
  },
  // ...
];
```

---

## Componentes de Landing Page

### HeroSection.jsx

Seção principal da página inicial com apresentação da plataforma.

#### Características:

- Título e subtítulo impactantes
- Call-to-action principal
- Animações com Framer Motion
- Background dinâmico
- Botões de ação primários

### DashboardPreview.jsx

Preview interativo do dashboard para demonstração.

#### Funcionalidades:

- Simulação de interface do dashboard
- Tabs de navegação
- Cards de métricas
- Gráficos de demonstração
- Estados de loading simulados

### FeaturesSection.jsx

Seção de funcionalidades da plataforma.

#### Características:

- Grid de funcionalidades
- Ícones representativos
- Descrições detalhadas
- Layout responsivo

### TestimonialsSection.jsx

Seção de depoimentos de usuários.

#### Funcionalidades:

- Carousel de depoimentos
- Avatares e informações dos usuários
- Animações de transição
- Navegação por dots

### FAQSection.jsx

Seção de perguntas frequentes.

#### Funcionalidades:

- Accordion expansível
- Busca por perguntas
- Categorização de tópicos
- Animações suaves

---

## Serviços e Hooks

### ndviService.js

Serviço para integração com APIs de dados NDVI.

#### Métodos Principais:

- `getNDVIData(lat, lng, startDate, endDate)`: Busca dados NDVI
- `getCurrentNDVI(lat, lng)`: Obtém NDVI atual
- `getNDVITimeSeries(lat, lng, period)`: Série temporal
- `getNDVIAlerts(lat, lng, radius)`: Alertas da região
- `getVegetationHealth(lat, lng)`: Saúde da vegetação

#### Características:

- Integração com Sentinel Hub API
- Dados mock para desenvolvimento
- Cache de tokens de acesso
- Tratamento de erros
- Validação de coordenadas

```jsx
class NDVIService {
  async getNDVIData(latitude, longitude, startDate, endDate, options = {}) {
    try {
      if (this.useStaticData || !this.accessToken) {
        return this.getMockNDVIData(latitude, longitude, startDate, endDate);
      }
      // Implementação da API real
    } catch (error) {
      console.error("Erro ao buscar dados NDVI:", error);
      throw error;
    }
  }
}
```

### useScrollAnimation.js

Hook personalizado para animações baseadas em scroll.

#### Parâmetros:

- `threshold` (number): Limite de visibilidade (0-1)
- `rootMargin` (string): Margem do observer
- `triggerOnce` (boolean): Disparar apenas uma vez

#### Retorno:

- `ref`: Referência para o elemento
- `isVisible`: Estado de visibilidade

```jsx
const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);
    // ...
  }, []);

  return [ref, isVisible];
};
```

---

## Componentes UI Base

O projeto utiliza componentes base do Radix UI para funcionalidades avançadas:

### Sidebar Components

- `Sidebar`: Container principal
- `SidebarContent`: Área de conteúdo
- `SidebarGroup`: Agrupamento de itens
- `SidebarMenu`: Menu de navegação
- `SidebarMenuItem`: Item individual do menu

### Dialog Components

- `Dialog`: Modal base
- `DialogContent`: Conteúdo do modal
- `DialogHeader`: Cabeçalho
- `DialogTitle`: Título
- `DialogDescription`: Descrição

### Tooltip Components

- `Tooltip`: Container do tooltip
- `TooltipTrigger`: Elemento que dispara
- `TooltipContent`: Conteúdo do tooltip

---

## Padrões de Desenvolvimento

### Estrutura de Componentes

```
src/components/
├── ui/                  # Componentes base (Radix UI)
├── sections/            # Seções da landing page
├── layout/              # Componentes de layout
├── charts/              # Componentes de gráficos
└── maps/                # Componentes de mapas
```

### Convenções de Nomenclatura

- **Componentes**: PascalCase (ex: `NDVIChart.jsx`)
- **Props**: camelCase
- **Arquivos**: PascalCase para componentes
- **Hooks**: camelCase com prefixo `use`

### Padrões de Props

```jsx
// Exemplo de componente com props bem definidas
const Component = ({
  data = null, // Valor padrão
  onAction, // Callback
  showControls = true, // Boolean com padrão
  className = "", // Classes CSS opcionais
  ...props // Props adicionais
}) => {
  // Implementação
};
```

### Gerenciamento de Estado

- **Estado Local**: `useState` para estado de componente
- **Efeitos**: `useEffect` para side effects
- **Refs**: `useRef` para referências DOM
- **Context**: Para estado global quando necessário

### Tratamento de Erros

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.getData();
    // Processar dados
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Boas Práticas

### 1. Performance

- Use `React.memo` para componentes que não precisam re-renderizar
- Implemente lazy loading para componentes pesados
- Otimize imagens e assets
- Use `useCallback` e `useMemo` quando apropriado

### 2. Acessibilidade

- Mantenha contraste adequado
- Use ARIA labels quando necessário
- Implemente navegação por teclado
- Teste com leitores de tela

### 3. Responsividade

- Mobile-first approach
- Use breakpoints do Tailwind
- Teste em diferentes dispositivos
- Otimize para touch interfaces

### 4. Manutenibilidade

- Documente componentes complexos
- Use TypeScript quando possível
- Mantenha componentes pequenos e focados
- Implemente testes unitários

---

## Componentes Planejados

- [ ] NotificationCenter - Central de notificações
- [ ] UserProfile - Perfil detalhado do usuário
- [ ] PhotoUpload - Upload de imagens da comunidade
- [ ] AlertSystem - Sistema de alertas ambientais
- [ ] ReportGenerator - Gerador de relatórios
- [ ] ChatBot - Assistente virtual
- [ ] GameElements - Elementos de gamificação
- [ ] DataExport - Exportação de dados
- [ ] OfflineMode - Modo offline
- [ ] PWAFeatures - Funcionalidades PWA

---

## Storybook - Documentação Interativa dos Componentes

### Visão Geral

O OrBee.Online utiliza o Storybook para documentação interativa e desenvolvimento isolado de componentes. Cada componente principal possui stories que demonstram suas variações, estados e funcionalidades.

### Executando o Storybook

```bash
# Desenvolvimento
npm run storybook

# Build para produção
npm run build-storybook
```

### Stories Implementadas

#### Componentes de Landing Page

**AchievementsSection.stories.jsx**

- Default: Exibição padrão com métricas
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- MetricsShowcase: Showcase das métricas
- AchievementLevels: Diferentes níveis de conquista
- ResponsiveDemo: Demonstração responsiva

**CTASection.stories.jsx**

- Default: Call-to-action padrão
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- ButtonVariations: Variações de botões
- ResponsiveDemo: Demonstração responsiva
- ConversionDemo: Demonstração de conversão

**FAQSection.stories.jsx**

- Default: FAQ padrão
- DarkBackground: Fundo escuro
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- FAQStates: Estados das perguntas
- CompactVersion: Versão compacta
- ResponsiveDemo: Demonstração responsiva

**HowItWorksSection.stories.jsx**

- Default: Seção padrão
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- StepsShowcase: Showcase dos passos
- CompactVersion: Versão compacta
- ResponsiveDemo: Demonstração responsiva

**ProblemSection.stories.jsx**

- Default: Seção padrão
- LightBackground: Fundo claro
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- ImpactComparison: Comparação de impacto
- CompactVersion: Versão compacta
- ResponsiveDemo: Demonstração responsiva

**SolutionSection.stories.jsx**

- Default: Seção padrão
- LightBackground: Fundo claro
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- ColorVariations: Variações de cor
- CompactVersion: Versão compacta
- ResponsiveDemo: Demonstração responsiva

**TestimonialsSection.stories.jsx**

- Default: Depoimentos padrão
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- ResponsiveDemo: Demonstração responsiva
- AccessibilityDemo: Demonstração de acessibilidade

#### Componentes de Interface

**Header.stories.jsx**

- Default: Cabeçalho padrão
- WithPageContent: Com conteúdo da página
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- NavigationDemo: Demonstração de navegação
- ResponsiveDemo: Demonstração responsiva

**Footer.stories.jsx**

- Default: Rodapé padrão
- LightBackground: Fundo claro
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- SectionsBreakdown: Breakdown das seções
- CompactVersion: Versão compacta
- ResponsiveDemo: Demonstração responsiva

**Layout.stories.jsx**

- Default: Layout padrão
- WithPageContent: Com conteúdo da página
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- ResponsiveDemo: Demonstração responsiva

**AppSidebar.stories.jsx**

- Default: Sidebar padrão
- WithContent: Com conteúdo
- MobileView: Visualização mobile
- CollapsedState: Estado colapsado
- InteractiveDemo: Demonstração interativa
- ResponsiveDemo: Demonstração responsiva

#### Componentes de Dados NDVI

**NDVIMap.stories.jsx**

- Default: Mapa padrão
- WithData: Com dados NDVI
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- LayersShowcase: Showcase das camadas
- ResponsiveDemo: Demonstração responsiva

**NDVIChart.stories.jsx**

- Default: Gráfico padrão
- WithData: Com dados temporais
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- PeriodsShowcase: Showcase dos períodos
- ResponsiveDemo: Demonstração responsiva

**ZoneCard.stories.jsx**

- Default: Card padrão
- WithData: Com dados da zona
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- StatesShowcase: Showcase dos estados
- ResponsiveDemo: Demonstração responsiva

#### Componentes de UI Base

**FeaturesSection.stories.jsx**

- Default: Seção padrão
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- FeaturesShowcase: Showcase das funcionalidades
- ResponsiveDemo: Demonstração responsiva

**HeroSection.stories.jsx**

- Default: Hero padrão
- WithCustomBackground: Fundo personalizado
- MobileView: Visualização mobile
- TabletView: Visualização tablet
- InteractiveDemo: Demonstração interativa
- ElementsShowcase: Showcase dos elementos
- ResponsiveDemo: Demonstração responsiva

### Configurações do Storybook

#### Addons Configurados

- **Controls**: Controles interativos para props
- **Docs**: Documentação automática
- **Viewport**: Simulação de diferentes dispositivos
- **Essentials**: Conjunto essencial de addons

#### Decorators Padrão

- **BrowserRouter**: Para componentes que usam roteamento
- **Backgrounds**: Fundos personalizados para testes visuais
- **Themes**: Aplicação do tema OrBee

#### Parâmetros Globais

- **Layout**: Configuração de layout (centered, fullscreen, padded)
- **Viewport**: Breakpoints responsivos (mobile, tablet, desktop)
- **Backgrounds**: Gradientes e cores do sistema OrBee

### Padrões de Nomenclatura

#### Variações Padrão

- `Default`: Implementação padrão do componente
- `MobileView`: Otimizado para dispositivos móveis
- `TabletView`: Otimizado para tablets
- `InteractiveDemo`: Demonstração com controles interativos
- `ElementsShowcase`: Showcase de elementos individuais
- `ResponsiveDemo`: Demonstração de responsividade
- `WithCustomBackground`: Com fundo personalizado
- `CompactVersion`: Versão compacta do componente

#### ArgTypes Comuns

- `backgroundColor`: Cor de fundo
- `textColor`: Cor do texto
- `showElements`: Exibir/ocultar elementos
- `isInteractive`: Habilitar interatividade
- `size`: Tamanho do componente
- `variant`: Variação do componente

### Boas Práticas

#### Estrutura das Stories

1. **Configuração padrão** com título e componente
2. **Parâmetros globais** para layout e documentação
3. **Tags autodocs** para documentação automática
4. **Decorators** para contexto necessário
5. **Variações** organizadas por funcionalidade

#### Controles Interativos

- Usar `argTypes` para definir controles
- Implementar `args` para valores padrão
- Criar `actions` para callbacks
- Documentar props com descrições claras

#### Responsividade

- Testar em múltiplos viewports
- Criar variações específicas para mobile/tablet
- Usar parâmetros de viewport para demonstrações
- Validar comportamento em diferentes tamanhos

### Integração com Desenvolvimento

#### Fluxo de Trabalho

1. **Desenvolvimento**: Criar componente isoladamente
2. **Stories**: Documentar variações e estados
3. **Testes**: Validar comportamento visual
4. **Integração**: Incorporar na aplicação principal
5. **Documentação**: Atualizar docs com exemplos

#### Benefícios

- **Desenvolvimento isolado** de componentes
- **Documentação viva** sempre atualizada
- **Testes visuais** automatizados
- **Colaboração** entre design e desenvolvimento
- **Reutilização** de componentes padronizados
