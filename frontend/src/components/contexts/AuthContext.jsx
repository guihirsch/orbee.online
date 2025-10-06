import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth deve ser usado dentro de AuthProvider");
   }
   return context;
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [token, setToken] = useState(localStorage.getItem("orbee_token"));

   // URL base da API
   const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

   // Função para fazer requisições autenticadas
   const apiRequest = async (endpoint, options = {}) => {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
         headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
         },
         ...options,
      };

      try {
         const response = await fetch(url, config);

         if (!response.ok) {
            if (response.status === 401) {
               // Token expirado ou inválido
               logout();
               throw new Error("Session expired");
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
         }

         return await response.json();
      } catch (error) {
         console.error("Request error:", error);
         throw error;
      }
   };

   // Login
   const login = async (email, password) => {
      try {
         const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
         });

         setToken(data.access_token);
         setUser(data.user);
         localStorage.setItem("orbee_token", data.access_token);

         return { success: true, user: data.user };
      } catch (error) {
         return { success: false, error: error.message };
      }
   };

   // Registro
   const register = async (userData) => {
      try {
         const data = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
         });

         setToken(data.access_token);
         setUser(data.user);
         localStorage.setItem("orbee_token", data.access_token);

         return { success: true, user: data.user };
      } catch (error) {
         return { success: false, error: error.message };
      }
   };

   // Logout
   const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("orbee_token");
   };

   // Verificar usuário atual
   const getCurrentUser = async () => {
      if (!token) {
         setLoading(false);
         return;
      }

      try {
         const data = await apiRequest("/auth/me");
         setUser(data);
      } catch (error) {
         console.error("Error getting current user:", error);
         logout();
      } finally {
         setLoading(false);
      }
   };

   // Verificar autenticação na inicialização
   useEffect(() => {
      getCurrentUser();
   }, [token]);

   const value = {
      user,
      loading,
      token,
      login,
      register,
      logout,
      apiRequest,
      isAuthenticated: !!user,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
