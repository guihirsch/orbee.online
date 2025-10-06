import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calculator, Heart, BarChart3 } from "lucide-react";
import SimpleBackground from "./SimpleBackground";

const HowItWorksSection = () => {
   return (
      <section
         id="how-it-works"
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
               className="text-center mb-16"
            >
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  How It Works
               </h2>
               <p className="text-xl text-gray-600">
                  Simple process in 4 steps
               </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
               >
                  <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-2xl font-bold text-emerald-600">
                        1
                     </span>
                  </div>
                  <div className="group relative overflow-hidden rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     <div className="relative z-10">
                        <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                           We Identify the Area
                        </h3>
                        <p className="text-gray-600 text-sm">
                           Satellite + local community detect degradation
                        </p>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
               >
                  <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-2xl font-bold text-blue-600">2</span>
                  </div>
                  <div className="group relative overflow-hidden rounded-xl border border-blue-400/20 hover:border-blue-400/40 bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     <div className="relative z-10">
                        <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                           We Generate the Plan
                        </h3>
                        <p className="text-gray-600 text-sm">
                           How many seedlings, total cost and schedule
                        </p>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
               >
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-2xl font-bold text-purple-600">
                        3
                     </span>
                  </div>
                  <div className="group relative overflow-hidden rounded-xl border border-purple-400/20 hover:border-purple-400/40 bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     <div className="relative z-10">
                        <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                           You Choose to Support
                        </h3>
                        <p className="text-gray-600 text-sm">
                           Pix subscription or one-time donation
                        </p>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
               >
                  <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="text-2xl font-bold text-green-600">
                        4
                     </span>
                  </div>
                  <div className="group relative overflow-hidden rounded-xl border border-green-400/20 hover:border-green-400/40 bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-green-500/25 transition-all duration-300 ease-in-out hover:-translate-y-1">
                     <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                     <div className="relative z-10">
                        <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                           Monitor in Real Time
                        </h3>
                        <p className="text-gray-600 text-sm">
                           NDVI, field photos and achievements on dashboard
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
   );
};

export default HowItWorksSection;
