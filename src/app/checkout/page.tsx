"use client";

import React from "react";
import Checkout from "@/components/Checkout";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  if (!cartItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
          <p className="mt-2 text-gray-500">Please wait while we fetch your cart information.</p>
        </div>
      </div>
    );
  }

  return (
    <Checkout 
    // cartItems={cartItems} 
    />
  );
}