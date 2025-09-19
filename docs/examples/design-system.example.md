# Design System - Template

> Este arquivo serve como template para documentar o design system de projetos. Adapte conforme necessário.

## Visão Geral

### Propósito
O design system define os padrões visuais, componentes e diretrizes de interface para garantir consistência em todo o projeto.

### Princípios de Design
- **Consistência**: Elementos similares devem ter aparência e comportamento similares
- **Simplicidade**: Interface limpa e intuitiva
- **Acessibilidade**: Seguir padrões WCAG 2.1
- **Responsividade**: Adaptação para diferentes dispositivos

## Tokens de Design

### Cores

#### Paleta Principal
```css
:root {
  /* Primary Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-900: #0c4a6e;

  /* Secondary Colors */
  --color-secondary-50: #f8fafc;
  --color-secondary-500: #64748b;
  --color-secondary-900: #0f172a;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

#### Uso das Cores
- **Primary**: Ações principais, links, botões primários
- **Secondary**: Texto secundário, bordas, backgrounds
- **Success**: Confirmações, estados de sucesso
- **Warning**: Alertas, estados de atenção
- **Error**: Erros, estados de falha
- **Info**: Informações, dicas

### Tipografia

#### Famílias de Fonte
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

#### Escalas Tipográficas
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Espaçamento

```css
:root {
  /* Spacing Scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

### Bordas e Sombras

```css
:root {
  /* Border Radius */
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

## Componentes Base

### Botões

#### Variações
- **Primary**: Ação principal da página
- **Secondary**: Ações secundárias
- **Outline**: Ações menos importantes
- **Ghost**: Ações sutis
- **Danger**: Ações destrutivas

#### Tamanhos
- **Small**: 32px altura, padding 8px 12px
- **Medium**: 40px altura, padding 10px 16px
- **Large**: 48px altura, padding 12px 20px

#### Estados
- **Default**: Estado padrão
- **Hover**: Ao passar o mouse
- **Active**: Ao clicar
- **Disabled**: Desabilitado
- **Loading**: Carregando

### Inputs

#### Tipos
- **Text**: Entrada de texto simples
- **Email**: Entrada de email
- **Password**: Entrada de senha
- **Number**: Entrada numérica
- **Textarea**: Texto longo
- **Select**: Seleção de opções

#### Estados
- **Default**: Estado padrão
- **Focus**: Com foco
- **Error**: Com erro
- **Disabled**: Desabilitado
- **Success**: Validação bem-sucedida

### Cards

#### Variações
- **Default**: Card básico
- **Elevated**: Com sombra elevada
- **Outlined**: Apenas com borda
- **Interactive**: Clicável com hover

### Modais

#### Tamanhos
- **Small**: 400px largura máxima
- **Medium**: 600px largura máxima
- **Large**: 800px largura máxima
- **Full**: Tela cheia em mobile

## Padrões de Layout

### Grid System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-12 {
  grid-template-columns: repeat(12, 1fr);
}
```

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## Animações e Transições

### Durações
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

### Easing
```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Padrões Comuns
```css
.transition-default {
  transition: all var(--duration-normal) var(--ease-in-out);
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Acessibilidade

### Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos gráficos**: Mínimo 3:1

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Screen Readers
- Usar `aria-label` para elementos sem texto
- Implementar `aria-describedby` para descrições
- Manter hierarquia de headings (h1, h2, h3...)

## Responsividade

### Abordagem Mobile-First
```css
/* Mobile (default) */
.component {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
  }
}
```

## Implementação

### CSS Custom Properties
Todos os tokens devem ser definidos como CSS custom properties para facilitar temas e manutenção.

### Tailwind CSS
Se usando Tailwind, configurar no `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
}
```

### Storybook
Documentar todos os componentes no Storybook com:
- Todas as variações
- Estados diferentes
- Props disponíveis
- Exemplos de uso

## Manutenção

### Versionamento
- Usar semantic versioning para mudanças
- Documentar breaking changes
- Manter changelog atualizado

### Revisões
- Revisar tokens trimestralmente
- Validar acessibilidade regularmente
- Atualizar documentação com mudanças

### Ferramentas
- **Design Tokens**: Style Dictionary
- **Linting**: Stylelint
- **Testing**: Chromatic para visual regression