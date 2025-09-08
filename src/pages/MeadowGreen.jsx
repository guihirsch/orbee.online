import { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Users,
  Leaf,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  Globe,
  Heart,
  Eye,
  Calendar,
  Info,
  Home,
  Map,
  Bookmark,
  Building,
  LifeBuoy,
  MessageSquare,
} from "lucide-react";
import NDVIMap from "../components/NDVIMap";
import NDVIChart from "../components/NDVIChart";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const MeadowGreen = () => {
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Santa Cruz do Sul, RS",
    coordinates: "-29.7175, -52.4264",
    latitude: -29.7175,
    longitude: -52.4264,
  });
  // novo: período selecionado (compartilhado entre header e painel direito)
  const [period, setPeriod] = useState("30d");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedSection, setSelectedSection] = useState("caracteristicas");
  const [selectedSubSection, setSelectedSubSection] = useState("inicio");

  useEffect(() => {
    setSidebarExpanded(false);
  }, [selectedSection]);

  // Dados mockados inspirados no layout Restor
  const communityStats = {
    guardians: 31611,
    protectedAreas: 226127,
    organizations: 5602,
    totalArea: "45.2 km²",
    ndviCurrent: 0.68,
    healthStatus: "Excelente",
    lastUpdate: "2024-01-15 14:30",
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      name: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      coordinates: `${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}`,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  return (
    <div className="flex h-screen bg-[#184E77]">
      {/* Menu Lateral Esquerdo - Compacto */}
      <div
        className={`flex w-20 flex-col items-center space-y-6 bg-[#184E77] py-4 ${
          sidebarExpanded ? "w-[240px]" : "w-[70px]"
        }`}
      >
        {/* Menu Toggle */}
        <div
          className={`flex w-[214px] items-center ${
            sidebarExpanded ? "justify-start" : "justify-center "
          }`}
        >
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="rounded-lg bg-[#1E6091] p-3 transition-colors hover:bg-[#1A759F]"
          >
            <div className="space-y-1">
              <div className="h-0.5 w-5 bg-white"></div>
              <div className="h-0.5 w-5 bg-white"></div>
              <div className="h-0.5 w-5 bg-white"></div>
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => {
              setSelectedSubSection("caracteristicas");
            }}
            className={`group rounded-lg p-3 transition-colors flex ${
              selectedSubSection === "caracteristicas"
                ? "bg-[#1A759F]"
                : "bg-[#1E6091] hover:bg-[#1A759F]"
            } ${sidebarExpanded ? "w-[220px]" : "w-[50px]"}`}
            title="Características da região"
          >
            <Globe className="h-6 w-6 text-white" />
            {sidebarExpanded && (
              <span className="ml-2 text-white">Características</span>
            )}
          </button>

          <button
            onClick={() => {
              setSelectedSubSection("saude");
            }}
            className={`group rounded-lg p-3 transition-colors flex ${
              selectedSubSection === "saude"
                ? "bg-[#1A759F]"
                : "bg-[#1E6091] hover:bg-[#1A759F]"
            } ${sidebarExpanded ? "w-[220px]" : "w-[50px]"}`}
            title="Saúde da mata ciliar"
          >
            <Leaf className="h-6 w-6 text-white" />
            {sidebarExpanded && (
              <span className="ml-2 text-white">Saúde da Mata Ciliar</span>
            )}
          </button>

          <button
            onClick={() => {
              setSelectedSubSection("acoes");
            }}
            className={`group rounded-lg p-3 transition-colors flex ${
              selectedSubSection === "acoes"
                ? "bg-[#1A759F]"
                : "bg-[#1E6091] hover:bg-[#1A759F]"
            } ${sidebarExpanded ? "w-[220px]" : "w-[50px]"}`}
            title="Ações necessárias"
          >
            <Target className="h-6 w-6 text-white" />
            {sidebarExpanded && <span className="ml-2 text-white">Ações</span>}
          </button>
        </nav>
      </div>

      {/* Seção Central - Detalhes */}
      <div className="h-full flex-1">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel className="flex h-full flex-col bg-gray-50">
            {/* Header da Seção Central */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-light text-gray-900">
                    Monitoramento em Tempo Real
                  </h2>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Dados atualizados a cada 15 minutos
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="30d">30 dias</option>
                    <option value="90d">3 meses</option>
                    <option value="1y">1 ano</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conteúdo da Seção Central */}
            <div className="flex-1 overflow-y-auto p-8">
              {selectedSubSection === "caracteristicas" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Card NDVI Atual */}
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="rounded-xl bg-emerald-100 p-3">
                          <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Ativo
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-4xl font-light text-gray-900">
                          {communityStats.ndviCurrent}
                        </div>
                        <div className="mt-1 text-sm font-medium text-gray-600">
                          Índice de Vegetação
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-emerald-600">↗ +8.2%</span>
                        <span className="ml-2 text-gray-500">
                          vs mês anterior
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Engajamento */}
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="rounded-xl bg-blue-100 p-3">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          3 resolvidos
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-4xl font-light text-gray-900">
                          7
                        </div>
                        <div className="mt-1 text-sm font-medium text-gray-600">
                          Observações Comunitárias
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-blue-600">42% resolvidas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSubSection === "saude" && (
                <div className="space-y-6">
                  <div className="text-gray-900">
                    <h3 className="mb-4 text-2xl font-semibold">
                      Saúde da Mata Ciliar
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Análise detalhada da condição da vegetação ripária.
                    </p>

                    {/* Conteúdo adicional para testar scroll */}
                    {Array.from({ length: 15 }, (_, i) => (
                      <div
                        key={i}
                        className="mb-4 rounded-lg bg-white p-6 shadow-sm"
                      >
                        <h4 className="mb-2 font-medium text-gray-900">
                          Indicador {i + 1}
                        </h4>
                        <p className="text-gray-600">
                          Descrição detalhada do indicador de saúde da mata
                          ciliar número {i + 1}.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubSection === "acoes" && (
                <div className="space-y-6">
                  <div className="text-gray-900">
                    <h3 className="mb-4 text-2xl font-semibold">
                      Ações Necessárias
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Recomendações para preservação e recuperação.
                    </p>

                    {/* Conteúdo adicional para testar scroll */}
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className="mb-4 rounded-lg bg-white p-6 shadow-sm"
                      >
                        <h4 className="mb-2 font-medium text-gray-900">
                          Ação {i + 1}
                        </h4>
                        <p className="text-gray-600">
                          Descrição da ação recomendada número {i + 1} para
                          melhoria da mata ciliar.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubSection === "comunidade" && (
                <div className="space-y-6">
                  <div className="text-gray-900">
                    <h3 className="mb-4 text-2xl font-semibold">Comunidade</h3>
                    <p className="mb-6 text-gray-600">
                      Engajamento e participação da comunidade local.
                    </p>

                    {/* Conteúdo adicional para testar scroll */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className="mb-4 rounded-lg bg-white p-6 shadow-sm"
                      >
                        <h4 className="mb-2 font-medium text-gray-900">
                          Participante {i + 1}
                        </h4>
                        <p className="text-gray-600">
                          Informações sobre a participação da comunidade número{" "}
                          {i + 1}.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="flex w-2 cursor-ew-resize items-center justify-center bg-gray-200 transition-colors duration-200 hover:bg-gray-300">
            <div className="h-8 w-1 rounded-full bg-gray-400"></div>
          </PanelResizeHandle>

          {/* Seção Direita - Mapa */}
          <Panel
            defaultSize={30}
            minSize={20}
            className="border-l border-gray-100 bg-white"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-full flex-col">
                {/* Header do Mapa */}
                <div className="border-b border-gray-100 bg-white p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mapa NDVI
                  </h3>
                </div>

                {/* Mapa */}
                <div className="relative flex-1">
                  <NDVIMap
                    latitude={selectedLocation.latitude}
                    longitude={selectedLocation.longitude}
                    onLocationSelect={handleLocationSelect}
                    showControls={false}
                    className="h-full w-full"
                  />
                </div>

                {/* Legenda do Mapa */}
                <div className="border-t border-gray-100 bg-white p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">NDVI</span>
                    <div className="flex space-x-2">
                      <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                      <span className="h-2 w-2 rounded-full bg-green-400"></span>
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default MeadowGreen;
