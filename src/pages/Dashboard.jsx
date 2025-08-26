import { useState } from 'react'
import { MapPin, Search, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import NDVIMap from '../components/NDVIMap'
import NDVIChart from '../components/NDVIChart'

const Dashboard = () => {
  const [location, setLocation] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'São Paulo, SP',
    coordinates: '-23.5505, -46.6333',
    latitude: -23.5505,
    longitude: -46.6333
  })

  const periods = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '3 meses' },
    { value: '1y', label: '1 ano' }
  ]

  const mockData = {
    ndviCurrent: 0.72,
    ndviTrend: '+0.05',
    healthStatus: 'Boa',
    lastUpdate: '2024-01-15 14:30'
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      name: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      coordinates: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
      latitude: location.latitude,
      longitude: location.longitude
    })
    console.log('Nova localização selecionada:', location)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ambiental</h1>
          <p className="text-gray-600">Monitore a saúde da vegetação em tempo real</p>
        </div>
        
        {/* Location Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Digite sua cidade..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="btn-primary px-4 py-2">
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NDVI Atual</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.ndviCurrent}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↗ {mockData.ndviTrend} vs mês anterior</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status da Vegetação</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.healthStatus}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Baseado em dados satelitais</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Última Atualização</p>
              <p className="text-lg font-semibold text-gray-900">{mockData.lastUpdate}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Dados Sentinel-2</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Nenhum alerta ativo</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mapa NDVI Interativo</h2>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
            
            {/* Mapa NDVI Interativo */}
            <div className="h-96">
              <NDVIMap 
                latitude={selectedLocation.latitude}
                longitude={selectedLocation.longitude}
                onLocationSelect={handleLocationSelect}
                showControls={true}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Temporal Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Temporal</h3>
            <NDVIChart 
              location={selectedLocation}
              period="90d"
              height={300}
              showControls={true}
            />
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Vegetação Saudável</p>
                <p className="text-sm text-green-600">Continue monitorando a área regularmente</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Validação Comunitária</p>
                <p className="text-sm text-blue-600">Contribua com observações locais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard