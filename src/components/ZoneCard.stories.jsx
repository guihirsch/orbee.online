import { useState } from "react";
import ZoneCard from "./ZoneCard";

export default {
  title: "OrBee/ZoneCard",
  component: ZoneCard,
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
    zone: {
      control: "object",
      description: "Dados básicos da zona",
    },
    zoneData: {
      control: "object",
      description: "Dados detalhados da zona",
    },
    selectedZone: {
      control: "text",
      description: "ID da zona atualmente selecionada",
    },
    selectedZones: {
      control: "object",
      description: "Array de IDs das zonas selecionadas",
    },
    zoneActivities: {
      control: "object",
      description: "Atividades da zona",
    },
    onZoneClick: {
      action: "zone clicked",
      description: "Callback para clique na zona",
    },
    onZoneToggle: {
      action: "zone toggled",
      description: "Callback para toggle da zona",
    },
    onPhotoGalleryOpen: {
      action: "photo gallery opened",
      description: "Callback para abrir galeria de fotos",
    },
  },
};

// Dados de exemplo
const mockZoneData = {
  id: "A",
  name: "Zona Mata Ciliar Norte",
  priority: "Crítica",
  area: "2.3 ha",
  ndvi: "0.42",
  degradation: "Severa",
  color: "red",
  latitude: "-29.7175",
  longitude: "-52.4264",
};

const mockZoneActivities = {
  "zona-a": {
    reports: 8,
    tracking: 12,
    actions: 5,
    photos: 23,
  },
};

export const Default = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: null,
    selectedZones: [],
    zoneActivities: mockZoneActivities,
  },
};

export const Selected = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: "A",
    selectedZones: [],
    zoneActivities: mockZoneActivities,
  },
};

export const Checked = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: null,
    selectedZones: ["A"],
    zoneActivities: mockZoneActivities,
  },
};

export const SelectedAndChecked = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: "A",
    selectedZones: ["A"],
    zoneActivities: mockZoneActivities,
  },
};

// Zona com prioridade moderada (laranja)
export const ModeratePriority = {
  args: {
    zone: {
      ...mockZoneData,
      id: "B",
      name: "Zona Mata Ciliar Sul",
      priority: "Moderada",
      ndvi: "0.58",
      degradation: "Moderada",
      color: "orange",
    },
    zoneData: {
      ...mockZoneData,
      id: "B",
      name: "Zona Mata Ciliar Sul",
      priority: "Moderada",
      ndvi: "0.58",
      degradation: "Moderada",
      color: "orange",
    },
    selectedZone: null,
    selectedZones: [],
    zoneActivities: {
      "zona-b": {
        reports: 5,
        tracking: 8,
        actions: 3,
        photos: 15,
      },
    },
  },
};

// Zona com prioridade baixa (amarela)
export const LowPriority = {
  args: {
    zone: {
      ...mockZoneData,
      id: "C",
      name: "Zona Mata Ciliar Leste",
      priority: "Baixa",
      area: "1.8 ha",
      ndvi: "0.72",
      degradation: "Leve",
      color: "yellow",
    },
    zoneData: {
      ...mockZoneData,
      id: "C",
      name: "Zona Mata Ciliar Leste",
      priority: "Baixa",
      area: "1.8 ha",
      ndvi: "0.72",
      degradation: "Leve",
      color: "yellow",
    },
    selectedZone: null,
    selectedZones: [],
    zoneActivities: {
      "zona-c": {
        reports: 3,
        tracking: 4,
        actions: 2,
        photos: 8,
      },
    },
  },
};

// Zona com muitas atividades
export const HighActivity = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: null,
    selectedZones: [],
    zoneActivities: {
      "zona-a": {
        reports: 25,
        tracking: 30,
        actions: 18,
        photos: 67,
      },
    },
  },
};

// Zona com poucas atividades
export const LowActivity = {
  args: {
    zone: mockZoneData,
    zoneData: mockZoneData,
    selectedZone: null,
    selectedZones: [],
    zoneActivities: {
      "zona-a": {
        reports: 1,
        tracking: 2,
        actions: 0,
        photos: 3,
      },
    },
  },
};

// Demonstração interativa
export const InteractiveDemo = {
  render: () => {
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedZones, setSelectedZones] = useState([]);

    const zones = [
      {
        id: "A",
        name: "Zona Mata Ciliar Norte",
        priority: "Crítica",
        area: "2.3 ha",
        ndvi: "0.42",
        degradation: "Severa",
        color: "red",
        latitude: "-29.7175",
        longitude: "-52.4264",
      },
      {
        id: "B",
        name: "Zona Mata Ciliar Sul",
        priority: "Moderada",
        area: "1.9 ha",
        ndvi: "0.58",
        degradation: "Moderada",
        color: "orange",
        latitude: "-29.7185",
        longitude: "-52.4274",
      },
      {
        id: "C",
        name: "Zona Mata Ciliar Leste",
        priority: "Baixa",
        area: "1.8 ha",
        ndvi: "0.72",
        degradation: "Leve",
        color: "yellow",
        latitude: "-29.7165",
        longitude: "-52.4254",
      },
    ];

    const zoneActivities = {
      "zona-a": { reports: 8, tracking: 12, actions: 5, photos: 23 },
      "zona-b": { reports: 5, tracking: 8, actions: 3, photos: 15 },
      "zona-c": { reports: 3, tracking: 4, actions: 2, photos: 8 },
    };

    const handleZoneClick = (zoneId) => {
      setSelectedZone(selectedZone === zoneId ? null : zoneId);
    };

    const handleZoneToggle = (zoneId) => {
      setSelectedZones((prev) =>
        prev.includes(zoneId)
          ? prev.filter((id) => id !== zoneId)
          : [...prev, zoneId]
      );
    };

    const handlePhotoGalleryOpen = (zoneKey) => {
      console.log("Abrindo galeria para:", zoneKey);
    };

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">
            Demonstração Interativa
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Clique nos cards para selecioná-los e use os checkboxes para
            marcá-los.
          </p>

          {/* Status */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-2">Status Atual:</h4>
            <div className="space-y-1 text-sm">
              <div>Zona Selecionada: {selectedZone || "Nenhuma"}</div>
              <div>
                Zonas Marcadas:{" "}
                {selectedZones.length > 0
                  ? selectedZones.join(", ")
                  : "Nenhuma"}
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              zoneData={zone}
              selectedZone={selectedZone}
              selectedZones={selectedZones}
              zoneActivities={zoneActivities}
              onZoneClick={handleZoneClick}
              onZoneToggle={handleZoneToggle}
              onPhotoGalleryOpen={handlePhotoGalleryOpen}
            />
          ))}
        </div>
      </div>
    );
  },
};

// Comparação de prioridades
export const PriorityComparison = {
  render: () => {
    const zones = [
      {
        id: "critical",
        name: "Zona Crítica",
        priority: "Crítica",
        area: "2.3 ha",
        ndvi: "0.42",
        degradation: "Severa",
        color: "red",
        latitude: "-29.7175",
        longitude: "-52.4264",
      },
      {
        id: "moderate",
        name: "Zona Moderada",
        priority: "Moderada",
        area: "1.9 ha",
        ndvi: "0.58",
        degradation: "Moderada",
        color: "orange",
        latitude: "-29.7185",
        longitude: "-52.4274",
      },
      {
        id: "low",
        name: "Zona Baixa Prioridade",
        priority: "Baixa",
        area: "1.8 ha",
        ndvi: "0.72",
        degradation: "Leve",
        color: "yellow",
        latitude: "-29.7165",
        longitude: "-52.4254",
      },
    ];

    const zoneActivities = {
      "zona-critical": { reports: 8, tracking: 12, actions: 5, photos: 23 },
      "zona-moderate": { reports: 5, tracking: 8, actions: 3, photos: 15 },
      "zona-low": { reports: 3, tracking: 4, actions: 2, photos: 8 },
    };

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">
            Comparação de Prioridades
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Diferentes níveis de prioridade com cores e indicadores visuais
            distintos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div key={zone.id} className="space-y-2">
              <h4 className="text-white font-medium text-center">
                {zone.priority}
              </h4>
              <ZoneCard
                zone={zone}
                zoneData={zone}
                selectedZone={null}
                selectedZones={[]}
                zoneActivities={zoneActivities}
                onZoneClick={() => {}}
                onZoneToggle={() => {}}
                onPhotoGalleryOpen={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div className="bg-slate-800 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">Legenda de Cores:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/20 border border-red-400/20 rounded"></div>
              <span className="text-red-300">
                Crítica - Ação imediata necessária
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500/20 border border-orange-400/20 rounded"></div>
              <span className="text-orange-300">
                Moderada - Monitoramento intensivo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-400/20 rounded"></div>
              <span className="text-yellow-300">Baixa - Ações preventivas</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Estados de atividade
export const ActivityStates = {
  render: () => {
    const baseZone = {
      id: "activity-demo",
      name: "Zona Demonstração",
      priority: "Moderada",
      area: "2.1 ha",
      ndvi: "0.55",
      degradation: "Moderada",
      color: "orange",
      latitude: "-29.7175",
      longitude: "-52.4264",
    };

    const activityLevels = [
      {
        title: "Baixa Atividade",
        activities: { reports: 1, tracking: 2, actions: 0, photos: 3 },
      },
      {
        title: "Atividade Moderada",
        activities: { reports: 5, tracking: 8, actions: 3, photos: 15 },
      },
      {
        title: "Alta Atividade",
        activities: { reports: 15, tracking: 22, actions: 12, photos: 45 },
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">Estados de Atividade</h3>
          <p className="text-sm text-gray-300 mb-4">
            Diferentes níveis de atividade e engajamento nas zonas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activityLevels.map((level, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-white font-medium text-center">
                {level.title}
              </h4>
              <ZoneCard
                zone={baseZone}
                zoneData={baseZone}
                selectedZone={null}
                selectedZones={[]}
                zoneActivities={{
                  "zona-activity-demo": level.activities,
                }}
                onZoneClick={() => {}}
                onZoneToggle={() => {}}
                onPhotoGalleryOpen={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Explicação dos ícones */}
        <div className="bg-slate-800 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-3">Ícones de Atividade:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                <span className="text-xs">📊</span>
              </div>
              <span>Relatórios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                <span className="text-xs">📈</span>
              </div>
              <span>Acompanhamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                <span className="text-xs">🌱</span>
              </div>
              <span>Ações</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                <span className="text-xs">📷</span>
              </div>
              <span>Fotos</span>
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
    const zones = Array.from({ length: 6 }, (_, i) => ({
      id: `zone-${i + 1}`,
      name: `Zona ${i + 1}`,
      priority: ["Crítica", "Moderada", "Baixa"][i % 3],
      area: `${(1.5 + Math.random() * 2).toFixed(1)} ha`,
      ndvi: (0.3 + Math.random() * 0.4).toFixed(2),
      degradation: ["Severa", "Moderada", "Leve"][i % 3],
      color: ["red", "orange", "yellow"][i % 3],
      latitude: (-29.7175 + (Math.random() - 0.5) * 0.01).toFixed(4),
      longitude: (-52.4264 + (Math.random() - 0.5) * 0.01).toFixed(4),
    }));

    const zoneActivities = zones.reduce((acc, zone) => {
      acc[`zona-${zone.id}`] = {
        reports: Math.floor(Math.random() * 20) + 1,
        tracking: Math.floor(Math.random() * 25) + 1,
        actions: Math.floor(Math.random() * 15) + 1,
        photos: Math.floor(Math.random() * 50) + 1,
      };
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="text-white">
          <h3 className="text-lg font-semibold mb-2">Layout Responsivo</h3>
          <p className="text-sm text-gray-300 mb-4">
            Grid adaptativo que se ajusta a diferentes tamanhos de tela.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              zoneData={zone}
              selectedZone={null}
              selectedZones={[]}
              zoneActivities={zoneActivities}
              onZoneClick={() => {}}
              onZoneToggle={() => {}}
              onPhotoGalleryOpen={() => {}}
            />
          ))}
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Responsividade:</strong> O layout se adapta automaticamente:
            <br />• Mobile: 1 coluna
            <br />• Tablet: 2 colunas
            <br />• Desktop: 3 colunas
            <br />• Telas grandes: 4 colunas
          </p>
        </div>
      </div>
    );
  },
};
