"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import { NextResponse } from "next/server";

import { CartItem, CartContextType } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  // Load cart from database when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        if (data.success) {
          setCartItems(data.items);
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Unknown" },
          { status: 500 }
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateServerCart = async (items: CartItem[]) => {
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
      const itemExists = prevItems.find(
        (cartItem) => cartItem.name === item.name
      );
      if (itemExists) {
        const updatedItems = prevItems.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: Math.max(cartItem.quantity + quantityChange, 0),
              }
            : cartItem
        );
        return updatedItems.filter((cartItem) => cartItem.quantity > 0);
      }
      return [
        ...prevItems,
        { ...item, quantity: Math.max(quantityChange, 1), isChecked: true },
      ];
    });
  };

  const removeItem = (name: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems"); // Clear cart from localStorage as well
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
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        updateServerCart,
        removeItem,
        clearCart,
        toggleItemChecked,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
