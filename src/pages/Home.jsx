import { Link } from "react-router-dom";
import { useState } from "react";
import {
  MapPin,
  Satellite,
  Users,
  TrendingUp,
  Shield,
  Droplets,
  Leaf,
  Mountain,
  AlertTriangle,
  CheckCircle,
  Globe,
  Eye,
  Plus,
  Send,
  X,
} from "lucide-react";

const Home = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio
    alert('Solicitação enviada com sucesso!');
    setShowRequestModal(false);
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="space-y-8 py-12 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
            <span className="text-green-600">Inteligência Coletiva</span>
            <br />
            para um Futuro Sustentável
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600 md:text-2xl">
            Conectamos satélites, comunidades e governos para ações locais com
            impacto global.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-green-700"
          >
            Explorar sua Região
          </Link>
        </div>

        {/* Placeholder para imagem do dashboard */}
        <div className="mx-auto mt-12 max-w-4xl rounded-xl bg-gray-100 p-8">
          <div className="rounded-lg bg-white p-6 text-gray-500 shadow-lg">
            <div className="flex h-64 items-center justify-center">
              <div className="space-y-2 text-center">
                <MapPin className="mx-auto h-12 w-12 text-green-600" />
                <p className="text-lg">Imagem do Dashboard</p>
                <p className="text-sm">
                  Visualização em telas maiores e celular
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="space-y-12 rounded-2xl bg-red-50 px-8 py-16">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            O Problema
          </h2>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-700">
            As mudanças climáticas estão intensificando enchentes, secas e perda
            de biodiversidade. Grande parte desses impactos está ligada à
            degradação das matas ciliares, que protegem nossos rios e cidades.
          </p>
        </div>

        <div className="space-y-8">
          <h3 className="text-center text-2xl font-bold text-gray-900">
            Por que a mata ciliar é vital?
          </h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
              <Shield className="mx-auto h-12 w-12 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Protege contra enchentes
              </h4>
              <p className="text-gray-600">
                Funciona como esponja, absorvendo excesso de água
              </p>
            </div>

            <div className="space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
              <Droplets className="mx-auto h-12 w-12 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Garante água limpa
              </h4>
              <p className="text-gray-600">
                Filtra sedimentos e poluentes antes de chegarem aos rios
              </p>
            </div>

            <div className="space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
              <Leaf className="mx-auto h-12 w-12 text-green-600" />
              <h4 className="font-semibold text-gray-900">
                Preserva a biodiversidade
              </h4>
              <p className="text-gray-600">
                Abriga aves, insetos e espécies nativas
              </p>
            </div>

            <div className="space-y-4 rounded-lg bg-white p-6 text-center shadow-md">
              <Mountain className="mx-auto h-12 w-12 text-amber-600" />
              <h4 className="font-semibold text-gray-900">Combate a erosão</h4>
              <p className="text-gray-600">
                Segura o solo e reduz assoreamento dos rios
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-red-100 p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-red-800">
              <AlertTriangle className="h-6 w-6" />O problema é que:
            </h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></span>
                O desmatamento das margens cresce a cada ano
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></span>
                Muitas vezes a degradação não é percebida até que os impactos
                fiquem graves
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></span>
                Comunidades e governos têm pouca informação em tempo real sobre
                a saúde dessas áreas
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="space-y-12 py-16">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            A Solução
          </h2>
          <p className="mx-auto max-w-4xl text-xl font-semibold leading-relaxed text-green-700">
            OrBee.Online conecta satélites, comunidades e governos para proteger
            o verde do planeta em tempo real.
          </p>
        </div>

        <div className="space-y-16">
          {/* Dados de Satélite */}
          <div className="rounded-2xl bg-blue-50 p-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row">
              <div className="space-y-4 lg:w-1/2">
                <div className="flex items-center gap-3">
                  <Satellite className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Dados de Satélite Hiperlocais
                  </h3>
                </div>
                <p className="leading-relaxed text-gray-700">
                  Monitoramos a saúde da vegetação (NDVI) com imagens de
                  satélite de alta resolução, atualizadas frequentemente.
                </p>
                <p className="leading-relaxed text-gray-700">
                  Você pode ver como está a mata ciliar da sua região hoje e
                  acompanhar sua evolução ao longo do tempo.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md lg:w-1/2">
                <div className="flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-blue-100">
                  <TrendingUp className="h-16 w-16 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Validação Comunitária */}
          <div className="rounded-2xl bg-green-50 p-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row-reverse">
              <div className="space-y-4 lg:w-1/2">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Validação Comunitária
                  </h3>
                </div>
                <p className="leading-relaxed text-gray-700">
                  Os moradores podem confirmar ou corrigir os dados com fotos e
                  relatos locais.
                </p>
                <p className="leading-relaxed text-gray-700">
                  Isso cria uma rede de "Guardiões", que tornam a plataforma
                  cada vez mais precisa.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md lg:w-1/2">
                <div className="flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Ações Práticas */}
          <div className="rounded-2xl bg-amber-50 p-8">
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Ações Práticas e Relevantes
              </h3>
              <p className="mx-auto max-w-3xl text-xl text-gray-700">
                O OrBee não mostra só dados: ele sugere ações específicas para
                sua região e situação atual.
              </p>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h4 className="mb-3 text-lg font-semibold text-gray-900">
                  Proatividade que engaja
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    Alertas personalizados quando sua região perde vegetação
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    Pontuação e reconhecimento para quem contribui com
                    validações ou iniciativas locais
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="text-center">
                  <Globe className="mx-auto mb-2 h-16 w-16 text-green-600" />
                  <p className="text-gray-600">Impacto em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Municípios Monitorados Section */}
      <section className="space-y-8 py-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Municípios Monitorados
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Conheça as regiões que já estão sendo acompanhadas pela nossa plataforma
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {/* Lista de Municípios */}
          <div className="space-y-3">
            {/* Santa Cruz do Sul */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <Eye className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Santa Cruz do Sul</h3>
                  <p className="text-sm text-gray-500">Rio Pardinho e afluentes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Saudável</div>
                  <div className="text-xs text-gray-500">Atualizado hoje</div>
                </div>
                <Link
                  to="/dashboard?city=santa-cruz-do-sul"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>

            {/* Sinimbu */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <Eye className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Sinimbu</h3>
                  <p className="text-sm text-gray-500">Áreas de preservação permanente</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">Saudável</div>
                  <div className="text-xs text-gray-500">Atualizado hoje</div>
                </div>
                <Link
                  to="/dashboard?city=sinimbu"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>

            {/* Lajeado */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <Eye className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Lajeado</h3>
                  <p className="text-sm text-gray-500">Rio Taquari e região metropolitana</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-amber-600">Atenção</div>
                  <div className="text-xs text-gray-500">Atualizado hoje</div>
                </div>
                <Link
                  to="/dashboard?city=lajeado"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>

          {/* Botão Solicitar Nova Região */}
          <div className="pt-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-100"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Solicitar Nova Região</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Solicitação */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitar Nova Região
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Cidade
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Porto Alegre"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione o estado</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="PR">Paraná</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Por que é importante monitorar esta região?"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Impacto Global Section */}
      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center text-white md:p-16">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">Impacto Global</h2>
          <p className="mx-auto max-w-4xl text-2xl font-bold leading-relaxed text-green-100 md:text-3xl">
            "Milhares de pequenas ações locais se transformam em impacto
            global."
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg transition-colors hover:bg-gray-50"
            >
              Começar Agora
            </Link>
            <Link
              to="/community"
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-green-600"
            >
              Participar da Comunidade
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
