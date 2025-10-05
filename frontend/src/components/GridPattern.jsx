import React from "react";

const GridPattern = ({
   size = 20,
   stroke = "#e5e7eb",
   strokeWidth = 1,
   className = "",
}) => {
   return (
      <div className={`absolute inset-0 ${className}`}>
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
               <pattern
                  id="grid"
                  width={size}
                  height={size}
                  patternUnits="userSpaceOnUse"
               >
                  <path
                     d={`M ${size} 0 L 0 0 0 ${size}`}
                     fill="none"
                     stroke={stroke}
                     strokeWidth={strokeWidth}
                  />
               </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
      </div>
   );
};

export default GridPattern;
