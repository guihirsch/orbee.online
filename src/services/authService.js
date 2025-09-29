import { apiClient } from "./apiClient";

export async function register({ email, password, full_name, username }) {
   const data = await apiClient.post(
      `/api/v1/auth/register`,
      { email, password, full_name, username },
      { auth: false }
   );
   if (!data?.access_token) throw new Error("Token não retornado pelo backend");
   localStorage.setItem("auth_token", data.access_token);
   return data;
}

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

export async function logout() {
   try {
      await apiClient.post(`/api/v1/auth/logout`);
   } catch (error) {
      console.warn("Erro ao fazer logout no servidor:", error);
   } finally {
      localStorage.removeItem("auth_token");
   }
}

export async function me() {
   return apiClient.get(`/api/v1/auth/me`);
}

export default { register, login, logout, me };
