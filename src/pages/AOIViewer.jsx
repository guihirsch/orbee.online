import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fromUrl as geotiffFromUrl } from "geotiff";
import proj4 from "proj4";

// Helper: build a blob URL for local file via fetch
async function createObjectUrl(path) {
   const res = await fetch(path);
   if (!res.ok) throw new Error(`Falha ao carregar arquivo: ${path}`);
   const blob = await res.blob();
   return URL.createObjectURL(blob);
}

export default function AOIViewer() {
   const mapRef = useRef(null);
   const containerRef = useRef(null);
   const [loaded, setLoaded] = useState(false);
   const [rgbVisible, setRgbVisible] = useState(true);
   const [ndviVisible, setNdviVisible] = useState(true);

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
            },
            layers: [{ id: "osm", type: "raster", source: "osm" }],
         },
         center: [-52.4264, -29.7175],
         zoom: 11,
      });

      mapRef.current.addControl(
         new maplibregl.NavigationControl(),
         "top-right"
      );

      mapRef.current.on("load", async () => {
         try {
            // Render NDVI GeoTIFF into canvas and add as image source
            const tiff = await geotiffFromUrl(
               "/ndvi_mosaic_super_resolved.tif"
            );
            const image = await tiff.getImage();
            const width = image.getWidth();
            const height = image.getHeight();
            const nodataMeta = image.getGDALNoData();
            const data = await image.readRasters({
               samples: [0],
               interleave: true,
            });

            // Build normalized NDVI in [-1, 1]
            let minVal = Infinity;
            let maxVal = -Infinity;
            for (let i = 0; i < data.length; i++) {
               const v = data[i];
               if (v === nodataMeta || !Number.isFinite(v)) continue;
               if (v < minVal) minVal = v;
               if (v > maxVal) maxVal = v;
            }

            // Heuristics: detect common encodings
            // - [-1,1] already
            // - [0,1] -> map to [-1,1]
            // - [0,10000] sentinel scale -> divide by 10000 then map
            let scaleFn = (v) => v; // identity
            if (maxVal > 1.5) {
               // assume 0..10000
               scaleFn = (v) =>
                  v === nodataMeta || !Number.isFinite(v)
                     ? NaN
                     : (v / 10000) * 2 - 1;
            } else if (minVal >= 0 && maxVal <= 1.1) {
               // 0..1
               scaleFn = (v) =>
                  v === nodataMeta || !Number.isFinite(v) ? NaN : v * 2 - 1;
            } else {
               // assume already [-1,1]
               scaleFn = (v) =>
                  v === nodataMeta || !Number.isFinite(v) ? NaN : v;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            const imgData = ctx.createImageData(width, height);
            // Better resampling on display
            ctx.imageSmoothingEnabled = true;

            const NDVI_MIN = -1;
            const NDVI_MAX = 1;
            // Some writers store rows bottom->top. Draw explicitly by row/col and flip if needed.
            const nodataVal =
               nodataMeta != null ? parseFloat(nodataMeta) : undefined;
            for (let y = 0; y < height; y++) {
               // change to `const srcY = height - 1 - y;` if image appears vertically flipped
               const srcY = y;
               for (let x = 0; x < width; x++) {
                  const srcIdx = srcY * width + x;
                  let v = data[srcIdx];
                  if (nodataVal !== undefined && v === nodataVal) v = NaN;
                  v = scaleFn(v);
                  const dstIdx = (y * width + x) * 4;
                  if (Number.isFinite(v)) {
                     const t = Math.min(
                        1,
                        Math.max(0, (v - NDVI_MIN) / (NDVI_MAX - NDVI_MIN))
                     );
                     const r = Math.round(255 * (1 - t));
                     const g = Math.round(255 * t);
                     const b = 64;
                     const a = 220;
                     imgData.data[dstIdx] = r;
                     imgData.data[dstIdx + 1] = g;
                     imgData.data[dstIdx + 2] = b;
                     imgData.data[dstIdx + 3] = a;
                  } else {
                     imgData.data[dstIdx] = 0;
                     imgData.data[dstIdx + 1] = 0;
                     imgData.data[dstIdx + 2] = 0;
                     imgData.data[dstIdx + 3] = 0;
                  }
               }
            }
            ctx.putImageData(imgData, 0, 0);

            // Get bounds in source CRS
            const [xmin, ymin, xmax, ymax] = image.getBoundingBox();
            // Detect CRS via GeoKeys and reproject to WGS84 if necessary
            const geoKeys = image.getGeoKeys();
            let toLngLat = (x, y) => [x, y];
            try {
               const epsgNum =
                  geoKeys.ProjectedCSTypeGeoKey || geoKeys.GeographicTypeGeoKey;
               if (epsgNum) {
                  const src = `EPSG:${epsgNum}`;
                  if (src !== "EPSG:4326") {
                     toLngLat = (x, y) => proj4(src, "EPSG:4326", [x, y]);
                  }
               }
            } catch {}

            const tl = toLngLat(xmin, ymax);
            const tr = toLngLat(xmax, ymax);
            const br = toLngLat(xmax, ymin);
            const bl = toLngLat(xmin, ymin);
            const coordinates = [tl, tr, br, bl];

            mapRef.current.addSource("ndvi-image", {
               type: "image",
               url: canvas.toDataURL(),
               coordinates,
            });
            mapRef.current.addLayer({
               id: "ndvi-layer",
               type: "raster",
               source: "ndvi-image",
            });

            // Optional RGB bands GeoTIFF (if generated)
            // const rgbUrl = await createObjectUrl("/bands_super_resolved.tif");
            // await addGeoTiffSource(mapRef.current, "rgb-geotiff", { url: rgbUrl, r: 3, g: 2, b: 1, opacity: 0.8 });
            // mapRef.current.addLayer({ id: "rgb-layer", type: "raster", source: "rgb-geotiff" });

            setLoaded(true);
         } catch (e) {
            console.error("Erro ao carregar GeoTIFF no MapLibre:", e);
         }
      });

      return () => {
         if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
         }
      };
   }, []);

   useEffect(() => {
      if (!loaded || !mapRef.current) return;
      if (mapRef.current.getLayer("rgb-layer")) {
         mapRef.current.setLayoutProperty(
            "rgb-layer",
            "visibility",
            rgbVisible ? "visible" : "none"
         );
      }
   }, [rgbVisible, loaded]);

   useEffect(() => {
      if (!loaded || !mapRef.current) return;
      if (mapRef.current.getLayer("ndvi-layer")) {
         mapRef.current.setLayoutProperty(
            "ndvi-layer",
            "visibility",
            ndviVisible ? "visible" : "none"
         );
      }
   }, [ndviVisible, loaded]);

   return (
      <div className="h-screen w-full relative">
         <div ref={containerRef} className="h-full w-full" />
         <div className="absolute left-3 top-3 z-10 space-x-2 bg-white/90 shadow rounded px-3 py-2">
            <label className="mr-3 text-sm">
               <input
                  type="checkbox"
                  checked={ndviVisible}
                  onChange={(e) => setNdviVisible(e.target.checked)}
               />{" "}
               NDVI
            </label>
            <label className="text-sm opacity-60">
               <input
                  type="checkbox"
                  checked={rgbVisible}
                  onChange={(e) => setRgbVisible(e.target.checked)}
                  disabled
               />{" "}
               RGB (opcional)
            </label>
         </div>
      </div>
   );
}
