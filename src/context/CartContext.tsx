"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { CartResponse, CartContextType, CartItem } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart from the server
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

  const updateServerCart = async (items: CartResponse) => {
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const addItemToCart = (item: CartItem, quantityChange: number = 1) => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;

      const updatedCartItems = prevItems.cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantityChange}
          : cartItem
      );

      const newTotalPrice = updatedCartItems.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
      );

      const newCart = {
        ...prevItems,
        cartItems: updatedCartItems,
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };

      updateServerCart(newCart);
      const returnCart = {
        ...prevItems,
        cartItems: updatedCartItems.filter(item => item.quantity > 0),
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };
      return returnCart;
    });
  };

  const removeItem = async (id: string) => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;
  
      const updatedCartItems = prevItems.cartItems.map((item) =>
        item.id === id ? { ...item, quantity: 0 } : item
      );
  
      const newTotalPrice = updatedCartItems.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
      );
  
      const newCart = {
        ...prevItems,
        cartItems: updatedCartItems,
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };
  
      updateServerCart(newCart);
      const returnCart = {
        ...prevItems,
        cartItems: updatedCartItems.filter(item => item.quantity > 0),
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };
      return returnCart;
    });
  };
  

  const clearCart = () => {
    setCartItems(null);
    updateServerCart({
      success: true,
      grandTotal: 0,
      shippingCost: 0,
      totalPrice: 0,
      cartItems: [],
    });
  };

  const toggleItemChecked = (name: string, newCheckedStatus?: boolean) => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;

      return {
        ...prevItems,
        cartItems: prevItems.cartItems.map((item) =>
          item.name === name
            ? { ...item, isChecked: newCheckedStatus ?? !item.isChecked }
            : item
        ),
      };
    });
  };

  const getCartItems = () => {
    if (!cartItems) return [];
    return cartItems.cartItems.filter((item) => item.quantity > 0);
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItem,
        clearCart,
        toggleItemChecked,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
