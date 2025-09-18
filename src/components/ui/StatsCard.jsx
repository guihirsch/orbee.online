import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({
  value,
  label,
  description,
  color = "emerald",
  icon: Icon,
  gradient,
  delay = 0,
  className = "",
  onClick,
  ...props
}) => {
  const colorVariants = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/20",
      hoverBorder: "hover:border-emerald-400/40",
      shadow: "hover:shadow-emerald-500/25",
      text: "text-emerald-400",
      labelText: "text-emerald-300/70",
      descText: "text-emerald-200/60",
      gradient: "from-emerald-500/10",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-400/20",
      hoverBorder: "hover:border-green-400/40",
      shadow: "hover:shadow-green-500/25",
      text: "text-green-400",
      labelText: "text-green-300/70",
      descText: "text-green-200/60",
      gradient: "from-green-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-400/20",
      hoverBorder: "hover:border-blue-400/40",
      shadow: "hover:shadow-blue-500/25",
      text: "text-blue-400",
      labelText: "text-blue-300/70",
      descText: "text-blue-200/60",
      gradient: "from-blue-500/10",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-400/20",
      hoverBorder: "hover:border-purple-400/40",
      shadow: "hover:shadow-purple-500/25",
      text: "text-purple-400",
      labelText: "text-purple-300/70",
      descText: "text-purple-200/60",
      gradient: "from-purple-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-400/20",
      hoverBorder: "hover:border-amber-400/40",
      shadow: "hover:shadow-amber-500/25",
      text: "text-amber-400",
      labelText: "text-amber-300/70",
      descText: "text-amber-200/60",
      gradient: "from-amber-500/10",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-400/20",
      hoverBorder: "hover:border-red-400/40",
      shadow: "hover:shadow-red-500/25",
      text: "text-red-400",
      labelText: "text-red-300/70",
      descText: "text-red-200/60",
      gradient: "from-red-500/10",
    },
  };

  const colors = colorVariants[color] || colorVariants.emerald;

  const noiseFilter = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='statsNoiseFilter${color}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23statsNoiseFilter${color})'/%3E%3C/svg%3E")`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`group relative overflow-hidden text-center p-3 rounded-md transition-all duration-300 ease-in-out cursor-pointer ${
        colors.bg
      } ${colors.border} ${colors.hoverBorder} ${colors.shadow} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: noiseFilter,
          backgroundSize: "256px 256px",
        }}
      />
      
      {/* Hover gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        {Icon && (
          <div className={`mb-2 flex justify-center ${colors.text}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        {/* Value */}
        <div className={`text-lg font-bold mb-1 ${colors.text}`}>
          {value}
        </div>
        
        {/* Label */}
        <div className={`text-xs mb-1 ${colors.labelText}`}>
          {label}
        </div>
        
        {/* Description */}
        {description && (
          <div className={`text-xs ${colors.descText}`}>
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;