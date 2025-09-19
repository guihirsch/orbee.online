import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import HeroSection from "./HeroSection";

export default {
  title: "Landing/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: { type: "color" },
      description: "Cor de fundo do componente",
    },
  },
};

export const Default = {
  args: {},
};

export const WithCustomBackground = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export const MobileView = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// Demonstração interativa com diferentes backgrounds
export const InteractiveBackgrounds = {
  render: () => {
    const [backgroundType, setBackgroundType] = useState("default");

    const backgrounds = {
      default: "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900",
      forest: "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900",
      ocean: "bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900",
      sunset: "bg-gradient-to-br from-orange-900 via-red-800 to-pink-900",
      night: "bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900",
    };

    return (
      <BrowserRouter>
        <div
          className={`min-h-screen transition-all duration-1000 ${backgrounds[backgroundType]}`}
        >
          {/* Controles de Background */}
          <div className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Tema de Fundo:
            </h4>
            <div className="space-y-2">
              {Object.keys(backgrounds).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBackgroundType(bg)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    backgroundType === bg
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {bg.charAt(0).toUpperCase() + bg.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <HeroSection />
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de animações
export const AnimationShowcase = {
  render: () => {
    const [key, setKey] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const replayAnimations = () => {
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
        setKey((prev) => prev + 1);
      }, 300);
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Controle de Animação */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={replayAnimations}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors font-medium"
            >
              Repetir Animações
            </button>
          </div>

          {isVisible && <HeroSection key={key} />}
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de elementos individuais
export const ElementsBreakdown = {
  render: () => {
    const [activeElement, setActiveElement] = useState("all");

    const elements = {
      all: "Todos os Elementos",
      header: "Apenas Header",
      title: "Apenas Título",
      input: "Apenas Input",
      button: "Apenas Botão Sinimbu",
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Controles de Elementos */}
          <div className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Elementos Visíveis:
            </h4>
            <div className="space-y-2">
              {Object.entries(elements).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveElement(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeElement === key
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Section Customizada */}
          <section className="relative flex h-screen min-h-screen flex-col overflow-hidden">
            {/* Header */}
            {(activeElement === "all" || activeElement === "header") && (
              <header className="relative z-50 flex items-center justify-center py-6">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bee-icon lucide-bee"
                  >
                    <path d="m8 2 1.88 1.88" stroke="white" />
                    <path d="M14.12 3.88 16 2" stroke="white" />
                    <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="white" />
                    <path
                      d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z"
                      stroke="white"
                    />
                    <path d="M7.56 12h8.87" stroke="white" />
                    <path d="M7.5 17h9" stroke="white" />
                    <path
                      d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3"
                      stroke="white"
                    />
                  </svg>
                  <span className="font-odor-mean-chey text-3xl font-bold text-white">
                    Orbee
                  </span>
                </div>
              </header>
            )}

            {/* Hero Content */}
            <div className="relative z-40 flex flex-1 items-center justify-center px-6 py-16">
              <div className="mx-auto max-w-6xl text-center relative">
                {/* Main Headline */}
                {(activeElement === "all" || activeElement === "title") && (
                  <h1 className="animate-fade-in-up animation-delay-200 mb-8 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                    <span className="mb-4 block text-white drop-shadow-2xl">
                      Plano de recuperação ambiental
                    </span>
                    <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg animate-gradient-shift animate-text-glow">
                      em tempo real
                    </span>
                  </h1>
                )}

                {/* Location Input Section */}
                {(activeElement === "all" || activeElement === "input") && (
                  <div className="animate-fade-in-up animation-delay-600 mx-auto max-w-2xl">
                    <div className="mb-2">
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="Digite sua cidade ou região..."
                          className="w-full px-8 py-6 text-xl bg-slate-900/70 border-2 border-emerald-400/40 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-500 backdrop-blur-md shadow-2xl hover:shadow-emerald-500/20"
                        />
                        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-8 h-8 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sinimbu Button */}
                {(activeElement === "all" || activeElement === "button") && (
                  <div className="mb-6 flex justify-start">
                    <button className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      Sinimbu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de responsividade
export const ResponsiveDemo = {
  render: () => {
    const [viewport, setViewport] = useState("desktop");

    const viewports = {
      mobile: { width: "375px", label: "Mobile (375px)" },
      tablet: { width: "768px", label: "Tablet (768px)" },
      desktop: { width: "100%", label: "Desktop (100%)" },
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Controles de Viewport */}
          <div className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Tamanho da Tela:
            </h4>
            <div className="space-y-2">
              {Object.entries(viewports).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setViewport(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    viewport === key
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Container Responsivo */}
          <div className="flex justify-center">
            <div
              className="transition-all duration-500 border-2 border-slate-600"
              style={{
                width: viewports[viewport].width,
                maxWidth: "100%",
                minHeight: "100vh",
              }}
            >
              <HeroSection />
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de acessibilidade
export const AccessibilityDemo = {
  render: () => {
    const [focusVisible, setFocusVisible] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    return (
      <BrowserRouter>
        <div
          className={`min-h-screen transition-all duration-500 ${
            highContrast
              ? "bg-black"
              : "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"
          }`}
        >
          {/* Controles de Acessibilidade */}
          <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Acessibilidade:
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={focusVisible}
                  onChange={(e) => setFocusVisible(e.target.checked)}
                  className="rounded"
                />
                Mostrar Focus
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded"
                />
                Alto Contraste
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400 mb-2">
                Navegação por Teclado:
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Tab: Navegar elementos</li>
                <li>• Enter: Ativar botões</li>
                <li>• Esc: Fechar modais</li>
              </ul>
            </div>
          </div>

          {/* Estilos de Focus */}
          <style jsx>{`
            ${focusVisible
              ? `
              *:focus {
                outline: 3px solid #10b981 !important;
                outline-offset: 2px !important;
              }
            `
              : ""}

            ${highContrast
              ? `
              .text-emerald-300,
              .text-emerald-400 {
                color: #00ff00 !important;
              }
              .bg-emerald-500\/10,
              .bg-emerald-500\/20 {
                background-color: rgba(0, 255, 0, 0.3) !important;
              }
              .border-emerald-400\/30 {
                border-color: #00ff00 !important;
              }
            `
              : ""}
          `}</style>

          <HeroSection />
        </div>
      </BrowserRouter>
    );
  },
};
