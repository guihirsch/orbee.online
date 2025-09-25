import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, TrendingUp } from "lucide-react";

const RegionalSummaryCard = ({
   regionName = "Região",
   totalZones = 8,
   totalArea = "12,7 hectares",
   criticalZones = [],
   attentionZones = [],
   preventiveZones = [],
   className = "",
}) => {
   const defaultCriticalZones = [
      {
         name: "3 zonas críticas",
         description: "vegetação severamente degradada",
         area: "4,2 ha",
         color: "red",
      },
   ];

   const defaultAttentionZones = [
      {
         name: "2 zonas necessitam monitoramento intensivo",
         area: "3,8 ha",
         color: "orange",
      },
   ];

   const defaultPreventiveZones = [
      {
         name: "3 zonas requerem ações preventivas",
         area: "4,7 ha",
         color: "yellow",
      },
   ];

   const zones = {
      critical: criticalZones.length > 0 ? criticalZones : defaultCriticalZones,
      attention:
         attentionZones.length > 0 ? attentionZones : defaultAttentionZones,
      preventive:
         preventiveZones.length > 0 ? preventiveZones : defaultPreventiveZones,
   };

   const getZoneColorClasses = (color) => {
      const colorMap = {
         red: {
            bg: "bg-red-500/10",
            border: "border-red-400/30",
            text: "text-red-400",
            area: "text-red-300",
         },
         orange: {
            bg: "bg-orange-500/10",
            border: "border-orange-400/30",
            text: "text-orange-400",
            area: "text-orange-300",
         },
         yellow: {
            bg: "bg-yellow-500/10",
            border: "border-yellow-400/30",
            text: "text-yellow-400",
            area: "text-yellow-300",
         },
      };
      return colorMap[color] || colorMap.red;
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className={`group relative overflow-hidden rounded-lg border border-amber-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-amber-400/40 hover:shadow-amber-500/25 ${className}`}
      >
         {/* Background gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

         <div className="relative z-10">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2, duration: 0.4 }}
               className="mb-4 text-left"
            >
               <h3 className="text-lg font-bold text-white mb-1">
                  Resumo da <span className="text-amber-400">situação</span>{" "}
                  regional
               </h3>
               <p className="text-sm text-amber-100/80">
                  {regionName} apresenta desafios ambientais que requerem ação
                  imediata da comunidade.
               </p>
            </motion.div>

            {/* Summary info */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.4 }}
               className="mb-4"
            >
               <p className="text-sm text-slate-300 leading-relaxed">
                  Das{" "}
                  <span className="text-white font-medium">
                     {totalZones} zonas monitoradas
                  </span>{" "}
                  totalizando{" "}
                  <span className="text-emerald-400 font-medium">
                     {totalArea}
                  </span>
                  , temos:
               </p>
            </motion.div>

            {/* Zone status list */}
            <div className="space-y-3">
               {/* Critical zones */}
               {zones.critical.map((zone, index) => {
                  const colors = getZoneColorClasses(zone.color);
                  return (
                     <motion.div
                        key={`critical-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${colors.bg} ${colors.border}`}
                     >
                        <div className="flex items-center gap-3">
                           <AlertTriangle
                              className={`h-4 w-4 ${colors.text}`}
                           />
                           <span
                              className={`text-sm font-medium ${colors.text}`}
                           >
                              {zone.name}
                           </span>
                           {zone.description && (
                              <span className="text-xs text-slate-400">
                                 - {zone.description}
                              </span>
                           )}
                        </div>
                        <span className={`text-sm font-bold ${colors.area}`}>
                           {zone.area}
                        </span>
                     </motion.div>
                  );
               })}

               {/* Attention zones */}
               {zones.attention.map((zone, index) => {
                  const colors = getZoneColorClasses(zone.color);
                  return (
                     <motion.div
                        key={`attention-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${colors.bg} ${colors.border}`}
                     >
                        <div className="flex items-center gap-3">
                           <Eye className={`h-4 w-4 ${colors.text}`} />
                           <span
                              className={`text-sm font-medium ${colors.text}`}
                           >
                              {zone.name}
                           </span>
                        </div>
                        <span className={`text-sm font-bold ${colors.area}`}>
                           {zone.area}
                        </span>
                     </motion.div>
                  );
               })}

               {/* Preventive zones */}
               {zones.preventive.map((zone, index) => {
                  const colors = getZoneColorClasses(zone.color);
                  return (
                     <motion.div
                        key={`preventive-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${colors.bg} ${colors.border}`}
                     >
                        <div className="flex items-center gap-3">
                           <TrendingUp className={`h-4 w-4 ${colors.text}`} />
                           <span
                              className={`text-sm font-medium ${colors.text}`}
                           >
                              {zone.name}
                           </span>
                        </div>
                        <span className={`text-sm font-bold ${colors.area}`}>
                           {zone.area}
                        </span>
                     </motion.div>
                  );
               })}
            </div>
         </div>
      </motion.div>
   );
};

export default RegionalSummaryCard;
