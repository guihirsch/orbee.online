import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background with Noise Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-green-800">
        {/* Noise Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px'
          }}
        />
        
        {/* Subtle Floating Orbs - Reduced from 3 to 2 */}
        <div className="animate-blob absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="animate-blob animation-delay-2000 absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-green-400/8 blur-3xl"></div>
        
        {/* Minimal Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Hero Content */}
      <div className="relative z-40 flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          {/* Refined Badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/20 px-4 py-2 backdrop-blur-sm">
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
            <span className="text-sm font-medium text-emerald-300">
              Monitoramento em Tempo Real
            </span>
          </div>

          {/* Impactful Title */}
          <h1 className="animate-fade-in-up animation-delay-200 mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            <span className="block text-white mb-2">Ações locais</span>
            <span className="block bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              com Impacto Global
            </span>
          </h1>

          {/* Concise Subtitle */}
          <p className="animate-fade-in-up animation-delay-400 mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Plataforma de{" "}
            <span className="font-semibold text-emerald-400">
              inteligência ambiental
            </span>{" "}
            que monitora matas ciliares e orienta ações de preservação.
          </p>

          {/* Enhanced CTA with Noise Effect */}
           <div className="animate-fade-in-up animation-delay-600 flex flex-col items-center justify-center gap-4 sm:flex-row">
             <Link
               to="/dashboard"
               className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/25"
             >
               {/* Noise Effect for Primary Button */}
               <div 
                 className="absolute inset-0 opacity-20 mix-blend-overlay"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
                   backgroundSize: '128px 128px'
                 }}
               />
               <span className="relative z-10 flex items-center gap-2">
                 <svg
                   className="h-5 w-5 transition-transform group-hover:scale-110"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                   />
                 </svg>
                 Busque sua Região
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
             </Link>
             
             <button 
               onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
               className="group relative overflow-hidden flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 font-medium text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/50"
             >
               {/* Noise Effect for Secondary Button */}
               <div 
                 className="absolute inset-0 opacity-15 mix-blend-overlay"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)'/%3E%3C/svg%3E")`,
                   backgroundSize: '128px 128px'
                 }}
               />
               <span className="relative z-10">Saiba mais</span>
               <svg
                 className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth={2}
                   d="M19 14l-7 7m0 0l-7-7m7 7V3"
                 />
               </svg>
             </button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
