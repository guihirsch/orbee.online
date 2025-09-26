import { apiClient } from "./apiClient";

export async function listObservations(params = {}) {
   const qs = new URLSearchParams(params).toString();
   return apiClient.get(`/api/v1/observations${qs ? `?${qs}` : ""}`);
}

export async function createObservation(payload) {
   return apiClient.post(`/api/v1/observations`, payload);
}

export async function getObservation(id) {
   return apiClient.get(`/api/v1/observations/${id}`);
}

export async function updateObservation(id, payload) {
   return apiClient.put(`/api/v1/observations/${id}`, payload);
}

export async function deleteObservation(id) {
   return apiClient.delete(`/api/v1/observations/${id}`);
}

export default {
   listObservations,
   createObservation,
   getObservation,
   updateObservation,
   deleteObservation,
};
