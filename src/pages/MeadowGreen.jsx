import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Maximize,
  Minimize,
  Menu,
  X,
  Bell,
} from "lucide-react";
import NDVIMap from "../components/NDVIMap";
import NDVIChart from "../components/NDVIChart";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";

const MeadowGreen = () => {
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Santa Cruz do Sul, RS",
    coordinates: "-29.7175, -52.4264",
    latitude: -29.7175,
    longitude: -52.4264,
  });
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [selectedZoneActivity, setSelectedZoneActivity] = useState(null);
  // novo: período selecionado (compartilhado entre header e painel direito)
  const [period, setPeriod] = useState("30d");
  const [selectedSection, setSelectedSection] = useState("caracteristicas");
  const [selectedSubSection, setSelectedSubSection] = useState("inicio");
  const [fullscreenPanel, setFullscreenPanel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // "content" ou "map"

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  // Dados de atividades por zona
  const zoneActivities = {
    "zona-a": {
      reports: 3,
      tracking: 2,
      actions: 5,
    },
    "zona-b": {
      reports: 1,
      tracking: 1,
      actions: 2,
    },
    "zona-c": {
      reports: 4,
      tracking: 3,
      actions: 1,
    },
  };

  // Dados detalhados das atividades
  const activityDetails = {
    "zona-a": {
      reports: [
        {
          id: 1,
          title: "Relatório NDVI Janeiro",
          date: "15/01/2024",
          status: "Concluído",
        },
        {
          id: 2,
          title: "Análise de Degradação",
          date: "10/01/2024",
          status: "Concluído",
        },
        {
          id: 3,
          title: "Monitoramento Semanal",
          date: "08/01/2024",
          status: "Concluído",
        },
      ],
      tracking: [
        {
          id: 1,
          title: "Acompanhamento Mensal",
          frequency: "Mensal",
          nextDate: "15/02/2024",
        },
        {
          id: 2,
          title: "Alertas de Degradação",
          frequency: "Semanal",
          nextDate: "22/01/2024",
        },
      ],
      actions: [
        {
          id: 1,
          title: "Plantio de Mudas Nativas",
          date: "12/01/2024",
          type: "Reflorestamento",
        },
        {
          id: 2,
          title: "Remoção de Invasoras",
          date: "10/01/2024",
          type: "Manutenção",
        },
        {
          id: 3,
          title: "Irrigação de Emergência",
          date: "08/01/2024",
          type: "Manutenção",
        },
        {
          id: 4,
          title: "Parceria com ONG Local",
          date: "05/01/2024",
          type: "Parceria",
        },
        {
          id: 5,
          title: "Cerca de Proteção",
          date: "03/01/2024",
          type: "Manutenção",
        },
      ],
    },
    "zona-b": {
      reports: [
        {
          id: 1,
          title: "Relatório de Emergência",
          date: "14/01/2024",
          status: "Concluído",
        },
      ],
      tracking: [
        {
          id: 1,
          title: "Monitoramento Crítico",
          frequency: "Diário",
          nextDate: "16/01/2024",
        },
      ],
      actions: [
        {
          id: 1,
          title: "Ação de Emergência",
          date: "13/01/2024",
          type: "Reflorestamento",
        },
        {
          id: 2,
          title: "Contenção de Erosão",
          date: "11/01/2024",
          type: "Manutenção",
        },
      ],
    },
    "zona-c": {
      reports: [
        {
          id: 1,
          title: "Relatório Trimestral",
          date: "15/01/2024",
          status: "Concluído",
        },
        {
          id: 2,
          title: "Análise de Biodiversidade",
          date: "12/01/2024",
          status: "Concluído",
        },
        {
          id: 3,
          title: "Monitoramento de Fauna",
          date: "09/01/2024",
          status: "Concluído",
        },
        {
          id: 4,
          title: "Relatório de Qualidade",
          date: "06/01/2024",
          status: "Concluído",
        },
      ],
      tracking: [
        {
          id: 1,
          title: "Acompanhamento Trimestral",
          frequency: "Trimestral",
          nextDate: "15/04/2024",
        },
        {
          id: 2,
          title: "Monitoramento de Fauna",
          frequency: "Mensal",
          nextDate: "09/02/2024",
        },
        {
          id: 3,
          title: "Análise de Solo",
          frequency: "Semestral",
          nextDate: "15/07/2024",
        },
      ],
      actions: [
        {
          id: 1,
          title: "Enriquecimento Vegetal",
          date: "14/01/2024",
          type: "Reflorestamento",
        },
      ],
    },
  };

  // Função para abrir modal de atividades
  const handleActivityClick = (zoneId, activityType) => {
    setSelectedZoneActivity(zoneId);
    setSelectedActivityType(activityType);
    setShowActivityModal(true);
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

  // Funções para gerenciar seleção múltipla de zonas
  const handleZoneToggle = (zone, preventRecommendation = false) => {
    setSelectedZones((prev) => {
      const isSelected = prev.some((z) => z.id === zone.id);
      if (isSelected) {
        return prev.filter((z) => z.id !== zone.id);
      } else {
        return [...prev, zone];
      }
    });

    // Se preventRecommendation for true, não abre as recomendações
    if (preventRecommendation) {
      return;
    }
  };

  const handleSelectAllZones = () => {
    const allZones = [
      {
        id: "zona-a",
        name: "Zona Crítica A",
        coordinates: [-29.7175, -52.4264],
        area: "2.1 ha",
        ndvi: 0.32,
        degradation: "Severa",
        priority: "Urgente",
      },
      {
        id: "zona-b",
        name: "Zona Crítica B",
        coordinates: [-29.7185, -52.4274],
        area: "1.8 ha",
        ndvi: 0.28,
        degradation: "Severa",
        priority: "Urgente",
      },
      {
        id: "zona-c",
        name: "Zona Atenção C",
        coordinates: [-29.7195, -52.4284],
        area: "3.2 ha",
        ndvi: 0.45,
        degradation: "Moderada",
        priority: "Moderada",
      },
    ];
    setSelectedZones(selectedZones.length === allZones.length ? [] : allZones);
  };

  const clearSelectedZones = () => {
    setSelectedZones([]);
  };

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full overflow-hidden">
        {/* Mobile Navigation Tabs */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-400/30 bg-slate-900/95 backdrop-blur-xl">
            <div className="flex">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "content"
                    ? "text-emerald-400 bg-emerald-500/20"
                    : "text-slate-400 hover:text-emerald-300"
                }`}
              >
                <Info className="mr-2 h-4 w-4" />
                Detalhes
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "map"
                    ? "text-emerald-400 bg-emerald-500/20"
                    : "text-slate-400 hover:text-emerald-300"
                }`}
              >
                <Map className="mr-2 h-4 w-4" />
                Mapa
              </button>
            </div>
          </div>
        )}
        {/* Background with Noise Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-800">
          {/* Noise Texture Overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "256px 256px",
            }}
          />

          {/* Subtle Floating Orbs */}
          <div className="animate-blob absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"></div>
          <div className="animate-blob animation-delay-2000 bg-green-400/8 absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-3xl"></div>

          {/* Minimal Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Sidebar usando shadcn/ui */}
        <AppSidebar
          selectedSubSection={selectedSubSection}
          setSelectedSubSection={setSelectedSubSection}
        />

        <SidebarInset className="flex-1">
          {/* Seção Central - Detalhes */}
          <div className="h-full w-full">
            <PanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
              className="h-full w-full"
            >
              <Panel
                className={`relative z-40 flex h-full flex-col ${
                  isMobile ? "border-b" : "border-r"
                } border-emerald-400/30 bg-slate-900/70 backdrop-blur-xl ${
                  fullscreenPanel === "map" ? "hidden" : ""
                } ${isMobile && activeTab === "map" ? "hidden" : ""}`}
                defaultSize={
                  isMobile ? 60 : fullscreenPanel === "central" ? 100 : 70
                }
              >
                {/* Header da Seção Central */}
                <div className="border-b border-emerald-400/30 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-3 backdrop-blur-xl sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SidebarTrigger className="rounded-lg border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/30 md:hidden" />
                      <div className="flex items-center gap-4">
                        <h2 className="bg-gradient-to-r bg-clip-text text-xl font-light text-transparent text-white sm:text-2xl lg:text-3xl">
                          {selectedSubSection === "caracteristicas" &&
                            "Características da Região"}
                          {selectedSubSection === "saude" &&
                            "Saúde da Mata Ciliar"}
                          {selectedSubSection === "acoes" && "Plano de Ação"}
                        </h2>
                        {selectedSubSection === "acoes" && (
                          <div className="flex items-center gap-3">
                            {/* Dropdown de seleção inteligente */}
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-sm text-blue-300 hover:bg-blue-900/20"
                              >
                                <span className="badge badge-sm border-blue-500/30 bg-blue-500/20 text-blue-300">
                                  {selectedZones.length}
                                </span>
                                zonas
                                <svg
                                  className="ml-1 h-3 w-3"
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
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu z-[1] mt-1 w-56 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg"
                              >
                                <li>
                                  <button
                                    onClick={() =>
                                      setSelectedZones([
                                        "zona-a",
                                        "zona-b",
                                        "zona-c",
                                      ])
                                    }
                                    className="text-blue-300 hover:bg-blue-900/20"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Selecionar todas (3)
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setSelectedZones([])}
                                    className="text-red-300 hover:bg-red-900/20"
                                    disabled={selectedZones.length === 0}
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                    Limpar seleção
                                  </button>
                                </li>
                              </ul>
                            </div>

                            {/* Ações principais - sempre visíveis mas com estados diferentes */}
                            <div className="flex items-center gap-2">
                              <button
                                disabled={selectedZones.length === 0}
                                className={`btn btn-sm ${
                                  selectedZones.length > 0
                                    ? "btn-outline border-gray-500/30 text-gray-300 hover:border-gray-400 hover:bg-gray-900/20"
                                    : "btn-disabled text-gray-500"
                                }`}
                              >
                                <BarChart3 className="h-3 w-3" />
                                Relatório
                              </button>
                              <button
                                onClick={() => setShowTrackingModal(true)}
                                disabled={selectedZones.length === 0}
                                className={`btn btn-sm ${
                                  selectedZones.length > 0
                                    ? "btn-outline border-yellow-500/30 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-900/20"
                                    : "btn-disabled text-gray-500"
                                }`}
                              >
                                <Bell className="h-3 w-3" />
                                Acompanhar
                              </button>
                              <button
                                onClick={() => setShowActionModal(true)}
                                disabled={selectedZones.length === 0}
                                className={`btn btn-sm ${
                                  selectedZones.length > 0
                                    ? "btn-outline border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-purple-900/20"
                                    : "btn-disabled text-gray-500"
                                }`}
                              >
                                <Leaf className="h-3 w-3" />
                                Registrar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.button
                      onClick={() =>
                        setFullscreenPanel(
                          fullscreenPanel === "central" ? null : "central"
                        )
                      }
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(16, 185, 129, 0.3)",
                        borderColor: "rgba(52, 211, 153, 0.5)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-400"
                      title={
                        fullscreenPanel === "central"
                          ? "Sair do modo tela cheia"
                          : "Modo tela cheia"
                      }
                    >
                      <motion.div
                        animate={{
                          rotate: fullscreenPanel === "central" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {fullscreenPanel === "central" ? (
                          <Minimize className="h-4 w-4" />
                        ) : (
                          <Maximize className="h-4 w-4" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* Conteúdo da Seção Central */}
                <div
                  className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${
                    isMobile ? "pb-20" : ""
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {selectedSubSection === "caracteristicas" && (
                      <motion.div
                        key="caracteristicas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.1,
                              },
                            },
                          }}
                          className="grid gap-4 sm:gap-6" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}
                        >
                          {/* Card Localização e Bacia Hidrográfica */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            whileHover={{
                              y: -8,
                              scale: 1.02,
                              transition: { duration: 0.2 },
                            }}
                            className="group relative overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-emerald-400/40 hover:shadow-emerald-500/25 sm:rounded-2xl sm:p-6"
                          >
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter1)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 p-3 backdrop-blur-sm">
                                  <MapPin className="h-5 w-5 text-emerald-400" />
                                </div>
                              </div>
                              <h4 className="mb-3 text-base font-semibold text-white sm:text-lg">
                                Localização e Bacia
                              </h4>
                              <div className="space-y-2 text-xs sm:text-sm">
                                <p className="text-emerald-300">
                                  <span className="text-slate-300">
                                    Coordenadas:
                                  </span>{" "}
                                  {selectedLocation.coordinates}
                                </p>
                                <p className="text-emerald-300">
                                  <span className="text-slate-300">Bacia:</span>{" "}
                                  Rio Jacuí
                                </p>
                                <p className="text-emerald-300">
                                  <span className="text-slate-300">
                                    Sub-bacia:
                                  </span>{" "}
                                  Arroio Castelhano
                                </p>
                                <p className="text-emerald-300">
                                  <span className="text-slate-300">
                                    Altitude:
                                  </span>{" "}
                                  156m
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Card Uso e Ocupação do Solo */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            whileHover={{
                              y: -8,
                              scale: 1.02,
                              transition: { duration: 0.2 },
                            }}
                            className="group relative overflow-hidden rounded-xl border border-blue-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-blue-400/40 hover:shadow-blue-500/25 sm:rounded-2xl sm:p-6"
                          >
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter2)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-blue-400/30 bg-blue-500/20 p-3 backdrop-blur-sm">
                                  <Building className="h-5 w-5 text-blue-400" />
                                </div>
                              </div>
                              <h4 className="mb-3 text-base font-semibold text-white sm:text-lg">
                                Uso do Solo
                              </h4>
                              <div className="space-y-2 text-xs sm:text-sm">
                                <p className="text-blue-300">
                                  <span className="text-slate-300">
                                    Agrícola:
                                  </span>{" "}
                                  68%
                                </p>
                                <p className="text-blue-300">
                                  <span className="text-slate-300">
                                    Urbano:
                                  </span>{" "}
                                  22%
                                </p>
                                <p className="text-blue-300">
                                  <span className="text-slate-300">
                                    Industrial:
                                  </span>{" "}
                                  6%
                                </p>
                                <p className="text-blue-300">
                                  <span className="text-slate-300">
                                    Mata Ciliar:
                                  </span>{" "}
                                  4%
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Card Clima */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            whileHover={{
                              y: -8,
                              scale: 1.02,
                              transition: { duration: 0.2 },
                            }}
                            className="group relative overflow-hidden rounded-xl border border-purple-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-purple-400/40 hover:shadow-purple-500/25 sm:rounded-2xl sm:p-6"
                          >
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter3)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-purple-400/30 bg-purple-500/20 p-3 backdrop-blur-sm">
                                  <BarChart3 className="h-5 w-5 text-purple-400" />
                                </div>
                              </div>
                              <h4 className="mb-3 text-base font-semibold text-white sm:text-lg">
                                Clima
                              </h4>
                              <div className="space-y-2 text-xs sm:text-sm">
                                <p className="text-purple-300">
                                  <span className="text-slate-300">
                                    Precipitação:
                                  </span>{" "}
                                  1.687mm/ano
                                </p>
                                <p className="text-purple-300">
                                  <span className="text-slate-300">
                                    Temp. Média:
                                  </span>{" "}
                                  19.2°C
                                </p>
                                <p className="text-purple-300">
                                  <span className="text-slate-300">
                                    Umidade:
                                  </span>{" "}
                                  76%
                                </p>
                                <p className="text-purple-300">
                                  <span className="text-slate-300">Tipo:</span>{" "}
                                  Subtropical úmido
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Card Sazonalidade */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.95 },
                              visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            whileHover={{
                              y: -8,
                              scale: 1.02,
                              transition: { duration: 0.2 },
                            }}
                            className="group relative overflow-hidden rounded-xl border border-orange-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-orange-400/40 hover:shadow-orange-500/25 sm:rounded-2xl sm:p-6"
                          >
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter4'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter4)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-orange-400/30 bg-orange-500/20 p-3 backdrop-blur-sm">
                                  <Calendar className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="rounded-full border border-orange-400/30 bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300 backdrop-blur-sm">
                                  Verão
                                </span>
                              </div>
                              <h4 className="mb-3 text-base font-semibold text-white sm:text-lg">
                                Sazonalidade
                              </h4>
                              <div className="space-y-2 text-xs sm:text-sm">
                                <p className="text-orange-300">
                                  <span className="text-slate-300">
                                    Situação Atual:
                                  </span>{" "}
                                  Período seco
                                </p>
                                <p className="text-orange-300">
                                  <span className="text-slate-300">
                                    Tendência:
                                  </span>{" "}
                                  ↗ Melhoria esperada
                                </p>
                                <p className="text-orange-300">
                                  <span className="text-slate-300">
                                    Próx. Chuvas:
                                  </span>{" "}
                                  15-20 dias
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Cards de linha completa */}
                        <motion.div className="space-y-6">
                          {/* Card Fauna e Flora */}
                          <div className="group relative overflow-hidden rounded-xl border border-green-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-green-400/40 hover:shadow-green-500/25 sm:rounded-2xl sm:p-6">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter5'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter5)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                                    <Leaf className="h-5 w-5 text-green-400" />
                                  </div>
                                  <h4 className="text-base font-semibold text-white sm:text-lg">
                                    Fauna e Flora Nativa
                                  </h4>
                                </div>
                              </div>
                              <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
                                <div>
                                  <h5 className="mb-2 text-sm font-medium text-green-300 sm:text-base">
                                    Espécies-chave
                                  </h5>
                                  <ul className="space-y-1 text-xs text-slate-300 sm:text-sm">
                                    <li>• Ingá-feijão</li>
                                    <li>• Salgueiro-chorão</li>
                                    <li>• Capim-dos-pampas</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="mb-2 text-sm font-medium text-green-300 sm:text-base">
                                    Aves Aquáticas
                                  </h5>
                                  <ul className="space-y-1 text-xs text-slate-300 sm:text-sm">
                                    <li>• Bugio-ruivo</li>
                                    <li>• Lontra-neotropical</li>
                                    <li>• Araucária</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="mb-2 text-sm font-medium text-green-300 sm:text-base">
                                    Peixes Nativos
                                  </h5>
                                  <ul className="space-y-1 text-xs text-slate-300 sm:text-sm">
                                    <li>• Corredor Jacuí-Taquari</li>
                                    <li>• Fragmento urbano</li>
                                    <li>• Conexão rural</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Benchmarks Regionais */}
                          <motion.div className="group relative overflow-hidden rounded-2xl border border-teal-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-teal-400/40 hover:shadow-teal-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter6'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter6)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="rounded-xl border border-teal-400/30 bg-teal-500/20 p-3 backdrop-blur-sm">
                                    <BarChart3 className="h-5 w-5 text-teal-400" />
                                  </div>
                                  <h4 className="text-base font-semibold text-white sm:text-lg">
                                    Benchmarks Regionais
                                  </h4>
                                </div>
                              </div>
                              <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'}}>
                                <div className="text-center">
                                  <div className="mb-2 text-xl font-light text-white sm:text-2xl">
                                    0.68
                                  </div>
                                  <div className="text-xs text-teal-300 sm:text-sm">
                                    NDVI Local
                                  </div>
                                  <div className="text-xs text-slate-400 sm:text-sm">
                                    vs 0.72 regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-xl font-light text-white sm:text-2xl">
                                    4%
                                  </div>
                                  <div className="text-xs text-teal-300 sm:text-sm">
                                    Cobertura Ciliar
                                  </div>
                                  <div className="text-xs text-slate-400 sm:text-sm">
                                    vs 8% regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-xl font-light text-white sm:text-2xl">
                                    156m
                                  </div>
                                  <div className="text-xs text-teal-300 sm:text-sm">
                                    Altitude
                                  </div>
                                  <div className="text-xs text-slate-400 sm:text-sm">
                                    vs 180m regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-xl font-light text-white sm:text-2xl">
                                    68%
                                  </div>
                                  <div className="text-xs text-teal-300 sm:text-sm">
                                    Uso Agrícola
                                  </div>
                                  <div className="text-xs text-slate-400 sm:text-sm">
                                    vs 55% regional
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}

                    {selectedSubSection === "saude" && (
                      <motion.div
                        key="saude"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid gap-6" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
                          {/* Card Índices de Vegetação */}
                          <div className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-emerald-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter7'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter7)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 p-3 backdrop-blur-sm">
                                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                                </div>
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                                  Atual
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Índices de Vegetação
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-300 sm:text-sm">
                                    NDVI
                                  </span>
                                  <span className="font-medium text-emerald-300">
                                    0.68
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    EVI
                                  </span>
                                  <span className="font-medium text-emerald-300">
                                    0.42
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    NDWI
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    0.15
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-emerald-400/20 pt-3">
                                  <p className="text-xs text-slate-400 sm:text-sm">
                                    Tendência: ↗ Melhoria gradual
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Cobertura Vegetal */}
                          <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-400/40 hover:shadow-green-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter8'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter8)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                                  <Leaf className="h-5 w-5 text-green-400" />
                                </div>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Cobertura Vegetal
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Floresta
                                  </span>
                                  <span className="font-medium text-green-300">
                                    12%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Pasto
                                  </span>
                                  <span className="font-medium text-yellow-300">
                                    58%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Agricultura
                                  </span>
                                  <span className="font-medium text-orange-300">
                                    26%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Solo Exposto
                                  </span>
                                  <span className="font-medium text-red-300">
                                    4%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Qualidade dos Dados */}
                          <div className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter9'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter9)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-blue-400/30 bg-blue-500/20 p-3 backdrop-blur-sm">
                                  <BarChart3 className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                                  Alta
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Qualidade dos Dados
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Resolução
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    10m/pixel
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Atualização
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    5 dias
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Confiabilidade
                                  </span>
                                  <span className="font-medium text-green-300">
                                    94%
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-blue-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    Fonte: Sentinel-2 ESA
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Áreas Degradadas */}
                          <div className="group relative overflow-hidden rounded-2xl border border-red-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-red-400/40 hover:shadow-red-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter10'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter10)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-red-400/30 bg-red-500/20 p-3 backdrop-blur-sm">
                                  <Target className="h-5 w-5 text-red-400" />
                                </div>
                                <span className="rounded-full border border-orange-400/30 bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300 backdrop-blur-sm">
                                  Atenção
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Áreas Degradadas
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Fragmentação
                                  </span>
                                  <span className="font-medium text-red-300">
                                    Alto
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Risco Erosão
                                  </span>
                                  <span className="font-medium text-orange-300">
                                    Médio
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Assoreamento
                                  </span>
                                  <span className="font-medium text-yellow-300">
                                    Baixo
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-red-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    Área crítica: 2.3 km²
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card de linha completa - Hotspots Críticos */}
                        <div className="group relative overflow-hidden rounded-2xl border border-purple-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-purple-400/40 hover:shadow-purple-500/25">
                          <div
                            className="absolute inset-0 opacity-15 mix-blend-overlay"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter11'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter11)'/%3E%3C/svg%3E")`,
                              backgroundSize: "256px 256px",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="relative z-10">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="rounded-xl border border-purple-400/30 bg-purple-500/20 p-3 backdrop-blur-sm">
                                  <Map className="h-5 w-5 text-purple-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-white">
                                  Hotspots Críticos
                                </h4>
                              </div>
                              <span className="rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 backdrop-blur-sm">
                                5 áreas
                              </span>
                            </div>
                            <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'}}>
                              <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-center">
                                <div className="mb-2 text-lg font-light text-white">
                                  Zona A
                                </div>
                                <div className="text-xs text-red-300">
                                  Crítico
                                </div>
                                <div className="text-xs text-slate-400">
                                  NDVI: 0.12
                                </div>
                              </div>
                              <div className="rounded-lg border border-orange-400/20 bg-orange-500/10 p-3 text-center">
                                <div className="mb-2 text-lg font-light text-white">
                                  Zona B
                                </div>
                                <div className="text-xs text-orange-300">
                                  Alto
                                </div>
                                <div className="text-xs text-slate-400">
                                  NDVI: 0.28
                                </div>
                              </div>
                              <div className="rounded-lg border border-yellow-400/20 bg-yellow-500/10 p-3 text-center">
                                <div className="mb-2 text-lg font-light text-white">
                                  Zona C
                                </div>
                                <div className="text-xs text-yellow-300">
                                  Médio
                                </div>
                                <div className="text-xs text-slate-400">
                                  NDVI: 0.45
                                </div>
                              </div>
                              <div className="rounded-lg border border-orange-400/20 bg-orange-500/10 p-3 text-center">
                                <div className="mb-2 text-lg font-light text-white">
                                  Zona D
                                </div>
                                <div className="text-xs text-orange-300">
                                  Alto
                                </div>
                                <div className="text-xs text-slate-400">
                                  NDVI: 0.31
                                </div>
                              </div>
                              <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-center">
                                <div className="mb-2 text-lg font-light text-white">
                                  Zona E
                                </div>
                                <div className="text-xs text-red-300">
                                  Crítico
                                </div>
                                <div className="text-xs text-slate-400">
                                  NDVI: 0.08
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 border-t border-purple-400/20 pt-4">
                              <p className="text-sm text-purple-300">
                                Prioridade de intervenção baseada em análise
                                multitemporal e risco ambiental
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {selectedSubSection === "acoes" && (
                      <motion.div
                        key="acoes"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex h-full flex-col"
                      >
                        {/* Layout de 2 Colunas */}
                        <div
                          className="grid min-h-0 flex-1 gap-6"
                          style={{
                            gridTemplateColumns: selectedZone
                              ? 'repeat(auto-fit, minmax(500px, 1fr))'
                              : '1fr'
                          }}
                        >
                          {/* Coluna Esquerda - Áreas Prioritárias */}
                          <div className="flex flex-col">
                            <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
                              <Target className="mr-2 h-5 w-5 text-red-400" />
                              Áreas Prioritárias
                            </h3>
                            <div className="flex-1 overflow-y-auto">
                              <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'}}>
                              {/* Zona Crítica A */}
                              <div
                                className={`group relative overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out cursor-pointer ${
                                  selectedZone?.id === "zona-a"
                                    ? "border-red-400/60 bg-red-900/20 shadow-red-500/40"
                                    : selectedZones.some(
                                        (z) => z.id === "zona-a"
                                      )
                                    ? "border-blue-400/60 bg-blue-900/20 shadow-blue-500/40 ring-2 ring-blue-400/30"
                                    : "border-red-400/20 bg-slate-800/60 hover:border-red-400/40 hover:shadow-red-500/25"
                                }`}
                                onClick={(e) => {
                                  // Verifica se o clique foi no checkbox ou em seus elementos filhos
                                  if (
                                    e.target.type === "checkbox" ||
                                    e.target.closest('input[type="checkbox"]')
                                  ) {
                                    return;
                                  }

                                  const zoneData = {
                                    id: "zona-a",
                                    name: "Zona Crítica A",
                                    coordinates: {
                                      lat: -29.7185,
                                      lng: -52.4274,
                                    },
                                    area: "2.1 ha",
                                    ndvi: "0.32",
                                    degradation: "Severa",
                                    priority: "Urgente",
                                    recommendations: {
                                      species: [
                                        {
                                          name: "Salgueiro",
                                          type: "Ripária",
                                          reason: "Resistente à erosão",
                                        },
                                        {
                                          name: "Timbaúva",
                                          type: "Pioneira",
                                          reason: "Crescimento rápido",
                                        },
                                        {
                                          name: "Açoita-cavalo",
                                          type: "Secundária",
                                          reason: "Estabilização do solo",
                                        },
                                      ],
                                      actions: [
                                        "Contenção de erosão urgente",
                                        "Plantio em curvas de nível",
                                        "Monitoramento mensal",
                                      ],
                                      timeline: "6 meses para estabilização",
                                    },
                                  };
                                  setSelectedZone(
                                    selectedZone?.id === "zona-a"
                                      ? null
                                      : zoneData
                                  );
                                  if (selectedZone?.id !== "zona-a") {
                                    setSelectedLocation({
                                      name: zoneData.name,
                                      coordinates: `${zoneData.coordinates.lat}, ${zoneData.coordinates.lng}`,
                                      latitude: zoneData.coordinates.lat,
                                      longitude: zoneData.coordinates.lng,
                                    });
                                  }
                                }}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-800"
                                      checked={selectedZones.some(
                                        (z) => z.id === "zona-a"
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleZoneToggle(
                                          {
                                            id: "zona-a",
                                            name: "Zona Crítica A",
                                            coordinates: [-29.7175, -52.4264],
                                            area: "2.1 ha",
                                            ndvi: 0.32,
                                            degradation: "Severa",
                                            priority: "Urgente",
                                          },
                                          true
                                        );
                                      }}
                                    />
                                    <span className="text-sm font-medium text-white">
                                      Zona Crítica A
                                    </span>
                                  </div>
                                  <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300">
                                    Urgente
                                  </span>
                                </div>
                                <div className="space-y-2 text-xs text-slate-300">
                                  <p>
                                    Área:{" "}
                                    <span className="font-medium text-red-300">
                                      2.1 ha
                                    </span>
                                  </p>
                                  <p>
                                    NDVI:{" "}
                                    <span className="font-medium text-red-300">
                                      0.32
                                    </span>
                                  </p>
                                  <p>
                                    Degradação:{" "}
                                    <span className="font-medium text-red-300">
                                      Severa
                                    </span>
                                  </p>
                                  <p>
                                    Coordenadas:{" "}
                                    <span className="font-mono text-slate-400">
                                      -29.7185, -52.4274
                                    </span>
                                  </p>
                                </div>

                                {/* Contadores de Atividades */}
                                <div className="mt-3 border-t border-red-400/20 pt-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <BarChart3 className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-a"].reports}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Bell className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-a"].tracking}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Leaf className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-a"].actions}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    Relatórios • Acompanhamentos • Ações
                                  </div>
                                </div>
                                {selectedZone?.id === "zona-a" && (
                                  <div className="mt-3 border-t border-red-400/30 pt-3">
                                    <p className="text-xs font-medium text-red-200">
                                      Clique novamente para ocultar detalhes
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Zona Crítica B */}
                              <div
                                className={`group relative overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out cursor-pointer ${
                                  selectedZone?.id === "zona-b"
                                    ? "border-red-400/60 bg-red-900/20 shadow-red-500/40"
                                    : selectedZones.some(
                                        (z) => z.id === "zona-b"
                                      )
                                    ? "border-blue-400/60 bg-blue-900/20 shadow-blue-500/40 ring-2 ring-blue-400/30"
                                    : "border-red-400/20 bg-slate-800/60 hover:border-red-400/40 hover:shadow-red-500/25"
                                }`}
                                onClick={(e) => {
                                  // Verifica se o clique foi no checkbox ou em seus elementos filhos
                                  if (
                                    e.target.type === "checkbox" ||
                                    e.target.closest('input[type="checkbox"]')
                                  ) {
                                    return;
                                  }

                                  const zoneData = {
                                    id: "zona-b",
                                    name: "Zona Crítica B",
                                    coordinates: {
                                      lat: -29.7195,
                                      lng: -52.4254,
                                    },
                                    area: "1.8 ha",
                                    ndvi: "0.28",
                                    degradation: "Severa",
                                    priority: "Urgente",
                                    recommendations: {
                                      species: [
                                        {
                                          name: "Ingá-feijão",
                                          type: "Ripária",
                                          reason: "Fixação de nitrogênio",
                                        },
                                        {
                                          name: "Embaúba",
                                          type: "Pioneira",
                                          reason: "Atração de fauna",
                                        },
                                        {
                                          name: "Canafístula",
                                          type: "Secundária",
                                          reason: "Sombreamento",
                                        },
                                      ],
                                      actions: [
                                        "Remoção de espécies invasoras",
                                        "Plantio em faixas",
                                        "Irrigação inicial necessária",
                                      ],
                                      timeline: "8 meses para recuperação",
                                    },
                                  };
                                  setSelectedZone(
                                    selectedZone?.id === "zona-b"
                                      ? null
                                      : zoneData
                                  );
                                  if (selectedZone?.id !== "zona-b") {
                                    setSelectedLocation({
                                      name: zoneData.name,
                                      coordinates: `${zoneData.coordinates.lat}, ${zoneData.coordinates.lng}`,
                                      latitude: zoneData.coordinates.lat,
                                      longitude: zoneData.coordinates.lng,
                                    });
                                  }
                                }}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-800"
                                      checked={selectedZones.some(
                                        (z) => z.id === "zona-b"
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleZoneToggle(
                                          {
                                            id: "zona-b",
                                            name: "Zona Crítica B",
                                            coordinates: [-29.7185, -52.4274],
                                            area: "1.8 ha",
                                            ndvi: 0.28,
                                            degradation: "Severa",
                                            priority: "Urgente",
                                          },
                                          true
                                        );
                                      }}
                                    />
                                    <span className="text-sm font-medium text-white">
                                      Zona Crítica B
                                    </span>
                                  </div>
                                  <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300">
                                    Urgente
                                  </span>
                                </div>
                                <div className="space-y-2 text-xs text-slate-300">
                                  <p>
                                    Área:{" "}
                                    <span className="font-medium text-red-300">
                                      1.8 ha
                                    </span>
                                  </p>
                                  <p>
                                    NDVI:{" "}
                                    <span className="font-medium text-red-300">
                                      0.28
                                    </span>
                                  </p>
                                  <p>
                                    Degradação:{" "}
                                    <span className="font-medium text-red-300">
                                      Severa
                                    </span>
                                  </p>
                                  <p>
                                    Coordenadas:{" "}
                                    <span className="font-mono text-slate-400">
                                      -29.7195, -52.4254
                                    </span>
                                  </p>
                                </div>

                                {/* Contadores de Atividades */}
                                <div className="mt-3 border-t border-red-400/20 pt-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <BarChart3 className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-b"].reports}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Bell className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-b"].tracking}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Leaf className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-b"].actions}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    Relatórios • Acompanhamentos • Ações
                                  </div>
                                </div>
                                {selectedZone?.id === "zona-b" && (
                                  <div className="mt-3 border-t border-red-400/30 pt-3">
                                    <p className="text-xs font-medium text-red-200">
                                      Clique novamente para ocultar detalhes
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Zona Atenção C */}
                              <div
                                className={`group relative overflow-hidden rounded-xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out cursor-pointer ${
                                  selectedZone?.id === "zona-c"
                                    ? "border-orange-400/60 bg-orange-900/20 shadow-orange-500/40"
                                    : selectedZones.some(
                                        (z) => z.id === "zona-c"
                                      )
                                    ? "border-blue-400/60 bg-blue-900/20 shadow-blue-500/40 ring-2 ring-blue-400/30"
                                    : "border-orange-400/20 bg-slate-800/60 hover:border-orange-400/40 hover:shadow-orange-500/25"
                                }`}
                                onClick={(e) => {
                                  // Verifica se o clique foi no checkbox ou em seus elementos filhos
                                  if (
                                    e.target.type === "checkbox" ||
                                    e.target.closest('input[type="checkbox"]')
                                  ) {
                                    return;
                                  }

                                  const zoneData = {
                                    id: "zona-c",
                                    name: "Zona Atenção C",
                                    coordinates: {
                                      lat: -29.7165,
                                      lng: -52.4284,
                                    },
                                    area: "3.2 ha",
                                    ndvi: "0.45",
                                    degradation: "Moderada",
                                    priority: "Moderada",
                                    recommendations: {
                                      species: [
                                        {
                                          name: "Pitangueira",
                                          type: "Secundária",
                                          reason: "Frutífera nativa",
                                        },
                                        {
                                          name: "Aroeira-vermelha",
                                          type: "Clímax",
                                          reason: "Longevidade",
                                        },
                                        {
                                          name: "Guabiroba",
                                          type: "Secundária",
                                          reason: "Atração de polinizadores",
                                        },
                                      ],
                                      actions: [
                                        "Enriquecimento da vegetação",
                                        "Plantio de espécies frutíferas",
                                        "Manutenção preventiva",
                                      ],
                                      timeline: "12 meses para consolidação",
                                    },
                                  };
                                  setSelectedZone(
                                    selectedZone?.id === "zona-c"
                                      ? null
                                      : zoneData
                                  );
                                  if (selectedZone?.id !== "zona-c") {
                                    setSelectedLocation({
                                      name: zoneData.name,
                                      coordinates: `${zoneData.coordinates.lat}, ${zoneData.coordinates.lng}`,
                                      latitude: zoneData.coordinates.lat,
                                      longitude: zoneData.coordinates.lng,
                                    });
                                  }
                                }}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-800"
                                      checked={selectedZones.some(
                                        (z) => z.id === "zona-c"
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleZoneToggle(
                                          {
                                            id: "zona-c",
                                            name: "Zona Atenção C",
                                            coordinates: [-29.7195, -52.4284],
                                            area: "3.2 ha",
                                            ndvi: 0.45,
                                            degradation: "Moderada",
                                            priority: "Moderada",
                                          },
                                          true
                                        );
                                      }}
                                    />
                                    <span className="text-sm font-medium text-white">
                                      Zona Atenção C
                                    </span>
                                  </div>
                                  <span className="rounded-full bg-orange-500/20 px-2 py-1 text-xs text-orange-300">
                                    Moderada
                                  </span>
                                </div>
                                <div className="space-y-2 text-xs text-slate-300">
                                  <p>
                                    Área:{" "}
                                    <span className="font-medium text-orange-300">
                                      3.2 ha
                                    </span>
                                  </p>
                                  <p>
                                    NDVI:{" "}
                                    <span className="font-medium text-orange-300">
                                      0.45
                                    </span>
                                  </p>
                                  <p>
                                    Degradação:{" "}
                                    <span className="font-medium text-orange-300">
                                      Moderada
                                    </span>
                                  </p>
                                  <p>
                                    Coordenadas:{" "}
                                    <span className="font-mono text-slate-400">
                                      -29.7165, -52.4284
                                    </span>
                                  </p>
                                </div>

                                {/* Contadores de Atividades */}
                                <div className="mt-3 border-t border-orange-400/20 pt-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <BarChart3 className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-c"].reports}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Bell className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-c"].tracking}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Leaf className="h-3 w-3" />
                                      <span>
                                        {zoneActivities["zona-c"].actions}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    Relatórios • Acompanhamentos • Ações
                                  </div>
                                </div>
                                {selectedZone?.id === "zona-c" && (
                                  <div className="mt-3 border-t border-orange-400/30 pt-3">
                                    <p className="text-xs font-medium text-orange-200">
                                      Clique novamente para ocultar detalhes
                                    </p>
                                  </div>
                                )}
                              </div>
                              </div>

                              <div className="mt-4 border-t border-slate-600 pt-3">
                                <p className="text-xs text-slate-400">
                                  Total para recuperação:{" "}
                                  <span className="font-medium text-emerald-300">
                                    7.1 ha
                                  </span>
                                </p>
                                {selectedZone && (
                                  <p className="mt-1 text-xs text-emerald-300">
                                    Zona selecionada: {selectedZone.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Coluna do Meio - Recomendações */}
                          {selectedZone && (
                            <div className="flex flex-col">
                              <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
                                <Leaf className="mr-2 h-5 w-5 text-green-400" />
                                Recomendações - {selectedZone.name}
                              </h3>
                              <div className="flex-1 space-y-4 overflow-y-auto">
                                <>
                                  {/* Espécies Nativas Personalizadas */}
                                  <div className="group relative overflow-hidden rounded-xl border border-green-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-green-400/40 hover:shadow-green-500/25">
                                    <div className="mb-3 flex items-center justify-between">
                                      <span className="text-sm font-medium text-white">
                                        Espécies Nativas
                                      </span>
                                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">
                                        Recomendado
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {selectedZone.name ===
                                        "Zona Crítica A" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Salix babylonica
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Ripária
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Cecropia pachystachya
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Pioneira
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Inga vera
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              Secundária
                                            </span>
                                          </div>
                                          <div className="mt-2 border-t border-green-400/20 pt-2">
                                            <p className="text-xs text-slate-400">
                                              8 espécies para solo encharcado
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Crítica B" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Schinus terebinthifolius
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Pioneira
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Psidium cattleianum
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Secundária
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Eugenia uniflora
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              Clímax
                                            </span>
                                          </div>
                                          <div className="mt-2 border-t border-green-400/20 pt-2">
                                            <p className="text-xs text-slate-400">
                                              15 espécies resistentes à seca
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Atenção C" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Tibouchina granulosa
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Pioneira
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Handroanthus chrysotrichus
                                            </span>
                                            <span className="font-medium text-green-300">
                                              Secundária
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Jacaranda mimosifolia
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              Clímax
                                            </span>
                                          </div>
                                          <div className="mt-2 border-t border-green-400/20 pt-2">
                                            <p className="text-xs text-slate-400">
                                              12 espécies para manutenção
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Métricas Personalizadas */}
                                  <div className="group relative overflow-hidden rounded-xl border border-blue-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-blue-400/40 hover:shadow-blue-500/25">
                                    <div className="mb-3 flex items-center justify-between">
                                      <span className="text-sm font-medium text-white">
                                        Métricas Esperadas
                                      </span>
                                      <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                                        {selectedZone.name === "Zona Crítica A"
                                          ? "36 meses"
                                          : selectedZone.name ===
                                            "Zona Crítica B"
                                          ? "24 meses"
                                          : "18 meses"}
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {selectedZone.name ===
                                        "Zona Crítica A" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              NDVI Alvo
                                            </span>
                                            <span className="font-medium text-green-300">
                                              0.55+
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Cobertura Vegetal
                                            </span>
                                            <span className="font-medium text-green-300">
                                              70%
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Carbono Sequestrado
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              28 tCO₂
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Crítica B" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              NDVI Alvo
                                            </span>
                                            <span className="font-medium text-green-300">
                                              0.45+
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Cobertura Vegetal
                                            </span>
                                            <span className="font-medium text-green-300">
                                              60%
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Carbono Sequestrado
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              18 tCO₂
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Atenção C" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              NDVI Alvo
                                            </span>
                                            <span className="font-medium text-green-300">
                                              0.65+
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Cobertura Vegetal
                                            </span>
                                            <span className="font-medium text-green-300">
                                              85%
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Carbono Sequestrado
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              12 tCO₂
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Cronograma Personalizado */}
                                  <div className="group relative overflow-hidden rounded-xl border border-purple-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-purple-400/40 hover:shadow-purple-500/25">
                                    <div className="mb-3 flex items-center justify-between">
                                      <span className="text-sm font-medium text-white">
                                        Cronograma
                                      </span>
                                      <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                                        Faseado
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {selectedZone.name ===
                                        "Zona Crítica A" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 1 - Drenagem
                                            </span>
                                            <span className="font-medium text-green-300">
                                              3 meses
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 2 - Plantio
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              6 meses
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 3 - Monitoramento
                                            </span>
                                            <span className="font-medium text-purple-300">
                                              27 meses
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Crítica B" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 1 - Preparação
                                            </span>
                                            <span className="font-medium text-green-300">
                                              2 meses
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 2 - Plantio
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              4 meses
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 3 - Monitoramento
                                            </span>
                                            <span className="font-medium text-purple-300">
                                              18 meses
                                            </span>
                                          </div>
                                        </>
                                      )}
                                      {selectedZone.name ===
                                        "Zona Atenção C" && (
                                        <>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 1 - Manutenção
                                            </span>
                                            <span className="font-medium text-green-300">
                                              1 mês
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 2 - Enriquecimento
                                            </span>
                                            <span className="font-medium text-blue-300">
                                              3 meses
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-300">
                                              Fase 3 - Monitoramento
                                            </span>
                                            <span className="font-medium text-purple-300">
                                              14 meses
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {selectedSubSection === "comunidade" && (
                      <motion.div className="space-y-6">
                        <div className="text-white">
                          <h3 className="mb-4 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-2xl font-semibold text-transparent">
                            Comunidade
                          </h3>
                          <p className="mb-6 text-emerald-300">
                            Engajamento e participação da comunidade local.
                          </p>

                          {/* Conteúdo adicional para testar scroll */}
                          {Array.from({ length: 8 }, (_, i) => (
                            <div
                              key={i}
                              className="group mb-4 rounded-xl border border-emerald-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:shadow-emerald-500/25"
                            >
                              <h4 className="mb-2 font-medium text-white">
                                Participante {i + 1}
                              </h4>
                              <p className="text-emerald-300">
                                Informações sobre a participação da comunidade
                                número {i + 1}.
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Panel>

              {fullscreenPanel !== "central" && fullscreenPanel !== "map" && (
                <PanelResizeHandle className="flex w-2 cursor-ew-resize items-center justify-center bg-emerald-400/20 backdrop-blur-sm transition-colors duration-200 hover:bg-emerald-400/30">
                  <div className="h-8 w-1 rounded-full bg-emerald-400/60"></div>
                </PanelResizeHandle>
              )}

              {/* Seção Direita - Mapa */}
              <Panel
                defaultSize={fullscreenPanel === "map" ? 100 : 30}
                minSize={20}
                className={`relative z-40 w-full border-l border-emerald-400/30 bg-slate-900/70 backdrop-blur-xl ${
                  fullscreenPanel === "central" ? "hidden" : ""
                }`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex h-full flex-col">
                    {/* Header do Mapa */}
                    <div className="border-b border-emerald-400/30 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-3 backdrop-blur-xl sm:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white sm:text-lg">
                            Imagem de Satélite
                          </h3>
                          <p className="mt-1 text-xs text-emerald-300 sm:text-sm">
                            Google Maps com dados simulados de NDVI
                          </p>
                        </div>
                        <motion.button
                          onClick={() =>
                            setFullscreenPanel(
                              fullscreenPanel === "map" ? null : "map"
                            )
                          }
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(16, 185, 129, 0.3)",
                            borderColor: "rgba(52, 211, 153, 0.5)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-lg border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-400 sm:p-3"
                          title={
                            fullscreenPanel === "map"
                              ? "Sair do modo tela cheia"
                              : "Modo tela cheia"
                          }
                        >
                          <motion.div
                            animate={{
                              rotate: fullscreenPanel === "map" ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {fullscreenPanel === "map" ? (
                              <Minimize className="h-4 w-4" />
                            ) : (
                              <Maximize className="h-4 w-4" />
                            )}
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Mapa de Teste - Imagem de Satélite */}
                    <div className="relative w-full flex-1">
                      <div className="h-full w-full overflow-hidden border border-emerald-400/20 bg-slate-800/50">
                        <iframe
                          src={`https://maps.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}&t=k&z=15&output=embed`}
                          className="h-full w-full border-0"
                          title="Mapa de Teste - Imagem de Satélite"
                          loading="lazy"
                        />
                        {/* Overlay com informações de teste */}
                        <div className="absolute left-4 top-4 rounded-lg border border-emerald-400/30 bg-slate-900/90 p-3 backdrop-blur-sm">
                          <div className="text-xs text-emerald-300">
                            <div className="mb-1 font-semibold">
                              Imagem de Satélite
                            </div>
                            <div>
                              Lat: {selectedLocation.latitude.toFixed(4)}
                            </div>
                            <div>
                              Lng: {selectedLocation.longitude.toFixed(4)}
                            </div>
                            <div className="mt-2 text-yellow-300">
                              NDVI: 0.68 (Simulado)
                            </div>
                            <div className="mt-1 text-blue-300">Zoom: 15x</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legenda do Mapa */}
                    <div className="border-t border-emerald-400/30 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-3 backdrop-blur-xl">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-emerald-300">
                          Legenda NDVI
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-red-400"></span>
                            <span className="text-xs text-slate-300">
                              Crítico
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                            <span className="text-xs text-slate-300">
                              Moderado
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-green-400"></span>
                            <span className="text-xs text-slate-300">Bom</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-green-600"></span>
                            <span className="text-xs text-slate-300">
                              Excelente
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </SidebarInset>

        {/* Modal de Exportação de Relatório */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-green-400/20 bg-slate-800/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <BarChart3 className="mr-2 inline-block h-6 w-6" /> Exportar
                  Relatório
                </h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-sm text-slate-300">
                    Zonas selecionadas:{" "}
                    {selectedZones.map((z) => z.name).join(", ")}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Formato do Relatório
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        className="mr-2"
                        defaultChecked
                      />
                      <span className="text-sm text-slate-300">
                        PDF - Relatório completo com gráficos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="excel"
                        className="mr-2"
                      />
                      <span className="text-sm text-slate-300">
                        Excel - Dados tabulares para análise
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Lógica de exportação aqui
                      alert("Relatório exportado com sucesso!");
                      setShowExportModal(false);
                    }}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                  >
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configuração de Acompanhamento */}
        {showTrackingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-yellow-400/20 bg-slate-800/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <Bell className="mr-2 inline-block h-6 w-6" /> Configurar
                  Acompanhamento
                </h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-sm text-slate-300">
                    Zonas monitoradas:{" "}
                    {selectedZones.map((z) => z.name).join(", ")}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Frequência de Monitoramento
                  </label>
                  <select className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white">
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Tipos de Alerta
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-slate-300">
                        Mudanças no NDVI
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-slate-300">
                        Degradação detectada
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-slate-300">
                        Melhorias na vegetação
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowTrackingModal(false)}
                    className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Lógica de configuração aqui
                      alert("Acompanhamento configurado com sucesso!");
                      setShowTrackingModal(false);
                    }}
                    className="flex-1 rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white transition-colors hover:bg-yellow-700"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Registro de Ação */}
        {showActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-purple-400/20 bg-slate-800/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-semibold text-white">
                  <Leaf className="mr-2 inline-block h-6 w-6" /> Registrar Ação
                </h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-sm text-slate-300">
                    Zonas de ação: {selectedZones.map((z) => z.name).join(", ")}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Tipo de Ação
                  </label>
                  <select className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white">
                    <option value="reforestation">Reflorestamento</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="partnership">Parceria</option>
                    <option value="monitoring">Monitoramento</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Descrição da Ação
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
                    rows="3"
                    placeholder="Descreva a ação realizada..."
                  ></textarea>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Data da Ação
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Lógica de registro aqui
                      alert("Ação registrada com sucesso!");
                      setShowActionModal(false);
                    }}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default MeadowGreen;
