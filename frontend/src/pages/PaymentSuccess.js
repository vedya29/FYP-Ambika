import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const pendingOrder = JSON.parse(localStorage.getItem("pendingEsewaOrder"));

    if (pendingOrder) {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

      const finalOrder = {
        ...pendingOrder,
        paymentStatus: "Paid",
        status: "Processing",
      };

      localStorage.setItem(
        "orders",
        JSON.stringify([finalOrder, ...existingOrders])
      );
      localStorage.removeItem("pendingEsewaOrder");
      clearCart();
    }

    const timer = setTimeout(() => {
      navigate("/dashboard/orders");
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate, clearCart]);

  return (
    <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 border border-[#eee4d8] shadow-sm text-center max-w-xl w-full">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-3xl font-serif text-[#2f2a25] mb-3">
          Payment Successful
        </h2>
        <p className="text-gray-600">
          Redirecting you to your orders...
        </p>
      </div>
    </div>
  );
}