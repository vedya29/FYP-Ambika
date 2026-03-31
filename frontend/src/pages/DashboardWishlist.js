import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function DashboardWishlist() {
  const { wishlist, addToCart, removeFromWishlist, user } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product);
    removeFromWishlist(product._id);
    alert("Moved to cart 🛍️");
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee4d8] p-10 md:p-14 max-w-2xl w-full text-center">
          <div className="text-5xl mb-4">💖</div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2f2a25] mb-3">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 leading-7 mb-8">
            Save your favorite pashmina pieces here and come back to them
            anytime. Your most-loved styles deserve a special place ✨
          </p>

          <Link
            to="/products"
            className="inline-block px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#f7e8ea] via-[#f8f4ee] to-[#efe3d3] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#9a6b75] mb-3">
          Saved with love
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          My Wishlist 💕
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
          Keep track of your favorite pashmina styles, compare elegant pieces,
          and move them to your cart whenever you're ready.
        </p>
      </section>

      {/* Wishlist Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25]">
              Your Saved Pieces
            </h3>
            <p className="text-gray-600 mt-1">
              {wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-black hover:underline"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
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
                <div className="mb-4">
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

                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    to={`/products/${product._id}`}
                    className="w-full text-center px-4 py-2 rounded-full border border-[#d8cec2] text-sm hover:bg-gray-100"
                  >
                    View Product 👀
                  </Link>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full px-4 py-2 rounded-full bg-black text-white text-sm hover:opacity-90"
                  >
                    Move to Cart 🛒
                  </button>

                  <button
                    onClick={() => {
                      removeFromWishlist(product._id);
                      alert("Removed from wishlist 💔");
                    }}
                    className="w-full px-4 py-2 rounded-full bg-[#f9e6ea] text-[#9a4d5d] text-sm hover:bg-[#f6d9df]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cute bottom message */}
      <section className="bg-white rounded-3xl p-8 md:p-10 border border-[#eee4d8] shadow-sm text-center">
        <div className="text-4xl mb-3">🌷</div>
        <h3 className="text-2xl md:text-3xl font-serif text-[#2f2a25] mb-3">
          A little corner for your favorites
        </h3>
        <p className="text-gray-700 leading-7 max-w-2xl mx-auto">
          Your wishlist helps you collect the pieces you love most before making
          your final choice. Elegant, warm, and timeless — just like pashmina.
        </p>
      </section>
    </div>
  );
}

export default DashboardWishlist;