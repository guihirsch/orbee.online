import React from "react";
import { motion } from "framer-motion";
import { Trophy, TreePine, Users, Target } from "lucide-react";

const AchievementsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Minhas Conquistas
            </h2>
          </div>
          <p className="text-xl text-gray-300">Impacto real que já alcançamos juntos</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-6 text-center backdrop-blur-sm"
          >
            <TreePine className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">2.847</div>
            <p className="text-emerald-400 font-medium">Mudas Plantadas</p>
            <p className="text-gray-400 text-sm mt-1">Equivale a 1,2 hectares</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 text-center backdrop-blur-sm"
          >
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">156</div>
            <p className="text-blue-400 font-medium">Guardiões Ativos</p>
            <p className="text-gray-400 text-sm mt-1">Em 12 municípios</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-6 text-center backdrop-blur-sm"
          >
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">89%</div>
            <p className="text-purple-400 font-medium">Taxa de Sobrevivência</p>
            <p className="text-gray-400 text-sm mt-1">Acima da média nacional</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 text-center backdrop-blur-sm"
          >
            <div className="text-green-400 text-2xl font-bold mb-4">CO₂</div>
            <div className="text-3xl font-bold text-white mb-2">42,3t</div>
            <p className="text-green-400 font-medium">CO₂ Capturado</p>
            <p className="text-gray-400 text-sm mt-1">Nos próximos 20 anos</p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-8 backdrop-blur-sm text-center"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Reconhecimento</h3>
          <p className="text-xl text-gray-300 leading-relaxed">
            <span className="text-yellow-400 font-bold">Finalista</span> no Prêmio Jovem Cientista 2024 
            <br />categoria Tecnologia para Sustentabilidade
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;