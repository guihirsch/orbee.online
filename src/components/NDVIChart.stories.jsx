import { useState } from "react";
import NDVIChart from "./NDVIChart";

export default {
  title: "Data/NDVIChart",
  component: NDVIChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    location: {
      control: "object",
      description: "Coordenadas da localização para buscar dados NDVI",
    },
    period: {
      control: {
        type: "select",
        options: ["30d", "90d", "180d", "1y"],
      },
      description: "Período de análise dos dados",
    },
    height: {
      control: { type: "range", min: 200, max: 600, step: 50 },
      description: "Altura do gráfico em pixels",
    },
    showControls: {
      control: "boolean",
      description: "Mostrar controles do gráfico",
    },
    backgroundColor: {
      control: { type: "color" },
      description: "Cor de fundo do componente",
    },
  },
};

export const Default = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "90d",
    height: 300,
    showControls: true,
  },
};

export const Period30Days = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "30d",
    height: 300,
    showControls: true,
  },
};

export const Period6Months = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "180d",
    height: 300,
    showControls: true,
  },
};

export const Period1Year = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "1y",
    height: 400,
    showControls: true,
  },
};

export const TallChart = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "90d",
    height: 500,
    showControls: true,
  },
};

export const CompactChart = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "90d",
    height: 200,
    showControls: false,
  },
};

export const WithoutControls = {
  args: {
    location: {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    },
    period: "90d",
    height: 300,
    showControls: false,
  },
};

export const DifferentLocation = {
  args: {
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      name: "São Paulo, SP",
    },
    period: "90d",
    height: 300,
    showControls: true,
  },
};

export const LoadingState = {
  render: () => {
    const [location, setLocation] = useState(null);

    // Simula carregamento após 3 segundos
    setTimeout(() => {
      setLocation({
        latitude: -29.7175,
        longitude: -52.4264,
        name: "Santa Cruz do Sul, RS",
      });
    }, 3000);

    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Estado de Carregamento</h3>
        <NDVIChart
          location={location}
          period="90d"
          height={300}
          showControls={true}
        />
        <p className="mt-4 text-sm text-gray-600">
          O gráfico mostra o estado de carregamento quando não há localização
          definida.
        </p>
      </div>
    );
  },
};

export const InteractiveDemo = {
  render: () => {
    const [selectedLocation, setSelectedLocation] = useState({
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    });
    const [selectedPeriod, setSelectedPeriod] = useState("90d");
    const [chartHeight, setChartHeight] = useState(300);

    const locations = [
      {
        latitude: -29.7175,
        longitude: -52.4264,
        name: "Santa Cruz do Sul, RS",
      },
      {
        latitude: -23.5505,
        longitude: -46.6333,
        name: "São Paulo, SP",
      },
      {
        latitude: -22.9068,
        longitude: -43.1729,
        name: "Rio de Janeiro, RJ",
      },
      {
        latitude: -30.0346,
        longitude: -51.2177,
        name: "Porto Alegre, RS",
      },
    ];

    const periods = [
      { value: "30d", label: "30 dias" },
      { value: "90d", label: "90 dias" },
      { value: "180d", label: "6 meses" },
      { value: "1y", label: "1 ano" },
    ];

    return (
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Demonstração Interativa
          </h3>

          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                value={JSON.stringify(selectedLocation)}
                onChange={(e) =>
                  setSelectedLocation(JSON.parse(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {locations.map((location, index) => (
                  <option key={index} value={JSON.stringify(location)}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura: {chartHeight}px
              </label>
              <input
                type="range"
                min="200"
                max="500"
                step="50"
                value={chartHeight}
                onChange={(e) => setChartHeight(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <NDVIChart
          location={selectedLocation}
          period={selectedPeriod}
          height={chartHeight}
          showControls={true}
        />

        {/* Informações */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">
            Configuração Atual:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Localização:</strong> {selectedLocation.name}
            </div>
            <div>
              <strong>Período:</strong>{" "}
              {periods.find((p) => p.value === selectedPeriod)?.label}
            </div>
            <div>
              <strong>Altura:</strong> {chartHeight}px
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const MultipleCharts = {
  render: () => {
    const locations = [
      {
        latitude: -29.7175,
        longitude: -52.4264,
        name: "Santa Cruz do Sul, RS",
      },
      {
        latitude: -23.5505,
        longitude: -46.6333,
        name: "São Paulo, SP",
      },
    ];

    return (
      <div className="p-4 space-y-8">
        <h3 className="text-lg font-semibold">Comparação de Regiões</h3>

        {locations.map((location, index) => (
          <div key={index} className="space-y-4">
            <h4 className="text-md font-medium text-gray-800">
              {location.name}
            </h4>
            <NDVIChart
              location={location}
              period="90d"
              height={250}
              showControls={false}
            />
          </div>
        ))}

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Comparação:</strong> Observe as diferenças nos padrões de
            NDVI entre as diferentes regiões. Áreas urbanas tendem a ter valores
            mais baixos e menos variação sazonal comparadas a áreas rurais.
          </p>
        </div>
      </div>
    );
  },
};

export const ChartTypesShowcase = {
  render: () => {
    const [chartType, setChartType] = useState("line");

    const location = {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    };

    return (
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Tipos de Gráfico</h3>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartType("line")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                chartType === "line"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Linha
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                chartType === "area"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Área
            </button>
          </div>
        </div>

        <NDVIChart
          location={location}
          period="90d"
          height={350}
          showControls={true}
          chartType={chartType}
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Tipo atual:</strong>{" "}
            {chartType === "line" ? "Gráfico de Linha" : "Gráfico de Área"}
            <br />O componente suporta diferentes tipos de visualização para
            melhor apresentação dos dados temporais de NDVI.
          </p>
        </div>
      </div>
    );
  },
};

export const ResponsiveDemo = {
  render: () => {
    const location = {
      latitude: -29.7175,
      longitude: -52.4264,
      name: "Santa Cruz do Sul, RS",
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Responsividade</h3>

        {/* Desktop */}
        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">
            Desktop (Largura Total)
          </h4>
          <div className="w-full">
            <NDVIChart
              location={location}
              period="90d"
              height={300}
              showControls={true}
            />
          </div>
        </div>

        {/* Tablet */}
        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">Tablet (768px)</h4>
          <div className="w-full max-w-3xl">
            <NDVIChart
              location={location}
              period="90d"
              height={280}
              showControls={true}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">Mobile (375px)</h4>
          <div className="w-full max-w-sm">
            <NDVIChart
              location={location}
              period="90d"
              height={250}
              showControls={false}
            />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Responsividade:</strong> O gráfico se adapta automaticamente
            ao tamanho do container. Em telas menores, os controles podem ser
            ocultados para economizar espaço.
          </p>
        </div>
      </div>
    );
  },
};
