import React from "react";
import HowItWorksSection from "./HowItWorksSection";
import { MapPin, Calculator, Heart, BarChart3 } from "lucide-react";

export default {
  title: "Components/HowItWorksSection",
  component: HowItWorksSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção explicativa do processo da plataforma OrBee em 4 passos simples.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        story: "Versão padrão da seção explicativa do processo em 4 passos.",
      },
    },
  },
};

// Versão com fundo personalizado
export const WithCustomBackground = {
  name: "Fundo Personalizado",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-blue-900">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Seção com fundo personalizado em tons de verde e azul.",
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
        <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-2">
            Como Funciona o OrBee
          </h3>
          <p className="text-slate-300 text-sm">
            Processo simples e eficiente para monitoramento ambiental
            colaborativo.
          </p>
        </div>
        <HowItWorksSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão interativa com informações adicionais sobre o processo.",
      },
    },
  },
};

// Showcase dos passos
export const StepsShowcase = {
  name: "Showcase dos Passos",
  render: () => {
    const steps = [
      {
        number: "1",
        icon: MapPin,
        title: "Identificamos a Área",
        description:
          "Você nos informa a localização de interesse e nós coletamos dados satelitais NDVI em tempo real.",
        details:
          "Utilizamos dados do Sentinel-2 para análise precisa da vegetação",
        color: "emerald",
      },
      {
        number: "2",
        icon: Calculator,
        title: "Analisamos os Dados",
        description:
          "Processamos as informações e geramos relatórios detalhados sobre a saúde da mata ciliar.",
        details: "Algoritmos avançados interpretam os índices de vegetação",
        color: "blue",
      },
      {
        number: "3",
        icon: Heart,
        title: "Validação Comunitária",
        description:
          "A comunidade local valida e complementa os dados com observações e fotos da região.",
        details: "Conhecimento local enriquece a análise científica",
        color: "purple",
      },
      {
        number: "4",
        icon: BarChart3,
        title: "Ações Direcionadas",
        description:
          "Sugerimos ações específicas de preservação e monitoramos o progresso ao longo do tempo.",
        details: "Recomendações personalizadas para cada contexto",
        color: "orange",
      },
    ];

    const colorClasses = {
      emerald: {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/30",
        text: "text-emerald-400",
        number: "bg-emerald-500/20",
      },
      blue: {
        bg: "bg-blue-500/20",
        border: "border-blue-400/30",
        text: "text-blue-400",
        number: "bg-blue-500/20",
      },
      purple: {
        bg: "bg-purple-500/20",
        border: "border-purple-400/30",
        text: "text-purple-400",
        number: "bg-purple-500/20",
      },
      orange: {
        bg: "bg-orange-500/20",
        border: "border-orange-400/30",
        text: "text-orange-400",
        number: "bg-orange-500/20",
      },
    };

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-300">Processo simples em 4 passos</p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            const IconComponent = step.icon;

            return (
              <div key={index} className="text-center">
                {/* Step Number */}
                <div
                  className={`${colors.number} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    {step.number}
                  </span>
                </div>

                {/* Step Card */}
                <div
                  className={`${colors.bg} border ${colors.border} rounded-xl p-6 backdrop-blur-sm h-full`}
                >
                  <IconComponent
                    className={`w-8 h-8 ${colors.text} mx-auto mb-3`}
                  />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {step.description}
                  </p>
                  <p className={`${colors.text} text-xs font-medium`}>
                    {step.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Fluxo do Processo
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      colorClasses[step.color].number
                    } flex items-center justify-center mb-2`}
                  >
                    <span
                      className={`text-lg font-bold ${
                        colorClasses[step.color].text
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>
                  <p className="text-white font-medium text-sm">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstração detalhada de todos os passos do processo OrBee.",
      },
    },
  },
};

// Versão compacta
export const CompactVersion = {
  name: "Versão Compacta",
  render: () => {
    const steps = [
      { number: "1", title: "Identificar", icon: MapPin },
      { number: "2", title: "Analisar", icon: Calculator },
      { number: "3", title: "Validar", icon: Heart },
      { number: "4", title: "Agir", icon: BarChart3 },
    ];

    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Processo Simplificado
          </h2>
          <p className="text-gray-300">4 passos para o impacto ambiental</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-emerald-400">
                    {step.number}
                  </span>
                </div>
                <IconComponent className="w-6 h-6 text-emerald-400 mb-2" />
                <p className="text-white font-medium text-sm">{step.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão compacta do processo para espaços menores.",
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
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Mobile (375px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "375px",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              >
                <HowItWorksSection />
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "768px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              >
                <HowItWorksSection />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "1200px",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              >
                <HowItWorksSection />
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
