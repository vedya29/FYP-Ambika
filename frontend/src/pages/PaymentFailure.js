import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-[#eee4d8] p-10 md:p-14 max-w-2xl w-full text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#2f2a25] mb-3">
          Payment Failed
        </h2>
        <p className="text-gray-600 leading-7 mb-8">
          Your eSewa payment was not completed. You can try again or use Cash on
          Delivery.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="inline-block px-6 py-3 rounded-full bg-black text-white hover:opacity-90"
        >
          Back to Checkout
        </button>
      </div>
    </div>
  );
}