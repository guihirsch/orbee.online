import { useEffect, useState, useCallback } from "react";
import {
   login as loginApi,
   logout as logoutApi,
   me,
} from "../services/authService";

export function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const bootstrap = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const u = await me();
         setUser(u);
      } catch (err) {
         setUser(null);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      bootstrap();
   }, [bootstrap]);

   async function login(credentials) {
      setError(null);
      try {
         await loginApi(credentials);
         await bootstrap();
      } catch (e) {
         setError(e?.message || "Falha no login");
         throw e;
      }
   }

   function logout() {
      logoutApi();
      setUser(null);
   }

   return {
      user,
      loading,
      error,
      login,
      logout,
      refresh: bootstrap,
      isAuthenticated: !!user,
   };
}

export default useAuth;
