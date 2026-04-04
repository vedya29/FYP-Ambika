import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee4d8] p-10 md:p-14 max-w-2xl w-full text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2f2a25] mb-3">
            No Orders Yet
          </h2>
          <p className="text-gray-600 leading-7 mb-8">
            Once you place an order, it will appear here so you can track your
            shopping history beautifully.
          </p>

          <Link
            to="/products"
            className="inline-block px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
          Purchase History
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          My Orders 📦
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
          Review your recent purchases, payment details, and shipping
          information in one place.
        </p>
      </section>

      <section className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-serif text-[#2f2a25]">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex w-fit px-4 py-2 rounded-full bg-[#f5e8dc] text-[#8a6d4b] text-sm font-medium">
                  {order.status}
                </span>
                <span className="inline-flex w-fit px-4 py-2 rounded-full bg-[#eef8ee] text-green-700 text-sm font-medium">
                  {order.paymentStatus || "Pending"}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-[#2f2a25] mb-3">
                  Items
                </h4>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5efe6]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-[#2f2a25]">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.qty} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-2">
                    Shipping Details
                  </h4>
                  <p className="text-gray-700">{order.customer.fullName}</p>
                  <p className="text-gray-600">{order.customer.email}</p>
                  <p className="text-gray-600">{order.customer.phone}</p>
                  <p className="text-gray-600">
                    {order.customer.address}, {order.customer.city},{" "}
                    {order.customer.country}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-2">
                    Payment
                  </h4>
                  <p className="text-gray-600">{order.paymentMethod}</p>
                  <p className="text-gray-600">
                    Status: {order.paymentStatus || "Pending"}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#2f2a25] mb-2">
                    Total
                  </h4>
                  <p className="text-xl font-semibold text-[#2f2a25]">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Orders;