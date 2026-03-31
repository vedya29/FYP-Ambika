import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, X } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function AdminRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Admin registration failed");
        return;
      }

      // After successful registration → go to admin login
      navigate("/admin/login");
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="bg-[#1f2937] p-8 rounded-xl shadow-2xl w-full max-w-md relative text-white">
        
        {/* Close */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-serif text-center mb-2">
          Register <span className="text-[#f97316]">Admin</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Create Administrator Account
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

          <div className="flex items-center gap-2 bg-[#111827] border border-gray-700 px-4 py-2 rounded">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white"
            />
          </div>

          <button className="w-full bg-[#f97316] text-white py-2 rounded font-semibold">
            Register Admin
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <Link
            to="/admin/login"
            className="text-[#f97316] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
