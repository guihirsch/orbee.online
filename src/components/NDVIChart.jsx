import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import ndviService from '../services/ndviService';

const NDVIChart = ({ 
  location = null, 
  period = '90d',
  height = 300,
  showControls = true 
}) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Períodos disponíveis
  const periods = [
    { value: '30d', label: '30 dias', days: 30 },
    { value: '90d', label: '90 dias', days: 90 },
    { value: '180d', label: '6 meses', days: 180 },
    { value: '1y', label: '1 ano', days: 365 }
  ];

  // Carrega dados NDVI da API
  useEffect(() => {
    const loadNDVIData = async () => {
      if (!location || !location.latitude || !location.longitude) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Busca dados da série temporal via API
        const response = await ndviService.getNDVITimeSeries(
          location.latitude,
          location.longitude,
          selectedPeriod
        );
        
        if (response && response.data) {
          // Formata dados para o gráfico
          const formattedData = response.data.map(item => ({
            date: item.date,
            dateFormatted: new Date(item.date).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit' 
            }),
            ndvi: item.ndvi,
            precipitation: item.precipitation || 0,
            temperature: item.temperature || 25,
            cloudCoverage: item.cloud_coverage || 0
          }));
          
          setChartData(formattedData);
        } else {
          // Fallback para dados mockados
          const periodConfig = periods.find(p => p.value === selectedPeriod);
          const days = periodConfig ? periodConfig.days : 90;
          const mockData = generateMockNDVIData(days, location);
          setChartData(mockData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados NDVI:', error);
        // Fallback para dados mockados em caso de erro
        const periodConfig = periods.find(p => p.value === selectedPeriod);
        const days = periodConfig ? periodConfig.days : 90;
        const mockData = generateMockNDVIData(days, location);
        setChartData(mockData);
      } finally {
        setLoading(false);
      }
    };

    loadNDVIData();
  }, [selectedPeriod, location]);

  // Função para gerar dados NDVI mockados
  const generateMockNDVIData = (days, location) => {
    const data = [];
    const today = new Date();
    
    // Base NDVI varia por localização (simulado)
    const baseNDVI = location ? 
      0.6 + (Math.sin(location.latitude * 0.1) * 0.2) : 0.6;
    
    for (let i = days; i >= 0; i -= 7) { // Dados semanais
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simula variação sazonal
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
      
      // Simula tendência temporal
      const trendFactor = 1 + (i / days) * 0.1;
      
      // Adiciona ruído realista
      const noise = (Math.random() - 0.5) * 0.1;
      
      const ndviValue = Math.max(0, Math.min(1, 
        baseNDVI * seasonalFactor * trendFactor + noise
      ));
      
      // Simula dados de precipitação (correlacionado com NDVI)
      const precipitation = Math.max(0, 
        50 + (ndviValue - 0.5) * 100 + (Math.random() - 0.5) * 30
      );
      
      data.push({
        date: date.toISOString().split('T')[0],
        dateFormatted: date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        ndvi: parseFloat(ndviValue.toFixed(3)),
        precipitation: parseFloat(precipitation.toFixed(1)),
        temperature: parseFloat((25 + (Math.random() - 0.5) * 10).toFixed(1)),
        cloudCoverage: parseFloat((Math.random() * 30).toFixed(1))
      });
    }
    
    return data.reverse(); // Ordem cronológica
  };

  // Calcula estatísticas dos dados
  const getStatistics = () => {
    if (chartData.length === 0) return null;
    
    const ndviValues = chartData.map(d => d.ndvi);
    const current = ndviValues[ndviValues.length - 1];
    const previous = ndviValues[ndviValues.length - 2] || current;
    const average = ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length;
    const max = Math.max(...ndviValues);
    const min = Math.min(...ndviValues);
    
    const trend = current > previous ? 'up' : current < previous ? 'down' : 'stable';
    const trendValue = ((current - previous) / previous * 100).toFixed(1);
    
    return {
      current: current.toFixed(3),
      average: average.toFixed(3),
      max: max.toFixed(3),
      min: min.toFixed(3),
      trend,
      trendValue: Math.abs(trendValue)
    };
  };

  const stats = getStatistics();

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-600">NDVI:</span>
              <span className="font-medium">{data.ndvi}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600">Precipitação:</span>
              <span className="font-medium">{data.precipitation}mm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-600">Temperatura:</span>
              <span className="font-medium">{data.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nuvens:</span>
              <span className="font-medium">{data.cloudCoverage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando dados NDVI...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Controles e Estatísticas */}
      {showControls && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Seletor de Período */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Gráfico */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'line' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Linha
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === 'area' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Área
            </button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">NDVI Atual</div>
            <div className="text-lg font-bold text-green-800">{stats.current}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Média</div>
            <div className="text-lg font-bold text-blue-800">{stats.average}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Variação</div>
            <div className="text-lg font-bold text-gray-800">{stats.min} - {stats.max}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-orange-600 font-medium flex items-center">
              Tendência
              {stats.trend === 'up' && <TrendingUp className="w-3 h-3 ml-1" />}
              {stats.trend === 'down' && <TrendingDown className="w-3 h-3 ml-1" />}
              {stats.trend === 'stable' && <Minus className="w-3 h-3 ml-1" />}
            </div>
            <div className={`text-lg font-bold ${
              stats.trend === 'up' ? 'text-green-800' : 
              stats.trend === 'down' ? 'text-red-800' : 'text-gray-800'
            }`}>
              {stats.trend === 'stable' ? 'Estável' : `${stats.trendValue}%`}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 1]}
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ndvi" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
                name="NDVI"
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 1]}
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="ndvi" 
                stroke="#16a34a" 
                fill="#16a34a"
                fillOpacity={0.3}
                strokeWidth={2}
                name="NDVI"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Informações adicionais */}
      <div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <Info className="w-4 h-4 mt-0.5 text-blue-600" />
        <div>
          <p className="font-medium text-blue-800 mb-1">Sobre o NDVI</p>
          <p>
            O Índice de Vegetação por Diferença Normalizada (NDVI) varia de 0 a 1, 
            onde valores mais altos indicam vegetação mais densa e saudável. 
            Valores abaixo de 0.3 podem indicar estresse da vegetação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NDVIChart;