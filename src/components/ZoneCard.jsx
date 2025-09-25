import React from "react";
import {
   Check,
   BarChart3,
   Activity,
   Leaf,
   Camera,
   TrendingUp,
   TrendingDown,
} from "lucide-react";
import {
   NDVITooltip,
   DegradationTooltip,
   AreaTooltip,
} from "./ui/MetricTooltips";

const ZoneCard = ({
   zone,
   zoneData,
   selectedZone,
   selectedZones,
   zoneActivities,
   onZoneClick,
   onZoneToggle,
   onPhotoGalleryOpen,
}) => {
   const {
      id,
      name,
      priority,
      area,
      ndvi,
      degradation,
      color,
      latitude,
      longitude,
   } = zoneData;
   const isSelected = selectedZone === id;
   const isChecked = selectedZones.includes(id);
   const activities = zoneActivities[`zona-${id.toLowerCase()}`];

   // Calcular progresso baseado nas atividades
   const totalActivities =
      activities.reports + activities.tracking + activities.actions;
   const progressPercentage = Math.min(100, (totalActivities / 10) * 100); // Assumindo 10 como meta

   // Determinar status baseado na degradação e atividades
   const getZoneStatus = () => {
      if (degradation === "Severa" && totalActivities < 3) return "critical";
      if (totalActivities >= 7) return "completed";
      if (totalActivities >= 3) return "in_progress";
      return "pending";
   };

   // Determinar tendência baseada no NDVI
   const getTrend = () => {
      const ndviValue = parseFloat(ndvi);
      if (ndviValue >= 0.4) return "improving";
      if (ndviValue <= 0.3) return "declining";
      return "stable";
   };

   const zoneStatus = getZoneStatus();
   const trend = getTrend();

   const colorClasses = {
      red: {
         border: "border-red-400/20 hover:border-red-400/40",
         borderSelected: "border-red-400",
         ring: "ring-red-400/50",
         gradient: "from-red-500/10",
         shadow: "hover:shadow-red-500/25",
         checkbox: {
            checked: "border-red-400 bg-red-500/20 text-red-400",
            unchecked: "border-red-400/30 hover:border-red-400/60",
         },
         badge: "bg-red-500/20 text-red-600",
         text: "text-red-600",
         divider: "border-red-400/20",
         hover: "hover:text-red-400",
         indicator: "bg-red-500/20",
      },
      orange: {
         border: "border-orange-400/20 hover:border-orange-400/40",
         borderSelected: "border-orange-400",
         ring: "ring-orange-400/50",
         gradient: "from-orange-500/10",
         shadow: "hover:shadow-orange-500/25",
         checkbox: {
            checked: "border-orange-400 bg-orange-500/20 text-orange-400",
            unchecked: "border-orange-400/30 hover:border-orange-400/60",
         },
         badge: "bg-orange-500/20 text-orange-600",
         text: "text-orange-600",
         divider: "border-orange-400/20",
         hover: "hover:text-orange-400",
         indicator: "bg-orange-500/20",
      },
      yellow: {
         border: "border-yellow-400/20 hover:border-yellow-400/40",
         borderSelected: "border-yellow-400",
         ring: "ring-yellow-400/50",
         gradient: "from-yellow-500/10",
         shadow: "hover:shadow-yellow-500/25",
         checkbox: {
            checked: "border-yellow-400 bg-yellow-500/20 text-yellow-400",
            unchecked: "border-yellow-400/30 hover:border-yellow-400/60",
         },
         badge: "bg-yellow-500/20 text-yellow-600",
         text: "text-yellow-600",
         divider: "border-yellow-400/20",
         hover: "hover:text-yellow-400",
         indicator: "bg-yellow-500/20",
      },
   };

   const colors = colorClasses[color];

   return (
      <div
         className={`group relative overflow-hidden rounded-xl border ${
            colors.border
         } bg-white/90 backdrop-blur-sm p-4 sm:p-6 shadow-xl transition-all duration-300 ease-in-out ${
            colors.shadow
         } cursor-pointer hover:-translate-y-1 hover:bg-white/95 ${
            isSelected ? `${colors.borderSelected} scale-105` : ""
         } ${isChecked ? `ring-2 ${colors.ring}` : ""}`}
         onClick={() => onZoneClick(id)}
      >
         <div
            className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
         ></div>

         <div className="relative z-10">
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
               <div className="flex items-center gap-2 sm:gap-3">
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onZoneToggle(id, true);
                     }}
                     className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md border-2 transition-all ${
                        isChecked
                           ? colors.checkbox.checked
                           : `${colors.checkbox.unchecked} bg-transparent text-transparent`
                     }`}
                  >
                     {isChecked && (
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                     )}
                  </button>
                  <div>
                     <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                        {name}
                     </h4>
                  </div>
               </div>
               <span
                  className={`rounded-full ${colors.badge} px-2 sm:px-3 py-1 text-xs font-semibold`}
               >
                  {priority}
               </span>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
               <div className="flex justify-between items-center">
                  <AreaTooltip areaValue={area}>
                     <span>Área:</span>
                  </AreaTooltip>
                  <span className={`font-medium ${colors.text}`}>{area}</span>
               </div>
               <div className="flex justify-between items-center">
                  <NDVITooltip ndviValue={ndvi}>
                     <span>NDVI:</span>
                  </NDVITooltip>
                  <span className={`font-medium ${colors.text}`}>{ndvi}</span>
               </div>
               <div className="flex justify-between items-center">
                  <DegradationTooltip degradationLevel={degradation}>
                     <span>Degradação:</span>
                  </DegradationTooltip>
                  <span className={`font-medium ${colors.text}`}>
                     {degradation}
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span>Coordenadas:</span>
                  <span className="text-gray-500 font-mono">
                     {latitude}, {longitude}
                  </span>
               </div>
            </div>

            {/* Evolução NDVI */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-xs sm:text-sm font-medium">
                     Evolução NDVI
                  </span>
                  <span className="text-gray-500 text-xs">Últimos 30 dias</span>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs">
                        Último registro:
                     </span>
                     <span
                        className={`text-xs font-medium ${
                           parseFloat(ndvi) >= 0.6
                              ? "text-green-600"
                              : parseFloat(ndvi) >= 0.4
                                ? "text-yellow-600"
                                : parseFloat(ndvi) >= 0.2
                                  ? "text-orange-600"
                                  : "text-red-600"
                        }`}
                     >
                        {(parseFloat(ndvi) - 0.02).toFixed(2)}
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs">Tendência:</span>
                     <div className="flex items-center gap-1">
                        {trend === "improving" ? (
                           <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : trend === "declining" ? (
                           <TrendingDown className="w-3 h-3 text-red-600" />
                        ) : (
                           <div className="w-3 h-3 rounded-full bg-gray-400" />
                        )}
                        <span
                           className={`text-xs ${
                              trend === "improving"
                                 ? "text-green-600"
                                 : trend === "declining"
                                   ? "text-red-600"
                                   : "text-gray-500"
                           }`}
                        >
                           {trend === "improving"
                              ? "Melhorando"
                              : trend === "declining"
                                ? "Declinando"
                                : "Estável"}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Contadores de Atividades */}
            <div
               className={`mt-3 sm:mt-4 border-t ${colors.divider} pt-3 sm:pt-4`}
            >
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                     <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                     <span>{activities.reports}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                     <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                     <span>{activities.tracking}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                     <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
                     <span>{activities.actions}</span>
                  </div>
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onPhotoGalleryOpen(`zona-${id.toLowerCase()}`);
                     }}
                     className={`flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-500 ${colors.hover} transition-colors cursor-pointer`}
                  >
                     <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                     <span>{activities.photos}</span>
                  </button>
               </div>
               <div className="mt-2 text-xs text-gray-400">
                  Relatórios • Acompanhamentos • Ações • Fotos
               </div>
            </div>
         </div>
      </div>
   );
};

export default ZoneCard;
