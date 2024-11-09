"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export interface CartItem {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  isChecked: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem, quantityChange?: number) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  toggleItemChecked: (name: string, newCheckedStatus?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (item: CartItem, quantityChange: number = 1) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((cartItem) => cartItem.name === item.name);
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
      return [...prevItems, { ...item, quantity: Math.max(quantityChange, 1), isChecked: true }];
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
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItem, clearCart, toggleItemChecked }}>
      {children}
    </CartContext.Provider>
  );
};
