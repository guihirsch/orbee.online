import { useState } from 'react'
import { Camera, MapPin, Calendar, Star, MessageCircle, Upload } from 'lucide-react'

const Community = () => {
  const [activeTab, setActiveTab] = useState('observations')
  const [newObservation, setNewObservation] = useState({
    location: '',
    description: '',
    type: 'vegetation'
  })

  const tabs = [
    { id: 'observations', label: 'Observações', icon: Camera },
    { id: 'reports', label: 'Relatórios', icon: MessageCircle },
    { id: 'contribute', label: 'Contribuir', icon: Upload }
  ]

  const observationTypes = [
    { value: 'vegetation', label: 'Estado da Vegetação' },
    { value: 'water', label: 'Qualidade da Água' },
    { value: 'wildlife', label: 'Vida Selvagem' },
    { value: 'pollution', label: 'Poluição' },
    { value: 'other', label: 'Outros' }
  ]

  const mockObservations = [
    {
      id: 1,
      user: 'Maria Silva',
      location: 'Mata Ciliar - Rio Tietê, SP',
      description: 'Vegetação densa e saudável observada na margem do rio. Presença de várias espécies nativas.',
      type: 'vegetation',
      date: '2024-01-15',
      rating: 5,
      verified: true
    },
    {
      id: 2,
      user: 'João Santos',
      location: 'Reserva Ambiental - Campinas, SP',
      description: 'Notei algumas áreas com vegetação mais esparsa. Pode indicar necessidade de replantio.',
      type: 'vegetation',
      date: '2024-01-14',
      rating: 3,
      verified: false
    },
    {
      id: 3,
      user: 'Ana Costa',
      location: 'Parque Municipal - São Paulo, SP',
      description: 'Água do córrego apresenta coloração normal e presença de peixes pequenos.',
      type: 'water',
      date: '2024-01-13',
      rating: 4,
      verified: true
    }
  ]

  const handleSubmitObservation = (e) => {
    e.preventDefault()
    console.log('Nova observação:', newObservation)
    // Aqui seria enviado para o backend
    setNewObservation({ location: '', description: '', type: 'vegetation' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Comunidade OrBee</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Contribua com observações locais e ajude a validar os dados satelitais. 
          Sua experiência no campo é fundamental para a precisão do monitoramento.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'observations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Observações da Comunidade</h2>
            <button 
              onClick={() => setActiveTab('contribute')}
              className="btn-primary px-4 py-2"
            >
              Nova Observação
            </button>
          </div>
          
          <div className="grid gap-6">
            {mockObservations.map((obs) => (
              <div key={obs.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{obs.user}</span>
                      {obs.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verificado
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{obs.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{obs.date}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{obs.description}</p>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < obs.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {obs.rating}/5 - {observationTypes.find(t => t.value === obs.type)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios Comunitários</h3>
          <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
        </div>
      )}

      {activeTab === 'contribute' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Nova Observação</h2>
            
            <form onSubmit={handleSubmitObservation} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ex: Mata Ciliar - Rio Tietê, SP"
                    value={newObservation.location}
                    onChange={(e) => setNewObservation({...newObservation, location: e.target.value})}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Observação
                </label>
                <select
                  value={newObservation.type}
                  onChange={(e) => setNewObservation({...newObservation, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {observationTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o que você observou no local..."
                  value={newObservation.description}
                  onChange={(e) => setNewObservation({...newObservation, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Clique para adicionar fotos</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1 py-3">
                  Enviar Observação
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('observations')}
                  className="btn-secondary px-6 py-3"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Community