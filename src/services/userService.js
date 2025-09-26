import { apiClient } from "./apiClient";

export async function getCurrentUser() {
   return apiClient.get(`/api/v1/users/me`);
}

export default { getCurrentUser };
