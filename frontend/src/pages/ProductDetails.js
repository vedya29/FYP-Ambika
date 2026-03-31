import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/products/${id}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-xl"
      />

      <div>
        <h2 className="text-3xl font-serif mb-4">{product.name}</h2>
        <p className="text-xl font-semibold mb-2">${product.price}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <button
          onClick={() => (user ? addToCart(product) : navigate("/login"))}
          className="px-6 py-3 bg-black text-white rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}