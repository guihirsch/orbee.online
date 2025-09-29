/**
 * Serviço para acessar dados em cache
 * Fornece acesso rápido a dados pré-processados
 */

import apiClient from "./apiClient";

class CacheService {
   /**
    * Busca dados municipais do cache
    * @param {string} municipalityCode - Código IBGE do município
    * @param {Object} options - Opções de busca
    * @returns {Promise<Object>} Dados municipais em cache
    */
   async getMunicipalityData(municipalityCode, options = {}) {
      const {
         includeGeometry = true,
         includePlan = true,
         includeNDVI = true,
      } = options;

      try {
         const params = new URLSearchParams({
            include_geometry: includeGeometry,
            include_plan: includePlan,
            include_ndvi: includeNDVI,
         });

         const response = await apiClient.get(
            `/api/v1/cache/municipality/${municipalityCode}/cached?${params}`
         );

         return {
            success: true,
            data: response,
            source: "cache",
         };
      } catch (error) {
         console.error("Erro ao buscar dados em cache:", error);
         return {
            success: false,
            error: error.message,
            source: "cache",
         };
      }
   }

   /**
    * Verifica status do cache para um município
    * @param {string} municipalityCode - Código IBGE do município
    * @returns {Promise<Object>} Status do cache
    */
   async getCacheStatus(municipalityCode) {
      try {
         const response = await apiClient.get(
            `/api/v1/cache/municipality/${municipalityCode}/status`
         );

         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error("Erro ao verificar status do cache:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   }

   /**
    * Busca estatísticas gerais do cache
    * @returns {Promise<Object>} Estatísticas do cache
    */
   async getCacheStatistics() {
      try {
         const response = await apiClient.get(
            "/api/v1/cache/municipalities/stats"
         );
         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error("Erro ao buscar estatísticas do cache:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   }

   /**
    * Limpa cache de um município (requer autenticação)
    * @param {string} municipalityCode - Código IBGE do município
    * @param {string} cacheType - Tipo de cache a limpar
    * @returns {Promise<Object>} Resultado da operação
    */
   async clearMunicipalityCache(municipalityCode, cacheType = "all") {
      try {
         const response = await apiClient.delete(
            `/api/v1/cache/municipality/${municipalityCode}/cache?cache_type=${cacheType}`
         );

         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error("Erro ao limpar cache:", error);
         return {
            success: false,
            error: error.message,
         };
      }
   }

   /**
    * Verifica se dados estão disponíveis em cache
    * @param {string} municipalityCode - Código IBGE do município
    * @returns {Promise<boolean>} True se dados estão em cache
    */
   async isDataCached(municipalityCode) {
      try {
         const status = await this.getCacheStatus(municipalityCode);

         if (!status.success) {
            return false;
         }

         const { cache_status } = status.data;
         return (
            cache_status.geometry.available &&
            cache_status.plan.available &&
            cache_status.ndvi.available
         );
      } catch (error) {
         console.error("Erro ao verificar cache:", error);
         return false;
      }
   }

   /**
    * Busca dados municipais com fallback para API normal
    * @param {string} municipalityCode - Código IBGE do município
    * @param {Object} options - Opções de busca
    * @returns {Promise<Object>} Dados municipais
    */
   async getMunicipalityDataWithFallback(municipalityCode, options = {}) {
      // Primeiro tenta buscar do cache
      const cacheResult = await this.getMunicipalityData(
         municipalityCode,
         options
      );

      if (cacheResult.success && cacheResult.data.cache_status === "complete") {
         return {
            ...cacheResult,
            source: "cache",
            performance: "fast",
         };
      }

      // Se cache não está completo, busca dados parciais
      if (cacheResult.success && cacheResult.data.cache_status === "partial") {
         console.log("Cache parcial disponível, complementando com API...");

         // Aqui você pode implementar lógica para complementar dados faltantes
         // com chamadas à API normal
         return {
            ...cacheResult,
            source: "cache+api",
            performance: "medium",
         };
      }

      // Se não há cache, retorna erro para que o frontend use API normal
      return {
         success: false,
         error: "Cache não disponível",
         source: "none",
         performance: "slow",
      };
   }
}

export default new CacheService();
