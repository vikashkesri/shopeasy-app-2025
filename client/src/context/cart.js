import React, { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth, , loading] = useAuth(); 
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart_guest")) || [];
    }
    return [];
  });

  // Merge guest cart with user cart and ensure quantity = 1 for new items
  useEffect(() => {
    if (!loading) {
      const userId = auth?.user?._id;
      if (userId) {
        const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        // Merge guest cart with user cart, set quantity = 1 for all
        const mergedCart = [
          ...userCart,
          ...cart
            .filter((item) => !userCart.find((i) => i._id === item._id))
            .map((item) => ({ ...item, quantity: 1 })),
        ];
        setCart(mergedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(mergedCart));
        localStorage.removeItem("cart_guest");
      }
    }
  }, [auth, loading]);

  // Save cart on changes
  useEffect(() => {
    if (!loading) {
      const userId = auth?.user?._id;
      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
      } else {
        localStorage.setItem("cart_guest", JSON.stringify(cart));
      }
    }
  }, [cart, auth, loading]);

  return <CartContext.Provider value={[cart, setCart]}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
