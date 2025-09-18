import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Dice6,
  RotateCcw,
  Globe,
  Search,
  Leaf,
  AlertTriangle,
  Eye,
  DollarSign,
  MapPin,
  Calculator,
  Heart,
  BarChart3,
  TreePine,
  Award,
  Zap,
  Building2,
  Users,
  ShoppingCart,
} from "lucide-react";
import HeroSection from "../components/HeroSection";
import DashboardPreview from "../components/DashboardPreview";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import HowItWorksSection from "../components/HowItWorksSection";
import AchievementsSection from "../components/AchievementsSection";
import FutureSection from "../components/FutureSection";

const Home = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isTransparentMode, setIsTransparentMode] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(false); // Estado para controlar a visibilidade da HeroSection

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
      {/* Background with Noise Effect */}
      <div
        className="fixed inset-0 h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-green-800"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(rgba(15, 23, 42, ${
                isTransparentMode ? "0.6" : "0.8"
              }), rgba(6, 78, 59, ${
                isTransparentMode ? "0.7" : "0.9"
              })), url(${backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Subtle Floating Orbs */}
        <div className="animate-blob absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="animate-blob animation-delay-2000 bg-green-400/8 absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-3xl"></div>

        {/* Minimal Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.3) 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Background Control Buttons */}
      <div className="mt-4 z-50 flex gap-2 w-full">
        {/* Localização e Filtro */}
        <div className="flex-grow flex justify-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl cursor-pointer"
              onClick={() => {
                setShowHeroSection(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">Sinimbu - RS</span>
              <Search className="w-4 h-4 text-emerald-400 ml-2" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl">
              <Leaf className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-100 font-medium">Mata Ciliar</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mb-8 mr-4">
          <motion.button
            onClick={generateRandomBackground}
            whileHover={{
              scale: 1.1,
              rotate: 180,
              backgroundColor: "rgba(16, 185, 129, 0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/30 backdrop-blur-md"
            title="Alterar background e ativar transparência"
          >
            <Dice6 className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={resetToDefaultDesign}
            whileHover={{
              scale: 1.1,
              rotate: -180,
              backgroundColor: "rgba(239, 68, 68, 0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-red-400/30 bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 backdrop-blur-md"
            title="Resetar ao design padrão"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-40">{showHeroSection && <HeroSection />}</div>

      {/* Content Sections */}
      <div className="relative z-30">
        <FeaturesSection
          backgroundImage={backgroundImage}
          isTransparentMode={isTransparentMode}
          setShowHeroSection={setShowHeroSection}
        />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FutureSection />

        <Footer />
      </div>
    </div>
  );
};

export default Home;
