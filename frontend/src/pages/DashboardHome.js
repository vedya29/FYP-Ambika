import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function DashboardHome() {
  const { user } = useCart();
  const [products, setProducts] = useState([]);

  const firstName =
    user?.fullName?.split(" ")[0] || user?.name || "Valued Customer";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-[#efe3d3] to-[#f8f4ee] rounded-3xl p-8 md:p-12 border border-[#eadfce] shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Welcome Back
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Hello, {firstName}
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7">
            Discover timeless pashmina elegance, manage your orders, save your
            favorite pieces, and enjoy a personalized shopping experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
            >
              Shop Collection
            </Link>
            <Link
              to="/dashboard/orders"
              className="px-6 py-3 rounded-full border border-black text-black hover:bg-black hover:text-white transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Featured Products
            </h3>
            <p className="text-gray-600 mt-1">
              Explore elegant picks from our pashmina collection
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-black hover:underline"
          >
            View All
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#eee4d8] shadow-sm text-gray-600">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eee4d8] hover:shadow-md transition flex flex-col"
              >
                <div className="w-full h-64 overflow-hidden bg-[#f5efe6]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h4 className="text-lg font-serif text-[#2f2a25] mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category || "Pashmina Collection"}
                  </p>
                  <p className="font-semibold text-[#2f2a25] mb-4">
                    ${product.price}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                    className="mt-auto inline-block w-full text-center px-4 py-2 rounded-full bg-black text-white hover:opacity-90"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#eee4d8] shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
              Elegance & Warmth
            </p>
            <h3 className="text-2xl md:text-4xl font-serif text-[#2f2a25] mb-4">
              Crafted for timeless beauty
            </h3>
            <p className="text-gray-700 leading-7">
              Our pashmina collection blends comfort, sophistication, and
              heritage. Explore premium styles, discover handcrafted elegance,
              and enjoy a refined shopping experience with Ambika.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
              alt="Pashmina collection"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;