import {
   createContext,
   useContext,
   useEffect,
   useState,
   useCallback,
} from "react";
import {
   register as registerApi,
   login as loginApi,
   logout as logoutApi,
   me,
} from "../services/authService";

const AuthContext = createContext();

export const useAuthContext = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error(
         "useAuthContext deve ser usado dentro de um AuthProvider"
      );
   }
   return context;
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const bootstrap = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const token = localStorage.getItem("auth_token");
         if (token) {
            const userData = await me();
            setUser(userData);
         } else {
            setUser(null);
         }
      } catch (err) {
         console.warn("Erro ao verificar autenticação:", err);
         setUser(null);
         // Limpar token inválido
         localStorage.removeItem("auth_token");
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      bootstrap();
   }, [bootstrap]);

   const register = async (userData) => {
      setError(null);
      try {
         await registerApi(userData);
         await bootstrap();
      } catch (e) {
         setError(e?.message || "Falha no cadastro");
         throw e;
      }
   };

   const login = async (credentials) => {
      setError(null);
      try {
         await loginApi(credentials);
         await bootstrap();
      } catch (e) {
         setError(e?.message || "Falha no login");
         throw e;
      }
   };

   const logout = async () => {
      try {
         await logoutApi();
      } catch (e) {
         console.warn("Erro ao fazer logout:", e);
      } finally {
         setUser(null);
         setError(null);
      }
   };

   const clearError = () => {
      setError(null);
   };

   const value = {
      user,
      loading,
      error,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      refresh: bootstrap,
      clearError,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
