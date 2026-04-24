import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user, addToCart, addToWishlist, cart } = useCart();

  const [products, setProducts] = useState([]);
  const [activeGender, setActiveGender] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesGender =
        activeGender === "all"
          ? true
          : (product.gender || "").toLowerCase() === activeGender;

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === ""
          ? true
          : (product.name || "").toLowerCase().includes(search) ||
            (product.category || "").toLowerCase().includes(search) ||
            (product.gender || "").toLowerCase().includes(search) ||
            (product.description || "").toLowerCase().includes(search);

      return matchesGender && matchesSearch;
    });
  }, [products, activeGender, searchTerm]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/dashboard" } });
      return;
    }
    addToCart(product);
    alert("Added to cart 🛒");
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/dashboard" } });
      return;
    }
    addToWishlist(product);
    alert("Added to wishlist ❤️");
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Welcome Back
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Hello, {user?.fullName || user?.name || "Valued Customer"}
          </h1>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Discover timeless pashmina elegance, manage your orders, save your
            favorite pieces, and enjoy a personalized shopping experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
            >
              Shop Collection
            </Link>
            <Link
              to="/dashboard/orders"
              className="px-6 py-3 border border-[#2f2a25] text-[#2f2a25] rounded-full hover:bg-[#f5efe6]"
            >
              View Orders
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-serif text-[#2f2a25] mb-2">
                Shop by Collection
              </h2>
              <p className="text-gray-600">
                Choose a collection and browse products more easily
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveGender("female")}
                className={`px-6 py-3 rounded-full border transition ${
                  activeGender === "female"
                    ? "bg-[#f5efe6] border-[#d8c9b8] text-[#2f2a25]"
                    : "bg-white border-[#e6d8c9] text-[#2f2a25] hover:bg-[#faf6f1]"
                }`}
              >
                Female ✨
              </button>

              <button
                onClick={() => setActiveGender("male")}
                className={`px-6 py-3 rounded-full border transition ${
                  activeGender === "male"
                    ? "bg-[#f5efe6] border-[#d8c9b8] text-[#2f2a25]"
                    : "bg-white border-[#e6d8c9] text-[#2f2a25] hover:bg-[#faf6f1]"
                }`}
              >
                Male 🌿
              </button>

              <button
                onClick={() => setActiveGender("all")}
                className={`px-6 py-3 rounded-full border transition ${
                  activeGender === "all"
                    ? "bg-[#f5efe6] border-[#d8c9b8] text-[#2f2a25]"
                    : "bg-white border-[#e6d8c9] text-[#2f2a25] hover:bg-[#faf6f1]"
                }`}
              >
                All Products
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#ddd2c5] rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#d8b89c]"
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
                Featured Products
              </h3>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium text-black hover:underline"
            >
              View All
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#eee4d8] shadow-sm text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="text-2xl font-serif text-[#2f2a25] mb-2">
                No matching products found
              </h4>
              <p className="text-gray-600">
                Try another keyword or change the collection filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#eee4d8] shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="w-full h-72 overflow-hidden bg-[#f5efe6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                      <h4 className="text-xl font-serif text-[#2f2a25] mb-1 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.category || "Pashmina Collection"}
                      </p>
                      <p className="text-lg font-semibold text-[#2f2a25]">
                        ${product.price}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                      <Link
                        to={`/products/${product._id}`}
                        className="w-full text-center px-4 py-2 rounded-full border border-[#d8cec2] text-sm hover:bg-gray-100"
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full px-4 py-2 rounded-full bg-black text-white text-sm hover:opacity-90"
                      >
                        Add to Cart 🛒
                      </button>

                      <button
                        onClick={() => handleAddToWishlist(product)}
                        className="w-full px-4 py-2 rounded-full bg-[#f9e6ea] text-[#9a4d5d] text-sm hover:bg-[#f6d9df]"
                      >
                        Wishlist ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Wishlist Items</p>
            <p className="text-4xl font-semibold text-[#2f2a25]">❤️</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Cart Items</p>
            <p className="text-4xl font-semibold text-[#2f2a25]">{cart.length}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Account Status</p>
            <p className="text-4xl font-semibold text-[#2f2a25]">Active</p>
          </div>
        </section> */}
      </div>
    </div>
  );
}