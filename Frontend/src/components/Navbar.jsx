import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Upload", path: "/upload" },
  { label: "Results", path: "/results" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-down entrance animation on mount
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "border-b-2 border-indigo-600 text-indigo-600 font-medium pb-0.5"
      : "text-gray-600 hover:text-indigo-600 transition-colors duration-200";

  return (
    <nav
      className={`bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
        >
          AI Resume Analyzer
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-6 items-center font-medium">
          {NAV_LINKS.map(({ label, path }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              {label}
            </Link>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          className="sm:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white/95 px-6 py-4 flex flex-col gap-4 font-medium">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={linkClass(path)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-left"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
