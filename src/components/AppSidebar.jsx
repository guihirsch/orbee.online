import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Leaf, Target, ChevronLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { TooltipProvider } from "./ui/tooltip";

const AppSidebar = ({ selectedSubSection, setSelectedSubSection }) => {
  const { open: sidebarExpanded, toggleSidebar, state, isMobile } = useSidebar();

  const menuItems = [
    {
      id: "caracteristicas",
      title: "Características",
      icon: Globe,
      tooltip: "Características da região",
      description: "Localização e dados da região"
    },
    {
      id: "saude",
      title: "Situação",
      icon: Leaf,
      tooltip: "Saúde da mata ciliar",
      description: "Estado atual da vegetação"
    },
    {
      id: "acoes",
      title: "Ações",
      icon: Target,
      tooltip: "Ações necessárias",
      description: "Recomendações e próximos passos"
    },
  ];

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-emerald-400/20 bg-slate-900/80 backdrop-blur-xl"
      >
        <SidebarContent
          className={`transition-all duration-200 ${
            state === "collapsed" ? "p-2" : "p-2"
          }`}
        >
          {/* Header with Logo and Toggle */}
          <div
            className={`flex items-center gap-3 ${
              isMobile ? "mb-8" : "mb-6"
            } ${
              state === "collapsed" ? "justify-center" : "justify-between"
            }`}
          >
            {/* OrBee Logo - Only in expanded mode */}
            {state === "expanded" && (
              <motion.div
                className="group relative flex h-[50px] min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-xl border border-emerald-400/30 bg-emerald-600/20 px-4 backdrop-blur-sm transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-600/30 hover:shadow-lg hover:shadow-emerald-400/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* Noise Effect */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='logoNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23logoNoiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: "64px 64px",
                  }}
                />
                <div className="relative z-10 flex items-center gap-3 text-emerald-300 transition-all duration-200 group-hover:scale-110 group-hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 transition-all duration-200"
                  >
                    <path d="m8 2 1.88 1.88" />
                    <path d="M14.12 3.88 16 2" />
                    <path d="M9 7V6a3 3 0 1 1 6 0v1" />
                    <path d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z" />
                    <path d="M7.56 12h8.87" />
                    <path d="M7.5 17h9" />
                    <path d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3" />
                  </svg>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    className="font-odor-mean-chey text-2xl font-bold text-emerald-300 transition-colors group-hover:text-white"
                  >
                    Orbee
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Menu Toggle Button */}
            <motion.button
              onClick={toggleSidebar}
              className={`group relative overflow-hidden rounded-xl border border-emerald-400/30 bg-emerald-600/20 backdrop-blur-sm transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-600/30 hover:shadow-lg hover:shadow-emerald-400/20 ${
                isMobile ? "h-[56px] w-[56px]" : "h-[50px] w-[50px]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Noise Effect */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='toggleNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23toggleNoiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: "64px 64px",
                }}
              />
              <div className="relative z-10 flex items-center justify-center text-emerald-300 transition-all duration-200 group-hover:scale-110 group-hover:text-white">
                  <ChevronLeft
                    className={`h-5 w-5 transition-transform duration-200 ${
                      state === "collapsed" ? "rotate-180" : ""
                    }`}
                  />
              </div>
            </motion.button>
          </div>

          {/* Menu Items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu
                className={`transition-all duration-200 ${
                  state === "collapsed" ? "space-y-2" : isMobile ? "space-y-4" : "space-y-3"
                }`}
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedSubSection === item.id;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <motion.div
                        animate={{
                          backgroundColor: isActive
                            ? "rgba(16, 185, 129, 0.3)"
                            : "rgba(16, 185, 129, 0.1)",
                          padding: state === "collapsed" ? "8px" : isMobile ? "16px" : "12px",
                        }}
                        whileHover={{
                          scale: state === "collapsed" ? 1.05 : isMobile ? 1.02 : 1.01,
                          backgroundColor: isActive
                            ? "rgba(16, 185, 129, 0.35)"
                            : "rgba(16, 185, 129, 0.15)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border flex w-full transition-all duration-200 ${
                          isActive
                            ? "border-emerald-400/50 shadow-lg shadow-emerald-400/20"
                            : "border-emerald-400/20"
                        } ${
                          state === "collapsed"
                            ? "justify-center items-center min-h-[50px] w-[50px] mx-auto"
                            : isMobile
                            ? "justify-start items-center min-h-[60px]"
                            : "justify-start items-center min-h-[50px]"
                        }`}
                      >
                        {/* Noise Effect for Nav Button */}
                        <div
                          className="absolute inset-0 opacity-15 mix-blend-overlay"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='navNoiseFilter${item.id}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23navNoiseFilter${item.id})'/%3E%3C/svg%3E")`,
                            backgroundSize: "128px 128px",
                          }}
                        />

                        <SidebarMenuButton
                          onClick={() => setSelectedSubSection(item.id)}
                          tooltip={
                            state === "collapsed" ? item.tooltip : undefined
                          }
                          isActive={isActive}
                          className={`h-auto border-0 bg-transparent hover:bg-transparent ${
                            state === "collapsed"
                              ? "w-[44px] p-0"
                              : "w-full p-0"
                          } ${
                            state === "collapsed"
                              ? "justify-center"
                              : "justify-start"
                          }`}
                        >
                          <div className={`flex items-center ${
                            state === "collapsed" ? "justify-center" : "justify-start w-full"
                          }`}>
                            <Icon
                              className={`relative z-10 text-emerald-300 transition-all duration-200 group-hover:text-white group-hover:scale-110 flex-shrink-0 ${
                                state === "collapsed"
                                  ? "h-6 w-6"
                                  : isMobile
                                  ? "h-6 w-6"
                                  : "h-5 w-5"
                              }`}
                            />
                            <AnimatePresence>
                              {state === "expanded" && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.15, delay: 0.05 }}
                                  className="relative z-10 ml-3 flex flex-col"
                                >
                                  <span className={`text-emerald-300 transition-colors group-hover:text-white font-medium ${
                                    isMobile ? "text-base" : "text-sm"
                                  }`}>
                                    {item.title}
                                  </span>
                                  {isMobile && (
                                    <span className="text-xs text-emerald-400/70 transition-colors group-hover:text-emerald-200/80 mt-0.5">
                                      {item.description}
                                    </span>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default AppSidebar;
