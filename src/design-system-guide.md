# Design System Guide - OrBee.Online

## Sistema de Efeitos Visuais

### Componentes Atualizados

Este guia documenta as melhorias implementadas no sistema de efeitos visuais da aplicação.

#### Melhorias de Contraste e Legibilidade

**Fundo Principal:**
- `bg-slate-50` - Fundo claro para melhor legibilidade
- Transição de fundo escuro para claro para reduzir fadiga visual

**Tipografia:**
- `text-slate-800` - Títulos principais (h1, h2)
- `text-slate-700` - Subtítulos (h3)
- `text-slate-600` - Textos secundários
- `text-slate-500` - Textos de apoio

#### Layout e Organização

**Header Fixo:**
```jsx
<div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
  {/* Controles interativos */}
</div>
```

**Cards e Containers:**
```jsx
<div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
  {/* Conteúdo do card */}
</div>
```

#### Componentes de Código

**Blocos de Código:**
```jsx
<code className="text-emerald-700 text-xs font-mono bg-slate-100 px-2 py-1 rounded">
  {/* Código */}
</code>
```

**Containers de Código:**
```jsx
<div className="bg-slate-100 rounded-lg p-4 text-sm border">
  {/* Código com sintaxe destacada */}
</div>
```

#### Controles Interativos

**Checkboxes:**
```jsx
<input 
  type="checkbox"
  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
/>
```

**Labels com Hover:**
```jsx
<span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">
  {/* Texto do label */}
</span>
```

#### Cores Semânticas

**Verde (Emerald):**
- `text-emerald-700` - Textos de código
- `text-emerald-600` - Links e elementos interativos
- `bg-emerald-100` - Backgrounds sutis
- `border-emerald-500/50` - Bordas destacadas

**Slate (Neutro):**
- `text-slate-800` - Textos principais
- `text-slate-600` - Textos secundários
- `bg-slate-100` - Backgrounds de código
- `border-slate-300` - Bordas padrão

#### Transições e Animações

**Transições Padrão:**
```css
transition-colors /* Para mudanças de cor */
transition-all duration-300 /* Para animações gerais */
hover:scale-105 /* Efeito de hover sutil */
```

**Estados de Hover:**
```jsx
group-hover:text-emerald-600 /* Mudança de cor em grupo */
hover:shadow-xl /* Sombra em hover */
hover:border-emerald-400/40 /* Borda em hover */
```

### Diretrizes de Implementação

1. **Sempre use fundo claro** (`bg-slate-50`) como base
2. **Mantenha contraste adequado** entre texto e fundo
3. **Use borders sutis** (`border-slate-300`) para separação
4. **Implemente feedback visual** em elementos interativos
5. **Mantenha consistência** nas cores semânticas
6. **Teste legibilidade** em diferentes dispositivos

### Acessibilidade

- Contraste mínimo de 4.5:1 para textos normais
- Contraste mínimo de 3:1 para textos grandes
- Focus rings visíveis em elementos interativos
- Cores não como única forma de comunicação

---

*Última atualização: Sistema de Efeitos Visuais - Melhorias de contraste e reorganização de layout*