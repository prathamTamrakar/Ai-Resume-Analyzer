import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import UploadResume from "./pages/UploadResume";
import Results from "./pages/Results";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/results" element={<Results />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
