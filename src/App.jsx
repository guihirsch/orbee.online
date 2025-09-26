import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import MeadowGreen from "./pages/MeadowGreen";

function App() {
   // Aplicar tema orbee globalmente
   useEffect(() => {
      const savedTheme = localStorage.getItem("theme") || "orbee";
      document.documentElement.setAttribute("data-theme", savedTheme);
      localStorage.setItem("theme", savedTheme);
   }, []);

   return (
      <Layout>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plataforma" element={<Platform />} />
            <Route path="/teste" element={<MeadowGreen />} />
         </Routes>
      </Layout>
   );
}

export default App;
