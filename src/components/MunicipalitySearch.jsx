import React, { useEffect, useState } from "react";
import {
   searchMunicipalities,
   getMunicipalityGeometry,
} from "../services/geoService";
import ndviService from "../services/ndviService";
import { getPlanForMunicipality } from "../services/planService";

export default function MunicipalitySearch({ onAOILoad }) {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selected, setSelected] = useState(null);
   const [superres, setSuperres] = useState(false);
   const [source, setSource] = useState("osm");

   useEffect(() => {
      const handler = setTimeout(async () => {
         if (query.trim().length < 2) return;
         setLoading(true);
         try {
            const data = await searchMunicipalities(query.trim(), source);
            setResults(data || []);
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      }, 300);
      return () => clearTimeout(handler);
   }, [query, source]);

   async function handleSelect(m) {
      setSelected(m);
      try {
         const geom = await getMunicipalityGeometry(
            m.ibge_code,
            source,
            m.name
         );
         let plan = null;
         try {
            plan = await getPlanForMunicipality(m.ibge_code, { source });
         } catch (e) {
            console.error(e);
         }
         if (onAOILoad) onAOILoad({ municipality: m, geometry: geom, plan });
      } catch (e) {
         console.error(e);
      }
   }

   // Removido: handleFetchNDVI - agora o plano é carregado automaticamente

   return (
      <div className="space-y-2">
         <div className="flex gap-2">
            <input
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Buscar município"
               className="w-full rounded border px-3 py-2"
            />
            <select
               value={source}
               onChange={(e) => setSource(e.target.value)}
               className="rounded border px-2 py-2 text-sm"
               title="Fonte"
            >
               <option value="osm">OSM</option>
               <option value="ibge">IBGE</option>
               <option value="local">Local</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
               <input
                  type="checkbox"
                  checked={superres}
                  onChange={(e) => setSuperres(e.target.checked)}
               />
               Super-res
            </label>
         </div>
         {loading && <div className="text-sm text-gray-500">Buscando…</div>}
         {!loading && results?.length > 0 && (
            <div className="max-h-48 overflow-auto rounded border">
               {results.map((m) => (
                  <button
                     key={m.ibge_code}
                     onClick={() => handleSelect(m)}
                     className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                  >
                     {m.name} ({m.state})
                  </button>
               ))}
            </div>
         )}
         {/* Removido: campos de data e botão - período automático (últimos 30 dias) */}
         {selected && (
            <div className="text-xs text-gray-600">
               Selecionado: {selected.name} ({selected.ibge_code})
            </div>
         )}
      </div>
   );
}
