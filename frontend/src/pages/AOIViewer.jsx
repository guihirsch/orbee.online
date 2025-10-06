import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fromUrl as geotiffFromUrl } from "geotiff";
import proj4 from "proj4";
import useAuth from "../hooks/useAuth";
import MapShortcuts from "../components/MapShortcuts";
import {
   Globe,
   Search,
   X,
   BarChart3,
   Activity,
   Leaf,
   Camera,
   TrendingUp,
   TrendingDown,
   Check,
   MapPin,
   Navigation,
   Bookmark,
   Eye,
   Clock,
} from "lucide-react";

export default function AOIViewer() {
   const mapRef = useRef(null);
   const containerRef = useRef(null);
   const { user, isAuthenticated, apiRequest } = useAuth();
   const [loaded, setLoaded] = useState(false);
   const [baseLayer, setBaseLayer] = useState("osm");
   const [rgbVisible, setRgbVisible] = useState(false);
   const [rgbAvailable, setRgbAvailable] = useState(false);
   const [criticalPoints, setCriticalPoints] = useState([]);
   const [savedObservations, setSavedObservations] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selectedPoint, setSelectedPoint] = useState(null);
   const [showCards, setShowCards] = useState(false);
   const [showAcompanhamentos, setShowAcompanhamentos] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const actionFileInputRef = useRef(null);
   const [pendingActionDescription, setPendingActionDescription] = useState("");
   const [pendingActionTargets, setPendingActionTargets] = useState([]);
   const [watchlist, setWatchlist] = useState(() => {
      try {
         const saved = localStorage.getItem("orbee-watchlist");
         return saved ? JSON.parse(saved) : [];
      } catch {
         return [];
      }
   });

   // Funções para integração com backend
   const saveObservation = async (observationData) => {
      if (!isAuthenticated) {
         alert("You need to be logged in to save observations");
         return;
      }

      try {
         setLoading(true);
         const response = await apiRequest("/observations/", {
            method: "POST",
            body: JSON.stringify(observationData),
         });

         setSavedObservations((prev) => [...prev, response]);
         alert("Observation saved successfully!");
      } catch (error) {
         console.error("Error saving observation:", error);
         alert("Error saving observation");
      } finally {
         setLoading(false);
      }
   };

   const loadUserObservations = async () => {
      if (!isAuthenticated) return;

      try {
         setLoading(true);
         const response = await apiRequest("/observations/");
         setSavedObservations(response);
      } catch (error) {
         console.error("Error loading observations:", error);
      } finally {
         setLoading(false);
      }
   };

   const deleteObservation = async (observationId) => {
      if (!isAuthenticated) return;

      try {
         setLoading(true);
         await apiRequest(`/observations/${observationId}`, {
            method: "DELETE",
         });

         setSavedObservations((prev) =>
            prev.filter((obs) => obs.id !== observationId)
         );
         alert("Observation removed successfully!");
      } catch (error) {
         console.error("Error removing observation:", error);
         alert("Error removing observation");
      } finally {
         setLoading(false);
      }
   };
   const [showSearchResults, setShowSearchResults] = useState(false);
   const [isSearching, setIsSearching] = useState(false);
   const [selectedRegion, setSelectedRegion] = useState(null);

   // Estados para filtros e seleção de pontos críticos
   const [activeFilter, setActiveFilter] = useState("all");
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [selectedPoints, setSelectedPoints] = useState([]);
   const [isSelectionOpen, setIsSelectionOpen] = useState(false);
   const [isStatsOpen, setIsStatsOpen] = useState(false);

   // Estados para expansão horizontal
   const [panelWidth, setPanelWidth] = useState(() => {
      const saved = localStorage.getItem("orbee-panel-width");
      return saved ? parseInt(saved) : 360; // Largura padrão em pixels (acompanha largura mínima dos cards)
   });
   const [isResizing, setIsResizing] = useState(false);
   const [resizeStartX, setResizeStartX] = useState(0);
   const [resizeStartWidth, setResizeStartWidth] = useState(0);

   // Estados para expansão horizontal da seção de acompanhamentos
   const [acompanhamentosWidth, setAcompanhamentosWidth] = useState(() => {
      const saved = localStorage.getItem("orbee-acompanhamentos-width");
      return saved ? parseInt(saved) : 300; // Largura padrão em pixels
   });
   const [isAcompanhamentosResizing, setIsAcompanhamentosResizing] =
      useState(false);
   const [acompanhamentosResizeStartX, setAcompanhamentosResizeStartX] =
      useState(0);
   const [acompanhamentosResizeStartWidth, setAcompanhamentosResizeStartWidth] =
      useState(0);

   useEffect(() => {
      if (mapRef.current) return;
      mapRef.current = new maplibregl.Map({
         container: containerRef.current,
         style: {
            version: 8,
            sources: {
               osm: {
                  type: "raster",
                  tiles: [
                     "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                     "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                     "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                  ],
                  tileSize: 256,
                  attribution: "© OpenStreetMap contributors",
               },
               sat: {
                  type: "raster",
                  tiles: [
                     "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                  ],
                  tileSize: 256,
                  attribution:
                     "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
               },
            },
            layers: [
               {
                  id: "sat",
                  type: "raster",
                  source: "sat",
                  layout: { visibility: "none" },
               },
               { id: "osm", type: "raster", source: "osm" },
            ],
         },
         center: [-52.4264, -29.475],
         zoom: 13,
      });

      mapRef.current.on("load", async () => {
         try {
            // Base layers
            mapRef.current.setLayoutProperty(
               "osm",
               "visibility",
               baseLayer === "osm" ? "visible" : "none"
            );
            mapRef.current.setLayoutProperty(
               "sat",
               "visibility",
               baseLayer === "sat" ? "visible" : "none"
            );

            // RGB opcional
            try {
               const rgbTiff = await geotiffFromUrl(
                  "/rgb_mosaic_super_resolved.tif"
               );
               const rgbImg = await rgbTiff.getImage();
               // ... código RGB simplificado ...
               setRgbAvailable(true);
            } catch {}

            // PONTOS CRÍTICOS COM PINS - FILTRADOS POR DENSIDADE E ZOOM
            try {
               const criticalRes = await fetch(
                  "/critical_points_mata_ciliar.geojson"
               );

               if (criticalRes.ok) {
                  const criticalGeo = await criticalRes.json();

                  // Armazenar dados globalmente para acesso no useEffect
                  window.criticalGeoData = criticalGeo;

                  // Função para classificar degradação usando dados REAIS do GeoJSON
                  const classifyDegradation = (feature) => {
                     // Usar propriedades do GeoJSON gerado pelo HLS.ipynb
                     const props = feature.properties;

                     // Se já tem classificação do GeoJSON, usar ela
                     if (props.level && props.color) {
                        // Mapear levels do GeoJSON para levels da função getVegetationDescription
                        const levelMapping = {
                           very_sparse: "critical",
                           sparse: "moderate",
                           dense: "good",
                           very_dense: "excellent",
                        };

                        const mappedLevel =
                           levelMapping[props.level] || props.level;

                        return {
                           level: mappedLevel,
                           color: props.color,
                           label:
                              props.label || props.severity || "Unclassified",
                           ndvi: props.ndvi,
                        };
                     }

                     // Fallback para classificação por NDVI (compatibilidade)
                     const ndvi = props.ndvi || 0;
                     if (ndvi < -0.2)
                        return {
                           level: "water",
                           color: "#8B0000",
                           label: "Água/Solo",
                           ndvi: ndvi,
                        };
                     if (ndvi < 0.2)
                        return {
                           level: "critical",
                           color: "#DC143C",
                           label: "Critical",
                           ndvi: ndvi,
                        };
                     if (ndvi < 0.4)
                        return {
                           level: "moderate",
                           color: "#FF8C00",
                           label: "Moderado",
                           ndvi: ndvi,
                        };
                     if (ndvi < 0.6)
                        return {
                           level: "fair",
                           color: "#FFD700",
                           label: "Regular",
                           ndvi: ndvi,
                        };
                     return {
                        level: "excellent",
                        color: "#228B22",
                        label: "Healthy",
                        ndvi: ndvi,
                     };
                  };

                  // Função para filtrar pontos com configuração simplificada
                  const filterPointsByType = (features) => {
                     // Configuração fixa - sempre mostrar críticos
                     const config = {
                        minDistance: 50, // Distância mínima de 50m entre pontos
                        showCritical: true, // Sempre mostrar críticos
                        showModerate: true, // Sempre mostrar moderados
                        showHealthy: true, // Sempre mostrar saudáveis
                        maxPointsPerType: {
                           critical: 999, // Sem limite para críticos
                           moderate: 999, // Sem limite para moderados
                           healthy: 999, // Sem limite para saudáveis
                        },
                     };

                     // Classificar todos os pontos usando dados reais do GeoJSON
                     const classifiedFeatures = features.map((f) => ({
                        ...f,
                        classification: classifyDegradation(f),
                     }));

                     // Separar por severidade usando dados reais do GeoJSON
                     const critical = classifiedFeatures.filter((f) => {
                        const severity = f.properties.severity;
                        return severity === "critical";
                     });

                     const moderate = classifiedFeatures.filter((f) => {
                        const severity = f.properties.severity;
                        return severity === "moderate";
                     });

                     const healthy = classifiedFeatures.filter((f) => {
                        const severity = f.properties.severity;
                        return severity === "healthy";
                     });

                     // Função para calcular distância entre dois pontos (Haversine)
                     const getDistance = (lat1, lon1, lat2, lon2) => {
                        const R = 6371000; // Raio da Terra em metros
                        const dLat = ((lat2 - lat1) * Math.PI) / 180;
                        const dLon = ((lon2 - lon1) * Math.PI) / 180;
                        const a =
                           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                           Math.cos((lat1 * Math.PI) / 180) *
                              Math.cos((lat2 * Math.PI) / 180) *
                              Math.sin(dLon / 2) *
                              Math.sin(dLon / 2);
                        return (
                           R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                        );
                     };

                     // Filtrar por densidade apenas quando necessário
                     const filterByDistance = (points, minDist, maxPoints) => {
                        // Se há poucos pontos, não filtrar
                        if (points.length <= maxPoints) {
                           return points;
                        }

                        const filtered = [];
                        // Ordenar por severidade NDVI (piores primeiro)
                        const sorted = points.sort(
                           (a, b) => a.properties.ndvi - b.properties.ndvi
                        );

                        for (const point of sorted) {
                           const [lon, lat] = point.geometry.coordinates;
                           const tooClose = filtered.some((existing) => {
                              const [eLon, eLat] =
                                 existing.geometry.coordinates;
                              return (
                                 getDistance(lat, lon, eLon, eLat) < minDist
                              );
                           });
                           if (!tooClose) {
                              filtered.push(point);
                              if (filtered.length >= maxPoints) break;
                           }
                        }
                        return filtered;
                     };

                     // Filtrar cada tipo com suas configurações específicas
                     let result = [];

                     // CRÍTICOS: TODOS sem limite (prioridade máxima)
                     if (config.showCritical) {
                        const filteredCritical = filterByDistance(
                           critical,
                           config.minDistance,
                           config.maxPointsPerType.critical
                        );
                        result = [...result, ...filteredCritical];
                     }

                     // MODERADOS: Com limite
                     if (config.showModerate) {
                        const filteredModerate = filterByDistance(
                           moderate,
                           config.minDistance,
                           config.maxPointsPerType.moderate
                        );
                        result = [...result, ...filteredModerate];
                     }

                     // SAUDÁVEIS: Sem limite
                     if (config.showHealthy) {
                        const filteredHealthy = filterByDistance(
                           healthy,
                           config.minDistance,
                           config.maxPointsPerType.healthy
                        );
                        result = [...result, ...filteredHealthy];
                     }

                     return result;
                  };

                  // Criar fonte de dados inicial com configuração fixa
                  const filteredFeatures = filterPointsByType(
                     criticalGeo.features
                  );

                  const filteredGeoJSON = {
                     type: "FeatureCollection",
                     features: filteredFeatures,
                     metadata: criticalGeo.metadata,
                  };

                  // Atualizar estado dos pontos críticos com os dados filtrados

                  setCriticalPoints(filteredFeatures);

                  mapRef.current.addSource("critical-points", {
                     type: "geojson",
                     data: filteredGeoJSON,
                  });

                  // Criar pins SVG com design melhorado e compatível
                  const createPin = (color, size = 24, level = "default") => {
                     // Usar URL encoding em vez de Base64 para melhor compatibilidade
                     const svg = `<svg width="${size}" height="${Math.round(size * 1.3)}" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                           <linearGradient id="grad${level}" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stop-color="${color}" stop-opacity="1" />
                              <stop offset="100%" stop-color="${color}" stop-opacity="0.8" />
                           </linearGradient>
                        </defs>
                        
                        <ellipse cx="16" cy="38" rx="8" ry="3" fill="${color}" opacity="0.2"/>
                        
                        <path d="M16 2C9.4 2 4 7.4 4 14c0 10.5 12 24 12 24s12-13.5 12-24c0-6.6-5.4-12-12-12z" 
                              fill="url(#grad${level})" 
                              stroke="white" 
                              stroke-width="2"/>
                        
                        <circle cx="16" cy="14" r="5" fill="white" stroke="${color}" stroke-width="1"/>
                        
                        <circle cx="16" cy="14" r="3" fill="${color}"/>
                        
                        <ellipse cx="14" cy="12" rx="1.5" ry="2" fill="white" opacity="0.4"/>
                     </svg>`;

                     try {
                        // Tentar URL encoding primeiro (mais compatível)
                        const encodedSvg = encodeURIComponent(svg)
                           .replace(/'/g, "%27")
                           .replace(/"/g, "%22");
                        return `data:image/svg+xml,${encodedSvg}`;
                     } catch (error) {
                        console.warn(
                           `URL encoding falhou para ${level}, tentando Base64...`
                        );
                        try {
                           return `data:image/svg+xml;base64,${btoa(svg)}`;
                        } catch (base64Error) {
                           console.error(
                              `Ambos encodings falharam para ${level}:`,
                              base64Error
                           );
                           // Fallback para um SVG ultra-simples
                           const simpleSvg = `<svg width="${size}" height="${Math.round(size * 1.3)}" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C9.4 2 4 7.4 4 14c0 10.5 12 24 12 24s12-13.5 12-24c0-6.6-5.4-12-12-12z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="16" cy="14" r="4" fill="white"/><circle cx="16" cy="14" r="2" fill="${color}"/></svg>`;
                           const simpleEncoded = encodeURIComponent(simpleSvg);
                           return `data:image/svg+xml,${simpleEncoded}`;
                        }
                     }
                  };

                  // Criar pins para todos os níveis de degradação com escala RdYlGn
                  const pinTypes = [
                     { name: "water", color: "#8B0000", size: 22 }, // Vermelho escuro
                     { name: "critical", color: "#DC143C", size: 30 }, // Vermelho intenso (maior)
                     { name: "severe", color: "#FF4500", size: 28 }, // Laranja-vermelho
                     { name: "moderate", color: "#FF8C00", size: 26 }, // Laranja
                     { name: "light", color: "#FFD700", size: 24 }, // Amarelo dourado
                     { name: "fair", color: "#ADFF2F", size: 22 }, // Verde-amarelo
                     { name: "good", color: "#32CD32", size: 20 }, // Verde lima
                     { name: "excellent", color: "#228B22", size: 20 }, // Verde floresta
                  ];

                  // Carregar todas as imagens de pin
                  let loadedImages = 0;
                  const totalImages = pinTypes.length;

                  pinTypes.forEach((pinType) => {
                     const img = new Image();
                     img.onload = () => {
                        try {
                           mapRef.current.addImage(`${pinType.name}-pin`, img);
                           loadedImages++;

                           // Verificar se todas as imagens foram carregadas
                           checkImagesLoaded();
                        } catch (error) {
                           console.error(
                              `❌ Erro ao adicionar imagem ${pinType.name} ao mapa:`,
                              error
                           );
                        }
                     };
                     img.onerror = (e) => {
                        console.error(
                           `❌ Erro ao carregar pin ${pinType.name}:`,
                           e,
                           `\n🔍 URL: ${img.src.substring(0, 100)}...`
                        );
                        // Tentar criar um pin mais simples

                        const fallbackSvg = `<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                           <circle cx="12" cy="12" r="10" fill="${pinType.color}" stroke="white" stroke-width="2"/>
                           <circle cx="12" cy="12" r="4" fill="white"/>
                           <polygon points="12,22 6,12 18,12" fill="${pinType.color}"/>
                        </svg>`;

                        try {
                           img.src = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
                        } catch (fallbackError) {
                           console.error(
                              `❌ Erro no fallback para ${pinType.name}:`,
                              fallbackError
                           );
                        }
                     };

                     // Criar o pin SVG
                     try {
                        const pinSrc = createPin(
                           pinType.color,
                           pinType.size,
                           pinType.name
                        );

                        img.src = pinSrc;
                     } catch (error) {
                        console.error(
                           `❌ Erro ao criar SVG para ${pinType.name}:`,
                           error
                        );
                     }
                  });

                  // Aguardar todas as imagens carregarem antes de criar a camada
                  const checkImagesLoaded = () => {
                     if (loadedImages === totalImages) {
                        try {
                           mapRef.current.addLayer({
                              id: "critical-points-symbols",
                              type: "symbol",
                              source: "critical-points",
                              layout: {
                                 "icon-image": [
                                    "case",
                                    ["==", ["get", "severity"], "critical"],
                                    "critical-pin",
                                    ["==", ["get", "severity"], "moderate"],
                                    "moderate-pin",
                                    ["==", ["get", "severity"], "healthy"],
                                    "good-pin",
                                    // Fallback por NDVI se não tiver severity
                                    ["<", ["get", "ndvi"], -0.2],
                                    "water-pin",
                                    ["<", ["get", "ndvi"], 0.0],
                                    "critical-pin",
                                    ["<", ["get", "ndvi"], 0.2],
                                    "severe-pin",
                                    ["<", ["get", "ndvi"], 0.4],
                                    "moderate-pin",
                                    ["<", ["get", "ndvi"], 0.6],
                                    "fair-pin",
                                    ["<", ["get", "ndvi"], 0.8],
                                    "good-pin",
                                    "excellent-pin",
                                 ],
                                 "icon-size": [
                                    "case",
                                    ["<", ["get", "ndvi"], 0.0],
                                    1.0, // Crítico maior
                                    ["<", ["get", "ndvi"], 0.2],
                                    0.95, // Severo
                                    ["<", ["get", "ndvi"], 0.4],
                                    0.9, // Moderado
                                    ["<", ["get", "ndvi"], 0.5],
                                    0.85, // Leve
                                    0.75, // Outros menores
                                 ],
                                 "icon-anchor": "bottom",
                                 "icon-allow-overlap": true,
                                 "icon-ignore-placement": true,
                              },
                           });

                           // Adicionar event listeners apenas após a camada ser criada
                           setupEventListeners();
                        } catch (error) {
                           console.error("❌ Erro ao criar camada:", error);
                        }
                     }
                  };

                  // Função para configurar event listeners
                  const setupEventListeners = () => {
                     // Interações - apenas hover para cursor e clique para popup
                     mapRef.current.on(
                        "mousemove",
                        "critical-points-symbols",
                        (e) => {
                           if (!e.features?.length) return;
                           mapRef.current.getCanvas().style.cursor = "pointer";
                        }
                     );

                     mapRef.current.on(
                        "mouseleave",
                        "critical-points-symbols",
                        () => {
                           mapRef.current.getCanvas().style.cursor = "";
                        }
                     );

                     mapRef.current.on(
                        "click",
                        "critical-points-symbols",
                        (e) => {
                           if (!e.features?.length) return;
                           const f = e.features[0];
                           const p = f.properties;
                           const ndvi = p.ndvi || 0;
                           const classification = classifyDegradation(f);

                           // Ícones por nível
                           const icons = {
                              water: "💧",
                              critical: "🔴",
                              severe: "🟠",
                              moderate: "🟡",
                              light: "🟨",
                              fair: "🟢",
                              good: "💚",
                              excellent: "🌟",
                           };

                           // Criar popup no clique
                           new maplibregl.Popup({
                              closeButton: true,
                              closeOnClick: true,
                           })
                              .setLngLat(e.lngLat)
                              .setHTML(
                                 `
                              <div style="min-width:220px">
                                 <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                                    <div>
                                       <div><b style="color:${classification.color}">${classification.label}</b></div>
                                       <div style="font-size:12px;color:#666">NDVI: ${ndvi.toFixed(3)}</div>
                                    </div>
                                 </div>
                                 <div style="background:${classification.color}20;padding:6px;border-radius:4px;margin-bottom:8px">
                                    <div style="font-size:12px;font-weight:500">Estado da Vegetação</div>
                                    <div style="font-size:11px">${getVegetationDescription(classification.level)}</div>
                                    ${p.distance_to_river_m ? `<div style="font-size:10px;color:#666;margin-top:4px">📏 ${Math.round(p.distance_to_river_m)}m do rio</div>` : ""}
                                 </div>
                                 <div style="font-size:10px;color:#888;border-top:1px solid #eee;padding-top:6px">
                                    📍 ${f.geometry.coordinates[1].toFixed(6)}, ${f.geometry.coordinates[0].toFixed(6)}
                                    
                                 </div>
                             </div>
                           `
                              )
                              .addTo(mapRef.current);

                           // Zoom removido - apenas popup
                        }
                     );
                  };

                  // Função para descrição da vegetação
                  const getVegetationDescription = (level) => {
                     const descriptions = {
                        water: "Water area or exposed soil",
                        critical: "Severely degraded or absent vegetation",
                        severe:
                           "Very damaged vegetation, needs urgent intervention",
                        moderate: "Partially degraded vegetation",
                        light: "Vegetation with mild stress signs",
                        fair: "Vegetation in regular condition",
                        good: "Healthy and well-developed vegetation",
                        excellent: "Lush and very dense vegetation",
                        // Specific GeoJSON levels
                        very_sparse: "Very sparse vegetation or exposed soil",
                        sparse: "Sparse vegetation in regeneration",
                        dense: "Dense and well-developed vegetation",
                        very_dense: "Very dense and lush vegetation",
                     };
                     return descriptions[level] || "Unclassified state";
                  };

                  // Pontos estáticos - não mudam com zoom
               } else {
                  console.error(
                     `❌ Erro ao carregar pontos críticos: ${criticalRes.status} ${criticalRes.statusText}`
                  );
                  // Definir pontos vazios para evitar erro
                  setCriticalPoints([]);
               }
            } catch (error) {
               console.error("❌ Erro ao carregar pontos críticos:", error);
               // Definir pontos vazios para evitar erro
               setCriticalPoints([]);
            }

            setLoaded(true);
         } catch (e) {
            console.error("Erro geral:", e);
         }
      });

      return () => {
         if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
         }
      };
   }, []);

   // Controle de camadas
   useEffect(() => {
      if (!mapRef.current) return;
      if (mapRef.current.getLayer("osm")) {
         mapRef.current.setLayoutProperty(
            "osm",
            "visibility",
            baseLayer === "osm" ? "visible" : "none"
         );
      }
      if (mapRef.current.getLayer("sat")) {
         mapRef.current.setLayoutProperty(
            "sat",
            "visibility",
            baseLayer === "sat" ? "visible" : "none"
         );
      }
   }, [baseLayer]);

   // Função de busca de localidades
   const searchLocations = async (query) => {
      if (!query.trim()) {
         setSearchResults([]);
         setShowSearchResults(false);
         return;
      }

      setIsSearching(true);
      try {
         // Usar Nominatim (OpenStreetMap) para busca APENAS de municípios
         const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=br&addressdetails=1&extratags=1&namedetails=1&class=boundary&type=administrative&admin_level=8`;
         const response = await fetch(url);
         const results = await response.json();

         // Filtrar apenas municípios (admin_level=8 no Brasil)
         const filteredResults = results
            .filter((result) => {
               const address = result.address || {};
               const adminLevel = result.address?.admin_level;

               // Garantir que é um município (admin_level=8 no Brasil)
               return (
                  adminLevel === 8 ||
                  (result.class === "boundary" &&
                     result.type === "administrative") ||
                  (address.municipality && address.state)
               );
            })
            .sort((a, b) => {
               // Ordenar por importância (maior importância primeiro)
               return (b.importance || 0) - (a.importance || 0);
            })
            .slice(0, 5); // Limitar a 5 resultados

         const formattedResults = filteredResults.map((result) => {
            // Extrair informações do município
            const address = result.address || {};
            const municipality =
               address.municipality || address.city || address.town;
            const state = address.state;
            const stateCode = address.state_code;

            // Criar nome do município
            let displayName = municipality;
            if (state) {
               displayName = `${municipality}, ${state}`;
            }

            return {
               id: result.place_id,
               name: displayName,
               fullName: result.display_name,
               lat: parseFloat(result.lat),
               lon: parseFloat(result.lon),
               municipality: municipality,
               state: state,
               stateCode: stateCode,
               importance: result.importance,
            };
         });

         setSearchResults(formattedResults);
         setShowSearchResults(true);
      } catch (error) {
         console.error("Erro na busca:", error);
         setSearchResults([]);
      } finally {
         setIsSearching(false);
      }
   };

   // Debounce para busca
   useEffect(() => {
      const timeoutId = setTimeout(() => {
         if (searchQuery.trim()) {
            searchLocations(searchQuery);
         } else {
            setSearchResults([]);
            setShowSearchResults(false);
         }
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [searchQuery]);

   // Função para navegar para localização
   const navigateToLocation = (result) => {
      if (mapRef.current) {
         // Primeiro definir a região selecionada
         setSelectedRegion(result);
         setSearchQuery(result.name);

         // Depois navegar no mapa
         mapRef.current.flyTo({
            center: [result.lon, result.lat],
            zoom: 13,
            duration: 2000,
         });

         // Por último fechar o modal
         setShowSearchResults(false);
      }
   };

   // Função para limpar seleção da região
   const clearSelectedRegion = () => {
      setSelectedRegion(null);
      setSearchQuery("");
   };

   // Fechar resultados da busca ao clicar fora
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (showSearchResults && !event.target.closest(".search-container")) {
            setShowSearchResults(false);
         }
         if (isFilterOpen && !event.target.closest(".filter-container")) {
            setIsFilterOpen(false);
         }
         if (isSelectionOpen && !event.target.closest(".selection-container")) {
            setIsSelectionOpen(false);
         }
         if (isStatsOpen && !event.target.closest(".stats-container")) {
            setIsStatsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [showSearchResults, isFilterOpen, isSelectionOpen, isStatsOpen]);

   // Funções para filtros e seleção de pontos críticos
   const getFilteredPoints = () => {
      if (activeFilter === "all") {
         // Todas = Críticos da região + Meus acompanhamentos (união)
         const watchSet = new Set(watchlist);
         const resultMap = new Map();
         for (const point of criticalPoints) {
            const id =
               point.properties.id || point.geometry.coordinates.join(",");
            if (point.properties.severity === "critical" || watchSet.has(id)) {
               resultMap.set(id, point);
            }
         }
         return Array.from(resultMap.values());
      }

      if (activeFilter === "watchlist") {
         const watchSet = new Set(watchlist);
         return criticalPoints.filter((point) => {
            const pointId =
               point.properties.id || point.geometry.coordinates.join(",");
            return watchSet.has(pointId);
         });
      }

      return criticalPoints.filter((point) => {
         const severity = point.properties.severity;
         switch (activeFilter) {
            case "critical":
               return severity === "critical";
            default:
               return true;
         }
      });
   };

   const handleSelectAllPoints = () => {
      const filteredPoints = getFilteredPoints();
      const allSelected = filteredPoints.every((point) =>
         selectedPoints.includes(
            point.properties.id || point.geometry.coordinates.join(",")
         )
      );

      if (allSelected) {
         // Desmarcar todos os pontos filtrados
         const filteredIds = filteredPoints.map(
            (point) =>
               point.properties.id || point.geometry.coordinates.join(",")
         );
         setSelectedPoints(
            selectedPoints.filter((id) => !filteredIds.includes(id))
         );
      } else {
         // Marcar todos os pontos filtrados
         const filteredIds = filteredPoints.map(
            (point) =>
               point.properties.id || point.geometry.coordinates.join(",")
         );
         setSelectedPoints([...new Set([...selectedPoints, ...filteredIds])]);
      }
   };

   const handlePointSelection = (point) => {
      const pointId =
         point.properties.id || point.geometry.coordinates.join(",");
      if (selectedPoints.includes(pointId)) {
         setSelectedPoints(selectedPoints.filter((id) => id !== pointId));
      } else {
         setSelectedPoints([...selectedPoints, pointId]);
      }
   };

   // Ações por card (um único ponto)
   const handleRegisterPhotoForPoint = (point) => {
      const pointId =
         point.properties.id || point.geometry.coordinates.join(",");
      const description = window.prompt(
         "Descrição (opcional) para a foto deste ponto:",
         ""
      );
      if (description === null) return;
      setPendingActionDescription(description || "");
      setPendingActionTargets([pointId]);
      actionFileInputRef.current?.click();
   };

   const handleRegisterActionForPoint = (point) => {
      const pointId =
         point.properties.id || point.geometry.coordinates.join(",");
      const description = window.prompt("Descreva a ação realizada:", "");
      if (description === null) return;
      const timestamp = new Date().toISOString();
      try {
         const existing = JSON.parse(
            localStorage.getItem("orbee-actions") || "[]"
         );
         const pt = point;
         const record = {
            kind: "action",
            pointId,
            coords: pt?.geometry?.coordinates || null,
            severity: pt?.properties?.severity || null,
            ndvi: pt?.properties?.ndvi ?? null,
            description: description || "",
            files: [],
            timestamp,
         };
         localStorage.setItem(
            "orbee-actions",
            JSON.stringify([...existing, record])
         );
         alert("Ação registrada para 1 ponto.");
      } catch (err) {
         console.error("Erro ao registrar ação:", err);
         alert("Não foi possível salvar a ação.");
      }
   };

   const handleAddToWatchlistForPoint = (point) => {
      const pointId =
         point.properties.id || point.geometry.coordinates.join(",");
      try {
         const existing = new Set(watchlist);
         existing.add(pointId);
         const updated = Array.from(existing);
         setWatchlist(updated);
         localStorage.setItem("orbee-watchlist", JSON.stringify(updated));
         setShowAcompanhamentos(true);
         alert("Ponto adicionado aos acompanhamentos.");
      } catch (err) {
         console.error("Erro ao salvar acompanhamentos:", err);
      }
   };

   // Registrar foto para pontos selecionados (abre seletor de arquivos)
   const handleRegisterPhoto = () => {
      if (selectedPoints.length === 0) return;
      const description = window.prompt(
         "Descrição da ação/foto (opcional):",
         ""
      );
      if (description === null) return; // cancelou
      setPendingActionDescription(description || "");
      setPendingActionTargets(selectedPoints);
      if (actionFileInputRef.current) {
         actionFileInputRef.current.click();
      }
      setIsSelectionOpen(false);
   };

   const handleActionFilesSelected = (e) => {
      const files = Array.from(e.target.files || []);
      const timestamp = new Date().toISOString();
      try {
         const existing = JSON.parse(
            localStorage.getItem("orbee-actions") || "[]"
         );
         const pointRecords = pendingActionTargets.map((id) => {
            const pt = criticalPoints.find(
               (p) =>
                  (p.properties.id || p.geometry.coordinates.join(",")) === id
            );
            return {
               kind: "photo",
               pointId: id,
               coords: pt?.geometry?.coordinates || null,
               severity: pt?.properties?.severity || null,
               ndvi: pt?.properties?.ndvi ?? null,
               description: pendingActionDescription,
               files: files.map((f) => ({
                  name: f.name,
                  size: f.size,
                  type: f.type,
               })),
               timestamp,
            };
         });
         localStorage.setItem(
            "orbee-actions",
            JSON.stringify([...existing, ...pointRecords])
         );
         alert(`Registro salvo para ${pointRecords.length} ponto(s).`);
      } catch (err) {
         console.error("Erro salvando ação/foto:", err);
         alert("Não foi possível salvar o registro localmente.");
      } finally {
         setPendingActionDescription("");
         setPendingActionTargets([]);
         e.target.value = "";
      }
   };

   // Registrar ação (texto) para pontos selecionados
   const handleRegisterAction = () => {
      if (selectedPoints.length === 0) return;
      const description = window.prompt("Descreva a ação realizada:", "");
      if (description === null) return; // cancelado
      const timestamp = new Date().toISOString();
      try {
         const existing = JSON.parse(
            localStorage.getItem("orbee-actions") || "[]"
         );
         const pointRecords = selectedPoints.map((id) => {
            const pt = criticalPoints.find(
               (p) =>
                  (p.properties.id || p.geometry.coordinates.join(",")) === id
            );
            return {
               kind: "action",
               pointId: id,
               coords: pt?.geometry?.coordinates || null,
               severity: pt?.properties?.severity || null,
               ndvi: pt?.properties?.ndvi ?? null,
               description: description || "",
               files: [],
               timestamp,
            };
         });
         localStorage.setItem(
            "orbee-actions",
            JSON.stringify([...existing, ...pointRecords])
         );
         alert(`Ação registrada para ${pointRecords.length} ponto(s).`);
      } catch (err) {
         console.error("Erro ao registrar ação:", err);
         alert("Não foi possível salvar a ação.");
      } finally {
         setIsSelectionOpen(false);
      }
   };

   // Adicionar pontos selecionados à lista de acompanhamento
   const handleAddToWatchlist = () => {
      if (selectedPoints.length === 0) return;
      try {
         const existing = new Set(watchlist);
         selectedPoints.forEach((id) => existing.add(id));
         const updated = Array.from(existing);
         setWatchlist(updated);
         localStorage.setItem("orbee-watchlist", JSON.stringify(updated));
         alert(
            `${selectedPoints.length} ponto(s) adicionado(s) aos acompanhamentos.`
         );
         setShowAcompanhamentos(true);
      } catch (err) {
         console.error("Erro ao salvar acompanhamentos:", err);
      } finally {
         setIsSelectionOpen(false);
      }
   };

   // Função para calcular número de colunas baseado na largura do painel
   const calculateGridColumns = (width) => {
      // Largura mínima do card: 200px
      // Padding: 24px (12px de cada lado)
      const availableWidth = width - 24;
      const cardMinWidth = 300;
      const gap = 12; // gap entre cards

      // Calcular quantos cards cabem
      let columns = Math.floor(availableWidth / (cardMinWidth + gap));

      // Garantir pelo menos 1 coluna e no máximo 4
      columns = Math.max(1, Math.min(4, columns));

      return columns;
   };

   // Calcular colunas baseado na largura atual
   const gridColumns = calculateGridColumns(panelWidth);

   // Funções para redimensionamento horizontal
   const handleResizeStart = (e) => {
      e.preventDefault();
      setIsResizing(true);
      setResizeStartX(e.clientX);
      setResizeStartWidth(panelWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
   };

   const handleResizeMove = (e) => {
      if (!isResizing) return;
      e.preventDefault();

      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(340, Math.min(800, resizeStartWidth + deltaX)); // Min: 340px, Max: 800px
      setPanelWidth(newWidth);

      // Adicionar feedback visual durante o redimensionamento
      if (newWidth <= 300) {
         document.body.style.cursor = "ew-resize";
      } else if (newWidth >= 750) {
         document.body.style.cursor = "ew-resize";
      }
   };

   const handleResizeEnd = () => {
      if (!isResizing) return;

      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      // Salvar largura no localStorage
      localStorage.setItem("orbee-panel-width", panelWidth.toString());
   };

   // Adicionar event listeners para redimensionamento
   useEffect(() => {
      if (isResizing) {
         document.addEventListener("mousemove", handleResizeMove);
         document.addEventListener("mouseup", handleResizeEnd);
         return () => {
            document.removeEventListener("mousemove", handleResizeMove);
            document.removeEventListener("mouseup", handleResizeEnd);
         };
      }
   }, [isResizing, resizeStartX, resizeStartWidth, panelWidth]);

   // Funções para redimensionamento da seção de acompanhamentos
   const handleAcompanhamentosResizeStart = (e) => {
      e.preventDefault();
      setIsAcompanhamentosResizing(true);
      setAcompanhamentosResizeStartX(e.clientX);
      setAcompanhamentosResizeStartWidth(acompanhamentosWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
   };

   const handleAcompanhamentosResizeMove = (e) => {
      if (!isAcompanhamentosResizing) return;
      e.preventDefault();

      const deltaX = e.clientX - acompanhamentosResizeStartX;
      const newWidth = Math.max(
         250,
         Math.min(600, acompanhamentosResizeStartWidth + deltaX)
      );
      setAcompanhamentosWidth(newWidth);

      // Adicionar feedback visual durante o redimensionamento
      if (newWidth <= 280) {
         document.body.style.cursor = "ew-resize";
      } else if (newWidth >= 550) {
         document.body.style.cursor = "ew-resize";
      }
   };

   const handleAcompanhamentosResizeEnd = () => {
      if (!isAcompanhamentosResizing) return;

      setIsAcompanhamentosResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      // Salvar largura no localStorage
      localStorage.setItem(
         "orbee-acompanhamentos-width",
         acompanhamentosWidth.toString()
      );
   };

   // Adicionar event listeners para redimensionamento de acompanhamentos
   // Carregar observações do usuário
   useEffect(() => {
      if (isAuthenticated) {
         loadUserObservations();
      }
   }, [isAuthenticated]);

   useEffect(() => {
      if (isAcompanhamentosResizing) {
         document.addEventListener(
            "mousemove",
            handleAcompanhamentosResizeMove
         );
         document.addEventListener("mouseup", handleAcompanhamentosResizeEnd);
         return () => {
            document.removeEventListener(
               "mousemove",
               handleAcompanhamentosResizeMove
            );
            document.removeEventListener(
               "mouseup",
               handleAcompanhamentosResizeEnd
            );
         };
      }
   }, [
      isAcompanhamentosResizing,
      acompanhamentosResizeStartX,
      acompanhamentosResizeStartWidth,
      acompanhamentosWidth,
   ]);

   // Função para criar card de ponto crítico
   const createCriticalPointCard = (point, index) => {
      const props = point.properties;
      const coords = point.geometry.coordinates;
      const pointId = props.id || coords.join(",");

      // Determinar cor baseada na severidade
      const getColorClasses = (severity) => {
         switch (severity) {
            case "critical":
               return {
                  border: "border-red-400/20 hover:border-red-400/40",
                  gradient: "from-red-500/10",
                  shadow: "hover:shadow-red-500/25",
                  badge: "bg-red-500/20 text-red-600",
                  text: "text-red-600",
                  indicator: "bg-red-500/20",
               };
            case "moderate":
               return {
                  border: "border-orange-400/20 hover:border-orange-400/40",
                  gradient: "from-orange-500/10",
                  shadow: "hover:shadow-orange-500/25",
                  badge: "bg-orange-500/20 text-orange-600",
                  text: "text-orange-600",
                  indicator: "bg-orange-500/20",
               };
            case "healthy":
               return {
                  border: "border-green-400/20 hover:border-green-400/40",
                  gradient: "from-green-500/10",
                  shadow: "hover:shadow-green-500/25",
                  badge: "bg-green-500/20 text-green-600",
                  text: "text-green-600",
                  indicator: "bg-green-500/20",
               };
            default:
               return {
                  border: "border-gray-400/20 hover:border-gray-400/40",
                  gradient: "from-gray-500/10",
                  shadow: "hover:shadow-gray-500/25",
                  badge: "bg-gray-500/20 text-gray-600",
                  text: "text-gray-600",
                  indicator: "bg-gray-500/20",
               };
         }
      };

      const colors = getColorClasses(props.severity);
      const isSelected = selectedPoint === index;
      const isPointSelected = selectedPoints.includes(pointId);

      // Determinar tendência baseada no NDVI
      const getTrend = () => {
         const ndviValue = parseFloat(props.ndvi || 0);
         if (ndviValue >= 0.6) return "improving";
         if (ndviValue <= 0.3) return "declining";
         return "stable";
      };

      const trend = getTrend();

      return (
         <div
            key={index}
            className={`group relative overflow-hidden rounded-lg sm:rounded-xl border ${
               colors.border
            } bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-lg sm:shadow-xl transition-all duration-300 ease-in-out ${
               colors.shadow
            } cursor-pointer hover:-translate-y-1 hover:bg-white/95 ${
               isSelected ? "scale-105 ring-2 ring-blue-400/50" : ""
            } ${
               isPointSelected ? "ring-2 ring-blue-500/50 bg-blue-50/50" : ""
            } h-fit`}
            onClick={() => {
               setSelectedPoint(isSelected ? null : index);
               if (
                  mapRef.current &&
                  Array.isArray(coords) &&
                  coords.length === 2
               ) {
                  try {
                     mapRef.current.flyTo({
                        center: [coords[0], coords[1]],
                        zoom: 16,
                        speed: 1.2,
                        curve: 1.42,
                        essential: true,
                     });
                  } catch {}
               }
            }}
         >
            <div
               className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            ></div>

            <div className="relative z-10">
               <div className="mb-2 sm:mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2">
                     <input
                        type="checkbox"
                        checked={isPointSelected}
                        onChange={(e) => {
                           e.stopPropagation();
                           handlePointSelection(point);
                        }}
                        className="h-3 w-3 sm:h-4 sm:w-4 accent-[#2f4538] cursor-pointer"
                        title="Selecionar ponto"
                        onClick={(e) => e.stopPropagation()}
                     />
                     <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                        {`Ponto #${props.id ?? index + 1}`}
                     </h4>
                  </div>
                  <span
                     className={`rounded-full ${colors.badge} px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold`}
                  >
                     {props.severity === "critical"
                        ? "Crítico"
                        : props.severity === "moderate"
                          ? "Moderado"
                          : "Saudável"}
                  </span>
               </div>

               <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs text-gray-600">
                  <div className="flex justify-between items-center">
                     <span>NDVI:</span>
                     <span className={`font-medium ${colors.text}`}>
                        {props.ndvi?.toFixed(3) || "N/A"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Nível:</span>
                     <span className={`font-medium ${colors.text}`}>
                        {props.label || "N/A"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Distância do rio:</span>
                     <span className="text-gray-500 font-mono">
                        {props.distance_to_river_m
                           ? `${props.distance_to_river_m}m`
                           : "N/A"}
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Coordenadas:</span>
                     <span className="text-gray-500 font-mono text-[10px]">
                        {coords[1].toFixed(4)}, {coords[0].toFixed(4)}
                     </span>
                  </div>
               </div>

               {/* Evolução NDVI */}
               <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                     <span className="text-gray-700 text-[10px] sm:text-xs font-medium">
                        Tendência NDVI
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-[10px] sm:text-xs">
                        Status:
                     </span>
                     <div className="flex items-center gap-1">
                        {trend === "improving" ? (
                           <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                        ) : trend === "declining" ? (
                           <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" />
                        ) : (
                           <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-400" />
                        )}
                        <span
                           className={`text-[10px] sm:text-xs ${
                              trend === "improving"
                                 ? "text-green-600"
                                 : trend === "declining"
                                   ? "text-red-600"
                                   : "text-gray-500"
                           }`}
                        >
                           {trend === "improving"
                              ? "Melhorando"
                              : trend === "declining"
                                ? "Declinando"
                                : "Estável"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Informações adicionais */}
               <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                  {/* Ações rápidas */}
                  <div className="flex items-center justify-between gap-2">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           handleRegisterPhotoForPoint(point);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] sm:text-xs text-gray-700 hover:bg-gray-50"
                        title="Registrar foto"
                     >
                        <Camera className="h-3 w-3 text-emerald-600" />
                        Foto
                     </button>
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           handleRegisterActionForPoint(point);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] sm:text-xs text-gray-700 hover:bg-gray-50"
                        title="Registrar ação"
                     >
                        <Leaf className="h-3 w-3 text-green-700" />
                        Ação
                     </button>
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           handleAddToWatchlistForPoint(point);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] sm:text-xs text-gray-700 hover:bg-gray-50"
                        title="Acompanhar"
                     >
                        <Bookmark className="h-3 w-3 text-indigo-600" />
                        Acompanhar
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className="h-screen w-full relative">
         <div ref={containerRef} className="w-full h-full absolute" />
         <input
            ref={actionFileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleActionFilesSelected}
         />

         {/* Header da Plataforma */}
         <div className="absolute top-0 left-0 right-0 z-20">
            <div className="px-4 py-3 flex items-center justify-between ">
               {/* Logo + Botão Pontos Críticos */}
               <div className="flex items-center gap-2">
                  <Link
                     to="/"
                     className="flex items-center gap-1 bg-white p-2 rounded-lg h-10 border border-[#2f4538]"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-bee-icon lucide-bee"
                     >
                        <path d="m8 2 1.88 1.88" stroke="#2f4538" />
                        <path d="M14.12 3.88 16 2" stroke="#2f4538" />
                        <path d="M9 7V6a3 3 0 1 1 6 0v1" stroke="#2f4538" />
                        <path
                           d="M5 7a3 3 0 1 0 2.2 5.1C9.1 10 12 7 12 7s2.9 3 4.8 5.1A3 3 0 1 0 19 7Z"
                           stroke="#2f4538"
                        />
                        <path d="M7.56 12h8.87" stroke="#2f4538" />
                        <path d="M7.5 17h9" stroke="#2f4538" />
                        <path
                           d="M15.5 10.7c.9.9 1.4 2.1 1.5 3.3 0 5.8-5 8-5 8s-5-2.2-5-8c.1-1.2.6-2.4 1.5-3.3"
                           stroke="#2f4538"
                        />
                     </svg>
                     <span
                        className="text-xl font-medium text-[#2f4538]"
                        style={{ fontFamily: '"Fraunces", serif' }}
                     >
                        orbee
                     </span>
                  </Link>
                  <button
                     onClick={() => setShowCards(true)}
                     className="h-10 px-4 bg-red-50 border border-red-300 text-red-700 rounded-full shadow-sm hover:bg-red-100 hover:border-red-400 transition-colors duration-200 flex items-center gap-2 justify-center"
                     title="Abrir pontos críticos"
                  >
                     <MapPin className="h-4 w-4 text-red-700" />
                     <span className="text-sm font-semibold hidden sm:inline">
                        Pontos críticos
                     </span>
                  </button>
               </div>
            </div>
         </div>

         {/* Atalhos do Mapa */}
         <MapShortcuts
            mapRef={mapRef}
            baseLayer={baseLayer}
            setBaseLayer={setBaseLayer}
            criticalPoints={criticalPoints}
            setShowCards={setShowCards}
            showCards={showCards}
            setShowAcompanhamentos={setShowAcompanhamentos}
            showAcompanhamentos={showAcompanhamentos}
            // Props para busca
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            showSearchResults={showSearchResults}
            setShowSearchResults={setShowSearchResults}
            isSearching={isSearching}
            navigateToLocation={navigateToLocation}
            selectedRegion={selectedRegion}
            clearSelectedRegion={clearSelectedRegion}
         />

         {/* Painéis Colapsados Lado a Lado - Parte Inferior Esquerda */}
         <div className="absolute left-2 bottom-2 sm:bottom-4 z-10 flex gap-2">
            {/* Painel de Acompanhamentos */}
            <div>
               {/* Painel Expandido de Acompanhamentos */}
               {showAcompanhamentos && (
                  <div
                     className="mb-2 animate-in slide-in-from-left duration-300 h-[calc(100vh-100px)] flex flex-col relative"
                     style={{ width: `${acompanhamentosWidth}px` }}
                  >
                     {/* Header dos Acompanhamentos */}
                     <div className="bg-white/95 backdrop-blur-sm rounded-t-xl border border-gray-200 px-3 sm:px-4 py-3 shadow-lg flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                                 Meus Acompanhamentos
                              </h3>
                           </div>
                           <button
                              onClick={() => setShowAcompanhamentos(false)}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Fechar acompanhamentos"
                           >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                           </button>
                        </div>
                     </div>

                     {/* Área Scrollável dos Acompanhamentos */}
                     <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm rounded-b-xl border border-gray-200 border-t-0 p-3 sm:p-4 shadow-lg">
                        <div className="space-y-3">
                           {/* Card de Acompanhamento Exemplo */}
                           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-2">
                                    <Bookmark className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-800">
                                       Mata Ciliar - RS
                                    </span>
                                 </div>
                                 <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    Ativo
                                 </span>
                              </div>
                              <div className="text-xs text-blue-700 space-y-1">
                                 <div>• 15 pontos críticos identificados</div>
                                 <div>
                                    • Última análise:{" "}
                                    {new Date().toLocaleDateString()}
                                 </div>
                                 <div>• Próxima verificação: em 3 dias</div>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                 <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                                    <Eye className="h-3 w-3" />
                                    Visualizar
                                 </button>
                                 <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                                    <Clock className="h-3 w-3" />
                                    Histórico
                                 </button>
                              </div>
                           </div>

                           {/* Card de Acompanhamento Exemplo 2 */}
                           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-2">
                                    <Bookmark className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-800">
                                       Área de Preservação
                                    </span>
                                 </div>
                                 <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    Monitorando
                                 </span>
                              </div>
                              <div className="text-xs text-green-700 space-y-1">
                                 <div>• 8 pontos em recuperação</div>
                                 <div>• Última análise: há 2 dias</div>
                                 <div>• Tendência: Melhorando</div>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                 <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors">
                                    <Eye className="h-3 w-3" />
                                    Visualizar
                                 </button>
                                 <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                                    <Clock className="h-3 w-3" />
                                    Histórico
                                 </button>
                              </div>
                           </div>

                           {/* Card de Acompanhamento Exemplo 3 */}
                           <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-4 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-2">
                                    <Bookmark className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-semibold text-orange-800">
                                       Zona de Risco
                                    </span>
                                 </div>
                                 <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    Alerta
                                 </span>
                              </div>
                              <div className="text-xs text-orange-700 space-y-1">
                                 <div>• 23 pontos críticos</div>
                                 <div>• Última análise: hoje</div>
                                 <div>• Ação necessária: Urgente</div>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                 <button className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 transition-colors">
                                    <Eye className="h-3 w-3" />
                                    Visualizar
                                 </button>
                                 <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                                    <Clock className="h-3 w-3" />
                                    Histórico
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Handle de Redimensionamento */}
                     <div
                        className="absolute right-0 top-0 bottom-0 cursor-ew-resize"
                        onMouseDown={handleAcompanhamentosResizeStart}
                        title="Arraste para redimensionar"
                     >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gray-300 group-hover:bg-blue-500 rounded-l-sm transition-colors duration-200 flex items-center justify-center">
                           <div className="w-0.5 h-4 bg-white/60 rounded-full"></div>
                        </div>
                        {isAcompanhamentosResizing && (
                           <>
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                              {/* Indicador de largura durante redimensionamento */}
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                                 {acompanhamentosWidth}px
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* Painel de Pontos Críticos */}
            <div>
               {/* Painel Expandido */}
               {showCards && (
                  <div
                     className="mb-2 animate-in slide-in-from-left duration-300 h-[calc(100vh-100px)] flex flex-col relative z-[1000] overflow-visible"
                     style={{ width: `${panelWidth}px` }}
                  >
                     {/* Header dos Cards */}
                     <div className="bg-white/95 backdrop-blur-sm rounded-t-xl border border-gray-200 px-3 sm:px-4 py-3 flex-shrink-0 relative z-50 overflow-visible">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
                              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                                 Pontos Críticos ({criticalPoints.length})
                              </h3>
                           </div>
                           <button
                              onClick={() => setShowCards(false)}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              title="Fechar cards"
                           >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                           </button>
                        </div>

                        {/* Filtros e Seleção */}
                        <div className="flex items-center gap-2">
                           {(() => {
                              const filteredPoints = getFilteredPoints();

                              // Conjuntos de IDs para contagens consistentes
                              const toId = (p) =>
                                 p.properties.id ||
                                 p.geometry.coordinates.join(",");
                              const watchSet = new Set(watchlist);

                              const criticalIdSet = new Set(
                                 criticalPoints
                                    .filter(
                                       (p) =>
                                          p.properties.severity === "critical"
                                    )
                                    .map((p) => toId(p))
                              );

                              const watchlistIdSet = new Set(
                                 criticalPoints
                                    .filter((p) => watchSet.has(toId(p)))
                                    .map((p) => toId(p))
                              );

                              const unionAllIdSet = new Set([
                                 ...criticalIdSet,
                                 ...watchlistIdSet,
                              ]);

                              const totalCritical = criticalIdSet.size;
                              const totalWatchlist = watchlistIdSet.size;
                              const totalAll = unionAllIdSet.size;

                              const currentLabel =
                                 activeFilter === "all"
                                    ? `Todas (${totalAll})`
                                    : activeFilter === "critical"
                                      ? `Críticos (${totalCritical})`
                                      : `Meus acompanhamentos (${totalWatchlist})`;

                              return (
                                 <div className="relative inline-flex items-center gap-2 z-50">
                                    {/* Filtro */}
                                    <div className="relative inline-block text-left filter-container">
                                       <button
                                          onClick={() =>
                                             setIsFilterOpen((v) => !v)
                                          }
                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 h-8 sm:h-9 text-[10px] sm:text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                                       >
                                          <span className="flex items-center gap-1">
                                             {activeFilter === "all" && (
                                                <Globe className="h-3 w-3" />
                                             )}
                                             {activeFilter === "critical" && (
                                                <Activity className="h-3 w-3" />
                                             )}
                                             {activeFilter === "watchlist" && (
                                                <Bookmark className="h-3 w-3" />
                                             )}
                                             <span className="hidden sm:inline">
                                                {activeFilter === "all"
                                                   ? "Todas"
                                                   : activeFilter === "critical"
                                                     ? "Críticos"
                                                     : "Meus acompanhamentos"}
                                             </span>
                                          </span>
                                          <span className="rounded bg-gray-100 px-1.5 py-0.5 leading-none text-[9px] sm:text-xs text-gray-600">
                                             {activeFilter === "all"
                                                ? totalAll
                                                : activeFilter === "critical"
                                                  ? totalCritical
                                                  : totalWatchlist}
                                          </span>
                                          <svg
                                             className="ml-1 h-2 w-2 text-gray-500"
                                             viewBox="0 0 20 20"
                                             fill="currentColor"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                       </button>
                                       {isFilterOpen && (
                                          <div className="absolute left-0 z-[9999] mt-2 w-56 origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
                                             <div className="py-1 text-xs text-gray-700">
                                                <button
                                                   onClick={() => {
                                                      setActiveFilter("all");
                                                      setIsFilterOpen(false);
                                                   }}
                                                   className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "all" ? "bg-[#2f4538]/10" : ""}`}
                                                >
                                                   <span className="flex items-center gap-2">
                                                      <Globe className="h-3 w-3" />
                                                      Todas
                                                   </span>
                                                   <span className="text-gray-500">
                                                      {totalAll}
                                                   </span>
                                                </button>
                                                <button
                                                   onClick={() => {
                                                      setActiveFilter(
                                                         "critical"
                                                      );
                                                      setIsFilterOpen(false);
                                                   }}
                                                   className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "critical" ? "bg-red-500/10" : ""}`}
                                                >
                                                   <span className="flex items-center gap-2">
                                                      <Activity className="h-3 w-3" />
                                                      Críticos
                                                   </span>
                                                   <span className="text-gray-500">
                                                      {totalCritical}
                                                   </span>
                                                </button>
                                                <button
                                                   onClick={() => {
                                                      setActiveFilter(
                                                         "watchlist"
                                                      );
                                                      setIsFilterOpen(false);
                                                   }}
                                                   className={`flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 ${activeFilter === "watchlist" ? "bg-indigo-500/10" : ""}`}
                                                >
                                                   <span className="flex items-center gap-2">
                                                      <Bookmark className="h-3 w-3" />
                                                      Meus acompanhamentos
                                                   </span>
                                                   <span className="text-gray-500">
                                                      {totalWatchlist}
                                                   </span>
                                                </button>
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    {/* Botão de Estatísticas */}
                                    <div className="relative stats-container">
                                       <button
                                          onClick={() =>
                                             setIsStatsOpen((v) => !v)
                                          }
                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 h-8 sm:h-9 text-[10px] sm:text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                                          title="Estatísticas dos pontos críticos"
                                       >
                                          <BarChart3 className="h-3 w-3" />
                                          <span className="hidden sm:inline">
                                             Estatísticas
                                          </span>
                                       </button>
                                       {isStatsOpen && (
                                          <div className="absolute left-0 z-[9999] mt-2 w-72 origin-top-left rounded-lg border border-gray-200 bg-white shadow-lg p-3">
                                             {(() => {
                                                const watchSetLocal = new Set(
                                                   watchlist
                                                );
                                                // Conjunto "todas" conforme regra atual (união críticos + watchlist)
                                                const allPoints =
                                                   criticalPoints.filter(
                                                      (p) => {
                                                         const id =
                                                            p.properties.id ||
                                                            p.geometry.coordinates.join(
                                                               ","
                                                            );
                                                         return (
                                                            p.properties
                                                               .severity ===
                                                               "critical" ||
                                                            watchSetLocal.has(
                                                               id
                                                            )
                                                         );
                                                      }
                                                   );
                                                const regionCritical =
                                                   criticalPoints.filter(
                                                      (p) =>
                                                         p.properties
                                                            .severity ===
                                                         "critical"
                                                   );

                                                const ndvis = regionCritical
                                                   .map(
                                                      (p) => p.properties.ndvi
                                                   )
                                                   .filter(
                                                      (v) =>
                                                         typeof v === "number"
                                                   );
                                                const ndviAvg = ndvis.length
                                                   ? ndvis.reduce(
                                                        (a, b) => a + b,
                                                        0
                                                     ) / ndvis.length
                                                   : null;
                                                const ndviMin = ndvis.length
                                                   ? Math.min(...ndvis)
                                                   : null;
                                                const ndviMax = ndvis.length
                                                   ? Math.max(...ndvis)
                                                   : null;
                                                const dists = regionCritical
                                                   .map(
                                                      (p) =>
                                                         p.properties
                                                            .distance_to_river_m
                                                   )
                                                   .filter(
                                                      (v) =>
                                                         typeof v === "number"
                                                   );
                                                const distAvg = dists.length
                                                   ? Math.round(
                                                        dists.reduce(
                                                           (a, b) => a + b,
                                                           0
                                                        ) / dists.length
                                                     )
                                                   : null;

                                                const meta =
                                                   (window.criticalGeoData &&
                                                      window.criticalGeoData
                                                         .metadata) ||
                                                   {};
                                                const satName =
                                                   meta.sensor ||
                                                   meta.satellite ||
                                                   meta.platform ||
                                                   "Desconhecido";
                                                const satDate =
                                                   meta.date ||
                                                   meta.acquisition_date ||
                                                   meta.collection_date ||
                                                   null;
                                                const satNote =
                                                   meta.note ||
                                                   meta.notes ||
                                                   null;

                                                return (
                                                   <div className="text-[11px] sm:text-xs text-gray-700 space-y-2">
                                                      <div className="font-semibold text-gray-900">
                                                         Resumo da região
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-2">
                                                         <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                                                            <div className="text-[10px] text-gray-600">
                                                               Críticos (região)
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                               {
                                                                  regionCritical.length
                                                               }
                                                            </div>
                                                         </div>
                                                         <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                                                            <div className="text-[10px] text-gray-600">
                                                               Todas (regra
                                                               atual)
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                               {
                                                                  allPoints.length
                                                               }
                                                            </div>
                                                         </div>
                                                         <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                                                            <div className="text-[10px] text-gray-600">
                                                               NDVI médio
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                               {ndviAvg !== null
                                                                  ? ndviAvg.toFixed(
                                                                       3
                                                                    )
                                                                  : "N/A"}
                                                            </div>
                                                         </div>
                                                         <div className="bg-gray-50 rounded-md p-2 border border-gray-200">
                                                            <div className="text-[10px] text-gray-600">
                                                               NDVI min/max
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                               {ndviMin !== null
                                                                  ? ndviMin.toFixed(
                                                                       3
                                                                    )
                                                                  : "N/A"}{" "}
                                                               /{" "}
                                                               {ndviMax !== null
                                                                  ? ndviMax.toFixed(
                                                                       3
                                                                    )
                                                                  : "N/A"}
                                                            </div>
                                                         </div>
                                                         <div className="bg-gray-50 rounded-md p-2 border border-gray-200 col-span-2">
                                                            <div className="text-[10px] text-gray-600">
                                                               Distância média
                                                               ao rio
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                               {distAvg !== null
                                                                  ? `${distAvg} m`
                                                                  : "N/A"}
                                                            </div>
                                                         </div>
                                                      </div>
                                                      <div className="font-semibold text-gray-900 pt-1">
                                                         Dados do satélite
                                                      </div>
                                                      <div className="space-y-1">
                                                         <div>
                                                            <span className="text-gray-600">
                                                               Harmonized
                                                               Landsat and
                                                               Sentinel-2 (HLS)
                                                            </span>
                                                         </div>
                                                         {satDate && (
                                                            <div>
                                                               <span className="text-gray-600">
                                                                  Data de
                                                                  aquisição:{" "}
                                                               </span>
                                                               <span className="font-medium text-gray-900">
                                                                  {satDate}
                                                               </span>
                                                            </div>
                                                         )}
                                                         {satNote && (
                                                            <div className="text-gray-600">
                                                               {satNote}
                                                            </div>
                                                         )}
                                                      </div>
                                                   </div>
                                                );
                                             })()}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })()}
                        </div>
                     </div>

                     {/* Área Scrollável dos Cards */}
                     <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm rounded-b-xl border border-gray-200 border-t-0 p-3 sm:p-4 shadow-lg">
                        {(() => {
                           if (!selectedRegion) {
                              return (
                                 <div className="text-center text-gray-500 py-8">
                                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">
                                       Busque uma região de interesse para ver
                                       pontos críticos.
                                    </p>
                                    <p className="text-xs mt-1">
                                       Ou abra "Meus acompanhamentos" para seus
                                       pontos salvos.
                                    </p>
                                 </div>
                              );
                           }

                           const filteredPoints = getFilteredPoints();
                           return filteredPoints.length > 0 ? (
                              <div
                                 className="grid gap-3 transition-all duration-300 ease-in-out"
                                 style={{
                                    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                                    gridAutoRows: "minmax(200px, auto)",
                                 }}
                              >
                                 {filteredPoints.map((point, index) =>
                                    createCriticalPointCard(point, index)
                                 )}
                              </div>
                           ) : (
                              <div className="text-center text-gray-500 py-8">
                                 <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                 <p className="text-sm">
                                    {criticalPoints.length === 0
                                       ? "Carregando pontos críticos..."
                                       : `Nenhum ponto ${activeFilter === "all" ? "" : activeFilter === "critical" ? "crítico" : "dos acompanhamentos"} encontrado.`}
                                 </p>
                              </div>
                           );
                        })()}
                     </div>

                     {/* Handle de Redimensionamento */}
                     <div
                        className="absolute right-0 top-0 bottom-0 cursor-ew-resize"
                        onMouseDown={handleResizeStart}
                        title="Arraste para redimensionar"
                     >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gray-300 group-hover:bg-gray-400 rounded-l-sm transition-colors duration-200 flex items-center justify-center">
                           <div className="w-0.5 h-4 bg-white/60 rounded-full"></div>
                        </div>
                        {isResizing && (
                           <>
                              <div className="absolute right-0 top-0 bottom-0"></div>
                              {/* Indicador de largura durante redimensionamento */}
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                                 {panelWidth}px
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
