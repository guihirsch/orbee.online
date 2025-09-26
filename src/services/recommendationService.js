import { apiClient } from "./apiClient";

export async function getRecommendations(params = {}) {
   const qs = new URLSearchParams(params).toString();
   return apiClient.get(`/api/v1/recommendations${qs ? `?${qs}` : ""}`);
}

export default { getRecommendations };
