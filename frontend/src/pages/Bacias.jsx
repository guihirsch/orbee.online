import React, { useCallback, useEffect, useRef, useState } from "react";
import BasinMap from "../components/basin/BasinMap";
import ReachPanel from "../components/basin/ReachPanel";
import AuthModal from "../components/AuthModal";
import useAuth from "../hooks/useAuth";
import {
   BAND_COLORS,
   BAND_ORDER,
   getMethods,
   getReach,
   getReaches,
   getTilejson,
   listBasins,
} from "../lib/apiV2";

/* Portal comunitário de bacias — leitura PÚBLICA (sem login).
 * Login só é pedido ao "adotar um trecho" (salva observation).
 */
export default function Bacias() {
   const { user, isAuthenticated, apiRequest } = useAuth();
   const [basins, setBasins] = useState([]);
   const [basin, setBasin] = useState("pardo");
   const [version, setVersion] = useState("");
   const [versions, setVersions] = useState([]);
   const [bandFilter, setBandFilter] = useState("");
   const [reaches, setReaches] = useState(null);
   const [selectedId, setSelectedId] = useState(null);
   const [detail, setDetail] = useState(null);
   const [srOn, setSrOn] = useState(false);
   const [srOpacity, setSrOpacity] = useState(0.85);
   const [srTiles, setSrTiles] = useState(null);
   const [methods, setMethods] = useState(null);
   const [showMethods, setShowMethods] = useState(false);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);
   const [showAuth, setShowAuth] = useState(false);
   const [notice, setNotice] = useState("");
   const pendingAdopt = useRef(null);

   useEffect(() => {
      listBasins()
         .then((all) => {
            setBasins(all);
            const b = all.find((x) => x.basin === basin) || all[0];
            if (b) {
               setBasin(b.basin);
               setVersions(b.versions || []);
               setVersion(b.latest || "");
            }
            setLoading(false);
         })
         .catch((e) => {
            setError(e.message);
            setLoading(false);
         });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (!basin) return;
      setLoading(true);
      setSelectedId(null);
      setDetail(null);
      setSrTiles(null);
      getReaches({ basin, version: version || undefined, band: bandFilter || undefined })
         .then((fc) => {
            setReaches(fc);
            setError("");
         })
         .catch((e) => setError(e.message))
         .finally(() => setLoading(false));
   }, [basin, version, bandFilter]);

   const selectReach = useCallback(
      (id) => {
         setSelectedId(id);
         setDetail(null);
         setSrTiles(null);
         getReach(id, { basin, version: version || undefined })
            .then((f) => {
               setDetail(f);
               if (f.sr && f.sr.sr_status === "PASS") {
                  getTilejson({ basin, reach_id: id, version: version || undefined })
                     .then((tj) => setSrTiles(tj.tiles[0]))
                     .catch(() => setSrTiles(null));
               }
            })
            .catch((e) => setError(e.message));
      },
      [basin, version]
   );

   const doAdopt = useCallback(
      async (feature) => {
         const p = feature.properties || {};
         const [lon, lat] = (() => {
            try {
               const cs = feature.geometry.coordinates;
               const flat = [];
               const walk = (c) =>
                  typeof c[0] === "number" ? flat.push(c) : c.forEach(walk);
               walk(cs);
               const n = flat.length || 1;
               return [
                  flat.reduce((a, c) => a + c[0], 0) / n,
                  flat.reduce((a, c) => a + c[1], 0) / n,
               ];
            } catch {
               return [null, null];
            }
         })();
         const body = {
            location: `Trecho ${p.id} — bacia ${basin} (prioridade ${p.band}, score ${p.score})`,
            description: `Quero adotar o trecho ${p.id} (rio ${p.river}, banda ${p.band}, score ${p.score}). Técnica sugerida e metodologia em /bacias.`,
            observation_type: "vegetation",
            latitude: lat,
            longitude: lon,
         };
         try {
            await apiRequest("/observations/", {
               method: "POST",
               body: JSON.stringify(body),
            });
            setNotice("Trecho adotado! Sua intenção foi registrada como observação.");
         } catch (e) {
            setNotice(`Não foi possível registrar: ${e.message}`);
         }
      },
      [apiRequest, basin]
   );

   const adopt = useCallback(
      (feature) => {
         if (!isAuthenticated) {
            pendingAdopt.current = feature;
            setShowAuth(true);
            return;
         }
         doAdopt(feature);
      },
      [isAuthenticated, doAdopt]
   );

   const downloadReach = useCallback((feature) => {
      const blob = new Blob([JSON.stringify(feature, null, 2)], {
         type: "application/geo+json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${feature.properties?.id || "trecho"}.geojson`;
      a.click();
      URL.revokeObjectURL(a.href);
   }, []);

   const openMethods = useCallback(() => {
      if (!methods) {
         getMethods({ basin, version: version || undefined })
            .then(setMethods)
            .catch((e) => setError(e.message));
      }
      setShowMethods(true);
   }, [methods, basin, version]);

   return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
         <div>
            <h1 className="text-3xl font-medium text-[#2f4538]">
               Bacias — qualidade da mata ciliar
            </h1>
            <p className="mt-1 text-sm text-gray-600">
               Trechos priorizados para restauração, com metodologia aberta.
               Recursos são finitos — cada real rende mais onde a prioridade é maior.
            </p>
         </div>

         {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
               {error}
            </div>
         )}
         {notice && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
               {notice}
            </div>
         )}

         <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
               Bacia
               <select
                  value={basin}
                  onChange={(e) => setBasin(e.target.value)}
                  className="rounded-lg border px-2 py-1"
               >
                  {basins.map((b) => (
                     <option key={b.basin} value={b.basin}>
                        {b.basin}
                     </option>
                  ))}
               </select>
            </label>
            <label className="flex items-center gap-2">
               Versão
               <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="rounded-lg border px-2 py-1"
               >
                  {versions.map((v) => (
                     <option key={v} value={v}>
                        {v}
                     </option>
                  ))}
               </select>
            </label>
            <label className="flex items-center gap-2">
               Prioridade
               <select
                  value={bandFilter}
                  onChange={(e) => setBandFilter(e.target.value)}
                  className="rounded-lg border px-2 py-1"
               >
                  <option value="">Todas</option>
                  {BAND_ORDER.slice().reverse().map((b) => (
                     <option key={b} value={b}>
                        {b} ou maior
                     </option>
                  ))}
               </select>
            </label>
            <label className="flex items-center gap-2" title={srTiles ? "" : "Sem SR para este trecho"}>
               <input
                  type="checkbox"
                  checked={srOn}
                  disabled={!srTiles}
                  onChange={(e) => setSrOn(e.target.checked)}
               />
               SR 2,5 m
            </label>
            {srOn && srTiles && (
               <label className="flex items-center gap-2">
                  Opacidade
                  <input
                     type="range"
                     min="0"
                     max="1"
                     step="0.05"
                     value={srOpacity}
                     onChange={(e) => setSrOpacity(Number(e.target.value))}
                  />
               </label>
            )}
            <button onClick={openMethods} className="text-[#2f4538] underline">
               Metodologia
            </button>
            <div className="ml-auto flex items-center gap-2">
               {BAND_ORDER.map((b) => (
                  <span key={b} className="flex items-center gap-1 text-xs text-gray-600">
                     <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: BAND_COLORS[b] }}
                     />
                     {b}
                  </span>
               ))}
            </div>
         </div>

         <div className="flex min-h-[540px] flex-col gap-4 lg:flex-row">
            <div className="min-h-[420px] flex-1 overflow-hidden rounded-xl border">
               {loading && !reaches ? (
                  <div className="p-6 text-sm text-gray-500">Carregando trechos…</div>
               ) : (
                  <BasinMap
                     reaches={reaches}
                     selectedId={selectedId}
                     onSelect={selectReach}
                     srTiles={srTiles}
                     srVisible={srOn}
                     srOpacity={srOpacity}
                  />
               )}
            </div>
            <div className="w-full overflow-hidden rounded-xl border lg:w-[380px]">
               <ReachPanel detail={detail} onAdopt={adopt} onDownload={downloadReach} />
            </div>
         </div>

         {showMethods && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
               <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
                  <h2 className="text-xl font-medium text-[#2f4538]">Metodologia</h2>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                     {methods ? methods.text : "Carregando…"}
                  </pre>
                  {methods && (
                     <p className="mt-2 text-xs text-gray-500">
                        Versão {methods.methods_version} · pesos:{" "}
                        {Object.entries(methods.weights || {})
                           .map(([k, v]) => `${k} ${Math.round(v * 100)}%`)
                           .join(" · ")}
                     </p>
                  )}
                  <button
                     onClick={() => setShowMethods(false)}
                     className="mt-4 rounded-full bg-[#2f4538] px-6 py-2 text-sm text-white"
                  >
                     Fechar
                  </button>
               </div>
            </div>
         )}

         <AuthModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            initialMode="login"
            onSuccessRedirect={() => {
               setShowAuth(false);
               if (pendingAdopt.current) {
                  doAdopt(pendingAdopt.current);
                  pendingAdopt.current = null;
               }
            }}
         />
      </div>
   );
}
