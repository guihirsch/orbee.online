import { useState } from "react";
import {
  MapPin,
  Search,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Info,
  Activity,
  BarChart3,
  Droplets,
  Thermometer,
  Cloud,
  Leaf,
  Map,
  Target,
} from "lucide-react";
import NDVIMap from "../components/NDVIMap";
import NDVIChart from "../components/NDVIChart";

const Dashboard = () => {
  const [location, setLocation] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("statistics");
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Santa Cruz do Sul, RS",
    coordinates: "-29.7175, -52.4264",
    latitude: -29.7175,
    longitude: -52.4264,
  });
  const [activeTooltip, setActiveTooltip] = useState(null);

  const periods = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "3 meses" },
    { value: "1y", label: "1 ano" },
  ];

  const mockData = {
    ndviCurrent: 0.65,
    ndviTrend: "+0.08",
    healthStatus: "Boa",
    lastUpdate: "2024-01-15 14:30",
    city: "Santa Cruz do Sul",
    // Dados expandidos para estatísticas detalhadas
    ndviMin: 0.12,
    ndviMax: 0.89,
    ndviAverage: 0.58,
    vegetationCoverage: 78.5,
    biomassIndex: 0.72,
    moistureIndex: 0.45,
    temperatureSurface: 24.3,
    cloudCoverage: 15,
    dataQuality: 95,
    pixelsAnalyzed: 125847,
    areaKm2: 45.2,
    seasonalTrend: "Crescimento típico de verão",
    comparisonLastYear: "+12.3%",
    alertsResolved: 3,
    communityReports: 7,
  };

  const tabs = [
    { id: "statistics", label: "Estatísticas", icon: BarChart3 },
    { id: "map", label: "Mapa", icon: Map },
    { id: "recommendations", label: "Recomendações", icon: Target },
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      name: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      coordinates: `${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}`,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log("Nova localização selecionada:", location);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Ambiental
          </h1>
        </div>

        {/* Location Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Digite sua cidade..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="btn-primary px-4 py-2">
            <MapPin className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "statistics" && (
        <div className="space-y-8">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      NDVI Atual
                    </p>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setActiveTooltip("ndvi")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "ndvi" && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Índice de Vegetação: 0-0.3 (solo/água), 0.3-0.6
                          (vegetação esparsa), 0.6+ (vegetação densa)
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.ndviCurrent}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-green-600">
                ↗ {mockData.ndviTrend} vs mês anterior
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Faixa: {mockData.ndviMin} - {mockData.ndviMax}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      Cobertura Vegetal
                    </p>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setActiveTooltip("coverage")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "coverage" && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Percentual da área com vegetação ativa detectada por
                          satélite
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.vegetationCoverage}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-green-600">
                {mockData.comparisonLastYear} vs ano anterior
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Área: {mockData.areaKm2} km²
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      Qualidade dos Dados
                    </p>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setActiveTooltip("quality")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "quality" && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Confiabilidade baseada em cobertura de nuvens e
                          resolução dos dados satelitais
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.dataQuality}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-blue-600">
                {mockData.cloudCoverage}% cobertura de nuvens
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {mockData.pixelsAnalyzed.toLocaleString()} pixels analisados
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600">
                      Engajamento
                    </p>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setActiveTooltip("engagement")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "engagement" && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Relatórios e validações da comunidade local
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.communityReports}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-purple-600">
                {mockData.alertsResolved} alertas resolvidos
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Última validação: {mockData.lastUpdate}
              </p>
            </div>
          </div>

          {/* Estatísticas Detalhadas */}
          <div className="card">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Análise Detalhada da Vegetação
              </h2>
              <p className="text-sm text-gray-600">
                Métricas avançadas para monitoramento técnico e interpretação
                simplificada
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Índice de Biomassa */}
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Biomassa
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-green-600 hover:text-green-800"
                      onMouseEnter={() => setActiveTooltip("biomass")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "biomass" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Densidade de matéria vegetal. Valores altos indicam
                        vegetação robusta e saudável.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-green-800">
                  {mockData.biomassIndex}
                </p>
                <p className="text-xs text-green-600">Densidade vegetal alta</p>
                <div className="mt-2 h-2 rounded-full bg-green-200">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: `${mockData.biomassIndex * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Índice de Umidade */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Umidade
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-blue-600 hover:text-blue-800"
                      onMouseEnter={() => setActiveTooltip("moisture")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "moisture" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Nível de água na vegetação. Importante para detectar
                        estresse hídrico.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-blue-800">
                  {mockData.moistureIndex}
                </p>
                <p className="text-xs text-blue-600">Umidade moderada</p>
                <div className="mt-2 h-2 rounded-full bg-blue-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${mockData.moistureIndex * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Temperatura da Superfície */}
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Temperatura
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-orange-600 hover:text-orange-800"
                      onMouseEnter={() => setActiveTooltip("temperature")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "temperature" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Temperatura da superfície terrestre. Afeta o crescimento
                        e saúde da vegetação.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-orange-800">
                  {mockData.temperatureSurface}°C
                </p>
                <p className="text-xs text-orange-600">Temperatura ideal</p>
                <div className="mt-2 h-2 rounded-full bg-orange-200">
                  <div
                    className="h-2 rounded-full bg-orange-600"
                    style={{
                      width: `${(mockData.temperatureSurface / 40) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Tendência Sazonal */}
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Sazonalidade
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-purple-600 hover:text-purple-800"
                      onMouseEnter={() => setActiveTooltip("seasonal")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "seasonal" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Padrão de crescimento esperado para a época do ano na
                        região.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-sm font-bold leading-tight text-purple-800">
                  {mockData.seasonalTrend}
                </p>
                <p className="text-xs text-purple-600">Padrão normal</p>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-600">
                    Crescimento ativo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Análise Comparativa */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Comparação Histórica */}
            <div className="card">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Comparação Histórica
                </h3>
                <p className="text-sm text-gray-600">
                  Evolução dos indicadores ao longo do tempo
                </p>
              </div>

              <div className="space-y-4">
                {/* NDVI Histórico */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      NDVI - Últimos 12 meses
                    </span>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setActiveTooltip("historical")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "historical" && (
                        <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Comparação do NDVI atual com a média dos últimos 12
                          meses
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {mockData.ndviCurrent}
                      </p>
                      <p className="text-xs text-gray-500">Atual</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-700">
                        {mockData.ndviAverage}
                      </p>
                      <p className="text-xs text-gray-500">Média anual</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {mockData.ndviTrend}
                      </p>
                      <p className="text-xs text-gray-500">Variação</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${
                          (mockData.ndviCurrent / mockData.ndviMax) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Cobertura Vegetal Histórica */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Cobertura Vegetal - Tendência
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {mockData.vegetationCoverage - 5.2}%
                      </p>
                      <p className="text-xs text-gray-500">Ano passado</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {mockData.vegetationCoverage}%
                      </p>
                      <p className="text-xs text-gray-500">Atual</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-600">
                        {mockData.comparisonLastYear}
                      </p>
                      <p className="text-xs text-gray-500">Crescimento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmarks Regionais */}
            <div className="card">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Benchmarks Regionais
                </h3>
                <p className="text-sm text-gray-600">
                  Comparação com outras regiões similares
                </p>
              </div>

              <div className="space-y-4">
                {/* Ranking Regional */}
                <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Posição Regional
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-green-600">
                        #3
                      </span>
                      <span className="text-xs text-gray-500">de 15</span>
                    </div>
                  </div>
                  <p className="mb-2 text-xs text-gray-600">
                    Municípios do Vale do Rio Pardo
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-semibold text-green-600">0.72</p>
                      <p className="text-gray-500">Melhor</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {mockData.ndviCurrent}
                      </p>
                      <p className="text-gray-500">Você</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-600">0.58</p>
                      <p className="text-gray-500">Média</p>
                    </div>
                  </div>
                </div>

                {/* Comparação por Categoria */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Biomassa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        85%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Umidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        60%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Qualidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">
                        95%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Geral */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-800">
                      Desempenho Acima da Média
                    </span>
                  </div>
                  <p className="text-xs text-green-600">
                    Sua região está entre as 20% melhores em saúde vegetal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de Qualidade e Confiabilidade */}
          <div className="card">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Qualidade e Confiabilidade dos Dados
              </h2>
              <p className="text-sm text-gray-600">
                Indicadores técnicos sobre a precisão e confiabilidade das
                análises satelitais
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Resolução Espacial */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Resolução
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-blue-600 hover:text-blue-800"
                      onMouseEnter={() => setActiveTooltip("resolution")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "resolution" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Resolução espacial dos dados Sentinel-2. Menor valor =
                        maior precisão.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-blue-800">10m</p>
                <p className="mb-2 text-xs text-blue-600">Por pixel</p>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-blue-700">Alta precisão</span>
                </div>
              </div>

              {/* Frequência de Atualização */}
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Atualização
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-green-600 hover:text-green-800"
                      onMouseEnter={() => setActiveTooltip("frequency")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "frequency" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Frequência de passagem do satélite sobre a região
                        monitorada.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-green-800">5</p>
                <p className="mb-2 text-xs text-green-600">Dias</p>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-700">
                    Monitoramento contínuo
                  </span>
                </div>
              </div>

              {/* Cobertura de Nuvens */}
              <div className="rounded-lg bg-gradient-to-br from-gray-50 to-slate-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Nuvens
                    </span>
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-gray-600 hover:text-gray-800"
                      onMouseEnter={() => setActiveTooltip("clouds")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "clouds" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Percentual de cobertura de nuvens na última imagem.
                        Afeta a qualidade dos dados.
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-2xl font-bold text-gray-800">
                  {mockData.cloudCoverage}%
                </p>
                <p className="mb-2 text-xs text-gray-600">Cobertura</p>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-700">Céu limpo</span>
                </div>
              </div>
            </div>

            {/* Métricas Técnicas Detalhadas */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Precisão dos Dados */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="text-md mb-4 font-semibold text-gray-900">
                  Precisão dos Dados
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Erro médio NDVI
                      </span>
                      <div className="relative">
                        <Info
                          className="h-3 w-3 cursor-help text-gray-400 hover:text-gray-600"
                          onMouseEnter={() => setActiveTooltip("ndvi-error")}
                          onMouseLeave={() => setActiveTooltip(null)}
                        />
                        {activeTooltip === "ndvi-error" && (
                          <div className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 transform rounded bg-black border border-gray-600 px-2 py-1 text-xs text-white shadow-lg">
                            Margem de erro típica nas medições NDVI
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ±0.02
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Calibração atmosférica
                      </span>
                      <div className="relative">
                        <Info
                          className="h-3 w-3 cursor-help text-gray-400 hover:text-gray-600"
                          onMouseEnter={() => setActiveTooltip("atmospheric")}
                          onMouseLeave={() => setActiveTooltip(null)}
                        />
                        {activeTooltip === "atmospheric" && (
                          <div className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 transform rounded bg-black border border-gray-600 px-2 py-1 text-xs text-white shadow-lg">
                            Correção dos efeitos atmosféricos aplicada
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold text-green-600">
                        Aplicada
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Validação de campo
                      </span>
                      <div className="relative">
                        <Info
                          className="h-3 w-3 cursor-help text-gray-400 hover:text-gray-600"
                          onMouseEnter={() =>
                            setActiveTooltip("field-validation")
                          }
                          onMouseLeave={() => setActiveTooltip(null)}
                        />
                        {activeTooltip === "field-validation" && (
                          <div className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 transform rounded bg-black border border-gray-600 px-2 py-1 text-xs text-white shadow-lg">
                            Dados validados com observações locais
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {mockData.communityReports} pontos
                    </span>
                  </div>
                </div>
              </div>

              {/* Status do Sistema */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="text-md mb-4 font-semibold text-gray-900">
                  Status do Sistema
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Satélite Sentinel-2A
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold text-green-600">
                        Operacional
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Satélite Sentinel-2B
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                      <span className="text-sm font-semibold text-green-600">
                        Operacional
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Processamento</span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-semibold text-blue-600">
                        Tempo real
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Última sincronização
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {mockData.lastUpdate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo de Confiabilidade */}
            <div className="mt-6 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-900">
                  Índice de Confiabilidade Geral
                </h4>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">
                    {mockData.dataQuality}%
                  </div>
                  <div className="relative">
                    <Info
                      className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                      onMouseEnter={() => setActiveTooltip("reliability")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "reliability" && (
                      <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                        Índice calculado com base na qualidade dos dados,
                        cobertura de nuvens, calibração e validação
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Baseado em {mockData.pixelsAnalyzed.toLocaleString()} pixels
                  analisados
                </span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-600">
                    Dados altamente confiáveis
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                  style={{ width: `${mockData.dataQuality}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Impacto Ambiental e Tendências Sazonais */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Impacto Ambiental */}
            <div className="card">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Impacto Ambiental
                </h3>
                <p className="text-sm text-gray-600">
                  Estimativas de benefícios ambientais da vegetação monitorada
                </p>
              </div>

              <div className="space-y-4">
                {/* Sequestro de Carbono */}
                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Sequestro de Carbono
                      </span>
                    </div>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-green-600 hover:text-green-800"
                        onMouseEnter={() => setActiveTooltip("carbon")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "carbon" && (
                        <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Estimativa baseada na biomassa vegetal e área de
                          cobertura
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-green-800">2.4</p>
                      <p className="text-xs text-green-600">
                        toneladas CO₂/ano
                      </p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-800">+18%</p>
                      <p className="text-xs text-green-600">vs ano anterior</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-700">
                    Equivale a plantar 109 árvores por ano
                  </div>
                </div>

                {/* Regulação Térmica */}
                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Regulação Térmica
                      </span>
                    </div>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-blue-600 hover:text-blue-800"
                        onMouseEnter={() => setActiveTooltip("thermal")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "thermal" && (
                        <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Redução de temperatura proporcionada pela vegetação
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-blue-800">-3.2°C</p>
                      <p className="text-xs text-blue-600">Redução média</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-800">
                        {mockData.areaKm2}
                      </p>
                      <p className="text-xs text-blue-600">km² beneficiados</p>
                    </div>
                  </div>
                </div>

                {/* Retenção de Água */}
                <div className="rounded-lg border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-cyan-600" />
                      <span className="text-sm font-medium text-cyan-800">
                        Retenção de Água
                      </span>
                    </div>
                    <div className="relative">
                      <Info
                        className="h-4 w-4 cursor-help text-cyan-600 hover:text-cyan-800"
                        onMouseEnter={() => setActiveTooltip("water")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      />
                      {activeTooltip === "water" && (
                        <div className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg bg-black border border-gray-600 px-3 py-2 text-xs text-white shadow-lg">
                          Capacidade de retenção hídrica da vegetação
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-cyan-800">1.8M</p>
                      <p className="text-xs text-cyan-600">litros/mês</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-cyan-800">85%</p>
                      <p className="text-xs text-cyan-600">eficiência</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tendências Sazonais */}
            <div className="card">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Tendências Sazonais
                </h3>
                <p className="text-sm text-gray-600">
                  Padrões de crescimento e comportamento da vegetação ao longo
                  do ano
                </p>
              </div>

              <div className="space-y-4">
                {/* Ciclo Sazonal Atual */}
                <div className="rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-800">
                      Verão (Atual)
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-600">
                        Crescimento Ativo
                      </span>
                    </div>
                  </div>
                  <p className="mb-3 text-xs text-orange-700">
                    {mockData.seasonalTrend}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-orange-800">
                        Jan-Mar
                      </p>
                      <p className="text-xs text-orange-600">Pico vegetativo</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-800">
                        Abr-Jun
                      </p>
                      <p className="text-xs text-orange-600">Estabilização</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-800">
                        Jul-Set
                      </p>
                      <p className="text-xs text-orange-600">Dormência</p>
                    </div>
                  </div>
                </div>

                {/* Previsões Sazonais */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-medium text-gray-800">
                    Previsões para os Próximos Meses
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Fevereiro</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          NDVI: 0.68-0.72
                        </p>
                        <p className="text-xs text-gray-500">
                          Crescimento contínuo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Março</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-yellow-600">
                          NDVI: 0.62-0.66
                        </p>
                        <p className="text-xs text-gray-500">
                          Início da estabilização
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Abril</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">
                          NDVI: 0.55-0.60
                        </p>
                        <p className="text-xs text-gray-500">
                          Transição outonal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fatores Climáticos */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="mb-3 text-sm font-medium text-gray-800">
                    Fatores Climáticos Influentes
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="mb-1 flex items-center justify-center">
                        <Droplets className="mr-1 h-4 w-4 text-blue-500" />
                        <span className="text-xs text-gray-600">
                          Precipitação
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">
                        145mm
                      </p>
                      <p className="text-xs text-gray-500">Média mensal</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 flex items-center justify-center">
                        <Thermometer className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-xs text-gray-600">
                          Temperatura
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-red-600">
                        26.8°C
                      </p>
                      <p className="text-xs text-gray-500">Média mensal</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded bg-blue-50 p-2 text-center">
                    <p className="text-xs text-blue-700">
                      Condições ideais para crescimento vegetal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução Temporal */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Evolução Temporal
            </h3>
            <NDVIChart
              location={selectedLocation}
              period="90d"
              height={300}
              showControls={true}
            />
          </div>
        </div>
      )}

      {/* Aba do Mapa */}
      {activeTab === "map" && (
        <div className="space-y-8">
          {/* Mapa NDVI Interativo */}
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Mapa NDVI Interativo
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-96">
              <NDVIMap
                latitude={selectedLocation.latitude}
                longitude={selectedLocation.longitude}
                onLocationSelect={handleLocationSelect}
                showControls={true}
              />
            </div>
          </div>

          {/* Informações da Localização Selecionada */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Localização Selecionada
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Coordenadas</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedLocation.coordinates}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">NDVI Atual</p>
                <p className="text-lg font-bold text-green-600">
                  {mockData.ndviCurrent}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">
                  {mockData.healthStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aba de Recomendações */}
      {activeTab === "recommendations" && (
        <div className="space-y-8">
          {/* Recomendações Principais */}
          <div className="card">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">
              Recomendações Personalizadas
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Vegetação Saudável
                    </p>
                  </div>
                  <p className="mb-3 text-sm text-green-600">
                    Sua área apresenta excelente saúde vegetal. Continue o
                    monitoramento regular.
                  </p>
                  <div className="text-xs text-green-700">
                    • Mantenha o cronograma de observações
                    <br />
                    • Documente mudanças sazonais
                    <br />• Compartilhe dados com a comunidade
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      Validação Comunitária
                    </p>
                  </div>
                  <p className="mb-3 text-sm text-blue-600">
                    Contribua com observações locais para melhorar a precisão
                    dos dados.
                  </p>
                  <div className="text-xs text-blue-700">
                    • Relate mudanças visuais na vegetação
                    <br />
                    • Compartilhe fotos da área
                    <br />• Valide alertas automáticos
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">
                      Monitoramento Sazonal
                    </p>
                  </div>
                  <p className="mb-3 text-sm text-yellow-600">
                    Período de crescimento ativo. Aumente a frequência de
                    monitoramento.
                  </p>
                  <div className="text-xs text-yellow-700">
                    • Verifique semanalmente durante o verão
                    <br />
                    • Monitore sinais de estresse hídrico
                    <br />• Acompanhe mudanças de biomassa
                  </div>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <p className="text-sm font-medium text-purple-800">
                      Ações Sugeridas
                    </p>
                  </div>
                  <p className="mb-3 text-sm text-purple-600">
                    Baseado nos dados atuais, considere estas ações preventivas.
                  </p>
                  <div className="text-xs text-purple-700">
                    • Configure alertas automáticos
                    <br />
                    • Estabeleça pontos de referência
                    <br />• Conecte-se com outros guardiões
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Validação Comunitária */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Validação Comunitária
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-4 text-sm text-gray-600">
                Ajude a melhorar a precisão dos dados compartilhando suas
                observações locais.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Condição da Vegetação
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option>Selecione uma opção</option>
                    <option>Excelente</option>
                    <option>Boa</option>
                    <option>Regular</option>
                    <option>Ruim</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    rows="3"
                    placeholder="Descreva o que você observou..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="btn-primary px-4 py-2">
                  Enviar Validação
                </button>
              </div>
            </div>
          </div>

          {/* Histórico de Validações */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Histórico de Validações
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Vegetação densa observada
                  </p>
                  <p className="text-xs text-green-600">
                    15/01/2024 - Usuário Local
                  </p>
                </div>
                <div className="text-green-600">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Crescimento sazonal confirmado
                  </p>
                  <p className="text-xs text-blue-600">
                    12/01/2024 - Comunidade
                  </p>
                </div>
                <div className="text-blue-600">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Dados satelitais validados
                  </p>
                  <p className="text-xs text-gray-600">10/01/2024 - Sistema</p>
                </div>
                <div className="text-gray-600">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
