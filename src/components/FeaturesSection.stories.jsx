import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import FeaturesSection from "./FeaturesSection";

export default {
  title: "OrBee/Landing Page/FeaturesSection",
  component: FeaturesSection,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0f172a" },
        {
          name: "gradient",
          value:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    backgroundImage: {
      control: "text",
      description: "URL da imagem de fundo",
    },
    isTransparentMode: {
      control: "boolean",
      description: "Modo transparente para sobreposição",
    },
    setShowHeroSection: {
      action: "setShowHeroSection",
      description: "Callback para controlar visibilidade da hero section",
    },
  },
};

export const Default = {
  args: {
    backgroundImage: null,
    isTransparentMode: false,
    setShowHeroSection: () => {},
  },
};

export const TransparentMode = {
  args: {
    backgroundImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    isTransparentMode: true,
    setShowHeroSection: () => {},
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div
          className="min-h-screen bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export const WithBackgroundImage = {
  args: {
    backgroundImage:
      "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=1200",
    isTransparentMode: false,
    setShowHeroSection: () => {},
  },
};

export const MobileView = {
  args: {
    backgroundImage: null,
    isTransparentMode: false,
    setShowHeroSection: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView = {
  args: {
    backgroundImage: null,
    isTransparentMode: false,
    setShowHeroSection: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// Demonstração interativa com diferentes estados
export const InteractiveDemo = {
  render: () => {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [isTransparentMode, setIsTransparentMode] = useState(false);
    const [showHeroSection, setShowHeroSection] = useState(true);

    const backgroundOptions = {
      none: { url: null, label: "Sem Fundo" },
      forest: {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
        label: "Floresta",
      },
      river: {
        url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=1200",
        label: "Rio",
      },
      mountains: {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
        label: "Montanhas",
      },
    };

    return (
      <BrowserRouter>
        <div
          className={`min-h-screen transition-all duration-1000 ${
            backgroundImage
              ? "bg-cover bg-center bg-no-repeat"
              : "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"
          }`}
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
          }}
        >
          {backgroundImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isTransparentMode ? "bg-black/40" : "bg-black/70"
              }`}
            ></div>
          )}

          {/* Controles Interativos */}
          <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-xs">
            <h4 className="text-white font-medium mb-3 text-sm">
              Configurações:
            </h4>

            {/* Seleção de Fundo */}
            <div className="mb-4">
              <label className="block text-xs text-gray-300 mb-2">
                Imagem de Fundo:
              </label>
              <select
                value={
                  Object.keys(backgroundOptions).find(
                    (key) => backgroundOptions[key].url === backgroundImage
                  ) || "none"
                }
                onChange={(e) =>
                  setBackgroundImage(backgroundOptions[e.target.value].url)
                }
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-xs"
              >
                {Object.entries(backgroundOptions).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Modo Transparente */}
            {backgroundImage && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={isTransparentMode}
                    onChange={(e) => setIsTransparentMode(e.target.checked)}
                    className="rounded"
                  />
                  Modo Transparente
                </label>
              </div>
            )}

            {/* Controle Hero Section */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={showHeroSection}
                  onChange={(e) => setShowHeroSection(e.target.checked)}
                  className="rounded"
                />
                Mostrar Hero Section
              </label>
            </div>

            <div className="pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                Interaja com os cards e filtros na seção para explorar as
                funcionalidades.
              </p>
            </div>
          </div>

          <FeaturesSection
            backgroundImage={backgroundImage}
            isTransparentMode={isTransparentMode}
            setShowHeroSection={setShowHeroSection}
          />
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de funcionalidades específicas
export const FunctionalityShowcase = {
  render: () => {
    const [activeDemo, setActiveDemo] = useState("zones");

    const demos = {
      zones: "Cards de Zonas",
      filters: "Sistema de Filtros",
      selection: "Seleção Múltipla",
      modals: "Modais e Ações",
      responsive: "Layout Responsivo",
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Seletor de Demonstração */}
          <div className="fixed top-4 left-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Funcionalidades:
            </h4>
            <div className="space-y-2">
              {Object.entries(demos).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                    activeDemo === key
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Explicação da Funcionalidade */}
          <div className="fixed bottom-4 left-4 right-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <div className="max-w-4xl mx-auto">
              <h4 className="text-white font-medium mb-2 text-sm">
                {demos[activeDemo]}
              </h4>
              <p className="text-xs text-gray-300">
                {activeDemo === "zones" &&
                  "Explore os cards interativos das zonas com informações detalhadas, status e métricas NDVI."}
                {activeDemo === "filters" &&
                  "Use os filtros para visualizar zonas por categoria: todas, monitoradas, com relatório ou registradas."}
                {activeDemo === "selection" &&
                  "Selecione múltiplas zonas usando os checkboxes e execute ações em lote como exportar ou registrar."}
                {activeDemo === "modals" &&
                  "Clique nos botões de ação para abrir modais de exportação, acompanhamento e registro de ações."}
                {activeDemo === "responsive" &&
                  "O layout se adapta automaticamente a diferentes tamanhos de tela mantendo a usabilidade."}
              </p>
            </div>
          </div>

          <FeaturesSection
            backgroundImage={null}
            isTransparentMode={false}
            setShowHeroSection={() => {}}
          />
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de estados de carregamento
export const LoadingStates = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState("zones");

    const simulateLoading = (type) => {
      setLoadingType(type);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Controles de Loading */}
          <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Simular Carregamento:
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => simulateLoading("zones")}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md text-xs transition-colors"
              >
                Carregar Zonas
              </button>
              <button
                onClick={() => simulateLoading("data")}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md text-xs transition-colors"
              >
                Carregar Dados
              </button>
              <button
                onClick={() => simulateLoading("export")}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-md text-xs transition-colors"
              >
                Exportar Relatório
              </button>
            </div>

            {isLoading && (
              <div className="mt-4 pt-3 border-t border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-300">
                    Carregando {loadingType}...
                  </span>
                </div>
              </div>
            )}
          </div>

          <FeaturesSection
            backgroundImage={null}
            isTransparentMode={false}
            setShowHeroSection={() => {}}
          />
        </div>
      </BrowserRouter>
    );
  },
};

// Demonstração de dados dinâmicos
export const DynamicDataDemo = {
  render: () => {
    const [dataSet, setDataSet] = useState("default");

    const dataSets = {
      default: "Dados Padrão (Santa Cruz do Sul)",
      minimal: "Dados Mínimos (Poucas Zonas)",
      extensive: "Dados Extensivos (Muitas Zonas)",
      empty: "Sem Dados (Estado Vazio)",
    };

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Seletor de Dataset */}
          <div className="fixed top-4 left-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Conjunto de Dados:
            </h4>
            <select
              value={dataSet}
              onChange={(e) => setDataSet(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-xs"
            >
              {Object.entries(dataSets).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <div className="mt-4 pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                {dataSet === "default" &&
                  "Dados completos com todas as funcionalidades ativas."}
                {dataSet === "minimal" &&
                  "Conjunto reduzido para testar layouts com poucos dados."}
                {dataSet === "extensive" &&
                  "Muitos dados para testar performance e scrolling."}
                {dataSet === "empty" &&
                  "Estado vazio para testar mensagens de fallback."}
              </p>
            </div>
          </div>

          <FeaturesSection
            backgroundImage={null}
            isTransparentMode={false}
            setShowHeroSection={() => {}}
          />
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
    const [reducedMotion, setReducedMotion] = useState(false);

    return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
          {/* Controles de Acessibilidade */}
          <div className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 text-sm">
              Acessibilidade:
            </h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={focusVisible}
                  onChange={(e) => setFocusVisible(e.target.checked)}
                  className="rounded"
                />
                Mostrar Focus
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded"
                />
                Alto Contraste
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded"
                />
                Reduzir Animações
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400 mb-2">
                Navegação por Teclado:
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Tab: Navegar elementos</li>
                <li>• Enter/Space: Ativar botões</li>
                <li>• Esc: Fechar modais</li>
                <li>• Arrow Keys: Navegar cards</li>
              </ul>
            </div>
          </div>

          {/* Estilos de Acessibilidade */}
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
              .bg-emerald-500\/20,
              .bg-emerald-500\/30 {
                background-color: rgba(0, 255, 0, 0.3) !important;
              }
              .border-emerald-400\/30,
              .border-emerald-400\/50 {
                border-color: #00ff00 !important;
              }
            `
              : ""}
            
            ${reducedMotion
              ? `
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            `
              : ""}
          `}</style>

          <FeaturesSection
            backgroundImage={null}
            isTransparentMode={false}
            setShowHeroSection={() => {}}
          />
        </div>
      </BrowserRouter>
    );
  },
};
