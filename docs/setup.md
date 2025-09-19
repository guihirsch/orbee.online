# Configuração e Setup - OrBee.Online

## Pré-requisitos

### Software Necessário

- **Node.js** (versão 18.0.0 ou superior)
- **npm** (versão 8.0.0 ou superior) ou **yarn**
- **Git** para controle de versão
- **Editor de código** (recomendado: VS Code)

### Contas e Serviços Externos

- **Mapbox** - Para mapas interativos
- **Supabase** - Banco de dados e autenticação
- **Sentinel Hub** - Dados de satélite NDVI (opcional para desenvolvimento)
- **Railway** - Deploy em produção

---

## Instalação

### 1. Clone do Repositório

```bash
git clone https://github.com/seu-usuario/orbee.online.git
cd orbee.online
```

### 2. Instalação de Dependências

```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=seu_token_mapbox_aqui

# Supabase
VITE_SUPABASE_URL=sua_url_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui

# Sentinel Hub (opcional)
VITE_SENTINEL_CLIENT_ID=seu_client_id_sentinel
VITE_SENTINEL_CLIENT_SECRET=seu_client_secret_sentinel

# Configurações da aplicação
VITE_APP_NAME=OrBee.Online
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Configuração do Mapbox

1. Acesse [Mapbox](https://www.mapbox.com/)
2. Crie uma conta gratuita
3. Gere um token de acesso
4. Adicione o token no arquivo `.env`

### 5. Configuração do Supabase

1. Acesse [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Copie a URL e a chave anônima
4. Configure as tabelas necessárias (veja seção Database Schema)

---

## Configuração do Vite

### vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    global: "globalThis",
  },
});
```

### Configurações Importantes

- **Aliases**: Facilitam imports relativos
- **Port**: Servidor de desenvolvimento na porta 3000
- **Host**: Permite acesso externo durante desenvolvimento
- **Sourcemap**: Facilita debugging em produção

---

## Configuração do Tailwind CSS

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta OrBee
        orbee: {
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
        "bee-yellow": {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    themes: [
      {
        orbee: {
          primary: "#22c55e",
          secondary: "#eab308",
          accent: "#86efac",
          neutral: "#374151",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
```

### Plugins Utilizados

- **DaisyUI**: Componentes pré-construídos
- **Forms**: Estilização de formulários
- **Typography**: Tipografia aprimorada

---

## Configuração do PostCSS

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Database Schema (Supabase)

### Tabelas Principais

#### users

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  location JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### zones

```sql
CREATE TABLE zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL,
  user_id UUID REFERENCES users(id),
  ndvi_data JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### observations

```sql
CREATE TABLE observations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  user_id UUID REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  description TEXT,
  photos JSONB DEFAULT '[]',
  coordinates JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ndvi_data

```sql
CREATE TABLE ndvi_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID REFERENCES zones(id),
  date DATE NOT NULL,
  ndvi_value DECIMAL(4,3),
  source VARCHAR(100) DEFAULT 'sentinel',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Políticas RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ndvi_data ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para zones
CREATE POLICY "Users can view own zones" ON zones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create zones" ON zones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own zones" ON zones
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## Comandos de Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run dev:host     # Inicia com acesso externo

# Build
npm run build        # Build de produção
npm run preview      # Preview do build

# Linting e Formatação
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas automaticamente
npm run format       # Formata código com Prettier

# Testes
npm run test         # Executa testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Cobertura de testes

# Utilitários
npm run clean        # Limpa cache e node_modules
npm run analyze      # Analisa bundle size
```

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 3. Iniciar desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## Configuração do VS Code

### Extensões Recomendadas

Crie `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Configurações do Workspace

Crie `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "tailwindCSS.experimental.classRegex": [
    "class[Name]*\\s*[:=]\\s*['\"]([^'\"]*)['\"]";
  ],
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## Configuração de Linting

### ESLint (.eslintrc.cjs)

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "react", "jsx-a11y"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
```

### Prettier (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## Estrutura de Pastas

```
orbee.online/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── charts/
│   │   └── maps/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Token Mapbox

```
Error: Invalid access token
```

**Solução**: Verifique se o token está correto no arquivo `.env`

#### 2. Erro de Conexão Supabase

```
Error: Invalid Supabase URL
```

**Solução**: Confirme URL e chave anônima no `.env`

#### 3. Problemas de Build

```
Error: Cannot resolve module
```

**Solução**:

- Limpe cache: `npm run clean`
- Reinstale dependências: `npm install`
- Verifique aliases no `vite.config.js`

#### 4. Problemas de Estilo

```
Tailwind classes not working
```

**Solução**:

- Verifique se o Tailwind está importado no `main.jsx`
- Confirme configuração no `tailwind.config.js`
- Reinicie o servidor de desenvolvimento

### Logs e Debug

```bash
# Logs detalhados do Vite
npm run dev -- --debug

# Análise do bundle
npm run analyze

# Verificar dependências
npm audit
```

---

## Próximos Passos

1. **Configurar autenticação** com Supabase Auth
2. **Implementar testes** unitários e de integração
3. **Configurar CI/CD** com GitHub Actions
4. **Otimizar performance** com lazy loading
5. **Implementar PWA** para uso offline
6. **Configurar monitoramento** com Sentry
7. **Documentar APIs** com Swagger/OpenAPI

---

## Recursos Úteis

- [Documentação Vite](https://vitejs.dev/)
- [Documentação React](https://react.dev/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)
- [Documentação DaisyUI](https://daisyui.com/)
- [Documentação Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Railway](https://docs.railway.app/)
- [Sentinel Hub API](https://docs.sentinel-hub.com/)

---

## Suporte

Para dúvidas ou problemas:

1. Consulte a documentação
2. Verifique issues no GitHub
3. Entre em contato com a equipe de desenvolvimento
4. Consulte a comunidade OrBee

**Lembre-se**: Mantenha suas credenciais seguras e nunca commite arquivos `.env` no repositório!
