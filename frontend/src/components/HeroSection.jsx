import React, { useState } from "react";
import { Link } from "react-router-dom";
import SimpleBackground from "./SimpleBackground";

const HeroSection = () => {
   const [searchTerm, setSearchTerm] = useState("");

   const handleSearch = () => {
      if (!searchTerm.trim()) return;
   };

   return (
      <section
         id="hero"
         className="relative min-h-screen bg-white overflow-hidden pt-24"
      >
         {/* Simple Background */}
         <SimpleBackground variant="hero" />

         {/* Hero Content */}
         <div className="container mx-auto px-6 py-2 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
               {/* Left Section - Interface */}
               <div className="space-y-8">
                  {/* Main Headline */}
                  <div className="space-y-4">
                     <h1
                        className="font-medium text-[#2f4538] leading-tight text-4xl lg:text-5xl"
                        style={{
                           fontFamily: '"Fraunces", serif',
                        }}
                     >
                        Real-Time Environmental
                        <br />
                        Recovery Plan
                     </h1>
                     <p className="text-lg text-gray-600 max-w-xl">
                        Search your region and see the health of riparian
                        forests
                     </p>
                  </div>

                  {/* Search Input */}
                  <div className="flex gap-3">
                     <input
                        type="text"
                        placeholder="Santa Cruz do Sul..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                     />
                     <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-[#2f4538]  text-white rounded-lg hover:bg-[#2f4538]/80 transition-colors"
                     >
                        Search
                     </button>
                  </div>
               </div>

               {/* Right Section - Zones */}
               <div className="space-y-4">
                  {/* Section Title */}
                  <div className="flex items-center justify-between">
                     <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                     >
                        View other zones
                        <svg
                           className="w-4 h-4"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                           />
                        </svg>
                     </a>
                  </div>

                  {/* Zone Cards */}
                  <div className="space-y-3">
                     {/* Card 1 - Critical Zone A */}
                     <div className="group relative overflow-hidden rounded-xl border border-red-400/20 hover:border-red-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-red-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Critical Zone A
                              </h3>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              North bank of Pardinho River
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-red-600 font-medium">
                                    2.1 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Area
                                 </span>
                              </div>
                              <div>
                                 <span className="text-red-600 font-medium">
                                    0.32
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    NDVI
                                 </span>
                              </div>
                              <div>
                                 <span className="text-red-600 font-medium">
                                    Severe
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradation
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Card 2 - Critical Zone B */}
                     <div className="group relative overflow-hidden rounded-xl border border-orange-400/20 hover:border-orange-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Critical Zone B
                              </h3>
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              Pardinho River - Lajeado Stream confluence
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-orange-600 font-medium">
                                    1.8 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Area
                                 </span>
                              </div>
                              <div>
                                 <span className="text-orange-600 font-medium">
                                    0.28
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    NDVI
                                 </span>
                              </div>
                              <div>
                                 <span className="text-orange-600 font-medium">
                                    Severe
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradation
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Card 3 - Attention Zone C */}
                     <div className="group relative overflow-hidden rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Attention Zone C
                              </h3>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              South bank of Pardinho River - Urban sector
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-yellow-600 font-medium">
                                    3.2 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Area
                                 </span>
                              </div>
                              <div>
                                 <span className="text-yellow-600 font-medium">
                                    0.45
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    NDVI
                                 </span>
                              </div>
                              <div>
                                 <span className="text-yellow-600 font-medium">
                                    Moderate
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradation
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default HeroSection;
