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
  const [cartItems, setCartItems] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      if (data.success) {
        setCartItems(data);
      } else if (data.error === "No cart items found for this user") {
        setCartItems({
          success: true,
          cartItems: [],
          grandTotal: 0,
          shippingCost: 0,
          totalPrice: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateServerCart = async (items: CartResponse) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItemToCart = (item: CartItem, quantityChange: number = 1) => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;

      const updatedCartItems = prevItems.cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
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
      return {
        ...prevItems,
        cartItems: updatedCartItems.filter((item) => item.quantity > 0),
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };
    });
  };

  const decreaseItemQuantity = (item: CartItem) => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;

      const updatedCartItems = prevItems.cartItems
        .map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);

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
      return newCart;
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
        cartItems: updatedCartItems.filter((item) => item.quantity > 0),
        totalPrice: newTotalPrice,
        grandTotal: newTotalPrice + (prevItems.shippingCost || 0),
      };
      return returnCart;
    });
  };

  const clearCart = () => {
    setCartItems((prevItems) => {
      if (!prevItems) return null;

      updateServerCart({
        grandTotal: 0,
        shippingCost: 0,
        totalPrice: 0,
        cartItems: prevItems.cartItems.map((item) => ({
          ...item,
          quantity: 0,
        })),
      });
      return null;
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
        fetchCart,
        addItemToCart,
        decreaseItemQuantity,
        removeItem,
        clearCart,
        toggleItemChecked,
        updateServerCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
