import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, TrendingDown, DollarSign, TreePine, Waves } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              O Problema Atual
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A devastação das matas ciliares no Brasil acontece de forma silenciosa, 
            sem dados precisos e sem acompanhamento adequado.
          </p>
        </motion.div>
          
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-red-500/10 border border-red-400/30 rounded-xl p-8 backdrop-blur-sm hover:bg-red-500/15 transition-all duration-300"
          >
            <div className="text-red-400 mb-4">
              <Droplets className="w-12 h-12" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">75%</div>
            <h3 className="text-xl font-semibold text-white mb-3">Mata Ciliar Devastada</h3>
            <p className="text-gray-300">
              das matas ciliares brasileiras já foram devastadas, comprometendo 
              a qualidade da água e a biodiversidade local.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-8 backdrop-blur-sm hover:bg-orange-500/15 transition-all duration-300"
          >
            <div className="text-orange-400 mb-4">
              <TrendingDown className="w-12 h-12" />
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-2">11 mil km²</div>
            <h3 className="text-xl font-semibold text-white mb-3">Perda Anual</h3>
            <p className="text-gray-300">
              de vegetação ciliar são perdidos anualmente no Brasil, 
              uma área equivalente ao estado do Catar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-8 backdrop-blur-sm hover:bg-yellow-500/15 transition-all duration-300"
          >
            <div className="text-yellow-400 mb-4">
              <DollarSign className="w-12 h-12" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">R$ 2,8 bi</div>
            <h3 className="text-xl font-semibold text-white mb-3">Recursos Perdidos</h3>
            <p className="text-gray-300">
              são desperdiçados anualmente em recursos que poderiam ser 
              direcionados para preservação e recuperação.
            </p>
          </motion.div>
        </div>
          
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl p-12 text-white border border-red-400/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold mb-4">
            11 mil km² perdidos por ano
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Sem dados precisos, sem acompanhamento, sem ação coordenada. 
            A devastação continua invisível até que seja tarde demais.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;