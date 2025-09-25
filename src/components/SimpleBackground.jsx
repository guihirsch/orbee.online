import React from "react";
import GridPattern from "./GridPattern";

const SimpleBackground = ({ variant = "default" }) => {
   const config = {
      default: {
         gradient: "from-white via-emerald-50/20 to-green-50/10",
         circles: [
            {
               position: "top-1/4 left-1/4",
               size: "w-96 h-96",
               color: "from-emerald-200/8 to-green-300/4",
               delay: "0s",
            },
            {
               position: "bottom-1/4 right-1/4",
               size: "w-80 h-80",
               color: "from-green-200/8 to-emerald-300/4",
               delay: "2s",
            },
         ],
         shapes: [
            {
               position: "top-1/3 right-1/3",
               size: "w-32 h-32",
               color: "from-emerald-300/12 to-green-400/6",
               rotation: "rotate-45",
               delay: "4s",
            },
         ],
      },
      hero: {
         gradient: "from-white via-emerald-50/30 to-green-50/20",
         circles: [
            {
               position: "top-1/4 left-1/4",
               size: "w-[500px] h-[500px]",
               color: "from-emerald-200/12 to-green-300/6",
               delay: "0s",
            },
            {
               position: "bottom-1/4 right-1/4",
               size: "w-[400px] h-[400px]",
               color: "from-green-200/12 to-emerald-300/6",
               delay: "3s",
            },
            {
               position: "top-1/2 right-1/3",
               size: "w-64 h-64",
               color: "from-[#2f4538]/8 to-emerald-400/4",
               delay: "6s",
            },
         ],
         shapes: [
            {
               position: "top-1/3 right-1/3",
               size: "w-40 h-40",
               color: "from-emerald-300/15 to-green-400/8",
               rotation: "rotate-45",
               delay: "1s",
            },
            {
               position: "bottom-1/3 left-1/3",
               size: "w-28 h-28",
               color: "from-green-300/15 to-emerald-400/8",
               rotation: "rotate-12",
               delay: "5s",
            },
         ],
      },
      subtle: {
         gradient: "from-white via-emerald-50/10 to-green-50/5",
         circles: [
            {
               position: "top-1/4 left-1/4",
               size: "w-72 h-72",
               color: "from-emerald-200/6 to-green-300/3",
               delay: "0s",
            },
            {
               position: "bottom-1/4 right-1/4",
               size: "w-60 h-60",
               color: "from-green-200/6 to-emerald-300/3",
               delay: "3s",
            },
         ],
         shapes: [],
      },
   };

   const currentConfig = config[variant] || config.default;

   return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Gradiente de fundo principal */}
         <div
            className={`absolute inset-0 bg-gradient-to-br ${currentConfig.gradient}`}
         />

         {/* Grid Pattern */}
         <GridPattern variant={variant} />

         {/* Círculos grandes com blur */}
         {currentConfig.circles.map((circle, index) => (
            <div
               key={index}
               className={`absolute ${circle.position} ${circle.size} bg-gradient-to-br ${circle.color} rounded-full blur-3xl animate-pulse`}
               style={{ animationDelay: circle.delay }}
            />
         ))}

         {/* Formas geométricas */}
         {currentConfig.shapes.map((shape, index) => (
            <div
               key={index}
               className={`absolute ${shape.position} ${shape.size} bg-gradient-to-br ${shape.color} ${shape.rotation} blur-xl animate-pulse`}
               style={{ animationDelay: shape.delay }}
            />
         ))}

         {/* Overlay sutil para suavizar */}
         <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5" />
      </div>
   );
};

export default SimpleBackground;
