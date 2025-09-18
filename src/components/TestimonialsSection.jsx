import React from "react";
import useScrollAnimation from "../hooks/useScrollAnimation";

const TestimonialsSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Coordenadora Ambiental",
      organization: "ONG Verde Esperança",
      content:
        "O OrBee revolucionou nossa forma de monitorar a mata ciliar. Conseguimos identificar problemas antes que se tornassem críticos e mobilizar a comunidade de forma muito mais eficiente.",
      avatar: "MS",
      rating: 5,
      location: "Santa Cruz do Sul, RS",
    },
    {
      name: "João Santos",
      role: "Agricultor Familiar",
      organization: "Cooperativa Rural Vale Verde",
      content:
        "Com os dados do OrBee, consegui otimizar o manejo da minha propriedade e ainda contribuir para a preservação ambiental. Os alertas me ajudam a tomar decisões mais conscientes.",
      avatar: "JS",
      rating: 5,
      location: "Venâncio Aires, RS",
    },
    {
      name: "Dr. Ana Costa",
      role: "Pesquisadora em Ecologia",
      organization: "Universidade Federal do RS",
      content:
        "A precisão dos dados NDVI combinada com a validação comunitária cria um dataset único para nossas pesquisas. É uma ferramenta indispensável para estudos ambientais.",
      avatar: "AC",
      rating: 5,
      location: "Porto Alegre, RS",
    },
    {
      name: "Carlos Mendes",
      role: "Secretário de Meio Ambiente",
      organization: "Prefeitura Municipal",
      content:
        "O OrBee nos permite tomar decisões baseadas em dados concretos. A plataforma facilitou muito nosso trabalho de fiscalização e planejamento ambiental urbano.",
      avatar: "CM",
      rating: 5,
      location: "Lajeado, RS",
    },
    {
      name: "Lucia Oliveira",
      role: "Líder Comunitária",
      organization: "Associação de Moradores",
      content:
        "Nunca pensei que poderia contribuir para a ciência apenas observando minha região. O OrBee me deu voz e mostrou como minhas observações são valiosas para o meio ambiente.",
      avatar: "LO",
      rating: 5,
      location: "Cachoeira do Sul, RS",
    },
    {
      name: "Prof. Roberto Lima",
      role: "Engenheiro Ambiental",
      organization: "Consultoria EcoTech",
      content:
        "A integração entre tecnologia satelital e conhecimento local é brilhante. Usamos o OrBee em vários projetos e os resultados sempre superam as expectativas dos nossos clientes.",
      avatar: "RL",
      rating: 5,
      location: "Caxias do Sul, RS",
    },
  ];

  const stats = [
    { number: "98%", label: "Satisfação dos Usuários" },
    { number: "500+", label: "Comunidades Ativas" },
    { number: "15K+", label: "Validações Realizadas" },
    { number: "1.2M+", label: "Hectares Monitorados" },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 fade-in-on-scroll ${
            headerVisible ? "visible" : ""
          }`}
          ref={headerRef}
        >
          <div className="mb-6 inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Depoimentos
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Histórias de
            <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Impacto Real
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-300">
            Descubra como comunidades, pesquisadores e organizações estão usando
            o OrBee para criar um futuro mais sustentável.
          </p>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 scale-in-on-scroll ${
            statsVisible ? "visible" : ""
          }`}
          ref={statsRef}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-3xl font-bold text-emerald-400 md:text-4xl">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-slate-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 slide-in-left-on-scroll ${
            ctaVisible ? "visible" : ""
          }`}
          ref={ctaRef}
        >
          <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-400/30 bg-slate-900/60 backdrop-blur-md p-8 shadow-lg">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Faça Parte da Nossa Comunidade
            </h3>
            <p className="mb-6 text-slate-300">
              Junte-se a centenas de organizações que já estão fazendo a
              diferença com o OrBee.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl hover:shadow-emerald-500/25 border border-emerald-400/30">
                Começar Agora
              </button>
              <button className="rounded-2xl border-2 border-emerald-400/50 px-6 py-3 font-semibold text-emerald-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-200 backdrop-blur-sm">
                Agendar Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
