import React from "react";
import { motion } from "framer-motion";
import { Leaf, MapPin, Calculator, Heart } from "lucide-react";
import SimpleBackground from "./SimpleBackground";

const SolutionSection = () => {
   return (
      <section
         id="solution"
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
               className="text-center mb-12"
            >
               <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                     <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                     The Orbee Solution
                  </h2>
               </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-emerald-600 mb-4">
                        <MapPin className="w-12 h-12" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Precise Identification
                     </h3>
                     <p className="text-gray-600">
                        Uses NDVI and geospatial data to identify degraded areas
                        with scientific precision
                     </p>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-blue-400/20 hover:border-blue-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-blue-600 mb-4">
                        <Calculator className="w-12 h-12" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Real-Time Plans
                     </h3>
                     <p className="text-gray-600">
                        Calculates environmental recovery plans instantly,
                        including detailed costs
                     </p>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl border border-purple-400/20 hover:border-purple-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                     <div className="text-purple-600 mb-4">
                        <Heart className="w-12 h-12" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Crowdfunding
                     </h3>
                     <p className="text-gray-600">
                        Enables crowdfunding with direct monitoring on the map
                        in real time
                     </p>
                  </div>
               </motion.div>
            </div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               viewport={{ once: true }}
               className="group relative overflow-hidden rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1 text-center"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
               <div className="relative z-10">
                  <p className="text-2xl text-gray-900 leading-relaxed">
                     "With Orbee, you see the impact of your contribution,
                     <span className="text-emerald-600 font-bold">
                        tree by tree, hectare by hectare.
                     </span>
                     "
                  </p>
               </div>
            </motion.div>
         </div>
      </section>
   );
};

export default SolutionSection;
