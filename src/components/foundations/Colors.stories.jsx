import React from 'react';

export default {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Paleta de cores do OrBee.Online baseada no design system. Define cores primárias, semânticas por contexto e variações de opacidade.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showHexValues: {
      control: { type: 'boolean' },
      description: 'Exibir valores hexadecimais das cores',
    },
    showUsageExamples: {
      control: { type: 'boolean' },
      description: 'Exibir exemplos de uso das cores',
    },
  },
};

const ColorSwatch = ({ name, className, description, usage, showHex = false }) => {
  const getColorValue = (className) => {
    // Mapeamento das principais cores para valores hex aproximados
    const colorMap = {
      'bg-slate-800': '#1e293b',
      'bg-slate-700': '#334155',
      'text-slate-300': '#cbd5e1',
      'text-slate-400': '#94a3b8',
      'bg-emerald-500': '#10b981',
      'bg-emerald-400': '#34d399',
      'bg-green-500': '#22c55e',
      'bg-green-400': '#4ade80',
      'bg-blue-500': '#3b82f6',
      'bg-blue-400': '#60a5fa',
      'bg-red-500': '#ef4444',
      'bg-red-400': '#f87171',
      'bg-yellow-500': '#eab308',
      'bg-yellow-400': '#facc15',
      'bg-purple-500': '#a855f7',
      'bg-purple-400': '#c084fc',
      'bg-orange-500': '#f97316',
      'bg-orange-400': '#fb923c',
      'bg-cyan-500': '#06b6d4',
      'bg-cyan-400': '#22d3ee',
    };
    return colorMap[className] || '#000000';
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <div className={`w-full h-16 rounded-lg mb-3 ${className}`}></div>
      <div className="space-y-1">
        <h4 className="text-white font-medium text-sm">{name}</h4>
        <p className="text-slate-300 text-xs">{description}</p>
        <code className="text-emerald-400 text-xs font-mono">{className}</code>
        {showHex && (
          <p className="text-slate-400 text-xs font-mono">{getColorValue(className)}</p>
        )}
        {usage && (
          <p className="text-slate-400 text-xs italic">{usage}</p>
        )}
      </div>
    </div>
  );
};

const ColorCategory = ({ title, description, colors, showHex, showUsage }) => (
  <div className="mb-8">
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {colors.map((color, index) => (
        <ColorSwatch
          key={index}
          {...color}
          showHex={showHex}
          usage={showUsage ? color.usage : undefined}
        />
      ))}
    </div>
  </div>
);

export const Default = {
  args: {
    showHexValues: false,
    showUsageExamples: false,
  },
  render: ({ showHexValues, showUsageExamples }) => {
    const primaryColors = [
      {
        name: 'Slate 800',
        className: 'bg-slate-800',
        description: 'Background principal dos cards',
        usage: 'Cards, containers principais',
      },
      {
        name: 'Slate 700',
        className: 'bg-slate-700',
        description: 'Bordas sutis',
        usage: 'Bordas de elementos, separadores',
      },
      {
        name: 'Slate 300',
        className: 'text-slate-300',
        description: 'Textos secundários',
        usage: 'Labels, textos de apoio',
      },
      {
        name: 'Slate 400',
        className: 'text-slate-400',
        description: 'Textos de apoio e metadados',
        usage: 'Timestamps, metadados',
      },
    ];

    const contextColors = [
      {
        name: 'Verde',
        className: 'bg-green-500',
        description: 'Vegetação, sustentabilidade',
        usage: 'Índices saudáveis, cobertura vegetal',
      },
      {
        name: 'Azul',
        className: 'bg-blue-500',
        description: 'Água, clima, dados técnicos',
        usage: 'Qualidade dos dados, monitoramento',
      },
      {
        name: 'Roxo',
        className: 'bg-purple-500',
        description: 'Biodiversidade, fauna',
        usage: 'Hotspots, análises especiais',
      },
      {
        name: 'Laranja',
        className: 'bg-orange-500',
        description: 'Solo, agricultura',
        usage: 'Engajamento, stakeholders',
      },
      {
        name: 'Amarelo',
        className: 'bg-yellow-500',
        description: 'Sazonalidade, benchmarks',
        usage: 'Atenção, riscos médios',
      },
      {
        name: 'Ciano',
        className: 'bg-cyan-500',
        description: 'Localização, geografia',
        usage: 'Transparência, dados abertos',
      },
    ];

    const semanticColors = [
      {
        name: 'Vermelho',
        className: 'bg-red-500',
        description: 'Áreas degradadas, alertas críticos',
        usage: 'Urgência, áreas prioritárias',
      },
      {
        name: 'Emerald',
        className: 'bg-emerald-500',
        description: 'Cor principal da marca',
        usage: 'CTAs, elementos de destaque',
      },
    ];

    const opacityVariations = [
      {
        name: 'Verde 10%',
        className: 'bg-green-500/10',
        description: 'Background sutil',
        usage: 'Fundos de cards, áreas destacadas',
      },
      {
        name: 'Verde 20%',
        className: 'bg-green-500/20',
        description: 'Background médio',
        usage: 'Badges, elementos de status',
      },
      {
        name: 'Azul 10%',
        className: 'bg-blue-500/10',
        description: 'Background sutil',
        usage: 'Fundos de cards, áreas destacadas',
      },
      {
        name: 'Azul 20%',
        className: 'bg-blue-500/20',
        description: 'Background médio',
        usage: 'Badges, elementos de status',
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent mb-4">
              Sistema de Cores OrBee.Online
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Paleta de cores baseada no design system, organizadas por contexto e uso semântico
            </p>
          </div>

          <ColorCategory
            title="Cores Primárias"
            description="Base neutra para backgrounds e textos secundários"
            colors={primaryColors}
            showHex={showHexValues}
            showUsage={showUsageExamples}
          />

          <ColorCategory
            title="Cores por Contexto"
            description="Cores semânticas organizadas por área de aplicação"
            colors={contextColors}
            showHex={showHexValues}
            showUsage={showUsageExamples}
          />

          <ColorCategory
            title="Cores Semânticas"
            description="Cores para estados específicos e elementos de marca"
            colors={semanticColors}
            showHex={showHexValues}
            showUsage={showUsageExamples}
          />

          <ColorCategory
            title="Variações de Opacidade"
            description="Versões com transparência para backgrounds sutis"
            colors={opacityVariations}
            showHex={showHexValues}
            showUsage={showUsageExamples}
          />

          {/* Seção de Exemplos de Uso */}
          <div className="mt-12 bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Exemplos de Aplicação</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Verde */}
              <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-400/40 hover:shadow-green-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                      <div className="h-5 w-5 bg-green-400 rounded"></div>
                    </div>
                    <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                      Saudável
                    </span>
                  </div>
                  <h4 className="mb-3 text-lg font-semibold text-white">Card Verde</h4>
                  <p className="text-slate-300 text-sm">Exemplo de aplicação das cores verdes</p>
                </div>
              </div>

              {/* Card Azul */}
              <div className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl border border-blue-400/30 bg-blue-500/20 p-3 backdrop-blur-sm">
                      <div className="h-5 w-5 bg-blue-400 rounded"></div>
                    </div>
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
                      Monitoramento
                    </span>
                  </div>
                  <h4 className="mb-3 text-lg font-semibold text-white">Card Azul</h4>
                  <p className="text-slate-300 text-sm">Exemplo de aplicação das cores azuis</p>
                </div>
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
    showHexValues: true,
    showUsageExamples: true,
  },
  render: Default.render,
};