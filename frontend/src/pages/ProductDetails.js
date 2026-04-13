import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart, addToWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        const actualProduct = data?.data || data;
        setProduct(actualProduct);
      } catch (err) {
        console.error("Product details error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    addToCart(product);
    alert("Product added to cart 🛒");
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    addToWishlist(product);
    alert("Added to wishlist ❤️");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#eee4d8] shadow-sm text-center max-w-xl w-full">
          <h2 className="text-3xl font-serif text-[#2f2a25] mb-3">
            Product not found
          </h2>
          <p className="text-gray-600 mb-6">{error || "Unable to load product."}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-[#eee4d8] shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-[#f5efe6] min-h-[420px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-10 flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
              {product.category || "Pashmina Collection"}
            </p>

            <h1 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-semibold text-[#2f2a25] mb-6">
              ${product.price}
            </p>

            <p className="text-gray-600 leading-7 mb-8">
              {product.description || "Elegant pashmina piece crafted for timeless style and comfort."}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
              >
                Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="px-6 py-3 bg-[#f6d9df] text-[#9a4d5d] rounded-full hover:bg-[#f2cad3]"
              >
                Wishlist ❤️
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-[#ddd2c5] rounded-full hover:bg-gray-100"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}