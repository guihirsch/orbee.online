import React from "react";
import HeroSection from "../components/HeroSection";
import DashboardPreview from "../components/DashboardPreview";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl">
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
