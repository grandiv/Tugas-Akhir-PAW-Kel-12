"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { CartResponse } from "@/types/cart";

interface Product {
  imageUrl: string;
  name: string;
  price: number;
}

const CartPage: React.FC = () => {
  const router = useRouter();
  const { cartItems = [], removeItem, clearCart, addItemToCart, toggleItemChecked } = useCart();
  console.log(cartItems)
  const [selectAll, setSelectAll] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);


  // Handle quantity changes for a specific item
  const handleQuantityChange = (item: CartResponse, change: number) => {
    addItemToCart(item, change); // Add or remove items from the cart based on change
  };

  // Handle checkbox selection for an individual item
  const handleCheckboxChange = (itemName: string) => {
    toggleItemChecked(itemName); // Toggle selection of an item
  };

  // Handle select all checkbox change
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    cartItems.forEach((item) => toggleItemChecked(item.name, newSelectAll)); // Update selection for all items
  };

  // Handle checkout process
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/checkout"); // Redirect to checkout page if cart is not empty
    }
  };

  // Fetch recommended products from API
  // const fetchRecommendedProducts = async () => {
  //   try {
  //     const response = await axios.get("/api/products"); // Fetch recommended products from the server
  //     if (response.data) {
  //       setRecommendedProducts(response.data); // Set the recommended products data
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch recommended products:", error); // Log any errors that occur
  //   }
  // };

  // Fetch recommended products on component mount
  // useEffect(() => {
  //   fetchRecommendedProducts();
  // }, []);

  return (
    <div className="container mx-auto pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Keranjang Belanja</h1>

      {/* Display message when cart is empty */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col p-5 border bg-gray-100 md:flex-row md:space-x-60">
          <div className="text-left mb-6 md:mb-0 md:w-1/2">
            <p className="text-4xl font-bold mb-3 text-green-600">Wah, keranjang belanjamu kosong!</p>
            <p className="text-xl text-gray-600">Yuk, beli kebutuhanmu sekarang!</p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-100 shadow-lg md:w-1/3">
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
            <button disabled className="mt-4 w-full bg-gray-300 text-white px-4 py-2 rounded-md">Checkout</button>
            <button disabled className="mt-2 w-full bg-gray-300 text-white px-4 py-2 rounded-md">Kosongkan Keranjang</button>
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
              <label className="text-lg font-semibold text-black">Pilih Semua</label>
            </div>

            {/* Cart items list */}
            <ul className="space-y-6">
              {cartItems?.cartItems?.map((item) => (
                <li
                  key={item.name}
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
                      src={item.imageUrl || "/default-image.jpg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-gray-600">Rp {item.price} x {item.quantity}</p>
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
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 border rounded-lg bg-gray-100 shadow-lg max-h-80 flex flex-col justify-between mt- md:mt-0">
            <h2 className="font-bold text-xl mb-10">Ringkasan Belanja</h2>
            <div className="flex justify-between mt-3">
              <span>Total Harga:</span>
              <span>Rp {cartItems.totalPrice}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Total Ongkos Kirim:</span>
              <span>Rp {cartItems.shippingCost}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span>Total Belanja:</span>
              <span>Rp {cartItems.grandTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      )}

      {/* Recommended products */}
      <section className="mt-12">
        <h2 className="text-4xl font-bold mb-6 text-left text-green-600">Rekomendasi Untukmu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendedProducts.map((product) => (
            <div key={product.name} className="border p-4 rounded-lg shadow-sm">
              <img
                src={product.imageUrl || "/default-image.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover mb-4"
              />
              <p className="font-semibold text-lg">{product.name}</p>
              <p className="text-gray-600">Rp {product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
