import React from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

const CTASection = () => {
  const [ctaRef, ctaVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();

  const stats = [
    { number: "1.2M+", label: "Hectares Monitorados", icon: "🌱" },
    { number: "500+", label: "Comunidades Ativas", icon: "🏘️" },
    { number: "15K+", label: "Validações Realizadas", icon: "✅" },
    { number: "98%", label: "Satisfação dos Usuários", icon: "⭐" }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main CTA Content */}
        <div className={`text-center mb-16 fade-in-on-scroll ${ctaVisible ? 'visible' : ''}`} ref={ctaRef}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-sm font-medium mb-8 border border-emerald-400/30">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Faça Parte da Mudança
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Transforme Dados em
            <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Impacto Real
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Junte-se a milhares de pessoas que já estão usando o OrBee para 
            <span className="font-semibold text-white"> monitorar, proteger e restaurar </span>
            nossos ecossistemas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/dashboard" 
              className="group relative bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 border border-emerald-400/30"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Explorar Dashboard
              </span>

            </Link>
            
            <Link 
              to="/community" 
              className="group border-2 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Participar da Comunidade
              </span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 scale-in-on-scroll ${statsVisible ? 'visible' : ''}`} ref={statsRef}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-3xl p-6 border border-emerald-400/30 group-hover:bg-slate-900/80 transition-all duration-300">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-300 font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-slate-300 text-lg">
            <span className="font-semibold text-white">Gratuito para começar.</span> Sem compromisso. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;