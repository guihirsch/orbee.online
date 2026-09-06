import React from "react";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   Cell,
} from "recharts";
import { BAND_COLORS } from "../../lib/apiV2";

const TECNICA_POR_BANDA = {
   Urgente: "Engenharia natural + plantio de nativas + isolamento da área.",
   Alta: "Plantio de nativas + isolamento para conduzir a regeneração.",
   Média: "Condução da regeneração natural + monitoramento.",
   Baixa: "Monitoramento periódico; manter a cobertura atual.",
};

const ROTULOS = {
   severity: "Severidade atual",
   no_regen: "Sem regeneração",
   connectivity: "Isolamento",
   risk: "Dano novo",
   cost: "Custo (inverso)",
};

/* Painel lateral do trecho selecionado (PT-BR).
 * Props: detail (Feature do /v2/reaches/{id}, com bloco `sr` opcional),
 *        onAdopt(feature), onDownload(feature).
 */
export default function ReachPanel({ detail, onAdopt, onDownload }) {
   if (!detail) {
      return (
         <div className="p-6 text-sm text-gray-500">
            Clique em um trecho do mapa para ver o diagnóstico, a técnica
            sugerida e as opções de ação.
         </div>
      );
   }
   const p = detail.properties || {};
   const comp = p.components || {};
   const compData = Object.entries(comp).map(([k, v]) => ({
      nome: ROTULOS[k] || k,
      valor: v,
   }));
   const serie = [
      { janela: "pré (2024)", ndvi: p.stats_pre?.ndvi_mean ?? null },
      { janela: "pós (2024)", ndvi: p.stats_pos?.ndvi_mean ?? null },
      { janela: "regen", ndvi: p.stats_regen?.ndvi_mean ?? null },
   ];
   const color = BAND_COLORS[p.band] || BAND_COLORS.Baixa;
   const lowValid =
      typeof p.valid_fraction === "number" && p.valid_fraction < 0.5;

   return (
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
         <div className="flex items-start justify-between gap-2">
            <div>
               <div className="text-xs text-gray-500">
                  Trecho {(p.id || "").slice(0, 18)} · {p.river || "rio"}
               </div>
               <div className="mt-1 flex items-center gap-2">
                  <span
                     className="inline-block rounded-full px-3 py-1 text-sm font-medium text-white"
                     style={{ backgroundColor: color }}
                  >
                     {p.band || "—"}
                  </span>
                  <span className="text-2xl font-medium text-gray-800">
                     {typeof p.score === "number" ? p.score.toFixed(2) : "—"}
                  </span>
               </div>
            </div>
         </div>

         {lowValid && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
               Cobertura válida baixa ({Math.round(p.valid_fraction * 100)}%
               dos pixels) — trate este escore como prospecção, não
               diagnóstico. Ver metodologia.
            </div>
         )}

         <section>
            <h3 className="mb-1 text-sm font-medium text-gray-700">
               Por que este trecho é prioritário
            </h3>
            <ResponsiveContainer width="100%" height={150}>
               <BarChart data={compData} layout="vertical">
                  <XAxis type="number" domain={[0, 1]} hide />
                  <YAxis type="category" dataKey="nome" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => Number(v).toFixed(2)} />
                  <Bar dataKey="valor">
                     {compData.map((_, i) => (
                        <Cell key={i} fill={color} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500">
               Pesos públicos em Metodologia (severidade 35% · sem-regen 25% ·
               conectividade 20% · risco 15% · custo 5%).
            </p>
         </section>

         <section>
            <h3 className="mb-1 text-sm font-medium text-gray-700">
               NDVI médio por janela
            </h3>
            <ResponsiveContainer width="100%" height={140}>
               <BarChart data={serie}>
                  <XAxis dataKey="janela" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => (v == null ? "—" : Number(v).toFixed(3))} />
                  <Bar dataKey="ndvi" fill="#2f4538" />
               </BarChart>
            </ResponsiveContainer>
            {typeof p.delta_regen === "number" && (
               <p className="text-xs text-gray-500">
                  Δ regeneração: {p.delta_regen >= 0 ? "+" : ""}
                  {p.delta_regen.toFixed(3)} (mesma estação)
               </p>
            )}
         </section>

         {detail.sr && (
            <section className="rounded-lg bg-green-50 p-3 text-xs text-green-900">
               <strong>Super-resolução 2,5 m disponível</strong> — status{" "}
               {detail.sr.sr_status}
               {detail.sr.g1 && (
                  <>
                     {" "}· ERGAS {detail.sr.g1.ergas} · SAM {detail.sr.g1.sam}°
                  </>
               )}
               {detail.sr.g2 && detail.sr.g2.vies_solo != null && (
                  <> · viés {detail.sr.g2.vies_solo}</>
               )}
               . Ative a camada SR no mapa.
            </section>
         )}

         <section className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
            <strong>Técnica sugerida:</strong>{" "}
            {TECNICA_POR_BANDA[p.band] || "—"}
         </section>

         <div className="mt-auto flex flex-col gap-2">
            <button
               onClick={() => onAdopt(detail)}
               className="rounded-full bg-[#2f4538] px-6 py-2 text-sm font-medium text-white hover:bg-[#2f4538]/80"
            >
               Adotar este trecho
            </button>
            <button
               onClick={() => onDownload(detail)}
               className="rounded-full border border-[#2f4538] px-6 py-2 text-sm font-medium text-[#2f4538] hover:bg-[#2f4538]/10"
            >
               Baixar GeoJSON do trecho
            </button>
            <div className="text-xs text-gray-400">
               Metodologia {p.methods_version || "—"} · área aprox.{" "}
               {p.area_ha ?? "—"} ha
            </div>
         </div>
      </div>
   );
}
