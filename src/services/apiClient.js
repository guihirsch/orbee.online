const API_URL =
   import.meta.env.VITE_API_URL ||
   import.meta.env.VITE_API_BASE_URL ||
   "http://localhost:8000";

function getAuthToken() {
   try {
      return (
         localStorage.getItem("auth_token") ||
         localStorage.getItem("authToken") ||
         ""
      );
   } catch {
      return "";
   }
}

async function request(
   path,
   { method = "GET", headers = {}, body, auth = true } = {}
) {
   const url = `${API_URL}${path}`;
   const finalHeaders = {
      "Content-Type": "application/json",
      ...headers,
   };

   if (auth) {
      const token = getAuthToken();
      if (token) finalHeaders.Authorization = `Bearer ${token}`;
   }

   const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
   });

   let data;
   const contentType = response.headers.get("content-type") || "";
   if (contentType.includes("application/json")) {
      data = await response.json();
   } else {
      data = await response.text();
   }

   if (!response.ok) {
      const message = data?.detail || data?.message || response.statusText;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
   }

   return data;
}

export const apiClient = {
   get: (path, options) => request(path, { ...options, method: "GET" }),
   post: (path, body, options) =>
      request(path, { ...options, method: "POST", body }),
   put: (path, body, options) =>
      request(path, { ...options, method: "PUT", body }),
   patch: (path, body, options) =>
      request(path, { ...options, method: "PATCH", body }),
   delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default apiClient;
