import React from "react";
import SolutionSection from "./SolutionSection";

export default {
  title: "Components/SolutionSection",
  component: SolutionSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção que apresenta a solução OrBee com três pilares principais: identificação precisa, planos em tempo real e financiamento coletivo.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20">
        <Story />
      </div>
    ),
  ],
};

// Story padrão
export const Default = {
  name: "Padrão",
  parameters: {
    docs: {
      description: {
        story: "Versão padrão da seção solução com os três pilares da OrBee.",
      },
    },
  },
};

// Versão com fundo claro
export const LightBackground = {
  name: "Fundo Claro",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-20">
        <div className="[&_.text-white]:text-gray-900 [&_.text-gray-300]:text-gray-600 [&_.bg-emerald-500\/10]:bg-emerald-100 [&_.border-emerald-400\/30]:border-emerald-300 [&_.bg-blue-500\/10]:bg-blue-100 [&_.border-blue-400\/30]:border-blue-300 [&_.bg-purple-500\/10]:bg-purple-100 [&_.border-purple-400\/30]:border-purple-300 [&_.from-emerald-500\/20]:from-emerald-200 [&_.to-green-500\/20]:to-green-200">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Versão adaptada para fundo claro com cores ajustadas.",
      },
    },
  },
};

// Versão mobile
export const MobileView = {
  name: "Visualização Mobile",
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Como a seção aparece em dispositivos móveis.",
      },
    },
  },
};

// Versão tablet
export const TabletView = {
  name: "Visualização Tablet",
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Como a seção aparece em tablets.",
      },
    },
  },
};

// Demonstração interativa
export const InteractiveDemo = {
  name: "Demo Interativo",
  render: () => {
    return (
      <div className="space-y-8">
        <div className="text-center p-4 bg-emerald-900/20 rounded-lg border border-emerald-400/30 backdrop-blur-sm">
          <h3 className="text-emerald-400 text-lg font-semibold mb-2">
            Seção Solução OrBee
          </h3>
          <p className="text-gray-300 text-sm">
            Apresenta os três pilares da solução: identificação, planejamento e
            financiamento.
          </p>
        </div>
        <SolutionSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão interativa com descrição dos elementos.",
      },
    },
  },
};

// Showcase de elementos
export const ElementsShowcase = {
  name: "Showcase de Elementos",
  render: () => {
    const features = [
      {
        icon: "MapPin",
        title: "Identificação Precisa",
        description:
          "Usa NDVI e dados geoespaciais para identificar áreas degradadas com precisão científica",
        color: "emerald",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-400/30",
        iconColor: "text-emerald-400",
      },
      {
        icon: "Calculator",
        title: "Planos em Tempo Real",
        description:
          "Calcula planos de recuperação ambiental instantaneamente, incluindo custos detalhados",
        color: "blue",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        iconColor: "text-blue-400",
      },
      {
        icon: "Heart",
        title: "Financiamento Coletivo",
        description:
          "Permite crowdfunding com acompanhamento direto no mapa em tempo real",
        color: "purple",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-400/30",
        iconColor: "text-purple-400",
      },
    ];

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              A Solução Orbee
            </h2>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} rounded-xl p-8 backdrop-blur-sm border`}
            >
              <div className={`${feature.iconColor} mb-4`}>
                <div className="w-12 h-12 flex items-center justify-center">
                  {feature.icon === "MapPin" && (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  {feature.icon === "Calculator" && (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {feature.icon === "Heart" && (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-8 backdrop-blur-sm text-center">
          <p className="text-2xl text-white leading-relaxed">
            "Com a Orbee, você vê o impacto da sua contribuição,
            <span className="text-emerald-400 font-bold">
              árvore por árvore, hectare por hectare.
            </span>
            "
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração detalhada de todos os elementos que compõem a seção solução.",
      },
    },
  },
};

// Variações de cor
export const ColorVariations = {
  name: "Variações de Cor",
  render: () => {
    const colorSchemes = [
      {
        name: "Emerald (Padrão)",
        gradient: "from-slate-900 via-slate-800 to-emerald-900",
        accent: "emerald",
      },
      {
        name: "Blue Ocean",
        gradient: "from-slate-900 via-blue-900 to-cyan-900",
        accent: "blue",
      },
      {
        name: "Forest Green",
        gradient: "from-gray-900 via-green-900 to-emerald-900",
        accent: "green",
      },
    ];

    return (
      <div className="space-y-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Variações de Cor
          </h2>
          <p className="text-gray-300">
            Diferentes esquemas de cores para a seção
          </p>
        </div>

        {colorSchemes.map((scheme, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-xl font-semibold text-white text-center">
              {scheme.name}
            </h3>
            <div
              className={`bg-gradient-to-br ${scheme.gradient} p-8 rounded-xl`}
            >
              <SolutionSection />
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Diferentes esquemas de cores aplicados à seção.",
      },
    },
  },
};

// Versão compacta
export const CompactVersion = {
  name: "Versão Compacta",
  render: () => {
    const compactFeatures = [
      { icon: "🎯", title: "Identificação", desc: "NDVI e dados geoespaciais" },
      { icon: "⚡", title: "Planos Rápidos", desc: "Cálculos instantâneos" },
      { icon: "💚", title: "Crowdfunding", desc: "Financiamento coletivo" },
    ];

    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Solução OrBee</h2>
          <p className="text-gray-300">
            Versão compacta dos pilares principais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {compactFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4 backdrop-blur-sm text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-lg p-4 backdrop-blur-sm text-center">
          <p className="text-white">
            <span className="text-emerald-400 font-bold">Impacto visível</span>{" "}
            em tempo real
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão compacta da seção para espaços menores.",
      },
    },
  },
};

// Demonstração responsiva
export const ResponsiveDemo = {
  name: "Demo Responsivo",
  render: () => {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Mobile (375px)
            </div>
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 to-emerald-900">
              <div
                style={{
                  width: "375px",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10">
                  <SolutionSection />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 to-emerald-900">
              <div
                style={{
                  width: "768px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10">
                  <SolutionSection />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 to-emerald-900">
              <div
                style={{
                  width: "1200px",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-20">
                  <SolutionSection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Comparação da seção em diferentes tamanhos de tela.",
      },
    },
  },
};
