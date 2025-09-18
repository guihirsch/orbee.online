# Guia de Contribuição - OrBee.Online

## Bem-vindo ao OrBee.Online! 🐝🌱

Obrigado por seu interesse em contribuir com o OrBee.Online! Este projeto visa conectar satélites, comunidades e governos para ações locais com impacto global na preservação ambiental.

**Missão**: Criar uma plataforma de inteligência coletiva para monitoramento hiperlocal da saúde da mata ciliar e engajamento comunitário.

---

## Como Contribuir

### 1. Tipos de Contribuição

#### 🐛 Reportar Bugs

- Use o template de issue para bugs
- Inclua passos para reproduzir
- Adicione screenshots quando relevante
- Especifique ambiente (browser, OS, dispositivo)

#### ✨ Sugerir Funcionalidades

- Use o template de feature request
- Descreva o problema que resolve
- Proponha uma solução
- Considere o impacto na experiência do usuário

#### 📝 Melhorar Documentação

- Corrija erros de digitação
- Adicione exemplos práticos
- Traduza conteúdo
- Melhore clareza das instruções

#### 🔧 Contribuir com Código

- Implemente novas funcionalidades
- Corrija bugs existentes
- Melhore performance
- Adicione testes

---

## Configuração do Ambiente

### 1. Pré-requisitos

```bash
# Versões mínimas
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.30.0
```

### 2. Fork e Clone

```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU_USUARIO/orbee.online.git
cd orbee.online

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/USUARIO_ORIGINAL/orbee.online.git

# 4. Instale dependências
npm install
```

### 3. Configuração de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis necessárias
# Veja docs/setup.md para detalhes
```

### 4. Verificação da Instalação

```bash
# Execute os testes
npm run test

# Execute o linting
npm run lint

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## Fluxo de Trabalho

### 1. Antes de Começar

```bash
# Sincronize com o repositório principal
git checkout main
git pull upstream main
git push origin main
```

### 2. Criando uma Branch

```bash
# Use convenção de nomenclatura
git checkout -b tipo/descricao-curta

# Exemplos:
git checkout -b feature/ndvi-chart-improvements
git checkout -b fix/map-loading-issue
git checkout -b docs/update-setup-guide
git checkout -b refactor/component-structure
```

#### Convenções de Branch

- `feature/`: Novas funcionalidades
- `fix/`: Correção de bugs
- `docs/`: Atualizações de documentação
- `refactor/`: Refatoração de código
- `test/`: Adição ou correção de testes
- `style/`: Mudanças de estilo/formatação
- `perf/`: Melhorias de performance

### 3. Desenvolvimento

```bash
# Faça suas alterações
# Execute testes frequentemente
npm run test

# Verifique linting
npm run lint

# Execute o projeto localmente
npm run dev
```

### 4. Commits

#### Convenção de Commit (Conventional Commits)

```bash
# Formato
tipo(escopo): descrição

# Exemplos
feat(ndvi): adiciona gráfico de evolução temporal
fix(map): corrige erro de carregamento do Mapbox
docs(readme): atualiza instruções de instalação
refactor(components): reorganiza estrutura de pastas
test(ndvi): adiciona testes para NDVIService
style(ui): aplica formatação Prettier
perf(map): otimiza renderização de camadas NDVI
```

#### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `perf`: Melhoria de performance
- `chore`: Tarefas de manutenção
- `ci`: Mudanças em CI/CD
- `build`: Mudanças no sistema de build

#### Escopos Comuns

- `ndvi`: Funcionalidades relacionadas ao NDVI
- `map`: Componentes de mapa
- `auth`: Autenticação
- `ui`: Interface do usuário
- `api`: Integrações de API
- `db`: Banco de dados
- `config`: Configurações

### 5. Pull Request

```bash
# Push da branch
git push origin sua-branch

# Crie PR no GitHub
# Use o template fornecido
```

---

## Padrões de Código

### 1. Estrutura de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── features/       # Componentes específicos de funcionalidade
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── services/           # Serviços e integrações de API
├── utils/              # Funções utilitárias
├── lib/                # Configurações de bibliotecas
├── assets/             # Assets estáticos
└── styles/             # Estilos globais
```

### 2. Convenções de Nomenclatura

#### Arquivos e Pastas

```bash
# Componentes: PascalCase
NDVIMap.jsx
ZoneCard.jsx
UserProfile.jsx

# Hooks: camelCase com prefixo 'use'
useScrollAnimation.js
useNDVIData.js
useAuth.js

# Serviços: camelCase com sufixo 'Service'
ndviService.js
authService.js
mapService.js

# Utilitários: camelCase
formatDate.js
validateEmail.js
calculateNDVI.js

# Páginas: PascalCase
Home.jsx
Dashboard.jsx
Community.jsx
```

#### Variáveis e Funções

```javascript
// camelCase para variáveis e funções
const ndviValue = 0.75;
const userName = "João Silva";

function calculateNDVITrend(data) {
  // implementação
}

// PascalCase para componentes
function NDVIChart({ data }) {
  // implementação
}

// UPPER_SNAKE_CASE para constantes
const MAX_NDVI_VALUE = 1.0;
const API_BASE_URL = "https://api.orbee.online";
```

### 3. Estrutura de Componentes

```jsx
// Template de componente
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Componente para exibir dados NDVI em formato de gráfico
 * @param {Object} props - Props do componente
 * @param {Array} props.data - Dados NDVI para exibição
 * @param {string} props.title - Título do gráfico
 * @param {Function} props.onDataSelect - Callback para seleção de dados
 */
function NDVIChart({ data, title, onDataSelect }) {
  // 1. Hooks de estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Hooks de efeito
  useEffect(() => {
    // lógica de efeito
  }, [data]);

  // 3. Handlers de eventos
  const handleDataClick = (dataPoint) => {
    onDataSelect?.(dataPoint);
  };

  // 4. Renderização condicional
  if (loading) {
    return <div className="animate-pulse">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  // 5. Renderização principal
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {/* conteúdo do gráfico */}
    </div>
  );
}

// 6. PropTypes
NDVIChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  onDataSelect: PropTypes.func,
};

// 7. Default props
NDVIChart.defaultProps = {
  title: "Dados NDVI",
  onDataSelect: null,
};

export default NDVIChart;
```

### 4. Hooks Customizados

```javascript
// Template de hook customizado
import { useState, useEffect } from "react";
import { ndviService } from "../services/ndviService";

/**
 * Hook para gerenciar dados NDVI
 * @param {string} zoneId - ID da zona para buscar dados
 * @returns {Object} Estado e funções para gerenciar dados NDVI
 */
export function useNDVIData(zoneId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!zoneId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ndviService.getTimeSeriesData(zoneId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [zoneId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

### 5. Serviços

```javascript
// Template de serviço
class NDVIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
    this.apiKey = import.meta.env.VITE_SENTINEL_API_KEY;
  }

  /**
   * Busca dados de série temporal NDVI
   * @param {string} zoneId - ID da zona
   * @param {Object} options - Opções da consulta
   * @returns {Promise<Array>} Dados NDVI
   */
  async getTimeSeriesData(zoneId, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/ndvi/${zoneId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados NDVI:", error);
      throw error;
    }
  }
}

export const ndviService = new NDVIService();
```

---

## Estilização

### 1. Tailwind CSS

```jsx
// Use classes utilitárias do Tailwind
<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Título do Card</h2>
  <p className="text-gray-600 leading-relaxed">
    Conteúdo do card com texto bem formatado.
  </p>
</div>
```

### 2. Classes Customizadas

```css
/* Use @apply para componentes reutilizáveis */
@layer components {
  .btn-primary {
    @apply bg-green-500 hover:bg-green-600 text-white font-medium;
    @apply px-6 py-3 rounded-lg transition-colors duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
  }

  .card-base {
    @apply bg-white rounded-xl shadow-sm border border-gray-100;
    @apply p-6 transition-shadow duration-200 hover:shadow-md;
  }
}
```

### 3. Responsividade

```jsx
// Mobile-first approach
<div
  className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4
"
>
  {/* conteúdo */}
</div>
```

---

## Testes

### 1. Estrutura de Testes

```
__tests__/
├── components/
│   ├── NDVIMap.test.jsx
│   └── ZoneCard.test.jsx
├── hooks/
│   └── useNDVIData.test.js
├── services/
│   └── ndviService.test.js
└── utils/
    └── formatDate.test.js
```

### 2. Testes de Componentes

```jsx
// NDVIChart.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NDVIChart from "../NDVIChart";

describe("NDVIChart", () => {
  const mockData = [
    { date: "2024-01-01", value: 0.75 },
    { date: "2024-01-02", value: 0.8 },
  ];

  it("renderiza o título corretamente", () => {
    render(<NDVIChart data={mockData} title="Teste NDVI" />);
    expect(screen.getByText("Teste NDVI")).toBeInTheDocument();
  });

  it("chama onDataSelect quando um ponto é clicado", () => {
    const mockOnDataSelect = vi.fn();
    render(<NDVIChart data={mockData} onDataSelect={mockOnDataSelect} />);

    // Simular clique em um ponto
    fireEvent.click(screen.getByTestId("data-point-0"));
    expect(mockOnDataSelect).toHaveBeenCalledWith(mockData[0]);
  });
});
```

### 3. Testes de Hooks

```javascript
// useNDVIData.test.js
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useNDVIData } from "../useNDVIData";
import { ndviService } from "../../services/ndviService";

// Mock do serviço
vi.mock("../../services/ndviService");

describe("useNDVIData", () => {
  it("carrega dados NDVI corretamente", async () => {
    const mockData = [{ date: "2024-01-01", value: 0.75 }];
    ndviService.getTimeSeriesData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNDVIData("zone-123"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });
});
```

### 4. Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes específicos
npm run test NDVIChart
```

---

## Linting e Formatação

### 1. ESLint

```bash
# Executar linting
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix
```

### 2. Prettier

```bash
# Formatar código
npm run format

# Verificar formatação
npm run format:check
```

### 3. Configuração do Editor

#### VS Code (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascriptreact"
  }
}
```

---

## Documentação

### 1. Comentários de Código

```javascript
/**
 * Calcula a tendência NDVI baseada em dados históricos
 * @param {Array<Object>} data - Array de objetos com date e value
 * @param {number} windowSize - Tamanho da janela para cálculo (padrão: 7)
 * @returns {Object} Objeto com trend ('up'|'down'|'stable') e slope
 * @example
 * const trend = calculateNDVITrend([
 *   { date: '2024-01-01', value: 0.7 },
 *   { date: '2024-01-02', value: 0.75 }
 * ]);
 * console.log(trend); // { trend: 'up', slope: 0.05 }
 */
function calculateNDVITrend(data, windowSize = 7) {
  // implementação
}
```

### 2. README de Componentes

````markdown
# NDVIChart

Componente para visualização de dados NDVI em formato de gráfico de linha.

## Props

| Prop         | Tipo     | Obrigatório | Padrão       | Descrição                       |
| ------------ | -------- | ----------- | ------------ | ------------------------------- |
| data         | Array    | Sim         | -            | Array de objetos com dados NDVI |
| title        | string   | Não         | 'Dados NDVI' | Título do gráfico               |
| onDataSelect | function | Não         | null         | Callback para seleção de dados  |

## Exemplo de Uso

```jsx
import NDVIChart from "./NDVIChart";

const data = [
  { date: "2024-01-01", value: 0.75 },
  { date: "2024-01-02", value: 0.8 },
];

<NDVIChart
  data={data}
  title="Evolução NDVI"
  onDataSelect={(point) => console.log(point)}
/>;
```
````

````

---

## Processo de Review

### 1. Checklist do Autor

Antes de criar o PR, verifique:

- [ ] Código segue os padrões estabelecidos
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Linting passa sem erros
- [ ] Build funciona corretamente
- [ ] Funcionalidade foi testada manualmente
- [ ] Commits seguem convenção estabelecida
- [ ] Branch está atualizada com main

### 2. Template de Pull Request

```markdown
## Descrição

Descreva brevemente as mudanças implementadas.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação (mudança apenas na documentação)

## Como Testar

1. Faça checkout da branch
2. Execute `npm install`
3. Execute `npm run dev`
4. Navegue para [página específica]
5. Teste [funcionalidade específica]

## Screenshots

[Adicione screenshots se aplicável]

## Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Realizei self-review do código
- [ ] Comentei código complexo
- [ ] Adicionei/atualizei testes
- [ ] Testes passam localmente
- [ ] Atualizei documentação
````

### 3. Processo de Review

1. **Revisão Automática**: CI/CD executa testes e linting
2. **Revisão Manual**: Pelo menos 1 aprovação necessária
3. **Teste de Funcionalidade**: Reviewer testa as mudanças
4. **Merge**: Após aprovação e testes passando

---

## Reportando Issues

### 1. Template de Bug Report

```markdown
## Descrição do Bug

Descrição clara e concisa do problema.

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

Descreva o que deveria acontecer.

## Screenshots

[Adicione screenshots se aplicável]

## Ambiente

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.2.3]
- Dispositivo: [ex: Desktop, Mobile]

## Informações Adicionais

Qualquer contexto adicional sobre o problema.
```

### 2. Template de Feature Request

```markdown
## Problema

Descreva o problema que esta funcionalidade resolveria.

## Solução Proposta

Descreva a solução que você gostaria de ver.

## Alternativas Consideradas

Descreva alternativas que você considerou.

## Contexto Adicional

Adicione qualquer contexto ou screenshots sobre a feature.
```

---

## Recursos e Ferramentas

### 1. Extensões VS Code Recomendadas

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Thunder Client** (para testes de API)

### 2. Snippets Úteis

#### React Component (rfc)

```jsx
import React from "react";

function ComponentName() {
  return <div></div>;
}

export default ComponentName;
```

#### Custom Hook (uch)

```javascript
import { useState, useEffect } from "react";

export function useCustomHook() {
  const [state, setState] = useState();

  useEffect(() => {
    // effect logic
  }, []);

  return { state, setState };
}
```

### 3. Links Úteis

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)

---

## Comunidade

### 1. Canais de Comunicação

- **GitHub Issues**: Para bugs e feature requests
- **GitHub Discussions**: Para perguntas e discussões
- **Discord**: [Link do servidor] (para chat em tempo real)
- **Email**: contato@orbee.online

### 2. Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

### 3. Reconhecimento

Contribuições são reconhecidas:

- **Contributors**: Listados no README
- **Hall of Fame**: Contribuidores destacados
- **Badges**: Para diferentes tipos de contribuição

---

## FAQ

### Como posso começar a contribuir?

1. Explore as [issues marcadas como "good first issue"](link)
2. Leia a documentação completa
3. Configure o ambiente de desenvolvimento
4. Faça um pequeno PR para se familiarizar

### Qual é o processo de release?

Usamos [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): Novas funcionalidades
- **Major** (2.0.0): Breaking changes

### Como reportar vulnerabilidades de segurança?

Envie um email para security@orbee.online com detalhes da vulnerabilidade. Não abra issues públicas para problemas de segurança.

### Posso contribuir sem saber programar?

Sim! Você pode:

- Melhorar documentação
- Reportar bugs
- Sugerir funcionalidades
- Testar a aplicação
- Traduzir conteúdo
- Criar conteúdo educativo

---

## Agradecimentos

Obrigado por contribuir com o OrBee.Online! Juntos estamos construindo uma plataforma que conecta tecnologia e comunidade para um futuro mais sustentável. 🌱🐝

**"Pequenas ações, grandes impactos - como as abelhas que polinizam o mundo."**

---

_Este documento é vivo e evolui com o projeto. Sugestões de melhoria são sempre bem-vindas!_
