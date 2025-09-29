import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const RegisterForm = ({ onSwitchToLogin, onSuccess }) => {
   const [formData, setFormData] = useState({
      full_name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const { register } = useAuth();

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
      if (!formData.full_name.trim()) {
         setError("Nome completo é obrigatório");
         return false;
      }
      if (formData.full_name.trim().length < 2) {
         setError("Nome deve ter pelo menos 2 caracteres");
         return false;
      }
      if (!formData.email.trim()) {
         setError("Email é obrigatório");
         return false;
      }
      if (!formData.username.trim()) {
         setError("Nome de usuário é obrigatório");
         return false;
      }
      if (formData.username.trim().length < 3) {
         setError("Nome de usuário deve ter pelo menos 3 caracteres");
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
      if (formData.password !== formData.confirmPassword) {
         setError("Senhas não coincidem");
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
         await register({
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            username: formData.username.trim(),
            password: formData.password,
         });
         onSuccess?.();
      } catch (err) {
         setError(err.message || "Erro ao criar conta. Tente novamente.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="w-full max-w-md mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar</h2>
            <p className="text-gray-600">Crie sua conta OrBee</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
               </div>
            )}

            <div>
               <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Nome Completo
               </label>
               <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type="text"
                     id="full_name"
                     name="full_name"
                     value={formData.full_name}
                     onChange={handleInputChange}
                     placeholder="Seu nome completo"
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
               </div>
            </div>

            <div>
               <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Email
               </label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="seu@email.com"
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
               </div>
            </div>

            <div>
               <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Nome de Usuário
               </label>
               <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type="text"
                     id="username"
                     name="username"
                     value={formData.username}
                     onChange={handleInputChange}
                     placeholder="seu_usuario"
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
               </div>
               <p className="text-xs text-gray-500 mt-1">
                  Usado para identificação na plataforma (apenas letras, números
                  e _)
               </p>
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
                     placeholder="Mínimo 6 caracteres"
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

            <div>
               <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
               >
                  Confirmar Senha
               </label>
               <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type={showConfirmPassword ? "text" : "password"}
                     id="confirmPassword"
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     placeholder="Confirme sua senha"
                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                     disabled={isLoading}
                  />
                  <button
                     type="button"
                     onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                     }
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     disabled={isLoading}
                  >
                     {showConfirmPassword ? (
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
                     Criando conta...
                  </div>
               ) : (
                  "Criar Conta"
               )}
            </button>
         </form>

         <div className="mt-6 text-center">
            <p className="text-gray-600">
               Já tem uma conta?{" "}
               <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  disabled={isLoading}
               >
                  Entrar
               </button>
            </p>
         </div>

         <div className="mt-6 text-xs text-gray-500 text-center">
            Ao criar uma conta, você concorda com nossos{" "}
            <a href="#" className="text-primary-600 hover:text-primary-700">
               Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary-600 hover:text-primary-700">
               Política de Privacidade
            </a>
         </div>
      </div>
   );
};

export default RegisterForm;
