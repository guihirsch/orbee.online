# Design System OrBee.Online

## 1. Configuração Base

### Dependências Necessárias

```json
{
  "dependencies": {
    "tailwindcss": "^3.3.5",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Configuração Tailwind (tailwind.config.js)

```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Paleta Meadow Green
        meadow: {
          50: "#D9ED92", // Verde claro
          100: "#B5E48C", // Verde claro médio
          200: "#99D98C", // Verde médio
          300: "#76C893", // Verde
          400: "#52B69A", // Verde escuro
          500: "#34A0A4", // Verde azulado
          600: "#168AAD", // Azul esverdeado
          700: "#1A759F", // Azul médio
          800: "#1E6091", // Azul escuro
          900: "#184E77", // Azul muito escuro
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### CSS Base (src/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200;
  }
  body {
    @apply bg-white text-gray-900;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none;
  }

  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700;
  }

  .btn-secondary {
    @apply btn bg-secondary-100 text-secondary-900 hover:bg-secondary-200;
  }

  .card {
    @apply rounded-lg border bg-white p-6 shadow-sm;
  }
}
```

## 2. Paleta de Cores

### Cores Primárias (Verde - Sustentabilidade)

- `primary-50`: #f0fdf4 - Fundos muito claros
- `primary-100`: #dcfce7 - Fundos claros
- `primary-600`: #16a34a - Cor principal (botões, links)
- `primary-700`: #15803d - Estados hover

### Cores Secundárias (Cinza - Neutralidade)

- `secondary-100`: #f1f5f9 - Fundos alternativos
- `secondary-600`: #475569 - Textos secundários
- `secondary-900`: #0f172a - Textos principais

### Cores Funcionais

- **Verde**: #22c55e - Sucesso, dados positivos
- **Azul**: #3b82f6 - Informações, água
- **Laranja**: #f97316 - Alertas, temperatura
- **Vermelho**: #ef4444 - Erros, alertas críticos
- **Roxo**: #8b5cf6 - Dados especiais, sazonalidade

## 3. Tipografia

### Fonte Principal

- **Família**: Inter (Google Fonts)
- **Importação**: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`

### Hierarquia de Textos

```jsx
// Títulos principais
<h1 className="text-2xl font-bold text-gray-900">

// Títulos de seção
<h2 className="text-lg font-semibold text-gray-900">

// Subtítulos
<h3 className="text-md font-medium text-gray-800">

// Texto corpo
<p className="text-sm text-gray-600">

// Texto pequeno/auxiliar
<span className="text-xs text-gray-500">
```

## 4. Componentes Base

### Botões

```jsx
// Botão primário
<button className="btn-primary">
  Texto do Botão
</button>

// Botão secundário
<button className="btn-secondary">
  Texto do Botão
</button>
```

### Cards

```jsx
<div className="card">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Título</h3>
  <p className="text-sm text-gray-600">Conteúdo do card</p>
</div>
```

### Badges de Status

```jsx
// Status ativo
<div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5">
  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
  <span className="text-xs font-medium text-green-700">Ativo</span>
</div>

// Status informativo
<div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
  <span className="text-xs font-medium text-blue-700">Informação</span>
</div>
```

## 5. Padrões de Layout

### Container Principal

```jsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{/* Conteúdo */}</div>
```

### Grid Responsivo

```jsx
// 2 colunas em desktop
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Cards */}
</div>

// 3 colunas em desktop
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
  {/* Cards */}
</div>
```

### Espaçamento Padrão

- **Padding interno**: `p-4`, `p-6` (cards)
- **Margin entre elementos**: `mb-4`, `mb-6`
- **Gap em grids**: `gap-4`, `gap-6`

## 6. Ícones (Lucide React)

### Ícones Principais

```jsx
import {
  MapPin, // Localização
  BarChart3, // Dashboard/Analytics
  Users, // Comunidade
  User, // Perfil
  Satellite, // Monitoramento
  Leaf, // Sustentabilidade
  Droplets, // Água/Umidade
  Thermometer, // Temperatura
  Calendar, // Tempo/Sazonalidade
  TrendingUp, // Crescimento
  AlertTriangle, // Alertas
  Info, // Informações
} from "lucide-react";
```

### Tamanhos Padrão

```jsx
// Pequeno (navegação)
<Icon className="h-4 w-4" />

// Médio (cards)
<Icon className="h-5 w-5 text-primary-600" />

// Grande (destaque)
<Icon className="h-6 w-6" />
```

## 7. Estados e Interações

### Estados de Hover

```jsx
className = "hover:bg-primary-700 hover:text-gray-900";
```

### Estados de Foco

```jsx
className =
  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
```

### Estados Desabilitados

```jsx
className = "disabled:opacity-50 disabled:pointer-events-none";
```

### Transições

```jsx
className = "transition-colors transition-opacity";
```

## 8. Gradientes

### Fundo da Aplicação

```jsx
className = "bg-gradient-to-br from-gray-50 to-gray-100";
```

### Cards Especiais

```jsx
// Verde para sustentabilidade
className = "bg-gradient-to-r from-green-50 to-emerald-50";

// Azul para dados
className = "bg-gradient-to-r from-blue-50 to-cyan-50";

// Multicolor para destaques
className = "bg-gradient-to-r from-green-50 to-blue-50";
```

## 9. Componentes Reutilizáveis

### Tooltip

```jsx
const InfoTooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};
```

### Progress Bar

```jsx
<div className="h-2 w-full rounded-full bg-gray-200">
  <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
</div>
```

## 10. Checklist de Implementação

### Para Novos Projetos:

1. ✅ Instalar dependências: `npm install tailwindcss lucide-react clsx tailwind-merge`
2. ✅ Copiar `tailwind.config.js`
3. ✅ Copiar `src/index.css`
4. ✅ Importar fonte Inter no HTML
5. ✅ Configurar PostCSS se necessário
6. ✅ Testar componentes base

### Customização:

- Alterar cores primárias conforme identidade visual
- Ajustar espaçamentos se necessário
- Adicionar novos componentes seguindo os padrões
- Manter consistência nos estados e transições

## 11. Paleta Meadow Green

### Cores da Paleta

A paleta Meadow Green foi criada especificamente para o dashboard de mesmo nome, inspirada em tons naturais de vegetação e água:

```css
/* Tons Verdes Claros */
--meadow-50: #d9ed92; /* Verde claro - backgrounds principais */
--meadow-100: #b5e48c; /* Verde claro médio - gradientes */
--meadow-200: #99d98c; /* Verde médio - elementos secundários */
--meadow-300: #76c893; /* Verde - botões e acentos */
--meadow-400: #52b69a; /* Verde escuro - CTAs principais */

/* Tons Azuis/Verdes Escuros */
--meadow-500: #34a0a4; /* Verde azulado - hover states */
--meadow-600: #168aad; /* Azul esverdeado - textos secundários */
--meadow-700: #1a759f; /* Azul médio - elementos interativos */
--meadow-800: #1e6091; /* Azul escuro - textos importantes */
--meadow-900: #184e77; /* Azul muito escuro - títulos principais */
```

### Uso Recomendado

```jsx
// Backgrounds principais
<div className="bg-[#D9ED92]">...</div>

// Gradientes
<div className="bg-gradient-to-br from-[#D9ED92] via-[#B5E48C] to-[#99D98C]">...</div>

// Botões primários
<button className="bg-[#52B69A] hover:bg-[#34A0A4] text-white">...</button>

// Textos
<h1 className="text-[#184E77]">Título Principal</h1>
<p className="text-[#168AAD]">Texto secundário</p>
```

### Acessibilidade

- Contraste adequado entre texto escuro (#184E77) e backgrounds claros
- Gradientes suaves para melhor legibilidade
- Estados de hover bem definidos para interatividade

---

**Criado para OrBee.Online** - Sistema de design focado em sustentabilidade e monitoramento ambiental.
