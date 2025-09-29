import { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const AuthButton = ({ onOpenAuthModal }) => {
   const [showUserMenu, setShowUserMenu] = useState(false);
   const { user, isAuthenticated, logout } = useAuth();

   const handleLogout = async () => {
      try {
         await logout();
         setShowUserMenu(false);
      } catch (error) {
         console.error("Erro ao fazer logout:", error);
      }
   };

   if (!isAuthenticated) {
      return (
         <button onClick={onOpenAuthModal} className="btn-primary">
            Entrar
         </button>
      );
   }

   return (
      <div className="relative">
         <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
         >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
               <User className="w-4 h-4 text-primary-600" />
            </div>
            <span className="hidden md:block font-medium">
               {user?.full_name || user?.username || "Usuário"}
            </span>
         </button>

         {showUserMenu && (
            <>
               {/* Backdrop */}
               <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
               />

               {/* Menu */}
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                     <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                           {user?.full_name || "Usuário"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                     </div>

                     <Link
                        to="/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                     >
                        <User className="w-4 h-4 mr-3" />
                        Meu Perfil
                     </Link>

                     <button
                        onClick={() => {
                           setShowUserMenu(false);
                           // Navegar para configurações
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                     >
                        <Settings className="w-4 h-4 mr-3" />
                        Configurações
                     </button>

                     <div className="border-t border-gray-100">
                        <button
                           onClick={handleLogout}
                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                           <LogOut className="w-4 h-4 mr-3" />
                           Sair
                        </button>
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default AuthButton;
