// src/components/CartPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartResponse, CartItem } from "@/types/cart";

interface Product {
  imageUrl: string;
  productName: string;
  price: number;
  id: string;
}

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    removeItem,
    clearCart,
    addItemToCart,
    decreaseItemQuantity,
    toggleItemChecked,
    fetchCart,
    loading,
  } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [recommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (item: CartItem, change: number) => {
    if (change > 0) {
      addItemToCart(item, change);
    } else {
      decreaseItemQuantity(item);
    }
  };

  const handleCheckboxChange = (itemName: string) => {
    if (toggleItemChecked) {
      toggleItemChecked(itemName);
    }
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (cartItems?.cartItems) {
      cartItems.cartItems.forEach((item) =>
        toggleItemChecked?.(item.name, newSelectAll)
      );
    }
  };

  const handleCheckout = () => {
    if (cartItems?.cartItems && cartItems.cartItems.length > 0) {
      router.push("/checkout");
    }
  };

  const isCartEmpty = !cartItems?.cartItems || cartItems.cartItems.length === 0;

  return (
    <div className="container mx-auto pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
        Keranjang Belanja
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : isCartEmpty ? (
        <div className="flex flex-col p-5 border bg-gray-100 md:flex-row md:space-x-60">
          <div className="text-left mb-6 md:mb-0 md:w-1/2">
            <p className="text-4xl font-bold mb-3 text-green-600">
              Wah, keranjang belanjamu kosong!
            </p>
            <p className="text-xl text-gray-600">
              Yuk, beli kebutuhanmu sekarang!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="mr-5 h-5 w-5 rounded bg-white border-gray-300 checked:bg-green-600 checked:border-transparent focus:ring-0 focus:outline-none"
              />
              <label className="text-lg font-semibold text-black">
                Pilih Semua
              </label>
            </div>

            <ul className="space-y-6">
              {cartItems?.cartItems?.map((item) => (
                <li
                  key={`${item.id}-${item.name}`}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-lg bg-white"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.name)}
                      className="mr-4 h-5 w-5 text-green-600 rounded focus:ring-0 focus:outline-none"
                    />
                    <img
                      src={item.imageUrl || "/default-image.png"}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-lg">
                        {item.productName}
                      </p>
                      <p className="text-gray-600">
                        Rp {item.productPrice} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        if (item?.id !== undefined) {
                          removeItem(item.id);
                        }
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 border rounded-lg bg-gray-100 shadow-lg max-h-80 flex flex-col justify-between mt-6 md:mt-0">
            <h2 className="font-bold text-xl mb-10">Ringkasan Belanja</h2>
            <div className="flex justify-between mt-3">
              <span>Total Harga:</span>
              <span>Rp {cartItems?.totalPrice ?? 0}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Total Ongkos Kirim:</span>
              <span>Rp {cartItems?.shippingCost ?? 0}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span>Total Belanja:</span>
              <span>Rp {cartItems?.grandTotal ?? 0}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
