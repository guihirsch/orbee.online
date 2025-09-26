import { apiClient } from "./apiClient";

export async function searchMunicipalities(query, source = "osm") {
   const qs = new URLSearchParams({ q: query, source }).toString();
   return apiClient.get(`/api/v1/geo/search?${qs}`);
}

export async function getMunicipalityGeometry(ibgeCode, source = "osm", q) {
   const params = new URLSearchParams({ source });
   if (q) params.set("q", q);
   return apiClient.get(
      `/api/v1/geo/municipalities/${ibgeCode}/geometry?${params.toString()}`
   );
}
