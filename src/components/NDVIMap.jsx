import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Layers, Calendar, Info } from 'lucide-react';
import ndviService from '../services/ndviService';

// Token público do Mapbox (substitua pelo seu token)
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const NDVIMap = ({ 
  latitude = -23.5505, 
  longitude = -46.6333, 
  zoom = 12,
  onLocationSelect,
  ndviData = null,
  showControls = true 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showNDVILayer, setShowNDVILayer] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState('current');
  const [currentNDVI, setCurrentNDVI] = useState(null);
  const [loadingNDVI, setLoadingNDVI] = useState(false);

  useEffect(() => {
    if (map.current) return; // Inicializa mapa apenas uma vez

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [longitude, latitude],
      zoom: zoom,
      attributionControl: false
    });

    // Adiciona controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Adiciona controle de escala
    map.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left');

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Adiciona camada NDVI simulada
      addNDVILayer();
      
      // Adiciona marcador inicial
      addLocationMarker(longitude, latitude);
    });

    // Evento de clique no mapa
    map.current.on('click', async (e) => {
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
        const quality = ndviData.quality || 'medium';
        const cloudCoverage = ndviData.cloud_coverage || 0;
        
        setCurrentNDVI({
          value: ndviValue,
          latitude: lat,
          longitude: lng,
          quality,
          cloudCoverage,
          date: ndviData.date
        });
        
        // Callback para componente pai
        if (onLocationSelect) {
          onLocationSelect({ 
            longitude: lng, 
            latitude: lat,
            ndvi: ndviValue,
            quality,
            cloudCoverage,
            date: ndviData.date
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados NDVI:', error);
        
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

  // Função para adicionar camada NDVI simulada
  const addNDVILayer = () => {
    if (!map.current || !mapLoaded) return;

    // Remove camada existente se houver
    if (map.current.getLayer('ndvi-layer')) {
      map.current.removeLayer('ndvi-layer');
    }
    if (map.current.getSource('ndvi-source')) {
      map.current.removeSource('ndvi-source');
    }

    // Dados NDVI simulados (em produção, viria da API)
    const ndviGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            ndvi: 0.8,
            status: 'excellent'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [longitude - 0.01, latitude - 0.01],
              [longitude + 0.01, latitude - 0.01],
              [longitude + 0.01, latitude + 0.01],
              [longitude - 0.01, latitude + 0.01],
              [longitude - 0.01, latitude - 0.01]
            ]]
          }
        },
        {
          type: 'Feature',
          properties: {
            ndvi: 0.6,
            status: 'good'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [longitude - 0.02, latitude - 0.02],
              [longitude - 0.01, latitude - 0.02],
              [longitude - 0.01, latitude - 0.01],
              [longitude - 0.02, latitude - 0.01],
              [longitude - 0.02, latitude - 0.02]
            ]]
          }
        },
        {
          type: 'Feature',
          properties: {
            ndvi: 0.3,
            status: 'moderate'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [longitude + 0.01, latitude - 0.02],
              [longitude + 0.02, latitude - 0.02],
              [longitude + 0.02, latitude - 0.01],
              [longitude + 0.01, latitude - 0.01],
              [longitude + 0.01, latitude - 0.02]
            ]]
          }
        }
      ]
    };

    // Adiciona fonte de dados
    map.current.addSource('ndvi-source', {
      type: 'geojson',
      data: ndviGeoJSON
    });

    // Adiciona camada com cores baseadas no NDVI
    map.current.addLayer({
      id: 'ndvi-layer',
      type: 'fill',
      source: 'ndvi-source',
      paint: {
        'fill-color': [
          'case',
          ['>=', ['get', 'ndvi'], 0.7], '#2d5a27', // Verde escuro - Excelente
          ['>=', ['get', 'ndvi'], 0.5], '#4a7c59', // Verde médio - Bom
          ['>=', ['get', 'ndvi'], 0.3], '#8fbc8f', // Verde claro - Moderado
          ['>=', ['get', 'ndvi'], 0.1], '#daa520', // Amarelo - Pobre
          '#cd853f' // Marrom - Crítico
        ],
        'fill-opacity': 0.6
      }
    });

    // Adiciona popup ao clicar na camada NDVI
    map.current.on('click', 'ndvi-layer', (e) => {
      const properties = e.features[0].properties;
      
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">Dados NDVI</h3>
            <p class="text-xs"><strong>Valor:</strong> ${properties.ndvi}</p>
            <p class="text-xs"><strong>Status:</strong> ${properties.status}</p>
            <p class="text-xs text-gray-600 mt-1">Clique para análise detalhada</p>
          </div>
        `)
        .addTo(map.current);
    });

    // Cursor pointer ao passar sobre a camada
    map.current.on('mouseenter', 'ndvi-layer', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'ndvi-layer', () => {
      map.current.getCanvas().style.cursor = '';
    });
  };

  // Função para adicionar marcador de localização
  const addLocationMarker = (lng, lat) => {
    // Remove marcadores existentes
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Adiciona novo marcador
    const el = document.createElement('div');
    el.className = 'location-marker';
    el.innerHTML = `
      <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    `;

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  // Função para alternar visibilidade da camada NDVI
  const toggleNDVILayer = () => {
    if (!map.current || !mapLoaded) return;

    const visibility = showNDVILayer ? 'none' : 'visible';
    map.current.setLayoutProperty('ndvi-layer', 'visibility', visibility);
    setShowNDVILayer(!showNDVILayer);
  };

  // Função para alterar período temporal
  const changePeriod = (period) => {
    setCurrentPeriod(period);
    // TODO: Atualizar dados NDVI baseado no período
    console.log('Alterando período para:', period);
  };

  return (
    <div className="relative w-full h-full">
      {/* Container do mapa */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Controles personalizados */}
      {showControls && (
        <div className="absolute top-4 left-4 space-y-2">
          {/* Controle de camadas */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <button
              onClick={toggleNDVILayer}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                showNDVILayer 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>NDVI</span>
            </button>
          </div>

          {/* Controle de período */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="text-xs font-medium text-gray-700 mb-2 px-2">Período</div>
            <div className="space-y-1">
              {[
                { value: 'current', label: 'Atual' },
                { value: '30days', label: '30 dias' },
                { value: '90days', label: '90 dias' },
                { value: '1year', label: '1 ano' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => changePeriod(period.value)}
                  className={`w-full flex items-center space-x-2 px-2 py-1 rounded text-xs transition-colors ${
                    currentPeriod === period.value
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{period.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legenda NDVI */}
      {showNDVILayer && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Legenda NDVI</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-800 rounded"></div>
              <span>Excelente (0.7-1.0)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Bom (0.5-0.7)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-300 rounded"></div>
              <span>Moderado (0.3-0.5)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Pobre (0.1-0.3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-600 rounded"></div>
              <span>Crítico (0.0-0.1)</span>
            </div>
          </div>
        </div>
      )}

      {/* Informações da localização selecionada */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">Localização Selecionada</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Lat:</strong> {selectedLocation.latitude.toFixed(6)}</p>
            <p><strong>Lon:</strong> {selectedLocation.longitude.toFixed(6)}</p>
            <p className="text-blue-600 cursor-pointer hover:underline">
              Clique para análise detalhada
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NDVIMap;