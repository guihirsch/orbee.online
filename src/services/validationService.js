import { apiClient } from "./apiClient";

export async function listValidations(params = {}) {
   const qs = new URLSearchParams(params).toString();
   return apiClient.get(`/api/v1/validations${qs ? `?${qs}` : ""}`);
}

export async function createValidation(payload) {
   return apiClient.post(`/api/v1/validations`, payload);
}

export default { listValidations, createValidation };
