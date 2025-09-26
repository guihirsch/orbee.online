import React, { useState } from "react";
import { Link } from "react-router-dom";
import SimpleBackground from "./SimpleBackground";

const HeroSection = () => {
   const [searchTerm, setSearchTerm] = useState("");

   const handleSearch = () => {
      if (!searchTerm.trim()) return;
      console.log("Buscando por:", searchTerm);
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
               {/* Seção Esquerda - Interface */}
               <div className="space-y-8">
                  {/* Headline Principal */}
                  <div className="space-y-4">
                     <h1
                        className="font-medium text-[#2f4538] leading-tight text-4xl lg:text-5xl"
                        style={{
                           fontFamily: '"Fraunces", serif',
                        }}
                     >
                        Plano de Recuperação
                        <br />
                        Ambiental em Tempo Real
                     </h1>
                     <p className="text-lg text-gray-600 max-w-xl">
                        Busque a sua região e veja a saúde da mata ciliar
                     </p>
                  </div>

                  {/* Input de Busca */}
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
                        Buscar
                     </button>
                  </div>
               </div>

               {/* Seção Direita - Zonas */}
               <div className="space-y-4">
                  {/* Título da Seção */}
                  <div className="flex items-center justify-between">
                     <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                     >
                        Ver demais zonas
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

                  {/* Cards das Zonas */}
                  <div className="space-y-3">
                     {/* Card 1 - Zona Crítica A */}
                     <div className="group relative overflow-hidden rounded-xl border border-red-400/20 hover:border-red-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-red-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Zona Crítica A
                              </h3>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              Margem norte do Rio Pardinho
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-red-600 font-medium">
                                    2.1 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Área
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
                                    Severa
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradação
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Card 2 - Zona Crítica B */}
                     <div className="group relative overflow-hidden rounded-xl border border-orange-400/20 hover:border-orange-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Zona Crítica B
                              </h3>
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              Confluência Rio Pardinho - Arroio Lajeado
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-orange-600 font-medium">
                                    1.8 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Área
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
                                    Severa
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradação
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Card 3 - Zona Atenção C */}
                     <div className="group relative overflow-hidden rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 bg-white/90 backdrop-blur-sm p-4 shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                 Zona Atenção C
                              </h3>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                           </div>
                           <p className="text-sm text-gray-600 mb-3">
                              Margem sul do Rio Pardinho - Setor urbano
                           </p>
                           <div className="flex gap-6 text-sm">
                              <div>
                                 <span className="text-yellow-600 font-medium">
                                    3.2 ha
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Área
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
                                    Moderada
                                 </span>
                                 <span className="text-gray-500 ml-1">
                                    Degradação
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
