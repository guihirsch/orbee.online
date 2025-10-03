import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fromUrl as geotiffFromUrl } from "geotiff";
import proj4 from "proj4";
import useAuth from "../hooks/useAuth";
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
} from "lucide-react";

export default function AOIViewer() {
   const mapRef = useRef(null);
   const containerRef = useRef(null);
   const { user } = useAuth();
   const [loaded, setLoaded] = useState(false);
   const [baseLayer, setBaseLayer] = useState("osm");
   const [rgbVisible, setRgbVisible] = useState(false);
   const [rgbAvailable, setRgbAvailable] = useState(false);
   const [legendMinimized, setLegendMinimized] = useState(false);
   const [criticalPoints, setCriticalPoints] = useState([]);
   const [selectedPoint, setSelectedPoint] = useState(null);
   const [showCards, setShowCards] = useState(true);

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

      mapRef.current.addControl(
         new maplibregl.NavigationControl(),
         "top-right"
      );

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
               console.log("🔄 Carregando pontos críticos...");
               const criticalRes = await fetch(
                  "/critical_points_mata_ciliar.geojson"
               );
               if (criticalRes.ok) {
                  const criticalGeo = await criticalRes.json();
                  console.log(
                     `✅ ${criticalGeo.features.length} pontos carregados`
                  );
                  
                  // Armazenar dados globalmente para acesso no useEffect
                  window.criticalGeoData = criticalGeo;
                  
                  // Armazenar pontos críticos no estado para os cards
                  setCriticalPoints(criticalGeo.features);

                  // Função para classificar degradação usando dados REAIS do GeoJSON
                  const classifyDegradation = (feature) => {
                     // Usar propriedades do GeoJSON gerado pelo HLS.ipynb
                     const props = feature.properties;

                     // Se já tem classificação do GeoJSON, usar ela
                     if (props.level && props.color) {
                        // Mapear levels do GeoJSON para levels da função getVegetationDescription
                        const levelMapping = {
                           "very_sparse": "critical",
                           "sparse": "moderate", 
                           "dense": "good",
                           "very_dense": "excellent"
                        };
                        
                        const mappedLevel = levelMapping[props.level] || props.level;
                        
                        return {
                           level: mappedLevel,
                           color: props.color,
                           label: props.label || props.severity || "Não classificado",
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
                           label: "Crítico",
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
                        label: "Saudável",
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

                     console.log(
                        `🎯 Configuração fixa: ${config.minDistance}m distância mínima, todos os críticos visíveis`
                     );

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
                        console.log(
                           `🔴 Críticos incluídos: ${filteredCritical.length}/${critical.length}`
                        );
                     }

                     // MODERADOS: Com limite
                     if (config.showModerate) {
                        const filteredModerate = filterByDistance(
                           moderate,
                           config.minDistance,
                           config.maxPointsPerType.moderate
                        );
                        result = [...result, ...filteredModerate];
                        console.log(
                           `🟡 Moderados incluídos: ${filteredModerate.length}/${moderate.length}`
                        );
                     }

                     // SAUDÁVEIS: Sem limite
                     if (config.showHealthy) {
                        const filteredHealthy = filterByDistance(
                           healthy,
                           config.minDistance,
                           config.maxPointsPerType.healthy
                        );
                        result = [...result, ...filteredHealthy];
                        console.log(
                           `🟢 Saudáveis incluídos: ${filteredHealthy.length}/${healthy.length}`
                        );
                     }

                     console.log(
                        `📊 Total final: ${result.length} pontos (${result.filter((f) => f.properties.severity === "critical").length} críticos, ${result.filter((f) => f.properties.severity === "moderate").length} moderados, ${result.filter((f) => f.properties.severity === "healthy").length} saudáveis)`
                     );

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
                           console.log(
                              `✅ Pin ${pinType.name} carregado (${loadedImages}/${totalImages})`
                           );
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
                        console.log(
                           `🔄 Tentando pin simplificado para ${pinType.name}...`
                        );
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
                        console.log(
                           `🎨 Criando pin ${pinType.name} (${pinType.color}, ${pinType.size}px)`
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
                        console.log(
                           `✅ Todas as ${totalImages} imagens carregadas, criando camada...`
                        );

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
                           console.log(
                              "✅ Camada de símbolos criada com sucesso"
                           );

                           // Criar legenda apenas uma vez, após a camada ser criada
                           createLegend();

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
                                    <span style="font-size:20px">${icons[classification.level]}</span>
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
                                    <br/>🛰️ Fonte: ${p.type || "HLS"} | 📅 ${criticalGeo.metadata?.analysis_date ? new Date(criticalGeo.metadata.analysis_date).toLocaleDateString() : "N/A"}
                                 </div>
                             </div>
                           `
                              )
                              .addTo(mapRef.current);

                           // Zoom removido - apenas popup
                        }
                     );

                     console.log("✅ Event listeners configurados");
                  };

                  // Função para descrição da vegetação
                  const getVegetationDescription = (level) => {
                     const descriptions = {
                        water: "Área de água ou solo exposto",
                        critical: "Vegetação severamente degradada ou ausente",
                        severe: "Vegetação muito danificada, necessita intervenção urgente",
                        moderate: "Vegetação parcialmente degradada",
                        light: "Vegetação com sinais leves de estresse",
                        fair: "Vegetação em condição regular",
                        good: "Vegetação saudável e bem desenvolvida",
                        excellent: "Vegetação exuberante e muito densa",
                        // Níveis específicos do GeoJSON
                        very_sparse: "Vegetação muito rala ou solo exposto",
                        sparse: "Vegetação esparsa em regeneração",
                        dense: "Vegetação densa e bem desenvolvida",
                        very_dense: "Vegetação muito densa e exuberante"
                     };
                     return descriptions[level] || "Estado não classificado";
                  };

                  // Pontos estáticos - não mudam com zoom
                  console.log(
                     "✅ Pontos configurados estaticamente - sem mudança por zoom"
                  );

                  // Função para criar legenda baseada nos dados reais do GeoJSON
                  const createLegend = () => {
                     // Verificar se já existe uma legenda
                     const existingLegenda =
                        containerRef.current.querySelector(".ndvi-legend");
                     if (existingLegenda) {
                        console.log("⚠️ Legenda já existe, pulando criação");
                        return;
                     }

                     // Analisar os dados reais do GeoJSON para criar legenda precisa
                     const realData = criticalGeo.features.reduce((acc, f) => {
                        const severity = f.properties.severity;
                        const ndvi = f.properties.ndvi;

                        if (!acc[severity]) {
                           acc[severity] = {
                              count: 0,
                              ndviMin: ndvi,
                              ndviMax: ndvi,
                              color: f.properties.color,
                              label: f.properties.label,
                           };
                        }

                        acc[severity].count++;
                        acc[severity].ndviMin = Math.min(
                           acc[severity].ndviMin,
                           ndvi
                        );
                        acc[severity].ndviMax = Math.max(
                           acc[severity].ndviMax,
                           ndvi
                        );

                        return acc;
                     }, {});

                     // Mapear ícones por severidade
                     const severityIcons = {
                        critical: "🔴",
                        moderate: "🟡",
                        healthy: "🟢",
                     };

                     // Ordem de prioridade para exibição
                     const severityOrder = ["critical", "moderate", "healthy"];

                     const legend = document.createElement("div");
                     legend.className =
                        "ndvi-legend absolute left-3 bottom-3 z-10 bg-white/95 shadow-lg rounded-lg text-xs";
                     legend.style.width = "320px";
                     legend.style.backdropFilter = "blur(8px)";
                     legend.style.border = "1px solid rgba(0,0,0,0.1)";
                     legend.style.transition = "all 0.3s ease";

                     // Criar itens da legenda baseados nos dados reais
                     const legendItems = severityOrder
                        .filter((severity) => realData[severity])
                        .map((severity) => {
                           const data = realData[severity];
                           return {
                              level: severity,
                              icon: severityIcons[severity],
                              color: data.color,
                              label: data.label,
                              range: `${data.ndviMin.toFixed(2)} - ${data.ndviMax.toFixed(2)}`,
                              count: data.count,
                           };
                        });

                     // Adicionar estatísticas gerais do GeoJSON
                     const totalPoints = criticalGeo.features.length;
                     const metadata = criticalGeo.metadata;
                     const stats = metadata?.statistics || {};
                     const processingParams = metadata?.processing_params || {};

                     // Função para atualizar o conteúdo da legenda
                     const updateLegendContent = (isMinimized) => {
                        if (isMinimized) {
                           return `
                              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px">
                                 <div style="font-weight:bold;color:#228B22;font-size:14px">
                                    🛰️ Análise HLS
                                 </div>
                                 <button id="legend-toggle" style="background:none;border:none;cursor:pointer;font-size:16px;color:#666;padding:4px">
                                    📖
                                 </button>
                              </div>
                           `;
                        } else {
                           return `
                              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:2px solid #228B22;padding-bottom:4px">
                                 <div style="font-weight:bold;color:#228B22;font-size:14px">
                                    🛰️ Análise HLS - Mata Ciliar
                                 </div>
                                 <button id="legend-toggle" style="background:none;border:none;cursor:pointer;font-size:16px;color:#666;padding:4px">
                                    📕
                                 </button>
                              </div>
                       
                       <!-- Seção: Informações Gerais -->
                       <div style="margin-bottom:8px;padding:6px;background:#f0f8f0;border-radius:4px;border-left:3px solid #228B22">
                          <div style="font-weight:600;font-size:11px;color:#2d5a2d;margin-bottom:4px">📊 Informações Gerais</div>
                          <div style="font-size:10px;color:#666;line-height:1.3">
                             <div>📅 Período: ${processingParams.start_date || "Jun"}-${processingParams.end_date ? processingParams.end_date.split("-")[1] : "Set"} 2022</div>
                             <div>🌿 Status: <span style="color:#228B22;font-weight:600">${stats.overall_status === "healthy" ? "Saudável" : stats.overall_status || "N/A"}</span></div>
                             <div>📊 NDVI médio: <span style="font-family:monospace;font-weight:600">${stats.ndvi_mean ? stats.ndvi_mean.toFixed(3) : "N/A"}</span></div>
                             <div>📏 Buffer: ${metadata?.buffer_distance || "200m"} do rio</div>
                             <div>☁️ Máx. nuvens: ${processingParams.cloud_coverage_max || 50}%</div>
                          </div>
                       </div>

                       <!-- Seção: Distribuição dos Pontos -->
                       <div style="margin-bottom:8px;padding:6px;background:#fff8e1;border-radius:4px;border-left:3px solid #ff8c00">
                          <div style="font-weight:600;font-size:11px;color:#b8860b;margin-bottom:4px">📍 Distribuição dos Pontos</div>
                          <div style="font-size:10px;color:#666">
                             <div style="display:flex;justify-content:space-between">
                                <span>📊 Total analisado:</span>
                                <span style="font-weight:600">${totalPoints} pontos</span>
                             </div>
                          </div>
                       </div>
                       <!-- Seção: Escala NDVI por Severidade -->
                       <div style="margin-bottom:8px;padding:6px;background:#fef7f7;border-radius:4px;border-left:3px solid #dc143c">
                          <div style="font-weight:600;font-size:11px;color:#8b0000;margin-bottom:6px">🎯 Escala NDVI por Severidade</div>
                          ${legendItems
                             .map(
                                (item) => `
                             <div style="display:flex;align-items:center;justify-content:space-between;margin:5px 0;padding:4px;background:white;border-radius:3px;border:1px solid #f0f0f0">
                                <div style="display:flex;align-items:center;gap:8px">
                                   <span style="font-size:16px">${item.icon}</span>
                                   <div>
                                      <div style="color:${item.color};font-weight:700;font-size:12px">${item.label}</div>
                                      <div style="font-size:10px;color:#666;font-weight:500">${item.count} pontos detectados</div>
                                   </div>
                                </div>
                                <div style="text-align:right;background:#f8f9fa;padding:3px 6px;border-radius:3px">
                                   <div style="font-size:8px;color:#666;font-weight:600">NDVI</div>
                                   <div style="font-size:10px;color:#333;font-family:monospace;font-weight:600">${item.range}</div>
                                </div>
                             </div>
                          `
                             )
                             .join("")}
                       </div>

                       <!-- Seção: Estatísticas Detalhadas -->
                       <div style="margin-bottom:8px;padding:6px;background:#f5f5f5;border-radius:4px;border-left:3px solid #666">
                          <div style="font-weight:600;font-size:11px;color:#333;margin-bottom:4px">📈 Estatísticas da Análise</div>
                          <div style="font-size:9px;color:#666;line-height:1.4">
                             <div style="display:flex;justify-content:space-between">
                                <span>🔴 Fração crítica:</span>
                                <span style="font-family:monospace">${stats.critical_fraction ? (stats.critical_fraction * 100).toFixed(1) + "%" : "N/A"}</span>
                             </div>
                             <div style="display:flex;justify-content:space-between">
                                <span>🟡 Fração moderada:</span>
                                <span style="font-family:monospace">${stats.moderate_fraction ? (stats.moderate_fraction * 100).toFixed(1) + "%" : "N/A"}</span>
                             </div>
                             <div style="display:flex;justify-content:space-between">
                                <span>📊 Pixels analisados:</span>
                                <span style="font-family:monospace">${stats.total_pixels ? stats.total_pixels.toLocaleString() : "N/A"}</span>
                             </div>
                             <div style="display:flex;justify-content:space-between">
                                <span>📏 Distância mín. pontos:</span>
                                <span style="font-family:monospace">${processingParams.min_distance_points || 100}m</span>
                             </div>
                          </div>
                       </div>

                       <!-- Seção: Instruções -->
                       <div style="font-size:9px;color:#666;margin-top:8px;border-top:2px solid #ddd;padding-top:6px;text-align:center;background:#f9f9f9;padding:6px;border-radius:3px">
                          <div style="margin-bottom:2px;font-weight:600">💡 Como usar:</div>
                          <div>📍 <strong>Clique</strong> nos pins para detalhes</div>
                          <div>🔍 <strong>Zoom</strong> para ver mais pontos</div>
                          <div>🗺️ <strong>Alterne</strong> mapas base acima</div>
                       </div>
                           `;
                        }
                     };

                     // Definir conteúdo inicial da legenda
                     legend.innerHTML = updateLegendContent(legendMinimized);
                     containerRef.current.appendChild(legend);
                     console.log("✅ Legenda criada");

                     // Adicionar event listener para o botão de toggle
                     const toggleButton = legend.querySelector('#legend-toggle');
                     if (toggleButton) {
                        toggleButton.addEventListener('click', (e) => {
                           e.stopPropagation();
                           setLegendMinimized(!legendMinimized);
                        });
                     }
                  };
               }
            } catch (error) {
               console.error("❌ Erro ao carregar pontos críticos:", error);
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

   // Atualizar legenda quando legendMinimized mudar
   useEffect(() => {
      const legend = containerRef.current?.querySelector('.ndvi-legend');
      if (legend) {
         const updateLegendContent = (isMinimized) => {
            if (isMinimized) {
               return `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px">
                     <div style="font-weight:bold;color:#228B22;font-size:14px">
                        🛰️ Análise HLS
                     </div>
                     <button id="legend-toggle" style="background:none;border:none;cursor:pointer;font-size:16px;color:#666;padding:4px">
                        📖
                     </button>
                  </div>
               `;
            } else {
               // Conteúdo completo da legenda (mesmo do createLegend)
               const criticalGeo = window.criticalGeoData; // Armazenar dados globalmente
               if (!criticalGeo) return legend.innerHTML;

               const realData = criticalGeo.features.reduce((acc, f) => {
                  const severity = f.properties.severity;
                  const ndvi = f.properties.ndvi;

                  if (!acc[severity]) {
                     acc[severity] = {
                        count: 0,
                        ndviMin: ndvi,
                        ndviMax: ndvi,
                        color: f.properties.color,
                        label: f.properties.label,
                     };
                  }

                  acc[severity].count++;
                  acc[severity].ndviMin = Math.min(acc[severity].ndviMin, ndvi);
                  acc[severity].ndviMax = Math.max(acc[severity].ndviMax, ndvi);

                  return acc;
               }, {});

               const severityIcons = {
                  critical: "🔴",
                  moderate: "🟡",
                  healthy: "🟢",
               };

               const severityOrder = ["critical", "moderate", "healthy"];

               const legendItems = severityOrder
                  .filter((severity) => realData[severity])
                  .map((severity) => {
                     const data = realData[severity];
                     return {
                        level: severity,
                        icon: severityIcons[severity],
                        color: data.color,
                        label: data.label,
                        range: `${data.ndviMin.toFixed(2)} - ${data.ndviMax.toFixed(2)}`,
                        count: data.count,
                     };
                  });

               const totalPoints = criticalGeo.features.length;
               const metadata = criticalGeo.metadata;
               const stats = metadata?.statistics || {};
               const processingParams = metadata?.processing_params || {};

               return `
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:2px solid #228B22;padding-bottom:4px">
                     <div style="font-weight:bold;color:#228B22;font-size:14px">
                        🛰️ Análise HLS - Mata Ciliar
                     </div>
                     <button id="legend-toggle" style="background:none;border:none;cursor:pointer;font-size:16px;color:#666;padding:4px">
                        📕
                     </button>
                  </div>
                  
                  <!-- Seção: Informações Gerais -->
                  <div style="margin-bottom:8px;padding:6px;background:#f0f8f0;border-radius:4px;border-left:3px solid #228B22">
                     <div style="font-weight:600;font-size:11px;color:#2d5a2d;margin-bottom:4px">📊 Informações Gerais</div>
                     <div style="font-size:10px;color:#666;line-height:1.3">
                        <div>📅 Período: ${processingParams.start_date || "Jun"}-${processingParams.end_date ? processingParams.end_date.split("-")[1] : "Set"} 2022</div>
                        <div>🌿 Status: <span style="color:#228B22;font-weight:600">${stats.overall_status === "healthy" ? "Saudável" : stats.overall_status || "N/A"}</span></div>
                        <div>📊 NDVI médio: <span style="font-family:monospace;font-weight:600">${stats.ndvi_mean ? stats.ndvi_mean.toFixed(3) : "N/A"}</span></div>
                        <div>📏 Buffer: ${metadata?.buffer_distance || "200m"} do rio</div>
                        <div>☁️ Máx. nuvens: ${processingParams.cloud_coverage_max || 50}%</div>
                     </div>
                  </div>

                  <!-- Seção: Distribuição dos Pontos -->
                  <div style="margin-bottom:8px;padding:6px;background:#fff8e1;border-radius:4px;border-left:3px solid #ff8c00">
                     <div style="font-weight:600;font-size:11px;color:#b8860b;margin-bottom:4px">📍 Distribuição dos Pontos</div>
                     <div style="font-size:10px;color:#666">
                        <div style="display:flex;justify-content:space-between">
                           <span>📊 Total analisado:</span>
                           <span style="font-weight:600">${totalPoints} pontos</span>
                        </div>
                     </div>
                  </div>

                  <!-- Seção: Escala NDVI por Severidade -->
                  <div style="margin-bottom:8px;padding:6px;background:#fef7f7;border-radius:4px;border-left:3px solid #dc143c">
                     <div style="font-weight:600;font-size:11px;color:#8b0000;margin-bottom:6px">🎯 Escala NDVI por Severidade</div>
                     ${legendItems
                        .map(
                           (item) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;margin:5px 0;padding:4px;background:white;border-radius:3px;border:1px solid #f0f0f0">
                           <div style="display:flex;align-items:center;gap:8px">
                              <span style="font-size:16px">${item.icon}</span>
                              <div>
                                 <div style="color:${item.color};font-weight:700;font-size:12px">${item.label}</div>
                                 <div style="font-size:10px;color:#666;font-weight:500">${item.count} pontos detectados</div>
                              </div>
                           </div>
                           <div style="text-align:right;background:#f8f9fa;padding:3px 6px;border-radius:3px">
                              <div style="font-size:8px;color:#666;font-weight:600">NDVI</div>
                              <div style="font-size:10px;color:#333;font-family:monospace;font-weight:600">${item.range}</div>
                           </div>
                        </div>
                     `
                        )
                        .join("")}
                  </div>

                  <!-- Seção: Estatísticas Detalhadas -->
                  <div style="margin-bottom:8px;padding:6px;background:#f5f5f5;border-radius:4px;border-left:3px solid #666">
                     <div style="font-weight:600;font-size:11px;color:#333;margin-bottom:4px">📈 Estatísticas da Análise</div>
                     <div style="font-size:9px;color:#666;line-height:1.4">
                        <div style="display:flex;justify-content:space-between">
                           <span>🔴 Fração crítica:</span>
                           <span style="font-family:monospace">${stats.critical_fraction ? (stats.critical_fraction * 100).toFixed(1) + "%" : "N/A"}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between">
                           <span>🟡 Fração moderada:</span>
                           <span style="font-family:monospace">${stats.moderate_fraction ? (stats.moderate_fraction * 100).toFixed(1) + "%" : "N/A"}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between">
                           <span>📊 Pixels analisados:</span>
                           <span style="font-family:monospace">${stats.total_pixels ? stats.total_pixels.toLocaleString() : "N/A"}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between">
                           <span>📏 Distância mín. pontos:</span>
                           <span style="font-family:monospace">${processingParams.min_distance_points || 100}m</span>
                        </div>
                     </div>
                  </div>

                  <!-- Seção: Instruções -->
                  <div style="font-size:9px;color:#666;margin-top:8px;border-top:2px solid #ddd;padding-top:6px;text-align:center;background:#f9f9f9;padding:6px;border-radius:3px">
                     <div style="margin-bottom:2px;font-weight:600">💡 Como usar:</div>
                     <div>📍 <strong>Clique</strong> nos pins para detalhes</div>
                     <div>🔍 <strong>Zoom</strong> para ver mais pontos</div>
                     <div>🗺️ <strong>Alterne</strong> mapas base acima</div>
                  </div>
               `;
            }
         };

         legend.innerHTML = updateLegendContent(legendMinimized);

         // Reconfigurar event listener para o novo botão
         const toggleButton = legend.querySelector('#legend-toggle');
         if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
               e.stopPropagation();
               setLegendMinimized(!legendMinimized);
            });
         }
      }
   }, [legendMinimized]);

   // Função para criar card de ponto crítico
   const createCriticalPointCard = (point, index) => {
      const props = point.properties;
      const coords = point.geometry.coordinates;
      
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
            className={`group relative overflow-hidden rounded-xl border ${
               colors.border
            } bg-white/90 backdrop-blur-sm p-4 shadow-xl transition-all duration-300 ease-in-out ${
               colors.shadow
            } cursor-pointer hover:-translate-y-1 hover:bg-white/95 ${
               isSelected ? "scale-105 ring-2 ring-blue-400/50" : ""
            }`}
            onClick={() => setSelectedPoint(isSelected ? null : index)}
         >
            <div
               className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            ></div>

            <div className="relative z-10">
               <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className={`h-3 w-3 rounded-full ${colors.indicator}`}></div>
                     <h4 className="text-sm font-semibold text-gray-900">
                        Ponto #{index + 1}
                     </h4>
                  </div>
                  <span
                     className={`rounded-full ${colors.badge} px-2 py-1 text-xs font-semibold`}
                  >
                     {props.severity === "critical" ? "Crítico" : 
                      props.severity === "moderate" ? "Moderado" : "Saudável"}
                  </span>
               </div>

               <div className="space-y-2 text-xs text-gray-600">
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
                        {props.distance_to_river_m ? `${props.distance_to_river_m}m` : "N/A"}
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
               <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-gray-700 text-xs font-medium">
                        Tendência NDVI
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-gray-500 text-xs">Status:</span>
                     <div className="flex items-center gap-1">
                        {trend === "improving" ? (
                           <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : trend === "declining" ? (
                           <TrendingDown className="w-3 h-3 text-red-600" />
                        ) : (
                           <div className="w-3 h-3 rounded-full bg-gray-400" />
                        )}
                        <span
                           className={`text-xs ${
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
               <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                     <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>HLS</span>
                     </div>
                     <div className="flex items-center gap-1 text-gray-500">
                        <BarChart3 className="h-3 w-3" />
                        <span>Análise</span>
                     </div>
                     <div className="flex items-center gap-1 text-gray-500">
                        <Leaf className="h-3 w-3" />
                        <span>Vegetação</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className="h-screen w-full relative">
         <div ref={containerRef} className="h-full w-full" />
         
         {/* Header da Plataforma */}
         <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="px-6 py-3 flex items-center justify-between">
               {/* Logo */}
               <Link to="/" className="flex items-center gap-1">
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

               {/* Ações: Controles do Mapa + Avatar */}
               <div className="flex items-center gap-2 sm:gap-3">
                  {/* Controles de Camada */}
                  <div className="flex items-center gap-2 bg-white/90 shadow rounded px-3 py-1.5">
                     <div className="flex items-center gap-1.5 text-sm">
                        <label className="flex items-center gap-1 cursor-pointer">
                           <input
                              type="radio"
                              name="base"
                              checked={baseLayer === "osm"}
                              onChange={() => setBaseLayer("osm")}
                              className="w-3 h-3"
                           />
                           <Globe className="h-3 w-3" />
                           <span className="text-xs">OSM</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                           <input
                              type="radio"
                              name="base"
                              checked={baseLayer === "sat"}
                              onChange={() => setBaseLayer("sat")}
                              className="w-3 h-3"
                           />
                           <Search className="h-3 w-3" />
                           <span className="text-xs">Satélite</span>
                        </label>
                     </div>
                  </div>

                  {/* Avatar / Perfil */}
                  <Link
                     to="/profile"
                     title={user?.name || "Perfil"}
                     className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-xs font-semibold text-gray-700 hover:ring-2 hover:ring-[#2f4538]/30"
                     aria-label="Abrir perfil"
                  >
                     {user?.avatarUrl ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                           src={user.avatarUrl}
                           className="h-full w-full object-cover"
                        />
                     ) : (
                        <span>{(user?.name?.[0] || "U").toUpperCase()}</span>
                     )}
                  </Link>
               </div>
            </div>
         </div>

         {/* Cards Flutuantes dos Pontos Críticos */}
         {showCards && criticalPoints.length > 0 && (
            <div className="absolute right-4 top-20 bottom-4 w-80 z-10 flex flex-col">
               {/* Header dos Cards */}
               <div className="bg-white/95 backdrop-blur-sm rounded-t-xl border border-gray-200 px-4 py-3 mb-2">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-gray-900">
                        Pontos Críticos ({criticalPoints.length})
                     </h3>
                     <button
                        onClick={() => setShowCards(false)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        title="Fechar cards"
                     >
                        <X className="h-4 w-4 text-gray-500" />
                     </button>
                  </div>
               </div>

               {/* Área Scrollável dos Cards */}
               <div className="flex-1 overflow-y-auto bg-white/95 backdrop-blur-sm rounded-b-xl border border-gray-200 border-t-0 p-4 space-y-3">
                  {criticalPoints.map((point, index) => createCriticalPointCard(point, index))}
               </div>
            </div>
         )}

         {/* Botão para mostrar cards quando ocultos */}
         {!showCards && criticalPoints.length > 0 && (
            <button
               onClick={() => setShowCards(true)}
               className="absolute right-4 top-20 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg hover:bg-white transition-colors"
               title="Mostrar pontos críticos"
            >
               <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                     {criticalPoints.length} pontos
                  </span>
               </div>
            </button>
         )}
      </div>
   );
}
