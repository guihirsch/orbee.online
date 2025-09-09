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
  // novo: período selecionado (compartilhado entre header e painel direito)
  const [period, setPeriod] = useState("30d");
  const [selectedSection, setSelectedSection] = useState("caracteristicas");
  const [selectedSubSection, setSelectedSubSection] = useState("inicio");
  const [fullscreenPanel, setFullscreenPanel] = useState(null);

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
    <SidebarProvider>
      <div className="relative flex h-screen w-full overflow-hidden">
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
            <PanelGroup direction="horizontal" className="h-full w-full">
              <Panel
                className={`relative z-40 flex h-full flex-col border-r border-emerald-400/30 bg-slate-900/70 backdrop-blur-xl ${
                  fullscreenPanel === "map" ? "hidden" : ""
                }`}
                defaultSize={fullscreenPanel === "central" ? 100 : 70}
              >
                {/* Header da Seção Central */}
                <div className="border-b border-emerald-400/30 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="bg-gradient-to-r bg-clip-text text-3xl font-light text-transparent text-white">
                        {selectedSubSection === "caracteristicas" &&
                          "Características da Região"}
                        {selectedSubSection === "saude" &&
                          "Saúde da Mata Ciliar"}
                        {selectedSubSection === "acoes" && "Ações Necessárias"}
                      </h2>
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
                <div className="flex-1 overflow-y-auto p-8">
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
                          className="grid grid-cols-1 gap-6 md:grid-cols-2"
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
                            className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-emerald-400/40 hover:shadow-emerald-500/25"
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
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Localização e Bacia
                              </h4>
                              <div className="space-y-2 text-sm">
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
                            className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-blue-400/40 hover:shadow-blue-500/25"
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
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Uso do Solo
                              </h4>
                              <div className="space-y-2 text-sm">
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
                            className="group relative overflow-hidden rounded-2xl border border-purple-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-purple-400/40 hover:shadow-purple-500/25"
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
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Clima
                              </h4>
                              <div className="space-y-2 text-sm">
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
                            className="group relative overflow-hidden rounded-2xl border border-orange-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-orange-400/40 hover:shadow-orange-500/25"
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
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Sazonalidade
                              </h4>
                              <div className="space-y-2 text-sm">
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
                          <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-green-400/40 hover:shadow-green-500/25">
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
                                  <h4 className="text-lg font-semibold text-white">
                                    Fauna e Flora Nativa
                                  </h4>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                  <h5 className="mb-2 font-medium text-green-300">
                                    Espécies-chave
                                  </h5>
                                  <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• Ingá-feijão</li>
                                    <li>• Salgueiro-chorão</li>
                                    <li>• Capim-dos-pampas</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="mb-2 font-medium text-green-300">
                                    Ameaçadas
                                  </h5>
                                  <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• Bugio-ruivo</li>
                                    <li>• Lontra-neotropical</li>
                                    <li>• Araucária</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="mb-2 font-medium text-green-300">
                                    Corredores
                                  </h5>
                                  <ul className="space-y-1 text-sm text-slate-300">
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
                                  <h4 className="text-lg font-semibold text-white">
                                    Benchmarks Regionais
                                  </h4>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="text-center">
                                  <div className="mb-2 text-2xl font-light text-white">
                                    0.68
                                  </div>
                                  <div className="text-xs text-teal-300">
                                    NDVI Local
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    vs 0.72 regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-2xl font-light text-white">
                                    4%
                                  </div>
                                  <div className="text-xs text-teal-300">
                                    Cobertura Ciliar
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    vs 8% regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-2xl font-light text-white">
                                    156m
                                  </div>
                                  <div className="text-xs text-teal-300">
                                    Altitude
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    vs 180m regional
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="mb-2 text-2xl font-light text-white">
                                    68%
                                  </div>
                                  <div className="text-xs text-teal-300">
                                    Uso Agrícola
                                  </div>
                                  <div className="text-xs text-slate-400">
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
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                  <span className="text-sm text-slate-300">
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
                                  <p className="text-xs text-slate-400">
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Card Áreas Prioritárias */}
                          <div className="group relative overflow-hidden rounded-2xl border border-red-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-red-400/40 hover:shadow-red-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter12'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter12)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-red-400/30 bg-red-500/20 p-3 backdrop-blur-sm">
                                  <Target className="h-5 w-5 text-red-400" />
                                </div>
                                <span className="rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 backdrop-blur-sm">
                                  Urgente
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Áreas Prioritárias
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Zona Crítica A
                                  </span>
                                  <span className="font-medium text-red-300">
                                    2.1 ha
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Zona Crítica B
                                  </span>
                                  <span className="font-medium text-red-300">
                                    1.8 ha
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Zona Atenção C
                                  </span>
                                  <span className="font-medium text-orange-300">
                                    3.2 ha
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-red-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    Total para recuperação: 7.1 ha
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Espécies Nativas */}
                          <div className="group relative overflow-hidden rounded-2xl border border-green-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-400/40 hover:shadow-green-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter13'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter13)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm">
                                  <Leaf className="h-5 w-5 text-green-400" />
                                </div>
                                <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                                  Recomendado
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Espécies Nativas
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Ingá-açu
                                  </span>
                                  <span className="font-medium text-green-300">
                                    Ripária
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Cecropia
                                  </span>
                                  <span className="font-medium text-green-300">
                                    Pioneira
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Figueira-branca
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    Secundária
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-green-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    12 espécies adequadas ao clima
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Acompanhamento */}
                          <div className="group relative overflow-hidden rounded-2xl border border-blue-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter14'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter14)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-blue-400/30 bg-blue-500/20 p-3 backdrop-blur-sm">
                                  <Calendar className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
                                  Contínuo
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Acompanhamento
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Relatórios Mensais
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    Ativo
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Alertas Automáticos
                                  </span>
                                  <span className="font-medium text-green-300">
                                    Configurado
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Próxima Análise
                                  </span>
                                  <span className="font-medium text-yellow-300">
                                    15 dias
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-blue-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    Monitoramento via satélite
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Métricas ESG */}
                          <div className="group relative overflow-hidden rounded-2xl border border-purple-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter15'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter15)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-xl border border-purple-400/30 bg-purple-500/20 p-3 backdrop-blur-sm">
                                  <BarChart3 className="h-5 w-5 text-purple-400" />
                                </div>
                                <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 backdrop-blur-sm">
                                  ESG
                                </span>
                              </div>
                              <h4 className="mb-3 text-lg font-semibold text-white">
                                Métricas de Impacto
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Hectares Preservados
                                  </span>
                                  <span className="font-medium text-green-300">
                                    12.4 ha
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Carbono Sequestrado
                                  </span>
                                  <span className="font-medium text-blue-300">
                                    186 tCO₂
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-300">
                                    Biodiversidade
                                  </span>
                                  <span className="font-medium text-purple-300">
                                    +23%
                                  </span>
                                </div>
                                <div className="mt-3 border-t border-purple-400/20 pt-3">
                                  <p className="text-xs text-slate-400">
                                    Impacto acumulado 2024
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cards de linha completa */}
                        <div className="space-y-6">
                          {/* Card Engajamento */}
                          <div className="group relative overflow-hidden rounded-2xl border border-orange-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-orange-400/40 hover:shadow-orange-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter16'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter16)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="rounded-xl border border-orange-400/30 bg-orange-500/20 p-3 backdrop-blur-sm">
                                    <Users className="h-5 w-5 text-orange-400" />
                                  </div>
                                  <h4 className="text-lg font-semibold text-white">
                                    Engajamento Stakeholders
                                  </h4>
                                </div>
                                <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 backdrop-blur-sm">
                                  Ativo
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-4 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Empresas
                                  </div>
                                  <div className="text-xs text-blue-300">
                                    Relatórios ESG
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Trimestral
                                  </div>
                                </div>
                                <div className="rounded-lg border border-green-400/20 bg-green-500/10 p-4 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Governos
                                  </div>
                                  <div className="text-xs text-green-300">
                                    Políticas Públicas
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Semestral
                                  </div>
                                </div>
                                <div className="rounded-lg border border-purple-400/20 bg-purple-500/10 p-4 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Comunidade
                                  </div>
                                  <div className="text-xs text-purple-300">
                                    Participação Ativa
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Contínua
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 border-t border-orange-400/20 pt-4">
                                <p className="text-sm text-orange-300">
                                  Transparência e colaboração para impacto
                                  sustentável
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card Transparência */}
                          <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-800/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-cyan-400/40 hover:shadow-cyan-500/25">
                            <div
                              className="absolute inset-0 opacity-15 mix-blend-overlay"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoiseFilter17'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoiseFilter17)'/%3E%3C/svg%3E")`,
                                backgroundSize: "256px 256px",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/20 p-3 backdrop-blur-sm">
                                    <Eye className="h-5 w-5 text-cyan-400" />
                                  </div>
                                  <h4 className="text-lg font-semibold text-white">
                                    Transparência & Dados Abertos
                                  </h4>
                                </div>
                                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-sm">
                                  Público
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    API Aberta
                                  </div>
                                  <div className="text-xs text-green-300">
                                    Disponível
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    24/7
                                  </div>
                                </div>
                                <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-3 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Dados NDVI
                                  </div>
                                  <div className="text-xs text-blue-300">
                                    Tempo Real
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    5 dias
                                  </div>
                                </div>
                                <div className="rounded-lg border border-purple-400/20 bg-purple-500/10 p-3 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Relatórios
                                  </div>
                                  <div className="text-xs text-purple-300">
                                    Download
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    PDF/CSV
                                  </div>
                                </div>
                                <div className="rounded-lg border border-orange-400/20 bg-orange-500/10 p-3 text-center">
                                  <div className="mb-2 text-lg font-light text-white">
                                    Participativo
                                  </div>
                                  <div className="text-xs text-orange-300">
                                    Comunidade
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Validação
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 border-t border-cyan-400/20 pt-4">
                                <p className="text-sm text-cyan-300">
                                  Monitoramento participativo com acesso livre
                                  aos dados ambientais
                                </p>
                              </div>
                            </div>
                          </div>
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
                    <div className="border-b border-emerald-400/30 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-4 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Imagem de Satélite
                          </h3>
                          <p className="mt-1 text-xs text-emerald-300">
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
                          className="rounded-lg border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-400"
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
                    <div className="relative flex-1 w-full">
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
      </div>
    </SidebarProvider>
  );
};

export default MeadowGreen;
