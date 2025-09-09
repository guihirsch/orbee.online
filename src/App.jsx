import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import MeadowGreen from "./pages/MeadowGreen";
import TestDashboard from "./teste/Dashboard";

function App() {
  // Aplicar tema orbee globalmente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'orbee';
    document.documentElement.setAttribute('data-theme', savedTheme);
    localStorage.setItem('theme', savedTheme);
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meadow-green" element={<MeadowGreen />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/teste" element={<TestDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
