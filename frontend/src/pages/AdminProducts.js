import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/products";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= CREATE ================= */
  const addProduct = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ name: "", price: "", category: "", stock: "" });
    fetchProducts();
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  /* ================= EDIT ================= */
  const startEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setEditingId(null);
    setFormData({ name: "", price: "", category: "", stock: "" });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif mb-6">Admin – Products</h2>

      {/* ================= FORM ================= */}
      <form
        onSubmit={editingId ? updateProduct : addProduct}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          placeholder="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          className="border p-2 rounded"
        />

        <button className="col-span-4 bg-orange-500 text-white py-2 rounded">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t text-center">
              <td className="p-2">{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>
              <td className="flex justify-center gap-4 py-2">
                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-gray-500 text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;
