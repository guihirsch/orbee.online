import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                  className="hidden rounded-full bg-[#2f4538] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#2f4538]/80 md:block"
               >
                  Plataforma
               </Link>
               <button
                  className="p-2 text-[#2f4538] md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                  <svg
                     className="h-6 w-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                     />
                  </svg>
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
                  onClick={() => {
                     setIsMenuOpen(false);
                  }}
                  className="mt-4 rounded-full bg-[#2f4538] px-6 py-2 text-center font-medium text-white shadow-sm transition-colors hover:bg-[#2f4538]/80"
               >
                  Plataforma
               </Link>
            </div>
         )}
      </header>
   );
};

export default Header;
