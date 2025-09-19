# Guia de Organização do Storybook

Este documento define as boas práticas e a estrutura recomendada para organizar as histórias do Storybook, garantindo consistência, escalabilidade e facilidade de navegação.

---

## 1. Estrutura baseada em Domínios

Organize as histórias em categorias que façam sentido para o produto:

- **Foundations (Fundamentos)**
  - Colors - Sistema de cores e paleta completa
  - Typography - Hierarquia tipográfica e variações
  - Spacing - Tokens de espaçamento e grids responsivos
  - Effects - Noise textures, animações e transições
  - Icons - Biblioteca de ícones organizados por contexto

- **UI (Primitivos de interface)**
  - Botões
  - Inputs
  - Modais
  - Dropdowns

- **Layout**
  - Header
  - Footer
  - Sidebar
  - Grid

- **Sections (Seções de Página)**
  - Hero
  - CTA
  - FAQ
  - Testimonials

- **Pages (Páginas/Fluxos)**
  - Landing Page
  - Dashboard
  - Fluxos de usuário

---

## 2. Nomeação Consistente

- Use **PascalCase** para componentes: `Button`, `Modal`, `CTASection`.
- Agrupe variações como sub-histórias:
  - `Button/Primary`
  - `Button/Secondary`
- Evite nomes técnicos demais — pense em quem consome:
  - Correto: `Section/Hero`
  - Incorreto: `HeroSectionComponent`

---

## 3. Hierarquia de Histórias

Aproveite `/` para criar hierarquias:

```ts
export default {
  title: "UI/Button",
  component: Button,
};
```

Exemplo de árvore resultante:
```
Foundations
  └── Colors
  └── Typography
  └── Spacing
  └── Effects
  └── Icons
UI
  └── Button
  └── Modal
Layout
  └── Header
  └── Sidebar
Sections
  └── Hero
  └── CTA
Pages
  └── Landing Page
```

## 4. Estados e Variações

Cada componente deve ter histórias para estados comuns:

**Button**
- Primary
- Secondary
- Disabled
- Loading

**Input**
- Empty
- With Text
- Error

---

## Visão Geral do Storybook

O Storybook é uma ferramenta de desenvolvimento que permite criar, testar e documentar componentes React de forma isolada. No OrBee.Online, utilizamos o Storybook para:

- **Desenvolvimento isolado** de componentes
- **Documentação interativa** e sempre atualizada
- **Testes visuais** de diferentes estados e variações
- **Colaboração** entre equipes de design e desenvolvimento
- **Padronização** de componentes reutilizáveis

## Configuração

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar Storybook em desenvolvimento
npm run storybook

# Build para produção
npm run build-storybook
```

### Estrutura de Arquivos

```
.storybook/
├── main.js          # Configuração principal (sintaxe ESM)
└── preview.js       # Configurações globais

src/components/
├── ComponentName.jsx
└── ComponentName.stories.jsx
```

### Configuração Atual

A configuração foi otimizada com os addons disponíveis:

**main.js:**
```javascript
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials', // Inclui: controls, docs, viewport, backgrounds, actions
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

**Nota:** O addon `@storybook/addon-essentials` já inclui os principais addons necessários:
- `@storybook/addon-controls` - Controles interativos
- `@storybook/addon-docs` - Documentação automática
- `@storybook/addon-viewport` - Testes de viewport
- `@storybook/addon-backgrounds` - Backgrounds personalizados
- `@storybook/addon-actions` - Actions para callbacks

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

## Arquitetura das Stories

### Estrutura Padrão

```jsx
import Component from "./Component";

export default {
  title: "Categoria/Component",
  component: Component,
  parameters: {
    layout: "centered", // ou 'fullscreen', 'padded'
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-br from-slate-900 to-emerald-900">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    backgroundColor: {
      control: { type: "color" },
    },
  },
};

export const Default = {
  args: {
    // props padrão
  },
};
```

### Categorias de Stories

#### 0. Foundations (Fundamentos)

- `Foundations/Colors` - Sistema de cores com paleta completa, variações de opacidade e exemplos de uso por contexto
- `Foundations/Typography` - Hierarquia tipográfica, escalas de tamanho e variações de cores para diferentes contextos
- `Foundations/Spacing` - Tokens de espaçamento, grids responsivos e padrões de layout com demonstrações práticas
- `Foundations/Effects` - Noise textures configuráveis, animações CSS e transições para elementos interativos
- `Foundations/Icons` - Biblioteca completa de ícones organizados por contexto (região, saúde, ações, interface, status, dados)

#### 1. Landing Page Components

- `Landing/AchievementsSection` - Seção de conquistas e métricas
- `Landing/CTASection` - Call-to-action principal
- `Landing/FAQSection` - Perguntas frequentes
- `Landing/HowItWorksSection` - Como funciona a plataforma
- `Landing/ProblemSection` - Apresentação do problema
- `Landing/SolutionSection` - Nossa solução
- `Landing/TestimonialsSection` - Depoimentos de usuários

#### 2. Layout Components

- `Layout/Header` - Cabeçalho da aplicação
- `Layout/Footer` - Rodapé com links e informações
- `Layout/Layout` - Layout base da aplicação
- `Layout/AppSidebar` - Barra lateral do dashboard

#### 3. Data Components

- `Data/NDVIMap` - Mapa interativo com dados NDVI
- `Data/NDVIChart` - Gráfico de evolução temporal NDVI
- `Data/ZoneCard` - Card de zona de monitoramento

#### 4. UI Components

- `UI/FeaturesSection` - Seção de funcionalidades
- `UI/HeroSection` - Seção hero da landing page

## Padrões de Variações

### Variações Obrigatórias

Toda story deve incluir pelo menos:

1. **Default**: Estado padrão do componente
2. **MobileView**: Otimizado para mobile (viewport: mobile1)
3. **TabletView**: Otimizado para tablet (viewport: tablet)
4. **ResponsiveDemo**: Demonstração de responsividade

### Variações Opcionais

- **InteractiveDemo**: Com controles interativos
- **ElementsShowcase**: Showcase de elementos individuais
- **WithCustomBackground**: Fundos personalizados
- **CompactVersion**: Versão compacta
- **AccessibilityDemo**: Demonstração de acessibilidade

## Configurações Avançadas

### Decorators Globais

```jsx
// .storybook/preview.js
import { BrowserRouter } from "react-router-dom";
import '../src/index.css';

export const decorators = [
  (Story) => (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900">
        <Story />
      </div>
    </BrowserRouter>
  ),
];
```

### Parâmetros de Viewport

```jsx
export const parameters = {
  viewport: {
    viewports: {
      mobile1: {
        name: "Mobile",
        styles: { width: "375px", height: "667px" },
      },
      tablet: {
        name: "Tablet",
        styles: { width: "768px", height: "1024px" },
      },
      desktop: {
        name: "Desktop",
        styles: { width: "1200px", height: "800px" },
      },
    },
    defaultViewport: 'desktop',
  },
  backgrounds: {
    default: 'orbee-gradient',
    values: [
      {
        name: 'orbee-gradient',
        value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #064e3b 100%)',
      },
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#1a1a1a',
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

### Backgrounds Personalizados

```jsx
export const parameters = {
  backgrounds: {
    default: "orbee-gradient",
    values: [
      {
        name: "orbee-gradient",
        value: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #064e3b 100%)",
      },
      {
        name: "light",
        value: "#ffffff",
      },
      {
        name: "dark",
        value: "#1a1a1a",
      },
    ],
  },
};
```

## Controles Interativos

### ArgTypes Implementados

Todas as stories foram padronizadas com argTypes consistentes:

#### ArgTypes Básicos (Todos os Componentes)
```jsx
argTypes: {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Cor de fundo do componente',
  },
}
```

#### ArgTypes Específicos por Categoria

**Header/Footer:**
```jsx
argTypes: {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Cor de fundo do componente',
  },
  textColor: {
    control: { type: 'color' },
    description: 'Cor do texto',
  },
  variant: {
    control: { type: 'radio' },
    options: ['default', 'transparent', 'solid'],
    description: 'Variação do componente',
  },
  showLogo: {
    control: { type: 'boolean' },
    description: 'Exibir logo',
  },
  isFixed: {
    control: { type: 'boolean' },
    description: 'Header fixo no topo',
  },
  showSocialLinks: {
    control: { type: 'boolean' },
    description: 'Exibir links sociais',
  },
  showNewsletter: {
    control: { type: 'boolean' },
    description: 'Exibir seção de newsletter',
  },
}
```

**Componentes de Dados:**
```jsx
argTypes: {
  backgroundColor: {
    control: { type: 'color' },
    description: 'Cor de fundo do componente',
  },
  // Controles específicos para dados NDVI, mapas, etc.
}
```
```

### Actions para Callbacks

```jsx
import { action } from "@storybook/addon-actions";

export const InteractiveDemo = {
  args: {
    onClick: action("clicked"),
    onSubmit: action("submitted"),
    onChange: action("changed"),
  },
};
```

## Testes Visuais

### Chromatic Integration

```bash
# Instalar Chromatic
npm install --save-dev chromatic

# Executar testes visuais
npx chromatic --project-token=<token>
```

### Snapshot Testing

```jsx
// Exemplo de teste de snapshot
import { render } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Component.stories";

const { Default, MobileView } = composeStories(stories);

test("renders default story", () => {
  const { container } = render(<Default />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## Documentação Automática

### JSDoc Comments

```jsx
/**
 * Componente de card para exibição de zonas de monitoramento
 *
 * @param {Object} zone - Dados da zona
 * @param {string} zone.id - ID único da zona
 * @param {string} zone.name - Nome da zona
 * @param {number} zone.ndvi - Valor NDVI atual
 */
const ZoneCard = ({ zone, onSelect, isSelected }) => {
  // implementação
};
```

### MDX Documentation

````mdx
# ZoneCard

O componente ZoneCard é usado para exibir informações de zonas de monitoramento.

## Uso

```jsx
<ZoneCard zone={zoneData} onSelect={handleSelect} isSelected={false} />
```
````

## Props

- `zone`: Objeto com dados da zona
- `onSelect`: Callback para seleção
- `isSelected`: Estado de seleção

````

## Mudanças Implementadas 📄🤖

### Reorganização Completa das Stories

1. **Categorização por Domínio:**
   - `Landing/` - Componentes da landing page
   - `Layout/` - Componentes de layout (Header, Footer, Sidebar)
   - `Data/` - Componentes relacionados a dados (NDVI, mapas, gráficos)
   - `UI/` - Componentes de interface genéricos

2. **Padronização de Variações:**
   - Todas as stories incluem: Default, MobileView, TabletView, ResponsiveDemo
   - Remoção de decorators desnecessários
   - Adição de tags "autodocs" para documentação automática

3. **ArgTypes Consistentes:**
   - backgroundColor em todos os componentes
   - Controles específicos por categoria (textColor, variant, etc.)
   - Descrições em português para melhor usabilidade

4. **Configuração Otimizada:**
   - Todos os addons recomendados instalados
   - Backgrounds personalizados configurados
   - Viewports padronizados para mobile, tablet e desktop

### Status Atual das Stories

✅ **Foundations Implementadas:**
- Colors (Foundations) - Sistema completo de cores com paleta, contextos e variações
- Typography (Foundations) - Hierarquia tipográfica e escalas responsivas
- Spacing (Foundations) - Tokens de espaçamento e grids com demonstrações práticas
- Effects (Foundations) - Noise textures, animações e transições interativas
- Icons (Foundations) - Biblioteca de ícones organizados por contexto e funcionalidade

✅ **Reorganizadas e Padronizadas:**
- AchievementsSection (Landing)
- AppSidebar (Layout)
- CTASection (Landing)
- FAQSection (Landing)
- FeaturesSection (UI)
- Footer (Layout)
- Header (Layout)
- HeroSection (UI)
- HowItWorksSection (Landing)
- Layout (Layout)
- NDVIChart (Data)
- NDVIMap (Data)
- ProblemSection (Landing)
- SolutionSection (Landing)
- TestimonialsSection (Landing)
- ZoneCard (Data)

## Boas Práticas Implementadas

### 1. Nomenclatura
- Nomes descritivos e consistentes
- Categorização lógica por domínio
- Prefixos padronizados para variações

### 2. Organização
- Estrutura hierárquica clara
- Ordem consistente das variações
- Documentação automática habilitada

### 3. Performance
- Remoção de decorators desnecessários
- Otimização de imports
- Configuração eficiente de addons

### 4. Acessibilidade
- Addon a11y configurado
- Controles de cor para teste de contraste
- Variações responsivas implementadas

### 5. Responsividade
- Viewports padronizados
- Variações obrigatórias para mobile/tablet
- ResponsiveDemo em todos os componentes

## Integração com CI/CD

### GitHub Actions

```yaml
name: Storybook Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build-storybook
      - run: npx chromatic --exit-zero-on-changes
````

### Deploy Automático

```bash
# Build e deploy para GitHub Pages
npm run build-storybook
gh-pages -d storybook-static
```

## Troubleshooting

### Problemas Comuns

1. **Componente não renderiza**

   - Verifique imports e exports
   - Confirme se todas as dependências estão instaladas
   - Valide props obrigatórias

2. **Estilos não aplicados**

   - Confirme importação do CSS
   - Verifique configuração do Tailwind
   - Valide decorators globais

3. **Roteamento não funciona**

   - Adicione BrowserRouter nos decorators
   - Use MemoryRouter para testes
   - Configure rotas mock se necessário

4. **Performance lenta**
   - Otimize imports (use lazy loading)
   - Reduza tamanho de dados mock
   - Configure webpack adequadamente

5. **Erros de chaves duplicadas**
   - Verificar se não há propriedades duplicadas como `tags` ou `argTypes` no export default
   - Consolidar configurações duplicadas em uma única declaração

### Debug

```jsx
// Adicionar logs para debug
export const DebugStory = {
  render: (args) => {
    console.log("Story args:", args);
    return <Component {...args} />;
  },
};
```

## Recursos Adicionais

- [Documentação oficial do Storybook](https://storybook.js.org/docs)
- [Addon Controls](https://storybook.js.org/docs/essentials/controls)
- [Addon Docs](https://storybook.js.org/docs/writing-docs/introduction)
- [Testing with Storybook](https://storybook.js.org/docs/writing-tests/introduction)
- [Visual Testing](https://storybook.js.org/docs/writing-tests/visual-testing)

## Contribuição

Ao criar novas stories:

1. Siga os padrões estabelecidos
2. Inclua todas as variações obrigatórias
3. Documente props e comportamentos
4. Teste em diferentes viewports
5. Valide acessibilidade
6. Atualize esta documentação se necessário
