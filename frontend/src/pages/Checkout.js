import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart, user } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [errors, setErrors] = useState({});

  const total = cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);

  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const textOnlyRegex = /^[A-Za-z\s]+$/;

  const validateForm = () => {
    const newErrors = {};

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedAddress = address.trim();
    const trimmedCountry = country.trim();

    if (!trimmedFullName) {
      newErrors.fullName = "Full name is required.";
    } else if (!nameRegex.test(trimmedFullName)) {
      newErrors.fullName = "Full name should contain only letters and spaces.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(trimmedPhone)) {
      newErrors.phone = "Phone number must contain exactly 10 digits.";
    }

    if (!trimmedCity) {
      newErrors.city = "City is required.";
    } else if (!textOnlyRegex.test(trimmedCity)) {
      newErrors.city = "City should contain only letters and spaces.";
    }

    if (!trimmedAddress) {
      newErrors.address = "Street address is required.";
    } else if (trimmedAddress.length < 5) {
      newErrors.address = "Street address is too short.";
    }

    if (!trimmedCountry) {
      newErrors.country = "Country is required.";
    } else if (!textOnlyRegex.test(trimmedCountry)) {
      newErrors.country = "Country should contain only letters and spaces.";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment method is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
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
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        country: country.trim(),
      },
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

    clearCart();
    alert("Order placed successfully 🎉");
    navigate("/dashboard/orders");
  };

  const handleNameChange = (value) => {
    const cleaned = value.replace(/[^A-Za-z\s]/g, "");
    setFullName(cleaned);
    if (errors.fullName) {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleCityChange = (value) => {
    const cleaned = value.replace(/[^A-Za-z\s]/g, "");
    setCity(cleaned);
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleCountryChange = (value) => {
    const cleaned = value.replace(/[^A-Za-z\s]/g, "");
    setCountry(cleaned);
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const handlePaymentChange = (value) => {
    setPaymentMethod(value);
    if (errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm space-y-6">
          <h3 className="text-2xl font-serif text-[#2f2a25]">
            Shipping Details
          </h3>

          <p className="text-sm text-gray-500">
            Fields marked with{" "}
            <span className="text-red-500 font-semibold">*</span> are required.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <ValidatedInput
              label="Full Name"
              value={fullName}
              onChange={handleNameChange}
              error={errors.fullName}
              placeholder="Full Name"
            />

            <ValidatedInput
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              placeholder="Email Address"
              type="email"
            />

            <ValidatedInput
              label="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              placeholder="Phone Number"
              type="tel"
            />

            <ValidatedInput
              label="City"
              value={city}
              onChange={handleCityChange}
              error={errors.city}
              placeholder="City"
            />
          </div>

          <ValidatedInput
            label="Street Address"
            value={address}
            onChange={handleAddressChange}
            error={errors.address}
            placeholder="Street Address"
          />

          <ValidatedInput
            label="Country"
            value={country}
            onChange={handleCountryChange}
            error={errors.country}
            placeholder="Country"
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2f2a25]">
              Payment Method <span className="text-red-500">*</span>
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className={`w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 ${
                errors.paymentMethod
                  ? "border-red-400 focus:ring-red-200"
                  : "border-[#ddd2c5] focus:ring-[#d8b89c]"
              }`}
            >
              <option>Cash on Delivery</option>
              <option>eSewa</option>
            </select>

            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eee4d8] shadow-sm">
          <h3 className="text-2xl font-serif mb-6 text-[#2f2a25]">
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
                  <p className="font-medium text-[#2f2a25]">{item.name}</p>
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

            <div className="flex justify-between font-semibold text-lg pt-2 text-[#2f2a25]">
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

function ValidatedInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-[#2f2a25]">
        {label} <span className="text-red-500">*</span>
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-[#ddd2c5] focus:ring-[#d8b89c]"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}