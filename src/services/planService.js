import { apiClient } from "./apiClient";

export async function getPlanForMunicipality(
   ibgeCode,
   { source = "osm" } = {}
) {
   const params = new URLSearchParams();
   if (source) params.set("source", source);
   // Período automático: últimos 30 dias (backend)
   return apiClient.get(
      `/api/v1/plan/municipality/${ibgeCode}?${params.toString()}`
   );
}
