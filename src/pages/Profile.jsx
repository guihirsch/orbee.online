import { useState } from 'react'
import { User, MapPin, Bell, Award, Settings, Mail, Phone } from 'lucide-react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, SP',
    bio: 'Engenheira ambiental apaixonada por preservação e monitoramento de ecossistemas.',
    joinDate: '2024-01-01'
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    whatsappAlerts: false,
    weeklyReports: true,
    communityUpdates: true
  })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'achievements', label: 'Conquistas', icon: Award },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Primeiro Observador',
      description: 'Fez sua primeira observação comunitária',
      icon: Leaf,
      earned: true,
      date: '2024-01-05'
    },
    {
      id: 2,
      title: 'Guardião Ambiental',
      description: 'Contribuiu com 10 observações verificadas',
      icon: '🛡️',
      earned: false,
      progress: 3
    },
    {
      id: 3,
      title: 'Explorador de Dados',
      description: 'Visualizou dados NDVI por 30 dias consecutivos',
      icon: BarChart3,
      earned: false,
      progress: 15
    },
    {
      id: 4,
      title: 'Colaborador Ativo',
      description: 'Validou 50 observações de outros usuários',
      icon: '🤝',
      earned: false,
      progress: 0
    }
  ]

  const stats = {
    observations: 3,
    validations: 8,
    points: 150,
    areasMonitored: 2
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    console.log('Perfil atualizado:', profile)
  }

  const handleNotificationUpdate = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-12 h-12 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">{profile.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.observations}</p>
          <p className="text-sm text-gray-600">Observações</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.validations}</p>
          <p className="text-sm text-gray-600">Validações</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{stats.points}</p>
          <p className="text-sm text-gray-600">Pontos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.areasMonitored}</p>
          <p className="text-sm text-gray-600">Áreas Monitoradas</p>
        </div>
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
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Perfil</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button type="submit" className="btn-primary px-6 py-2">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Conquistas</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`card ${achievement.earned ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.earned ? (
                      <p className="text-xs text-green-500 mt-2">Conquistado em {achievement.date}</p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progresso</span>
                          <span>{achievement.progress || 0}/{achievement.id === 2 ? 10 : achievement.id === 3 ? 30 : 50}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${((achievement.progress || 0) / (achievement.id === 2 ? 10 : achievement.id === 3 ? 30 : 50)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferências de Notificação</h2>
            
            <div className="space-y-6">
              {Object.entries({
                emailAlerts: 'Alertas por Email',
                whatsappAlerts: 'Alertas por WhatsApp',
                weeklyReports: 'Relatórios Semanais',
                communityUpdates: 'Atualizações da Comunidade'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500">
                      {key === 'emailAlerts' && 'Receba alertas importantes por email'}
                      {key === 'whatsappAlerts' && 'Receba notificações via WhatsApp'}
                      {key === 'weeklyReports' && 'Relatório semanal com resumo das atividades'}
                      {key === 'communityUpdates' && 'Novidades e atualizações da comunidade'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[key] ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações Avançadas</h3>
          <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
        </div>
      )}
    </div>
  )
}

export default Profile