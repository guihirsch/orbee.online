import React from "react";
import { motion } from "framer-motion";
import { Rocket, Globe, Zap, Smartphone } from "lucide-react";
import SimpleBackground from "./SimpleBackground";

const FutureSection = () => {
   return (
      <section
         id="future"
         className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
      >
         {/* Simple Background */}
         <SimpleBackground variant="default" />

         <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="text-center mb-16"
            >
               <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                     <Rocket className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                     O Que Vem Pela Frente
                  </h2>
               </div>
               <p className="text-xl text-gray-600">
                  Próximos marcos da nossa jornada
               </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="flex items-center mb-4">
                        <Globe className="w-8 h-8 text-cyan-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">
                           Expansão Nacional
                        </h3>
                     </div>
                     <p className="text-gray-600 mb-4">
                        Cobertura completa do território brasileiro até dezembro
                        de 2024
                     </p>
                     <div className="bg-cyan-500/20 rounded-lg p-3">
                        <p className="text-cyan-600 font-medium text-sm">
                           Meta: 100 municípios monitorados
                        </p>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-purple-400/20 hover:border-purple-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="flex items-center mb-4">
                        <Smartphone className="w-8 h-8 text-purple-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">
                           App Mobile
                        </h3>
                     </div>
                     <p className="text-gray-600 mb-4">
                        Aplicativo nativo para validação em campo e gamificação
                     </p>
                     <div className="bg-purple-500/20 rounded-lg p-3">
                        <p className="text-purple-600 font-medium text-sm">
                           Lançamento: Q1 2025
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               viewport={{ once: true }}
               className="group relative overflow-hidden rounded-xl border border-green-400/20 hover:border-green-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-green-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1 mb-8"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
               <div className="relative z-10">
                  <div className="flex items-center mb-4">
                     <Zap className="w-8 h-8 text-green-600 mr-3" />
                     <h3 className="text-2xl font-semibold text-gray-900">
                        IA Preditiva
                     </h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">
                     Algoritmos que preveem degradação antes que ela aconteça,
                     permitindo ação preventiva em tempo real
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                     <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <p className="text-green-600 font-bold text-lg">95%</p>
                        <p className="text-gray-600 text-sm">
                           Precisão na previsão
                        </p>
                     </div>
                     <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <p className="text-green-600 font-bold text-lg">
                           30 dias
                        </p>
                        <p className="text-gray-600 text-sm">
                           Antecedência do alerta
                        </p>
                     </div>
                     <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <p className="text-green-600 font-bold text-lg">60%</p>
                        <p className="text-gray-600 text-sm">
                           Redução de custos
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               viewport={{ once: true }}
               className="group relative overflow-hidden rounded-xl border border-orange-400/20 hover:border-orange-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1 text-center"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
               <div className="relative z-10">
                  <Rocket className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                     Visão 2030
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                     Ser a{" "}
                     <span className="text-orange-600 font-bold">
                        maior plataforma
                     </span>{" "}
                     de restauração ambiental colaborativa da América Latina,
                     <br />
                     conectando{" "}
                     <span className="text-orange-600 font-bold">
                        1 milhão de guardiões
                     </span>
                     em defesa dos nossos biomas.
                  </p>
               </div>
            </motion.div>
         </div>
      </section>
   );
};

export default FutureSection;
