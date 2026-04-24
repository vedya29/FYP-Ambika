import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

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
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
          Store Overview
        </p>
        <h1 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          Admin Dashboard ✨
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-3xl leading-7">
          Track products, orders, users, and revenue from one premium dashboard.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={productsCount}
          icon={<Package size={20} />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Revenue"
          value={`$${revenue.toFixed(2)}`}
          icon={<DollarSign size={20} />}
          highlight
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-serif text-[#2f2a25]">
              Recent Orders
            </h2>
            <span className="text-sm text-gray-500">Latest activity</span>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders available yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-[#eee4d8] rounded-2xl p-4"
                >
                  <div>
                    <p className="font-medium text-[#2f2a25]">
                      #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer?.fullName || "Unknown Customer"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-600">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#f5e8dc] text-[#8a6d4b] text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <h2 className="text-2xl font-serif text-[#2f2a25] mb-5">
            Quick Summary
          </h2>

          <div className="space-y-4">
            <SummaryRow label="Orders Pending" value={countByStatus(orders, "Processing")} />
            <SummaryRow label="Orders Shipped" value={countByStatus(orders, "Shipped")} />
            <SummaryRow label="Orders Delivered" value={countByStatus(orders, "Delivered")} />
            <SummaryRow label="Orders Cancelled" value={countByStatus(orders, "Cancelled")} />
          </div>

          <div className="mt-6 rounded-2xl bg-[#f8f4ee] border border-[#eee4d8] p-4">
            <div className="flex items-center gap-2 text-[#2f2a25] font-medium mb-2">
              <ArrowUpRight size={16} />
              Store Insight
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function countByStatus(orders, status) {
  return orders.filter((order) => order.status === status).length;
}

function StatCard({ title, value, icon, highlight }) {
  return (
    <div
      className={`rounded-3xl p-6 border shadow-sm ${
        highlight
          ? "bg-[#c88a52] text-white border-[#c88a52]"
          : "bg-white text-[#2f2a25] border-[#eee4d8]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={highlight ? "text-white/90" : "text-[#8a6d4b]"}>
          {icon}
        </div>
      </div>
      <p className={highlight ? "text-white/80 text-sm" : "text-gray-500 text-sm"}>
        {title}
      </p>
      <h3 className="text-3xl font-semibold mt-2">{value}</h3>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f1e7dc] pb-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-[#2f2a25]">{value}</span>
    </div>
  );
}