import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  BarChart3,
  Users,
  User,
  Satellite,
  Leaf,
  Mail,
  Github,
  Twitter,
  Heart,
} from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: "Início", href: "/", icon: MapPin },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Comunidade", href: "/community", icon: Users },
    { name: "Perfil", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="group flex items-center space-x-2">
                <div className="h-9 w-9 overflow-hidden rounded-lg transition-opacity group-hover:opacity-90">
                  <img
                    src="/src/assets/logo.png"
                    alt="OrBee Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    Orbee
                  </span>
                  <span className="ml-1 text-sm text-gray-500">Online</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden space-x-8 md:flex">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Status e Mobile menu */}
            <div className="flex items-center space-x-4">
              {/* Indicador de monitoramento */}
              <div className="hidden items-center space-x-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 md:flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-green-700">
                  Monitoramento Ativo
                </span>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Logo e descrição */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 overflow-hidden rounded-lg">
                  <img
                    src="/src/assets/logo.png"
                    alt="OrBee Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">OrBee</span>
                  <span className="ml-1 text-sm text-gray-500">Online</span>
                </div>
              </div>
              <p className="mb-4 max-w-md text-sm text-gray-600">
                Inteligência coletiva para um futuro sustentável. Conectamos
                satélites, comunidades e governos para ações locais com impacto
                global.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Satellite className="h-4 w-4" />
                <span>Monitoramento em tempo real via satélite</span>
              </div>
            </div>

            {/* Links rápidos */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Navegação
              </h3>
              <ul className="space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contato e redes sociais */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Contato
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contato@orbee.online"
                    className="flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <Mail className="h-4 w-4" />
                    <span>contato@orbee.online</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/orbee-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/orbee_online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-primary-600"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>@orbee_online</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Linha divisória e copyright */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>© 2025 OrBee Online. Todos os direitos reservados.</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Feito com</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>para um mundo colaborativo</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
