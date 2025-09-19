# Storybook - Template

> Este arquivo serve como template para documentar o uso e configuração do Storybook em projetos. Adapte conforme necessário.

## Visão Geral

### O que é o Storybook
O Storybook é uma ferramenta para desenvolvimento de componentes UI de forma isolada. Permite:
- Desenvolver componentes independentemente
- Documentar casos de uso
- Testar diferentes estados
- Facilitar colaboração entre design e desenvolvimento

### Benefícios
- **Desenvolvimento Isolado**: Componentes sem dependências externas
- **Documentação Viva**: Exemplos sempre atualizados
- **Testes Visuais**: Verificação de diferentes estados
- **Colaboração**: Interface comum para designers e desenvolvedores

## Configuração

### Instalação
```bash
# Instalar Storybook
npx storybook@latest init

# Ou manualmente
npm install --save-dev @storybook/react @storybook/react-vite
```

### Estrutura de Arquivos
```
project-root/
├── .storybook/
│   ├── main.js          # Configuração principal
│   ├── preview.js       # Configurações globais
│   └── manager.js       # Customização da UI
├── src/
│   └── components/
│       ├── Button/
│       │   ├── Button.jsx
│       │   ├── Button.stories.jsx
│       │   └── Button.test.jsx
│       └── Card/
│           ├── Card.jsx
│           ├── Card.stories.jsx
│           └── Card.test.jsx
└── stories/
    ├── Introduction.stories.mdx
    └── DesignSystem.stories.mdx
```

### Configuração Principal (.storybook/main.js)
```javascript
module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  features: {
    buildStoriesJson: true
  },
  docs: {
    autodocs: 'tag'
  }
};
```

### Configuração Global (.storybook/preview.js)
```javascript
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  docs: {
    theme: themes.light
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px'
        }
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px'
        }
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1200px',
          height: '800px'
        }
      }
    }
  }
};

export const decorators = [
  (Story) => (
    <div style={{ margin: '3em', fontFamily: 'Inter, sans-serif' }}>
      <Story />
    </div>
  )
];
```

## Escrevendo Stories

### Estrutura Básica
```javascript
// Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Componente de botão reutilizável com diferentes variações.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    onClick: { action: 'clicked' }
  }
};

// Template base
const Template = (args) => <Button {...args} />;

// Stories individuais
export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Button Primary',
  size: 'md'
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Button Secondary',
  size: 'md'
};

export const Disabled = Template.bind({});
Disabled.args = {
  variant: 'primary',
  children: 'Button Disabled',
  disabled: true
};

export const AllSizes = () => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </div>
);
```

### Story Avançada com Interações
```javascript
import { userEvent, within, expect } from '@storybook/test';

export const WithInteraction = Template.bind({});
WithInteraction.args = {
  variant: 'primary',
  children: 'Click me'
};

WithInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button');
  
  await userEvent.click(button);
  await expect(button).toHaveFocus();
};
```

## Padrões de Organização

### Nomenclatura de Stories
- Use PascalCase para nomes de stories
- Seja descritivo: `WithLongText`, `InLoadingState`
- Agrupe por funcionalidade: `AllSizes`, `AllVariants`

### Estrutura de Pastas
```
src/components/
├── Button/
│   ├── Button.jsx
│   ├── Button.stories.jsx
│   ├── Button.test.jsx
│   └── index.js
├── Card/
│   ├── Card.jsx
│   ├── Card.stories.jsx
│   └── index.js
└── Form/
    ├── Input/
    │   ├── Input.jsx
    │   ├── Input.stories.jsx
    │   └── index.js
    ├── Select/
    │   ├── Select.jsx
    │   ├── Select.stories.jsx
    │   └── index.js
    └── Form.stories.jsx  # Stories compostas
```

### Categorização
```javascript
export default {
  title: 'Design System/Components/Button',  // Hierarquia clara
  component: Button
};

// Ou por funcionalidade
export default {
  title: 'Forms/Input',
  component: Input
};

// Ou por página
export default {
  title: 'Pages/Dashboard/Components/Chart',
  component: Chart
};
```

## Documentação com MDX

### Introduction.stories.mdx
```mdx
import { Meta } from '@storybook/addon-docs';

<Meta title="Introduction" />

# Design System

Bem-vindo ao nosso Design System! Esta documentação contém todos os componentes, padrões e diretrizes para construir interfaces consistentes.

## Como usar

1. **Navegue pelos componentes** na sidebar
2. **Teste diferentes props** usando os controles
3. **Copie o código** dos exemplos
4. **Verifique a documentação** de cada componente

## Componentes Disponíveis

- **Buttons**: Botões para ações
- **Forms**: Inputs, selects e formulários
- **Layout**: Cards, grids e containers
- **Navigation**: Headers, menus e breadcrumbs
- **Feedback**: Alerts, modals e tooltips
```

### Component.stories.mdx
```mdx
import { Meta, Story, Canvas, ArgsTable } from '@storybook/addon-docs';
import { Button } from './Button';

<Meta title="Components/Button" component={Button} />

# Button

O componente Button é usado para ações e navegação.

## Uso Básico

<Canvas>
  <Story name="Basic">
    <Button>Click me</Button>
  </Story>
</Canvas>

## Variações

### Por Tipo
<Canvas>
  <Story name="Variants">
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  </Story>
</Canvas>

### Por Tamanho
<Canvas>
  <Story name="Sizes">
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  </Story>
</Canvas>

## Props

<ArgsTable of={Button} />

## Diretrizes de Uso

### Quando usar
- Para ações primárias e secundárias
- Para navegação entre páginas
- Para submissão de formulários

### Quando não usar
- Para navegação dentro da página (use links)
- Para ações destrutivas sem confirmação

### Acessibilidade
- Sempre inclua texto descritivo
- Use `aria-label` quando necessário
- Mantenha contraste adequado
```

## Addons Úteis

### Essentials (Incluído por padrão)
- **Controls**: Editar props dinamicamente
- **Actions**: Log de eventos
- **Docs**: Documentação automática
- **Viewport**: Testar diferentes tamanhos
- **Backgrounds**: Testar diferentes fundos

### Addons Adicionais
```bash
# Acessibilidade
npm install --save-dev @storybook/addon-a11y

# Design tokens
npm install --save-dev @storybook/addon-design-tokens

# Figma
npm install --save-dev @storybook/addon-design

# Testes visuais
npm install --save-dev @storybook/addon-chromatic
```

## Scripts Package.json
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:test": "test-storybook",
    "chromatic": "chromatic --exit-zero-on-changes"
  }
}
```

## Deploy

### Netlify/Vercel
```bash
# Build
npm run build-storybook

# Deploy pasta storybook-static
```

### GitHub Pages
```yaml
# .github/workflows/storybook.yml
name: Build and Deploy Storybook
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build-storybook
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## Boas Práticas

### Desenvolvimento
1. **Crie stories para todos os estados** do componente
2. **Use controles** para props importantes
3. **Documente casos de uso** específicos
4. **Teste acessibilidade** com addon-a11y
5. **Mantenha stories simples** e focadas

### Organização
1. **Estrutura hierárquica** clara
2. **Nomenclatura consistente**
3. **Documentação atualizada**
4. **Exemplos práticos**
5. **Guidelines de uso**

### Performance
1. **Lazy loading** de stories pesadas
2. **Otimize assets** (imagens, ícones)
3. **Use mocks** para dados externos
4. **Minimize dependências** desnecessárias

## Troubleshooting

### Problemas Comuns

#### Stories não aparecem
- Verificar padrão de arquivos em `main.js`
- Verificar export default da story
- Verificar sintaxe do arquivo

#### Estilos não carregam
- Importar CSS no `preview.js`
- Verificar configuração do bundler
- Verificar paths dos assets

#### Controles não funcionam
- Verificar argTypes
- Verificar props do componente
- Verificar TypeScript definitions

### Comandos Úteis
```bash
# Limpar cache
npm run storybook -- --no-manager-cache

# Debug
DEBUG=storybook:* npm run storybook

# Analisar bundle
npm run build-storybook -- --webpack-stats-json
```

## Integração com Testes

### Test Runner
```bash
# Instalar
npm install --save-dev @storybook/test-runner

# Executar
npm run test-storybook
```

### Visual Testing
```bash
# Chromatic
npm install --save-dev chromatic
npx chromatic --project-token=<your-project-token>
```

## Recursos

- **Documentação oficial**: https://storybook.js.org/docs
- **Addons**: https://storybook.js.org/addons
- **Exemplos**: https://github.com/storybookjs/storybook/tree/main/examples
- **Community**: https://discord.gg/storybook