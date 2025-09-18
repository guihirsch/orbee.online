# Design System Template

> **📋 Template Reutilizável**: Este arquivo serve como base para criar design systems consistentes em novos projetos. Substitua os placeholders `[CUSTOMIZAR]` com os valores específicos do seu projeto.

---

## 🎨 Identidade Visual [CUSTOMIZAR]

### Paleta de Cores Principal

```css
/* [CUSTOMIZAR] Cores primárias do projeto */
:root {
  --primary-50: [COR_HEX]; /* Exemplo: #f0fdf4 */
  --primary-100: [COR_HEX]; /* Exemplo: #dcfce7 */
  --primary-200: [COR_HEX]; /* Exemplo: #bbf7d0 */
  --primary-300: [COR_HEX]; /* Exemplo: #86efac */
  --primary-400: [COR_HEX]; /* Exemplo: #4ade80 */
  --primary-500: [COR_HEX]; /* Exemplo: #22c55e */
  --primary-600: [COR_HEX]; /* Exemplo: #16a34a */
  --primary-700: [COR_HEX]; /* Exemplo: #15803d */
  --primary-800: [COR_HEX]; /* Exemplo: #166534 */
  --primary-900: [COR_HEX]; /* Exemplo: #14532d */
}
```

### Cores Semânticas por Contexto

```css
/* [CUSTOMIZAR] Cores de status e feedback */
:root {
  /* Sucesso */
  --success-light: [COR_HEX]; /* Exemplo: #d1fae5 */
  --success: [COR_HEX]; /* Exemplo: #10b981 */
  --success-dark: [COR_HEX]; /* Exemplo: #047857 */

  /* Aviso */
  --warning-light: [COR_HEX]; /* Exemplo: #fef3c7 */
  --warning: [COR_HEX]; /* Exemplo: #f59e0b */
  --warning-dark: [COR_HEX]; /* Exemplo: #d97706 */

  /* Erro */
  --error-light: [COR_HEX]; /* Exemplo: #fee2e2 */
  --error: [COR_HEX]; /* Exemplo: #ef4444 */
  --error-dark: [COR_HEX]; /* Exemplo: #dc2626 */

  /* Informação */
  --info-light: [COR_HEX]; /* Exemplo: #dbeafe */
  --info: [COR_HEX]; /* Exemplo: #3b82f6 */
  --info-dark: [COR_HEX]; /* Exemplo: #1d4ed8 */
}
```

---

## 🧩 Componentes Base

### Card Padrão com Efeito de Textura

```jsx
// [CUSTOMIZAR] Componente Card base do projeto
const Card = ({ children, className = "", withNoise = true }) => {
  return (
    <div
      className={`
      bg-white/90 backdrop-blur-sm 
      border border-primary-200/30 
      rounded-xl p-6 
      shadow-lg hover:shadow-xl 
      transition-all duration-300
      ${withNoise ? "noise-bg" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
};
```

### Badge de Status

```jsx
// [CUSTOMIZAR] Badge para indicadores de status
const StatusBadge = ({ status, children }) => {
  const statusStyles = {
    success: "bg-success-light text-success-dark border-success",
    warning: "bg-warning-light text-warning-dark border-warning",
    error: "bg-error-light text-error-dark border-error",
    info: "bg-info-light text-info-dark border-info",
    // [CUSTOMIZAR] Adicione mais status conforme necessário
  };

  return (
    <span
      className={`
      inline-flex items-center px-3 py-1 
      rounded-full text-sm font-medium 
      border transition-colors
      ${statusStyles[status] || statusStyles.info}
    `}
    >
      {children}
    </span>
  );
};
```

### Container de Ícone

```jsx
// [CUSTOMIZAR] Container padronizado para ícones
const IconContainer = ({
  icon: Icon,
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
    xl: "w-16 h-16 p-3",
  };

  const variantClasses = {
    primary: "bg-primary-100 text-primary-600 border-primary-200",
    success: "bg-success-light text-success border-success",
    warning: "bg-warning-light text-warning border-warning",
    error: "bg-error-light text-error border-error",
    // [CUSTOMIZAR] Adicione mais variantes conforme necessário
  };

  return (
    <div
      className={`
      rounded-lg border flex items-center justify-center
      transition-colors duration-200
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `}
    >
      <Icon className="w-full h-full" />
    </div>
  );
};
```

---

## 🎭 Efeito de Textura (Noise Effect)

### Implementação Base

```css
/* [CUSTOMIZAR] Efeito de textura personalizado */
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
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-[PROJETO_ID]'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='[FREQUENCIA]' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-[PROJETO_ID])' opacity='[OPACIDADE]'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

.noise-bg > * {
  position: relative;
  z-index: 2;
}
```

### Parâmetros de Customização

- **[PROJETO_ID]**: ID único do projeto (ex: `orbee`, `myapp`)
- **[FREQUENCIA]**: Intensidade da textura (0.1 - 2.0)
  - `0.1-0.5`: Textura sutil
  - `0.6-1.0`: Textura moderada
  - `1.1-2.0`: Textura intensa
- **[OPACIDADE]**: Transparência do efeito (0.1 - 0.8)
  - `0.1-0.3`: Muito sutil
  - `0.4-0.6`: Moderado
  - `0.7-0.8`: Pronunciado

### Componente React Reutilizável

```jsx
// [CUSTOMIZAR] Componente para aplicar noise effect
const NoiseBackground = ({
  children,
  intensity = 0.9,
  opacity = 0.4,
  className = "",
  projectId = "[PROJETO_ID]", // [CUSTOMIZAR] ID único do projeto
}) => {
  const noiseFilter = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter-${projectId}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${intensity}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter-${projectId})' opacity='${opacity}'/%3E%3C/svg%3E")`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        "--noise-bg": noiseFilter,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: "var(--noise-bg)",
        }}
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};
```

---

## 📐 Layout e Espaçamento

### Grid System [CUSTOMIZAR]

```css
/* [CUSTOMIZAR] Sistema de grid responsivo */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.grid-responsive {
  @apply grid gap-6 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4;
}

/* [CUSTOMIZAR] Ajuste as breakpoints conforme necessário */
.grid-cards {
  @apply grid gap-4 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3;
}
```

### Espaçamento Semântico

```css
/* [CUSTOMIZAR] Classes de espaçamento por contexto */
.section-spacing {
  @apply py-16 md:py-24;
}

.card-spacing {
  @apply p-6 md:p-8;
}

.content-spacing {
  @apply space-y-4 md:space-y-6;
}
```

---

## 🎯 Guia de Customização

### Checklist de Implementação

- [ ] **Cores**: Definir paleta primária e semântica
- [ ] **Tipografia**: Escolher fontes que reflitam a personalidade
- [ ] **Componentes**: Adaptar Card, Badge e IconContainer
- [ ] **Noise Effect**: Configurar intensidade e opacidade
- [ ] **Layout**: Ajustar grid e espaçamentos
- [ ] **Testes**: Verificar consistência visual

### Exemplo de Uso

```jsx
// [CUSTOMIZAR] Exemplo de implementação completa
const ProjectDashboard = () => {
  return (
    <div className="container-custom section-spacing">
      <NoiseBackground
        intensity={0.8}
        opacity={0.3}
        projectId="meuProjeto"
        className="bg-gradient-primary rounded-2xl"
      >
        <div className="grid-responsive">
          <Card withNoise={false}>
            <IconContainer icon={ChartIcon} variant="primary" size="lg" />
            <h3 className="text-xl font-semibold mt-4">[TÍTULO DO CARD]</h3>
            <StatusBadge status="success">Ativo</StatusBadge>
          </Card>
        </div>
      </NoiseBackground>
    </div>
  );
};
```

---

## 🔧 Manutenção

### Atualizações

- Manter consistência visual em todas as telas
- Documentar mudanças significativas
- Testar em diferentes dispositivos

### Versionamento

- Versionar mudanças no design system
- Comunicar breaking changes
- Manter changelog atualizado

---

> **💡 Dica**: Este template foi baseado no design system do OrBee.Online. Adapte os valores conforme a identidade visual do seu projeto, mantendo a estrutura modular e reutilizável.
