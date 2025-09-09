import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Layers, Calendar, Info } from "lucide-react";
import ndviService from "../services/ndviService";

// Token público do Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

const NDVIMap = ({
  latitude = -29.7175,
  longitude = -52.4264,
  zoom = 13,
  onLocationSelect,
  ndviData = null,
  showControls = true,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showNDVILayer, setShowNDVILayer] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState("current");
  const [currentNDVI, setCurrentNDVI] = useState(null);
  const [loadingNDVI, setLoadingNDVI] = useState(false);

  useEffect(() => {
    if (map.current) return; // Inicializa mapa apenas uma vez

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [longitude, latitude],
      zoom: zoom,
      attributionControl: false,
    });

    // Adiciona controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Adiciona controle de escala
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
      "bottom-left"
    );

    map.current.on("load", () => {
      setMapLoaded(true);

      // Adiciona camada NDVI simulada
      addNDVILayer();

      // Adiciona marcador inicial
      addLocationMarker(longitude, latitude);
    });

    // Evento de clique no mapa
    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation({ longitude: lng, latitude: lat });

      // Adiciona marcador na nova localização
      addLocationMarker(lng, lat);

      try {
        setLoadingNDVI(true);

        // Busca dados NDVI reais para a localização clicada
        const ndviData = await ndviService.getCurrentNDVI(lat, lng);

        const ndviValue = ndviData.ndvi || 0;
        const ndviFormatted = ndviValue.toFixed(3);
        const quality = ndviData.quality || "medium";
        const cloudCoverage = ndviData.cloud_coverage || 0;

        setCurrentNDVI({
          value: ndviValue,
          latitude: lat,
          longitude: lng,
          quality,
          cloudCoverage,
          date: ndviData.date,
        });

        // Callback para componente pai
        if (onLocationSelect) {
          onLocationSelect({
            longitude: lng,
            latitude: lat,
            ndvi: ndviValue,
            quality,
            cloudCoverage,
            date: ndviData.date,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados NDVI:", error);

        // Fallback para dados simulados
        if (onLocationSelect) {
          onLocationSelect({ longitude: lng, latitude: lat });
        }
      } finally {
        setLoadingNDVI(false);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Função para adicionar camada NDVI com dados de Santa Cruz do Sul
  const addNDVILayer = async () => {
    if (!map.current || !mapLoaded) return;

    // Remove camada existente se houver
    if (map.current.getLayer("ndvi-layer")) {
      map.current.removeLayer("ndvi-layer");
    }
    if (map.current.getSource("ndvi-source")) {
      map.current.removeSource("ndvi-source");
    }

    try {
      // Busca dados GeoJSON específicos para Santa Cruz do Sul
      const ndviGeoJSON = ndviService.getSantaCruzDoSulGeoJSON();

      // Adiciona fonte de dados
      map.current.addSource("ndvi-source", {
        type: "geojson",
        data: ndviGeoJSON,
      });

      // Adiciona camada com cores baseadas no NDVI
      map.current.addLayer({
        id: "ndvi-layer",
        type: "fill",
        source: "ndvi-source",
        paint: {
          "fill-color": [
            "case",
            [">=", ["get", "ndvi"], 0.7],
            "#2d5a27", // Verde escuro - Excelente
            [">=", ["get", "ndvi"], 0.5],
            "#4a7c59", // Verde médio - Bom
            [">=", ["get", "ndvi"], 0.3],
            "#8fbc8f", // Verde claro - Moderado
            "#cd853f", // Marrom - Pobre
          ],
          "fill-opacity": 0.7,
        },
      });

      // Adiciona camada de contorno
      map.current.addLayer({
        id: "ndvi-outline",
        type: "line",
        source: "ndvi-source",
        paint: {
          "line-color": "#ffffff",
          "line-width": 1,
          "line-opacity": 0.8,
        },
      });

      // Adiciona popup ao clicar nas regiões
      map.current.on("click", "ndvi-layer", (e) => {
        const properties = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div class="p-3">
              <h3 class="font-semibold text-gray-800">${properties.name}</h3>
              <p class="mb-2 text-sm text-gray-600">${properties.description}</p>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span>NDVI:</span>
                  <span class="font-medium">${properties.ndvi}</span>
                </div>
                <div class="flex justify-between">
                  <span>Status:</span>
                  <span class="font-medium capitalize">${properties.status}</span>
                </div>
              </div>
            </div>
          `
          )
          .addTo(map.current);
      });

      // Muda cursor ao passar sobre as regiões
      map.current.on("mouseenter", "ndvi-layer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "ndvi-layer", () => {
        map.current.getCanvas().style.cursor = "";
      });
    } catch (error) {
      console.error("Erro ao carregar dados NDVI:", error);
      // Fallback para dados simulados básicos
      const fallbackGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              ndvi: 0.6,
              status: "good",
              name: "Área Central",
              description: "Dados simulados",
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [longitude - 0.01, latitude - 0.01],
                  [longitude + 0.01, latitude - 0.01],
                  [longitude + 0.01, latitude + 0.01],
                  [longitude - 0.01, latitude + 0.01],
                  [longitude - 0.01, latitude - 0.01],
                ],
              ],
            },
          },
        ],
      };

      // Adiciona fonte de dados
      map.current.addSource("ndvi-source", {
        type: "geojson",
        data: fallbackGeoJSON,
      });

      // Adiciona camada com cores baseadas no NDVI
      map.current.addLayer({
        id: "ndvi-layer",
        type: "fill",
        source: "ndvi-source",
        paint: {
          "fill-color": [
            "case",
            [">=", ["get", "ndvi"], 0.7],
            "#2d5a27", // Verde escuro - Excelente
            [">=", ["get", "ndvi"], 0.5],
            "#4a7c59", // Verde médio - Bom
            [">=", ["get", "ndvi"], 0.3],
            "#8fbc8f", // Verde claro - Moderado
            "#cd853f", // Marrom - Pobre
          ],
          "fill-opacity": 0.7,
        },
      });
    }
  };

  // Função para adicionar marcador de localização
  const addLocationMarker = (lng, lat) => {
    // Remove marcadores existentes
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Adiciona novo marcador
    const el = document.createElement("div");
    el.className = "location-marker";
    el.innerHTML = `
      <div class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
        <div class="h-2 w-2 rounded-full bg-white"></div>
      </div>
    `;

    new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current);
  };

  // Função para alternar visibilidade da camada NDVI
  const toggleNDVILayer = () => {
    if (!map.current || !mapLoaded) return;

    const visibility = showNDVILayer ? "none" : "visible";
    map.current.setLayoutProperty("ndvi-layer", "visibility", visibility);
    setShowNDVILayer(!showNDVILayer);
  };

  // Função para alterar período temporal
  const changePeriod = (period) => {
    setCurrentPeriod(period);
    // TODO: Atualizar dados NDVI baseado no período
    console.log("Alterando período para:", period);
  };

  return (
    <div className="relative h-full w-full">
      {/* Container do mapa */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Controles personalizados */}
      {showControls && (
        <div className="absolute left-4 top-4 space-y-2">
          {/* Controle de camadas */}
          <div className="rounded-lg bg-white p-2 shadow-lg">
            <button
              onClick={toggleNDVILayer}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                showNDVILayer
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>NDVI</span>
            </button>
          </div>

          {/* Controle de período */}
          <div className="rounded-lg bg-white p-2 shadow-lg">
            <div className="mb-2 px-2 text-xs font-medium text-gray-700">
              Período
            </div>
            <div className="space-y-1">
              {[
                { value: "current", label: "Atual" },
                { value: "30days", label: "30 dias" },
                { value: "90days", label: "90 dias" },
                { value: "1year", label: "1 ano" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => changePeriod(period.value)}
                  className={`w-full flex items-center space-x-2 px-2 py-1 rounded text-xs transition-colors ${
                    currentPeriod === period.value
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{period.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Informações da localização selecionada */}
      {selectedLocation && (
        <div className="absolute right-4 top-4 max-w-xs rounded-lg bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">
              Localização Selecionada
            </span>
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              <strong>Lat:</strong> {selectedLocation.latitude.toFixed(6)}
            </p>
            <p>
              <strong>Lon:</strong> {selectedLocation.longitude.toFixed(6)}
            </p>
            <p className="cursor-pointer text-blue-600 hover:underline">
              Clique para análise detalhada
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NDVIMap;
