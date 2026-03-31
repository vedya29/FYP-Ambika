import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = cart.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8f4ee]">
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee4d8] p-10 md:p-14 max-w-2xl w-full text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2f2a25] mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 leading-7 mb-8">
            Looks like you haven’t added anything yet. Explore our elegant
            pashmina collection and find something beautiful ✨
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
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Shopping Bag
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            My Cart 🛍️
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Review your selected items, adjust quantities, and continue to
            checkout whenever you're ready.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl p-5 border border-[#eee4d8] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#f5efe6]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-serif text-[#2f2a25]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category || "Pashmina Collection"}
                    </p>
                    <p className="text-base font-semibold text-[#2f2a25] mt-2">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <div className="flex items-center gap-3 bg-[#f8f4ee] px-3 py-2 rounded-full border border-[#eadfce]">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="w-8 h-8 rounded-full bg-white border border-[#ddd2c5] hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-[#ddd2c5] hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm text-[#9a4d5d] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm h-fit">
            <h3 className="text-2xl font-serif text-[#2f2a25] mb-5">
              Order Summary
            </h3>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <hr className="my-5 border-[#eee4d8]" />

            <div className="flex justify-between text-lg font-semibold text-[#2f2a25] mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full px-4 py-3 bg-black text-white rounded-full hover:opacity-90"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 px-4 py-3 border border-[#d8cec2] rounded-full text-sm hover:bg-gray-100"
            >
              Continue Shopping
            </button>

            <p className="text-xs text-gray-500 mt-5 leading-6 text-center">
              Review your order carefully before checkout. Your selected items
              will be saved for this session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}