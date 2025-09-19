import React from 'react';

export default {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema de espaçamento e grid do OrBee.Online com padrões responsivos e tokens de design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showMeasurements: {
      control: { type: 'boolean' },
      description: 'Exibir medidas em pixels',
    },
    showGridLines: {
      control: { type: 'boolean' },
      description: 'Exibir linhas de grid',
    },
    highlightSpacing: {
      control: { type: 'boolean' },
      description: 'Destacar áreas de espaçamento',
    },
  },
};

const SpacingToken = ({ size, className, pixels, description, usage }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div 
          className={`bg-emerald-500 ${className}`}
          style={{ width: pixels, height: '16px' }}
        ></div>
        <span className="text-white font-medium">{size}</span>
      </div>
      <span className="text-slate-400 text-sm">{pixels}px</span>
    </div>
    <div className="space-y-1">
      <code className="text-emerald-400 text-xs font-mono block">{className}</code>
      <p className="text-slate-300 text-xs">{description}</p>
      {usage && (
        <p className="text-slate-400 text-xs italic">Uso: {usage}</p>
      )}
    </div>
  </div>
);

const GridExample = ({ title, className, description, children }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm mb-2">{description}</p>
      <code className="text-emerald-400 text-xs font-mono">{className}</code>
    </div>
    <div className={className}>
      {children}
    </div>
  </div>
);

const GridItem = ({ children, highlight = false }) => (
  <div className={`bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center text-white text-sm ${
    highlight ? 'ring-2 ring-emerald-400/50' : ''
  }`}>
    {children}
  </div>
);

const SpacingVisualizer = ({ spacing, label, showMeasurement }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
    <div className="text-white text-sm mb-2">{label}</div>
    <div className="flex items-center">
      <div className="bg-emerald-500/20 border border-emerald-400/30 rounded p-2 text-emerald-300 text-xs">
        Elemento 1
      </div>
      <div 
        className={`bg-red-500/20 border-t border-b border-red-400/30 flex items-center justify-center text-red-300 text-xs ${spacing}`}
        style={{ minWidth: '40px' }}
      >
        {showMeasurement && <span className="text-xs">gap</span>}
      </div>
      <div className="bg-emerald-500/20 border border-emerald-400/30 rounded p-2 text-emerald-300 text-xs">
        Elemento 2
      </div>
    </div>
    <code className="text-emerald-400 text-xs font-mono mt-2 block">{spacing}</code>
  </div>
);

export const Default = {
  args: {
    showMeasurements: false,
    showGridLines: false,
    highlightSpacing: false,
  },
  render: ({ showMeasurements, showGridLines, highlightSpacing }) => {
    const spacingTokens = [
      { size: 'XS', className: 'w-1', pixels: '4', description: 'Espaçamento mínimo', usage: 'Bordas internas, separadores sutis' },
      { size: 'SM', className: 'w-2', pixels: '8', description: 'Espaçamento pequeno', usage: 'Gaps entre ícones e texto' },
      { size: 'MD', className: 'w-3', pixels: '12', description: 'Espaçamento médio', usage: 'Espaçamento padrão entre elementos' },
      { size: 'LG', className: 'w-4', pixels: '16', description: 'Espaçamento grande', usage: 'Separação entre seções' },
      { size: 'XL', className: 'w-6', pixels: '24', description: 'Espaçamento extra grande', usage: 'Margens de cards, padding principal' },
      { size: '2XL', className: 'w-8', pixels: '32', description: 'Espaçamento muito grande', usage: 'Separação entre componentes principais' },
    ];

    const paddingTokens = [
      { size: 'P-2', className: 'p-2', pixels: '8', description: 'Padding pequeno', usage: 'Badges, elementos compactos' },
      { size: 'P-3', className: 'p-3', pixels: '12', description: 'Padding médio', usage: 'Botões, elementos interativos' },
      { size: 'P-4', className: 'p-4', pixels: '16', description: 'Padding padrão', usage: 'Cards internos, containers' },
      { size: 'P-6', className: 'p-6', pixels: '24', description: 'Padding grande', usage: 'Cards principais, seções' },
      { size: 'P-8', className: 'p-8', pixels: '32', description: 'Padding extra grande', usage: 'Páginas, containers principais' },
    ];

    const gapTokens = [
      { spacing: 'gap-2', label: 'Gap 2 (8px)' },
      { spacing: 'gap-3', label: 'Gap 3 (12px)' },
      { spacing: 'gap-4', label: 'Gap 4 (16px)' },
      { spacing: 'gap-6', label: 'Gap 6 (24px)' },
      { spacing: 'gap-8', label: 'Gap 8 (32px)' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent mb-4">
              Sistema de Espaçamento OrBee.Online
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Tokens de espaçamento, grids responsivos e padrões de layout consistentes
            </p>
          </div>

          {/* Tokens de Espaçamento */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Tokens de Espaçamento</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {spacingTokens.map((token, index) => (
                <SpacingToken key={index} {...token} />
              ))}
            </div>
          </div>

          {/* Tokens de Padding */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Tokens de Padding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {paddingTokens.map((token, index) => (
                <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-xl backdrop-blur-sm overflow-hidden">
                  <div className={`bg-emerald-500/10 border border-emerald-400/20 ${token.className}`}>
                    <div className="bg-emerald-500/20 rounded text-center text-emerald-300 text-xs py-2">
                      Conteúdo
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{token.size}</span>
                      <span className="text-slate-400 text-sm">{token.pixels}px</span>
                    </div>
                    <code className="text-emerald-400 text-xs font-mono block mb-1">{token.className}</code>
                    <p className="text-slate-300 text-xs mb-1">{token.description}</p>
                    <p className="text-slate-400 text-xs italic">{token.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visualização de Gaps */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Gaps entre Elementos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gapTokens.map((gap, index) => (
                <SpacingVisualizer 
                  key={index} 
                  {...gap} 
                  showMeasurement={showMeasurements}
                />
              ))}
            </div>
          </div>

          {/* Grids Responsivos */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Grids Responsivos</h2>
            <div className="space-y-8">
              {/* Grid 2x2 */}
              <GridExample
                title="Grid 2x2 (Padrão para Cards)"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                description="Layout responsivo que empilha em mobile e exibe 2 colunas em desktop"
              >
                <GridItem highlight={highlightSpacing}>Card 1</GridItem>
                <GridItem highlight={highlightSpacing}>Card 2</GridItem>
                <GridItem highlight={highlightSpacing}>Card 3</GridItem>
                <GridItem highlight={highlightSpacing}>Card 4</GridItem>
              </GridExample>

              {/* Grid 3 Colunas */}
              <GridExample
                title="Grid 3 Colunas"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                description="Layout para dados internos e elementos menores"
              >
                <GridItem>Item 1</GridItem>
                <GridItem>Item 2</GridItem>
                <GridItem>Item 3</GridItem>
              </GridExample>

              {/* Grid 4 Colunas */}
              <GridExample
                title="Grid 4 Colunas"
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                description="Layout para métricas e dados estatísticos"
              >
                <GridItem>Métrica 1</GridItem>
                <GridItem>Métrica 2</GridItem>
                <GridItem>Métrica 3</GridItem>
                <GridItem>Métrica 4</GridItem>
              </GridExample>

              {/* Grid 5 Colunas */}
              <GridExample
                title="Grid 5 Colunas"
                className="grid grid-cols-1 md:grid-cols-5 gap-4"
                description="Layout para dados detalhados e análises"
              >
                <GridItem>Dado 1</GridItem>
                <GridItem>Dado 2</GridItem>
                <GridItem>Dado 3</GridItem>
                <GridItem>Dado 4</GridItem>
                <GridItem>Dado 5</GridItem>
              </GridExample>
            </div>
          </div>

          {/* Exemplo Prático de Card */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Exemplo Prático: Anatomia de um Card</h2>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Card Real */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Card com Espaçamento Aplicado</h3>
                  <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl">
                    <div className="relative z-10">
                      {/* Header com gap-4 */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                          <div className="h-5 w-5 bg-green-400 rounded"></div>
                        </div>
                        <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                          Saudável
                        </span>
                      </div>
                      
                      {/* Título com mb-3 */}
                      <h4 className="mb-3 text-lg font-semibold text-white">Mata Ciliar - Setor Norte</h4>
                      
                      {/* Dados com space-y-3 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">NDVI Atual</span>
                          <span className="text-green-300 font-medium">0.68</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">Área Monitorada</span>
                          <span className="text-green-300 font-medium">2.4 ha</span>
                        </div>
                      </div>
                      
                      {/* Separador com mt-3 pt-3 */}
                      <div className="mt-3 pt-3 border-t border-green-400/20">
                        <p className="text-xs text-slate-400">Última atualização: 2 horas atrás</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anatomia do Espaçamento */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Anatomia do Espaçamento</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-emerald-400 font-mono">p-6</code>
                      <p className="text-slate-300">Padding principal do card (24px)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-emerald-400 font-mono">mb-4</code>
                      <p className="text-slate-300">Margem inferior do header (16px)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-emerald-400 font-mono">mb-3</code>
                      <p className="text-slate-300">Margem inferior do título (12px)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-emerald-400 font-mono">space-y-3</code>
                      <p className="text-slate-300">Espaçamento vertical entre dados (12px)</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-emerald-400 font-mono">mt-3 pt-3</code>
                      <p className="text-slate-300">Margem e padding do separador (12px)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakpoints Responsivos */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Breakpoints Responsivos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Breakpoints Tailwind</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <code className="text-emerald-400 font-mono">sm:</code>
                    <span className="text-slate-300">640px+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-emerald-400 font-mono">md:</code>
                    <span className="text-slate-300">768px+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-emerald-400 font-mono">lg:</code>
                    <span className="text-slate-300">1024px+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-emerald-400 font-mono">xl:</code>
                    <span className="text-slate-300">1280px+</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Padrão Mobile-First</h3>
                <div className="space-y-3 text-sm">
                  <div className="text-slate-300">
                    <code className="text-emerald-400 font-mono">grid-cols-1</code> - Mobile padrão
                  </div>
                  <div className="text-slate-300">
                    <code className="text-emerald-400 font-mono">md:grid-cols-2</code> - Desktop 2 colunas
                  </div>
                  <div className="text-slate-300">
                    <code className="text-emerald-400 font-mono">lg:grid-cols-3</code> - Desktop 3 colunas
                  </div>
                  <div className="text-slate-300">
                    <code className="text-emerald-400 font-mono">xl:grid-cols-4</code> - Desktop 4 colunas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guia de Boas Práticas */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-6">Boas Práticas de Espaçamento</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-300 mb-3">✅ Faça</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Use tokens de espaçamento consistentes</li>
                  <li>• Mantenha hierarquia visual com espaçamentos</li>
                  <li>• Teste responsividade em diferentes telas</li>
                  <li>• Use space-y e space-x para elementos filhos</li>
                  <li>• Aplique mobile-first approach</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-3">❌ Evite</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Usar valores de espaçamento arbitrários</li>
                  <li>• Misturar diferentes padrões de grid</li>
                  <li>• Ignorar o comportamento mobile</li>
                  <li>• Usar espaçamentos muito pequenos ou grandes</li>
                  <li>• Quebrar a consistência visual</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const MobileView = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const ResponsiveDemo = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export const InteractiveDemo = {
  args: {
    showMeasurements: true,
    showGridLines: true,
    highlightSpacing: true,
  },
  render: Default.render,
};