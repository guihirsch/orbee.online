import React, { useState, useEffect, useRef } from "react";
import {
   Plus,
   Minus,
   Navigation,
   Layers,
   Share2,
   MessageSquarePlus,
   MapPin,
   X,
   AlertTriangle,
   Satellite,
   BarChart3,
   Bookmark,
   Search,
   User,
} from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function MapShortcuts({
   mapRef,
   baseLayer,
   setBaseLayer,
   criticalPoints,
   setShowCards,
   showCards,
   setShowAcompanhamentos,
   showAcompanhamentos,
   // Props para busca
   searchQuery,
   setSearchQuery,
   searchResults,
   setSearchResults,
   showSearchResults,
   setShowSearchResults,
   isSearching,
   navigateToLocation,
   selectedRegion,
   clearSelectedRegion,
}) {
   const { user, isAuthenticated, logout } = useAuth();
   const [showLayerMenu, setShowLayerMenu] = useState(false);
   const [showSatelliteInfo, setShowSatelliteInfo] = useState(false);
   const [showUserMenu, setShowUserMenu] = useState(false);
   const userMenuRef = useRef(null);

   // Estados para redimensionamento do painel de satélite
   const [satellitePanelWidth, setSatellitePanelWidth] = useState(() => {
      const saved = localStorage.getItem("orbee-satellite-panel-width");
      return saved ? parseInt(saved) : 320;
   });
   const [isSatelliteResizing, setIsSatelliteResizing] = useState(false);
   const [satelliteResizeStartX, setSatelliteResizeStartX] = useState(0);
   const [satelliteResizeStartWidth, setSatelliteResizeStartWidth] =
      useState(0);

   // Função para calcular número de colunas baseado na largura do painel de satélite
   const calculateSatelliteGridColumns = (width) => {
      // Largura mínima do card: 150px (menor que os cards de pontos críticos)
      // Padding: 24px (12px de cada lado)
      const availableWidth = width - 24;
      const cardMinWidth = 150;
      const gap = 12;

      // Calcular quantos cards cabem
      let columns = Math.floor(availableWidth / (cardMinWidth + gap));

      // Garantir pelo menos 1 coluna e no máximo 3
      columns = Math.max(1, Math.min(3, columns));

      return columns;
   };

   // Calcular colunas baseado na largura atual do painel de satélite
   const satelliteGridColumns =
      calculateSatelliteGridColumns(satellitePanelWidth);

   // Função para criar cards de estatísticas compactos
   const createStatCard = (title, value, icon, color, trend = null) => {
      return (
         <div
            className={`bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-200 ${color}`}
         >
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-xs font-medium text-gray-700">
                     {title}
                  </span>
               </div>
               {trend && (
                  <div
                     className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}
                  >
                     {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                  </div>
               )}
            </div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
         </div>
      );
   };

   // Função para zoom in
   const handleZoomIn = () => {
      if (mapRef.current) {
         mapRef.current.zoomIn({ duration: 300 });
      }
   };

   // Função para zoom out
   const handleZoomOut = () => {
      if (mapRef.current) {
         mapRef.current.zoomOut({ duration: 300 });
      }
   };

   // Função para centralizar no usuário (se geolocalização estiver disponível)
   const handleLocate = () => {
      if (navigator.geolocation && mapRef.current) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               mapRef.current.flyTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 15,
                  duration: 2000,
               });
            },
            (error) => {
               console.warn("Geolocation not available:", error);
               // Fallback: centralizar na área padrão
               mapRef.current.flyTo({
                  center: [-52.4264, -29.475],
                  zoom: 13,
                  duration: 2000,
               });
            }
         );
      } else if (mapRef.current) {
         // Fallback se geolocalização não estiver disponível
         mapRef.current.flyTo({
            center: [-52.4264, -29.475],
            zoom: 13,
            duration: 2000,
         });
      }
   };

   // Função para alternar visibilidade dos pontos críticos
   const toggleCriticalPoints = () => {
      if (
         mapRef.current &&
         mapRef.current.getLayer("critical-points-symbols")
      ) {
         const visibility = mapRef.current.getLayoutProperty(
            "critical-points-symbols",
            "visibility"
         );
         mapRef.current.setLayoutProperty(
            "critical-points-symbols",
            "visibility",
            visibility === "visible" ? "none" : "visible"
         );
      }
   };

   // Função para compartilhar localização atual
   const handleShare = () => {
      if (mapRef.current) {
         const center = mapRef.current.getCenter();
         const zoom = mapRef.current.getZoom();
         const url = `${window.location.origin}${window.location.pathname}?lat=${center.lat}&lng=${center.lng}&zoom=${zoom}`;

         if (navigator.share) {
            navigator.share({
               title: "Location on map - Orbee",
               text: "See this location on the Orbee map",
               url: url,
            });
         } else {
            navigator.clipboard.writeText(url).then(() => {
               alert("Link copied to clipboard!");
            });
         }
      }
   };

   // Função para feedback
   const handleFeedback = () => {
      const feedback = prompt("Deixe seu feedback sobre o mapa:");
      if (feedback) {
         alert("Obrigado pelo seu feedback!");
      }
   };

   // Função para mostrar informações de satélite e resumo
   const handleSatelliteInfo = () => {
      setShowSatelliteInfo(!showSatelliteInfo);
   };

   // Função para abrir painel de pontos críticos
   const handleOpenCriticalPoints = () => {
      setShowCards(true);
      setShowSatelliteInfo(false); // Fechar modal de satélite quando abrir pontos críticos
      setShowAcompanhamentos(false); // Fechar acompanhamentos quando abrir pontos críticos
   };

   // Função para abrir painel de acompanhamentos
   const handleOpenAcompanhamentos = () => {
      setShowAcompanhamentos(true);
      setShowCards(false); // Fechar pontos críticos quando abrir acompanhamentos
      setShowSatelliteInfo(false); // Fechar modal de satélite quando abrir acompanhamentos
   };

   // Funções para redimensionamento do painel de satélite
   const handleSatelliteResizeStart = (e) => {
      e.preventDefault();
      setIsSatelliteResizing(true);
      setSatelliteResizeStartX(e.clientX);
      setSatelliteResizeStartWidth(satellitePanelWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
   };

   const handleSatelliteResizeMove = (e) => {
      if (!isSatelliteResizing) return;
      e.preventDefault();

      const deltaX = e.clientX - satelliteResizeStartX;
      const newWidth = Math.max(
         280,
         Math.min(800, satelliteResizeStartWidth + deltaX)
      );
      setSatellitePanelWidth(newWidth);

      // Adicionar feedback visual durante o redimensionamento
      if (newWidth <= 300) {
         document.body.style.cursor = "ew-resize";
      } else if (newWidth >= 750) {
         document.body.style.cursor = "ew-resize";
      }
   };

   const handleSatelliteResizeEnd = () => {
      if (!isSatelliteResizing) return;

      setIsSatelliteResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      localStorage.setItem(
         "orbee-satellite-panel-width",
         satellitePanelWidth.toString()
      );
   };

   // Event listeners para redimensionamento do painel de satélite
   React.useEffect(() => {
      if (isSatelliteResizing) {
         document.addEventListener("mousemove", handleSatelliteResizeMove);
         document.addEventListener("mouseup", handleSatelliteResizeEnd);
         return () => {
            document.removeEventListener(
               "mousemove",
               handleSatelliteResizeMove
            );
            document.removeEventListener("mouseup", handleSatelliteResizeEnd);
         };
      }
   }, [
      isSatelliteResizing,
      satelliteResizeStartX,
      satelliteResizeStartWidth,
      satellitePanelWidth,
   ]);

   // Fechar dropdown do usuário ao clicar fora
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (
            showUserMenu &&
            userMenuRef.current &&
            !userMenuRef.current.contains(e.target)
         ) {
            setShowUserMenu(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [showUserMenu]);

   return (
      <>
         {/* Atalhos do Mapa - Lado Direito */}
         <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
            {/* Botão de Busca - Acima do zoom */}
            <div className="relative search-container">
               <button
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className={`w-10 h-10 backdrop-blur-sm border rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative ${
                     selectedRegion
                        ? "bg-white border-[#2f4538] text-[#2f4538] hover:bg-[#2f4538]/5"
                        : "bg-white/95 border-gray-100 hover:bg-white text-gray-700 hover:border-gray-200"
                  }`}
                  style={{
                     borderColor: selectedRegion ? "#2f4538" : undefined,
                     color: selectedRegion ? "#2f4538" : undefined,
                  }}
                  title={
                     selectedRegion
                        ? `Região selecionada: ${selectedRegion.municipality}`
                        : "Search municipality"
                  }
               >
                  <Search className="h-4 w-4" />

                  {/* Ícone X para limpar seleção */}
                  {selectedRegion && (
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           clearSelectedRegion();
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[#2f4538] text-white rounded-full flex items-center justify-center hover:bg-[#2f4538]/80 transition-colors duration-200 z-10"
                        title="Clear selection"
                     >
                        <X className="h-2.5 w-2.5" />
                     </button>
                  )}
               </button>

               {/* Modal de Busca */}
               {showSearchResults && (
                  <div className="absolute right-12 top-0 w-80 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg z-50 search-container">
                     {/* Header do Modal */}
                     <div className="px-4 py-3 border-b border-gray-200/50">
                        <div className="flex items-center justify-between">
                           <h3 className="text-sm font-semibold text-gray-900">
                              Buscar Município
                           </h3>
                           <button
                              onClick={() => {
                                 setShowSearchResults(false);
                                 setSearchQuery("");
                                 setSearchResults([]);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                           >
                              <X className="h-4 w-4 text-gray-500" />
                           </button>
                        </div>
                     </div>

                     {/* Input de Busca */}
                     <div className="p-4">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                           <input
                              type="text"
                              placeholder="Type municipality name..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-400/40 transition-all duration-200"
                              autoFocus
                           />
                           {searchQuery && (
                              <button
                                 onClick={() => {
                                    setSearchQuery("");
                                    setSearchResults([]);
                                 }}
                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           )}
                        </div>
                     </div>

                     {/* Resultados da Busca */}
                     {searchResults.length > 0 && (
                        <div className="max-h-60 overflow-y-auto border-t border-gray-200/50">
                           {searchResults.map((result, index) => (
                              <button
                                 key={result.id}
                                 onClick={() => navigateToLocation(result)}
                                 className="w-full px-4 py-3 text-left hover:bg-gray-50/80 transition-colors duration-200 first:rounded-t-none last:rounded-b-xl"
                              >
                                 <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                       <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                                          <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                       </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="text-sm font-medium text-gray-900 truncate">
                                          {result.municipality}
                                       </div>
                                       <div className="text-xs text-gray-500 truncate mt-1">
                                          {result.state}
                                       </div>
                                    </div>
                                    {index === 0 && (
                                       <div className="flex-shrink-0">
                                          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                             Recomendado
                                          </span>
                                       </div>
                                    )}
                                 </div>
                              </button>
                           ))}
                        </div>
                     )}

                     {/* Loading indicator */}
                     {isSearching && (
                        <div className="px-4 py-4 text-center border-t border-gray-200/50">
                           <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                              Buscando...
                           </div>
                        </div>
                     )}

                     {/* Estado vazio */}
                     {!isSearching &&
                        searchResults.length === 0 &&
                        searchQuery && (
                           <div className="px-4 py-4 text-center border-t border-gray-200/50">
                              <div className="text-sm text-gray-500">
                                 Nenhum município encontrado
                              </div>
                           </div>
                        )}
                  </div>
               )}
            </div>

            {/* Grupo 1: Controles de Zoom */}
            <div className="flex flex-col gap-2">
               <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                  title="Aumentar zoom"
               >
                  <Plus className="h-4 w-4" />
               </button>

               <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                  title="Diminuir zoom"
               >
                  <Minus className="h-4 w-4" />
               </button>

               <button
                  onClick={handleLocate}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                  title="My location"
               >
                  <Navigation className="h-4 w-4" />
               </button>
            </div>

            {/* Grupo 2: Controles de Camada e Informação */}
            <div className="flex flex-col gap-2">
               <div className="relative">
                  <button
                     onClick={() => setShowLayerMenu(!showLayerMenu)}
                     className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                     title="Camadas do mapa"
                  >
                     <Layers className="h-4 w-4" />
                  </button>

                  {/* Menu de Camadas */}
                  {showLayerMenu && (
                     <div className="absolute right-12 top-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 py-2 min-w-48">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-600 border-b border-gray-100">
                           Camadas Base
                        </div>
                        <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                           <input
                              type="radio"
                              name="baseLayer"
                              checked={baseLayer === "osm"}
                              onChange={() => setBaseLayer("osm")}
                              className="w-3 h-3"
                           />
                           <span className="text-sm">OpenStreetMap</span>
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                           <input
                              type="radio"
                              name="baseLayer"
                              checked={baseLayer === "sat"}
                              onChange={() => setBaseLayer("sat")}
                              className="w-3 h-3"
                           />
                           <span className="text-sm">Satélite</span>
                        </label>
                     </div>
                  )}
               </div>

               <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                  title="Share location"
               >
                  <Share2 className="h-4 w-4" />
               </button>
            </div>

            {/* Grupo 3: Interação */}
            <div className="flex flex-col gap-2">
               <button
                  onClick={handleFeedback}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                  title="Enviar feedback"
               >
                  <MessageSquarePlus className="h-4 w-4" />
               </button>

               <div className="relative" ref={userMenuRef}>
                  <button
                     onClick={() => setShowUserMenu((v) => !v)}
                     className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-100 hover:bg-white text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-gray-200"
                     title="User profile"
                  >
                     <User className="h-4 w-4" />
                  </button>
                  {showUserMenu && (
                     <div className="absolute right-12 top-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 py-2 min-w-40 z-50">
                        <div className="px-3 py-2 text-xs text-gray-600 border-b border-gray-100">
                           {isAuthenticated && user?.email
                              ? user.email
                              : "Conta"}
                        </div>

                        {isAuthenticated ? (
                           <button
                              onClick={() => {
                                 try {
                                    logout();
                                 } finally {
                                    setShowUserMenu(false);
                                    window.location.href = "/";
                                 }
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
                           >
                              Sair
                           </button>
                        ) : (
                           <button
                              onClick={() => {
                                 setShowUserMenu(false);
                                 window.location.href = "/profile";
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                           >
                              Entrar
                           </button>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Modal de Informações de Satélite e Resumo */}
         {showSatelliteInfo && !showCards && (
            <div
               className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 z-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-h-[calc(100vh-100px)] flex flex-col relative"
               style={{ width: `${satellitePanelWidth}px` }}
            >
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                     <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Satellite className="h-4 w-4 text-blue-600" />
                        Informações de Satélite
                     </h3>
                  </div>
                  <button
                     onClick={() => setShowSatelliteInfo(false)}
                     className="text-gray-400 hover:text-gray-600"
                  >
                     <X className="h-4 w-4" />
                  </button>
               </div>

               {/* Área Scrollável do Conteúdo */}
               <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                  {/* Grid de Cards de Estatísticas */}
                  <div
                     className="grid gap-3 mb-4 transition-all duration-300 ease-in-out"
                     style={{
                        gridTemplateColumns: `repeat(${satelliteGridColumns}, 1fr)`,
                        gridAutoRows: "minmax(120px, auto)",
                     }}
                  >
                     {/* Card de Total de Pontos */}
                     {createStatCard(
                        "Total de Pontos",
                        criticalPoints.length.toString(),
                        <BarChart3 className="h-4 w-4 text-blue-600" />,
                        "border-blue-200 bg-blue-50/50",
                        "up"
                     )}

                     {/* Card de Pontos Críticos */}
                     {createStatCard(
                        "Critical",
                        criticalPoints
                           .filter((p) => p.properties.severity === "critical")
                           .length.toString(),
                        <AlertTriangle className="h-4 w-4 text-red-600" />,
                        "border-red-200 bg-red-50/50",
                        "down"
                     )}

                     {/* Card de Pontos Moderados */}
                     {createStatCard(
                        "Moderados",
                        criticalPoints
                           .filter((p) => p.properties.severity === "moderate")
                           .length.toString(),
                        <BarChart3 className="h-4 w-4 text-orange-600" />,
                        "border-orange-200 bg-orange-50/50",
                        "stable"
                     )}

                     {/* Card de Pontos Saudáveis */}
                     {createStatCard(
                        "Healthy",
                        criticalPoints
                           .filter((p) => p.properties.severity === "healthy")
                           .length.toString(),
                        <BarChart3 className="h-4 w-4 text-green-600" />,
                        "border-green-200 bg-green-50/50",
                        "up"
                     )}

                     {/* Card de NDVI Médio */}
                     {createStatCard(
                        "Average NDVI",
                        criticalPoints.length > 0
                           ? (
                                criticalPoints.reduce(
                                   (sum, p) => sum + (p.properties.ndvi || 0),
                                   0
                                ) / criticalPoints.length
                             ).toFixed(3)
                           : "N/A",
                        <Satellite className="h-4 w-4 text-purple-600" />,
                        "border-purple-200 bg-purple-50/50",
                        "stable"
                     )}

                     {/* Card de Última Atualização */}
                     {createStatCard(
                        "Last Analysis",
                        new Date().toLocaleDateString(),
                        <Satellite className="h-4 w-4 text-indigo-600" />,
                        "border-indigo-200 bg-indigo-50/50",
                        "up"
                     )}
                  </div>

                  {/* Informações Detalhadas */}
                  <div className="space-y-3">
                     <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                           <Satellite className="h-4 w-4 text-blue-600" />
                           <span className="font-semibold text-blue-800">
                              HLS (Harmonized Landsat Sentinel-2)
                           </span>
                        </div>
                        <div className="text-blue-700 space-y-1 text-xs">
                           <div>
                              • Resolução: 30m (Landsat) / 10-20m (Sentinel-2)
                           </div>
                           <div>• Frequência: 2-3 dias</div>
                           <div>• Banda NDVI: NIR + Red</div>
                        </div>
                     </div>

                     <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                           <BarChart3 className="h-4 w-4 text-green-600" />
                           <span className="font-semibold text-green-800">
                              Análise NDVI
                           </span>
                        </div>
                        <div className="space-y-1 text-green-700 text-xs">
                           <div>• Vegetação saudável: NDVI ≥ 0.6</div>
                           <div>• Área crítica: NDVI ≤ 0.2</div>
                           <div>• Monitoramento: Contínuo</div>
                        </div>
                     </div>

                     {/* Fonte dos Dados */}
                     <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                           <div>🛰️ Fonte: NASA HLS</div>
                           <div>📊 Processamento: Orbee Analytics</div>
                           <div>📍 Região: Mata Ciliar - RS</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Handle de Redimensionamento */}
               <div
                  className="absolute right-0 top-0 bottom-0 cursor-ew-resize"
                  onMouseDown={handleSatelliteResizeStart}
                  title="Arraste para redimensionar"
               >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gray-300 group-hover:bg-blue-500 rounded-l-sm transition-colors duration-200 flex items-center justify-center">
                     <div className="w-0.5 h-4 bg-white/60 rounded-full"></div>
                  </div>
                  {isSatelliteResizing && (
                     <>
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                        {/* Indicador de largura durante redimensionamento */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                           {satellitePanelWidth}px
                        </div>
                     </>
                  )}
               </div>
            </div>
         )}
      </>
   );
}
