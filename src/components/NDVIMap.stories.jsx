import { useState } from "react";
import NDVIMap from "./NDVIMap";

export default {
  title: "Data/NDVIMap",
  component: NDVIMap,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    latitude: {
      control: { type: "number", min: -90, max: 90, step: 0.001 },
      description: "Latitude inicial do mapa",
    },
    longitude: {
      control: { type: "number", min: -180, max: 180, step: 0.001 },
      description: "Longitude inicial do mapa",
    },
    zoom: {
      control: { type: "range", min: 1, max: 20, step: 1 },
      description: "Nível de zoom inicial",
    },
    showControls: {
      control: "boolean",
      description: "Mostrar controles personalizados",
    },
    backgroundColor: {
      control: { type: "color" },
      description: "Cor de fundo do componente",
    },
  },
};

export const Default = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 13,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const SantaCruzDoSul = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 13,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const MobileView = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 12,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const TabletView = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 13,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const ResponsiveDemo = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="text-center text-white p-4">
        <h3 className="text-lg font-semibold mb-2">Mapa NDVI Responsivo</h3>
        <p className="text-sm text-gray-300">Adaptação automática para diferentes tamanhos de tela</p>
      </div>
      <div className="h-96 w-full">
        <NDVIMap latitude={-29.7175} longitude={-52.4264} zoom={13} showControls={true} />
      </div>
    </div>
  ),
};

export const SaoPaulo = {
  args: {
    latitude: -23.5505,
    longitude: -46.6333,
    zoom: 11,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const RioDeJaneiro = {
  args: {
    latitude: -22.9068,
    longitude: -43.1729,
    zoom: 11,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const WithoutControls = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 13,
    showControls: false,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const HighZoom = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 16,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

export const LowZoom = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 8,
    showControls: true,
  },
  render: (args) => (
    <div className="h-screen w-full">
      <NDVIMap {...args} />
    </div>
  ),
};

// Demonstração com callback de seleção
export const WithLocationCallback = {
  render: () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [ndviData, setNdviData] = useState(null);

    const handleLocationSelect = (locationData) => {
      setSelectedLocation(locationData);
      setNdviData(locationData);
      console.log("Localização selecionada:", locationData);
    };

    return (
      <div className="relative h-screen w-full">
        <NDVIMap
          latitude={-29.7175}
          longitude={-52.4264}
          zoom={13}
          showControls={true}
          onLocationSelect={handleLocationSelect}
          ndviData={ndviData}
        />

        {/* Painel de informações */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Dados da Localização
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-medium">
                  {selectedLocation.latitude?.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-medium">
                  {selectedLocation.longitude?.toFixed(6)}
                </span>
              </div>
              {selectedLocation.ndvi && (
                <div className="flex justify-between">
                  <span className="text-gray-600">NDVI:</span>
                  <span className="font-medium text-green-600">
                    {selectedLocation.ndvi.toFixed(3)}
                  </span>
                </div>
              )}
              {selectedLocation.quality && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Qualidade:</span>
                  <span className="font-medium capitalize">
                    {selectedLocation.quality}
                  </span>
                </div>
              )}
              {selectedLocation.cloudCoverage !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Nuvens:</span>
                  <span className="font-medium">
                    {selectedLocation.cloudCoverage}%
                  </span>
                </div>
              )}
              {selectedLocation.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">
                    {new Date(selectedLocation.date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
};

// Demonstração em container menor
export const SmallContainer = {
  args: {
    latitude: -29.7175,
    longitude: -52.4264,
    zoom: 13,
    showControls: true,
  },
  render: (args) => (
    <div className="bg-gray-100 p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Mapa NDVI em Container Pequeno
      </h2>
      <div className="h-96 w-full overflow-hidden rounded-lg border border-gray-300">
        <NDVIMap {...args} />
      </div>
      <p className="mt-4 text-gray-600">
        O mapa se adapta ao tamanho do container e mantém todas as
        funcionalidades.
      </p>
    </div>
  ),
};

// Demonstração com múltiplos mapas
export const MultipleMapas = {
  render: () => (
    <div className="bg-gray-100 p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Comparação de Regiões
      </h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Santa Cruz do Sul - RS
          </h3>
          <div className="h-80 overflow-hidden rounded-lg border border-gray-300">
            <NDVIMap
              latitude={-29.7175}
              longitude={-52.4264}
              zoom={13}
              showControls={true}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            São Paulo - SP
          </h3>
          <div className="h-80 overflow-hidden rounded-lg border border-gray-300">
            <NDVIMap
              latitude={-23.5505}
              longitude={-46.6333}
              zoom={11}
              showControls={true}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600">
        Comparação visual entre diferentes regiões e seus índices NDVI.
      </p>
    </div>
  ),
};

// Demonstração das funcionalidades
export const FeaturesShowcase = {
  render: () => (
    <div className="relative h-screen w-full">
      <NDVIMap
        latitude={-29.7175}
        longitude={-52.4264}
        zoom={13}
        showControls={true}
      />

      {/* Painel de instruções */}
      <div className="absolute right-4 top-4 max-w-sm rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Funcionalidades do Mapa
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></span>
            <span>Clique no mapa para selecionar uma localização</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
            <span>Use os controles à esquerda para alternar camadas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"></span>
            <span>Altere o período temporal dos dados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></span>
            <span>Navegue com zoom e pan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></span>
            <span>Visualize popups com informações detalhadas</span>
          </li>
        </ul>
      </div>

      {/* Legenda NDVI */}
      <div className="absolute bottom-4 right-4 rounded-lg bg-white p-4 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold text-gray-800">
          Legenda NDVI
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded bg-[#2d5a27]"></div>
            <span>Excelente (&ge; 0.7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded bg-[#4a7c59]"></div>
            <span>Bom (&ge; 0.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded bg-[#8fbc8f]"></div>
            <span>Moderado (&ge; 0.3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded bg-[#cd853f]"></div>
            <span>Pobre (&lt; 0.3)</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
