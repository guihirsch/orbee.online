import React, { useState, useEffect } from "react";

export default {
  title: "Foundations/Effects",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sistema de efeitos visuais do OrBee.Online incluindo noise texture, animações e transições.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showNoiseOverlay: {
      control: { type: "boolean" },
      description: "Exibir overlay de ruído",
    },
    animateElements: {
      control: { type: "boolean" },
      description: "Ativar animações",
    },
    showTransitions: {
      control: { type: "boolean" },
      description: "Exibir transições hover",
    },
  },
};

// Componente de Noise Overlay reutilizável
const NoiseOverlay = ({
  frequency = 0.9,
  octaves = 4,
  opacity = 0.15,
  tileSize = 200,
  blendMode = "multiply",
  id = "noise-default",
}) => {
  const filterId = `noise-filter-${id}`;
  const patternId = `noise-pattern-${id}`;

  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity }}
      >
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
    blendMode = "multiply",
  } = config;

  const [noiseId] = useState(
    () => `noise-${Math.random().toString(36).substr(2, 9)}`
  );

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
  <div
    className={`bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm ${className}`}
  >
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm">{description}</p>
    </div>
    <div className="relative">{children}</div>
  </div>
);

// Componente de card animado
const AnimatedCard = ({ animate, showNoise, children, className = "" }) => {
  const { NoiseComponent } = useNoiseTexture({
    frequency: 0.9,
    octaves: 4,
    opacity: 0.1,
    tileSize: 150,
  });

  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl
      ${
        animate
          ? "transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-400/40"
          : ""
      }
      ${className}
    `}
    >
      {showNoise && <NoiseComponent />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Componente de botão com efeitos
const EffectButton = ({
  variant = "primary",
  animate,
  showNoise,
  children,
}) => {
  const { NoiseComponent } = useNoiseTexture({
    frequency: 1.2,
    octaves: 3,
    opacity: 0.08,
    tileSize: 100,
  });

  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 text-white",
    secondary:
      "bg-slate-700 hover:bg-slate-600 border-slate-600/50 text-slate-200",
    outline:
      "bg-transparent hover:bg-emerald-600/10 border-emerald-400/50 text-emerald-300",
  };

  return (
    <button
      className={`
      relative overflow-hidden rounded-xl border px-6 py-3 font-medium backdrop-blur-sm
      ${variants[variant]}
      ${
        animate
          ? "transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          : ""
      }
    `}
    >
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
        {/* Header*/}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Sistema de Efeitos Visuais
                </h1>
                <p className="text-slate-600 mt-1">
                  Demonstração interativa dos componentes com noise texture e
                  animações
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Noise Texture Variations */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Variações de Noise Texture
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm mb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Noise Sutil
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Frequência baixa, ideal para backgrounds
                  </p>
                </div>
                <div className="relative">
                  <div className="relative h-32 bg-emerald-100 rounded-lg overflow-hidden border border-emerald-200">
                    <NoiseOverlay
                      frequency={0.5}
                      octaves={2}
                      opacity={0.08}
                      id="subtle-light"
                      blendMode="multiply"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-emerald-700 font-medium">
                        Background Sutil
                      </span>
                    </div>
                  </div>
                  <code className="text-emerald-700 text-xs font-mono mt-2 block bg-slate-100 px-2 py-1 rounded">
                    frequency: 0.5, octaves: 2, opacity: 0.08
                  </code>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Noise Padrão
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Configuração padrão para cards
                  </p>
                </div>
                <div className="relative">
                  <div className="relative h-32 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                    <NoiseOverlay
                      frequency={0.9}
                      octaves={4}
                      opacity={0.12}
                      id="standard-light"
                      blendMode="multiply"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-700 font-medium">
                        Card Padrão
                      </span>
                    </div>
                  </div>
                  <code className="text-emerald-700 text-xs font-mono mt-2 block bg-slate-100 px-2 py-1 rounded">
                    frequency: 0.9, octaves: 4, opacity: 0.12
                  </code>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Noise Intenso
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Alta frequência para elementos de destaque
                  </p>
                </div>
                <div className="relative">
                  <div className="relative h-32 bg-purple-100 rounded-lg overflow-hidden border border-purple-200">
                    <NoiseOverlay
                      frequency={1.5}
                      octaves={6}
                      opacity={0.18}
                      id="intense-light"
                      blendMode="multiply"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-purple-700 font-medium">
                        Elemento Destaque
                      </span>
                    </div>
                  </div>
                  <code className="text-emerald-700 text-xs font-mono mt-2 block bg-slate-100 px-2 py-1 rounded">
                    frequency: 1.5, octaves: 6, opacity: 0.18
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Transições e Animações */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Transições e Animações
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Transições de Hover */}
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm mb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Transições em hover
                  </h3>
                  <div className="space-y-4">
                    <div
                      className={`
                    p-4 bg-slate-200 rounded-lg border border-slate-300
                    ${
                      showTransitions
                        ? "transition-all duration-300 hover:bg-slate-300 hover:border-slate-400 hover:scale-105"
                        : ""
                    }
                  `}
                    >
                      <span className="text-slate-800">Hover para escalar</span>
                    </div>

                    <div
                      className={`
                    p-4 bg-emerald-100 rounded-lg border border-emerald-300
                    ${
                      showTransitions
                        ? "transition-all duration-200 hover:bg-emerald-200 hover:shadow-lg hover:shadow-emerald-500/20"
                        : ""
                    }
                  `}
                    >
                      <span className="text-emerald-800">
                        Hover para brilhar
                      </span>
                    </div>

                    <div
                      className={`
                    p-4 bg-blue-100 rounded-lg border border-blue-300
                    ${
                      showTransitions
                        ? "transition-all duration-500 hover:rotate-1 hover:bg-blue-200"
                        : ""
                    }
                  `}
                    >
                      <span className="text-blue-800">
                        Hover para rotacionar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Animações de Loading */}
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm mb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Animações de loading
                  </h3>
                  <div className="space-y-4">
                    {/* Pulse */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 bg-emerald-500 rounded-full ${
                          animateElements ? "animate-pulse" : ""
                        }`}
                      ></div>
                      <span className="text-slate-700 text-sm">
                        Pulse Animation
                      </span>
                    </div>

                    {/* Spin */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full ${
                          animateElements ? "animate-spin" : ""
                        }`}
                      ></div>
                      <span className="text-slate-700 text-sm">
                        Spin Animation
                      </span>
                    </div>

                    {/* Bounce */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 bg-blue-500 rounded-full ${
                          animateElements ? "animate-bounce" : ""
                        }`}
                      ></div>
                      <span className="text-slate-700 text-sm">
                        Bounce Animation
                      </span>
                    </div>

                    {/* Ping */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <div
                          className={`absolute inset-0 w-4 h-4 bg-purple-500 rounded-full ${
                            animateElements ? "animate-ping" : ""
                          }`}
                        ></div>
                      </div>
                      <span className="text-slate-700 text-sm">
                        Ping Animation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Noise */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Configurações de Noise Texture
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Parâmetros Principais
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Frequency</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">
                      0.5 - 2.0
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Octaves</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">
                      2 - 6
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Opacity</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">
                      0.05 - 0.3
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tile Size</span>
                    <code className="text-emerald-700 font-mono bg-slate-100 px-2 py-1 rounded">
                      100 - 300px
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Blend Modes
                </h3>
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
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Guia de Implementação
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">
                  Uso do Hook useNoiseTexture
                </h3>
                <div className="bg-slate-100 rounded-lg p-4 text-sm border">
                  <code className="text-slate-700">
                    <span className="text-blue-600">const</span>{" "}
                    {`{ NoiseComponent }`} ={" "}
                    <span className="text-yellow-600">useNoiseTexture</span>(
                    {`{`}
                    <br />
                    &nbsp;&nbsp;
                    <span className="text-emerald-600">frequency</span>:{" "}
                    <span className="text-orange-600">0.9</span>,<br />
                    &nbsp;&nbsp;
                    <span className="text-emerald-600">octaves</span>:{" "}
                    <span className="text-orange-600">4</span>,<br />
                    &nbsp;&nbsp;
                    <span className="text-emerald-600">opacity</span>:{" "}
                    <span className="text-orange-600">0.15</span>
                    <br />
                    {`});`}
                  </code>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-700 mb-3">
                  Classes de Transição
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-slate-100 rounded p-2 border">
                    <code className="text-emerald-700">
                      transition-all duration-300
                    </code>
                  </div>
                  <div className="bg-slate-100 rounded p-2 border">
                    <code className="text-emerald-700">
                      hover:scale-105 hover:shadow-xl
                    </code>
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
