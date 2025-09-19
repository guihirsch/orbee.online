import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

export default {
  title: "Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: { type: "color" },
      description: "Cor de fundo do componente",
    },
    textColor: {
      control: { type: "color" },
      description: "Cor do texto",
    },
    variant: {
      control: { type: "radio" },
      options: ["default", "transparent", "solid"],
      description: "Variação do header",
    },
    showLogo: {
      control: { type: "boolean" },
      description: "Mostrar logo",
    },
    isFixed: {
      control: { type: "boolean" },
      description: "Header fixo no topo",
    },
  },
};

export const Default = {
  render: () => <Header />,
};

export const WithContent = {
  render: () => (
    <>
      <Header />
      <div className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <section id="features" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Funcionalidades
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Monitoramento NDVI
                </h3>
                <p className="text-gray-200">
                  Acompanhe a saúde da vegetação em tempo real através de dados
                  satelitais.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Comunidade Ativa
                </h3>
                <p className="text-gray-200">
                  Conecte-se com outros guardiões ambientais e compartilhe
                  experiências.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Alertas Inteligentes
                </h3>
                <p className="text-gray-200">
                  Receba notificações sobre mudanças importantes na sua região.
                </p>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Como Funciona
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Escolha sua Região
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Selecione a área que deseja monitorar
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Monitore os Dados
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Acompanhe métricas em tempo real
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Valide Localmente
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Contribua com observações da comunidade
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Aja Localmente
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Implemente ações de preservação
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  O que é NDVI?
                </h3>
                <p className="text-gray-200">
                  NDVI (Normalized Difference Vegetation Index) é um índice que
                  mede a saúde da vegetação através de dados satelitais,
                  indicando a densidade e vitalidade das plantas.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Como posso contribuir?
                </h3>
                <p className="text-gray-200">
                  Você pode validar dados através de observações locais,
                  compartilhar fotos e participar de ações comunitárias de
                  preservação ambiental.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  ),
};

export const MobileView = {
  render: () => <Header />,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView = {
  render: () => <Header />,
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// Demonstração da navegação suave
export const NavigationDemo = {
  render: () => (
    <>
      <Header />
      <div className="px-6 py-12 space-y-16">
        <section
          id="features"
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Seção Funcionalidades
            </h2>
            <p className="text-xl text-gray-200">
              Esta seção é acessível através do menu "Início" no header.
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-200">
              Esta seção é acessível através do menu "Plataforma" no header.
            </p>
          </div>
        </section>

        <section
          id="faq"
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">FAQ</h2>
            <p className="text-xl text-gray-200">
              Esta seção é acessível através do menu "FAQ" no header.
            </p>
          </div>
        </section>
      </div>
    </>
  ),
};
