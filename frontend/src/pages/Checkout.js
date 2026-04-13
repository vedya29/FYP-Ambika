import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart, user } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePlaceOrder = () => {
    if (!fullName || !email || !phone || !city || !address || !country) {
      alert("Please fill all required fields❗");
      return;
    }

    const order = {
      id: "ORD" + Date.now(),
      items: cart,
      totalAmount: total,
      paymentMethod,
      paymentStatus:
        paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      status: "Processing",
      createdAt: new Date(),
      customer: {
        fullName,
        email,
        phone,
        city,
        address,
        country,
      },
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([order, ...existingOrders])
    );

    clearCart();

    alert("Order placed successfully 🎉");

    navigate("/dashboard/orders");
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm space-y-6">
          
          <h3 className="text-2xl font-serif text-[#2f2a25]">
            Shipping Details
          </h3>

          <p className="text-sm text-gray-500">
            Fields marked with{" "}
            <span className="text-red-500 font-semibold">*</span> are required.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} setValue={setFullName} />
            <Input label="Email Address" value={email} setValue={setEmail} type="email" />
            <Input label="Phone Number" value={phone} setValue={setPhone} />
            <Input label="City" value={city} setValue={setCity} />
          </div>

          <Input label="Street Address" value={address} setValue={setAddress} />
          <Input label="Country" value={country} setValue={setCountry} />

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3"
            >
              <option>Cash on Delivery</option>
              <option>eSewa</option>
            </select>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
          
          <h3 className="text-2xl font-serif mb-6">
            Order Review
          </h3>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty} × ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between">
              <span>Payment</span>
              <span>{paymentMethod}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-black text-white py-3 rounded-full hover:opacity-90"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function Input({ label, value, setValue, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
      />
    </div>
  );
}