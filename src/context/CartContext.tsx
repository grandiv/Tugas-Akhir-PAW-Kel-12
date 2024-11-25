"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { CartResponse, CartContextType, CartItem } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      const data: CartResponse = await response.json();

      if (data.success) {
        setCartItems(data.cartItems);
        setGrandTotal(data.grandTotal);
        setShippingCost(data.shippingCost);
        setTotalPrice(data.totalPrice);
      } else if (data.error === "No cart items found for this user") {
        setCartItems([]);
        setGrandTotal(0);
        setShippingCost(0);
        setTotalPrice(0);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateServerCart = async (cartData: CartResponse) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartData }),
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems);
        setGrandTotal(data.grandTotal);
        setShippingCost(data.shippingCost);
        setTotalPrice(data.totalPrice);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItemToCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await updateServerCart({
        success: true,
        cartItems: [],
        grandTotal: 0,
        shippingCost: 0,
        totalPrice: 0,
      });
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const decreaseItemQuantity = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      await updateQuantity(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      await removeFromCart(itemId);
    }
  };

  const toggleItemCheck = (id: string, newCheckedStatus?: boolean) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, isChecked: newCheckedStatus ?? !item.isChecked }
        : item
    );
    setCartItems(updatedItems);

    const newTotalPrice = updatedItems.reduce(
      (sum, item) =>
        item.isChecked ? sum + item.product.price * item.quantity : sum,
      0
    );
    setTotalPrice(newTotalPrice);
    setGrandTotal(newTotalPrice + shippingCost);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        grandTotal,
        shippingCost,
        loading,
        error,
        fetchCart,
        addItemToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        decreaseItemQuantity,
        toggleItemCheck,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
