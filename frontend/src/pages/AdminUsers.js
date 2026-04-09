import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const userMap = {};

    orders.forEach((order) => {
      const email = order.customer?.email;
      if (!email) return;

      if (!userMap[email]) {
        userMap[email] = {
          name: order.customer?.fullName || "Unknown",
          email,
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

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 border border-[#eadfce] shadow-sm">
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25]">
          Users 👥
        </h2>
        <p className="text-gray-600 mt-3">
          View your customers and their order activity.
        </p>
      </section>

      <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-gray-500">No users yet.</p>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-[#eee4d8] text-gray-500 text-sm">
                <th className="py-4">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-[#f3ebe2] hover:bg-[#faf7f2] transition"
                >
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
        )}
      </div>
    </div>
  );
}