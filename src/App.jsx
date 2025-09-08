import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import MeadowGreen from "./pages/MeadowGreen";
import TestDashboard from "./teste/Dashboard";

function App() {
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
