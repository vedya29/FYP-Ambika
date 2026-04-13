import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 border border-[#eee4d8] shadow-sm text-center max-w-xl w-full">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-3xl font-serif text-[#2f2a25] mb-3">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          Your eSewa payment was not completed.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="px-6 py-3 bg-black text-white rounded-full hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}