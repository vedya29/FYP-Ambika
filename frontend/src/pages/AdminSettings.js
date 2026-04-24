import React, { useState } from "react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState(
    localStorage.getItem("storeName") || "Ambika Pashmina"
  );
  const [email, setEmail] = useState(
    localStorage.getItem("storeEmail") || "admin@ambika.com"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("storePhone") || ""
  );
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem("storeName", storeName);
    localStorage.setItem("storeEmail", email);
    localStorage.setItem("storePhone", phone);

    setMessage("Settings saved successfully ✅");
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
          Admin Control
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25]">
          Settings ⚙️
        </h2>
        <p className="text-gray-600 mt-3">
          Manage your store information and admin preferences.
        </p>
      </section>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm space-y-5"
      >
        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl">
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Store Name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Support Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Support Phone</label>
          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none"
          />
        </div>

        <button className="px-6 py-3 bg-black text-white rounded-full">
          Save Settings
        </button>
      </form>
    </div>
  );
}