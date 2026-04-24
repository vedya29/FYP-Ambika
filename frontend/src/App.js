import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";

/* ================= PUBLIC ================= */
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= USER DASHBOARD ================= */
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Orders from "./pages/Orders";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardWishlist from "./pages/DashboardWishlist";
import DashboardSettings from "./pages/DashboardSettings";

/* ================= ADMIN ================= */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

function AppWrapper() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />  

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
          
        >
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="wishlist" element={<DashboardWishlist />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* ADMIN AUTH */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppWrapper />
      </Router>
    </CartProvider>
  );
}

export default App;