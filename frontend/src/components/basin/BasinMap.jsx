import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { API_V2_BASE, BAND_COLORS } from "../../lib/apiV2";

/* Mapa cinematográfico da bacia (revisão R2 — identidade orbee).
 * Base satélite por padrão, trechos com halo, seleção em branco duplo,
 * controles de camada em pill flutuante de vidro sobre o mapa.
 *
 * Props: reaches, selectedId, onSelect(id), srTiles, srVisible, srOpacity,
 *        onSrToggle(bool), onSrOpacity(number), baseLayer, onBaseLayer(name).
 */
export default function BasinMap({
   reaches,
   selectedId,
   onSelect,
   srTiles,
   srVisible,
   srOpacity,
   onSrToggle,
   onSrOpacity,
   baseLayer,
   onBaseLayer,
}) {
   const containerRef = useRef(null);
   const mapRef = useRef(null);
   const [loaded, setLoaded] = useState(false);
   const onSelectRef = useRef(onSelect);
   onSelectRef.current = onSelect;

   useEffect(() => {
      if (mapRef.current) return;
      const map = new maplibregl.Map({
         container: containerRef.current,
         // Attribution compacto à direita (a legenda vive na esquerda)
         attributionControl: { compact: true },
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
                  attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
               },
            },
            layers: [
               { id: "sat", type: "raster", source: "sat", layout: { visibility: "visible" } },
               { id: "osm", type: "raster", source: "osm", layout: { visibility: "none" } },
            ],
         },
         center: [-52.55, -29.43],
         zoom: 10,
      });
      mapRef.current = map;
      map.on("load", () => setLoaded(true));
      return () => {
         map.remove();
         mapRef.current = null;
      };
   }, []);

   /* Alternância OSM/satélite */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded) return;
      try {
         map.setLayoutProperty("sat", "visibility", baseLayer === "sat" ? "visible" : "none");
         map.setLayoutProperty("osm", "visibility", baseLayer === "osm" ? "visible" : "none");
      } catch {
         /* antes do load completo */
      }
   }, [loaded, baseLayer]);

   /* Fonte + camadas de trechos (halo + linha + seleção branca dupla) */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded || !reaches) return;
      const src = map.getSource("reaches");
      if (src) {
         src.setData(reaches);
      } else {
         map.addSource("reaches", { type: "geojson", data: reaches });
         map.addLayer({
            id: "reaches-halo",
            type: "line",
            source: "reaches",
            paint: {
               "line-width": 9,
               "line-color": "#000000",
               "line-opacity": 0.35,
               "line-blur": 3,
            },
         });
         map.addLayer({
            id: "reaches",
            type: "line",
            source: "reaches",
            paint: {
               "line-width": 4.5,
               "line-color": [
                  "match",
                  ["get", "band"],
                  "Urgente",
                  BAND_COLORS.Urgente,
                  "Alta",
                  BAND_COLORS.Alta,
                  "Média",
                  BAND_COLORS.Média,
                  BAND_COLORS.Baixa,
               ],
               "line-opacity": 0.95,
            },
         });
         map.addLayer({
            id: "reaches-selected-casing",
            type: "line",
            source: "reaches",
            paint: { "line-width": 10, "line-color": "#FFFFFF", "line-opacity": 0.95 },
            filter: ["==", ["get", "id"], "__none__"],
         });
         map.addLayer({
            id: "reaches-selected",
            type: "line",
            source: "reaches",
            paint: { "line-width": 5, "line-color": "#FFFFFF", "line-opacity": 1 },
            filter: ["==", ["get", "id"], "__none__"],
         });
         map.on("click", "reaches", (e) => {
            const f = e.features && e.features[0];
            if (f) onSelectRef.current(f.properties.id);
         });
         map.on("mouseenter", "reaches", () => {
            map.getCanvas().style.cursor = "pointer";
         });
         map.on("mouseleave", "reaches", () => {
            map.getCanvas().style.cursor = "";
         });
      }
      try {
         const xs = [],
            ys = [];
         for (const f of reaches.features || []) {
            const walk = (c) => {
               if (typeof c[0] === "number") {
                  xs.push(c[0]);
                  ys.push(c[1]);
               } else c.forEach(walk);
            };
            walk(f.geometry.coordinates);
         }
         if (xs.length) {
            map.fitBounds(
               [
                  [Math.min(...xs), Math.min(...ys)],
                  [Math.max(...xs), Math.max(...ys)],
               ],
               { padding: 40 }
            );
         }
      } catch {
         /* mantém vista padrão */
      }
   }, [loaded, reaches]);

   /* Destaque do selecionado (branco duplo) */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded || !map.getLayer("reaches-selected")) return;
      const flt = ["==", ["get", "id"], selectedId || "__none__"];
      map.setFilter("reaches-selected", flt);
      map.setFilter("reaches-selected-casing", flt);
   }, [loaded, selectedId, reaches]);

   /* Camada raster SR (TileJSON absoluto) */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded) return;
      const has = !!map.getSource("sr");
      if (!srTiles) {
         if (has) {
            try {
               map.removeLayer("sr");
               map.removeSource("sr");
            } catch {
               /* já removida */
            }
         }
         return;
      }
      const abs = srTiles.startsWith("/") ? srTiles : new URL(srTiles, API_V2_BASE).href;
      if (has) {
         map.getSource("sr").tiles = [abs];
         try {
            map.removeLayer("sr");
         } catch {
            /* recria abaixo */
         }
      } else {
         map.addSource("sr", {
            type: "raster",
            tiles: [abs],
            tileSize: 256,
            attribution: "NDVI-SR 2,5 m · SEN2SRLite (ESA OpenSR)",
         });
      }
      map.addLayer(
         {
            id: "sr",
            type: "raster",
            source: "sr",
            paint: { "raster-opacity": srVisible ? srOpacity : 0 },
         },
         "reaches-halo"
      );
   }, [loaded, srTiles, srVisible, srOpacity]);

   return (
      <div ref={containerRef} className="relative h-full w-full">
         {/* Controles flutuantes de camada */}
         <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/55 p-1 shadow-lg backdrop-blur-md">
            {[
               { id: "sat", label: "Satélite" },
               { id: "osm", label: "Mapa" },
            ].map((b) => (
               <button
                  key={b.id}
                  onClick={() => onBaseLayer(b.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                     baseLayer === b.id
                        ? "bg-white text-[#2f4538] shadow"
                        : "text-white/80 hover:text-white"
                  }`}
               >
                  {b.label}
               </button>
            ))}
         </div>
         {srTiles && (
            <div className="absolute left-3 top-14 z-10 flex items-center gap-2 rounded-full bg-black/55 py-1.5 pl-3 pr-4 shadow-lg backdrop-blur-md">
               <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white">
                  <input
                     id="sr-toggle"
                     name="sr-toggle"
                     type="checkbox"
                     checked={srVisible}
                     onChange={(e) => onSrToggle(e.target.checked)}
                     className="h-4 w-4 rounded accent-[#A3D614]"
                  />
                  SR 2,5 m
               </label>
               {srVisible && (
                  <input
                     id="sr-opacity"
                     name="sr-opacity"
                     type="range"
                     min="0"
                     max="1"
                     step="0.05"
                     value={srOpacity}
                     onChange={(e) => onSrOpacity(Number(e.target.value))}
                     className="w-20 accent-[#A3D614]"
                     aria-label="Opacidade da camada SR"
                  />
               )}
            </div>
         )}
      </div>
   );
}
