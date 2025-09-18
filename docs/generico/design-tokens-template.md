# Design Tokens Template

## Guia de Tokens de Design Reutilizáveis

### Visão Geral

Este arquivo define os **design tokens** base que podem ser customizados para diferentes projetos. Os tokens são organizados em categorias e utilizam variáveis CSS para facilitar a personalização.

---

## 1. Tokens de Cor

### Cores Primárias

```css
/* Paleta Principal - Customizar para cada projeto */
:root {
  /* Primary Color Scale */
  --primary-50: #f0fdf4; /* Muito claro - backgrounds */
  --primary-100: #dcfce7; /* Claro - hover states */
  --primary-200: #bbf7d0; /* Suave - borders */
  --primary-300: #86efac; /* Médio - accents */
  --primary-400: #4ade80; /* Vibrante - interactive */
  --primary-500: #22c55e; /* Principal - primary */
  --primary-600: #16a34a; /* Escuro - hover primary */
  --primary-700: #15803d; /* Mais escuro - active */
  --primary-800: #166534; /* Profundo - text */
  --primary-900: #14532d; /* Muito escuro - headings */
}
```

### Cores Secundárias

```css
:root {
  /* Secondary Color Scale */
  --secondary-50: #fefce8;
  --secondary-100: #fef9c3;
  --secondary-200: #fef08a;
  --secondary-300: #fde047;
  --secondary-400: #facc15;
  --secondary-500: #eab308; /* Cor secundária principal */
  --secondary-600: #ca8a04;
  --secondary-700: #a16207;
  --secondary-800: #854d0e;
  --secondary-900: #713f12;
}
```

### Cores Semânticas

```css
:root {
  /* Status Colors - Universais */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Neutral Colors */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
}
```

### Cores de Background

```css
:root {
  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: var(--neutral-50);
  --bg-tertiary: var(--neutral-100);
  --bg-accent: var(--primary-50);

  /* Text Colors */
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-400);
  --text-accent: var(--primary-600);
}
```

---

## 2. Tokens de Tipografia

### Famílias de Fonte

```css
:root {
  /* Font Families - Customizar para cada projeto */
  --font-primary: "Inter", system-ui, -apple-system, sans-serif;
  --font-display: "Poppins", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}
```

### Escala Tipográfica

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
  --text-5xl: 3rem; /* 48px */
  --text-6xl: 3.75rem; /* 60px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

---

## 3. Tokens de Espaçamento

### Escala de Espaçamento

```css
:root {
  /* Spacing Scale */
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
  --space-32: 8rem; /* 128px */

  /* Semantic Spacing */
  --spacing-xs: var(--space-2);
  --spacing-sm: var(--space-4);
  --spacing-md: var(--space-6);
  --spacing-lg: var(--space-8);
  --spacing-xl: var(--space-12);
  --spacing-2xl: var(--space-16);
}
```

---

## 4. Tokens de Layout

### Breakpoints

```css
:root {
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Container Sizes */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### Bordas e Raios

```css
:root {
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem; /* 2px */
  --radius-base: 0.25rem; /* 4px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem; /* 8px */
  --radius-xl: 0.75rem; /* 12px */
  --radius-2xl: 1rem; /* 16px */
  --radius-3xl: 1.5rem; /* 24px */
  --radius-full: 9999px;

  /* Border Widths */
  --border-0: 0;
  --border-1: 1px;
  --border-2: 2px;
  --border-4: 4px;
  --border-8: 8px;
}
```

---

## 5. Tokens de Sombra

### Sombras

```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Colored Shadows - Usar com cores primárias */
  --shadow-primary: 0 4px 6px -1px rgba(var(--primary-500-rgb), 0.1);
  --shadow-secondary: 0 4px 6px -1px rgba(var(--secondary-500-rgb), 0.1);
}
```

---

## 6. Tokens de Animação

### Durações e Easings

```css
:root {
  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Animation Easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Semantic Transitions */
  --transition-fast: all var(--duration-fast) var(--ease-in-out);
  --transition-normal: all var(--duration-normal) var(--ease-in-out);
  --transition-slow: all var(--duration-slow) var(--ease-in-out);
}
```

---

## 7. Tokens Específicos de Componentes

### Botões

```css
:root {
  /* Button Tokens */
  --btn-padding-x: var(--space-6);
  --btn-padding-y: var(--space-3);
  --btn-radius: var(--radius-lg);
  --btn-font-weight: var(--font-medium);
  --btn-transition: var(--transition-normal);

  /* Button Sizes */
  --btn-sm-padding-x: var(--space-4);
  --btn-sm-padding-y: var(--space-2);
  --btn-lg-padding-x: var(--space-8);
  --btn-lg-padding-y: var(--space-4);
}
```

### Cards

```css
:root {
  /* Card Tokens */
  --card-padding: var(--space-6);
  --card-radius: var(--radius-xl);
  --card-shadow: var(--shadow-base);
  --card-border: var(--border-1) solid var(--neutral-200);
  --card-bg: var(--bg-primary);

  /* Card Hover */
  --card-hover-shadow: var(--shadow-md);
  --card-hover-transform: translateY(-2px);
}
```

### Inputs

```css
:root {
  /* Input Tokens */
  --input-padding-x: var(--space-4);
  --input-padding-y: var(--space-3);
  --input-radius: var(--radius-lg);
  --input-border: var(--border-1) solid var(--neutral-300);
  --input-focus-border: var(--border-2) solid var(--primary-500);
  --input-bg: var(--bg-primary);
}
```

---

## 8. Como Customizar para Novos Projetos

### Passo 1: Definir Identidade Visual

1. **Escolher cores primárias e secundárias**
2. **Definir fontes do projeto**
3. **Ajustar espaçamentos se necessário**
4. **Personalizar componentes específicos**

### Passo 2: Criar Arquivo de Customização

```css
/* custom-tokens.css - Exemplo para projeto "GreenTech" */
:root {
  /* Cores Primárias - Verde Tecnológico */
  --primary-500: #059669; /* Verde principal */
  --primary-600: #047857; /* Verde hover */

  /* Cores Secundárias - Azul Inovação */
  --secondary-500: #0ea5e9; /* Azul principal */
  --secondary-600: #0284c7; /* Azul hover */

  /* Fontes Específicas */
  --font-primary: "Roboto", sans-serif;
  --font-display: "Montserrat", sans-serif;
}
```

### Passo 3: Aplicar Classes Utilitárias

```css
/* Gerar classes baseadas nos tokens */
.bg-primary {
  background-color: var(--primary-500);
}
.text-primary {
  color: var(--primary-500);
}
.border-primary {
  border-color: var(--primary-500);
}

.bg-secondary {
  background-color: var(--secondary-500);
}
.text-secondary {
  color: var(--secondary-500);
}
.border-secondary {
  border-color: var(--secondary-500);
}
```

---

## 9. Integração com Tailwind CSS

### Configuração do tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },
      },
      fontFamily: {
        primary: "var(--font-primary)",
        display: "var(--font-display)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
      },
    },
  },
};
```

---

## 10. Vantagens desta Abordagem

### ✅ Benefícios

1. **Consistência**: Tokens garantem uniformidade visual
2. **Flexibilidade**: Fácil customização para diferentes projetos
3. **Manutenibilidade**: Mudanças centralizadas em variáveis CSS
4. **Escalabilidade**: Sistema cresce de forma organizada
5. **Colaboração**: Linguagem comum entre design e desenvolvimento
6. **Performance**: CSS nativo, sem dependências extras

### 🔄 Fluxo de Trabalho

1. **Copiar** este arquivo para novo projeto
2. **Customizar** tokens específicos (cores, fontes)
3. **Gerar** classes utilitárias baseadas nos tokens
4. **Aplicar** nos componentes do projeto
5. **Iterar** conforme necessário

---

## 11. Exemplos de Uso

### Componente com Tokens

```jsx
// Botão usando tokens
const Button = ({ variant = "primary", size = "md", children }) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-[var(--font-primary)] font-[var(--btn-font-weight)]
        transition-[var(--transition-normal)]
        rounded-[var(--btn-radius)]
        ${
          variant === "primary"
            ? "bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]"
            : ""
        }
        ${
          variant === "secondary"
            ? "bg-[var(--secondary-500)] text-white hover:bg-[var(--secondary-600)]"
            : ""
        }
        ${
          size === "sm"
            ? "px-[var(--btn-sm-padding-x)] py-[var(--btn-sm-padding-y)] text-[var(--text-sm)]"
            : ""
        }
        ${
          size === "md"
            ? "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] text-[var(--text-base)]"
            : ""
        }
        ${
          size === "lg"
            ? "px-[var(--btn-lg-padding-x)] py-[var(--btn-lg-padding-y)] text-[var(--text-lg)]"
            : ""
        }
      `}
    >
      {children}
    </button>
  );
};
```

### Card com Tokens

```jsx
// Card usando tokens
const Card = ({ children, hover = true }) => {
  return (
    <div
      className={`
        bg-[var(--card-bg)] 
        p-[var(--card-padding)] 
        rounded-[var(--card-radius)]
        border-[var(--card-border)]
        shadow-[var(--card-shadow)]
        transition-[var(--transition-normal)]
        ${
          hover
            ? "hover:shadow-[var(--card-hover-shadow)] hover:transform hover:[var(--card-hover-transform)]"
            : ""
        }
      `}
    >
      {children}
    </div>
  );
};
```

---

**Próximos Passos**: Use este template como base e crie arquivos de customização específicos para cada projeto, mantendo a estrutura e organização consistentes.
