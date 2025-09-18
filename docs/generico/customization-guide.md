# Guia de Customização para Novos Projetos

> **🎯 Objetivo**: Este guia explica como usar a documentação do OrBee.Online como base para criar novos projetos mantendo consistência de estilo e arquitetura.

---

## 📋 Visão Geral

A pasta `/docs/` do OrBee.Online foi estruturada para ser reutilizável em novos projetos. Os arquivos contêm templates e padrões que podem ser adaptados rapidamente, mantendo a qualidade e consistência visual.

### Arquivos Template Disponíveis

- **`design-tokens-template.md`**: Tokens de design genéricos
- **`design-system-template.md`**: Componentes e padrões visuais
- **`styling.md`**: Guia de estilos com placeholders `[CUSTOMIZAR]`
- **`components.md`**: Documentação de componentes React
- **`setup.md`**: Configuração técnica do projeto

---

## 🚀 Processo de Customização

### Passo 1: Definir Identidade Visual

#### 1.1 Escolher Paleta de Cores

```bash
# Ferramentas recomendadas:
# - Coolors.co (gerador de paletas)
# - Adobe Color (harmonias cromáticas)
# - Tailwind Color Generator
```

**Exemplo de definição:**

```css
/* Substitua no design-tokens-template.md */
:root {
  --primary-500: #3b82f6; /* Azul principal */
  --secondary-500: #f59e0b; /* Amarelo secundário */
  --accent-500: #10b981; /* Verde de destaque */
}
```

#### 1.2 Selecionar Tipografia

**Critérios de escolha:**

- **Legibilidade**: Para textos longos
- **Personalidade**: Alinhada com o brand
- **Performance**: Fontes web otimizadas

**Exemplo:**

```css
/* Para um projeto corporativo */
font-family: "Inter", system-ui, sans-serif; /* Textos gerais */
font-family: "Poppins", system-ui, sans-serif; /* Títulos */

/* Para um projeto criativo */
font-family: "Nunito", system-ui, sans-serif; /* Textos gerais */
font-family: "Fredoka One", cursive; /* Títulos */
```

### Passo 2: Configurar Design Tokens

#### 2.1 Copiar e Personalizar

```bash
# 1. Copie o arquivo template
cp design-tokens-template.md design-tokens.md

# 2. Substitua todos os placeholders [CUSTOMIZAR]
# 3. Defina valores específicos para seu projeto
```

#### 2.2 Exemplo de Customização

**Antes (Template):**

```css
--primary-500: [COR_HEX]; /* Exemplo: #22c55e */
```

**Depois (Customizado):**

```css
--primary-500: #3b82f6; /* Azul corporativo */
```

### Passo 3: Adaptar Componentes

#### 3.1 Personalizar Card Base

```jsx
// Exemplo: Card para projeto de e-commerce
const ProductCard = ({ children, className = "", featured = false }) => {
  return (
    <div
      className={`
      bg-white/95 backdrop-blur-sm 
      border border-blue-200/30 
      rounded-2xl p-6 
      shadow-lg hover:shadow-2xl 
      transition-all duration-300
      ${featured ? "ring-2 ring-blue-500" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
};
```

#### 3.2 Adaptar Noise Effect

```css
/* Para projeto minimalista - textura sutil */
.noise-bg::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-minimal'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-minimal)' opacity='0.15'/%3E%3C/svg%3E");
}

/* Para projeto artístico - textura intensa */
.noise-bg::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-artistic'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-artistic)' opacity='0.6'/%3E%3C/svg%3E");
}
```

### Passo 4: Configurar Tailwind CSS

#### 4.1 Atualizar tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // [CUSTOMIZAR] Suas cores específicas
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          // ... resto da escala
          500: "#3b82f6", // Cor principal
          // ... resto da escala
          900: "#1e3a8a",
        },
        // Adicione cores secundárias, de status, etc.
      },
      fontFamily: {
        // [CUSTOMIZAR] Suas fontes
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        // [CUSTOMIZAR] Animações específicas do projeto
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "gentle-bounce": "gentleBounce 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // [CUSTOMIZAR] Tema personalizado
        "meu-tema": {
          primary: "#3b82f6",
          secondary: "#f59e0b",
          accent: "#10b981",
          neutral: "#374151",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
```

---

## 🎨 Exemplos de Customização por Tipo de Projeto

### Projeto Corporativo

**Características:**

- Cores sóbrias (azuis, cinzas)
- Tipografia limpa (Inter, Roboto)
- Componentes minimalistas
- Animações sutis

```css
:root {
  --primary-500: #1e40af; /* Azul corporativo */
  --secondary-500: #6b7280; /* Cinza neutro */
  --accent-500: #059669; /* Verde sucesso */
}
```

### Projeto Criativo/Artístico

**Características:**

- Cores vibrantes
- Tipografia expressiva
- Noise effect pronunciado
- Animações dinâmicas

```css
:root {
  --primary-500: #ec4899; /* Rosa vibrante */
  --secondary-500: #f59e0b; /* Laranja energia */
  --accent-500: #8b5cf6; /* Roxo criativo */
}
```

### Projeto E-commerce

**Características:**

- Cores que transmitem confiança
- Foco em conversão
- Componentes de produto
- Call-to-actions destacados

```css
:root {
  --primary-500: #dc2626; /* Vermelho urgência */
  --secondary-500: #16a34a; /* Verde confiança */
  --accent-500: #f59e0b; /* Amarelo destaque */
}
```

---

## 🔧 Ferramentas e Recursos

### Geradores de Paleta

- **Coolors.co**: Gerador automático de paletas
- **Adobe Color**: Harmonias cromáticas profissionais
- **Tailwind Color Generator**: Escalas para Tailwind CSS

### Fontes Web

- **Google Fonts**: Biblioteca gratuita
- **Adobe Fonts**: Fontes premium
- **Font Squirrel**: Fontes comerciais gratuitas

### Testes de Acessibilidade

- **WebAIM Contrast Checker**: Contraste de cores
- **WAVE**: Avaliação de acessibilidade
- **axe DevTools**: Extensão para desenvolvedores

---

## ✅ Checklist de Implementação

### Preparação

- [ ] Definir identidade visual do projeto
- [ ] Escolher paleta de cores (primária, secundária, status)
- [ ] Selecionar tipografia (texto e display)
- [ ] Determinar intensidade do noise effect

### Customização

- [ ] Copiar `design-tokens-template.md` → `design-tokens.md`
- [ ] Substituir todos os placeholders `[CUSTOMIZAR]`
- [ ] Adaptar componentes base (Card, Badge, IconContainer)
- [ ] Configurar `tailwind.config.js`
- [ ] Atualizar tema do DaisyUI

### Validação

- [ ] Testar consistência visual em todas as telas
- [ ] Verificar contraste de cores (acessibilidade)
- [ ] Validar responsividade
- [ ] Testar performance das fontes
- [ ] Documentar decisões de design

### Documentação

- [ ] Atualizar `README.md` do projeto
- [ ] Documentar componentes customizados
- [ ] Criar guia de estilo específico
- [ ] Manter changelog de mudanças

---

## 🚨 Armadilhas Comuns

### 1. Inconsistência de Cores

**Problema**: Usar cores fora da paleta definida
**Solução**: Sempre referenciar as CSS custom properties

### 2. Sobrecarga Visual

**Problema**: Noise effect muito intenso
**Solução**: Começar com opacity baixa (0.1-0.3)

### 3. Performance de Fontes

**Problema**: Carregar muitas variações de fonte
**Solução**: Limitar a 2-3 pesos por família

### 4. Acessibilidade

**Problema**: Contraste insuficiente
**Solução**: Usar ferramentas de validação (WCAG AA)

---

## 📚 Próximos Passos

Após implementar a customização básica:

1. **Expandir Componentes**: Criar variações específicas
2. **Otimizar Performance**: Lazy loading, code splitting
3. **Testes A/B**: Validar decisões de design
4. **Documentação Viva**: Manter atualizada com mudanças
5. **Design System**: Evoluir para um sistema mais robusto

---

> **💡 Dica Final**: Mantenha a simplicidade. É melhor ter poucos elementos bem executados do que muitos elementos inconsistentes. Use este guia como base e evolua gradualmente conforme as necessidades do projeto.
