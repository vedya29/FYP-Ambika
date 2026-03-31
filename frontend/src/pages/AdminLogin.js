import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, X } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Admin login failed");
        return;
      }

      // ✅ STORE ADMIN AUTH DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // must be 'admin'
      localStorage.setItem("admin", JSON.stringify(data.admin || {}));

      // ✅ Redirect to Admin Dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="bg-[#1f2937] p-8 rounded-xl shadow-2xl w-full max-w-md relative text-white">
        
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-serif text-center mb-2">
          AMBIKA <span className="text-[#f97316]">Admin</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Secure Administrator Access
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-[#111827] border border-gray-700 px-4 py-2 rounded">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#111827] border border-gray-700 px-4 py-2 rounded">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <button className="w-full bg-[#f97316] text-white py-2 rounded font-semibold">
            Login as Admin
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center text-sm mt-4 text-gray-400">
          Don’t have an admin account?{" "}
          <Link
            to="/admin/register"
            className="text-[#f97316] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
