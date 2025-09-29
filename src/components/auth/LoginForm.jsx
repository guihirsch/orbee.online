import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = ({ onSwitchToRegister, onSuccess }) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const { login } = useAuth();

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
      // Limpar erro quando usuário começar a digitar
      if (error) setError("");
   };

   const validateForm = () => {
      if (!formData.email.trim()) {
         setError("Email é obrigatório");
         return false;
      }
      if (!formData.password.trim()) {
         setError("Senha é obrigatória");
         return false;
      }
      if (formData.password.length < 6) {
         setError("Senha deve ter pelo menos 6 caracteres");
         return false;
      }
      return true;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setError("");

      try {
         await login(formData);
         onSuccess?.();
      } catch (err) {
         setError(
            err.message || "Erro ao fazer login. Verifique suas credenciais."
         );
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="w-full max-w-md mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Entrar</h2>
            <p className="text-gray-600">Acesse sua conta OrBee</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
               </div>
            )}

            <div>
               <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Email ou Celular
               </label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type="text"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="seu@email.com ou (11) 99999-9999"
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
               </div>
            </div>

            <div>
               <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Senha
               </label>
               <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type={showPassword ? "text" : "password"}
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     placeholder="Sua senha"
                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     disabled={isLoading}
                  >
                     {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                     ) : (
                        <Eye className="w-5 h-5" />
                     )}
                  </button>
               </div>
            </div>

            <button
               type="submit"
               disabled={isLoading}
               className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isLoading ? (
                  <div className="flex items-center justify-center">
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                     Entrando...
                  </div>
               ) : (
                  "Entrar"
               )}
            </button>
         </form>

         <div className="mt-6 text-center">
            <p className="text-gray-600">
               Não tem uma conta?{" "}
               <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={isLoading}
               >
                  Cadastre-se
               </button>
            </p>
         </div>

         <div className="mt-6 text-center">
            <button
               type="button"
               className="text-sm text-gray-500 hover:text-gray-700"
               disabled={isLoading}
            >
               Esqueceu sua senha?
            </button>
         </div>
      </div>
   );
};

export default LoginForm;
