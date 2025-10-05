import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./components/contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AOIViewer from "./pages/AOIViewer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
   // Aplicar tema orbee globalmente
   useEffect(() => {
      const savedTheme = localStorage.getItem("theme") || "orbee";
      document.documentElement.setAttribute("data-theme", savedTheme);
      localStorage.setItem("theme", savedTheme);
   }, []);

   return (
      <AuthProvider>
         <Layout>
            <Routes>
               <Route path="/" element={<Home />} />

               <Route
                  path="/perfil"
                  element={
                     <ProtectedRoute>
                        <Profile />
                     </ProtectedRoute>
                  }
               />
               <Route path="/aoi-viewer" element={<AOIViewer />} />
            </Routes>
         </Layout>
      </AuthProvider>
   );
}

export default App;
