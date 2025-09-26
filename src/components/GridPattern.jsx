import React from "react";

const GridPattern = ({ variant = "default" }) => {
   const config = {
      default: {
         size: 40,
         strokeWidth: 0.5,
         opacity: 0.1,
         color: "#10b981",
      },
      hero: {
         size: 50,
         strokeWidth: 0.5,
         opacity: 0.05,
         color: "#2f4538",
      },
      subtle: {
         size: 30,
         strokeWidth: 0.3,
         opacity: 0.05,
         color: "#10b981",
      },
   };

   const currentConfig = config[variant] || config.default;

   return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
            xmlns="http://www.w3.org/2000/svg"
         >
            <defs>
               <pattern
                  id={`grid-${variant}`}
                  width={currentConfig.size}
                  height={currentConfig.size}
                  patternUnits="userSpaceOnUse"
               >
                  <path
                     d={`M ${currentConfig.size} 0 L 0 0 0 ${currentConfig.size}`}
                     fill="none"
                     stroke={currentConfig.color}
                     strokeWidth={currentConfig.strokeWidth}
                     opacity={currentConfig.opacity}
                  />
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
         </svg>
      </div>
   );
};

export default GridPattern;
