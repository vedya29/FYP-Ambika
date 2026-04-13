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

  // ✅ CLEAN ORDER ID
  const generateOrderId = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    return existingOrders.length + 1001;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim() || !nameRegex.test(fullName)) {
      newErrors.fullName = "Enter valid name";
    }

    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Enter valid email";
    }

    if (!phone.trim() || !phoneRegex.test(phone)) {
      newErrors.phone = "Enter valid 10 digit number";
    }

    if (!city.trim() || !textOnlyRegex.test(city)) {
      newErrors.city = "Enter valid city";
    }

    if (!address.trim()) {
      newErrors.address = "Enter address";
    }

    if (!country.trim() || !textOnlyRegex.test(country)) {
      newErrors.country = "Enter valid country";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATED ORDER OBJECT
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
    } catch (err) {
      alert("Payment failed");
      setProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    paymentMethod === "Cash on Delivery"
      ? handleCodOrder()
      : handleEsewaPayment();
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl space-y-4">
          <h3 className="text-2xl font-serif">Shipping Details</h3>

          <input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} />
          <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
          <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
          <input placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} />

          <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
            <option>Cash on Delivery</option>
            <option>eSewa</option>
          </select>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-3xl">
          <h3 className="text-xl">Order Review</h3>

          {cart.map(item=>(
            <div key={item._id}>
              {item.name} × {item.qty}
            </div>
          ))}

          <h3>Total Rs. {total}</h3>

          <button onClick={handlePlaceOrder}>
            {processing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}