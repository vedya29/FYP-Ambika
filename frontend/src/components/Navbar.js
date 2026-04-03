import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, user, setUser } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const goHome = () => {
    const storedUser = localStorage.getItem("user");
    navigate(storedUser ? "/dashboard" : "/");
  };

  return (
    <nav className="bg-white border-b border-[#eee4d8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div onClick={goHome} className="cursor-pointer">
          <h1 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
            Ambika
          </h1>
          <p className="text-xs text-gray-500">Pashmina</p>
        </div>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="hover:text-black text-gray-700">
            Shop
          </Link>
          <Link to="/about" className="hover:text-black text-gray-700">
            About
          </Link>
          <Link to="/contact" className="hover:text-black text-gray-700">
            Contact
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Wishlist */}
          <Link
            to={user ? "/dashboard/wishlist" : "/login"}
            className="text-gray-700 hover:text-black"
          >
            ❤️
          </Link>

          {/* Cart */}
          <Link
            to={user ? "/cart" : "/login"}
            className="text-gray-700 hover:text-black"
          >
            🛒 ({cart.length})
          </Link>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile */}
              <div
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-2 cursor-pointer bg-[#f8f4ee] px-3 py-2 rounded-full border border-[#e8dfd3]"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#f3e5d6] flex items-center justify-center">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <span className="hidden md:block text-sm">
                  {user?.fullName || user?.name || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-black text-white rounded-full hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 bg-black text-white rounded-full"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}