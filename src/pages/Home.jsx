import { Link } from 'react-router-dom'
import { MapPin, Satellite, Users, TrendingUp } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Satellite,
      title: 'Dados Satelitais NDVI',
      description: 'Monitoramento em tempo real da saúde da vegetação através de dados satelitais Copernicus/Sentinel.'
    },
    {
      icon: MapPin,
      title: 'Mapeamento Interativo',
      description: 'Visualize dados ambientais em mapas interativos com foco na sua região de interesse.'
    },
    {
      icon: Users,
      title: 'Validação Comunitária',
      description: 'Contribua com observações locais, fotos e relatos para validar os dados satelitais.'
    },
    {
      icon: TrendingUp,
      title: 'Análise Temporal',
      description: 'Acompanhe a evolução da saúde ambiental ao longo do tempo com gráficos e tendências.'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            OrBee: <span className="text-primary-600">Inteligência Coletiva</span>
            <br />para um Futuro Sustentável
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma que conecta satélites, comunidades e governos para ações locais com impacto global.
            Monitore a saúde da mata ciliar da sua região em tempo real.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary px-8 py-3 text-lg"
          >
            Explorar Dados
          </Link>
          <Link
            to="/community"
            className="btn-secondary px-8 py-3 text-lg"
          >
            Participar da Comunidade
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Combinamos tecnologia satelital avançada com conhecimento local para criar uma visão completa da saúde ambiental.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card text-center space-y-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Comece a Monitorar Sua Região Agora
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Digite sua cidade ou compartilhe sua localização para visualizar dados NDVI em tempo real e contribuir com a preservação ambiental.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Começar Monitoramento
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home