import santaCruzDoSulData from "../data/santaCruzDoSul.js";
import { apiClient } from "./apiClient";

// Serviço para integração com APIs de dados NDVI
class NDVIService {
   constructor() {
      this.useStaticData = import.meta.env.VITE_USE_STATIC_DATA === "true";
   }

   // Helpers

   getUserToken() {
      return (
         localStorage.getItem("auth_token") ||
         localStorage.getItem("authToken") ||
         ""
      );
   }

   // Busca dados NDVI por coordenadas e período
   async getNDVIData(latitude, longitude, startDate, endDate, options = {}) {
      try {
         const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            start_date: startDate,
            end_date: endDate,
            ...options,
         });
         const data = await apiClient.get(
            `/api/v1/ndvi/data?${params.toString()}`
         );
         // Normaliza para { data }
         const series = data?.time_series || data?.data || [];
         return { data: series };
      } catch (error) {
         console.error("Erro ao buscar dados NDVI:", error);
         return this.getMockNDVIData(latitude, longitude, startDate, endDate);
      }
   }

   // Busca dados NDVI atuais para uma localização
   async getCurrentNDVI(latitude, longitude) {
      // Verifica se está na região de Santa Cruz do Sul
      if (this.useStaticData && this.isInSantaCruzDoSul(latitude, longitude)) {
         return this.getSantaCruzDoSulNDVI(latitude, longitude);
      }

      try {
         const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
         });
         return await apiClient.get(
            `/api/v1/ndvi/current?${params.toString()}`
         );
      } catch (error) {
         console.error("Erro ao buscar NDVI atual:", error);
         // Fallback para dados mockados
         return {
            ndvi: 0.6 + Math.sin(latitude * 0.1) * 0.2,
            date: new Date().toISOString().split("T")[0],
            quality: "medium",
            cloud_coverage: Math.random() * 30,
         };
      }
   }

   // Busca série temporal de NDVI
   async getNDVITimeSeries(latitude, longitude, period = "90d") {
      // Verifica se está na região de Santa Cruz do Sul
      if (this.useStaticData && this.isInSantaCruzDoSul(latitude, longitude)) {
         return this.getSantaCruzDoSulTimeSeries(period);
      }

      try {
         const days = this.getPeriodDays(period);
         const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            days: String(days),
         });
         const resp = await apiClient.get(
            `/api/v1/ndvi/timeseries?${params.toString()}`
         );
         // Normaliza para o formato usado pelos componentes
         const series = (resp?.time_series || []).map((item) => ({
            date: item.date,
            ndvi: item.ndvi,
            precipitation: item.precipitation ?? 0,
            temperature: item.temperature ?? 25,
            cloud_coverage: item.cloud_coverage ?? 0,
         }));
         return {
            data: series,
            source: resp?.data_source || "api",
            statistics: this.calculateStatistics(series),
         };
      } catch (error) {
         console.error("Erro ao buscar série temporal:", error);
         // Fallback para dados mockados
         return this.getMockTimeSeriesData(latitude, longitude, period);
      }
   }

   // Busca alertas NDVI para uma região
   async getNDVIAlerts(latitude, longitude, radius = 1000) {
      try {
         const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            radius: radius.toString(),
         });
         return await apiClient.get(`/api/v1/ndvi/alerts?${params.toString()}`);
      } catch (error) {
         console.error("Erro ao buscar alertas:", error);
         return { alerts: [] };
      }
   }

   // Análise de saúde da vegetação
   async getVegetationHealth(latitude, longitude) {
      try {
         const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
         });
         return await apiClient.get(`/api/v1/ndvi/health?${params.toString()}`);
      } catch (error) {
         console.error("Erro ao analisar saúde da vegetação:", error);
         // Fallback para análise mockada
         const currentNDVI = 0.6 + Math.sin(latitude * 0.1) * 0.2;
         return {
            health_status:
               currentNDVI > 0.6
                  ? "healthy"
                  : currentNDVI > 0.4
                    ? "moderate"
                    : "poor",
            ndvi_value: currentNDVI,
            trend: Math.random() > 0.5 ? "improving" : "declining",
            recommendations: this.getHealthRecommendations(currentNDVI),
         };
      }
   }

   // Gera dados NDVI mockados para desenvolvimento
   getMockNDVIData(latitude, longitude, startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const data = [];

      const baseNDVI = 0.6 + Math.sin(latitude * 0.1) * 0.2;

      for (
         let date = new Date(start);
         date <= end;
         date.setDate(date.getDate() + 7)
      ) {
         const seasonalFactor =
            1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
         const noise = (Math.random() - 0.5) * 0.1;
         const ndviValue = Math.max(
            0,
            Math.min(1, baseNDVI * seasonalFactor + noise)
         );

         data.push({
            date: date.toISOString().split("T")[0],
            ndvi: parseFloat(ndviValue.toFixed(3)),
            quality: Math.random() > 0.3 ? "high" : "medium",
            cloud_coverage: Math.random() * 30,
         });
      }

      return { data, source: "mock" };
   }

   // Gera dados de série temporal mockados
   getMockTimeSeriesData(latitude, longitude, period) {
      const days = this.getPeriodDays(period);
      const data = [];
      const today = new Date();

      const baseNDVI = 0.6 + Math.sin(latitude * 0.1) * 0.2;

      for (let i = days; i >= 0; i -= 7) {
         const date = new Date(today);
         date.setDate(date.getDate() - i);

         const seasonalFactor =
            1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
         const trendFactor = 1 + (i / days) * 0.1;
         const noise = (Math.random() - 0.5) * 0.1;

         const ndviValue = Math.max(
            0,
            Math.min(1, baseNDVI * seasonalFactor * trendFactor + noise)
         );

         data.push({
            date: date.toISOString().split("T")[0],
            ndvi: parseFloat(ndviValue.toFixed(3)),
            precipitation: Math.max(
               0,
               50 + (ndviValue - 0.5) * 100 + (Math.random() - 0.5) * 30
            ),
            temperature: 25 + (Math.random() - 0.5) * 10,
            cloud_coverage: Math.random() * 30,
         });
      }

      return {
         data: data.reverse(),
         source: "mock",
         statistics: this.calculateStatistics(data),
      };
   }

   // Converte período em dias
   getPeriodDays(period) {
      const periodMap = {
         "30d": 30,
         "90d": 90,
         "180d": 180,
         "1y": 365,
      };
      return periodMap[period] || 90;
   }

   // Calcula estatísticas dos dados
   calculateStatistics(data) {
      if (!data || data.length === 0) return null;

      const ndviValues = data.map((d) => d.ndvi);
      const current = ndviValues[ndviValues.length - 1];
      const previous = ndviValues[ndviValues.length - 2] || current;
      const average = ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length;
      const max = Math.max(...ndviValues);
      const min = Math.min(...ndviValues);

      return {
         current: parseFloat(current.toFixed(3)),
         average: parseFloat(average.toFixed(3)),
         max: parseFloat(max.toFixed(3)),
         min: parseFloat(min.toFixed(3)),
         trend:
            current > previous ? "up" : current < previous ? "down" : "stable",
         change: parseFloat(
            (((current - previous) / previous) * 100).toFixed(1)
         ),
      };
   }

   // Gera recomendações baseadas na saúde da vegetação
   getHealthRecommendations(ndviValue) {
      if (ndviValue > 0.7) {
         return [
            "Vegetação em excelente estado",
            "Continue o monitoramento regular",
            "Considere expandir a área de conservação",
         ];
      } else if (ndviValue > 0.5) {
         return [
            "Vegetação em bom estado",
            "Monitore mudanças sazonais",
            "Mantenha práticas de conservação",
         ];
      } else if (ndviValue > 0.3) {
         return [
            "Vegetação com sinais de estresse",
            "Investigue possíveis causas",
            "Considere ações de recuperação",
         ];
      } else {
         return [
            "Vegetação em estado crítico",
            "Ação imediata necessária",
            "Consulte especialistas locais",
         ];
      }
   }

   // Formata coordenadas para requisições
   formatCoordinates(latitude, longitude) {
      return {
         latitude: parseFloat(latitude.toFixed(6)),
         longitude: parseFloat(longitude.toFixed(6)),
      };
   }

   // Valida coordenadas
   validateCoordinates(latitude, longitude) {
      return (
         typeof latitude === "number" &&
         typeof longitude === "number" &&
         latitude >= -90 &&
         latitude <= 90 &&
         longitude >= -180 &&
         longitude <= 180
      );
   }

   // Verifica se as coordenadas estão na região de Santa Cruz do Sul
   isInSantaCruzDoSul(latitude, longitude) {
      const santaCruzCenter = santaCruzDoSulData.city.coordinates;
      const tolerance = 0.05; // ~5km de raio

      return (
         Math.abs(latitude - santaCruzCenter.latitude) <= tolerance &&
         Math.abs(longitude - santaCruzCenter.longitude) <= tolerance
      );
   }

   // Retorna dados NDVI específicos para Santa Cruz do Sul
   getSantaCruzDoSulNDVI(latitude, longitude) {
      // Encontra a região mais próxima
      let closestRegion = santaCruzDoSulData.ndviRegions[0];
      let minDistance = this.calculateDistance(
         latitude,
         longitude,
         closestRegion.coordinates.latitude,
         closestRegion.coordinates.longitude
      );

      for (const region of santaCruzDoSulData.ndviRegions) {
         const distance = this.calculateDistance(
            latitude,
            longitude,
            region.coordinates.latitude,
            region.coordinates.longitude
         );

         if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
         }
      }

      return {
         ndvi: closestRegion.ndvi,
         date: new Date().toISOString().split("T")[0],
         quality: "high",
         cloud_coverage: Math.random() * 10, // Baixa cobertura de nuvens
         region: closestRegion.name,
         status: closestRegion.status,
         description: closestRegion.description,
      };
   }

   // Retorna série temporal para Santa Cruz do Sul
   getSantaCruzDoSulTimeSeries(period) {
      const days = this.getPeriodDays(period);
      const allData = santaCruzDoSulData.timeSeriesData;

      // Filtra dados baseado no período
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const filteredData = allData.filter((item) => {
         const itemDate = new Date(item.date);
         return itemDate >= cutoffDate;
      });

      return {
         data: filteredData,
         source: "santa_cruz_do_sul_static",
         statistics: this.calculateStatistics(filteredData),
         city: santaCruzDoSulData.city.name,
      };
   }

   // Calcula distância entre duas coordenadas (fórmula de Haversine simplificada)
   calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Raio da Terra em km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
   }

   // Retorna dados GeoJSON para Santa Cruz do Sul
   getSantaCruzDoSulGeoJSON() {
      return {
         type: "FeatureCollection",
         features: santaCruzDoSulData.ndviRegions.map((region) => ({
            type: "Feature",
            properties: {
               id: region.id,
               name: region.name,
               ndvi: region.ndvi,
               status: region.status,
               description: region.description,
            },
            geometry: region.geometry,
         })),
      };
   }

   // Retorna recomendações específicas para Santa Cruz do Sul
   getSantaCruzDoSulRecommendations(status) {
      return santaCruzDoSulData.recommendations[status] || [];
   }

   // Retorna alertas para Santa Cruz do Sul
   getSantaCruzDoSulAlerts() {
      return {
         alerts: santaCruzDoSulData.alerts,
         city: santaCruzDoSulData.city.name,
      };
   }
}

// Instância singleton do serviço
const ndviService = new NDVIService();

export default ndviService;
