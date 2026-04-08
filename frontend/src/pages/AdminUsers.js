import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Extract unique users from orders
    const userMap = {};

    orders.forEach((order) => {
      const email = order.customer?.email;

      if (!email) return;

      if (!userMap[email]) {
        userMap[email] = {
          name: order.customer?.fullName || "Unknown",
          email: email,
          phone: order.customer?.phone,
          orders: 1,
          totalSpent: Number(order.totalAmount || 0),
        };
      } else {
        userMap[email].orders += 1;
        userMap[email].totalSpent += Number(order.totalAmount || 0);
      }
    });

    setUsers(Object.values(userMap));
  };

  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 border border-[#eadfce] shadow-sm mb-8">
            <h2 className="text-4xl font-serif text-[#2f2a25]">
              Users 👥
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your customers and view their activity.
            </p>
          </section>

          <div className="bg-white rounded-3xl p-8 shadow text-gray-600">
            No users yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 border border-[#eadfce] shadow-sm">
          <h2 className="text-4xl font-serif text-[#2f2a25]">
            Users 👥
          </h2>
          <p className="text-gray-600 mt-2">
            View all customers and their shopping activity.
          </p>
        </section>

        {/* Users Table */}
        <div className="bg-white rounded-3xl p-6 shadow border border-[#eee4d8] overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b text-gray-500 text-sm">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-[#faf7f2]">
                  <td className="py-4 font-medium text-[#2f2a25]">
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{user.orders}</td>
                  <td className="font-semibold">
                    ${user.totalSpent.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}