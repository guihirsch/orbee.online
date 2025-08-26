// Serviço para integração com APIs de dados NDVI
class NDVIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.sentinelHubURL = 'https://services.sentinel-hub.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Obtém token de acesso para Sentinel Hub
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/ndvi/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getUserToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao obter token de acesso');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      throw error;
    }
  }

  // Obtém token do usuário do localStorage
  getUserToken() {
    return localStorage.getItem('authToken') || '';
  }

  // Busca dados NDVI por coordenadas e período
  async getNDVIData(latitude, longitude, startDate, endDate, options = {}) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
        ...options
      });

      const response = await fetch(`${this.baseURL}/api/v1/ndvi/data?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getUserToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados NDVI:', error);
      // Fallback para dados mockados em caso de erro
      return this.getMockNDVIData(latitude, longitude, startDate, endDate);
    }
  }

  // Busca dados NDVI atuais para uma localização
  async getCurrentNDVI(latitude, longitude) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/ndvi/current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getUserToken()}`
        },
        body: JSON.stringify({
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar NDVI atual:', error);
      // Fallback para dados mockados
      return {
        ndvi: 0.6 + (Math.sin(latitude * 0.1) * 0.2),
        date: new Date().toISOString().split('T')[0],
        quality: 'medium',
        cloud_coverage: Math.random() * 30
      };
    }
  }

  // Busca série temporal de NDVI
  async getNDVITimeSeries(latitude, longitude, period = '90d') {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/ndvi/timeseries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getUserToken()}`
        },
        body: JSON.stringify({
          latitude,
          longitude,
          period
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar série temporal:', error);
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
        radius: radius.toString()
      });

      const response = await fetch(`${this.baseURL}/api/v1/ndvi/alerts?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getUserToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return { alerts: [] };
    }
  }

  // Análise de saúde da vegetação
  async getVegetationHealth(latitude, longitude) {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/ndvi/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getUserToken()}`
        },
        body: JSON.stringify({
          latitude,
          longitude
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao analisar saúde da vegetação:', error);
      // Fallback para análise mockada
      const currentNDVI = 0.6 + (Math.sin(latitude * 0.1) * 0.2);
      return {
        health_status: currentNDVI > 0.6 ? 'healthy' : currentNDVI > 0.4 ? 'moderate' : 'poor',
        ndvi_value: currentNDVI,
        trend: Math.random() > 0.5 ? 'improving' : 'declining',
        recommendations: this.getHealthRecommendations(currentNDVI)
      };
    }
  }

  // Gera dados NDVI mockados para desenvolvimento
  getMockNDVIData(latitude, longitude, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];
    
    const baseNDVI = 0.6 + (Math.sin(latitude * 0.1) * 0.2);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 7)) {
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
      const noise = (Math.random() - 0.5) * 0.1;
      const ndviValue = Math.max(0, Math.min(1, baseNDVI * seasonalFactor + noise));
      
      data.push({
        date: date.toISOString().split('T')[0],
        ndvi: parseFloat(ndviValue.toFixed(3)),
        quality: Math.random() > 0.3 ? 'high' : 'medium',
        cloud_coverage: Math.random() * 30
      });
    }
    
    return { data, source: 'mock' };
  }

  // Gera dados de série temporal mockados
  getMockTimeSeriesData(latitude, longitude, period) {
    const days = this.getPeriodDays(period);
    const data = [];
    const today = new Date();
    
    const baseNDVI = 0.6 + (Math.sin(latitude * 0.1) * 0.2);
    
    for (let i = days; i >= 0; i -= 7) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
      const trendFactor = 1 + (i / days) * 0.1;
      const noise = (Math.random() - 0.5) * 0.1;
      
      const ndviValue = Math.max(0, Math.min(1, 
        baseNDVI * seasonalFactor * trendFactor + noise
      ));
      
      data.push({
        date: date.toISOString().split('T')[0],
        ndvi: parseFloat(ndviValue.toFixed(3)),
        precipitation: Math.max(0, 50 + (ndviValue - 0.5) * 100 + (Math.random() - 0.5) * 30),
        temperature: 25 + (Math.random() - 0.5) * 10,
        cloud_coverage: Math.random() * 30
      });
    }
    
    return { 
      data: data.reverse(), 
      source: 'mock',
      statistics: this.calculateStatistics(data)
    };
  }

  // Converte período em dias
  getPeriodDays(period) {
    const periodMap = {
      '30d': 30,
      '90d': 90,
      '180d': 180,
      '1y': 365
    };
    return periodMap[period] || 90;
  }

  // Calcula estatísticas dos dados
  calculateStatistics(data) {
    if (!data || data.length === 0) return null;
    
    const ndviValues = data.map(d => d.ndvi);
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
      trend: current > previous ? 'up' : current < previous ? 'down' : 'stable',
      change: parseFloat(((current - previous) / previous * 100).toFixed(1))
    };
  }

  // Gera recomendações baseadas na saúde da vegetação
  getHealthRecommendations(ndviValue) {
    if (ndviValue > 0.7) {
      return [
        'Vegetação em excelente estado',
        'Continue o monitoramento regular',
        'Considere expandir a área de conservação'
      ];
    } else if (ndviValue > 0.5) {
      return [
        'Vegetação em bom estado',
        'Monitore mudanças sazonais',
        'Mantenha práticas de conservação'
      ];
    } else if (ndviValue > 0.3) {
      return [
        'Vegetação com sinais de estresse',
        'Investigue possíveis causas',
        'Considere ações de recuperação'
      ];
    } else {
      return [
        'Vegetação em estado crítico',
        'Ação imediata necessária',
        'Consulte especialistas locais'
      ];
    }
  }

  // Formata coordenadas para requisições
  formatCoordinates(latitude, longitude) {
    return {
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6))
    };
  }

  // Valida coordenadas
  validateCoordinates(latitude, longitude) {
    return (
      typeof latitude === 'number' && 
      typeof longitude === 'number' &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }
}

// Instância singleton do serviço
const ndviService = new NDVIService();

export default ndviService;