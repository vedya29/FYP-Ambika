import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/categories";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ gender: "Men", name: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitCategory = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ gender: "Men", name: "" });
    setEditingId(null);
    fetchCategories();
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ gender: cat.gender, name: cat.name });
  };

  const deleteCategory = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const grouped = {
    Men: categories.filter((c) => c.gender === "Men"),
    Women: categories.filter((c) => c.gender === "Women"),
  };

  return (
    <div>
      <h1 className="text-2xl font-serif mb-6">Manage Categories</h1>

      {/* FORM */}
      <form
        onSubmit={submitCategory}
        className="flex gap-4 items-center mb-8"
      >
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="border p-2 rounded"
        >
          <option>Men</option>
          <option>Women</option>
        </select>

        <input
          placeholder="Category name (e.g. Shawls)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded flex-1"
          required
        />

        <button className="bg-orange-500 text-white px-6 py-2 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-2 gap-10">
        {["Men", "Women"].map((gender) => (
          <div key={gender}>
            <h2 className="text-xl font-serif mb-4">{gender}</h2>

            {grouped[gender].map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center border p-3 rounded mb-2"
              >
                <span>{cat.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
