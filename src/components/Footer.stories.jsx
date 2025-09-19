import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

export default {
  title: "Layout/Footer",
  component: Footer,
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
    showSocialLinks: {
      control: { type: "boolean" },
      description: "Mostrar links sociais",
    },
    showNewsletter: {
      control: { type: "boolean" },
      description: "Mostrar seção de newsletter",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "minimal", "extended"],
      description: "Variação do footer",
    },
  },
};

export const Default = {
  render: () => <Footer />,
};

export const WithPageContent = {
  render: () => (
    <>
      {/* Simula conteúdo da página */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Conteúdo da Página</h1>
          <p className="text-xl text-gray-300 mb-8">
            Este é um exemplo de como o footer aparece no final de uma página
            com conteúdo.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Funcionalidade 1</h3>
              <p className="text-gray-300">
                Descrição da primeira funcionalidade da plataforma OrBee.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Funcionalidade 2</h3>
              <p className="text-gray-300">
                Descrição da segunda funcionalidade da plataforma OrBee.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Funcionalidade 3</h3>
              <p className="text-gray-300">
                Descrição da terceira funcionalidade da plataforma OrBee.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ),
};

export const MobileView = {
  render: () => <Footer />,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const TabletView = {
  render: () => <Footer />,
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// Demonstração das seções do footer
export const SectionsShowcase = {
  render: () => (
    <div className="space-y-8">
      {/* Cabeçalho explicativo */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-white mb-4">Seções do Footer</h2>
        <p className="text-xl text-gray-300">
          O footer contém navegação, recursos, informações legais e newsletter.
        </p>
      </div>

      {/* Footer */}
      <Footer />

      {/* Explicação das funcionalidades */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">
            Funcionalidades do Footer
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-900/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                📧 Newsletter
              </h4>
              <p className="text-gray-300">
                Permite que usuários se inscrevam para receber atualizações
                sobre a plataforma.
              </p>
            </div>
            <div className="bg-emerald-900/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                🔗 Links Sociais
              </h4>
              <p className="text-gray-300">
                Conecta usuários às redes sociais oficiais do OrBee com efeitos
                hover interativos.
              </p>
            </div>
            <div className="bg-emerald-900/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                📱 Design Responsivo
              </h4>
              <p className="text-gray-300">
                Adapta-se automaticamente a diferentes tamanhos de tela mantendo
                a usabilidade.
              </p>
            </div>
            <div className="bg-emerald-900/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                ⚖️ Informações Legais
              </h4>
              <p className="text-gray-300">
                Inclui links para políticas de privacidade, termos de uso e
                conformidade LGPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Demonstração da animação de scroll
export const ScrollAnimation = {
  render: () => (
    <div className="space-y-16">
      {/* Conteúdo para demonstrar scroll */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Role para baixo</h2>
          <p className="text-xl text-gray-300 mb-8">
            O footer possui animação de fade-in quando entra na viewport.
          </p>
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 mx-auto text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Continue rolando</h2>
          <p className="text-lg text-gray-300">
            O footer aparecerá com animação suave quando você chegar ao final.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  ),
};

// Demonstração dos estados interativos
export const InteractiveStates = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Estados Interativos
        </h2>
        <p className="text-xl text-gray-300">
          Passe o mouse sobre os links e botões para ver os efeitos de hover.
        </p>
      </div>

      <Footer />

      <div className="px-6 py-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Efeitos Interativos
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <strong className="text-emerald-400">Links de Navegação:</strong>
              <br />
              Hover com seta e translação
            </div>
            <div>
              <strong className="text-emerald-400">Redes Sociais:</strong>
              <br />
              Escala e mudança de cor
            </div>
            <div>
              <strong className="text-emerald-400">Botão Newsletter:</strong>
              <br />
              Gradiente e sombra
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
