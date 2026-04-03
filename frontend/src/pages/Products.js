import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const initialGender = params.get("gender")?.toLowerCase() || "";
  const initialCategory = params.get("category")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const { user, addToCart, addToWishlist } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.data || [];
        setProducts(productList);
      })
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);

  useEffect(() => {
    setSelectedGender(initialGender);
    setSelectedCategory(initialCategory);
  }, [initialGender, initialCategory]);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedGender, selectedCategory, searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchGender = selectedGender
        ? product.gender?.toLowerCase() === selectedGender
        : true;

      const matchCategory = selectedCategory
        ? product.category?.toLowerCase() === selectedCategory
        : true;

      const matchSearch = searchTerm
        ? product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchGender && matchCategory && matchSearch;
    });
  }, [products, selectedGender, selectedCategory, searchTerm]);

  const categoryCards = useMemo(() => {
    const grouped = {};

    const genderFiltered = products.filter((product) =>
      selectedGender
        ? product.gender?.toLowerCase() === selectedGender
        : true
    );

    genderFiltered.forEach((product) => {
      const categoryName = product.category || "Collection";
      const key = categoryName.toLowerCase();

      if (!grouped[key]) {
        grouped[key] = {
          name: categoryName,
          image: product.image,
          count: 1,
        };
      } else {
        grouped[key].count += 1;
      }
    });

    return Object.values(grouped);
  }, [products, selectedGender]);

  const capital = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const pageTitle = selectedGender
    ? `${capital(selectedGender)} Collection`
    : "All Products";

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory("");
    navigate(gender ? `/products?gender=${gender}` : "/products");
  };

  const handleCategoryClick = (categoryName) => {
    const normalized = categoryName.toLowerCase();
    setSelectedCategory(normalized);

    if (selectedGender) {
      navigate(
        `/products?gender=${selectedGender}&category=${encodeURIComponent(
          normalized
        )}`
      );
    } else {
      navigate(`/products?category=${encodeURIComponent(normalized)}`);
    }
  };

  const clearFilters = () => {
    setSelectedGender("");
    setSelectedCategory("");
    setSearchTerm("");
    navigate("/products");
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    addToCart(product);
    alert("Product added to cart 🛒");
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    addToWishlist(product);
    alert("Product added to wishlist 💖");
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Ambika Collection
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            {pageTitle}
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Explore elegant pashmina products by collection, category, and
            style. Discover pieces crafted for comfort, warmth, and timeless
            beauty.
          </p>
        </section>

        {/* Gender + Search */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h3 className="text-2xl font-serif text-[#2f2a25] mb-2">
                Shop by Collection
              </h3>
              <p className="text-gray-600">
                Choose a collection and browse products more easily
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleGenderChange("female")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                  selectedGender === "female"
                    ? "bg-black text-white"
                    : "bg-[#f8f4ee] text-[#2f2a25] border border-[#e8dfd3]"
                }`}
              >
                Female ✨
              </button>

              <button
                onClick={() => handleGenderChange("male")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                  selectedGender === "male"
                    ? "bg-black text-white"
                    : "bg-[#f8f4ee] text-[#2f2a25] border border-[#e8dfd3]"
                }`}
              >
                Male 🌿
              </button>

              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-full text-sm font-medium border border-[#e8dfd3] text-[#2f2a25] hover:bg-gray-100"
              >
                All Products
              </button>
            </div>
          </div>

          <div className="mt-5">
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            />
          </div>
        </section>

        {/* Category Cards */}
        {categoryCards.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
                  Categories
                </h3>
                <p className="text-gray-600 mt-1">
                  Browse by your preferred variation
                </p>
              </div>

              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    if (selectedGender) {
                      navigate(`/products?gender=${selectedGender}`);
                    } else {
                      navigate("/products");
                    }
                  }}
                  className="text-sm font-medium text-black hover:underline"
                >
                  Clear Category
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryCards.map((category) => {
                const isActive =
                  selectedCategory === category.name.toLowerCase();

                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`text-left bg-white rounded-3xl overflow-hidden shadow-sm border transition ${
                      isActive
                        ? "border-black shadow-md"
                        : "border-[#eee4d8] hover:shadow-md"
                    }`}
                  >
                    <div className="w-full h-52 overflow-hidden bg-[#f5efe6]">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h4 className="text-lg font-serif text-[#2f2a25] mb-1">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {category.count} item{category.count > 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
                {selectedCategory
                  ? `${capital(selectedCategory)} Products`
                  : "Featured Products"}
              </h3>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-center text-gray-600">
              No products found for this selection.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
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
                      <div>
                        <h4 className="text-xl font-serif text-[#2f2a25] mb-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category || "Pashmina Collection"}
                        </p>
                        <p className="text-lg font-semibold text-[#2f2a25]">
                          ${product.price}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="px-4 py-2 border border-[#d8cec2] text-sm rounded-full hover:bg-gray-100"
                        >
                          View 👀
                        </Link>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-black text-white text-sm rounded-full hover:opacity-90"
                        >
                          Add to Cart 🛒
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className="px-4 py-2 bg-[#f6d9df] text-[#9a4d5d] text-sm rounded-full hover:bg-[#f2cad3]"
                        >
                          Wishlist 💖
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length > visibleCount && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}