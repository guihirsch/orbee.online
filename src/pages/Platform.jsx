import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useScrollAnimation from "../hooks/useScrollAnimation";
import useAuth from "../hooks/useAuth";
import Modal from "../components/ui/Modal";
import ZoneCard from "../components/ZoneCard";
import SimpleBackground from "../components/SimpleBackground";
import {
   BarChart3,
   Target,
   Users,
   Activity,
   Globe,
   Leaf,
   TrendingUp,
   Heart,
   Search,
   FileText,
   Eye,
   Plus,
   Check,
   X,
   Camera,
} from "lucide-react";
import NDVIMap from "../components/NDVIMap";
import MunicipalitySearch from "../components/MunicipalitySearch";

const Platform = ({}) => {
   const [headerRef, headerVisible] = useScrollAnimation();
   const [featuresRef, featuresVisible] = useScrollAnimation();
   const { user } = useAuth();

   // Dados reais do MeadowGreen.jsx
   const [selectedZone, setSelectedZone] = useState(null);
   const [selectedZones, setSelectedZones] = useState([]);
   const [showExportModal, setShowExportModal] = useState(false);
   const [showTrackingModal, setShowTrackingModal] = useState(false);
   const [showActionModal, setShowActionModal] = useState(false);
   const [showPhotoGallery, setShowPhotoGallery] = useState(false);
   const [selectedZonePhotos, setSelectedZonePhotos] = useState(null);
   const [activeFilter, setActiveFilter] = useState("all"); // Filtro ativo: 'all', 'monitored', 'reported', 'registered'
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [isSelectionOpen, setIsSelectionOpen] = useState(false);
   const [showSearchModal, setShowSearchModal] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [aoiGeoJSON, setAoiGeoJSON] = useState(null);
   const [actionPlan, setActionPlan] = useState(null);

   function handleAOILoad({ municipality, geometry, ndvi, plan }) {
      if (geometry) setAoiGeoJSON(geometry);
      if (plan) setActionPlan(plan);
   }

   // Dados estruturados para os cards das zonas
   const zoneCardsData = {
      A: {
         id: "A",
         name: "Zona Crítica A",
         priority: "Urgente",
         area: "2.1 ha",
         ndvi: "0.32",
         degradation: "Severa",
         color: "red",
         latitude: "-29.7175",
         longitude: "-52.4264",
      },
      B: {
         id: "B",
         name: "Zona Crítica B",
         priority: "Alta",
         area: "1.8 ha",
         ndvi: "0.28",
         degradation: "Severa",
         color: "orange",
         latitude: "-29.7185",
         longitude: "-52.4274",
      },
      C: {
         id: "C",
         name: "Zona Atenção C",
         priority: "Moderada",
         area: "3.2 ha",
         ndvi: "0.45",
         degradation: "Moderada",
         color: "yellow",
         latitude: "-29.7195",
         longitude: "-52.4284",
      },
   };

   const zoneData = {
      A: {
         name: "Zona Crítica A",
         location: {
            coordinates: "-29.7175, -52.4264",
            area: "2.1 ha",
            description: "Margem norte do Rio Pardinho",
         },
         nativeSpecies: [
            { name: "Schinus terebinthifolius", type: "Pioneira" },
            { name: "Psidium cattleianum", type: "Secundária" },
            { name: "Eugenia uniflora", type: "Clímax" },
         ],
         expectedMetrics: {
            ndviTarget: "0.45+",
            vegetationCover: "60%",
            carbonSequestered: "18 tCO2",
         },
         timeline: [
            { phase: "Fase 1 - Preparação", duration: "2 meses" },
            { phase: "Fase 2 - Plantio", duration: "4 meses" },
            { phase: "Fase 3 - Monitoramento", duration: "18 meses" },
         ],
      },
      B: {
         name: "Zona Crítica B",
         location: {
            coordinates: "-29.7189, -52.4278",
            area: "1.8 ha",
            description: "Confluência Rio Pardinho - Arroio Lajeado",
         },
         nativeSpecies: [
            { name: "Schinus terebinthifolius", type: "Pioneira" },
            { name: "Psidium cattleianum", type: "Secundária" },
            { name: "Eugenia uniflora", type: "Clímax" },
         ],
         expectedMetrics: {
            ndviTarget: "0.45+",
            vegetationCover: "60%",
            carbonSequestered: "18 tCO2",
         },
         timeline: [
            { phase: "Fase 1 - Preparação", duration: "2 meses" },
            { phase: "Fase 2 - Plantio", duration: "4 meses" },
            { phase: "Fase 3 - Monitoramento", duration: "18 meses" },
         ],
      },
      C: {
         name: "Zona Crítica C",
         location: {
            coordinates: "-29.7162, -52.4251",
            area: "3.2 ha",
            description: "Margem sul do Rio Pardinho - Setor urbano",
         },
         nativeSpecies: [
            { name: "Schinus terebinthifolius", type: "Pioneira" },
            { name: "Psidium cattleianum", type: "Secundianum" },
            { name: "Eugenia uniflora", type: "Clímax" },
         ],
         expectedMetrics: {
            ndviTarget: "0.45+",
            vegetationCover: "60%",
            carbonSequestered: "18 tCO2",
         },
         timeline: [
            { phase: "Fase 1 - Preparação", duration: "2 meses" },
            { phase: "Fase 2 - Plantio", duration: "4 meses" },
            { phase: "Fase 3 - Monitoramento", duration: "18 meses" },
         ],
      },
   };

   const handleZoneClick = (zone) => {
      setSelectedZone(selectedZone === zone ? null : zone);
   };

   // Funções para gerenciar seleção múltipla de zonas
   const handleZoneToggle = (zoneId, preventRecommendation = false) => {
      setSelectedZones((prev) => {
         const isSelected = prev.includes(zoneId);
         if (isSelected) {
            return prev.filter((z) => z !== zoneId);
         } else {
            return [...prev, zoneId];
         }
      });

      // Se preventRecommendation for true, não abre as recomendações
      if (preventRecommendation) {
         return;
      }
   };

   const handleSelectAllZones = () => {
      const filteredZoneIds = filteredZones.map((zone) => zone.id);
      const allFilteredSelected = filteredZoneIds.every((id) =>
         selectedZones.includes(id)
      );

      if (allFilteredSelected) {
         // Remove todas as zonas filtradas da seleção
         setSelectedZones((prev) =>
            prev.filter((id) => !filteredZoneIds.includes(id))
         );
      } else {
         // Adiciona todas as zonas filtradas à seleção
         setSelectedZones((prev) => {
            const newSelection = [...prev];
            filteredZoneIds.forEach((id) => {
               if (!newSelection.includes(id)) {
                  newSelection.push(id);
               }
            });
            return newSelection;
         });
      }
   };

   const communityStats = {
      guardians: 31611,
      protectedAreas: 226127,
      organizations: 5602,
      totalArea: "45.2 km²",
      ndviCurrent: 0.68,
      healthStatus: "Excelente",
      lastUpdate: "2024-01-15 14:30",
   };

   const regionEngagement = {
      watchers: 127,
      contributors: 43,
      totalAccess: 2847,
      activeUsers: 89,
      lastActivity: "2024-01-15 16:45",
      growthRate: "+12%",
   };

   const zoneActivities = {
      "zona-a": { reports: 3, tracking: 2, actions: 5, photos: 8 },
      "zona-b": { reports: 1, tracking: 1, actions: 2, photos: 5 },
      "zona-c": { reports: 4, tracking: 3, actions: 1, photos: 12 },
   };

   // Dados para filtros - simula quais zonas têm relatórios e registros do usuário
   const zoneStatus = {
      A: { hasReport: true, hasUserRegistration: true, isMonitored: true },
      B: { hasReport: false, hasUserRegistration: true, isMonitored: true },
      C: { hasReport: true, hasUserRegistration: false, isMonitored: false },
   };

   // Função para filtrar zonas baseado no filtro ativo
   const getFilteredZones = () => {
      const allZones = Object.values(zoneCardsData);

      switch (activeFilter) {
         case "monitored":
            return allZones.filter((zone) => zoneStatus[zone.id]?.isMonitored);
         case "reported":
            return allZones.filter((zone) => zoneStatus[zone.id]?.hasReport);
         case "registered":
            return allZones.filter(
               (zone) => zoneStatus[zone.id]?.hasUserRegistration
            );
         default:
            return allZones;
      }
   };

   const filteredZones = getFilteredZones();

   // Dados mock de fotos para cada zona
   const zonePhotos = {
      "zona-a": [
         {
            id: 1,
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            title: "Margem degradada",
            date: "2024-01-10",
         },
         {
            id: 2,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Erosão do solo",
            date: "2024-01-12",
         },
         {
            id: 3,
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
            title: "Vegetação esparsa",
            date: "2024-01-14",
         },
         {
            id: 4,
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            title: "Área de plantio",
            date: "2024-01-15",
         },
         {
            id: 5,
            url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
            title: "Mudas plantadas",
            date: "2024-01-16",
         },
         {
            id: 6,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Monitoramento",
            date: "2024-01-17",
         },
         {
            id: 7,
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            title: "Progresso",
            date: "2024-01-18",
         },
         {
            id: 8,
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
            title: "Recuperação",
            date: "2024-01-19",
         },
      ],
      "zona-b": [
         {
            id: 1,
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            title: "Confluência dos rios",
            date: "2024-01-08",
         },
         {
            id: 2,
            url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
            title: "Área alagada",
            date: "2024-01-11",
         },
         {
            id: 3,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Vegetação ripária",
            date: "2024-01-13",
         },
         {
            id: 4,
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            title: "Monitoramento",
            date: "2024-01-15",
         },
         {
            id: 5,
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
            title: "Ação comunitária",
            date: "2024-01-17",
         },
      ],
      "zona-c": [
         {
            id: 1,
            url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
            title: "Setor urbano",
            date: "2024-01-05",
         },
         {
            id: 2,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Margem sul",
            date: "2024-01-07",
         },
         {
            id: 3,
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            title: "Impacto urbano",
            date: "2024-01-09",
         },
         {
            id: 4,
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            title: "Área de intervenção",
            date: "2024-01-11",
         },
         {
            id: 5,
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
            title: "Plantio urbano",
            date: "2024-01-13",
         },
         {
            id: 6,
            url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
            title: "Educação ambiental",
            date: "2024-01-14",
         },
         {
            id: 7,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Comunidade engajada",
            date: "2024-01-16",
         },
         {
            id: 8,
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
            title: "Resultados",
            date: "2024-01-17",
         },
         {
            id: 9,
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            title: "Monitoramento",
            date: "2024-01-18",
         },
         {
            id: 10,
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
            title: "Progresso",
            date: "2024-01-19",
         },
         {
            id: 11,
            url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
            title: "Sustentabilidade",
            date: "2024-01-20",
         },
         {
            id: 12,
            url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=400",
            title: "Futuro verde",
            date: "2024-01-21",
         },
      ],
   };

   // Função para abrir galeria de fotos
   const handlePhotoGalleryOpen = (zoneKey) => {
      setSelectedZonePhotos(zoneKey);
      setShowPhotoGallery(true);
   };

   // Função para fechar galeria de fotos
   const handlePhotoGalleryClose = () => {
      setShowPhotoGallery(false);
      setSelectedZonePhotos(null);
   };

   // Segunda coluna - Explorar Região
   const exploreFeatures = [
      {
         title: "Localização e Bacia Hidrográfica",
         description: `Santa Cruz do Sul, RS (-29.7175, -52.4264) - Área total: ${communityStats.totalArea}`,
         icon: <Globe className="w-8 h-8" />,
         gradient: "from-teal-500 to-green-500",
      },
      {
         title: "Uso e Ocupação do Solo",
         description: `NDVI atual: ${communityStats.ndviCurrent} - Status: ${communityStats.healthStatus}`,
         icon: <TrendingUp className="w-8 h-8" />,
         gradient: "from-orange-500 to-red-500",
      },
      {
         title: "Engajamento da Região",
         description: `${regionEngagement.watchers} observadores e ${regionEngagement.activeUsers} usuários ativos`,
         icon: <Users className="w-8 h-8" />,
         gradient: "from-pink-500 to-rose-500",
      },
      {
         title: "Fauna e Flora",
         description:
            "Corredor Jacuí-Taquari com fragmentos urbanos e conexões rurais",
         icon: <Leaf className="w-8 h-8" />,
         gradient: "from-green-600 to-emerald-600",
      },
   ];

   // Terceira coluna - Plano de Ação
   const actionFeatures = [
      {
         title: "Recomendações Inteligentes",
         description: `Última atualização: ${
            communityStats.lastUpdate
         } - ${communityStats.organizations.toLocaleString()} organizações envolvidas`,
         icon: <Target className="w-8 h-8" />,
         gradient: "from-yellow-500 to-amber-500",
      },
      {
         title: "Monitoramento de Zonas",
         description: `Zona A: ${zoneActivities["zona-a"].reports}R/${zoneActivities["zona-a"].tracking}A/${zoneActivities["zona-a"].actions}Ações - Zona B: ${zoneActivities["zona-b"].reports}R/${zoneActivities["zona-b"].tracking}A/${zoneActivities["zona-b"].actions}Ações`,
         icon: <BarChart3 className="w-8 h-8" />,
         gradient: "from-green-500 to-emerald-500",
      },
      {
         title: "Áreas Degradadas",
         description: `Zona C: ${zoneActivities["zona-c"].reports} relatórios, ${zoneActivities["zona-c"].tracking} acompanhamentos, ${zoneActivities["zona-c"].actions} ação`,
         icon: <Heart className="w-8 h-8" />,
         gradient: "from-red-500 to-pink-500",
      },
      {
         title: "Benchmarks Regionais",
         description: `Crescimento regional de ${regionEngagement.growthRate} no último mês com tendência positiva`,
         icon: <TrendingUp className="w-8 h-8" />,
         gradient: "from-blue-600 to-indigo-600",
      },
   ];

   return (
      <section
         ref={headerRef}
         id="features"
         data-section="exploracao"
         className="relative w-full min-h-screen bg-white py-2 overflow-hidden"
      >
         {/* Simple Background */}
         <SimpleBackground variant="subtle" />

         {/* Faixa branca de fundo para o header (full width) */}
         <div className="absolute top-0 left-0 right-0 h-20 bg-white z-0" />

         <div className="container mx-auto px-6 py-2 relative z-10">
            {/* Header */}
            <div
               ref={headerRef}
               className={`mb-8 transition-all duration-1000 ${
                  headerVisible
                     ? "opacity-100 translate-y-0"
                     : "opacity-0 translate-y-10"
               }`}
            >
               {/* Topbar da Plataforma: Logo à esquerda + Dropdowns à direita */}
               <div className="mb-4 flex items-center justify-between  bg-white">
                  {/* Logo */}
                  <Link to="/" className="flex items-center gap-1">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-bee-icon lucide-bee"
                     >
                        <path d="m8 2 1.88 1.88" stroke="#2f4538" />
                        <path d="M14.12 3.88 16 2" stroke="#2f4538" />
                        <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="#2f4538" />
                        <path
                           d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z"
                           stroke="#2f4538"
                        />
                        <path d="M7.56 12h8.87" stroke="#2f4538" />
                        <path d="M7.5 17h9" stroke="#2f4538" />
                        <path
                           d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3"
                           stroke="#2f4538"
                        />
                     </svg>
                     <span
                        className="text-xl font-medium text-[#2f4538]"
                        style={{ fontFamily: '"Fraunces", serif' }}
                     >
                        orbee
                     </span>
                  </Link>

                  {/* Ações: Filtro + Seleção */}
                  <div className="flex items-center gap-2 sm:gap-3">
                     {(() => {
                        const totalAll = Object.values(zoneCardsData).length;
                        const totalMonitored = Object.values(
                           zoneCardsData
                        ).filter(
                           (zone) => zoneStatus[zone.id]?.isMonitored
                        ).length;
                        const totalReported = Object.values(
                           zoneCardsData
                        ).filter(
                           (zone) => zoneStatus[zone.id]?.hasReport
                        ).length;
                        const totalRegistered = Object.values(
                           zoneCardsData
                        ).filter(
                           (zone) => zoneStatus[zone.id]?.hasUserRegistration
                        ).length;

                        const currentLabel =
                           activeFilter === "all"
                              ? `Todas (${totalAll})`
                              : activeFilter === "monitored"
                                ? `Monitoradas (${totalMonitored})`
                                : activeFilter === "reported"
                                  ? `Com Relatório (${totalReported})`
                                  : `Com Registro (${totalRegistered})`;

                        return (
                           <div className="relative inline-block text-left">
                              <button
                                 onClick={() => setIsFilterOpen((v) => !v)}
                                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                              >
                                 <span className="flex items-center gap-1.5">
                                    {activeFilter === "all" && (
                                       <Globe className="h-3 w-3" />
                                    )}
                                    {activeFilter === "monitored" && (
                                       <Eye className="h-3 w-3" />
                                    )}
                                    {activeFilter === "reported" && (
                                       <FileText className="h-3 w-3" />
                                    )}
                                    {activeFilter === "registered" && (
                                       <Plus className="h-3 w-3" />
                                    )}
                                    <span>
                                       {activeFilter === "all"
                                          ? "Todas"
                                          : activeFilter === "monitored"
                                            ? "Monitoradas"
                                            : activeFilter === "reported"
                                              ? "Com Relatório"
                                              : "Com Registro"}
                                    </span>
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs text-gray-600">
                                       {activeFilter === "all"
                                          ? totalAll
                                          : activeFilter === "monitored"
                                            ? totalMonitored
                                            : activeFilter === "reported"
                                              ? totalReported
                                              : totalRegistered}
                                    </span>
                                 </span>
                                 <svg
                                    className="ml-1 h-3 w-3 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </button>
                              {isFilterOpen && (
                                 <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
                                    <div className="py-1 text-sm text-gray-700">
                                       <button
                                          onClick={() => {
                                             setActiveFilter("all");
                                             setIsFilterOpen(false);
                                          }}
                                          className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "all" ? "bg-[#2f4538]/10" : ""}`}
                                       >
                                          <span className="flex items-center gap-2">
                                             <Globe className="h-4 w-4" />
                                             Todas
                                          </span>
                                          <span className="text-gray-500">
                                             {totalAll}
                                          </span>
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveFilter("monitored");
                                             setIsFilterOpen(false);
                                          }}
                                          className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "monitored" ? "bg-blue-500/10" : ""}`}
                                       >
                                          <span className="flex items-center gap-2">
                                             <Eye className="h-4 w-4" />
                                             Monitoradas
                                          </span>
                                          <span className="text-gray-500">
                                             {totalMonitored}
                                          </span>
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveFilter("reported");
                                             setIsFilterOpen(false);
                                          }}
                                          className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "reported" ? "bg-yellow-500/10" : ""}`}
                                       >
                                          <span className="flex items-center gap-2">
                                             <FileText className="h-4 w-4" />
                                             Com Relatório
                                          </span>
                                          <span className="text-gray-500">
                                             {totalReported}
                                          </span>
                                       </button>
                                       <button
                                          onClick={() => {
                                             setActiveFilter("registered");
                                             setIsFilterOpen(false);
                                          }}
                                          className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "registered" ? "bg-green-500/10" : ""}`}
                                       >
                                          <span className="flex items-center gap-2">
                                             <Plus className="h-4 w-4" />
                                             Com Registro
                                          </span>
                                          <span className="text-gray-500">
                                             {totalRegistered}
                                          </span>
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     })()}

                     {/* Dropdown Seleção */}
                     <div className="relative inline-block text-left">
                        <button
                           onClick={() => setIsSelectionOpen((v) => !v)}
                           className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                        >
                           <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs text-gray-600">
                              {selectedZones.length}
                           </span>
                           <span className="hidden sm:inline">
                              Zonas selecionadas
                           </span>
                           <span className="sm:hidden">Selecionadas</span>
                           <svg
                              className="ml-1 h-3 w-3 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </button>
                        {isSelectionOpen && (
                           <div className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
                              <div className="py-1 text-sm text-gray-700">
                                 <div className="px-3 py-2 text-xs text-gray-500">
                                    {selectedZones.length} zona
                                    {selectedZones.length !== 1 ? "s" : ""}{" "}
                                    selecionada
                                    {selectedZones.length !== 1 ? "s" : ""}
                                 </div>
                                 <button
                                    onClick={() => {
                                       handleSelectAllZones();
                                       setIsSelectionOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50"
                                 >
                                    <span className="flex items-center gap-2">
                                       <Check className="h-4 w-4 text-[#2f4538]" />
                                       {filteredZones.every((zone) =>
                                          selectedZones.includes(zone.id)
                                       )
                                          ? "Desmarcar Todas"
                                          : "Selecionar Todas"}
                                    </span>
                                    <span className="text-gray-500">
                                       {filteredZones.length}
                                    </span>
                                 </button>
                                 <div className="my-1 h-px bg-gray-100" />
                                 <button
                                    disabled={selectedZones.length === 0}
                                    onClick={() => {
                                       setShowExportModal(true);
                                       setIsSelectionOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${selectedZones.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                                 >
                                    <span className="flex items-center gap-2">
                                       <FileText className="h-4 w-4 text-blue-600" />
                                       Relatório
                                    </span>
                                    <span className="text-gray-500">
                                       {selectedZones.length}
                                    </span>
                                 </button>
                                 <button
                                    disabled={selectedZones.length === 0}
                                    onClick={() => {
                                       setShowTrackingModal(true);
                                       setIsSelectionOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${selectedZones.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                                 >
                                    <span className="flex items-center gap-2">
                                       <Eye className="h-4 w-4 text-yellow-600" />
                                       Acompanhar
                                    </span>
                                    <span className="text-gray-500">
                                       {selectedZones.length}
                                    </span>
                                 </button>
                                 <button
                                    disabled={selectedZones.length === 0}
                                    onClick={() => {
                                       setShowActionModal(true);
                                       setIsSelectionOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${selectedZones.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                                 >
                                    <span className="flex items-center gap-2">
                                       <Plus className="h-4 w-4 text-green-600" />
                                       Registrar
                                    </span>
                                    <span className="text-gray-500">
                                       {selectedZones.length}
                                    </span>
                                 </button>
                                 <div className="my-1 h-px bg-gray-100" />
                                 <button
                                    onClick={() => {
                                       setSelectedZones([]);
                                       setIsSelectionOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50"
                                 >
                                    <span className="flex items-center gap-2">
                                       <X className="h-4 w-4 text-gray-600" />
                                       Limpar seleção
                                    </span>
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Botão de Pesquisa */}
                     <button
                        onClick={() => setShowSearchModal(true)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                        aria-label="Pesquisar"
                        title="Pesquisar"
                     >
                        <Search className="h-4 w-4" />
                     </button>
                     {/* Avatar / Perfil */}
                     <Link
                        to="/profile"
                        title={user?.name || "Perfil"}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-xs font-semibold text-gray-700 hover:ring-2 hover:ring-[#2f4538]/30"
                        aria-label="Abrir perfil"
                     >
                        {user?.avatarUrl ? (
                           // eslint-disable-next-line jsx-a11y/alt-text
                           <img
                              src={user.avatarUrl}
                              className="h-full w-full object-cover"
                           />
                        ) : (
                           <span>{(user?.name?.[0] || "U").toUpperCase()}</span>
                        )}
                     </Link>
                  </div>
               </div>
               {/* Plano de Ação - Cards Interativos */}

               <div
                  ref={featuresRef}
                  className={`mb-16 transition-all duration-1000 delay-300 ${
                     featuresVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                  }`}
               >
                  <div className="mb-8">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                        <div>
                           <h3
                              className="text-xl sm:text-2xl font-bold text-[#2f4538] mb-2 flex items-center"
                              style={{
                                 fontFamily: '"Fraunces", serif',
                              }}
                           >
                              Áreas Prioritárias para Ação
                           </h3>
                           <p className="text-gray-600 text-xs sm:text-sm">
                              Clique nos cards para explorar recomendações para
                              cada zona
                           </p>

                           {/* Filtros movidos para o header da plataforma */}
                        </div>

                        {/* Controles de Seleção movidos para o header da plataforma */}
                     </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                     {(actionPlan?.zones || filteredZones).map((zone) => (
                        <ZoneCard
                           key={zone.id}
                           zone={zone.id}
                           zoneData={zone}
                           selectedZone={selectedZone}
                           selectedZones={selectedZones}
                           zoneActivities={zoneActivities}
                           onZoneClick={handleZoneClick}
                           onZoneToggle={handleZoneToggle}
                           onPhotoGalleryOpen={handlePhotoGalleryOpen}
                        />
                     ))}
                  </div>

                  {/* Mensagem quando não há zonas filtradas */}
                  {filteredZones.length === 0 && (
                     <div className="text-center py-12">
                        <div className="text-gray-500 text-sm">
                           Nenhuma zona encontrada para o filtro selecionado.
                        </div>
                     </div>
                  )}

                  {/* Seção de Recomendações Detalhadas */}
                  <AnimatePresence mode="wait">
                     {selectedZone && zoneData[selectedZone] && (
                        <motion.div
                           key={selectedZone}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className="mt-12 p-6 bg-white/90 border border-[#2f4538]/20 rounded-xl shadow-xl backdrop-blur-xl"
                        >
                           <div className="mb-6">
                              <h3
                                 className="text-2xl font-bold text-[#2f4538] mb-4 flex items-center"
                                 style={{
                                    fontFamily:
                                       '"PP Fragment Glare Regular", "PP Fragment Glare", serif',
                                 }}
                              >
                                 <Leaf className="mr-3 h-6 w-6 text-[#2f4538]" />
                                 Recomendações - {zoneData[selectedZone].name}
                              </h3>
                           </div>

                           {/* Layout com Mapa de Satélite e Informações */}
                           <div className="grid gap-6 lg:grid-cols-2">
                              {/* Coluna Esquerda - Informações */}
                              <div className="space-y-6">
                                 {/* Espécies Nativas */}
                                 <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="group relative overflow-hidden rounded-xl border border-green-400/20 hover:border-green-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-green-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    <div className="relative z-10">
                                       <div className="flex items-center justify-between mb-4">
                                          <h4 className="text-lg font-semibold text-gray-900">
                                             <Leaf className="inline-block mr-2 h-5 w-5 text-green-600" />{" "}
                                             Espécies Nativas
                                          </h4>
                                          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-600">
                                             Recomendado
                                          </span>
                                       </div>
                                       <ul className="space-y-2 text-gray-600">
                                          {zoneData[
                                             selectedZone
                                          ].nativeSpecies.map(
                                             (species, index) => (
                                                <li
                                                   key={index}
                                                   className="flex justify-between items-center bg-green-500/5 p-2 rounded-md"
                                                >
                                                   <span className="text-sm">
                                                      {species.name}
                                                   </span>
                                                   <span className="text-xs font-medium text-green-600 rounded-full px-2 py-0.5 bg-green-500/10">
                                                      {species.type}
                                                   </span>
                                                </li>
                                             )
                                          )}
                                          <li className="text-sm text-gray-500 mt-2">
                                             15 espécies resistentes à seca
                                          </li>
                                       </ul>
                                    </div>
                                 </motion.div>

                                 {/* Métricas Esperadas */}
                                 <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="group relative overflow-hidden rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    <div className="relative z-10">
                                       <div className="flex items-center justify-between mb-4">
                                          <h4 className="text-lg font-semibold text-gray-900">
                                             <BarChart3 className="inline-block mr-2 h-5 w-5 text-yellow-600" />{" "}
                                             Métricas Esperadas
                                          </h4>
                                          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-600">
                                             24 meses
                                          </span>
                                       </div>
                                       <div className="space-y-2 text-gray-600">
                                          <div className="flex justify-between items-center">
                                             <span>NDVI Alvo</span>
                                             <span className="font-medium text-yellow-600">
                                                {
                                                   zoneData[selectedZone]
                                                      .expectedMetrics
                                                      .ndviTarget
                                                }
                                             </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                             <span>Cobertura Vegetal</span>
                                             <span className="font-medium text-yellow-600">
                                                {
                                                   zoneData[selectedZone]
                                                      .expectedMetrics
                                                      .vegetationCover
                                                }
                                             </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                             <span>Carbono Sequestrado</span>
                                             <span className="font-medium text-yellow-600">
                                                {
                                                   zoneData[selectedZone]
                                                      .expectedMetrics
                                                      .carbonSequestered
                                                }
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </motion.div>

                                 {/* Cronograma */}
                                 <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="group relative overflow-hidden rounded-xl border border-purple-400/20 hover:border-purple-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    <div className="relative z-10">
                                       <div className="flex items-center justify-between mb-4">
                                          <h4 className="text-lg font-semibold text-gray-900">
                                             <Activity className="inline-block mr-2 h-5 w-5 text-purple-600" />{" "}
                                             Cronograma
                                          </h4>
                                          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-600">
                                             Faseado
                                          </span>
                                       </div>
                                       <ul className="space-y-2 text-gray-600">
                                          {zoneData[selectedZone].timeline.map(
                                             (item, index) => (
                                                <li
                                                   key={index}
                                                   className="flex justify-between items-center bg-purple-500/5 p-2 rounded-md"
                                                >
                                                   <span className="text-sm">
                                                      {item.phase}
                                                   </span>
                                                   <span className="font-medium text-purple-600 text-xs">
                                                      {item.duration}
                                                   </span>
                                                </li>
                                             )
                                          )}
                                       </ul>
                                    </div>
                                 </motion.div>
                              </div>

                              {/* Coluna Direita - Mapa de Satélite */}
                              <motion.div
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: 0.2 }}
                                 className="group relative overflow-hidden rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
                              >
                                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                 <div className="relative z-10">
                                    <div className="mb-3 flex items-center justify-between">
                                       <h5 className="text-sm font-semibold text-gray-900">
                                          <Globe className="inline-block mr-2 h-5 w-5 text-emerald-600" />{" "}
                                          Imagem de Satélite
                                       </h5>
                                       <div className="flex items-center gap-2">
                                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                          <span className="text-xs text-emerald-600">
                                             Ao vivo
                                          </span>
                                       </div>
                                    </div>

                                    {/* Container do Mapa */}
                                    <div className="relative aspect-square overflow-hidden rounded-lg border border-emerald-400/30">
                                       {/* Simulação de Mapa de Satélite */}
                                       <div
                                          className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-600 to-green-900"
                                          style={{
                                             backgroundImage: `
                            radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 70% 60%, rgba(22, 163, 74, 0.4) 0%, transparent 40%),
                            radial-gradient(circle at 20% 80%, rgba(21, 128, 61, 0.3) 0%, transparent 30%),
                            linear-gradient(45deg, rgba(5, 46, 22, 0.8) 0%, rgba(22, 101, 52, 0.6) 100%)
                          `,
                                          }}
                                       >
                                          {/* Overlay de textura para simular imagem de satélite */}
                                          <div
                                             className="absolute inset-0 opacity-40 mix-blend-overlay"
                                             style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='satelliteNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23satelliteNoise)'/%3E%3C/svg%3E")`,
                                                backgroundSize: "128px 128px",
                                             }}
                                          />

                                          {/* Marcador da Zona */}
                                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                             <div className="relative">
                                                {/* Pulso animado */}
                                                <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></div>
                                                <div className="relative h-4 w-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
                                             </div>
                                          </div>

                                          {/* Informações sobrepostas */}
                                          <div className="absolute bottom-2 left-2 right-2">
                                             <div className="rounded bg-black/70 p-2 text-xs text-white backdrop-blur-sm">
                                                <div className="mb-1 flex items-center justify-between">
                                                   <span className="text-emerald-300">
                                                      NDVI:
                                                   </span>
                                                   <span className="font-mono text-red-300">
                                                      {selectedZone === "A" &&
                                                         "0.32"}
                                                      {selectedZone === "B" &&
                                                         "0.28"}
                                                      {selectedZone === "C" &&
                                                         "0.45"}
                                                   </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                   <span className="text-emerald-300">
                                                      Zoom:
                                                   </span>
                                                   <span className="text-white">
                                                      15x
                                                   </span>
                                                </div>
                                             </div>
                                          </div>

                                          {/* Legenda NDVI */}
                                          <div className="absolute right-2 top-2">
                                             <div className="rounded bg-black/70 p-2 text-xs text-white backdrop-blur-sm">
                                                <div className="mb-1 text-emerald-300">
                                                   Legenda NDVI
                                                </div>
                                                <div className="space-y-1">
                                                   <div className="flex items-center gap-2">
                                                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                      <span>Crítico</span>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                      <span>Moderado</span>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                      <span>Bom</span>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                      <span>Excelente</span>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Informações técnicas do satélite */}
                                    <div className="mt-3 space-y-2 text-xs">
                                       <div className="flex justify-between text-gray-500">
                                          <span>Satélite:</span>
                                          <span className="text-emerald-600">
                                             Sentinel-2
                                          </span>
                                       </div>
                                       <div className="flex justify-between text-gray-500">
                                          <span>Resolução:</span>
                                          <span className="text-emerald-600">
                                             10m/pixel
                                          </span>
                                       </div>
                                       <div className="flex justify-between text-gray-500">
                                          <span>Última captura:</span>
                                          <span className="text-emerald-600">
                                             15/01/2024
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </motion.div>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* Modal de Exportação de Relatório */}
         <AnimatePresence>
            {showExportModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowExportModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                           Gerar Relatório
                        </h3>
                        <button
                           onClick={() => setShowExportModal(false)}
                           className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>

                     <div className="mb-4">
                        <p className="text-sm text-slate-300 mb-3">
                           Zonas selecionadas para relatório:
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {selectedZones.map((zone) => (
                              <span
                                 key={zone}
                                 className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300"
                              >
                                 Zona {zone}
                              </span>
                           ))}
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                           Tipo de Relatório
                        </label>
                        <select className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white focus:border-blue-500 focus:outline-none">
                           <option>Relatório Completo</option>
                           <option>Análise NDVI</option>
                           <option>Status de Degradação</option>
                           <option>Recomendações</option>
                        </select>
                     </div>

                     <div className="flex gap-3">
                        <button
                           onClick={() => setShowExportModal(false)}
                           className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600"
                        >
                           Cancelar
                        </button>
                        <button
                           onClick={() => {
                              // Lógica para gerar relatório
                              setShowExportModal(false);
                           }}
                           className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                           Gerar Relatório
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal de Pesquisa */}
         <Modal
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
            title="Pesquisar"
            size="md"
         >
            <div className="mb-4">
               <label className="mb-2 block text-sm font-medium text-slate-300">
                  Buscar zona
               </label>
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite o nome ou ID da zona (ex: A, B, C)"
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
               />
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-700">
               {Object.values(zoneCardsData)
                  .filter((z) => {
                     if (!searchQuery) return true;
                     const q = searchQuery.toLowerCase();
                     return (
                        z.name.toLowerCase().includes(q) ||
                        z.id.toLowerCase().includes(q)
                     );
                  })
                  .map((z) => (
                     <button
                        key={z.id}
                        onClick={() => {
                           setSelectedZone(z.id);
                           setShowSearchModal(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700/60"
                     >
                        <span className="flex items-center gap-2">
                           <span
                              className={`h-2 w-2 rounded-full ${z.color === "red" ? "bg-red-500" : z.color === "orange" ? "bg-orange-500" : "bg-yellow-500"}`}
                           ></span>
                           <span className="font-medium">{z.name}</span>
                        </span>
                        <span className="text-xs text-slate-400">
                           ID: {z.id}
                        </span>
                     </button>
                  ))}
            </div>

            <Modal.Footer>
               <Modal.Button
                  variant="secondary"
                  onClick={() => setShowSearchModal(false)}
               >
                  Fechar
               </Modal.Button>
            </Modal.Footer>
         </Modal>

         {/* Modal de Acompanhamento */}
         <Modal
            isOpen={showTrackingModal}
            onClose={() => setShowTrackingModal(false)}
            title="Configurar Acompanhamento"
            size="md"
         >
            <div className="mb-4">
               <p className="text-sm text-slate-300 mb-3">
                  Zonas para acompanhamento:
               </p>
               <div className="flex flex-wrap gap-2">
                  {selectedZones.map((zone) => (
                     <span
                        key={zone}
                        className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300"
                     >
                        Zona {zone}
                     </span>
                  ))}
               </div>
            </div>

            <div className="mb-4">
               <label className="mb-2 block text-sm font-medium text-slate-300">
                  Frequência
               </label>
               <select className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white focus:border-yellow-500 focus:outline-none">
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                  <option>Trimestral</option>
               </select>
            </div>

            <div className="mb-6">
               <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tipo de Alerta
               </label>
               <div className="space-y-2">
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 rounded"
                        defaultChecked
                     />
                     <span className="text-sm text-slate-300">
                        Mudanças no NDVI
                     </span>
                  </label>
                  <label className="flex items-center">
                     <input
                        type="checkbox"
                        className="mr-2 rounded"
                        defaultChecked
                     />
                     <span className="text-sm text-slate-300">
                        Degradação detectada
                     </span>
                  </label>
                  <label className="flex items-center">
                     <input type="checkbox" className="mr-2 rounded" />
                     <span className="text-sm text-slate-300">
                        Relatórios da comunidade
                     </span>
                  </label>
               </div>
            </div>

            <Modal.Footer>
               <Modal.Button
                  variant="secondary"
                  onClick={() => setShowTrackingModal(false)}
               >
                  Cancelar
               </Modal.Button>
               <Modal.Button
                  variant="primary"
                  onClick={() => {
                     // Lógica para configurar acompanhamento
                     setShowTrackingModal(false);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700"
               >
                  Configurar
               </Modal.Button>
            </Modal.Footer>
         </Modal>

         {/* Modal de Registro de Ação */}
         <AnimatePresence>
            {showActionModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowActionModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                           Registrar Ação
                        </h3>
                        <button
                           onClick={() => setShowActionModal(false)}
                           className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>

                     <div className="mb-4">
                        <p className="text-sm text-slate-300 mb-3">
                           Zonas para registro:
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {selectedZones.map((zone) => (
                              <span
                                 key={zone}
                                 className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300"
                              >
                                 Zona {zone}
                              </span>
                           ))}
                        </div>
                     </div>

                     <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                           Tipo de Ação
                        </label>
                        <select className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white focus:border-green-500 focus:outline-none">
                           <option>Reflorestamento</option>
                           <option>Manutenção</option>
                           <option>Monitoramento</option>
                           <option>Educação Ambiental</option>
                           <option>Parceria</option>
                        </select>
                     </div>

                     <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                           Título da Ação
                        </label>
                        <input
                           type="text"
                           placeholder="Ex: Plantio de mudas nativas"
                           className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none"
                        />
                     </div>

                     <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                           Descrição
                        </label>
                        <textarea
                           rows={3}
                           placeholder="Descreva a ação realizada..."
                           className="w-full rounded-lg border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none resize-none"
                        />
                     </div>

                     <div className="flex gap-3">
                        <button
                           onClick={() => setShowActionModal(false)}
                           className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600"
                        >
                           Cancelar
                        </button>
                        <button
                           onClick={() => {
                              // Lógica para registrar ação
                              setShowActionModal(false);
                           }}
                           className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                           Registrar
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modal da Galeria de Fotos */}
         <AnimatePresence>
            {showPhotoGallery && selectedZonePhotos && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  onClick={handlePhotoGalleryClose}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className="relative w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl overflow-hidden"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                           Fotos da{" "}
                           {zoneData[
                              selectedZonePhotos
                                 .replace("zona-", "")
                                 .toUpperCase()
                           ]?.name || "Zona"}
                        </h3>
                        <button
                           onClick={handlePhotoGalleryClose}
                           className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                           <X className="h-4 w-4" />
                        </button>
                     </div>

                     <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                           {zonePhotos[selectedZonePhotos]?.map((photo) => (
                              <div
                                 key={photo.id}
                                 className="group relative overflow-hidden rounded-lg border border-slate-600 bg-slate-700 transition-all hover:border-slate-500"
                              >
                                 <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                 <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h4 className="text-sm font-medium">
                                       {photo.title}
                                    </h4>
                                    <p className="text-xs text-slate-300">
                                       {photo.date}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {(!zonePhotos[selectedZonePhotos] ||
                           zonePhotos[selectedZonePhotos].length === 0) && (
                           <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                              <Camera className="h-12 w-12 mb-4" />
                              <p className="text-lg font-medium">
                                 Nenhuma foto disponível
                              </p>
                              <p className="text-sm">
                                 As fotos desta zona serão exibidas aqui quando
                                 disponíveis.
                              </p>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </section>
   );
};

export default Platform;
