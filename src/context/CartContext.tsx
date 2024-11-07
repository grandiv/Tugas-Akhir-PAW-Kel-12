// src/context/CartContext.tsx
"use client"; // Menandai file ini sebagai komponen klien

import React, { createContext, useState, useContext, ReactNode } from "react";

export interface CartItem {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  isChecked: boolean; // Status centang untuk item
}

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem, quantityChange?: number) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  toggleItemChecked: (name: string, newCheckedStatus?: boolean) => void; // Mengubah status centang
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
  };

  // Fungsi untuk mengubah status centang item
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
