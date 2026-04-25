import React, { useEffect, useMemo, useState } from "react";
import { Search, PackageCheck, Truck, CheckCircle2, XCircle } from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  };

  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updatePaymentStatus = (id, newPaymentStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, paymentStatus: newPaymentStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        String(order.id || "").toLowerCase().includes(search) ||
        (order.customer?.fullName || "").toLowerCase().includes(search) ||
        (order.customer?.email || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ? true : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = {
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
          Order Control Center
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          Manage Orders 📦
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
          Review customer purchases, payment details, and update delivery
          progress from one premium workspace.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MiniStatCard
          title="Processing"
          value={stats.processing}
          icon={<PackageCheck size={18} />}
          color="bg-[#fff7ed] text-[#c2711d]"
        />
        <MiniStatCard
          title="Shipped"
          value={stats.shipped}
          icon={<Truck size={18} />}
          color="bg-[#eff6ff] text-[#2563eb]"
        />
        <MiniStatCard
          title="Delivered"
          value={stats.delivered}
          icon={<CheckCircle2 size={18} />}
          color="bg-[#eefbf3] text-[#15803d]"
        />
        <MiniStatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<XCircle size={18} />}
          color="bg-[#fef2f2] text-[#dc2626]"
        />
      </section>

      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-serif text-[#2f2a25]">Orders List</h3>
            <p className="text-gray-500 mt-1">
              Search customers or filter by delivery status
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by order, customer, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-[#ddd2c5] rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            >
              <option>All</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-gray-600">
          No matching orders found.
        </div>
      ) : (
        <section className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#2f2a25]">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.paymentMethod} type="paymentMethod" />

                  <select
                    value={order.paymentStatus || "Pending"}
                    onChange={(e) =>
                      updatePaymentStatus(order.id, e.target.value)
                    }
                    className="border border-[#ddd2c5] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d8b89c]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending Verification">
                      Pending Verification
                    </option>
                  </select>

                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border border-[#ddd2c5] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d8b89c]"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p className="text-[#2f2a25] font-medium">
                      {order.customer?.fullName || "Unknown"}
                    </p>
                    <p>{order.customer?.email || "-"}</p>
                    <p>{order.customer?.phone || "-"}</p>
                    <p>
                      {order.customer?.address || "-"},{" "}
                      {order.customer?.city || "-"},{" "}
                      {order.customer?.country || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Total:{" "}
                      <span className="font-semibold text-[#2f2a25]">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium text-[#2f2a25]">
                        {order.status}
                      </span>
                    </p>
                    <p>
                      Payment:{" "}
                      <span className="font-medium text-[#2f2a25]">
                        {order.paymentMethod}
                      </span>
                    </p>
                    <p>
                      Payment Status:{" "}
                      <span className="font-medium text-[#2f2a25]">
                        {order.paymentStatus || "Pending"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                    Item Count
                  </h4>
                  <div className="rounded-2xl bg-[#faf7f2] border border-[#eee4d8] p-4">
                    <p className="text-3xl font-semibold text-[#2f2a25]">
                      {order.items?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      products in this order
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#2f2a25] mb-4">
                  Ordered Items
                </h4>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {order.items?.map((item) => (
                    <div
                      key={`${order.id}-${item._id}`}
                      className="border border-[#eee4d8] rounded-2xl p-4 flex items-center gap-4 bg-[#fcfaf7]"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5efe6] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-[#2f2a25] truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.qty} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function MiniStatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-3xl font-semibold text-[#2f2a25] mt-2">{value}</h3>
    </div>
  );
}

function StatusBadge({ status, type }) {
  let className = "px-4 py-2 rounded-full text-sm font-medium ";

  if (type === "paymentMethod") {
    className += "bg-[#f5e8dc] text-[#8a6d4b]";
  } else if (type === "paymentStatus") {
    if (status === "Paid") className += "bg-[#eefbf3] text-[#15803d]";
    else if (status === "Pending") className += "bg-[#fff7ed] text-[#c2711d]";
    else className += "bg-[#f3f4f6] text-[#4b5563]";
  }

  return <span className={className}>{status}</span>;
}

export default AdminOrders;