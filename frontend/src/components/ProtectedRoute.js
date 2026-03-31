import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProtectedRoute({ children }) {
  const { user } = useCart();
  return user ? children : <Navigate to="/login" replace />;
}
