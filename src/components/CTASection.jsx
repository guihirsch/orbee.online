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
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 animate-gradient-shift"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-float"></div>
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main CTA Content */}
        <div className={`text-center mb-16 fade-in-on-scroll ${ctaVisible ? 'visible' : ''}`} ref={ctaRef}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8 hover-glow">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Faça Parte da Mudança
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Transforme Dados em
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse-glow">
              Impacto Real
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-12">
            Junte-se a milhares de pessoas que já estão usando o OrBee para 
            <span className="font-semibold text-white"> monitorar, proteger e restaurar </span>
            nossos ecossistemas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/dashboard" 
              className="group relative bg-white text-green-700 hover:bg-gray-50 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 hover-lift"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Explorar Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/community" 
              className="group border-3 border-white text-white hover:bg-white hover:text-green-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white/10"
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
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-green-100 font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-green-100 text-lg">
            <span className="font-semibold text-white">Gratuito para começar.</span> Sem compromisso. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;