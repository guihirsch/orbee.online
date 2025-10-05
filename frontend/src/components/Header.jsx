import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import AuthModal from "./AuthModal";

const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [authMode, setAuthMode] = useState("login");
   const { user, logout, isAuthenticated } = useAuth();
   const navigate = useNavigate();

   const handleAuthClick = (mode) => {
      setAuthMode(mode);
      setShowAuthModal(true);
   };

   const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
   };

   const handlePlataformaClick = (e) => {
      if (!isAuthenticated) {
         e.preventDefault();
         setAuthMode("login");
         setShowAuthModal(true);
         setIsMenuOpen(false);
      }
   };

   const handleLoginSuccess = () => {
      navigate("/aoi-viewer");
   };

   const navItems = [
      { name: "Início", href: "#hero" },
      { name: "Problema", href: "#problem" },
      { name: "Solução", href: "#solution" },
      { name: "Como funciona", href: "#how-it-works" },
      { name: "Futuro", href: "#future" },
   ];

   const handleScroll = (e, href) => {
      if (href.startsWith("#")) {
         e.preventDefault();
         const targetId = href.substring(1);

         if (href === "#features") {
            if (window.location.hash !== "#features") {
               window.location.hash = "#features";
            }
            setTimeout(() => {
               const element = document.getElementById("features");
               if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
               }
            }, 60);
            return;
         }

         const targetElement = document.getElementById(targetId);
         if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
         } else {
            window.location.hash = href;
         }
      }
   };

   return (
      <>
         <header className="w-full px-6 py-4 backdrop-blur-sm bg-white border-b border-gray-200/50">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
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
                        <path d="m8 2 1.88 1.88" stroke="#2f4538" />
                        <path d="M14.12 3.88 16 2" stroke="#2f4538" />
                        <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="#2f4538" />
                        <path
                           d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z"
                           stroke="#2f4538"
                        />
                        <path d="M7.56 12h8.87" stroke="#2f4538" />
                        <path d="M7.5 17h9" stroke="#2f4538" />
                        <path
                           d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3"
                           stroke="#2f4538"
                        />
                     </svg>
                     <span
                        className="text-2xl font-medium text-[#2f4538]"
                        style={{
                           fontFamily: '"Fraunces", serif',
                        }}
                     >
                        orbee
                     </span>{" "}
                  </div>
                  <nav className="hidden items-center gap-2 md:flex">
                     {navItems.map((item) =>
                        item.href.startsWith("/") ? (
                           <Link
                              key={item.name}
                              to={item.href}
                              className="rounded-full px-4 py-2 font-medium text-gray-600 transition-colors hover:text-[#2f4538]"
                           >
                              {item.name}
                           </Link>
                        ) : (
                           <a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => handleScroll(e, item.href)}
                              className="cursor-pointer rounded-full px-4 py-2 font-medium text-gray-600 transition-colors hover:text-[#2f4538]"
                           >
                              {item.name}
                           </a>
                        )
                     )}
                  </nav>
               </div>
               <div className="flex items-center gap-4">
                  <Link
                     to="/plataforma"
                     onClick={handlePlataformaClick}
                     className="hidden rounded-full bg-[#2f4538] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#2f4538]/80 md:block"
                  >
                     Plataforma
                  </Link>

                  {/* Auth Section */}
                  {isAuthenticated ? (
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                           <User className="w-4 h-4" />
                           <span className="hidden sm:inline">
                              {user?.full_name}
                           </span>
                        </div>
                        <button
                           onClick={handleLogout}
                           className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2f4538] transition-colors"
                        >
                           <LogOut className="w-4 h-4" />
                           <span className="hidden sm:inline">Sair</span>
                        </button>
                     </div>
                  ) : (
                     <div className="flex items-center gap-2">
                        <button
                           onClick={() => handleAuthClick("login")}
                           className="text-gray-700 hover:text-[#2f4538] transition-colors"
                        >
                           Entrar
                        </button>
                     </div>
                  )}

                  <button
                     className="p-2 text-[#2f4538] md:hidden"
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                     {isMenuOpen ? (
                        <X className="w-6 h-6" />
                     ) : (
                        <Menu className="w-6 h-6" />
                     )}
                  </button>
               </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
               <div className="mt-4 pb-4 md:hidden">
                  <nav className="flex flex-col gap-2">
                     {navItems.map((item) =>
                        item.href.startsWith("/") ? (
                           <Link
                              key={item.name}
                              to={item.href}
                              className="px-4 py-2 text-lg text-gray-600 hover:text-[#2f4538]"
                              onClick={() => setIsMenuOpen(false)}
                           >
                              {item.name}
                           </Link>
                        ) : (
                           <a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => {
                                 handleScroll(e, item.href);
                                 setIsMenuOpen(false);
                              }}
                              className="cursor-pointer px-4 py-2 text-lg text-gray-600 hover:text-[#2f4538]"
                           >
                              {item.name}
                           </a>
                        )
                     )}
                  </nav>
                  <Link
                     to="/plataforma"
                     onClick={handlePlataformaClick}
                     className="mt-4 rounded-full bg-[#2f4538] px-6 py-2 text-center font-medium text-white shadow-sm transition-colors hover:bg-[#2f4538]/80"
                  >
                     Plataforma
                  </Link>

                  {!isAuthenticated && (
                     <div className="pt-4 border-t border-gray-200 space-y-2">
                        <button
                           onClick={() => {
                              handleAuthClick("login");
                              setIsMenuOpen(false);
                           }}
                           className="block w-full text-left text-gray-700 hover:text-[#2f4538] transition-colors"
                        >
                           Entrar
                        </button>
                        <button
                           onClick={() => {
                              handleAuthClick("register");
                              setIsMenuOpen(false);
                           }}
                           className="block w-full text-left bg-[#2f4538] text-white px-4 py-2 rounded-lg hover:bg-[#1f2e1f] transition-colors"
                        >
                           Criar Conta
                        </button>
                     </div>
                  )}
               </div>
            )}
         </header>

         {/* Auth Modal - Renderizado fora do header para evitar problemas de z-index */}
         <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authMode}
            onSuccessRedirect={handleLoginSuccess}
         />
      </>
   );
};

export default Header;
