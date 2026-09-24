/* Cliente da API v2 — portal comunitário (leitura PÚBLICA, sem token).
 *
 * Dois modos:
 *  - vivo (padrão): VITE_API_V2_URL; senão deriva de VITE_API_URL trocando
 *    /api/v1 → /api/v2; último fallback localhost:8000/api/v2.
 *  - estático (VITE_V2_STATIC=1): lê JSON/tiles de /data/basins (mesma
 *    origem, sem backend). Filtros de banda e TileJSON resolvidos no cliente.
 *    Escrita (adotar) fica indisponível — a página degrada com aviso.
 */

const V1_FALLBACK = "http://localhost:8000/api/v1";

export const V2_STATIC = (import.meta.env.VITE_V2_STATIC ?? "") === "1";
// Mesma origem: respeita o base do Vite ("/" em dev, "/orbee.online/" no Pages).
export const V2_DATA_BASE = (
   import.meta.env.VITE_V2_DATA ?? `${import.meta.env.BASE_URL}data/basins`
).replace(/\/$/, "");

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

export const listBasins = () => (V2_STATIC ? sget("/basins.json") : get("/basins"));
export const getMethods = (params) =>
   V2_STATIC ? sget(staticPath(params, "methods.json")) : get("/methods", params);
export const getSummary = (params) =>
   V2_STATIC ? sget(staticPath(params, "summary.json")) : get("/summary", params);
export const getSrSummary = (params) =>
   V2_STATIC ? sget(staticPath(params, "sr_summary.json")) : get("/sr-summary", params);
export const getReaches = (params) =>
   V2_STATIC ? staticReaches(params) : get("/reaches", params);
export const getReach = (id, params) =>
   V2_STATIC ? staticReach(id, params) : get(`/reaches/${encodeURIComponent(id)}`, params);
export const getTilejson = (params) =>
   V2_STATIC ? staticTilejson(params) : get("/tilejson", params);
export const getManifest = (params) =>
   V2_STATIC ? sget(staticPath(params, "manifest.json")) : get("/manifest", params);
/* Relatório de validação V1–V6 (só existe no payload estático; null se ausente). */
export const getValidation = async (params) => {
   if (!V2_STATIC) return null;
   try {
      return await sget(staticPath(params, "validation.json"));
   } catch {
      return null;
   }
};

/* ---- modo estático (mesma origem, sem backend) ---- */

async function sget(path) {
   let res;
   try {
      res = await fetch(`${V2_DATA_BASE}${path}`);
   } catch {
      throw new Error(`Dados estáticos inalcançáveis (${V2_DATA_BASE}).`);
   }
   if (!res.ok) throw new Error(`Dados estáticos: ${res.status} em ${path}`);
   return res.json();
}

function staticPath(params = {}, file) {
   const basin = params.basin || "taquari";
   const version = params.version || "v1";
   return `/${encodeURIComponent(basin)}/${encodeURIComponent(version)}/${file}`;
}

async function staticVersion(basin, version) {
   if (version) return version;
   const all = await sget("/basins.json");
   const b = all.find((x) => x.basin === basin) || all[0];
   if (!b) throw new Error(`Bacia estática inexistente: ${basin}`);
   return b.latest;
}

async function staticReaches(params = {}) {
   const basin = params.basin || "taquari";
   const version = await staticVersion(basin, params.version);
   const fc = await sget(`/${encodeURIComponent(basin)}/${encodeURIComponent(version)}/reaches.geojson`);
   let feats = fc.features || [];
   if (params.band) {
      if (!BAND_ORDER.includes(params.band)) throw new Error(`API v2: Banda inválida: ${params.band}`);
      feats = feats.filter((f) => f.properties?.band === params.band);
   }
   if (params.min_priority) {
      if (!BAND_ORDER.includes(params.min_priority))
         throw new Error(`API v2: Banda inválida: ${params.min_priority}`);
      const cut = BAND_ORDER.indexOf(params.min_priority);
      feats = feats.filter((f) => BAND_ORDER.indexOf(f.properties?.band) >= cut);
   }
   return { ...fc, features: feats };
}

async function staticReach(id, params = {}) {
   const basin = params.basin || "taquari";
   const version = await staticVersion(basin, params.version);
   const fc = await sget(`/${encodeURIComponent(basin)}/${encodeURIComponent(version)}/reaches.geojson`);
   const f = (fc.features || []).find((x) => x.properties?.id === id);
   if (!f) throw new Error(`API v2: Trecho inexistente: ${id}`);
   const out = { ...f };
   try {
      const doc = await sget(`/${encodeURIComponent(basin)}/${encodeURIComponent(version)}/sr_summary.json`);
      const r = (doc.reaches || []).find((x) => x.id === id);
      if (r) out.sr = r;
   } catch {
      /* sem SR nesta versão */
   }
   try {
      const cc = await sget(`/${encodeURIComponent(basin)}/${encodeURIComponent(version)}/crosscheck.json`);
      const c = (cc.reaches || []).find((x) => x.id === id);
      if (c) out.crosscheck = c;
   } catch {
      /* sem crosscheck nesta versão */
   }
   return out;
}

async function staticTilejson(params = {}) {
   const basin = params.basin || "taquari";
   const version = await staticVersion(basin, params.version);
   const reach_id = params.reach_id;
   const layer = params.layer || "ndvi_sr";
   if (!reach_id) throw new Error("API v2: trecho inválido: undefined");
   if (layer !== "ndvi_sr") throw new Error(`API v2: Camada inválida: ${layer}`);
   const tilePath =
      `/${encodeURIComponent(basin)}/${encodeURIComponent(version)}` +
      `/sr/${encodeURIComponent(reach_id)}/tiles/${encodeURIComponent(layer)}`;
   return {
      tilejson: "2.2.0",
      name: `${basin}/${reach_id}/${layer}`,
      tiles: [`${V2_DATA_BASE}${tilePath}/{z}/{x}/{y}.png`],
      minzoom: 13,
      maxzoom: 17,
      tileSize: 256,
   };
}

/* Paleta das bandas otimizada para legibilidade sobre satélite
 * (identidade orbee; revisão R2). */
export const BAND_COLORS = {
   Urgente: "#FF4D5E",
   Alta: "#FFB020",
   Média: "#A3D614",
   Baixa: "#7FB069",
};

export const BAND_ORDER = ["Baixa", "Média", "Alta", "Urgente"];
