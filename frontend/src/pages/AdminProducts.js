import React, { useEffect, useState } from "react";
import { Plus, Trash2, Package2, Edit3, X } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    price: "",
    image: "",
    category: "",
    gender: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.name ||
      !form.price ||
      !form.image ||
      !form.category ||
      !form.gender ||
      !form.description
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save product.");
        return;
      }

      setMessage(
        editingId
          ? "Product updated successfully ✅"
          : "Product added successfully ✅"
      );

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save product error:", error);
      setMessage("Server error while saving product.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      gender: product.gender || "",
      description: product.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete product.");
        return;
      }

      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Server error while deleting product.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
          Product Control
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          Manage Products 🧵
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
          Add, edit, delete, and organize your pashmina collection from one place.
        </p>
      </section>

      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#f5e8dc] flex items-center justify-center text-[#8a6d4b]">
              {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h3 className="text-2xl font-serif text-[#2f2a25]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <p className="text-sm text-gray-500">
                {editingId
                  ? "Update the product details below"
                  : "Fill in the product details below"}
              </p>
            </div>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ddd2c5] hover:bg-[#faf7f2]"
            >
              <X size={16} />
              Cancel Edit
            </button>
          )}
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-[#f8f4ee] border border-[#eadfce] px-4 py-3 text-sm text-[#2f2a25]">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitProduct} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="md:col-span-2 border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          >
            <option value="">Select Category</option>
            <option value="shawls">Shawls</option>
            <option value="scarves">Scarves</option>
            <option value="sweaters">Sweaters</option>
            <option value="cardigans">Cardigans</option>
            <option value="ponchos">Ponchos</option>
            <option value="caps">Caps</option>
          </select>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="md:col-span-2 border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          />

          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
          >
            {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#f5e8dc] flex items-center justify-center text-[#8a6d4b]">
            <Package2 size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-[#2f2a25]">
              Existing Products
            </h3>
            <p className="text-sm text-gray-500">
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-[#faf7f2] border border-[#eee4d8] p-6 text-gray-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl border border-[#eee4d8] shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="h-52 bg-[#f5efe6]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-[#2f2a25] truncate">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {product.category} • {product.gender}
                  </p>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-[#2f2a25]">
                      ${product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-xl hover:bg-[#f5e8dc] text-[#8a6d4b]"
                        title="Edit product"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-xl hover:bg-red-100 text-red-500"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}