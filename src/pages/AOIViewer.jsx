import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fromUrl as geotiffFromUrl } from "geotiff";
import proj4 from "proj4";

export default function AOIViewer() {
   const mapRef = useRef(null);
   const containerRef = useRef(null);
   const [loaded, setLoaded] = useState(false);
   const [baseLayer, setBaseLayer] = useState("osm");
   const [rgbVisible, setRgbVisible] = useState(false);
   const [rgbAvailable, setRgbAvailable] = useState(false);

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

                  // Função para classificar degradação usando dados REAIS do GeoJSON
                  const classifyDegradation = (feature) => {
                     // Usar propriedades do GeoJSON gerado pelo HLS.ipynb
                     const props = feature.properties;

                     // Se já tem classificação do GeoJSON, usar ela
                     if (props.level && props.color) {
                        return {
                           level: props.level,
                           color: props.color,
                           label: props.label || props.severity,
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
                        showFair: true, // Sempre mostrar regulares
                        maxPointsPerType: {
                           critical: 999, // Sem limite para críticos
                           moderate: 50, // Máximo 50 moderados
                           fair: 25, // Máximo 25 regulares
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
                        const severity =
                           f.properties.severity || f.classification.level;
                        return severity === "critical";
                     });

                     const moderate = classifiedFeatures.filter((f) => {
                        const severity =
                           f.properties.severity || f.classification.level;
                        return severity === "moderate";
                     });

                     const fair = classifiedFeatures.filter((f) => {
                        const severity =
                           f.properties.severity || f.classification.level;
                        return severity === "fair";
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

                     // REGULARES: Com limite menor
                     if (config.showFair) {
                        const filteredFair = filterByDistance(
                           fair,
                           config.minDistance * 1.5, // Mais espaçados
                           config.maxPointsPerType.fair
                        );
                        result = [...result, ...filteredFair];
                        console.log(
                           `🟢 Regulares incluídos: ${filteredFair.length}/${fair.length}`
                        );
                     }

                     console.log(
                        `📊 Total final: ${result.length} pontos (${result.filter((f) => f.properties.severity === "critical").length} críticos, ${result.filter((f) => f.properties.severity === "moderate").length} moderados, ${result.filter((f) => f.properties.severity === "fair").length} regulares)`
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
                                    ["<", ["get", "ndvi"], -0.2],
                                    "water-pin",
                                    ["<", ["get", "ndvi"], 0.0],
                                    "critical-pin",
                                    ["<", ["get", "ndvi"], 0.2],
                                    "severe-pin",
                                    ["<", ["get", "ndvi"], 0.4],
                                    "moderate-pin",
                                    ["<", ["get", "ndvi"], 0.5],
                                    "light-pin",
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

                           // Zoom no ponto
                           mapRef.current.flyTo({
                              center: e.features[0].geometry.coordinates,
                              zoom: 16,
                              duration: 1000,
                           });
                        }
                     );

                     console.log("✅ Event listeners configurados");
                  };

                  // Função para descrição da vegetação
                  const getVegetationDescription = (level) => {
                     const descriptions = {
                        water: "Área de água ou solo exposto",
                        critical: "Vegetação severamente degradada ou ausente",
                        severe:
                           "Vegetação muito danificada, necessita intervenção urgente",
                        moderate: "Vegetação parcialmente degradada",
                        light: "Vegetação com sinais leves de estresse",
                        fair: "Vegetação em condição regular",
                        good: "Vegetação saudável e bem desenvolvida",
                        excellent: "Vegetação exuberante e muito densa",
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
                        fair: "🟢",
                     };

                     // Ordem de prioridade para exibição
                     const severityOrder = ["critical", "moderate", "fair"];

                     const legend = document.createElement("div");
                     legend.className =
                        "ndvi-legend absolute left-3 bottom-3 z-10 bg-white/95 shadow-lg rounded-lg px-4 py-3 text-xs max-h-96 overflow-y-auto";
                     legend.style.width = "320px";
                     legend.style.backdropFilter = "blur(8px)";
                     legend.style.border = "1px solid rgba(0,0,0,0.1)";

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

                     legend.innerHTML = `
                       <div style="font-weight:bold;margin-bottom:8px;border-bottom:2px solid #228B22;padding-bottom:4px;color:#228B22">
                          🛰️ Análise HLS - Mata Ciliar
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
                     containerRef.current.appendChild(legend);
                     console.log("✅ Legenda criada");
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

   return (
      <div className="h-screen w-full relative">
         <div ref={containerRef} className="h-full w-full" />
         <div className="absolute left-3 top-3 z-10 bg-white/90 shadow rounded px-3 py-2">
            <div className="mb-1 space-x-2 text-sm">
               <label>
                  <input
                     type="radio"
                     name="base"
                     checked={baseLayer === "osm"}
                     onChange={() => setBaseLayer("osm")}
                  />{" "}
                  OSM
               </label>
               <label>
                  <input
                     type="radio"
                     name="base"
                     checked={baseLayer === "sat"}
                     onChange={() => setBaseLayer("sat")}
                  />{" "}
                  Satélite
               </label>
            </div>
         </div>
      </div>
   );
}
