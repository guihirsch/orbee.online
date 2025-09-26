import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FutureSection from "../components/FutureSection";
import SectionDivider from "../components/ui/SectionDivider";

const Home = () => {
   // useEffect para detectar cliques em links de navegação
   useEffect(() => {
      const handleHashChange = () => {
         const hash = window.location.hash;
         if (hash === "#features") {
            setShowFeaturesSection(true);
         }
      };

      // Verificar hash inicial
      handleHashChange();

      // Escutar mudanças no hash
      window.addEventListener("hashchange", handleHashChange);

      return () => {
         window.removeEventListener("hashchange", handleHashChange);
      };
   }, []);

   // Função para gerar imagem aleatória e ativar transparência automaticamente
   const generateRandomBackground = () => {
      const topics = [
         "nature",
         "forest",
         "landscape",
         "green",
         "trees",
         "environment",
      ];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomId = Math.floor(Math.random() * 1000) + 1;
      // Usando a API oficial do Unsplash que suporta CORS
      const imageUrl = `https://picsum.photos/1920/1080?random=${randomId}`;
      setBackgroundImage(imageUrl);
      setIsTransparentMode(true); // Ativa transparência automaticamente
   };

   // Função para resetar ao design padrão
   const resetToDefaultDesign = () => {
      setBackgroundImage("");
      setIsTransparentMode(false);
   };

   return (
      <div className="relative min-h-screen overflow-x-hidden">
         {/* Header Fixo */}
         <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
         </div>

         {/* Hero Section */}
         <div className="relative z-40">
            <HeroSection />
         </div>

         {/* Content Sections */}
         <div className="relative z-30">
            <ProblemSection />
            <SectionDivider />
            <SolutionSection />
            <SectionDivider />
            <HowItWorksSection />
            <SectionDivider />
            <FutureSection />
            <SectionDivider />
            <Footer />
         </div>
      </div>
   );
};

export default Home;
