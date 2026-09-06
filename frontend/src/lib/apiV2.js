/* Cliente da API v2 — portal comunitário (leitura PÚBLICA, sem token).
 *
 * Base: VITE_API_V2_URL; senão deriva de VITE_API_URL trocando
 * /api/v1 → /api/v2; último fallback localhost:8000/api/v2.
 */

const V1_FALLBACK = "http://localhost:8000/api/v1";

function resolveBase() {
   const explicit = import.meta.env.VITE_API_V2_URL;
   if (explicit) return explicit.replace(/\/$/, "");
   const v1 = import.meta.env.VITE_API_URL || V1_FALLBACK;
   if (v1.includes("/api/v1")) return v1.replace("/api/v1", "/api/v2");
   return "http://localhost:8000/api/v2";
}

export const API_V2_BASE = resolveBase();

async function get(path, params = {}) {
   const qs = new URLSearchParams();
   for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") qs.append(k, v);
   }
   const url = `${API_V2_BASE}${path}${qs.toString() ? `?${qs}` : ""}`;
   let res;
   try {
      res = await fetch(url);
   } catch (e) {
      throw new Error(`API v2 inalcançável (${API_V2_BASE}). Verifique o backend.`);
   }
   if (!res.ok) {
      let detail = res.statusText;
      try {
         detail = (await res.json()).detail || detail;
      } catch {
         /* mantém statusText */
      }
      throw new Error(`API v2: ${detail}`);
   }
   return res.json();
}

export const listBasins = () => get("/basins");
export const getMethods = (params) => get("/methods", params);
export const getSummary = (params) => get("/summary", params);
export const getReaches = (params) => get("/reaches", params);
export const getReach = (id, params) =>
   get(`/reaches/${encodeURIComponent(id)}`, params);
export const getTilejson = (params) => get("/tilejson", params);
export const getSrSummary = (params) => get("/sr-summary", params);

/* Paleta das bandas otimizada para legibilidade sobre satélite
 * (identidade orbee; revisão R2). */
export const BAND_COLORS = {
   Urgente: "#FF4D5E",
   Alta: "#FFB020",
   Média: "#A3D614",
   Baixa: "#7FB069",
};

export const BAND_ORDER = ["Baixa", "Média", "Alta", "Urgente"];
