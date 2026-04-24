import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
    prepareChartData(savedOrders);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProductsCount(Array.isArray(data) ? data.length : data.data?.length || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const prepareChartData = (orders) => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dailyOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });

      const revenue = dailyOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
      );

      days.push({
        label,
        revenue,
        orders: dailyOrders.length,
      });
    }

    setChartData(days);
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const totalUsers = new Set(
    orders.map((order) => order.customer?.email).filter(Boolean)
  ).size;

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Store Analytics
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Admin Dashboard 📊
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Track products, orders, customers, and earnings from your Ambika admin panel.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Products" value={productsCount} />
          <StatCard title="Total Orders" value={orders.length} />
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Revenue" value={`Rs. ${totalRevenue.toFixed(2)}`} highlight />
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Earnings Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Revenue and purchase activity from the last 7 days
            </p>
          </div>

          <div className="h-80 flex items-end gap-4 border-b border-[#eee4d8] pb-4">
            {chartData.map((day) => {
              const height = (day.revenue / maxRevenue) * 230;

              return (
                <div key={day.label} className="flex-1 flex flex-col items-center justify-end">
                  <div className="mb-2 text-xs text-gray-500">
                    Rs. {day.revenue}
                  </div>

                  <div
                    className="w-full max-w-[70px] bg-[#c88a52] rounded-t-2xl transition-all"
                    style={{ height: `${Math.max(height, 8)}px` }}
                  ></div>

                  <p className="text-xs text-gray-600 mt-3">{day.label}</p>
                  <p className="text-xs text-gray-400">
                    {day.orders} order{day.orders !== 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
            <h3 className="text-2xl font-serif text-[#2f2a25] mb-4">
              Purchase Summary
            </h3>
            <SummaryRow label="Completed Payments" value={orders.filter(o => o.paymentStatus === "Paid").length} />
            <SummaryRow label="Pending Payments" value={orders.filter(o => o.paymentStatus !== "Paid").length} />
            <SummaryRow label="Processing Orders" value={orders.filter(o => o.status === "Processing").length} />
            <SummaryRow label="Delivered Orders" value={orders.filter(o => o.status === "Delivered").length} />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
            <h3 className="text-2xl font-serif text-[#2f2a25] mb-4">
              Recent Activity
            </h3>

            {orders.slice(0, 4).length === 0 ? (
              <p className="text-gray-500">No recent orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-[#f1e7dc] pb-3"
                  >
                    <div>
                      <p className="font-medium text-[#2f2a25]">
                        Order No. {order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.fullName || "Customer"}
                      </p>
                    </div>
                    <p className="font-semibold text-[#2f2a25]">
                      Rs. {Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div
      className={`rounded-3xl p-6 border shadow-sm ${
        highlight
          ? "bg-[#c88a52] text-white border-[#c88a52]"
          : "bg-white text-[#2f2a25] border-[#eee4d8]"
      }`}
    >
      <p className={highlight ? "text-white/80 text-sm" : "text-gray-500 text-sm"}>
        {title}
      </p>
      <h3 className="text-3xl font-semibold mt-2">{value}</h3>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-[#f1e7dc] py-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-[#2f2a25]">{value}</span>
    </div>
  );
}