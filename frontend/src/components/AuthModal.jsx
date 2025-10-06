import React, { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock, MapPin } from "lucide-react";
import useAuth from "../hooks/useAuth";

const AuthModal = ({
   isOpen,
   onClose,
   initialMode = "login",
   onSuccessRedirect,
}) => {
   const [mode, setMode] = useState(initialMode);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const { login, register } = useAuth();

   const [formData, setFormData] = useState({
      email: "",
      password: "",
      full_name: "",
   });

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         let result;
         if (mode === "login") {
            result = await login(formData.email, formData.password);
         } else {
            result = await register(formData);
         }

         if (result.success) {
            onClose();
            setFormData({
               email: "",
               password: "",
               full_name: "",
            });
            // Executar callback de redirecionamento se fornecido
            if (onSuccessRedirect) {
               onSuccessRedirect();
            }
         } else {
            setError(result.error);
         }
      } catch (err) {
         setError("Unexpected error. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2f4538] rounded-lg flex items-center justify-center">
                     <User className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                     {mode === "login" ? "Login" : "Create Account"}
                  </h2>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                     {error}
                  </div>
               )}

               {/* Email */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Email
                  </label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f4538] focus:border-transparent"
                        placeholder="seu@email.com"
                     />
                  </div>
               </div>

               {/* Password */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Password
                  </label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f4538] focus:border-transparent"
                        placeholder="••••••••"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     >
                        {showPassword ? (
                           <EyeOff className="w-4 h-4" />
                        ) : (
                           <Eye className="w-4 h-4" />
                        )}
                     </button>
                  </div>
               </div>

               {/* Full name - always visible for registration */}
               {mode === "register" && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                     </label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                           type="text"
                           name="full_name"
                           value={formData.full_name}
                           onChange={handleChange}
                           required
                           className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f4538] focus:border-transparent"
                           placeholder="Your full name"
                        />
                     </div>
                  </div>
               )}

               {/* Submit button */}
               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2f4538] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1f2e1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading
                     ? "Loading..."
                     : mode === "login"
                       ? "Login"
                       : "Create Account"}
               </button>

               {/* Toggle between login and registration */}
               <div className="text-center">
                  <button
                     type="button"
                     onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                     }
                     className="text-sm text-[#2f4538] hover:underline"
                  >
                     {mode === "login"
                        ? "Don't have an account? Create account"
                        : "Already have an account? Login"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default AuthModal;
