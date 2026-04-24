import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Products", icon: Package, path: "/admin/products" },
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },,
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f8f4ee]">
      <aside className="w-[280px] bg-[#1f1a17] text-white px-5 py-6 flex flex-col shadow-2xl">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="cursor-pointer mb-8"
        >
          <h1 className="text-3xl font-serif tracking-wide">Ambika</h1>
          <p className="text-sm text-[#d4b08a] mt-1">Admin Panel</p>
        </div>

        <div className="h-px bg-white/10 mb-6" />

        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition ${
                  active
                    ? "bg-[#c88a52] text-white shadow-md"
                    : "text-[#f5ede5] hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-[#f5ede5] hover:bg-white/10 transition"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}