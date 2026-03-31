import React, { useState } from "react";
import { useCart } from "../context/CartContext";

function DashboardSettings() {
  const { user, setUser } = useCart();

  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    notifications: user?.notifications ?? true,
    offers: user?.offers ?? true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...form,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Settings updated successfully ✨");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#f5e8dc] via-[#f8f4ee] to-[#efe3d3] rounded-3xl p-8 border border-[#eadfce] shadow-sm">
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-3">
          Settings ⚙️
        </h2>
        <p className="text-gray-700">
          Customize your account and preferences
        </p>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm space-y-8"
      >
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded">
            {message}
          </div>
        )}

        {/* Personal Info */}
        <div>
          <h3 className="text-xl font-serif mb-4">👤 Personal Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border px-4 py-2 rounded"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border px-4 py-2 rounded"
            />
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              className="border px-4 py-2 rounded"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border px-4 py-2 rounded"
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-xl font-serif mb-4">📍 Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street Address"
              className="border px-4 py-2 rounded md:col-span-2"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="border px-4 py-2 rounded"
            />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="border px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-xl font-serif mb-4">🔔 Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="notifications"
                checked={form.notifications}
                onChange={handleChange}
              />
              Enable notifications
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="offers"
                checked={form.offers}
                onChange={handleChange}
              />
              Receive special offers ✨
            </label>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="text-xl font-serif mb-4">🔐 Security</h3>
          <input
            type="password"
            placeholder="New Password (optional)"
            className="border px-4 py-2 rounded w-full md:w-1/2"
          />
        </div>

        {/* Save */}
        <button className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default DashboardSettings;