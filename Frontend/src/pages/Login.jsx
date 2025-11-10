import { useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (!res.data.token) {
        alert("Invalid email or password ❌");
        return;
      }

      // Save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");
      navigate("/upload"); // redirect to resume upload page

    } catch (error) {
      console.log(error);
      alert("Login failed ❌ Server or credentials issue");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600 mb-3" />
          <h2 className="text-3xl font-semibold text-gray-800">Login</h2>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="mt-2 w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="mt-2 w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
