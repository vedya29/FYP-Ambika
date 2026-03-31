import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { label: "Products", icon: Package, path: "/admin/products" },
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          AMBIKA <span style={{ color: "#F97316" }}>Admin</span>
        </div>

        <div style={styles.divider} />

        {menu.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.menuItem,
                ...(active ? styles.activeItem : {}),
              }}
            >
              <Icon size={20} />
              {item.label}
            </div>
          );
        })}

        <div style={styles.logout} onClick={() => navigate("/")}>
          <LogOut size={20} /> Logout
        </div>
      </aside>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg,#020617,#020617)",
    color: "#fff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    background: "#334155",
    marginBottom: "24px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  activeItem: {
    background: "#F97316",
    color: "#fff",
  },
  logout: {
    marginTop: "auto",
    color: "#F97316",
    display: "flex",
    gap: "12px",
    cursor: "pointer",
  },
};
