# Design System OrBee.Online

## Guia de Aplicação para Desenvolvimento Consistente

### Visão Geral

Este documento define os padrões visuais e de interação desenvolvidos para o OrBee.Online, baseados na implementação das telas do MeadowGreen. O objetivo é garantir consistência visual e experiência de usuário uniforme em toda a aplicação.

### Atualizações Recentes (Sistema de Efeitos Visuais)

**Melhorias de Contraste e Legibilidade:**
- Transição para fundo claro (`bg-slate-50`) para melhor legibilidade
- Ajuste de todas as cores de texto para contraste adequado
- Implementação de header fixo com controles interativos
- Otimização de cards e elementos para melhor visibilidade

**Novas Diretrizes:**
- Uso de `text-slate-800` para títulos principais
- `text-slate-600/700` para textos secundários
- Backgrounds brancos com bordas `border-slate-300` para cards
- Códigos com fundo `bg-slate-100` e bordas para destaque

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
  <div
    className="absolute inset-0 opacity-15 mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter{id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter{id})'/%3E%3C/svg%3E")`,
      backgroundSize: "256px 256px",
    }}
  />

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
    <div className="space-y-3">{/* Itens de dados */}</div>
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
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{/* 4 cards */}</div>
```

### Card de Linha Completa

```jsx
<div className="space-y-6">{/* Cards que ocupam toda a largura */}</div>
```

### Grid Interno para Dados

```jsx
{
  /* Para 3 colunas */
}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <div className="text-center p-4 rounded-lg border border-{color}-400/20 bg-{color}-500/10">
    <div className="mb-2 text-lg font-light text-white">Título</div>
    <div className="text-xs text-{color}-300">Subtítulo</div>
    <div className="text-xs text-slate-400">Metadado</div>
  </div>
</div>;

{
  /* Para 4 colunas */
}
<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
  {/* Mesmo padrão */}
</div>;

{
  /* Para 5 colunas */
}
<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
  {/* Mesmo padrão */}
</div>;
```

---

## 4. Tipografia

### Hierarquia de Títulos

```jsx
{
  /* Título principal da seção */
}
<h2 className="mb-4 bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-2xl font-semibold text-transparent">
  Título Principal
</h2>;

{
  /* Título do card */
}
<h4 className="mb-3 text-lg font-semibold text-white">Título do Card</h4>;

{
  /* Título de dados internos */
}
<div className="mb-2 text-lg font-light text-white">Dado Principal</div>;
```

### Textos de Dados

```jsx
{
  /* Rótulo de dados */
}
<span className="text-slate-300 text-sm">Rótulo</span>;

{
  /* Valor de dados */
}
<span className="text-{color}-300 font-medium">Valor</span>;

{
  /* Subtítulo */
}
<div className="text-xs text-{color}-300">Subtítulo</div>;

{
  /* Metadado */
}
<div className="text-xs text-slate-400">Metadado</div>;

{
  /* Texto de apoio */
}
<p className="text-xs text-slate-400">Informação adicional</p>;
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

## 6. Noise Effect (Textura de Ruído)

### Visão Geral

O efeito de ruído adiciona uma textura sutil aos cards, criando profundidade visual e um aspecto mais orgânico. É implementado usando **SVG inline com filtros de turbulência**, proporcionando uma textura sem necessidade de imagens externas.

### Como Funciona

O efeito utiliza filtros SVG `feTurbulence` para gerar ruído fractal que é aplicado como background pattern, criando uma textura orgânica que se integra naturalmente com os gradientes e cores do design system.

### Implementação Completa

#### Estrutura Base para Cards

```jsx
{
  /* Background with Noise Effect */
}
<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-800">
  {/* Noise Texture Overlay */}
  <div
    className="absolute inset-0 opacity-30 mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      backgroundSize: "256px 256px",
    }}
  />
</div>;
```

#### Implementação Padrão para Cards

```jsx
<div
  className="absolute inset-0 opacity-15 mix-blend-overlay"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter{id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter{id})'/%3E%3C/svg%3E")`,
    backgroundSize: "256px 256px",
  }}
/>
```

### Componentes do SVG

#### Filtro de Turbulência (`feTurbulence`)

- **type='fractalNoise'**: Gera ruído fractal natural
- **baseFrequency**: Controla a frequência base do ruído
- **numOctaves**: Define a complexidade (mais oitavas = mais detalhes)
- **stitchTiles='stitch'**: Garante repetição sem emendas visíveis

#### Classes CSS Importantes

- **opacity**: Transparência do efeito (15-30% recomendado)
- **mix-blend-overlay**: Modo de mistura que integra com o background
- **backgroundSize**: Define o tamanho do tile (256px x 256px padrão)

### Versões Reutilizáveis

#### Versão Básica (Copy & Paste)

```jsx
<div
  className="absolute inset-0 opacity-30 mix-blend-overlay"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    backgroundSize: "256px 256px",
  }}
/>
```

#### Componente Reutilizável

```jsx
const NoiseOverlay = ({
  opacity = 0.3,
  frequency = 0.9,
  octaves = 4,
  size = "256px",
  blendMode = "overlay",
}) => {
  const svgNoise = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

  return (
    <div
      className={`absolute inset-0 mix-blend-${blendMode}`}
      style={{
        opacity,
        backgroundImage: `url("${svgNoise}")`,
        backgroundSize: `${size} ${size}`,
      }}
    />
  );
};

// Uso:
<NoiseOverlay opacity={0.2} frequency={1.2} octaves={3} />;
```

#### Hook Customizado

```jsx
import { useMemo } from "react";

const useNoiseTexture = ({ frequency = 0.9, octaves = 4, size = 256 } = {}) => {
  return useMemo(() => {
    const svgNoise = `data:image/svg+xml,%3Csvg viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

    return {
      backgroundImage: `url("${svgNoise}")`,
      backgroundSize: `${size}px ${size}px`,
    };
  }, [frequency, octaves, size]);
};

// Uso:
const MyComponent = () => {
  const noiseStyle = useNoiseTexture({ frequency: 1.1, octaves: 5 });

  return (
    <div className="relative">
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={noiseStyle}
      />
      {/* Conteúdo */}
    </div>
  );
};
```

### Parâmetros de Customização

#### baseFrequency (Frequência)

- **0.1 - 0.5**: Ruído grosso, padrões grandes
- **0.6 - 1.0**: Ruído médio (recomendado)
- **1.1 - 2.0**: Ruído fino, padrões pequenos

#### numOctaves (Complexidade)

- **1-2**: Ruído simples, menos detalhes
- **3-4**: Balanceado (recomendado)
- **5-8**: Muito detalhado, pode impactar performance

#### Opacity (Transparência)

- **0.1 - 0.2**: Muito sutil
- **0.25 - 0.35**: Balanceado (recomendado)
- **0.4 - 0.5**: Mais visível

#### backgroundSize (Tamanho do Tile)

- **128px**: Padrão mais repetitivo
- **256px**: Balanceado (recomendado)
- **512px**: Padrão menos repetitivo, mais suave

#### mix-blend-mode (Modo de Mistura)

- **overlay**: Contraste balanceado (padrão)
- **multiply**: Escurece o background
- **screen**: Clareia o background
- **soft-light**: Efeito mais suave

### Variações por Contexto

#### Background Principal

```jsx
// Ruído de fundo mais intenso
baseFrequency='0.9' numOctaves='4'
```

#### Botões e Elementos Interativos

```jsx
// Ruído mais fino para elementos menores
baseFrequency='1.0-1.2' numOctaves='2-3'
```

#### Cards de Conteúdo

```jsx
// Ruído padrão balanceado
baseFrequency='0.8' numOctaves='3'
```

### IDs Únicos Obrigatórios

Cada elemento com noise deve ter um ID único para evitar conflitos:

```jsx
// Padrão de nomenclatura
id = "cardNoiseFilter{número_sequencial}";
id = "backgroundNoiseFilter";
id = "buttonNoiseFilter{contexto}";
```

### Exemplos de Uso

#### Background Sutil para Cards

```jsx
<div className="relative bg-white rounded-lg p-6">
  <NoiseOverlay opacity={0.1} frequency={1.5} blendMode="multiply" />
  <h3>Conteúdo do Card</h3>
</div>
```

#### Overlay para Imagens

```jsx
<div className="relative">
  <img src="background.jpg" alt="Background" />
  <NoiseOverlay opacity={0.2} frequency={0.8} blendMode="overlay" />
  <div className="relative z-10">Conteúdo sobre a imagem</div>
</div>
```

#### Background Completo da Página

```jsx
<div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
  <NoiseOverlay opacity={0.3} frequency={0.9} octaves={4} />
  {/* Conteúdo da página */}
</div>
```

### Vantagens desta Abordagem

1. **Performance**: SVG inline é renderizado pelo browser, sem requisições HTTP
2. **Escalabilidade**: Funciona em qualquer resolução
3. **Customização**: Parâmetros facilmente ajustáveis
4. **Compatibilidade**: Funciona em todos os browsers modernos
5. **Tamanho**: Não adiciona peso ao bundle

### Considerações de Performance

- Use `useMemo` para evitar recriação desnecessária do SVG
- Limite o número de oitavas (máximo 6-8)
- Para animações, considere usar CSS `will-change: transform`
- Em dispositivos móveis, reduza a opacidade para melhor performance

### Troubleshooting

#### O efeito não aparece

- Verifique se o elemento pai tem `position: relative`
- Confirme que a opacidade não está muito baixa
- Teste diferentes modos de blend

#### Performance ruim

- Reduza o número de oitavas
- Aumente o tamanho do backgroundSize
- Diminua a opacidade

#### Padrão muito repetitivo

- Aumente o backgroundSize (512px ou mais)
- Ajuste a baseFrequency
- Use múltiplas camadas com parâmetros diferentes

### Boas Práticas

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
{
  /* Mobile first */
}
grid - cols - 1; // Padrão mobile
md: grid - cols - 2; // Desktop 2 colunas
md: grid - cols - 3; // Desktop 3 colunas
md: grid - cols - 4; // Desktop 4 colunas
md: grid - cols - 5; // Desktop 5 colunas
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
id = "cardNoiseFilter{número_sequencial}";
```

---

## 12. Layout Base

### Background Principal

O componente Layout utiliza um fundo branco limpo (`bg-white`) que substitui o gradiente verde anterior. Esta mudança proporciona:

- **Melhor legibilidade** dos componentes
- **Contraste otimizado** para textos e elementos
- **Design minimalista** focado no conteúdo
- **Compatibilidade** com diferentes temas

### Stories Background

Os stories do Storybook utilizam fundos apropriados para demonstração:

- **Effects Stories**: Fundo claro (`bg-slate-50`) para melhor visualização dos efeitos visuais
- **Componentes gerais**: Fundos neutros que destacam os elementos sem interferir na experiência

---

## 13. Manutenção

Este design system deve ser atualizado sempre que:

- Novos padrões visuais forem criados
- Cores ou componentes forem modificados
- Novos contextos de aplicação surgirem
- Feedback de usabilidade indicar melhorias

Mantenha a consistência visual como prioridade em todas as implementações.

---

_Este guia foi criado baseado na implementação do projeto OrBee.Online_
