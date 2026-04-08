import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    loadOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      const productList = Array.isArray(data) ? data : data.data || [];
      setProductsCount(productList.length);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  };

  const totalOrders = orders.length;
  const totalUsers = new Set(
    orders.map((order) => order.customer?.email).filter(Boolean)
  ).size;
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <div style={styles.main}>
      <h1 style={styles.pageTitle}>Dashboard Overview</h1>

      <div style={styles.statsGrid}>
        <StatCard title="Total Products" value={productsCount} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} highlight />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p style={{ color: "#6B7280" }}>No orders available yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>
                    {order.customer?.fullName || "Unknown"}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      color:
                        order.status === "Delivered"
                          ? "green"
                          : order.status === "Shipped"
                          ? "#2563EB"
                          : order.status === "Cancelled"
                          ? "#DC2626"
                          : "#F97316",
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </td>
                  <td style={styles.td}>{order.paymentMethod}</td>
                  <td style={styles.td}>${Number(order.totalAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div
      style={{
        ...styles.statCard,
        backgroundColor: highlight ? "#F97316" : "#fff",
        color: highlight ? "#fff" : "#111827",
      }}
    >
      <p style={styles.statTitle}>{title}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

const styles = {
  main: {
    padding: "40px",
    overflowY: "auto",
    backgroundColor: "#FFF7ED",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
  },

  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "32px",
    marginBottom: "32px",
    color: "#1F2937",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  statCard: {
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  statTitle: {
    fontSize: "14px",
    opacity: 0.8,
  },

  statValue: {
    fontSize: "26px",
    fontWeight: 700,
    marginTop: "8px",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    marginBottom: "16px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeadRow: {
    textAlign: "left",
    borderBottom: "2px solid #E5E7EB",
    color: "#6B7280",
  },

  tableRow: {
    borderBottom: "1px solid #E5E7EB",
    height: "56px",
  },

  th: {
    padding: "12px 8px",
  },

  td: {
    padding: "12px 8px",
  },
};