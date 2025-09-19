import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./AppSidebar";

export default {
  title: "Layout/AppSidebar",
  component: AppSidebar,
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

// Template base para as stories
const Template = ({ defaultOpen = true, selectedSection = "inicio" }) => {
  const [selectedSubSection, setSelectedSubSection] = useState(selectedSection);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen">
        <AppSidebar
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
        />
        <div className="flex-1 p-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">
              Seção: {selectedSubSection}
            </h1>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Conteúdo da Seção</h2>
              <p className="text-gray-200 mb-4">
                Esta é a área de conteúdo principal que muda baseada na seleção
                do sidebar.
              </p>

              {selectedSubSection === "inicio" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Dashboard Pessoal
                  </h3>
                  <p className="text-gray-300">
                    Conquistas, pesquisas e monitoramento da sua região.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-900/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Pontuação Total</h4>
                      <p className="text-2xl font-bold text-emerald-400">
                        1,250
                      </p>
                    </div>
                    <div className="bg-emerald-900/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Validações</h4>
                      <p className="text-2xl font-bold text-emerald-400">23</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedSubSection === "caracteristicas" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Características da Região
                  </h3>
                  <p className="text-gray-300">
                    Informações sobre localização e dados geográficos da área
                    monitorada.
                  </p>
                  <div className="bg-emerald-900/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Coordenadas</h4>
                    <p className="text-emerald-400">-23.5505° S, -46.6333° W</p>
                  </div>
                </div>
              )}

              {selectedSubSection === "saude" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Saúde da Mata Ciliar
                  </h3>
                  <p className="text-gray-300">
                    Estado atual da vegetação e índices de saúde ambiental.
                  </p>
                  <div className="bg-emerald-900/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">NDVI Atual</h4>
                    <p className="text-2xl font-bold text-emerald-400">0.75</p>
                    <p className="text-sm text-gray-400">Vegetação saudável</p>
                  </div>
                </div>
              )}

              {selectedSubSection === "acoes" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Ações Recomendadas
                  </h3>
                  <p className="text-gray-300">
                    Próximos passos e recomendações para preservação ambiental.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-emerald-900/30 rounded-lg p-3">
                      <p className="font-semibold">
                        • Monitorar área próxima ao córrego
                      </p>
                    </div>
                    <div className="bg-emerald-900/30 rounded-lg p-3">
                      <p className="font-semibold">
                        • Plantar mudas nativas na margem
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedSubSection === "comunidade" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Comunidade Local
                  </h3>
                  <p className="text-gray-300">
                    Conecte-se com outros guardiões ambientais da região.
                  </p>
                  <div className="bg-emerald-900/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Guardiões Ativos</h4>
                    <p className="text-2xl font-bold text-emerald-400">47</p>
                    <p className="text-sm text-gray-400">Na sua região</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export const Default = {
  render: () => <Template />,
};

export const Collapsed = {
  render: () => <Template defaultOpen={false} />,
};

export const WithDifferentSections = {
  render: () => {
    const [selectedSubSection, setSelectedSubSection] = useState("saude");

    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen">
          <AppSidebar
            selectedSubSection={selectedSubSection}
            setSelectedSubSection={setSelectedSubSection}
          />
          <div className="flex-1 p-6">
            <div className="text-white space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Navegação entre Seções
                </h1>
                <p className="text-gray-300">
                  Clique nos itens do sidebar para navegar entre as diferentes
                  seções.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    🏠 Início
                  </h3>
                  <p className="text-sm text-gray-300">
                    Dashboard pessoal com conquistas e monitoramento.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    🌍 Características
                  </h3>
                  <p className="text-sm text-gray-300">
                    Localização e dados da região monitorada.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    🌱 Situação
                  </h3>
                  <p className="text-sm text-gray-300">
                    Estado atual da vegetação e saúde ambiental.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    🎯 Ações
                  </h3>
                  <p className="text-sm text-gray-300">
                    Recomendações e próximos passos.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    👥 Comunidade
                  </h3>
                  <p className="text-sm text-gray-300">
                    Conecte-se com outros guardiões ambientais.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-900/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3">
                  Seção Atual: {selectedSubSection}
                </h2>
                <p className="text-gray-300">
                  O conteúdo desta área muda dinamicamente baseado na seleção do
                  sidebar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  },
};

export const MobileView = {
  render: () => <Template />,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView = {
  render: () => <Template />,
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// Demonstração das funcionalidades interativas
export const InteractiveDemo = {
  render: () => {
    const [selectedSubSection, setSelectedSubSection] = useState("inicio");

    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen">
          <AppSidebar
            selectedSubSection={selectedSubSection}
            setSelectedSubSection={setSelectedSubSection}
          />
          <div className="flex-1 p-6">
            <div className="text-white space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                  AppSidebar Interativo
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Explore as funcionalidades do sidebar da aplicação OrBee.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
                    Funcionalidades
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Navegação entre seções
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Modo colapsado/expandido
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Design responsivo
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Efeitos visuais com glassmorphism
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Tooltips informativos
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
                    Estado Atual
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Seção Ativa:</span>
                      <span className="text-white font-semibold capitalize">
                        {selectedSubSection}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total de Seções:</span>
                      <span className="text-white font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Modo:</span>
                      <span className="text-white font-semibold">
                        Expandido
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3">Instruções</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong className="text-emerald-400">Navegação:</strong>
                    <br />
                    Clique nos itens do menu para navegar
                  </div>
                  <div>
                    <strong className="text-emerald-400">Colapsar:</strong>
                    <br />
                    Use o botão de seta para colapsar/expandir
                  </div>
                  <div>
                    <strong className="text-emerald-400">Mobile:</strong>
                    <br />
                    Em dispositivos móveis, o sidebar se adapta automaticamente
                  </div>
                  <div>
                    <strong className="text-emerald-400">Tooltips:</strong>
                    <br />
                    Passe o mouse sobre os ícones no modo colapsado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  },
};
