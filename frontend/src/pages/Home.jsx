import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FutureSection from "../components/FutureSection";
import SectionDivider from "../components/ui/SectionDivider";

const Home = () => {
   // useEffect to detect clicks on navigation links
   useEffect(() => {
      const handleHashChange = () => {
         const hash = window.location.hash;
         if (hash === "#features") {
            setShowFeaturesSection(true);
         }
      };

      // Check initial hash
      handleHashChange();

      // Listen for hash changes
      window.addEventListener("hashchange", handleHashChange);

      return () => {
         window.removeEventListener("hashchange", handleHashChange);
      };
   }, []);

   return (
      <div className="relative min-h-screen overflow-x-hidden">
         {/* Fixed Header */}
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
