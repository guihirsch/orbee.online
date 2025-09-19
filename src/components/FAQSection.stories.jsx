import React from "react";
import FAQSection from "./FAQSection";

export default {
  title: "Landing/FAQSection",
  component: FAQSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção de perguntas frequentes com accordion expansível e seção de contato.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: { type: "color" },
      description: "Cor de fundo do componente",
    },
  },
};

// Story padrão
export const Default = {
  name: "Padrão",
  parameters: {
    docs: {
      description: {
        story: "Versão padrão da seção FAQ com todas as perguntas e respostas.",
      },
    },
  },
};

// Versão com fundo escuro
export const DarkBackground = {
  name: "Fundo Escuro",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="[&_.text-gray-900]:text-white [&_.text-gray-600]:text-slate-300 [&_.bg-gray-50]:bg-slate-800 [&_.hover\:bg-gray-100]:hover:bg-slate-700 [&_.focus\:bg-gray-100]:focus:bg-slate-700 [&_.border-gray-200]:border-slate-700 [&_.bg-white]:bg-slate-800 [&_.border-gray-100]:border-slate-600 [&_.bg-green-50]:bg-emerald-900/20 [&_.border-green-600]:border-emerald-500 [&_.text-green-600]:text-emerald-400 [&_.bg-green-600]:bg-emerald-600 [&_.hover\:bg-green-700]:hover:bg-emerald-700 [&_.hover\:bg-green-600]:hover:bg-emerald-600">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Versão adaptada para fundo escuro com cores ajustadas.",
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
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-blue-900 text-lg font-semibold mb-2">
            Seção FAQ Interativa
          </h3>
          <p className="text-blue-700 text-sm">
            Clique nas perguntas para expandir as respostas. Inclui seção de
            contato integrada.
          </p>
        </div>
        <FAQSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Versão interativa com instruções de uso.",
      },
    },
  },
};

// Showcase de elementos
export const ElementsShowcase = {
  name: "Showcase de Elementos",
  render: () => {
    const sampleFAQs = [
      {
        question: "O que é NDVI e por que é importante?",
        answer:
          "NDVI (Normalized Difference Vegetation Index) é um índice que mede a saúde da vegetação usando dados satelitais.",
      },
      {
        question: "Com que frequência os dados são atualizados?",
        answer:
          "Os dados NDVI são atualizados semanalmente através dos satélites Sentinel-2 da ESA.",
      },
    ];

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tire suas dúvidas sobre a plataforma OrBee e o monitoramento NDVI.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {sampleFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Question */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div className="px-6 py-4 bg-white border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-4">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo a
              plataforma OrBee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors">
                Enviar Email
              </button>
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-full font-medium hover:bg-green-600 hover:text-white transition-colors">
                WhatsApp
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
          "Demonstração detalhada de todos os elementos que compõem a seção FAQ.",
      },
    },
  },
};

// FAQ com diferentes estados
export const FAQStates = {
  name: "Estados do FAQ",
  render: () => {
    const states = [
      {
        title: "Estado Fechado",
        description: "Pergunta colapsada, pronta para ser expandida",
        expanded: false,
      },
      {
        title: "Estado Aberto",
        description: "Pergunta expandida mostrando a resposta completa",
        expanded: true,
      },
    ];

    return (
      <div className="space-y-8 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Estados do Accordion
          </h2>
          <p className="text-lg text-gray-600">
            Diferentes estados visuais dos itens FAQ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {states.map((state, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {state.title}
                </h3>
                <p className="text-gray-600 text-sm">{state.description}</p>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className={`px-6 py-4 ${
                    state.expanded ? "bg-gray-100" : "bg-gray-50"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 pr-4">
                      O que é NDVI e por que é importante?
                    </h4>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          state.expanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {state.expanded && (
                  <div className="px-6 py-4 bg-white border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      NDVI (Normalized Difference Vegetation Index) é um índice
                      que mede a saúde da vegetação usando dados satelitais.
                      Valores mais altos indicam vegetação mais saudável e
                      densa.
                    </p>
                  </div>
                )}
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
        story: "Comparação entre os diferentes estados visuais do accordion.",
      },
    },
  },
};

// Versão compacta
export const CompactVersion = {
  name: "Versão Compacta",
  render: () => {
    const compactFAQs = [
      {
        question: "O que é NDVI?",
        answer: "Índice que mede a saúde da vegetação usando dados satelitais.",
      },
      {
        question: "É gratuito?",
        answer: "Sim! A OrBee é uma plataforma gratuita e aberta.",
      },
      {
        question: "Como contribuir?",
        answer: "Envie fotos e observações sobre a vegetação da sua região.",
      },
    ];

    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            FAQ Compacto
          </h2>
          <p className="text-gray-600">Versão resumida para espaços menores</p>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {compactFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-gray-600 text-sm">{faq.answer}</p>
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
        story: "Versão compacta do FAQ para espaços menores ou sidebars.",
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
            <div className="h-96 overflow-y-auto bg-white">
              <div
                style={{
                  width: "375px",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10 px-4">
                  <FAQSection />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto bg-white">
              <div
                style={{
                  width: "768px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-10 px-6">
                  <FAQSection />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-center text-gray-700 text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto bg-white">
              <div
                style={{
                  width: "1200px",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              >
                <div className="py-20 px-8">
                  <FAQSection />
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
