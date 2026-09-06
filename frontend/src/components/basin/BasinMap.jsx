import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { API_V2_BASE, BAND_COLORS } from "../../lib/apiV2";

/* Mapa da bacia: coroplético de trechos + raster SR (toggle) + clique.
 * Props: reaches (FeatureCollection), selectedId, onSelect(id),
 *        srTiles (template absoluto ou null), srVisible, srOpacity.
 */
export default function BasinMap({
   reaches,
   selectedId,
   onSelect,
   srTiles,
   srVisible,
   srOpacity,
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
               { id: "sat", type: "raster", source: "sat", layout: { visibility: "none" } },
               { id: "osm", type: "raster", source: "osm" },
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

   /* Fonte + camada de trechos */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded || !reaches) return;
      const src = map.getSource("reaches");
      if (src) {
         src.setData(reaches);
      } else {
         map.addSource("reaches", { type: "geojson", data: reaches });
         map.addLayer({
            id: "reaches",
            type: "line",
            source: "reaches",
            paint: {
               "line-width": 4,
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
               "line-opacity": 0.9,
            },
         });
         map.addLayer({
            id: "reaches-selected",
            type: "line",
            source: "reaches",
            paint: { "line-width": 7, "line-color": "#111827", "line-opacity": 0.9 },
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
      /* Enquadra nos trechos */
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

   /* Destaque do selecionado */
   useEffect(() => {
      const map = mapRef.current;
      if (!map || !loaded || !map.getLayer("reaches-selected")) return;
      map.setFilter("reaches-selected", [
         "==",
         ["get", "id"],
         selectedId || "__none__",
      ]);
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
      const abs = new URL(srTiles, API_V2_BASE).href;
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
         "reaches"
      );
   }, [loaded, srTiles, srVisible, srOpacity]);

   return <div ref={containerRef} className="h-full w-full" />;
}
