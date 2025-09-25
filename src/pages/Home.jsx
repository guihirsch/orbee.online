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
import SectionDivider from "../components/ui/SectionDivider";

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
         {/* Hero Section */}
         <div className="relative z-40">
            <HeroSection />
         </div>

         {/* Content Sections */}
         <div className="relative z-30">
            <FeaturesSection
               backgroundImage={backgroundImage}
               isTransparentMode={isTransparentMode}
               setShowHeroSection={setShowHeroSection}
            />
            <SectionDivider />
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
