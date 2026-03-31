// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart, wishlist, user } = useCart();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Logo */}

      {/* Removed the Home / Products / Let's Connect links */}
    </nav>
  );
};

export default Navbar;
