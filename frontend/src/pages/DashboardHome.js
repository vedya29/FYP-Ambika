import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function DashboardHome() {
  const { user } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState("female");

  const firstName =
    user?.fullName?.split(" ")[0] || user?.name || "Valued Customer";

  useEffect(() => {
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

    fetchProducts();
  }, []);

  const genderProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.gender?.toLowerCase() === selectedGender.toLowerCase()
    );
  }, [products, selectedGender]);

  const categoryCards = useMemo(() => {
    const grouped = {};

    genderProducts.forEach((product) => {
      const category = product.category || "Collection";

      if (!grouped[category]) {
        grouped[category] = {
          name: category,
          image: product.image,
          count: 1,
        };
      } else {
        grouped[category].count += 1;
      }
    });

    return Object.values(grouped);
  }, [genderProducts]);

  const featuredProducts = useMemo(() => {
    return genderProducts.slice(0, 4);
  }, [genderProducts]);

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-12 border border-[#eadfce] shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Welcome Back
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Hello, {firstName}
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7">
            Explore our elegant pashmina collection by style and category.
            Choose your section and discover timeless pieces made for comfort
            and beauty.
          </p>
        </div>
      </section>

      {/* Gender Switch */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Shop by Collection
            </h3>
            <p className="text-gray-600 mt-1">
              Choose a collection to browse categories more easily
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedGender("female")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                selectedGender === "female"
                  ? "bg-black text-white"
                  : "bg-[#f8f4ee] text-[#2f2a25] border border-[#e8dfd3]"
              }`}
            >
              Female ✨
            </button>

            <button
              onClick={() => setSelectedGender("male")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                selectedGender === "male"
                  ? "bg-black text-white"
                  : "bg-[#f8f4ee] text-[#2f2a25] border border-[#e8dfd3]"
              }`}
            >
              Male 🌿
            </button>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              {selectedGender === "female" ? "Female" : "Male"} Categories
            </h3>
            <p className="text-gray-600 mt-1">
              Click a category to explore matching products
            </p>
          </div>

          <Link
            to={`/products?gender=${selectedGender}`}
            className="text-sm font-medium text-black hover:underline"
          >
            View All
          </Link>
        </div>

        {categoryCards.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-center text-gray-600">
            No products available in this collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((category) => (
              <div
                key={category.name}
                onClick={() =>
                  navigate(
                    `/products?gender=${selectedGender}&category=${encodeURIComponent(
                      category.name.toLowerCase()
                    )}`
                  )
                }
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#eee4d8] hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-full h-64 overflow-hidden bg-[#f5efe6]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h4 className="text-xl font-serif text-[#2f2a25] mb-1">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {category.count} item{category.count > 1 ? "s" : ""}
                  </p>
                  <span className="inline-block text-sm font-medium text-black hover:underline">
                    Explore Category →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Featured for {selectedGender === "female" ? "Her" : "Him"}
            </h3>
            <p className="text-gray-600 mt-1">
              A few beautiful picks from this collection
            </p>
          </div>

          <Link
            to={`/products?gender=${selectedGender}`}
            className="text-sm font-medium text-black hover:underline"
          >
            Shop Collection
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-center text-gray-600">
            No featured products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#eee4d8] hover:shadow-md transition flex flex-col"
              >
                <div className="w-full h-72 overflow-hidden bg-[#f5efe6]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-lg font-serif text-[#2f2a25] mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.category || "Pashmina Collection"}
                  </p>
                  <p className="text-lg font-semibold text-[#2f2a25] mb-4">
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

      {/* Bottom Brand Message */}
      <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#eee4d8] shadow-sm text-center">
        <div className="text-4xl mb-3">
          {selectedGender === "female" ? "🌸" : "🌿"}
        </div>
        <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25] mb-3">
          Discover your perfect pashmina style
        </h3>
        <p className="text-gray-700 leading-7 max-w-2xl mx-auto">
          Browse by collection, explore category variations, and enjoy a more
          beautiful and effortless shopping experience with Ambika.
        </p>
      </section>
    </div>
  );
}

export default DashboardHome;