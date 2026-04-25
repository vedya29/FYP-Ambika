import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState("");

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
      setOrderId(finalOrder.id);
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 md:p-14 border border-[#eee4d8] shadow-sm text-center max-w-2xl w-full">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-5xl mb-6">
          ✅
        </div>

        <p className="text-sm uppercase tracking-[0.25em] text-[#8a6d4b] mb-3">
          Payment Completed
        </p>

        <h2 className="text-3xl md:text-5xl font-serif text-[#2f2a25] mb-4">
          Order Confirmed
        </h2>

        <p className="text-gray-600 leading-7 mb-6">
          Thank you for shopping with Ambika. Your payment has been completed
          successfully and your order is now being processed.
        </p>

        {orderId && (
          <div className="bg-[#f8f4ee] border border-[#eee4d8] rounded-2xl p-4 mb-8">
            <p className="text-sm text-gray-500">Your Order Number</p>
            <p className="text-2xl font-semibold text-[#2f2a25] mt-1">
              {orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-full border border-[#ddd2c5] hover:bg-[#faf7f2]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}