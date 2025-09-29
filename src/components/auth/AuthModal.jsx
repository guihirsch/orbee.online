import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
   const [mode, setMode] = useState(initialMode);

   if (!isOpen) return null;

   const handleSuccess = () => {
      onClose();
   };

   const handleSwitchMode = (newMode) => {
      setMode(newMode);
   };

   return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
         <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
               className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
               onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
               {/* Close button */}
               <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
               >
                  <X className="w-6 h-6" />
               </button>

               {/* Content */}
               <div className="p-8">
                  {mode === "login" ? (
                     <LoginForm
                        onSwitchToRegister={() => handleSwitchMode("register")}
                        onSuccess={handleSuccess}
                     />
                  ) : (
                     <RegisterForm
                        onSwitchToLogin={() => handleSwitchMode("login")}
                        onSuccess={handleSuccess}
                     />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthModal;
