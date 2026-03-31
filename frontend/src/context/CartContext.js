import React, { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const addToCart = (product) => {
    if (!user) return false;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    return true;
  };

  const removeFromCart = (_id) => {
    setCart((prev) => prev.filter((item) => item._id !== _id));
  };

  const updateQty = (_id, qty) => {
    const safeQty = Math.max(1, Number(qty) || 1);

    setCart((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, qty: safeQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product) => {
    if (!user) return false;

    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });

    return true;
  };

  const removeFromWishlist = (_id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== _id));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        user,
        setUser,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};