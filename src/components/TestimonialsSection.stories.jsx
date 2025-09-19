import React from "react";
import TestimonialsSection from "./TestimonialsSection";

export default {
  title: "Components/TestimonialsSection",
  component: TestimonialsSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção de depoimentos de usuários com estatísticas e call-to-action. Inclui animações de scroll e layout responsivo.",
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
        story:
          "Versão padrão da seção de depoimentos com todos os elementos visíveis.",
      },
    },
  },
};

// Versão com fundo personalizado
export const WithCustomBackground = {
  name: "Fundo Personalizado",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-800 to-green-900">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Seção com fundo personalizado em tons de verde.",
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
            Demonstração Interativa
          </h3>
          <p className="text-slate-300 text-sm">
            Esta seção demonstra depoimentos reais de usuários da plataforma
            OrBee.
          </p>
        </div>
        <TestimonialsSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão interativa com informações adicionais sobre a seção.",
      },
    },
  },
};

// Showcase de elementos
export const ElementsShowcase = {
  name: "Showcase de Elementos",
  render: () => {
    const testimonials = [
      {
        name: "Maria Silva",
        role: "Coordenadora Ambiental",
        organization: "ONG Verde Esperança",
        content: "O OrBee revolucionou nossa forma de monitorar a mata ciliar.",
        avatar: "MS",
        rating: 5,
        location: "Santa Cruz do Sul, RS",
      },
    ];

    const stats = [
      { number: "98%", label: "Satisfação dos Usuários" },
      { number: "500+", label: "Comunidades Ativas" },
      { number: "15K+", label: "Validações Realizadas" },
      { number: "1.2M+", label: "Hectares Monitorados" },
    ];

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Depoimentos
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white">
            Histórias de
            <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Impacto Real
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="mb-2 text-3xl font-bold text-emerald-400">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-slate-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {testimonials[0].avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-4">{testimonials[0].content}</p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonials[0].name}
                  </div>
                  <div className="text-sm text-emerald-400">
                    {testimonials[0].role}
                  </div>
                  <div className="text-sm text-slate-400">
                    {testimonials[0].organization}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {testimonials[0].location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-400/30 bg-slate-900/60 backdrop-blur-md p-8 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Faça Parte da Nossa Comunidade
            </h3>
            <p className="mb-6 text-slate-300">
              Junte-se a centenas de organizações que já estão fazendo a
              diferença com o OrBee.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105">
                Começar Agora
              </button>
              <button className="rounded-2xl border-2 border-emerald-400/50 px-6 py-3 font-semibold text-emerald-300 transition-all duration-300 hover:bg-emerald-500/20">
                Agendar Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração detalhada de todos os elementos que compõem a seção.",
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
                <TestimonialsSection />
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
                <TestimonialsSection />
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
                <TestimonialsSection />
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

// Demonstração de acessibilidade
export const AccessibilityDemo = {
  name: "Demo de Acessibilidade",
  render: () => {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-3">
            Recursos de Acessibilidade
          </h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Contraste adequado entre texto e fundo</li>
            <li>• Estrutura semântica com headings apropriados</li>
            <li>• Botões com estados de foco visíveis</li>
            <li>• Animações respeitam preferências de movimento reduzido</li>
            <li>• Conteúdo acessível via teclado</li>
            <li>• Textos alternativos para elementos visuais</li>
          </ul>
        </div>
        <TestimonialsSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração dos recursos de acessibilidade implementados na seção.",
      },
    },
  },
};
