import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Header from "./Header";
import Footer from "./Footer";

export default {
  title: "Layout/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const Default = {
  render: () => (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Layout Básico</h1>
          <p className="text-xl text-gray-200">
            Este é o layout base da aplicação OrBee com gradiente de fundo.
          </p>
        </div>
      </div>
    </Layout>
  ),
};

export const WithHeaderAndFooter = {
  render: () => (
    <Layout>
      <Header />
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">OrBee Platform</h1>
          <p className="text-xl text-gray-200 mb-8">
            Inteligência coletiva para um futuro sustentável. Conectamos
            satélites, comunidades e governos para ações locais com impacto
            global.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                🛰️ Dados Satelitais
              </h3>
              <p className="text-gray-200">
                Monitoramento em tempo real através de imagens de satélite e
                índices NDVI.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">👥 Comunidade</h3>
              <p className="text-gray-200">
                Validação local e engajamento comunitário para ações ambientais.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📊 Insights</h3>
              <p className="text-gray-200">
                Análises inteligentes e recomendações personalizadas para sua
                região.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  ),
};

export const DashboardLayout = {
  render: () => (
    <Layout>
      <Header />
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-200">
              Acompanhe os dados ambientais da sua região em tempo real.
            </p>
          </div>

          {/* Simulação de cards do dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">NDVI Médio</h3>
                <span className="text-2xl">🌱</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                0.75
              </div>
              <p className="text-sm text-gray-300">+5% vs mês anterior</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Área Monitorada
                </h3>
                <span className="text-2xl">📍</span>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                2.5 km²
              </div>
              <p className="text-sm text-gray-300">Região selecionada</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Validações</h3>
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">12</div>
              <p className="text-sm text-gray-300">Este mês</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pontuação</h3>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">850</div>
              <p className="text-sm text-gray-300">Guardião Ambiental</p>
            </div>
          </div>

          {/* Simulação de gráfico */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Evolução NDVI - Últimos 6 Meses
            </h3>
            <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
              <p className="text-gray-300">
                Gráfico de linha NDVI seria renderizado aqui
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  ),
};

export const CommunityLayout = {
  render: () => (
    <Layout>
      <Header />
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
            <p className="text-gray-200">
              Conecte-se com outros guardiões ambientais e compartilhe suas
              observações.
            </p>
          </div>

          {/* Simulação de posts da comunidade */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Post 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Maria Silva</h4>
                    <p className="text-gray-300 text-sm">
                      Guardiã Ambiental • 2h atrás
                    </p>
                  </div>
                </div>
                <p className="text-gray-200 mb-4">
                  Observei uma melhora significativa na vegetação ciliar do
                  córrego próximo à minha casa. O NDVI realmente reflete a
                  realidade local! 🌱
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <button className="hover:text-white transition-colors">
                    👍 15 curtidas
                  </button>
                  <button className="hover:text-white transition-colors">
                    💬 3 comentários
                  </button>
                  <button className="hover:text-white transition-colors">
                    📤 Compartilhar
                  </button>
                </div>
              </div>

              {/* Post 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">J</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">João Santos</h4>
                    <p className="text-gray-300 text-sm">
                      Pesquisador • 5h atrás
                    </p>
                  </div>
                </div>
                <p className="text-gray-200 mb-4">
                  Compartilhando dados interessantes sobre a correlação entre
                  chuvas e índices NDVI na região metropolitana. Os resultados
                  são promissores! 📊
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <button className="hover:text-white transition-colors">
                    👍 28 curtidas
                  </button>
                  <button className="hover:text-white transition-colors">
                    💬 7 comentários
                  </button>
                  <button className="hover:text-white transition-colors">
                    📤 Compartilhar
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ranking Mensal
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">1. Ana Costa</span>
                    <span className="text-emerald-400 font-bold">
                      1,250 pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">2. Carlos Lima</span>
                    <span className="text-emerald-400 font-bold">
                      1,180 pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200">3. Maria Silva</span>
                    <span className="text-emerald-400 font-bold">950 pts</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Estatísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-200">Membros ativos</span>
                    <span className="text-white font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Validações hoje</span>
                    <span className="text-white font-bold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Áreas monitoradas</span>
                    <span className="text-white font-bold">156</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  ),
};

export const MobileLayout = {
  render: () => (
    <Layout>
      <Header />
      <div className="px-4 py-6">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Layout Mobile</h1>
          <p className="text-gray-200 mb-6">
            O layout se adapta automaticamente para dispositivos móveis.
          </p>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Card Mobile 1</h3>
              <p className="text-gray-200 text-sm">
                Conteúdo otimizado para telas menores.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Card Mobile 2</h3>
              <p className="text-gray-200 text-sm">
                Interface responsiva e touch-friendly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
