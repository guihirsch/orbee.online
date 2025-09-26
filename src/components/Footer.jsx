import React from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../hooks/useScrollAnimation";

const Footer = () => {
   const [footerRef, footerVisible] = useScrollAnimation();
   const currentYear = new Date().getFullYear();

   const navigationLinks = [
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
         const targetElement = document.getElementById(targetId);
         if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
         } else {
            window.location.hash = href;
         }
      }
   };

   return (
      <footer className="relative text-gray-900 overflow-hidden bg-white">
         <div
            className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in-on-scroll ${footerVisible ? "visible" : ""}`}
            ref={footerRef}
         >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start mb-8">
               <div className="md:col-span-2">
                  <div className="flex items-center gap-1 mb-4">
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
                     </span>
                  </div>
                  <p className="text-gray-600 max-w-xl leading-relaxed">
                     Inteligência coletiva para um futuro sustentável.
                  </p>
               </div>

               <div>
                  <h3 className="text-base font-semibold mb-4 text-[#2f4538]">
                     Navegação
                  </h3>
                  <ul className="space-y-2">
                     {navigationLinks.map((link, index) => (
                        <li key={index}>
                           {link.href.startsWith("/") ? (
                              <Link
                                 to={link.href}
                                 className="text-gray-600 hover:text-[#2f4538] transition-colors"
                              >
                                 {link.name}
                              </Link>
                           ) : (
                              <a
                                 href={link.href}
                                 onClick={(e) => handleScroll(e, link.href)}
                                 className="cursor-pointer text-gray-600 hover:text-[#2f4538] transition-colors"
                              >
                                 {link.name}
                              </a>
                           )}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-500 text-sm">
                     © {currentYear} orbee. Todos os direitos reservados.
                  </p>
                  <div className="text-sm text-gray-500">
                     Feito com ❤️ no Brasil
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
