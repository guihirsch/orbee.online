import React from "react";
import { motion } from "framer-motion";
import {
   AlertTriangle,
   Droplets,
   TrendingDown,
   DollarSign,
} from "lucide-react";
import SimpleBackground from "./SimpleBackground";

const ProblemSection = () => {
   return (
      <section
         id="problem"
         className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
      >
         {/* Simple Background */}
         <SimpleBackground variant="subtle" />

         <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="text-center mb-12"
            >
               <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                     <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                     The Current Problem
                  </h2>
               </div>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The devastation of riparian forests in Brazil happens
                  silently, without precise data and without adequate
                  monitoring.
               </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-red-400/20 hover:border-red-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-red-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-red-600 mb-4">
                        <Droplets className="w-12 h-12" />
                     </div>
                     <div className="text-3xl font-bold text-red-600 mb-2">
                        75%
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Devastated Riparian Forest
                     </h3>
                     <p className="text-gray-600">
                        of Brazilian riparian forests have already been
                        devastated, compromising water quality and local
                        biodiversity.
                     </p>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-orange-400/20 hover:border-orange-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-orange-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-orange-600 mb-4">
                        <TrendingDown className="w-12 h-12" />
                     </div>
                     <div className="text-3xl font-bold text-orange-600 mb-2">
                        11 mil km²
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Annual Loss
                     </h3>
                     <p className="text-gray-600">
                        of riparian vegetation are lost annually in Brazil, an
                        area equivalent to the state of Qatar.
                     </p>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-yellow-600 mb-4">
                        <DollarSign className="w-12 h-12" />
                     </div>
                     <div className="text-3xl font-bold text-yellow-600 mb-2">
                        R$ 2,8 bi
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Lost Resources
                     </h3>
                     <p className="text-gray-600">
                        are wasted annually on resources that could be directed
                        to preservation and recovery.
                     </p>
                  </div>
               </motion.div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               viewport={{ once: true }}
               className="group relative overflow-hidden rounded-2xl border border-red-400/20 hover:border-red-400/40 bg-white/90 backdrop-blur-sm p-12 shadow-xl hover:shadow-red-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1 text-center"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6">
                     <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">
                     11 thousand km² lost per year
                  </h3>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                     Without precise data, without monitoring, without
                     coordinated action. The devastation continues invisible
                     until it's too late.
                  </p>
               </div>
            </motion.div>
         </div>
      </section>
   );
};

export default ProblemSection;
