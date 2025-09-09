# Design System OrBee.Online

## Guia de Aplicação para Desenvolvimento Consistente

### Visão Geral

Este documento define os padrões visuais e de interação desenvolvidos para o OrBee.Online, baseados na implementação das telas do MeadowGreen. O objetivo é garantir consistência visual e experiência de usuário uniforme em toda a aplicação.

---

## 1. Paleta de Cores

### Cores Primárias
- **Slate**: Base neutra para backgrounds e textos secundários
  - `slate-800/60` - Background principal dos cards
  - `slate-700/50` - Bordas sutis
  - `slate-300` - Textos secundários
  - `slate-400` - Textos de apoio e metadados

### Cores Semânticas por Contexto

#### Características da Região
- **Verde** (`green-400/20`, `green-500/20`): Vegetação, sustentabilidade
- **Azul** (`blue-400/20`, `blue-500/20`): Água, clima, dados técnicos
- **Roxo** (`purple-400/20`, `purple-500/20`): Biodiversidade, fauna
- **Laranja** (`orange-400/20`, `orange-500/20`): Solo, agricultura
- **Amarelo** (`yellow-400/20`, `yellow-500/20`): Sazonalidade, benchmarks
- **Ciano** (`cyan-400/20`, `cyan-500/20`): Localização, geografia

#### Saúde da Mata Ciliar
- **Verde** (`green-400/20`): Índices saudáveis, cobertura vegetal
- **Azul** (`blue-400/20`): Qualidade dos dados, monitoramento
- **Vermelho** (`red-400/20`): Áreas degradadas, alertas críticos
- **Roxo** (`purple-400/20`): Hotspots, análises especiais
- **Amarelo** (`yellow-400/20`): Atenção, riscos médios

#### Ações Necessárias
- **Vermelho** (`red-400/20`): Urgência, áreas prioritárias
- **Verde** (`green-400/20`): Sustentabilidade, espécies nativas
- **Azul** (`blue-400/20`): Monitoramento, acompanhamento
- **Roxo** (`purple-400/20`): Métricas ESG, impacto
- **Laranja** (`orange-400/20`): Engajamento, stakeholders
- **Ciano** (`cyan-400/20`): Transparência, dados abertos

---

## 2. Componentes Base

### Card Padrão

```jsx
<div className="group relative overflow-hidden rounded-2xl border border-{color}-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-{color}-400/40 hover:shadow-{color}-500/25">
  {/* Textura de ruído */}
  <div className="absolute inset-0 opacity-15 mix-blend-overlay" style={{ 
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter{id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter{id})'/%3E%3C/svg%3E")`, 
    backgroundSize: "256px 256px" 
  }} />
  
  {/* Gradiente hover */}
  <div className="absolute inset-0 bg-gradient-to-br from-{color}-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
  
  {/* Conteúdo */}
  <div className="relative z-10">
    {/* Header do card */}
    <div className="mb-4 flex items-center justify-between">
      <div className="rounded-xl border border-{color}-400/30 bg-{color}-500/20 p-3 backdrop-blur-sm">
        <Icon className="h-5 w-5 text-{color}-400" />
      </div>
      <span className="rounded-full border border-{color}-400/30 bg-{color}-500/20 px-3 py-1 text-xs font-semibold text-{color}-300 backdrop-blur-sm">
        Badge
      </span>
    </div>
    
    {/* Título */}
    <h4 className="mb-3 text-lg font-semibold text-white">Título do Card</h4>
    
    {/* Conteúdo específico */}
    <div className="space-y-3">
      {/* Itens de dados */}
    </div>
  </div>
</div>
```

### Badge de Status

```jsx
<span className="rounded-full border border-{color}-400/30 bg-{color}-500/20 px-3 py-1 text-xs font-semibold text-{color}-300 backdrop-blur-sm">
  Status
</span>
```

### Ícone Container

```jsx
<div className="rounded-xl border border-{color}-400/30 bg-{color}-500/20 p-3 backdrop-blur-sm">
  <Icon className="h-5 w-5 text-{color}-400" />
</div>
```

---

## 3. Layouts e Grid

### Grid Responsivo 2x2

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 4 cards */}
</div>
```

### Card de Linha Completa

```jsx
<div className="space-y-6">
  {/* Cards que ocupam toda a largura */}
</div>
```

### Grid Interno para Dados

```jsx
{/* Para 3 colunas */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <div className="text-center p-4 rounded-lg border border-{color}-400/20 bg-{color}-500/10">
    <div className="mb-2 text-lg font-light text-white">Título</div>
    <div className="text-xs text-{color}-300">Subtítulo</div>
    <div className="text-xs text-slate-400">Metadado</div>
  </div>
</div>

{/* Para 4 colunas */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
  {/* Mesmo padrão */}
</div>

{/* Para 5 colunas */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
  {/* Mesmo padrão */}
</div>
```

---

## 4. Tipografia

### Hierarquia de Títulos

```jsx
{/* Título principal da seção */}
<h2 className="mb-4 bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-2xl font-semibold text-transparent">
  Título Principal
</h2>

{/* Título do card */}
<h4 className="mb-3 text-lg font-semibold text-white">Título do Card</h4>

{/* Título de dados internos */}
<div className="mb-2 text-lg font-light text-white">Dado Principal</div>
```

### Textos de Dados

```jsx
{/* Rótulo de dados */}
<span className="text-slate-300 text-sm">Rótulo</span>

{/* Valor de dados */}
<span className="text-{color}-300 font-medium">Valor</span>

{/* Subtítulo */}
<div className="text-xs text-{color}-300">Subtítulo</div>

{/* Metadado */}
<div className="text-xs text-slate-400">Metadado</div>

{/* Texto de apoio */}
<p className="text-xs text-slate-400">Informação adicional</p>
```

---

## 5. Efeitos e Animações

### Transições Padrão

```jsx
{/* Card hover */}
transition-all duration-300 ease-in-out hover:-translate-y-1

{/* Gradiente hover */}
transition-opacity duration-300 group-hover:opacity-100

{/* Border hover */}
hover:border-{color}-400/40 hover:shadow-{color}-500/25
```

### Efeitos Visuais

```jsx
{/* Backdrop blur */}
backdrop-blur-xl

{/* Shadow */}
shadow-xl

{/* Rounded corners */}
rounded-2xl  // Cards principais
rounded-xl   // Ícones e elementos internos
rounded-lg   // Elementos de dados
rounded-full // Badges
```

---

## 6. Efeitos Visuais

### Noise Effect (Textura de Ruído)

O efeito de ruído adiciona uma textura sutil aos cards, criando profundidade visual e um aspecto mais orgânico.

#### Implementação Base

```jsx
<div className="absolute inset-0 opacity-15 mix-blend-overlay" style={{ 
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter{id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter{id})'/%3E%3C/svg%3E")`, 
  backgroundSize: "256px 256px" 
}} />
```

#### Parâmetros do Noise

- **baseFrequency**: `0.8` - Controla a escala do ruído (menor = mais suave)
- **numOctaves**: `3` - Número de camadas de ruído (mais = mais detalhado)
- **opacity**: `15%` - Transparência do efeito
- **mix-blend-overlay**: Modo de mistura para integração natural
- **backgroundSize**: `256px 256px` - Tamanho do padrão repetido

#### Variações por Contexto

**Background Principal:**
```jsx
// Ruído de fundo mais intenso
baseFrequency='0.9' numOctaves='4'
```

**Botões e Elementos Interativos:**
```jsx
// Ruído mais fino para elementos menores
baseFrequency='1.0-1.2' numOctaves='2-3'
```

**Cards de Conteúdo:**
```jsx
// Ruído padrão balanceado
baseFrequency='0.8' numOctaves='3'
```

#### IDs Únicos Obrigatórios

Cada elemento com noise deve ter um ID único para evitar conflitos:

```jsx
// Padrão de nomenclatura
id='cardNoiseFilter{número_sequencial}'
id='backgroundNoiseFilter'
id='buttonNoiseFilter{contexto}'
```

#### Boas Práticas

1. **Sempre usar IDs únicos** para filtros SVG
2. **Manter opacity baixa** (10-20%) para sutileza
3. **Usar mix-blend-overlay** para integração natural
4. **Testar em diferentes backgrounds** para garantir visibilidade
5. **Considerar performance** - evitar muitos filtros simultâneos

---

## 7. Padrões de Dados

### Item de Dados Simples

```jsx
<div className="flex justify-between items-center">
  <span className="text-slate-300 text-sm">Rótulo</span>
  <span className="text-{color}-300 font-medium">Valor</span>
</div>
```

### Separador de Seções

```jsx
<div className="mt-3 pt-3 border-t border-{color}-400/20">
  <p className="text-xs text-slate-400">Informação adicional</p>
</div>
```

### Card de Dados Interno

```jsx
<div className="text-center p-3 rounded-lg border border-{color}-400/20 bg-{color}-500/10">
  <div className="mb-2 text-lg font-light text-white">Título</div>
  <div className="text-xs text-{color}-300">Status</div>
  <div className="text-xs text-slate-400">Metadado</div>
</div>
```

---

## 8. Ícones e Símbolos

### Mapeamento por Contexto

#### Características
- `MapPin`: Localização
- `Building`: Uso do solo
- `Cloud`: Clima
- `Calendar`: Sazonalidade
- `Leaf`: Flora
- `Target`: Fauna/Benchmarks

#### Saúde
- `Activity`: Índices de vegetação
- `BarChart3`: Cobertura vegetal
- `Info`: Qualidade dos dados
- `Target`: Áreas degradadas
- `Map`: Hotspots críticos

#### Ações
- `Target`: Áreas prioritárias
- `Leaf`: Espécies nativas
- `Calendar`: Acompanhamento
- `BarChart3`: Métricas ESG
- `Users`: Engajamento
- `Eye`: Transparência

---

## 9. Responsividade

### Breakpoints

```jsx
{/* Mobile first */}
grid-cols-1        // Padrão mobile
md:grid-cols-2     // Desktop 2 colunas
md:grid-cols-3     // Desktop 3 colunas
md:grid-cols-4     // Desktop 4 colunas
md:grid-cols-5     // Desktop 5 colunas
```

### Adaptações Mobile

- Cards empilham verticalmente
- Padding reduzido em telas pequenas
- Grids internos se adaptam automaticamente
- Textos mantêm legibilidade

---

## 10. Acessibilidade

### Contraste
- Textos principais em `text-white`
- Textos secundários em `text-slate-300`
- Textos de apoio em `text-slate-400`
- Cores semânticas com opacidade adequada

### Interação
- Estados de hover claramente definidos
- Transições suaves para feedback visual
- Ícones com tamanho adequado (h-5 w-5)

---

## 11. Implementação

### Checklist para Novos Cards

1. ✅ Definir cor semântica apropriada
2. ✅ Aplicar estrutura base do card
3. ✅ Adicionar textura de ruído com ID único
4. ✅ Configurar gradiente hover
5. ✅ Posicionar ícone e badge
6. ✅ Estruturar dados com separadores
7. ✅ Testar responsividade
8. ✅ Validar contraste e acessibilidade

### Exemplo de ID de Filtro

Cada card deve ter um ID único para o filtro de ruído:
```jsx
id='cardNoiseFilter{número_sequencial}'
```

---

## 12. Manutenção

Este design system deve ser atualizado sempre que:
- Novos padrões visuais forem criados
- Cores ou componentes forem modificados
- Novos contextos de aplicação surgirem
- Feedback de usabilidade indicar melhorias

Mantenha a consistência visual como prioridade em todas as implementações.