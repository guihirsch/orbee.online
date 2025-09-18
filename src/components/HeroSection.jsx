import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const HeroSection = () => {
  return (
    <section className="relative flex h-screen min-h-screen flex-col overflow-hidden">
      {/* Simplified Header */}
      <header className="relative z-50 flex items-center justify-center py-6">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bee-icon lucide-bee"
          >
            <path d="m8 2 1.88 1.88" stroke="white" />
            <path d="M14.12 3.88 16 2" stroke="white" />
            <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="white" />
            <path
              d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z"
              stroke="white"
            />
            <path d="M7.56 12h8.87" stroke="white" />
            <path d="M7.5 17h9" stroke="white" />
            <path
              d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3"
              stroke="white"
            />
          </svg>
          <span className="font-odor-mean-chey text-3xl font-bold text-white">
            Orbee
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-40 flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-6xl text-center relative">
          {/* Main Headline */}
          <h1 className="animate-fade-in-up animation-delay-200 mb-8 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="mb-4 block text-white drop-shadow-2xl">
              Plano de recuperação ambiental
            </span>
            <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg animate-gradient-shift animate-text-glow">
              em tempo real
            </span>
          </h1>

          {/* Location Input Section */}
          <div className="animate-fade-in-up animation-delay-600 mx-auto max-w-2xl">
            <div className="mb-2">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Digite sua cidade ou região..."
                  className="w-full px-8 py-6 text-xl bg-slate-900/70 border-2 border-emerald-400/40 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all duration-500 backdrop-blur-md shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-400/60 animate-hero-glow"
                />
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>

            {/* Sinimbu Flag */}
            <div className="mb-6 flex justify-start">
              <button
                onClick={() => {
                  const exploracaoSection = document.querySelector(
                    '[data-section="exploracao"]'
                  );
                  if (exploracaoSection) {
                    exploracaoSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Sinimbu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
