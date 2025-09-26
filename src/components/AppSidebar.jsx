import React from "react";
import { Home, Globe, Leaf, Target, ChevronLeft, Users } from "lucide-react";
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
import { TooltipProvider } from "./ui/Tooltip";

const AppSidebar = ({ selectedSubSection, setSelectedSubSection }) => {
   const {
      open: sidebarExpanded,
      toggleSidebar,
      state,
      isMobile,
   } = useSidebar();

   const menuItems = [
      {
         id: "inicio",
         title: "Início",
         icon: Home,
         tooltip: "Dashboard pessoal",
         description: "Conquistas, pesquisas e monitoramento",
      },
      {
         id: "caracteristicas",
         title: "Características",
         icon: Globe,
         tooltip: "Características da região",
         description: "Localização e dados da região",
      },
      {
         id: "saude",
         title: "Situação",
         icon: Leaf,
         tooltip: "Saúde da mata ciliar",
         description: "Estado atual da vegetação",
      },
      {
         id: "acoes",
         title: "Ações",
         icon: Target,
         tooltip: "Ações necessárias",
         description: "Recomendações e próximos passos",
      },
      {
         id: "comunidade",
         title: "Comunidade",
         icon: Users,
         tooltip: "Comunidade da região",
         description: "Conecte-se com outros guardiões",
      },
   ];

   return (
      <TooltipProvider>
         <Sidebar
            collapsible="icon"
            className="border-r border-emerald-400/20 bg-slate-900/80 backdrop-blur-xl"
         >
            <SidebarContent
               className={`transition-all duration-100 ease-in-out ${
                  state === "collapsed" ? "p-2" : "p-2"
               }`}
            >
               {/* Header with Logo and Toggle */}
               <div
                  className={`flex items-center gap-3 ${isMobile ? "mb-4" : "mb-3"} ${
                     state === "collapsed"
                        ? "justify-center"
                        : "justify-between"
                  }`}
               >
                  {/* OrBee Logo - Only in expanded mode */}
                  {state === "expanded" && (
                     <div className="group relative flex h-[50px] min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-xl border border-emerald-400/30 bg-emerald-600/20 px-4 backdrop-blur-sm transition-all duration-75 ease-in-out hover:border-emerald-400/50 hover:bg-emerald-600/30">
                        {/* Noise Effect */}
                        <div
                           className="absolute inset-0 opacity-20 mix-blend-overlay"
                           style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='logoNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23logoNoiseFilter)'/%3E%3C/svg%3E")`,
                              backgroundSize: "64px 64px",
                           }}
                        />
                        <div className="relative z-10 flex items-center gap-3 text-emerald-300 transition-all duration-75 ease-in-out group-hover:text-white">
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
                              className="flex-shrink-0 transition-all duration-75 ease-in-out"
                           >
                              <path d="m8 2 1.88 1.88" />
                              <path d="M14.12 3.88 16 2" />
                              <path d="M9 7V6a3 3 0 1 1 6 0v1" />
                              <path d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z" />
                              <path d="M7.56 12h8.87" />
                              <path d="M7.5 17h9" />
                              <path d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3" />
                           </svg>
                           <span className="font-odor-mean-chey text-2xl font-bold text-emerald-300 transition-colors group-hover:text-white">
                              Orbee
                           </span>
                        </div>
                     </div>
                  )}

                  {/* Menu Toggle Button */}
                  <button
                     onClick={toggleSidebar}
                     className={`group relative overflow-hidden rounded-xl border border-emerald-400/30 bg-emerald-600/20 backdrop-blur-sm transition-all duration-75 ease-in-out hover:border-emerald-400/50 hover:bg-emerald-600/30 ${
                        isMobile ? "h-[56px] w-[56px]" : "h-[50px] w-[50px]"
                     }`}
                  >
                     {/* Noise Effect */}
                     <div
                        className="absolute inset-0 opacity-20 mix-blend-overlay"
                        style={{
                           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='toggleNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23toggleNoiseFilter)'/%3E%3C/svg%3E")`,
                           backgroundSize: "64px 64px",
                        }}
                     />
                     <div className="relative z-10 flex items-center justify-center text-emerald-300 transition-all duration-75 ease-in-out group-hover:text-white">
                        <ChevronLeft
                           className={`h-5 w-5 transition-transform duration-75 ease-in-out ${
                              state === "collapsed" ? "rotate-180" : ""
                           }`}
                        />
                     </div>
                  </button>
               </div>

               {/* Menu Items */}
               <SidebarGroup>
                  <SidebarGroupContent>
                     <SidebarMenu
                        className={`transition-all duration-100 ease-in-out ${
                           state === "collapsed"
                              ? "space-y-2"
                              : isMobile
                                ? "space-y-4"
                                : "space-y-3"
                        }`}
                     >
                        {menuItems.map((item) => {
                           const Icon = item.icon;
                           const isActive = selectedSubSection === item.id;

                           return (
                              <SidebarMenuItem key={item.id}>
                                 <div
                                    onClick={() =>
                                       setSelectedSubSection(item.id)
                                    }
                                    className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border flex transition-all duration-75 ease-in-out cursor-pointer ${
                                       isActive
                                          ? "border-emerald-400/50 bg-emerald-500/30"
                                          : "border-emerald-400/20 bg-emerald-500/10 hover:bg-emerald-500/15"
                                    } ${
                                       state === "collapsed"
                                          ? "justify-center items-center h-[50px] w-[50px] mx-auto p-2"
                                          : isMobile
                                            ? "justify-start items-center h-[50px] w-full p-4"
                                            : "justify-start items-center h-[50px] w-full p-3"
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
                                       isActive={isActive}
                                       className={`h-auto border-0 bg-transparent hover:bg-transparent pointer-events-none ${
                                          state === "collapsed"
                                             ? "w-[44px] p-0"
                                             : "w-full p-0"
                                       } ${
                                          state === "collapsed"
                                             ? "justify-center"
                                             : "justify-start"
                                       }`}
                                    >
                                       <div
                                          className={`flex items-center ${
                                             state === "collapsed"
                                                ? "justify-center"
                                                : "justify-start w-full"
                                          }`}
                                       >
                                          <Icon
                                             className={`relative z-10 text-emerald-300 transition-all duration-75 ease-in-out group-hover:text-white flex-shrink-0 ${
                                                state === "collapsed"
                                                   ? "h-6 w-6"
                                                   : isMobile
                                                     ? "h-6 w-6"
                                                     : "h-6 w-6"
                                             }`}
                                          />
                                          {state === "expanded" && (
                                             <div className="relative z-10 ml-3 flex flex-col">
                                                <span
                                                   className={`text-emerald-300 transition-colors duration-75 ease-in-out group-hover:text-white font-medium ${
                                                      isMobile
                                                         ? "text-base"
                                                         : "text-sm"
                                                   }`}
                                                >
                                                   {item.title}
                                                </span>
                                                {isMobile && (
                                                   <span className="text-xs text-emerald-400/70 transition-colors duration-75 ease-in-out group-hover:text-emerald-200/80 mt-0.5">
                                                      {item.description}
                                                   </span>
                                                )}
                                             </div>
                                          )}
                                       </div>
                                    </SidebarMenuButton>
                                 </div>
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
