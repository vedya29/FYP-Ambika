import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, user, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((s, item) => s + Number(item.price) * item.qty, 0),
    [cart]
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const generateTransactionUUID = () => {
    return `AMB-${Date.now()}`;
  };

  const generateSignature = async (totalAmount, transactionUuid, productCode) => {
    const secretKey = "8gBm/:&EnhH.1/q";
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(secretKey),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await window.crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(message)
    );

    const bytes = new Uint8Array(signature);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });

    return window.btoa(binary);
  };

  const validateForm = () => {
    if (!cart.length) {
      alert("Your cart is empty.");
      navigate("/products");
      return false;
    }

    if (!fullName || !email || !phone || !address || !city || !country) {
      alert("Please fill in all shipping details.");
      return false;
    }

    return true;
  };

  const saveOrder = (paymentStatusOverride = "Pending", paymentMethodOverride = paymentMethod) => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        country,
      },
      paymentMethod: paymentMethodOverride,
      paymentStatus: paymentStatusOverride,
      items: cart,
      totalAmount: total,
      status: "Processing",
    };

    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));
    clearCart();
  };

  const handleCodOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    saveOrder("Pending", "Cash on Delivery");

    setTimeout(() => {
      setProcessing(false);
      alert("Order placed successfully with Cash on Delivery 🎉");
      navigate("/dashboard/orders");
    }, 500);
  };

  const handleEsewaPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setProcessing(true);

      const transactionUuid = generateTransactionUUID();
      const productCode = "EPAYTEST";
      const totalAmount = total.toFixed(2);
      const signature = await generateSignature(
        totalAmount,
        transactionUuid,
        productCode
      );

      const pendingOrder = {
        id: transactionUuid,
        createdAt: new Date().toISOString(),
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          country,
        },
        paymentMethod: "eSewa",
        paymentStatus: "Pending Verification",
        items: cart,
        totalAmount: total,
        status: "Processing",
      };

      localStorage.setItem("pendingEsewaOrder", JSON.stringify(pendingOrder));

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const fields = {
        amount: subtotal.toFixed(2),
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:3000/payment-success",
        failure_url: "http://localhost:3000/payment-failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
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
      console.error("eSewa payment error:", error);
      setProcessing(false);
      alert("Failed to start eSewa payment.");
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

        <form className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eee4d8] shadow-sm space-y-6">
            <h3 className="text-2xl font-serif text-[#2f2a25]">
              Shipping Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              />
            </div>

            <input
              type="text"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            />

            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
            />

            <div>
              <label className="block text-sm font-medium text-[#2f2a25] mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-[#ddd2c5] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d8b89c]"
              >
                <option>Cash on Delivery</option>
                <option>eSewa</option>
              </select>
            </div>

            {paymentMethod === "eSewa" && (
              <div className="bg-[#f6fff6] rounded-3xl p-5 border border-[#d9f0d9]">
                <h4 className="text-xl font-serif text-[#2f2a25] mb-2">
                  eSewa Payment 💚
                </h4>
                <p className="text-sm text-gray-600 leading-6">
                  You will be redirected to eSewa sandbox to complete the payment.
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
              {cart.map((item, index) => (
                <div key={item._id} className="flex items-center gap-3">
                  

<div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5efe6]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2f2a25]">
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
                <span>Rs. {subtotal.toFixed(2)}</span>
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

            {paymentMethod === "Cash on Delivery" ? (
              <button
                type="button"
                onClick={handleCodOrder}
                disabled={processing}
                className="w-full px-4 py-3 bg-black text-white rounded-full hover:opacity-90 disabled:opacity-60"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEsewaPayment}
                disabled={processing}
                className="w-full px-4 py-3 bg-[#60bb46] text-white rounded-full hover:opacity-90 disabled:opacity-60"
              >
                {processing ? "Redirecting..." : "Pay with eSewa"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}