import React from "react";
import AchievementsSection from "./AchievementsSection";
import { Trophy, TreePine, Users, Target } from "lucide-react";

export default {
  title: "Components/AchievementsSection",
  component: AchievementsSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Seção de conquistas e impacto do usuário com métricas de sustentabilidade e reconhecimentos.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Story />
      </div>
    ),
  ],
};

// Story padrão
export const Default = {
  name: "Padrão",
  parameters: {
    docs: {
      description: {
        story:
          "Versão padrão da seção de conquistas com todas as métricas e reconhecimentos.",
      },
    },
  },
};

// Versão com fundo personalizado
export const WithCustomBackground = {
  name: "Fundo Personalizado",
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-slate-800 to-orange-900">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Seção com fundo personalizado em tons dourados para destacar as conquistas.",
      },
    },
  },
};

// Versão mobile
export const MobileView = {
  name: "Visualização Mobile",
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Como a seção aparece em dispositivos móveis.",
      },
    },
  },
};

// Versão tablet
export const TabletView = {
  name: "Visualização Tablet",
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Como a seção aparece em tablets.",
      },
    },
  },
};

// Demonstração interativa
export const InteractiveDemo = {
  name: "Demo Interativo",
  render: () => {
    return (
      <div className="space-y-8">
        <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-2">
            Demonstração Interativa
          </h3>
          <p className="text-slate-300 text-sm">
            Esta seção mostra o impacto real das ações do usuário na plataforma
            OrBee.
          </p>
        </div>
        <AchievementsSection />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versão interativa com informações adicionais sobre as conquistas.",
      },
    },
  },
};

// Showcase de métricas
export const MetricsShowcase = {
  name: "Showcase de Métricas",
  render: () => {
    const achievements = [
      {
        icon: TreePine,
        value: "2.847",
        label: "Árvores Plantadas",
        description: "Contribuição direta",
        color: "emerald",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-400/30",
        textColor: "text-emerald-400",
      },
      {
        icon: Users,
        value: "127",
        label: "Pessoas Engajadas",
        description: "Através das suas ações",
        color: "blue",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        textColor: "text-blue-400",
      },
      {
        icon: Target,
        value: "15,2ha",
        label: "Área Restaurada",
        description: "Mata ciliar recuperada",
        color: "purple",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-400/30",
        textColor: "text-purple-400",
      },
      {
        icon: () => (
          <div className="text-green-400 text-2xl font-bold">CO₂</div>
        ),
        value: "42,3t",
        label: "CO₂ Capturado",
        description: "Nos próximos 20 anos",
        color: "green",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-400/30",
        textColor: "text-green-400",
      },
    ];

    return (
      <div className="space-y-12 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Minhas Conquistas
            </h2>
          </div>
          <p className="text-xl text-gray-300">
            Impacto real que já alcançamos juntos
          </p>
        </div>

        {/* Métricas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={index}
                className={`${achievement.bgColor} border ${achievement.borderColor} rounded-xl p-6 text-center backdrop-blur-sm`}
              >
                <IconComponent
                  className={`w-12 h-12 ${achievement.textColor} mx-auto mb-4`}
                />
                <div className="text-3xl font-bold text-white mb-2">
                  {achievement.value}
                </div>
                <p className={`${achievement.textColor} font-medium`}>
                  {achievement.label}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Reconhecimento */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-8 backdrop-blur-sm text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Reconhecimento</h3>
          <p className="text-xl text-gray-300 leading-relaxed">
            <span className="text-yellow-400 font-bold">Finalista</span> no
            Prêmio Jovem Cientista 2024
            <br />
            categoria Tecnologia para Sustentabilidade
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstração detalhada de todas as métricas e conquistas disponíveis.",
      },
    },
  },
};

// Diferentes níveis de conquistas
export const AchievementLevels = {
  name: "Níveis de Conquistas",
  render: () => {
    const levels = [
      {
        title: "Iniciante",
        trees: "50",
        people: "5",
        area: "0.5ha",
        co2: "2.1t",
        badge: "Guardião Verde",
      },
      {
        title: "Intermediário",
        trees: "500",
        people: "25",
        area: "2.5ha",
        co2: "10.5t",
        badge: "Protetor Ambiental",
      },
      {
        title: "Avançado",
        trees: "2.847",
        people: "127",
        area: "15.2ha",
        co2: "42.3t",
        badge: "Finalista Jovem Cientista",
      },
    ];

    return (
      <div className="space-y-8 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Níveis de Conquistas
          </h2>
          <p className="text-xl text-gray-300">
            Progressão do usuário na plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <div
              key={index}
              className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    index === 0
                      ? "bg-green-500/20 border border-green-400/30"
                      : index === 1
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "bg-yellow-500/20 border border-yellow-400/30"
                  }`}
                >
                  <Trophy
                    className={`w-8 h-8 ${
                      index === 0
                        ? "text-green-400"
                        : index === 1
                        ? "text-blue-400"
                        : "text-yellow-400"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold text-white">{level.title}</h3>
                <p
                  className={`text-sm font-medium ${
                    index === 0
                      ? "text-green-400"
                      : index === 1
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }`}
                >
                  {level.badge}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Árvores:</span>
                  <span className="text-white font-semibold">
                    {level.trees}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pessoas:</span>
                  <span className="text-white font-semibold">
                    {level.people}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Área:</span>
                  <span className="text-white font-semibold">{level.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CO₂:</span>
                  <span className="text-white font-semibold">{level.co2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Comparação entre diferentes níveis de conquistas na plataforma.",
      },
    },
  },
};

// Demonstração responsiva
export const ResponsiveDemo = {
  name: "Demo Responsivo",
  render: () => {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Mobile (375px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "375px",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              >
                <AchievementsSection />
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Tablet (768px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "768px",
                  transform: "scale(0.6)",
                  transformOrigin: "top left",
                }}
              >
                <AchievementsSection />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="bg-slate-700 p-2 text-center text-white text-sm font-medium">
              Desktop (1200px)
            </div>
            <div className="h-96 overflow-y-auto">
              <div
                style={{
                  width: "1200px",
                  transform: "scale(0.4)",
                  transformOrigin: "top left",
                }}
              >
                <AchievementsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Comparação da seção em diferentes tamanhos de tela.",
      },
    },
  },
};
