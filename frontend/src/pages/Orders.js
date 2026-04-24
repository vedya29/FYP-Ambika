import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored);
  }, []);

  const steps = ["Processing", "Shipped", "Delivered"];

  const getStepIndex = (status) => {
    if (status === "Shipped") return 1;
    if (status === "Delivered") return 2;
    return 0;
  };

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

      {orders.map((order) => {
        const activeStep = getStepIndex(order.status);

        return (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <div>
                <h2 style={styles.orderId}>Order No. {order.id}</h2>

                <p style={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <span style={styles.status}>{order.status}</span>
            </div>

            <div style={styles.trackingBox}>
              {steps.map((step, index) => {
                const completed = index <= activeStep;

                return (
                  <div key={step} style={styles.stepWrapper}>
                    <div
                      style={{
                        ...styles.stepCircle,
                        background: completed ? "#F97316" : "#E5E7EB",
                        color: completed ? "#fff" : "#6B7280",
                      }}
                    >
                      {index + 1}
                    </div>

                    <p
                      style={{
                        ...styles.stepText,
                        color: completed ? "#111827" : "#9CA3AF",
                        fontWeight: completed ? 600 : 400,
                      }}
                    >
                      {step}
                    </p>

                    {index !== steps.length - 1 && (
                      <div
                        style={{
                          ...styles.stepLine,
                          background: index < activeStep ? "#F97316" : "#E5E7EB",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.items}>
              {order.items.map((item) => (
                <div key={item._id} style={styles.item}>
                  <img src={item.image} alt={item.name} style={styles.image} />

                  <div>
                    <p style={styles.name}>{item.name}</p>
                    <p style={styles.qty}>
                      Qty: {item.qty} × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <div>
                <p>
                  <strong>Total:</strong> Rs. {Number(order.totalAmount).toFixed(2)}
                </p>
                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    gap: "20px",
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
    padding: "10px 16px",
    borderRadius: "14px",
    fontSize: "13px",
    height: "fit-content",
  },
  trackingBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
    padding: "18px",
    borderRadius: "16px",
    background: "#FFF7ED",
    border: "1px solid #FED7AA",
  },
  stepWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  stepCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    zIndex: 2,
  },
  stepText: {
    marginLeft: "10px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  stepLine: {
    height: "3px",
    flex: 1,
    marginLeft: "14px",
    marginRight: "14px",
    borderRadius: "10px",
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