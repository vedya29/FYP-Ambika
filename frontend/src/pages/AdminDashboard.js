

export default function AdminDashboard() {
  return (
    <div style={styles.main}>
      <h1 style={styles.pageTitle}>Dashboard Overview</h1>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Products" value="128" />
        <StatCard title="Total Orders" value="342" />
        <StatCard title="Total Users" value="210" />
        <StatCard title="Revenue" value="$12,450" highlight />
      </div>

      {/* Recent Orders */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Recent Orders</h2>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th>Order ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.tableRow}>
              <td>#ORD1023</td>
              <td>John Doe</td>
              <td style={{ color: "#F97316", fontWeight: 600 }}>
                Pending
              </td>
              <td>$240</td>
            </tr>
            <tr style={styles.tableRow}>
              <td>#ORD1024</td>
              <td>Sarah Khan</td>
              <td style={{ color: "green", fontWeight: 600 }}>
                Delivered
              </td>
              <td>$180</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================
// Components
// =============================

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

// =============================
// Styles
// =============================

const styles = {
  main: {
  padding: "40px",
  overflowY: "auto",
  backgroundColor: "#FFF7ED",
  fontFamily: "Inter, sans-serif",
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
    height: "48px",
  },
};
