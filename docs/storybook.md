# Guia de Organização do Storybook

Este documento define as boas práticas e a estrutura recomendada para organizar as histórias do Storybook, garantindo consistência, escalabilidade e facilidade de navegação.

---

## 1. Estrutura baseada em Domínios

Organize as histórias em categorias que façam sentido para o produto:

- **Foundations (Fundamentos)**
  - Cores
  - Tipografia
  - Espaçamento
  - Tokens de design

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

A configuração foi simplificada para máxima compatibilidade:

**main.js:**
```javascript
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

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

#### 1. Landing Page Components

- `Landing/AchievementsSection`
- `Landing/CTASection`
- `Landing/FAQSection`
- `Landing/HowItWorksSection`
- `Landing/ProblemSection`
- `Landing/SolutionSection`
- `Landing/TestimonialsSection`

#### 2. Layout Components

- `Layout/Header`
- `Layout/Footer`
- `Layout/Layout`
- `Layout/AppSidebar`

#### 3. Data Components

- `Data/NDVIMap`
- `Data/NDVIChart`
- `Data/ZoneCard`

#### 4. UI Components

- `UI/FeaturesSection`
- `UI/HeroSection`
- `UI/Input`
- `UI/Sidebar`

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

### ArgTypes Comuns

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
  size: {
    control: { type: 'select' },
    options: ['small', 'medium', 'large'],
    description: 'Tamanho do componente',
  },
  isVisible: {
    control: { type: 'boolean' },
    description: 'Controla a visibilidade',
  },
  variant: {
    control: { type: 'radio' },
    options: ['primary', 'secondary', 'tertiary'],
    description: 'Variação do componente',
  },
}
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

## Boas Práticas

### 1. Nomenclatura
- Use nomes descritivos para stories
- Mantenha consistência entre componentes similares
- Prefixe variações com contexto (Mobile, Tablet, etc.)

### 2. Organização
- Agrupe stories por funcionalidade
- Use categorias lógicas no título
- Mantenha ordem consistente das variações

### 3. Performance
- Evite dados muito grandes em stories
- Use mocks para APIs externas
- Otimize imagens e assets

### 4. Acessibilidade
- Teste com diferentes contrastes
- Inclua variações para screen readers
- Valide navegação por teclado

### 5. Responsividade
- Teste em múltiplos viewports
- Valide breakpoints críticos
- Documente comportamentos específicos

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
