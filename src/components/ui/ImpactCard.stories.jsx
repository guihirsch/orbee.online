import { useState } from "react";
import ImpactCard from "./ImpactCard";

export default {
  title: "OrBee/UI/ImpactCard",
  component: ImpactCard,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0f172a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    userName: {
      control: "text",
      description: "Nome do usuário para personalização",
    },
    stats: {
      control: "object",
      description: "Estatísticas personalizadas do impacto",
    },
    className: {
      control: "text",
      description: "Classes CSS adicionais",
    },
  },
};

export const Default = {
  args: {
    userName: "Guilherme",
  },
};

export const DifferentUser = {
  args: {
    userName: "Maria Silva",
  },
};

export const CustomStats = {
  args: {
    userName: "João Santos",
    stats: {
      co2Reduced: {
        value: "5.8t",
        description: "Equivale a 29 carros parados",
      },
      treesPlanted: { value: "127", description: "Uma floresta crescendo!" },
      areaMonitored: { value: "15.6ha", description: "Tamanho de 22 campos" },
      actionsCompleted: { value: "89", description: "Guardião experiente!" },
    },
  },
};

export const BeginnerUser = {
  args: {
    userName: "Ana Costa",
    stats: {
      co2Reduced: { value: "0.3t", description: "Cada grama conta!" },
      treesPlanted: { value: "5", description: "Primeiros passos!" },
      areaMonitored: { value: "1.2ha", description: "Começando bem!" },
      actionsCompleted: { value: "3", description: "Guardião iniciante!" },
    },
  },
};

export const ExpertUser = {
  args: {
    userName: "Carlos Oliveira",
    stats: {
      co2Reduced: {
        value: "12.7t",
        description: "Equivale a 63 carros parados",
      },
      treesPlanted: { value: "342", description: "Uma verdadeira floresta!" },
      areaMonitored: { value: "45.8ha", description: "Tamanho de 64 campos" },
      actionsCompleted: { value: "156", description: "Guardião veterano!" },
    },
  },
};

export const ZeroImpact = {
  args: {
    userName: "Pedro Lima",
    stats: {
      co2Reduced: { value: "0t", description: "Pronto para começar!" },
      treesPlanted: {
        value: "0",
        description: "Sua primeira árvore te espera!",
      },
      areaMonitored: {
        value: "0ha",
        description: "Escolha sua primeira área!",
      },
      actionsCompleted: { value: "0", description: "Seja um guardião!" },
    },
  },
};

export const LongUserName = {
  args: {
    userName: "Maria Fernanda dos Santos Silva",
    stats: {
      co2Reduced: {
        value: "3.2t",
        description: "Equivale a 16 carros parados",
      },
      treesPlanted: { value: "68", description: "Uma bela floresta!" },
      areaMonitored: { value: "9.4ha", description: "Tamanho de 13 campos" },
      actionsCompleted: { value: "34", description: "Guardiã dedicada!" },
    },
  },
};

export const ShortUserName = {
  args: {
    userName: "Lu",
    stats: {
      co2Reduced: { value: "1.8t", description: "Equivale a 9 carros parados" },
      treesPlanted: { value: "29", description: "Crescendo junto!" },
      areaMonitored: { value: "4.1ha", description: "Tamanho de 6 campos" },
      actionsCompleted: { value: "15", description: "Guardiã ativa!" },
    },
  },
};

// Demonstração interativa
export const InteractiveDemo = {
  render: () => {
    const [userName, setUserName] = useState("Visitante");
    const [co2Value, setCo2Value] = useState("2.4");
    const [treesValue, setTreesValue] = useState("47");
    const [areaValue, setAreaValue] = useState("8.2");
    const [actionsValue, setActionsValue] = useState("23");

    const customStats = {
      co2Reduced: {
        value: `${co2Value}t`,
        description: `Equivale a ${Math.round(
          parseFloat(co2Value) * 5
        )} carros parados`,
      },
      treesPlanted: {
        value: treesValue,
        description:
          parseInt(treesValue) > 100
            ? "Uma verdadeira floresta!"
            : parseInt(treesValue) > 50
            ? "Uma bela floresta!"
            : parseInt(treesValue) > 10
            ? "Uma pequena floresta!"
            : "Primeiros passos!",
      },
      areaMonitored: {
        value: `${areaValue}ha`,
        description: `Tamanho de ${Math.round(
          parseFloat(areaValue) * 1.4
        )} campos`,
      },
      actionsCompleted: {
        value: actionsValue,
        description:
          parseInt(actionsValue) > 100
            ? "Guardião veterano!"
            : parseInt(actionsValue) > 50
            ? "Guardião experiente!"
            : parseInt(actionsValue) > 20
            ? "Guardião ativo!"
            : parseInt(actionsValue) > 5
            ? "Guardião iniciante!"
            : "Seja um guardião!",
      },
    };

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-4">
            Demonstração Interativa
          </h3>

          {/* Controles */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-4">Personalize o Card:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Usuário
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Digite o nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CO₂ Reduzido (toneladas)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={co2Value}
                  onChange={(e) => setCo2Value(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Árvores Plantadas
                </label>
                <input
                  type="number"
                  min="0"
                  value={treesValue}
                  onChange={(e) => setTreesValue(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Área Monitorada (hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ações Realizadas
                </label>
                <input
                  type="number"
                  min="0"
                  value={actionsValue}
                  onChange={(e) => setActionsValue(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl">
          <ImpactCard userName={userName} stats={customStats} />
        </div>
      </div>
    );
  },
};

// Comparação de níveis de usuário
export const UserLevelsComparison = {
  render: () => {
    const userLevels = [
      {
        title: "Iniciante",
        userName: "Ana",
        stats: {
          co2Reduced: { value: "0.5t", description: "Cada grama conta!" },
          treesPlanted: { value: "8", description: "Primeiros passos!" },
          areaMonitored: { value: "1.5ha", description: "Começando bem!" },
          actionsCompleted: { value: "4", description: "Guardiã iniciante!" },
        },
      },
      {
        title: "Intermediário",
        userName: "Carlos",
        stats: {
          co2Reduced: {
            value: "3.2t",
            description: "Equivale a 16 carros parados",
          },
          treesPlanted: { value: "65", description: "Uma bela floresta!" },
          areaMonitored: {
            value: "9.8ha",
            description: "Tamanho de 14 campos",
          },
          actionsCompleted: { value: "38", description: "Guardião ativo!" },
        },
      },
      {
        title: "Avançado",
        userName: "Maria",
        stats: {
          co2Reduced: {
            value: "8.7t",
            description: "Equivale a 43 carros parados",
          },
          treesPlanted: {
            value: "189",
            description: "Uma verdadeira floresta!",
          },
          areaMonitored: {
            value: "24.3ha",
            description: "Tamanho de 34 campos",
          },
          actionsCompleted: { value: "97", description: "Guardiã experiente!" },
        },
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">Níveis de Usuário</h3>
          <p className="text-sm text-gray-300 mb-6">
            Comparação entre diferentes níveis de engajamento e impacto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {userLevels.map((level, index) => (
            <div key={index} className="space-y-3">
              <div className="text-center">
                <h4 className="text-white font-medium">{level.title}</h4>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(index + 1) * 33.33}%` }}
                  ></div>
                </div>
              </div>
              <ImpactCard userName={level.userName} stats={level.stats} />
            </div>
          ))}
        </div>

        {/* Explicação dos níveis */}
        <div className="bg-slate-800 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">Critérios dos Níveis:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <strong className="text-emerald-400">Iniciante:</strong>
              <ul className="mt-1 space-y-1">
                <li>• 0-1t CO₂ reduzido</li>
                <li>• 0-20 árvores plantadas</li>
                <li>• 0-5ha monitorados</li>
                <li>• 0-10 ações realizadas</li>
              </ul>
            </div>
            <div>
              <strong className="text-emerald-400">Intermediário:</strong>
              <ul className="mt-1 space-y-1">
                <li>• 1-5t CO₂ reduzido</li>
                <li>• 20-100 árvores plantadas</li>
                <li>• 5-15ha monitorados</li>
                <li>• 10-50 ações realizadas</li>
              </ul>
            </div>
            <div>
              <strong className="text-emerald-400">Avançado:</strong>
              <ul className="mt-1 space-y-1">
                <li>• 5t+ CO₂ reduzido</li>
                <li>• 100+ árvores plantadas</li>
                <li>• 15ha+ monitorados</li>
                <li>• 50+ ações realizadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Layout responsivo
export const ResponsiveLayout = {
  render: () => {
    const sampleUser = {
      userName: "Responsivo",
      stats: {
        co2Reduced: {
          value: "4.1t",
          description: "Equivale a 20 carros parados",
        },
        treesPlanted: { value: "83", description: "Uma bela floresta!" },
        areaMonitored: { value: "11.7ha", description: "Tamanho de 16 campos" },
        actionsCompleted: { value: "45", description: "Guardião ativo!" },
      },
    };

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">Layout Responsivo</h3>
          <p className="text-sm text-gray-300 mb-6">
            O card se adapta a diferentes tamanhos de container.
          </p>
        </div>

        {/* Desktop */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Desktop (Largura Total)</h4>
          <div className="w-full">
            <ImpactCard {...sampleUser} />
          </div>
        </div>

        {/* Tablet */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Tablet (600px)</h4>
          <div className="w-full max-w-2xl">
            <ImpactCard {...sampleUser} />
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Mobile (375px)</h4>
          <div className="w-full max-w-sm">
            <ImpactCard {...sampleUser} />
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Responsividade:</strong> O card mantém sua funcionalidade e
            legibilidade em todos os tamanhos de tela, com ajustes automáticos
            no grid de estatísticas e espaçamentos.
          </p>
        </div>
      </div>
    );
  },
};

// Animações e estados
export const AnimationShowcase = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    const [key, setKey] = useState(0);

    const sampleUser = {
      userName: "Animação",
      stats: {
        co2Reduced: {
          value: "2.8t",
          description: "Equivale a 14 carros parados",
        },
        treesPlanted: { value: "56", description: "Uma pequena floresta!" },
        areaMonitored: { value: "7.3ha", description: "Tamanho de 10 campos" },
        actionsCompleted: { value: "28", description: "Guardião ativo!" },
      },
    };

    const toggleVisibility = () => {
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
        setKey((prev) => prev + 1);
      }, 300);
    };

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">Animações</h3>
          <p className="text-sm text-gray-300 mb-4">
            Demonstração das animações de entrada e hover do componente.
          </p>

          <button
            onClick={toggleVisibility}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Recarregar Animação
          </button>
        </div>

        <div className="max-w-2xl">
          {isVisible && <ImpactCard key={key} {...sampleUser} />}
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Efeitos Visuais:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Animação de entrada com fade-in e slide-up</li>
            <li>• Efeito hover com gradiente e sombra</li>
            <li>• Animações escalonadas nos cards de estatística</li>
            <li>• Transições suaves em todos os elementos</li>
            <li>• Efeito de textura de ruído no background</li>
          </ul>
        </div>
      </div>
    );
  },
};
