import React from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import { Leaf, TreePine, Globe2, Target } from "lucide-react";

const ImpactCard = ({ userName = "Usuário", stats, className = "" }) => {
   const defaultStats = {
      co2Reduced: {
         value: "2.4t",
         description: "Equivale a 12 carros parados",
      },
      treesPlanted: { value: "47", description: "Uma pequena floresta!" },
      areaMonitored: { value: "8.2ha", description: "Tamanho de 11 campos" },
      actionsCompleted: { value: "23", description: "Guardião ativo!" },
   };

   const impactStats = { ...defaultStats, ...stats };

   const statsConfig = [
      {
         ...impactStats.co2Reduced,
         label: "CO₂ Reduzido",
         color: "emerald",
         icon: Leaf,
      },
      {
         ...impactStats.treesPlanted,
         label: "Árvores Plantadas",
         color: "green",
         icon: TreePine,
      },
      {
         ...impactStats.areaMonitored,
         label: "Área Monitorada",
         color: "blue",
         icon: Globe2,
      },
      {
         ...impactStats.actionsCompleted,
         label: "Ações Realizadas",
         color: "purple",
         icon: Target,
      },
   ];

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className={`group relative overflow-hidden rounded-lg border border-emerald-400/20 bg-slate-800/60 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out hover:border-emerald-400/40 hover:shadow-emerald-500/25 ${className}`}
      >
         {/* Background gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

         <div className="relative z-10">
            {/* Header with personalized message */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2, duration: 0.4 }}
               className="mb-3"
            >
               <h3 className="text-lg font-bold text-white mb-1 text-left">
                  {userName}, seu impacto é{" "}
                  <span className="text-emerald-400">extraordinário!</span>
               </h3>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
               {statsConfig.map((stat, index) => (
                  <StatsCard
                     key={stat.label}
                     value={stat.value}
                     label={stat.label}
                     description={stat.description}
                     color={stat.color}
                     icon={stat.icon}
                     delay={0.3 + index * 0.1}
                     className="hover:scale-105 transition-transform duration-200"
                  />
               ))}
            </div>
         </div>
      </motion.div>
   );
};

export default ImpactCard;
