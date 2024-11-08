// Keranjang.tsx

"use client";

import React, { useState } from 'react';
import { useCart, CartItem } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const CartPage: React.FC = () => {
  const { cartItems, removeItem, clearCart, addItemToCart, toggleItemChecked } = useCart();
  const [selectAll, setSelectAll] = useState(false);

  const totalPrice = cartItems.reduce((total, item) =>
    item.isChecked ? total + item.price * item.quantity : total
  , 0);

  const shippingCost = totalPrice > 0 ? 10000 : 0;
  const grandTotal = totalPrice + shippingCost;

  const handleQuantityChange = (item: CartItem, change: number) => {
    addItemToCart(item, change);
  };

  const handleCheckboxChange = (itemName: string) => {
    toggleItemChecked(itemName);
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    cartItems.forEach((item) => toggleItemChecked(item.name, newSelectAll));
  };

  // Produk rekomendasi
  const recommendedProducts = [
    { imageUrl: "/seafood/atlanticsalmon.jpeg", name: "Salmon Filet", price: 99000 },
    { imageUrl: "/seafood/rawshrimp.webp", name: "Udang Kupas", price: 40000 },
    { imageUrl: "/sayur/1.png", name: "Kol Merah", price: 20000 },
    { imageUrl: "/daging/1.png", name: "Daging Iga", price: 120000 },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Keranjang Belanja</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-5xl font-bold mb-4">Keranjang Anda kosong.</p>
          <img src="/0cart.png" alt="Keranjang kosong" className="mx-auto w-50 h-50 opacity-75" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/Logo_icon.png" alt="Logo" className="w-25 h-20 mr-8 object-contain" />
              <h2 className="text-5xl font-semibold text-green-600">Keranjang</h2>
            </div>

            <div className="flex items-center mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="mr-5 h-5 w-5 rounded bg-white border-gray-300 checked:bg-green-600 checked:border-transparent focus:ring-0 focus:outline-none"
              />
              <label className="text-lg font-semibold text-black">Pilih Semua</label>
            </div>

            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.name} className="flex justify-between items-center p-4 border rounded-lg shadow-lg bg-white">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.name)}
                      className="mr-4 h-5 w-5 text-green-600 rounded focus:ring-0 focus:outline-none"
                    />
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="ml-4">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-gray-600">Rp {item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleQuantityChange(item, -1)} className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-300">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)} className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-300">+</button>
                    <button onClick={() => removeItem(item.name)} className="text-red-500 hover:underline">
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Fixed-size Ringkasan Belanja without scroll */}
          <div className="p-5 border rounded-lg bg-gray-100 shadow-lg max-h-80 flex flex-col justify-between">
            <h2 className="font-bold text-xl mb-10">Ringkasan Belanja</h2>
            <div className="flex justify-between mt-3">
              <span>Total Harga:</span>
              <span>Rp {totalPrice}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Total Ongkos Kirim:</span>
              <span>Rp {shippingCost}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span>Total Belanja:</span>
              <span>Rp {grandTotal}</span>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Checkout
            </button>
            <button onClick={clearCart} className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-5xl font-bold mb-6 text-center text-green-600">Rekomendasi Untukmu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product, index) => (
            <ProductCard
              key={index}
              imageUrl={product.imageUrl}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
