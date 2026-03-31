import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_BASE_URL = "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/dashboard";
  navigate(from, { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        const fallbackUser = {
          email: data.email,
          role: data.role,
        };
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        setUser(fallbackUser);
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f4f0]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3"
        >
          <X />
        </button>

        <h2 className="text-2xl font-serif text-center mb-6">
          Login to <span className="text-[#c8a27e]">AMBIKA</span>
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          />

          <button className="w-full bg-[#c8a27e] text-white py-2 rounded">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#c8a27e] font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;