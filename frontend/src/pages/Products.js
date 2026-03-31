import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const subcategoryKeywords = [
  "Solid",
  "Ombre",
  "Patterned",
  "Reversible",
  "Classic",
];

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const gender = params.get("gender")?.toLowerCase();
  const category = params.get("category")?.toLowerCase();

  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const { user, addToCart, addToWishlist } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [gender, category]);

  const filtered = products.filter((product) => {
    const matchGender = gender
      ? product.gender?.toLowerCase() === gender
      : true;
    const matchCategory = category
      ? product.category?.toLowerCase() === category
      : true;

    return matchGender && matchCategory;
  });

  const grouped = {};
  filtered.forEach((product) => {
    const subcategory =
      subcategoryKeywords.find((k) =>
        product.name?.toLowerCase().includes(k.toLowerCase())
      ) || "Others";

    if (!grouped[subcategory]) grouped[subcategory] = [];
    grouped[subcategory].push(product);
  });

  const capital = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

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
    alert("Product added to wishlist ❤️");
  };

  return (
    <div className="p-6 md:p-8 bg-[#f8f4ee] min-h-screen">
      <h2 className="text-2xl md:text-3xl font-serif text-[#2f2a25] mb-8">
        {gender ? capital(gender) : "All"}{" "}
        {category ? capital(category) : "Products"}
      </h2>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#eee4d8] shadow-sm text-center text-gray-600">
          No products found.
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([subcategory, items]) => (
            <div key={subcategory}>
              <h3 className="text-xl md:text-2xl font-serif text-[#2f2a25] mb-5">
                {subcategory} {capital(category)}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.slice(0, visibleCount).map((product) => (
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
                      <div>
                        <h4 className="font-medium text-lg text-[#2f2a25]">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          ${product.price}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-2 flex-wrap">
                        <Link
                          to={`/products/${product._id}`}
                          className="px-4 py-2 border border-[#d8cec2] text-sm rounded-full hover:bg-gray-100"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-full hover:opacity-90"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className="px-4 py-2 bg-pink-600 text-white text-sm rounded-full hover:opacity-90"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > visibleCount && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}