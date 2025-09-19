import React from "react";
import { BrowserRouter } from "react-router-dom";
import CTASection from "./CTASection";

export default {
  title: "Components/CTASection",
  component: CTASection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção de call-to-action final para engajamento do usuário com botões de ação principais.",
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Story />
        </div>
      </BrowserRouter>
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
          "Versão padrão da seção de call-to-action com botões principais.",
      },
    },
  },
};

// Versão com fundo personalizado
export const WithCustomBackground = {
  name: "Fundo Personalizado",
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-green-900">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Seção com fundo personalizado em tons de verde para destacar a ação.",
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
      <BrowserRouter>
        <div className="space-y-8">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-white text-lg font-semibold mb-2">
              Call-to-Action Final
            </h3>
            <p className="text-slate-300 text-sm">
              Seção estratégica para conversão de visitantes em usuários ativos.
            </p>
          </div>
          <CTASection />
        </div>
      </BrowserRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versão interativa com informações adicionais sobre a estratégia de conversão.",
      },
    },
  },
};

// Showcase de elementos
export const ElementsShowcase = {
  name: "Showcase de Elementos",
  render: () => {
    return (
      <BrowserRouter>
        <div className="space-y-12 p-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Pronto para Fazer a
              <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Diferença?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Junte-se a milhares de pessoas que já estão usando o OrBee para
              <span className="font-semibold text-white">
                {" "}
                monitorar, proteger e restaurar{" "}
              </span>
              nossos ecossistemas.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/30">
              <span className="relative z-10">Começar Agora</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>

            <button className="group rounded-2xl border-2 border-emerald-400/50 px-8 py-4 text-lg font-semibold text-emerald-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-200 hover:border-emerald-400/70 backdrop-blur-sm">
              Explorar Plataforma
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                15K+
              </div>
              <div className="text-sm text-slate-300">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                500+
              </div>
              <div className="text-sm text-slate-300">Comunidades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                1.2M+
              </div>
              <div className="text-sm text-slate-300">Hectares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                98%
              </div>
              <div className="text-sm text-slate-300">Satisfação</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Confiança e Segurança
              </h3>
              <p className="text-slate-300">
                Plataforma reconhecida e premiada
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-white font-medium">Finalista</p>
                <p className="text-slate-400 text-sm">
                  Prêmio Jovem Cientista 2024
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-white font-medium">Dados Seguros</p>
                <p className="text-slate-400 text-sm">Criptografia de ponta</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-white font-medium">Tempo Real</p>
                <p className="text-slate-400 text-sm">
                  Dados satelitais atualizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração detalhada de todos os elementos que compõem a seção CTA.",
      },
    },
  },
};

// Variações de botões
export const ButtonVariations = {
  name: "Variações de Botões",
  render: () => {
    const buttonStyles = [
      {
        name: "Primário (Padrão)",
        className:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-400/30",
        hoverClassName:
          "hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/25",
      },
      {
        name: "Secundário (Outline)",
        className:
          "border-2 border-emerald-400/50 text-emerald-300 backdrop-blur-sm",
        hoverClassName: "hover:bg-emerald-500/20 hover:text-emerald-200",
      },
      {
        name: "Alternativo (Azul)",
        className:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400/30",
        hoverClassName:
          "hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25",
      },
      {
        name: "Destaque (Dourado)",
        className:
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border border-yellow-400/30",
        hoverClassName:
          "hover:from-yellow-600 hover:to-orange-600 hover:shadow-yellow-500/25",
      },
    ];

    return (
      <BrowserRouter>
        <div className="space-y-8 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Variações de Botões CTA
            </h2>
            <p className="text-xl text-gray-300">
              Diferentes estilos para diferentes contextos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {buttonStyles.map((style, index) => (
              <div
                key={index}
                className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-white font-semibold mb-4 text-center">
                  {style.name}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className={`rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${style.className} ${style.hoverClassName}`}
                  >
                    Começar Agora
                  </button>
                  <button className="rounded-2xl border-2 border-slate-400/50 px-6 py-3 font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-500/20 hover:text-slate-200 backdrop-blur-sm">
                    Saiba Mais
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BrowserRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Diferentes variações de estilo para os botões de call-to-action.",
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
              <BrowserRouter>
                <div
                  style={{
                    width: "375px",
                    transform: "scale(0.8)",
                    transformOrigin: "top left",
                  }}
                >
                  <CTASection />
                </div>
              </BrowserRouter>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto">
              <BrowserRouter>
                <div
                  style={{
                    width: "768px",
                    transform: "scale(0.6)",
                    transformOrigin: "top left",
                  }}
                >
                  <CTASection />
                </div>
              </BrowserRouter>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto">
              <BrowserRouter>
                <div
                  style={{
                    width: "1200px",
                    transform: "scale(0.4)",
                    transformOrigin: "top left",
                  }}
                >
                  <CTASection />
                </div>
              </BrowserRouter>
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

// Demonstração de conversão
export const ConversionDemo = {
  name: "Demo de Conversão",
  render: () => {
    return (
      <BrowserRouter>
        <div className="space-y-8 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Estratégia de Conversão
            </h2>
            <p className="text-xl text-gray-300">
              Elementos que maximizam a conversão de visitantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">
                Elementos de Urgência
              </h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Título impactante com gradiente</li>
                <li>• Estatísticas sociais (15K+ usuários)</li>
                <li>• Botão primário com hover effects</li>
                <li>• Indicadores de confiança</li>
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">
                Redução de Fricção
              </h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Botão secundário para exploração</li>
                <li>• Linguagem clara e direta</li>
                <li>• Design responsivo</li>
                <li>• Carregamento otimizado</li>
              </ul>
            </div>
          </div>

          <CTASection />
        </div>
      </BrowserRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Análise dos elementos de conversão implementados na seção CTA.",
      },
    },
  },
};
