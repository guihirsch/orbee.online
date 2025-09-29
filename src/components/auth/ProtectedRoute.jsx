import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAuth();
   const location = useLocation();

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
               <p className="text-gray-600">Carregando...</p>
            </div>
         </div>
      );
   }

   if (!isAuthenticated) {
      // Redirecionar para a página de login, mas manter a URL de destino
      return <Navigate to="/" state={{ from: location }} replace />;
   }

   return children;
};

export default ProtectedRoute;
