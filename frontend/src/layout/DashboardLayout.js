import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function DashboardLayout() {
  const { cart, user, logout } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      location.pathname === path
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-[#f8f4ee]">
      <header className="bg-white/90 backdrop-blur border-b border-[#e8dfd3] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
            <h1 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Ambika
            </h1>
            <p className="text-sm text-gray-500">Pashmina Collection</p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              Home
            </Link>
            <Link
              to="/dashboard/profile"
              className={navLinkClass("/dashboard/profile")}
            >
              Profile
            </Link>
            <Link
              to="/dashboard/orders"
              className={navLinkClass("/dashboard/orders")}
            >
              Orders
            </Link>
            <Link
              to="/dashboard/settings"
              className={navLinkClass("/dashboard/settings")}
            >
              Settings
            </Link>
            <Link
              to="/dashboard/wishlist"
              className={navLinkClass("/dashboard/wishlist")}
            >
              Wishlist
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="text-sm text-gray-700 hover:text-black"
            >
              Shop
            </Link>

            <Link
              to="/cart"
              className="text-sm text-gray-700 hover:text-black"
            >
              Cart ({cart.length})
            </Link>

            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 bg-[#f8f4ee] border border-[#e8dfd3] rounded-full px-3 py-2 hover:bg-[#f3ede4] transition"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f3e5d6] flex items-center justify-center">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>

              <div className="hidden md:block text-left leading-tight">
                <p className="text-sm font-medium text-[#2f2a25]">
                  {user?.fullName || user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "My Account"}
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-[#2f2a25] text-white text-sm hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}