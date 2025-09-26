import { apiClient } from "./apiClient";

export async function login({ email, password }) {
   const data = await apiClient.post(
      `/api/v1/auth/login`,
      { email, password },
      { auth: false }
   );
   if (!data?.access_token) throw new Error("Token não retornado pelo backend");
   localStorage.setItem("auth_token", data.access_token);
   return data;
}

export function logout() {
   localStorage.removeItem("auth_token");
}

export async function me() {
   return apiClient.get(`/api/v1/users/me`);
}

export default { login, logout, me };
