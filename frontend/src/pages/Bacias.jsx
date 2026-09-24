import React, { useCallback, useEffect, useRef, useState } from "react";
import BasinMap from "../components/basin/BasinMap";
import ReachPanel from "../components/basin/ReachPanel";
import AuthModal from "../components/AuthModal";
import useAuth from "../hooks/useAuth";
import {
   BAND_COLORS,
   V2_STATIC,
   getManifest,
   getMethods,
   getReach,
   getReaches,
   getSrSummary,
   getTilejson,
   getValidation,
   listBasins,
} from "../lib/apiV2";

const SEGMENTOS = [
   { value: "", label: "Todas" },
   { value: "Média", label: "Média+" },
   { value: "Alta", label: "Alta+" },
   { value: "Urgente", label: "Urgente" },
];

/* Portal comunitário de bacias — revisão R4 (identidade orbee).
 * Leitura PÚBLICA (sem login); login só ao "adotar um trecho".
 */
export default function Bacias() {
   const { isAuthenticated, apiRequest } = useAuth();
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
   const [baseLayer, setBaseLayer] = useState("sat");
   const [methods, setMethods] = useState(null);
   const [manifest, setManifest] = useState(null);
   const [srInfo, setSrInfo] = useState(null);
   const [validation, setValidation] = useState(null);
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
      getReaches({ basin, version: version || undefined, band: undefined, min_priority: bandFilter || undefined })
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
               const flat = [];
               const walk = (c) =>
                  typeof c[0] === "number" ? flat.push(c) : c.forEach(walk);
               walk(feature.geometry.coordinates);
               const n = flat.length || 1;
               return [
                  flat.reduce((a, c) => a + c[0], 0) / n,
                  flat.reduce((a, c) => a + c[1], 0) / n,
               ];
            } catch {
               return [null, null];
            }
         })();
         try {
            await apiRequest("/observations/", {
               method: "POST",
               body: JSON.stringify({
                  location: `Trecho ${p.id} — bacia ${basin} (prioridade ${p.band}, score ${p.score})`,
                  description: `Quero adotar o trecho ${p.id} (rio ${p.river}, banda ${p.band}, score ${p.score}). Técnica sugerida e metodologia em /bacias.`,
                  observation_type: "vegetation",
                  latitude: lat,
                  longitude: lon,
               }),
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
         if (V2_STATIC) {
            setNotice(
               "Versão demonstrativa (dados abertos, sem login): a adoção de trechos entra no ar com o portal completo."
            );
            return;
         }
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
      const pv = { basin, version: version || undefined };
      if (!methods) {
         getMethods(pv)
            .then(setMethods)
            .catch((e) => setError(e.message));
      }
      if (!manifest) {
         getManifest(pv)
            .then(setManifest)
            .catch(() => setManifest(null));
      }
      if (!srInfo) {
         getSrSummary(pv)
            .then(setSrInfo)
            .catch(() => setSrInfo(null));
      }
      if (!validation) {
         getValidation(pv).then(setValidation);
      }
      setShowMethods(true);
   }, [methods, manifest, srInfo, validation, basin, version]);

   return (
      <div className="bg-gradient-to-b from-white via-[#f4f7f2] to-white">
         <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10">
            {/* Cabeçalho editorial */}
            <div className="max-w-3xl">
                <span className="inline-block rounded-full bg-[#2f4538]/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-[#2f4538]">
                   Portal comunitário · {basin === "taquari" ? "Vale do Taquari" : `Bacia do ${basin}`}
                </span>
               <h1
                  className="mt-3 text-4xl leading-tight text-[#2f4538] lg:text-5xl"
                  style={{ fontFamily: '"Fraunces", serif' }}
               >
                  Onde cada real de restauração rende mais
               </h1>
               <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
                  Trechos de mata ciliar diagnosticados por satélite e ordenados
                  por prioridade, com metodologia aberta. Recursos são finitos —
                  o mapa mostra onde agir primeiro.
               </p>
            </div>

            {error && (
               <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
               </div>
            )}
            {notice && (
               <div className="rounded-xl bg-green-50 p-3 text-sm text-green-800">
                  {notice}
               </div>
            )}

            {/* Barra de controles */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
               <label className="flex items-center gap-2 text-sm text-gray-600">
                  Bacia
                  <select
                     id="bacia-select"
                     name="bacia"
                     value={basin}
                     onChange={(e) => setBasin(e.target.value)}
                     className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-[#2f4538] focus:outline-none"
                  >
                     {basins.map((b) => (
                        <option key={b.basin} value={b.basin}>
                           {b.basin}
                        </option>
                     ))}
                  </select>
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-600">
                  Versão
                  <select
                     id="versao-select"
                     name="versao"
                     value={version}
                     onChange={(e) => setVersion(e.target.value)}
                     className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-[#2f4538] focus:outline-none"
                  >
                     {versions.map((v) => (
                        <option key={v} value={v}>
                           {v}
                        </option>
                     ))}
                  </select>
               </label>
               <div
                  className="flex items-center gap-1 rounded-full bg-gray-100 p-1"
                  role="group"
                  aria-label="Filtro de prioridade"
               >
                  {SEGMENTOS.map((s) => (
                     <button
                        key={s.label}
                        onClick={() => setBandFilter(s.value)}
                        aria-pressed={bandFilter === s.value}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                           bandFilter === s.value
                              ? "bg-[#2f4538] text-white shadow"
                              : "text-gray-600 hover:text-[#2f4538]"
                        }`}
                     >
                        {s.label}
                     </button>
                  ))}
               </div>
               <button
                  onClick={openMethods}
                  className="ml-auto rounded-full border border-[#2f4538]/30 px-4 py-1.5 text-xs font-medium text-[#2f4538] transition-colors hover:bg-[#2f4538]/10"
               >
                  Metodologia aberta
               </button>
            </div>

            {/* Mapa + painel */}
            <div className="flex min-h-[68vh] flex-col gap-4 lg:flex-row">
               <div className="relative min-h-[52vh] flex-1 overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/10">
                  {loading && !reaches ? (
                     <div className="flex h-full items-center justify-center bg-[#1a241d] p-6 text-sm text-white/70">
                        Carregando trechos…
                     </div>
                  ) : (
                     <BasinMap
                        reaches={reaches}
                        selectedId={selectedId}
                        onSelect={selectReach}
                        srTiles={srTiles}
                        srVisible={srOn}
                        srOpacity={srOpacity}
                        onSrToggle={setSrOn}
                        onSrOpacity={setSrOpacity}
                        baseLayer={baseLayer}
                        onBaseLayer={setBaseLayer}
                     />
                  )}
                  {/* Legenda flutuante (inferior-esquerda: o attribution do
                      mapa ocupa a direita; antes um cobria o outro) */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 shadow-lg backdrop-blur-md sm:gap-3 sm:px-4">
                     {["Urgente", "Alta", "Média", "Baixa"].map((b) => (
                        <span key={b} className="flex items-center gap-1.5 text-[10px] font-medium text-white sm:text-[11px]">
                           <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                 backgroundColor: BAND_COLORS[b],
                                 boxShadow: `0 0 8px ${BAND_COLORS[b]}`,
                              }}
                           />
                           {b}
                        </span>
                     ))}
                  </div>
               </div>
               <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:w-[390px]">
                  <ReachPanel detail={detail} onAdopt={adopt} onDownload={downloadReach} />
               </div>
            </div>

            {showMethods && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
                     <h2
                        className="text-2xl text-[#2f4538]"
                        style={{ fontFamily: '"Fraunces", serif' }}
                     >
                        Metodologia aberta
                     </h2>
                     <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
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
                     <h3
                        className="mt-6 text-lg text-[#2f4538]"
                        style={{ fontFamily: '"Fraunces", serif' }}
                     >
                        Dados e proveniência
                     </h3>
                     <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
                        <li>
                           Vegetação: NDVI de Sentinel-2 L2A (10 m, bandas
                           B04/B08, máscara SCL) via Planetary Computer, janelas
                           pré 01–03/24 · pós 06–08/24 · regen 06–08/25
                           (mediana top-3, nuvens &lt; 20%).
                        </li>
                        <li>
                           Rios do OpenStreetMap, trechos de ~500 m
                           {manifest?.buffer_m != null &&
                              ` (faixa ${manifest.buffer_m} m)`}
                           {manifest?.region != null && ` · ${manifest.region}`}
                           .
                        </li>
                        <li>
                           Realce 2,5 m por IA (SEN2SRLite NonReference_RGBN_x4,
                           pesos abertos
                           {srInfo?.model?.weights_sha256 != null &&
                              `, SHA ${srInfo.model.weights_sha256.slice(0, 12)}…`}
                           ), validado por trecho (G1 fidelidade, G2 viés-solo).
                        </li>
                        {validation != null && (
                           <li>
                              Validação independente V1–V6: {validation.verdict}{" "}
                              ({validation.n_checks} checagens, {validation.n_fail}{" "}
                              FAIL, {validation.n_warn} WARN). {validation.limits}
                           </li>
                        )}
                        <li>
                           Leitura da janela pós ’24: após a enchente de
                           mai/2024, queda de NDVI pode ser soterramento ou
                           assoreamento — não só desmate. Escore é prospecção,
                           não diagnóstico (sem verdade de campo).
                        </li>
                     </ul>
                     <button
                        onClick={() => setShowMethods(false)}
                        className="mt-5 rounded-full bg-[#2f4538] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2f4538]/80"
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
      </div>
   );
}
