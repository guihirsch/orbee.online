import React from "react";
import { motion } from "framer-motion";
import { Leaf, MapPin, Calculator, Heart } from "lucide-react";

const SolutionSection = () => {
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
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              A Solução Orbee
            </h2>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="text-emerald-400 mb-4">
              <MapPin className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Identificação Precisa</h3>
            <p className="text-gray-300">Usa NDVI e dados geoespaciais para identificar áreas degradadas com precisão científica</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="text-blue-400 mb-4">
              <Calculator className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Planos em Tempo Real</h3>
            <p className="text-gray-300">Calcula planos de recuperação ambiental instantaneamente, incluindo custos detalhados</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="text-purple-400 mb-4">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Financiamento Coletivo</h3>
            <p className="text-gray-300">Permite crowdfunding com acompanhamento direto no mapa em tempo real</p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-8 backdrop-blur-sm text-center"
        >
          <p className="text-2xl text-white leading-relaxed">
            "Com a Orbee, você vê o impacto da sua contribuição, 
            <span className="text-emerald-400 font-bold">árvore por árvore, hectare por hectare.</span>"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;