import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Início", href: "#features" },
    { name: "Plataforma", href: "#how-it-works" },
    { name: "Comunidade", href: "/community" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="w-full px-6 py-4 backdrop-blur-sm bg-slate-900/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
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
            </span>{" "}
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="rounded-full px-4 py-2 font-medium text-gray-400 transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="cursor-pointer rounded-full px-4 py-2 font-medium text-gray-400 transition-colors hover:text-white"
                >
                  {item.name}
                </a>
              )
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="hidden rounded-full bg-green-500 px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-green-600 md:block"
          >
            Acessar Plataforma
          </Link>
          <button
            className="p-2 text-white md:hidden"
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
                  className="px-4 py-2 text-lg text-gray-400 hover:text-white"
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
                  className="cursor-pointer px-4 py-2 text-lg text-gray-400 hover:text-white"
                >
                  {item.name}
                </a>
              )
            )}
            <Link
              to="/dashboard"
              className="mt-4 rounded-full bg-green-500 px-6 py-2 text-center font-medium text-white shadow-sm transition-colors hover:bg-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Acessar Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
