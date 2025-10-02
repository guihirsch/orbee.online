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

            // PONTOS CRÍTICOS COM PINS
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

                  mapRef.current.addSource("critical-points", {
                     type: "geojson",
                     data: criticalGeo,
                  });

                  // Criar pins SVG
                  const createPin = (color, size = 24) => {
                     const svg = `<svg width="${size}" height="${size * 1.2}" viewBox="0 0 24 29" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 17 12 17s12-8 12-17c0-6.6-5.4-12-12-12z" 
                              fill="${color}" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="4" fill="white"/>
                     </svg>`;
                     return `data:image/svg+xml;base64,${btoa(svg)}`;
                  };

                  // Adicionar imagens
                  const criticalImg = new Image();
                  criticalImg.onload = () =>
                     mapRef.current.addImage("critical-pin", criticalImg);
                  criticalImg.src = createPin("#ff3b30", 28);

                  const moderateImg = new Image();
                  moderateImg.onload = () =>
                     mapRef.current.addImage("moderate-pin", moderateImg);
                  moderateImg.src = createPin("#ffcc00", 24);

                  // Camada de símbolos
                  mapRef.current.addLayer({
                     id: "critical-points-symbols",
                     type: "symbol",
                     source: "critical-points",
                     layout: {
                        "icon-image": [
                           "case",
                           ["==", ["get", "severity"], "critical"],
                           "critical-pin",
                           "moderate-pin",
                        ],
                        "icon-size": [
                           "case",
                           ["==", ["get", "severity"], "critical"],
                           1.0,
                           0.85,
                        ],
                        "icon-anchor": "bottom",
                        "icon-allow-overlap": true,
                        "icon-ignore-placement": true,
                     },
                  });

                  // Interações
                  const popup = new maplibregl.Popup({
                     closeButton: false,
                     closeOnClick: false,
                  });

                  mapRef.current.on(
                     "mousemove",
                     "critical-points-symbols",
                     (e) => {
                        if (!e.features?.length) return;
                        mapRef.current.getCanvas().style.cursor = "pointer";
                        const f = e.features[0];
                        const p = f.properties;
                        const icon = p.severity === "critical" ? "🔴" : "🟡";

                        popup
                           .setLngLat(e.lngLat)
                           .setHTML(
                              `
                        <div style="min-width:200px">
                           <div><b>${icon} ${p.severity?.toUpperCase()}</b></div>
                           <div><b>NDVI:</b> ${p.ndvi?.toFixed(3)}</div>
                           <div><b>Descrição:</b> ${p.description}</div>
                           <div style="font-size:11px;color:#666;margin-top:5px">
                              ${f.geometry.coordinates[1].toFixed(6)}, ${f.geometry.coordinates[0].toFixed(6)}
                           </div>
                        </div>
                     `
                           )
                           .addTo(mapRef.current);
                     }
                  );

                  mapRef.current.on(
                     "mouseleave",
                     "critical-points-symbols",
                     () => {
                        mapRef.current.getCanvas().style.cursor = "";
                        popup.remove();
                     }
                  );

                  mapRef.current.on("click", "critical-points-symbols", (e) => {
                     if (!e.features?.length) return;
                     mapRef.current.flyTo({
                        center: e.features[0].geometry.coordinates,
                        zoom: 16,
                        duration: 1000,
                     });
                  });

                  // Legenda
                  const legend = document.createElement("div");
                  legend.className =
                     "absolute left-3 bottom-3 z-10 bg-white/90 shadow rounded px-3 py-2 text-xs";
                  legend.innerHTML = `
                     <div><b>Pontos Críticos - Mata Ciliar</b></div>
                     <div style="margin-top:4px">
                        📍 <span style="color:#ff3b30;font-weight:bold">Crítico</span> (${criticalGeo.metadata?.total_critical_points || 0})
                     </div>
                     <div>
                        📍 <span style="color:#ffcc00;font-weight:bold">Moderado</span> (${criticalGeo.metadata?.total_moderate_points || 0})
                     </div>
                     <div style="font-size:10px;color:#666;margin-top:4px">
                        Clique nos pins para detalhes
                     </div>
                  `;
                  containerRef.current.appendChild(legend);
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
