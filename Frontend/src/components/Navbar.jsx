import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        AI Resume Analyzer
      </Link>

      <div className="flex gap-6 items-center text-gray-700 font-medium">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload Resume</Link>
        <Link to="/results">Review Results</Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
