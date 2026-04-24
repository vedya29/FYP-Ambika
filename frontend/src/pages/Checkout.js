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
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);

  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const textOnlyRegex = /^[A-Za-z\s]+$/;

  const generateOrderId = () => {
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const numericIds = existingOrders
    .map((order) => {
      const match = String(order.id).match(/ORD-(\d+)/);
      return match ? Number(match[1]) : null;
    })
    .filter(Boolean);

  const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1;

  return `ORD-${String(nextId).padStart(3, "0")}`;
};

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim() || !nameRegex.test(fullName.trim())) {
      newErrors.fullName = "Enter a valid full name.";
    }

    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!city.trim() || !textOnlyRegex.test(city.trim())) {
      newErrors.city = "Enter a valid city.";
    }

    if (!address.trim()) {
      newErrors.address = "Street address is required.";
    }

    if (!country.trim() || !textOnlyRegex.test(country.trim())) {
      newErrors.country = "Enter a valid country.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildOrderObject = (overrides = {}) => ({
    id: generateOrderId(),
    items: cart,
    totalAmount: total,
    paymentMethod,
    paymentStatus:
      paymentMethod === "Cash on Delivery" ? "Pending" : "Pending Verification",
    status: "Processing",
    createdAt: new Date().toISOString(),
    customer: {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      country: country.trim(),
    },
    ...overrides,
  });

  const handleCodOrder = () => {
    if (!validateForm()) return;

    const order = buildOrderObject({
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
    });

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

    clearCart();
    alert("Order placed successfully 🎉");
    navigate("/dashboard/orders");
  };

  const handleEsewaPayment = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);

      const pendingOrder = buildOrderObject({
        paymentMethod: "eSewa",
        paymentStatus: "Pending Verification",
      });

      localStorage.setItem("pendingEsewaOrder", JSON.stringify(pendingOrder));

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const fields = {
        amount: total,
        tax_amount: "0",
        total_amount: total,
        transaction_uuid: pendingOrder.id,
        product_code: "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:3000/payment-success",
        failure_url: "http://localhost:3000/payment-failure",
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error(error);
      setProcessing(false);
      alert("Failed to start eSewa payment.");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "Cash on Delivery") {
      handleCodOrder();
    } else {
      handleEsewaPayment();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8f4ee]">
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee4d8] p-10 md:p-14 max-w-2xl w-full text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2f2a25] mb-3">
            No Items to Checkout
          </h2>
          <p className="text-gray-600 leading-7 mb-8">
            Your cart is currently empty. Add a few beautiful pieces before
            proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="inline-block px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-gradient-to-r from-[#efe3d3] via-[#f8f4ee] to-[#f5e8dc] rounded-3xl p-8 md:p-10 border border-[#eadfce] shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8a6d4b] mb-3">
            Final Step
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
            Checkout & Payment ✨
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-7 max-w-3xl">
            Complete your shipping details and choose how you want to pay.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
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
                onChange={(value) => {
                  setFullName(value.replace(/[^A-Za-z\s]/g, ""));
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
                error={errors.fullName}
                placeholder="Full Name"
              />

              <ValidatedInput
                label="Email Address"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                error={errors.email}
                placeholder="Email Address"
                type="email"
              />

              <ValidatedInput
                label="Phone Number"
                value={phone}
                onChange={(value) => {
                  setPhone(value.replace(/\D/g, "").slice(0, 10));
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                error={errors.phone}
                placeholder="Phone Number"
                type="tel"
              />

              <ValidatedInput
                label="City"
                value={city}
                onChange={(value) => {
                  setCity(value.replace(/[^A-Za-z\s]/g, ""));
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: "" }));
                  }
                }}
                error={errors.city}
                placeholder="City"
              />
            </div>

            <ValidatedInput
              label="Street Address"
              value={address}
              onChange={(value) => {
                setAddress(value);
                if (errors.address) {
                  setErrors((prev) => ({ ...prev, address: "" }));
                }
              }}
              error={errors.address}
              placeholder="Street Address"
            />

            <ValidatedInput
              label="Country"
              value={country}
              onChange={(value) => {
                setCountry(value.replace(/[^A-Za-z\s]/g, ""));
                if (errors.country) {
                  setErrors((prev) => ({ ...prev, country: "" }));
                }
              }}
              error={errors.country}
              placeholder="Country"
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2f2a25]">
                Payment Method <span className="text-red-500">*</span>
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  if (errors.paymentMethod) {
                    setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                  }
                }}
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

            {paymentMethod === "eSewa" && (
              <div className="bg-[#f6fff6] rounded-3xl p-5 border border-[#d9f0d9]">
                <h4 className="text-xl font-serif text-[#2f2a25] mb-2">
                  eSewa Payment 💚
                </h4>
                <p className="text-sm text-gray-600 leading-6">
                  You will be redirected to the eSewa sandbox page to complete
                  the payment.
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Test ID: 9806800001 | Password: Nepal@123 | MPIN: 1122
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm h-fit">
            <h3 className="text-2xl font-serif text-[#2f2a25] mb-5">
              Order Review
            </h3>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5efe6] flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2f2a25] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.qty} × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="mb-4 border-[#eee4d8]" />

            <div className="space-y-3 text-gray-700">
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
            </div>

            <hr className="my-4 border-[#eee4d8]" />

            <div className="flex justify-between text-lg font-semibold text-[#2f2a25] mb-6">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full px-4 py-3 bg-black text-white rounded-full hover:opacity-90 disabled:opacity-60"
            >
              {processing && paymentMethod === "eSewa"
                ? "Redirecting to eSewa..."
                : paymentMethod === "eSewa"
                ? "Pay with eSewa"
                : "Place Order"}
            </button>
          </div>
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