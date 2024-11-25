"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { CartResponse, CartContextType } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartResponse | null>();
  const [loading, setLoading] = useState(true);

  // Load cart from the server (or localStorage)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        if (data.success) {
          setCartItems(data);
        } else {
          console.error("Failed to fetch cart:", data.error);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateServerCart = async (items: CartResponse | null | undefined) => {

    try {
      if(!items) return;
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // const addItemToCart = (item: CartItem, quantityChange: number = 1) => {
  //   setCartItems((prevItems) => {
  //     const itemExists = prevItems.find((cartItem) => cartItem.name === item.name);
  //     if (itemExists) {
  //       return prevItems.map((cartItem) =>
  //         cartItem.name === item.name
  //           ? { ...cartItem, quantity: Math.max(cartItem.quantity + quantityChange, 0) }
  //           : cartItem
  //       ).filter((cartItem) => cartItem.quantity > 0);
  //     }
  //     return [
  //       ...prevItems,
  //       { ...item, quantity: Math.max(quantityChange, 1), isChecked: true },
  //     ];
  //   });
  // };

  const removeItem = async (id: string) => {
    const newItem = cartItems?.cartItems?.filter((e) => e.id !== id);
  
    if (newItem) {
      setCartItems((prevItems) => {
        if (!prevItems) return null; // Handle the case where prevItems is null/undefined
  
        return {
          ...prevItems,
          cartItems: newItem,
          success: prevItems.success ?? true, // Provide a default value if necessary
          grandTotal: prevItems.grandTotal ?? 0, // Ensure required properties exist
          shippingCost: prevItems.shippingCost ?? 0,
          totalPrice: prevItems.totalPrice ?? 0,
        };
      });
      updateServerCart(cartItems)
    }
  };
  

  const clearCart = () => {
    setCartItems(null);
    localStorage.removeItem("cartItems");
  };

  const toggleItemChecked = (name: string, newCheckedStatus?: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name || newCheckedStatus !== undefined
          ? { ...item, isChecked: newCheckedStatus ?? !item.isChecked }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, removeItem, clearCart, toggleItemChecked }}>
      {children}
    </CartContext.Provider>
  );
};
