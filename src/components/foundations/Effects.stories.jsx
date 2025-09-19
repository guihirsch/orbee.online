import React, { useState, useEffect } from 'react';

export default {
  title: 'Foundations/Effects',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema de efeitos visuais do OrBee.Online incluindo noise texture, animações e transições.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showNoiseOverlay: {
      control: { type: 'boolean' },
      description: 'Exibir overlay de ruído',
    },
    animateElements: {
      control: { type: 'boolean' },
      description: 'Ativar animações',
    },
    showTransitions: {
      control: { type: 'boolean' },
      description: 'Exibir transições hover',
    },
  },
};

// Componente de Noise Overlay reutilizável
const NoiseOverlay = ({ 
  frequency = 0.9, 
  octaves = 4, 
  opacity = 0.15, 
  tileSize = 200, 
  blendMode = 'multiply',
  id = 'noise-default'
}) => {
  const filterId = `noise-filter-${id}`;
  const patternId = `noise-pattern-${id}`;
  
  return (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              baseFrequency={frequency}
              numOctaves={octaves}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="monoNoise"
            />
            <feComponentTransfer in="monoNoise" result="alphaAdjusted">
              <feFuncA type="discrete" tableValues="0.5 0.7 0.9 1" />
            </feComponentTransfer>
          </filter>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={tileSize}
            height={tileSize}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="100%"
              height="100%"
              filter={`url(#${filterId})`}
              fill="white"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          style={{ mixBlendMode: blendMode }}
        />
      </svg>
    </>
  );
};

// Hook para textura de ruído
const useNoiseTexture = (config = {}) => {
  const {
    frequency = 0.9,
    octaves = 4,
    opacity = 0.15,
    tileSize = 200,
    blendMode = 'multiply'
  } = config;
  
  const [noiseId] = useState(() => `noise-${Math.random().toString(36).substr(2, 9)}`);
  
  const NoiseComponent = () => (
    <NoiseOverlay
      frequency={frequency}
      octaves={octaves}
      opacity={opacity}
      tileSize={tileSize}
      blendMode={blendMode}
      id={noiseId}
    />
  );
  
  return { NoiseComponent, noiseId };
};

// Componente de demonstração de efeitos
const EffectDemo = ({ title, description, children, className = "" }) => (
  <div className={`bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm ${className}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

// Componente de card animado
const AnimatedCard = ({ animate, showNoise, children, className = "" }) => {
  const { NoiseComponent } = useNoiseTexture({
    frequency: 0.9,
    octaves: 4,
    opacity: 0.1,
    tileSize: 150
  });
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl
      ${animate ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-400/40' : ''}
      ${className}
    `}>
      {showNoise && <NoiseComponent />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Componente de botão com efeitos
const EffectButton = ({ variant = 'primary', animate, showNoise, children }) => {
  const { NoiseComponent } = useNoiseTexture({
    frequency: 1.2,
    octaves: 3,
    opacity: 0.08,
    tileSize: 100
  });
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 border-slate-600/50 text-slate-200',
    outline: 'bg-transparent hover:bg-emerald-600/10 border-emerald-400/50 text-emerald-300'
  };
  
  return (
    <button className={`
      relative overflow-hidden rounded-xl border px-6 py-3 font-medium backdrop-blur-sm
      ${variants[variant]}
      ${animate ? 'transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95' : ''}
    `}>
      {showNoise && <NoiseComponent />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const Default = {
  args: {
    showNoiseOverlay: true,
    animateElements: true,
    showTransitions: true,
  },
  render: ({ showNoiseOverlay, animateElements, showTransitions }) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header com Controles */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Sistema de Efeitos Visuais</h1>
                <p className="text-slate-600 mt-1">Demonstração interativa dos componentes com noise texture e animações</p>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showNoiseOverlay}
                    onChange={(e) => setShowNoiseOverlay(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">Noise Texture</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={animateElements}
                    onChange={(e) => setAnimateElements(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">Animações</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showTransitions}
                    onChange={(e) => setShowTransitions(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                  />
                  <span className="text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">Transições</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-4">
              Sistema de Efeitos Visuais OrBee.Online
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Noise textures, animações e transições para uma experiência visual rica
            </p>
          </div>

          {/* Noise Texture Variations */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Variações de Noise Texture</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <EffectDemo
                title="Noise Sutil"
                description="Frequência baixa, ideal para backgrounds"
              >
                <div className="relative h-32 bg-emerald-600/20 rounded-lg overflow-hidden">
                  <NoiseOverlay frequency={0.5} octaves={2} opacity={0.1} id="subtle" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-emerald-300 font-medium">Background Sutil</span>
                  </div>
                </div>
                <code className="text-emerald-400 text-xs font-mono mt-2 block">
                  frequency: 0.5, octaves: 2, opacity: 0.1
                </code>
              </EffectDemo>

              <EffectDemo
                title="Noise Padrão"
                description="Configuração padrão para cards"
              >
                <div className="relative h-32 bg-slate-700/50 rounded-lg overflow-hidden">
                  <NoiseOverlay frequency={0.9} octaves={4} opacity={0.15} id="standard" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-medium">Card Padrão</span>
                  </div>
                </div>
                <code className="text-emerald-400 text-xs font-mono mt-2 block">
                  frequency: 0.9, octaves: 4, opacity: 0.15
                </code>
              </EffectDemo>

              <EffectDemo
                title="Noise Intenso"
                description="Alta frequência para elementos de destaque"
              >
                <div className="relative h-32 bg-purple-600/30 rounded-lg overflow-hidden">
                  <NoiseOverlay frequency={1.5} octaves={6} opacity={0.25} id="intense" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-purple-300 font-medium">Elemento Destaque</span>
                  </div>
                </div>
                <code className="text-emerald-400 text-xs font-mono mt-2 block">
                  frequency: 1.5, octaves: 6, opacity: 0.25
                </code>
              </EffectDemo>
            </div>
          </div>

          {/* Transições e Animações */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Transições e Animações</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Transições de Hover */}
              <EffectDemo
                title="Transições de Hover"
                description="Efeitos suaves ao passar o mouse"
              >
                <div className="space-y-4">
                  <div className={`
                    p-4 bg-slate-200 rounded-lg border border-slate-300
                    ${showTransitions ? 'transition-all duration-300 hover:bg-slate-300 hover:border-slate-400 hover:scale-105' : ''}
                  `}>
                    <span className="text-slate-800">Hover para escalar</span>
                  </div>
                  
                  <div className={`
                    p-4 bg-emerald-100 rounded-lg border border-emerald-300
                    ${showTransitions ? 'transition-all duration-200 hover:bg-emerald-200 hover:shadow-lg hover:shadow-emerald-500/20' : ''}
                  `}>
                    <span className="text-emerald-800">Hover para brilhar</span>
                  </div>
                  
                  <div className={`
                    p-4 bg-blue-100 rounded-lg border border-blue-300
                    ${showTransitions ? 'transition-all duration-500 hover:rotate-1 hover:bg-blue-200' : ''}
                  `}>
                    <span className="text-blue-800">Hover para rotacionar</span>
                  </div>
                </div>
              </EffectDemo>

              {/* Animações de Loading */}
              <EffectDemo
                title="Animações de Loading"
                description="Indicadores de carregamento"
              >
                <div className="space-y-4">
                  {/* Pulse */}
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 bg-emerald-500 rounded-full ${animateElements ? 'animate-pulse' : ''}`}></div>
                    <span className="text-slate-700 text-sm">Pulse Animation</span>
                  </div>
                  
                  {/* Spin */}
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full ${animateElements ? 'animate-spin' : ''}`}></div>
                    <span className="text-slate-700 text-sm">Spin Animation</span>
                  </div>
                  
                  {/* Bounce */}
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 bg-blue-500 rounded-full ${animateElements ? 'animate-bounce' : ''}`}></div>
                    <span className="text-slate-700 text-sm">Bounce Animation</span>
                  </div>
                  
                  {/* Ping */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <div className={`absolute inset-0 w-4 h-4 bg-purple-500 rounded-full ${animateElements ? 'animate-ping' : ''}`}></div>
                    </div>
                    <span className="text-slate-700 text-sm">Ping Animation</span>
                  </div>
                </div>
              </EffectDemo>
            </div>
          </div>

          {/* Cards com Efeitos Combinados */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Cards com Efeitos Combinados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedCard 
                animate={animateElements} 
                showNoise={showNoiseOverlay}
                onMouseEnter={() => setHoveredCard('health')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                    <div className="h-5 w-5 bg-green-400 rounded"></div>
                  </div>
                  <span className="rounded-full border border-green-500/50 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 backdrop-blur-sm">
                    Saudável
                  </span>
                </div>
                
                <h4 className="mb-3 text-lg font-semibold text-slate-800">Mata Ciliar - Setor Norte</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">NDVI Atual</span>
                    <span className="text-green-700 font-medium">0.68</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Tendência</span>
                    <span className="text-green-700 font-medium flex items-center gap-1">
                      ↗ Crescendo
                    </span>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard 
                animate={animateElements} 
                showNoise={showNoiseOverlay}
                className="border-orange-400/20"
                onMouseEnter={() => setHoveredCard('warning')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl border border-orange-400/30 bg-orange-500/20 p-3 backdrop-blur-sm">
                    <div className="h-5 w-5 bg-orange-400 rounded"></div>
                  </div>
                  <span className="rounded-full border border-orange-500/50 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 backdrop-blur-sm">
                    Atenção
                  </span>
                </div>
                
                <h4 className="mb-3 text-lg font-semibold text-slate-800">Mata Ciliar - Setor Sul</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">NDVI Atual</span>
                    <span className="text-orange-700 font-medium">0.42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Tendência</span>
                    <span className="text-orange-700 font-medium flex items-center gap-1">
                      ↘ Declinando
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* Botões com Efeitos */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Botões com Efeitos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <EffectDemo
                title="Botão Primário"
                description="Com noise texture e animação"
              >
                <div className="flex flex-col gap-3">
                  <EffectButton 
                    variant="primary" 
                    animate={animateElements} 
                    showNoise={showNoiseOverlay}
                  >
                    Ação Principal
                  </EffectButton>
                  <code className="text-emerald-700 text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    bg-emerald-600 + noise + hover:scale-105
                  </code>
                </div>
              </EffectDemo>

              <EffectDemo
                title="Botão Secundário"
                description="Estilo mais sutil"
              >
                <div className="flex flex-col gap-3">
                  <EffectButton 
                    variant="secondary" 
                    animate={animateElements} 
                    showNoise={showNoiseOverlay}
                  >
                    Ação Secundária
                  </EffectButton>
                  <code className="text-slate-700 text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    bg-slate-700 + noise + transitions
                  </code>
                </div>
              </EffectDemo>

              <EffectDemo
                title="Botão Outline"
                description="Transparente com bordas"
              >
                <div className="flex flex-col gap-3">
                  <EffectButton 
                    variant="outline" 
                    animate={animateElements} 
                    showNoise={showNoiseOverlay}
                  >
                    Ação Outline
                  </EffectButton>
                  <code className="text-emerald-700 text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                    bg-transparent + border + hover:bg-emerald/10
                  </code>
                </div>
              </EffectDemo>
            </div>
          </div>

          {/* Configurações de Noise */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Configurações de Noise Texture</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Parâmetros Principais</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Frequency</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">0.5 - 2.0</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Octaves</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">2 - 6</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Opacity</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">0.05 - 0.3</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tile Size</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">100 - 300px</code>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Blend Modes</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Multiply</span>
                    <span className="text-slate-500">Padrão, escurece</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Overlay</span>
                    <span className="text-slate-500">Contraste médio</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Soft-light</span>
                    <span className="text-slate-500">Efeito sutil</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Normal</span>
                    <span className="text-slate-500">Sem mistura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guia de Implementação */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Guia de Implementação</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">Uso do Hook useNoiseTexture</h3>
                <div className="bg-slate-100 rounded-lg p-4 text-sm border">
                  <code className="text-slate-700">
                    <span className="text-blue-600">const</span> {`{ NoiseComponent }`} = <span className="text-yellow-600">useNoiseTexture</span>({`{`}<br/>
                    &nbsp;&nbsp;<span className="text-emerald-600">frequency</span>: <span className="text-orange-600">0.9</span>,<br/>
                    &nbsp;&nbsp;<span className="text-emerald-600">octaves</span>: <span className="text-orange-600">4</span>,<br/>
                    &nbsp;&nbsp;<span className="text-emerald-600">opacity</span>: <span className="text-orange-600">0.15</span><br/>
                    {`});`}
                  </code>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">Classes de Transição</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-slate-100 rounded p-2 border">
                    <code className="text-emerald-700">transition-all duration-300</code>
                  </div>
                  <div className="bg-slate-100 rounded p-2 border">
                    <code className="text-emerald-700">hover:scale-105 hover:shadow-xl</code>
                  </div>
                  <div className="bg-slate-100 rounded p-2 border">
                    <code className="text-emerald-700">backdrop-blur-sm</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const NoiseOnly = {
  args: {
    showNoiseOverlay: true,
    animateElements: false,
    showTransitions: false,
  },
  render: Default.render,
};

export const AnimationsOnly = {
  args: {
    showNoiseOverlay: false,
    animateElements: true,
    showTransitions: true,
  },
  render: Default.render,
};

export const MinimalEffects = {
  args: {
    showNoiseOverlay: false,
    animateElements: false,
    showTransitions: false,
  },
  render: Default.render,
};

export const InteractiveDemo = {
  args: {
    showNoiseOverlay: true,
    animateElements: true,
    showTransitions: true,
  },
  render: Default.render,
};