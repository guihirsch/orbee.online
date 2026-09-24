import React from "react";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
} from "recharts";
import { BAND_COLORS } from "../../lib/apiV2";

const TECNICA_POR_BANDA = {
   Urgente: "Engenharia natural + plantio de nativas + isolamento da área.",
   Alta: "Plantio de nativas + isolamento para conduzir a regeneração.",
   Média: "Condução da regeneração natural + monitoramento.",
   Baixa: "Monitoramento periódico; manter a cobertura atual.",
};

/* Janelas Sentinel-2 do build (espelha WINDOWS_DEFAULT do job; as datas
 * exatas por trecho variam conforme as cenas disponíveis — ver n_cenas). */
const JANELAS = [
   { chave: "stats_pre", rotulo: "pré 01–03/24" },
   { chave: "stats_pos", rotulo: "pós 06–08/24" },
   { chave: "stats_regen", rotulo: "regen 06–08/25" },
];

const ROTULOS = {
   severity: "Severidade atual",
   no_regen: "Sem regeneração",
   connectivity: "Isolamento",
   risk: "Dano novo",
   cost: "Custo (inverso)",
};

/* Painel editorial do trecho (revisão R3 — identidade orbee).
 * Props: detail (Feature do /v2/reaches/{id}, com bloco `sr` opcional),
 *        onAdopt(feature), onDownload(feature).
 */
export default function ReachPanel({ detail, onAdopt, onDownload }) {
   if (!detail) {
      return (
         <div className="flex h-full flex-col justify-center p-8 text-center">
            <p
               className="text-2xl text-[#2f4538]"
               style={{ fontFamily: '"Fraunces", serif' }}
            >
               Escolha um trecho
            </p>
            <p className="mt-2 text-sm text-gray-500">
               Clique em uma linha do mapa para ver o diagnóstico, a técnica
               sugerida e como agir.
            </p>
         </div>
      );
   }
   const p = detail.properties || {};
   const comp = p.components || {};
   const compData = Object.entries(comp).map(([k, v]) => ({
      nome: ROTULOS[k] || k,
      valor: v,
   }));
   const serie = JANELAS.map((j) => ({
      janela: j.rotulo,
      ndvi: p[j.chave]?.ndvi_mean ?? null,
      n_cenas: p[j.chave]?.n_cenas ?? null,
   }));
   const color = BAND_COLORS[p.band] || BAND_COLORS.Baixa;
   const lowValid =
      typeof p.valid_fraction === "number" && p.valid_fraction < 0.5;

   return (
      <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
         <div>
            <div className="text-xs uppercase tracking-widest text-gray-400">
               Trecho {(p.id || "").slice(0, 18)} · {p.river || "rio"}
            </div>
            <div className="text-xs text-gray-400">
               Cobertura válida (regen):{" "}
               {typeof p.valid_fraction === "number"
                  ? `${Math.round(p.valid_fraction * 100)}% dos pixels`
                  : "—"}
            </div>
            <div className="mt-2 flex items-end gap-3">
               <span
                  className="leading-none text-[#2f4538]"
                  style={{
                     fontFamily: '"Fraunces", serif',
                     fontSize: "3rem",
                  }}
               >
                  {typeof p.score === "number" ? p.score.toFixed(2) : "—"}
               </span>
               <span
                  className="mb-1 inline-block rounded-full px-4 py-1 text-sm font-medium text-white shadow-sm"
                  style={{ backgroundColor: color }}
               >
                  {p.band || "—"}
               </span>
            </div>
         </div>

         {lowValid && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
               Cobertura válida baixa ({Math.round(p.valid_fraction * 100)}%
               dos pixels) — trate este escore como prospecção, não
               diagnóstico.
            </div>
         )}

         <section>
            <h3
               className="mb-2 text-lg text-[#2f4538]"
               style={{ fontFamily: '"Fraunces", serif' }}
            >
               Por que aqui primeiro
            </h3>
            <div className="flex flex-col gap-2">
               {compData.map((c) => (
                  <div key={c.nome}>
                     <div className="mb-0.5 flex justify-between text-xs text-gray-600">
                        <span>{c.nome}</span>
                        <span className="font-medium">{Number(c.valor).toFixed(2)}</span>
                     </div>
                     <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                           className="h-full rounded-full transition-all duration-500"
                           style={{
                              width: `${Math.round(Number(c.valor) * 100)}%`,
                              backgroundColor: color,
                           }}
                        />
                     </div>
                  </div>
               ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
               Pesos públicos em Metodologia.
            </p>
         </section>

         <section>
            <h3
               className="mb-2 text-lg text-[#2f4538]"
               style={{ fontFamily: '"Fraunces", serif' }}
            >
               Fôlego da mata
            </h3>
            <ResponsiveContainer width="100%" height={150}>
               <BarChart data={serie} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <XAxis dataKey="janela" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip
                     formatter={(v) => (v == null ? "—" : Number(v).toFixed(3))}
                     contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="ndvi" fill="#2f4538" radius={[8, 8, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
            {typeof p.delta_regen === "number" && (
               <p className="text-xs text-gray-500">
                  Δ regeneração: {p.delta_regen >= 0 ? "+" : ""}
                  {p.delta_regen.toFixed(3)} (mesma estação)
               </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
               Cenas por janela (pré/pós/regen):{" "}
               {serie.map((s) => s.n_cenas ?? "—").join(" / ")} · pós ’24 é
               pós-enchente: queda pode ser soterramento, não só desmate.
            </p>
         </section>

         {detail.sr && (
            <section className="rounded-xl bg-[#2f4538] p-4 text-sm leading-relaxed text-white shadow-sm">
               <strong style={{ fontFamily: '"Fraunces", serif' }}>
                  Visão 2,5 m disponível.
               </strong>{" "}
               Status {detail.sr.sr_status}
               {detail.sr.g1 && (
                  <>
                     {" "}· ERGAS {detail.sr.g1.ergas} · SAM {detail.sr.g1.sam}°
                     {typeof detail.sr.g1.psnr_nir === "number" &&
                        ` · PSNR ${detail.sr.g1.psnr_nir}`}
                  </>
               )}
               {detail.sr.g2 && typeof detail.sr.g2.vies_solo === "number" && (
                  <> · viés-solo {detail.sr.g2.vies_solo}</>
               )}
               . Ative a camada SR no mapa.
            </section>
         )}

          {detail.crosscheck && (
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
               <strong style={{ fontFamily: '"Fraunces", serif' }}>
                  Segunda opinião (CBERS-4A).
               </strong>{" "}
               Status {detail.crosscheck.status}
               {typeof detail.crosscheck.delta_ndvi_mean === "number" && (
                  <>
                     {" "}· Δ NDVI {detail.crosscheck.delta_ndvi_mean >= 0 ? "+" : ""}
                     {detail.crosscheck.delta_ndvi_mean.toFixed(3)}
                  </>
               )}
               {Array.isArray(detail.crosscheck.scene_ids) && (
                  <> · {detail.crosscheck.scene_ids.length} cenas</>
               )}
               . Divergência absoluta entre sensores é esperada (DN vs
               reflectância); ver V7 na Metodologia.
            </section>
          )}

          <blockquote className="border-l-4 pl-4 text-[15px] italic leading-relaxed text-gray-700" style={{ borderColor: color }}>
            {TECNICA_POR_BANDA[p.band] || "—"}
         </blockquote>

         <div className="mt-auto flex flex-col gap-2 pt-2">
            <button
               onClick={() => onAdopt(detail)}
               className="rounded-full bg-[#2f4538] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2f4538]/80"
            >
               Adotar este trecho
            </button>
            <button
               onClick={() => onDownload(detail)}
               className="rounded-full border border-[#2f4538]/30 px-6 py-2.5 text-sm font-medium text-[#2f4538] transition-colors hover:bg-[#2f4538]/10"
            >
               Baixar GeoJSON do trecho
            </button>
            <div className="text-center text-xs text-gray-400">
               Metodologia {p.methods_version || "—"} · {p.area_ha ?? "—"} ha
            </div>
         </div>
      </div>
   );
}
