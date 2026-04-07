import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const pendingOrder = JSON.parse(localStorage.getItem("pendingEsewaOrder"));

    if (pendingOrder) {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

      const newOrder = {
        ...pendingOrder,
        paymentStatus: "Paid",
        status: "Processing",
        esewaRefId: searchParams.get("refId") || "",
      };

      localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));
      localStorage.removeItem("pendingEsewaOrder");
      clearCart();
    }

    alert("Payment successful via eSewa 🎉");
    navigate("/dashboard/orders");
  }, [navigate, clearCart, searchParams]);

  return <div className="p-10 text-center">Processing payment success...</div>;
}