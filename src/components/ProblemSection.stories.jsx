import React from "react";
import ProblemSection from "./ProblemSection";

export default {
  title: "Components/ProblemSection",
  component: ProblemSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção que apresenta o problema da devastação das matas ciliares no Brasil com dados estatísticos impactantes.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800 py-20">
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
        story:
          "Versão padrão da seção problema com estatísticas da devastação das matas ciliares.",
      },
    },
  },
};

// Versão com fundo claro
export const LightBackground = {
  name: "Fundo Claro",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-20">
        <div className="[&_.text-white]:text-gray-900 [&_.text-gray-300]:text-gray-600 [&_.bg-red-500\/10]:bg-red-100 [&_.border-red-400\/30]:border-red-300 [&_.bg-orange-500\/10]:bg-orange-100 [&_.border-orange-400\/30]:border-orange-300 [&_.bg-yellow-500\/10]:bg-yellow-100 [&_.border-yellow-400\/30]:border-yellow-300 [&_.from-red-600\/20]:from-red-200 [&_.to-orange-600\/20]:to-orange-200 [&_.hover\:bg-red-500\/15]:hover:bg-red-200 [&_.hover\:bg-orange-500\/15]:hover:bg-orange-200">
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
        <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-400/30 backdrop-blur-sm">
          <h3 className="text-red-400 text-lg font-semibold mb-2">
            Seção Problema
          </h3>
          <p className="text-gray-300 text-sm">
            Apresenta dados alarmantes sobre a devastação das matas ciliares
            brasileiras.
          </p>
        </div>
        <ProblemSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão interativa com descrição do problema apresentado.",
      },
    },
  },
};

// Showcase de elementos
export const ElementsShowcase = {
  name: "Showcase de Elementos",
  render: () => {
    const statistics = [
      {
        icon: "Droplets",
        percentage: "75%",
        title: "Mata Ciliar Devastada",
        description:
          "das matas ciliares brasileiras já foram devastadas, comprometendo a qualidade da água e a biodiversidade local.",
        color: "red",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-400/30",
        textColor: "text-red-400",
      },
      {
        icon: "TrendingDown",
        percentage: "11 mil km²",
        title: "Perda Anual",
        description:
          "de vegetação ciliar são perdidos anualmente no Brasil, uma área equivalente ao estado do Catar.",
        color: "orange",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-400/30",
        textColor: "text-orange-400",
      },
      {
        icon: "DollarSign",
        percentage: "R$ 2,8 bi",
        title: "Recursos Perdidos",
        description:
          "são desperdiçados anualmente em recursos que poderiam ser direcionados para preservação e recuperação.",
        color: "yellow",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-400/30",
        textColor: "text-yellow-400",
      },
    ];

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              O Problema Atual
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A devastação das matas ciliares no Brasil acontece de forma
            silenciosa, sem dados precisos e sem acompanhamento adequado.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} ${
                stat.borderColor
              } rounded-xl p-8 backdrop-blur-sm border hover:${stat.bgColor.replace(
                "/10",
                "/15"
              )} transition-all duration-300`}
            >
              <div className={`${stat.textColor} mb-4`}>
                <div className="w-12 h-12 flex items-center justify-center">
                  {stat.icon === "Droplets" && (
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
                        d="M7.5 14.25c0-1.5 1.5-3 3.75-3s3.75 1.5 3.75 3-1.5 3-3.75 3-3.75-1.5-3.75-3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 2.25c-1.5 0-3 1.5-3 3.75 0 1.5 1.5 3 3.75 3s3.75-1.5 3.75-3c0-2.25-1.5-3.75-3-3.75z"
                      />
                    </svg>
                  )}
                  {stat.icon === "TrendingDown" && (
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
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  )}
                  {stat.icon === "DollarSign" && (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.textColor} mb-2`}>
                {stat.percentage}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {stat.title}
              </h3>
              <p className="text-gray-300">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl p-12 text-white border border-red-400/30 backdrop-blur-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-4">
            11 mil km² perdidos por ano
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Sem dados precisos, sem acompanhamento, sem ação coordenada. A
            devastação continua invisível até que seja tarde demais.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração detalhada de todos os elementos que compõem a seção problema.",
      },
    },
  },
};

// Comparação de impacto
export const ImpactComparison = {
  name: "Comparação de Impacto",
  render: () => {
    const comparisons = [
      {
        title: "11 mil km² por ano",
        subtitle: "Área perdida de mata ciliar",
        comparison: "Equivale ao estado do Catar",
        icon: "🌳",
        color: "red",
      },
      {
        title: "R$ 2,8 bilhões",
        subtitle: "Recursos desperdiçados",
        comparison: "Poderia recuperar 280 mil hectares",
        icon: "💰",
        color: "orange",
      },
      {
        title: "75% devastado",
        subtitle: "Das matas ciliares brasileiras",
        comparison: "Apenas 25% ainda preservado",
        icon: "⚠️",
        color: "yellow",
      },
    ];

    return (
      <div className="space-y-8 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Dimensão do Problema
          </h2>
          <p className="text-gray-300">
            Comparações para entender a escala da devastação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-gray-600 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-4xl mb-4 text-center">{item.icon}</div>
              <div
                className={`text-2xl font-bold mb-2 text-center ${
                  item.color === "red"
                    ? "text-red-400"
                    : item.color === "orange"
                    ? "text-orange-400"
                    : "text-yellow-400"
                }`}
              >
                {item.title}
              </div>
              <div className="text-white text-center mb-3">{item.subtitle}</div>
              <div className="text-gray-300 text-sm text-center italic">
                {item.comparison}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Comparações visuais para dimensionar o problema da devastação.",
      },
    },
  },
};

// Versão compacta
export const CompactVersion = {
  name: "Versão Compacta",
  render: () => {
    const compactStats = [
      { icon: "🚨", stat: "75%", label: "Devastado" },
      { icon: "📉", stat: "11k km²", label: "Perda/ano" },
      { icon: "💸", stat: "R$ 2,8bi", label: "Desperdiçado" },
    ];

    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">O Problema</h2>
          <p className="text-gray-300">
            Devastação das matas ciliares brasileiras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
          {compactStats.map((stat, index) => (
            <div
              key={index}
              className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-red-400 mb-1">
                {stat.stat}
              </div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm text-center">
          <p className="text-white text-sm">
            <span className="text-red-400 font-bold">Devastação invisível</span>{" "}
            até ser tarde demais
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
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800">
              <div
                style={{
                  width: "375px",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10">
                  <ProblemSection />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800">
              <div
                style={{
                  width: "768px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10">
                  <ProblemSection />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800">
              <div
                style={{
                  width: "1200px",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-20">
                  <ProblemSection />
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
