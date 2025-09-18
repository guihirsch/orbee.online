# Design System e Estilização - Template Base

## Visão Geral

Este documento define a **estrutura base** de um design system moderno utilizando **Tailwind CSS** e **DaisyUI**. Serve como template reutilizável para diferentes projetos, mantendo consistência técnica enquanto permite customização visual.

> **📋 Para OrBee.Online**: Este projeto utiliza identidade visual inspirada na natureza e sustentabilidade, com valores de **inteligência coletiva**, **sustentabilidade** e **conexão com a natureza**.

> **🔧 Para Novos Projetos**: Customize as seções marcadas com `[CUSTOMIZAR]` conforme a identidade do seu projeto.

---

## Paleta de Cores [CUSTOMIZAR]

> **💡 Instrução**: Substitua as cores abaixo pela identidade visual do seu projeto. Use o arquivo `design-tokens-template.md` como referência.

### Cores Primárias - [NOME DO PROJETO]

Defina a paleta principal baseada na identidade do projeto:

```css
/* [CUSTOMIZAR] Paleta Primária - Exemplo: OrBee Green */
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
```

### Cores Secundárias - [NOME SECUNDÁRIO]

Defina a paleta secundária complementar:

```css
/* [CUSTOMIZAR] Paleta Secundária - Exemplo: Bee Yellow */
--secondary-50: #fefce8; /* Muito claro */
--secondary-100: #fef9c3; /* Claro */
--secondary-200: #fef08a; /* Suave */
--secondary-300: #fde047; /* Médio */
--secondary-400: #facc15; /* Vibrante */
--secondary-500: #eab308; /* Principal */
--secondary-600: #ca8a04; /* Escuro */
--secondary-700: #a16207; /* Mais escuro */
--secondary-800: #854d0e; /* Profundo */
--secondary-900: #713f12; /* Muito escuro */
```

### Cores de Status

```css
/* Status Colors */
--success: #36d399; /* Verde sucesso */
--warning: #fbbd23; /* Amarelo aviso */
--error: #f87272; /* Vermelho erro */
--info: #3abff8; /* Azul informação */
```

### Cores Neutras

```css
/* Neutral Colors */
--neutral: #374151; /* Cinza principal */
--base-100: #ffffff; /* Fundo branco */
--base-200: #f9fafb; /* Cinza muito claro */
--base-300: #f3f4f6; /* Cinza claro */
```

---

## Tipografia [CUSTOMIZAR]

### Fontes

> **💡 Instrução**: Escolha fontes que reflitam a personalidade do seu projeto.

#### Fonte Principal - [NOME DA FONTE]

```css
/* [CUSTOMIZAR] Exemplo: Inter para OrBee.Online */
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

- **Uso**: Textos gerais, parágrafos, labels, botões
- **Características**: [DESCREVER - Ex: Legibilidade, modernidade, neutralidade]

#### Fonte Display - [NOME DA FONTE]

```css
/* [CUSTOMIZAR] Exemplo: Poppins para OrBee.Online */
font-family: "Poppins", system-ui, -apple-system, sans-serif;
```

- **Uso**: Títulos, headings, elementos de destaque
- **Características**: [DESCREVER - Ex: Personalidade, impacto visual, amigabilidade]

### Escala Tipográfica

```css
/* Headings */
.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
} /* 60px - Hero titles */
.text-5xl {
  font-size: 3rem;
  line-height: 1;
} /* 48px - Page titles */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} /* 36px - Section titles */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} /* 30px - Subsections */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} /* 24px - Card titles */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} /* 20px - Large text */

/* Body Text */
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
} /* 18px - Large body */
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
} /* 16px - Default body */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} /* 14px - Small text */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} /* 12px - Captions */
```

### Pesos de Fonte

```css
.font-light {
  font-weight: 300;
} /* Textos delicados */
.font-normal {
  font-weight: 400;
} /* Texto padrão */
.font-medium {
  font-weight: 500;
} /* Destaque sutil */
.font-semibold {
  font-weight: 600;
} /* Títulos menores */
.font-bold {
  font-weight: 700;
} /* Títulos principais */
.font-extrabold {
  font-weight: 800;
} /* Hero titles */
```

---

## Componentes Base

### Botões

#### Botão Primário

```css
.btn-primary {
  @apply bg-orbee-500 hover:bg-orbee-600 text-white font-medium;
  @apply px-6 py-3 rounded-lg transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-orbee-500 focus:ring-offset-2;
}
```

#### Botão Secundário

```css
.btn-secondary {
  @apply bg-bee-yellow-500 hover:bg-bee-yellow-600 text-white font-medium;
  @apply px-6 py-3 rounded-lg transition-colors duration-200;
}
```

#### Botão Outline

```css
.btn-outline {
  @apply border-2 border-orbee-500 text-orbee-500 hover:bg-orbee-500 hover:text-white;
  @apply px-6 py-3 rounded-lg transition-all duration-200 font-medium;
}
```

#### Botão Ghost

```css
.btn-ghost {
  @apply text-orbee-600 hover:bg-orbee-50 hover:text-orbee-700;
  @apply px-4 py-2 rounded-md transition-colors duration-200;
}
```

### Cards

#### Card Base

```css
.card-base {
  @apply bg-white rounded-xl shadow-sm border border-gray-100;
  @apply p-6 transition-shadow duration-200 hover:shadow-md;
}
```

#### Card com Destaque

```css
.card-highlight {
  @apply bg-gradient-to-br from-orbee-50 to-bee-yellow-50;
  @apply border border-orbee-200 rounded-xl p-6;
  @apply shadow-sm hover:shadow-md transition-shadow duration-200;
}
```

### Inputs

#### Input Base

```css
.input-base {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-orbee-500 focus:border-orbee-500;
  @apply transition-colors duration-200 placeholder-gray-400;
}
```

#### Input com Erro

```css
.input-error {
  @apply border-red-300 focus:ring-red-500 focus:border-red-500;
}
```

---

## Layout e Espaçamento

### Grid System

```css
/* Container principal */
.container-main {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Grid responsivo */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Grid de dashboard */
.grid-dashboard {
  @apply grid grid-cols-1 lg:grid-cols-4 gap-6;
}
```

### Espaçamento

```css
/* Seções */
.section-spacing {
  @apply py-16 lg:py-24;
}
.section-spacing-sm {
  @apply py-8 lg:py-12;
}

/* Elementos */
.element-spacing {
  @apply mb-6;
}
.element-spacing-sm {
  @apply mb-4;
}
.element-spacing-lg {
  @apply mb-8;
}
```

---

## Gradientes e Backgrounds

### Gradientes Principais [CUSTOMIZAR]

````css
/* [CUSTOMIZAR] Gradiente principal do projeto */
.bg-gradient-primary {
  @apply bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400;
}

/* [CUSTOMIZAR] Gradiente suave */
.bg-gradient-soft {
  @apply bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100;
}

/* [CUSTOMIZAR] Gradiente hero */
.bg-gradient-hero {
  @apply bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500;
}

/* [CUSTOMIZAR] Gradiente de fundo da aplicação - Exemplo OrBee */
.bg-app-gradient {
  @apply bg-gradient-to-br from-[#D9ED92] via-[#B5E48C] to-[#99D98C];
}
```

### Padrões de Background [CUSTOMIZAR]

```css
/* [CUSTOMIZAR] Background com textura sutil */
.bg-textured {
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(34, 197, 94, 0.1) 1px,
    transparent 0
  );
  background-size: 20px 20px;
}

/* [CUSTOMIZAR] Noise effect - efeito de textura personalizado */
.noise-bg {
  position: relative;
  overflow: hidden;
}

.noise-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* [CUSTOMIZAR] Ajuste baseFrequency (0.1-2.0) e opacity (0.1-0.8) conforme necessário */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

.noise-bg > * {
  position: relative;
  z-index: 2;
}
````

---

## Animações e Transições

### Animações Customizadas [CUSTOMIZAR]

```css
/* [CUSTOMIZAR] Fade in suave */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* [CUSTOMIZAR] Fade in com movimento - ajuste translateY conforme necessário */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* [CUSTOMIZAR] Slide up */
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

/* [CUSTOMIZAR] Bounce gentil */
@keyframes bounceGentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce-gentle {
  animation: bounceGentle 2s infinite;
}

/* [CUSTOMIZAR] Bounce suave para elementos interativos */
@keyframes gentleBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    /* [CUSTOMIZAR] Ajuste a intensidade do bounce (-2px a -8px) */
    transform: translateY(-4px);
  }
}

.animate-gentle-bounce {
  /* [CUSTOMIZAR] Ajuste duração (1s-3s) conforme a personalidade do projeto */
  animation: gentleBounce 2s ease-in-out infinite;
}

/* [CUSTOMIZAR] Pulse suave */
@keyframes pulseGentle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-gentle {
  animation: pulseGentle 2s infinite;
}
```

### Transições Padrão

```css
/* Transições rápidas */
.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

/* Transições normais */
.transition-normal {
  @apply transition-all duration-200 ease-in-out;
}

/* Transições suaves */
.transition-smooth {
  @apply transition-all duration-300 ease-in-out;
}

/* Transições lentas */
.transition-slow {
  @apply transition-all duration-500 ease-in-out;
}
```

---

## Estados Interativos

### Hover States

```css
/* Hover para cards */
.hover-lift {
  @apply transition-transform duration-200 hover:transform hover:-translate-y-1;
}

/* Hover para botões */
.hover-scale {
  @apply transition-transform duration-200 hover:transform hover:scale-105;
}

/* Hover para imagens */
.hover-zoom {
  @apply transition-transform duration-300 hover:transform hover:scale-110;
}
```

### Focus States

```css
/* Focus padrão */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-orbee-500 focus:ring-offset-2;
}

/* Focus para elementos escuros */
.focus-ring-light {
  @apply focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orbee-500;
}
```

---

## Componentes Específicos

### NDVI Map Styles

```css
/* Container do mapa */
.ndvi-map-container {
  @apply relative w-full h-96 rounded-xl overflow-hidden shadow-lg;
}

/* Controles do mapa */
.map-controls {
  @apply absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-2;
}

/* Legenda NDVI */
.ndvi-legend {
  @apply absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm;
  @apply rounded-lg p-3 shadow-md;
}
```

### Zone Cards

```css
/* Card de zona */
.zone-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
  @apply transition-all duration-200 hover:shadow-md hover:border-orbee-200;
}

/* Status da zona */
.zone-status-critical {
  @apply bg-red-50 border-red-200 text-red-800;
}

.zone-status-warning {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.zone-status-success {
  @apply bg-green-50 border-green-200 text-green-800;
}
```

### Charts

```css
/* Container de gráfico */
.chart-container {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100;
}

/* Tooltip de gráfico */
.chart-tooltip {
  @apply bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg;
}
```

---

## Responsividade

### Breakpoints

```css
/* Mobile First Approach */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Padrões Responsivos

```css
/* Texto responsivo */
.text-responsive-hero {
  @apply text-4xl sm:text-5xl lg:text-6xl;
}

.text-responsive-title {
  @apply text-2xl sm:text-3xl lg:text-4xl;
}

/* Espaçamento responsivo */
.spacing-responsive {
  @apply px-4 sm:px-6 lg:px-8;
}

.padding-responsive {
  @apply py-8 sm:py-12 lg:py-16;
}

/* Grid responsivo */
.grid-responsive-cards {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6;
}
```

---

## Utilitários Personalizados

### Shadows

```css
/* Sombras customizadas */
.shadow-orbee {
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06);
}

.shadow-orbee-lg {
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05);
}
```

### Borders

```css
/* Bordas customizadas */
.border-orbee {
  @apply border border-orbee-200;
}

.border-orbee-thick {
  @apply border-2 border-orbee-300;
}
```

### Aspect Ratios

```css
/* Proporções úteis */
.aspect-map {
  @apply aspect-[16/10];
}
.aspect-card {
  @apply aspect-[4/3];
}
.aspect-avatar {
  @apply aspect-square;
}
```

---

## Dark Mode (Futuro)

### Preparação para Dark Mode

```css
/* Variáveis CSS para dark mode */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
}

/* Classes para dark mode */
.bg-primary {
  background-color: var(--bg-primary);
}
.bg-secondary {
  background-color: var(--bg-secondary);
}
.text-primary {
  color: var(--text-primary);
}
.text-secondary {
  color: var(--text-secondary);
}
```

---

## Acessibilidade

### Contraste

- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos interativos**: Mínimo 3:1

### Focus Indicators

```css
/* Indicadores de foco visíveis */
.focus-visible {
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-orbee-500;
}
```

### Screen Reader

```css
/* Texto apenas para screen readers */
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
}
```

---

## Performance

### Otimizações CSS

```css
/* Aceleração de hardware para animações */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Otimização de scroll */
.smooth-scroll {
  scroll-behavior: smooth;
}
```

### Lazy Loading de Estilos

```javascript
// Carregamento condicional de estilos pesados
const loadMapStyles = () => {
  import("./styles/mapbox.css");
};
```

---

## Boas Práticas

### 1. Consistência

- Use sempre as classes utilitárias do Tailwind
- Mantenha a paleta de cores definida
- Siga os padrões de espaçamento estabelecidos

### 2. Performance

- Evite CSS customizado desnecessário
- Use `@apply` para componentes reutilizáveis
- Otimize animações com `transform` e `opacity`

### 3. Manutenibilidade

- Documente componentes customizados
- Use variáveis CSS para valores dinâmicos
- Mantenha a especificidade baixa

### 4. Acessibilidade

- Teste com leitores de tela
- Mantenha contraste adequado
- Implemente navegação por teclado

---

## Ferramentas de Desenvolvimento

### Extensões VS Code

- **Tailwind CSS IntelliSense**: Autocomplete e preview
- **Headwind**: Ordenação automática de classes
- **Prettier**: Formatação consistente

### Configuração Prettier para Tailwind

```json
{
  "tailwindConfig": "./tailwind.config.js",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Checklist de Implementação

### ✅ Implementado

- [x] Paleta de cores OrBee
- [x] Tipografia com Inter e Poppins
- [x] Componentes base (botões, cards, inputs)
- [x] Sistema de grid responsivo
- [x] Animações customizadas
- [x] Tema DaisyUI personalizado

### 🔄 Em Desenvolvimento

- [ ] Dark mode completo
- [ ] Componentes de acessibilidade avançados
- [ ] Otimizações de performance
- [ ] Testes visuais automatizados

### 📋 Planejado

- [ ] Design tokens em JSON
- [ ] Storybook para documentação visual
- [ ] Testes de contraste automatizados
- [ ] Guia de migração para futuras versões

---

## Recursos e Referências

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Color System](https://material.io/design/color/)
- [Adobe Color Accessibility Tools](https://color.adobe.com/create/color-accessibility)

---

**Lembre-se**: O design system é um documento vivo que deve evoluir com o produto. Mantenha-o atualizado e documente todas as mudanças para garantir consistência em toda a equipe.
