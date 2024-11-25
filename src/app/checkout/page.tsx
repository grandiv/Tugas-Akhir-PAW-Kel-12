"use client"; // Ensures this file is treated as a client component

import React from "react";
import Checkout from "@/components/Checkout";
import { useCart } from "@/context/CartContext";

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => (item.isChecked ? total + item.price * item.quantity : total),
    0
  );

  const shippingCost = totalPrice > 0 ? 10000 : 0;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex items-center mb-4">
        <img
          src="/Logo_icon.png"
          alt="Logo"
          className="w-25 h-20 mr-8 object-contain"
        />
        <h2 className="text-5xl font-semibold text-green-600">Checkout</h2>
      </div>

      <Checkout
        cartItems={cartItems}
        totalPrice={totalPrice}
        shippingCost={shippingCost}
        grandTotal={grandTotal}
      />
    </div>
  );
};

export default CheckoutPage;
