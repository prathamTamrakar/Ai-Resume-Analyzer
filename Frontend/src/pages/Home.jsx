import { Link } from "react-router-dom";
import { FileSearch, Upload, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar 
      <nav className="flex justify-between items-center py-4 px-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">AI Resume Analyzer</h1>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      </nav>
      */}
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-20 px-4">
        <h2 className="text-4xl font-bold text-gray-800 max-w-2xl leading-tight">
          Improve Your Resume with AI-Powered Insights 🚀
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl">
          Get instant feedback, score your resume, and enhance it for top tech jobs.
        </p>

        <Link
          to="/upload"
          className="mt-8 px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload Resume
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mt-28 px-6">
        <Link
          to="/upload"
          className="p-6 bg-gray-100 hover:bg-gray-200 rounded-xl text-center shadow transition"
        >
          <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Upload Resume</h3>
          <p className="text-gray-600 text-sm mt-1">
            Upload PDF or DOCX and get ready to analyze.
          </p>
        </Link>

        <Link
          to="/review"
          className="p-6 bg-gray-100 hover:bg-gray-200 rounded-xl text-center shadow transition"
        >
          <FileSearch className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Review Results</h3>
          <p className="text-gray-600 text-sm mt-1">
            Get score, strengths, weaknesses, and suggestions.
          </p>
        </Link>

        <Link
          to="/login"
          className="p-6 bg-gray-100 hover:bg-gray-200 rounded-xl text-center shadow transition"
        >
          <LogIn className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Account Login</h3>
          <p className="text-gray-600 text-sm mt-1">
            Login to track history and improvements.
          </p>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        © 2025 AI Resume Analyzer · Built with ❤️ for job seekers
      </footer>
    </div>
  );
}
