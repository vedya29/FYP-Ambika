import React, { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    gender: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      const productList = Array.isArray(data) ? data : data.data || [];
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
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
        setMessage(data.message || "Failed to add product");
        return;
      }

      setMessage("Product added successfully ✅");
      setForm({
        name: "",
        price: "",
        image: "",
        category: "",
        gender: "",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage("Server error while adding product");
    }
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
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Server error while deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Manage Products 🧵
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Add new pashmina products, manage your collection, and keep your
            store updated beautifully.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <h3 className="text-2xl font-serif text-[#2f2a25] mb-6">
            Add New Product
          </h3>

          {message && (
            <div className="mb-4 rounded-2xl bg-[#f8f4ee] px-4 py-3 text-sm text-[#2f2a25] border border-[#eadfce]">
              {message}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              required
              className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c] md:col-span-2"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
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
              required
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
              className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c] md:col-span-2"
            />

            <button
              type="submit"
              className="md:col-span-2 px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
            >
              Add Product
            </button>
          </form>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <h3 className="text-2xl font-serif text-[#2f2a25] mb-6">
            Existing Products
          </h3>

          {products.length === 0 ? (
            <p className="text-gray-600">No products available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-[#fff] rounded-3xl overflow-hidden border border-[#eee4d8] shadow-sm"
                >
                  <div className="w-full h-64 overflow-hidden bg-[#f5efe6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h4 className="text-xl font-serif text-[#2f2a25] mb-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">
                      {product.category} • {product.gender}
                    </p>
                    <p className="text-lg font-semibold text-[#2f2a25] mb-2">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminProducts;