import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored);
  }, []);

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <h2>No Orders Yet 🛍️</h2>
        <p>Start shopping to see your orders here.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={styles.card}>
          
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h2 style={styles.orderId}>
                Order No. {order.id}
              </h2>

              <p style={styles.date}>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <span style={styles.status}>
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div style={styles.items}>
            {order.items.map((item) => (
              <div key={item._id} style={styles.item}>
                <img src={item.image} alt="" style={styles.image} />

                <div>
                  <p style={styles.name}>{item.name}</p>
                  <p style={styles.qty}>
                    Qty: {item.qty} × ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div style={styles.footer}>
            <div>
              <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "40px",
    background: "#FFF7ED",
    minHeight: "100vh",
  },
  title: {
    fontSize: "32px",
    fontFamily: "Playfair Display",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  orderId: {
    fontSize: "20px",
    fontWeight: "600",
  },
  date: {
    color: "#6B7280",
    fontSize: "14px",
  },
  status: {
    background: "#F97316",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  items: {
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  name: {
    fontWeight: "500",
  },
  qty: {
    fontSize: "14px",
    color: "#6B7280",
  },
  footer: {
    borderTop: "1px solid #eee",
    paddingTop: "12px",
    fontSize: "14px",
  },
  empty: {
    textAlign: "center",
    marginTop: "100px",
  },
};