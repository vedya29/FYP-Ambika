import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm mb-8">
            <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
              Manage Orders 📦
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
              Review customer purchases, payment details, and update order
              progress from one place.
            </p>
          </section>

          <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-gray-600">
            No orders available yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Manage Orders 📦
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Review customer purchases, payment details, and update order
            progress from one place.
          </p>
        </section>

        <section className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#2f2a25]">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-[#f5e8dc] text-[#8a6d4b] text-sm font-medium">
                    {order.paymentMethod}
                  </span>

                  <span className="px-4 py-2 rounded-full bg-[#eef8ee] text-green-700 text-sm font-medium">
                    {order.paymentStatus || "Pending"}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="border border-[#ddd2c5] rounded-full px-4 py-2 text-sm outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                    Customer Details
                  </h4>
                  <p className="text-gray-700">
                    {order.customer?.fullName || "Unknown"}
                  </p>
                  <p className="text-gray-600">{order.customer?.email}</p>
                  <p className="text-gray-600">{order.customer?.phone}</p>
                  <p className="text-gray-600">
                    {order.customer?.address}, {order.customer?.city},{" "}
                    {order.customer?.country}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                    Order Summary
                  </h4>
                  <p className="text-gray-700 mb-2">
                    Total:{" "}
                    <span className="font-semibold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                  <p className="text-gray-700">
                    Payment Status:{" "}
                    <span className="font-medium">
                      {order.paymentStatus || "Pending"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#2f2a25] mb-4">
                  Ordered Items
                </h4>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item._id}`}
                      className="flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5efe6]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-[#2f2a25]">
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
      </div>
    </div>
  );
}

export default AdminOrders;