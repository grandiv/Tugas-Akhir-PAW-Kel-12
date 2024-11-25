"use client";

import React, { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { useSession } from "next-auth/react";

interface Product {
  imageUrl: string;
  name: string;
  price: number;
}

const sayurProducts: Product[] = [
  { imageUrl: "/sayur/1.png", name: "Kol Merah", price: 20000 },
  { imageUrl: "/sayur/2.png", name: "Kangkung", price: 10000 },
  { imageUrl: "/sayur/3.png", name: "Sawi", price: 8000 },
  { imageUrl: "/sayur/4.png", name: "Sayur Pare", price: 10000 },
  { imageUrl: "/sayur/5.png", name: "Bayam", price: 20000 },
  { imageUrl: "/sayur/6.png", name: "Ubi", price: 20000 },
  { imageUrl: "/sayur/7.png", name: "Brokoli", price: 30999 },
  { imageUrl: "/sayur/8.png", name: "Buncis", price: 10900 },
  { imageUrl: "/sayur/9.png", name: "Wortel", price: 10000 },
];

const meatProducts: Product[] = [
  { imageUrl: "/daging/1.png", name: "Daging Iga", price: 120000 },
  { imageUrl: "/daging/2.png", name: "Daging Ham", price: 75000 },
  { imageUrl: "/daging/3.png", name: "Sapi Giling", price: 50000 },
  { imageUrl: "/daging/4.png", name: "Dada Ayam", price: 130000 },
  { imageUrl: "/daging/5.png", name: "Tulang Sapi", price: 45000 },
  { imageUrl: "/daging/6.png", name: "Ayam Utuh", price: 85000 },
  { imageUrl: "/daging/7.png", name: "Paha Ayam", price: 100000 },
  { imageUrl: "/daging/8.png", name: "Sapi Steak", price: 90000 },
  { imageUrl: "/daging/9.png", name: "Bakso Sapi", price: 18500 },
  { imageUrl: "/daging/10.png", name: "Sosis Sapi", price: 21000 },
];

const seafoodProducts: Product[] = [
  {
    imageUrl: "/seafood/atlanticsalmon.jpeg",
    name: "Salmon Filet",
    price: 99000,
  },
  { imageUrl: "/seafood/rawshrimp.webp", name: "Udang Kupas", price: 40000 },
  { imageUrl: "/seafood/3.jpg", name: "Kaki Alaskan", price: 58000 },
  { imageUrl: "/seafood/4.jpg", name: "Kerang", price: 69000 },
  { imageUrl: "/seafood/5.webp", name: "Tiram Segar", price: 73000 },
  { imageUrl: "/seafood/6.jpeg", name: "Lobster", price: 49000 },
  { imageUrl: "/seafood/7.jpg", name: "Nila Filet", price: 50999 },
  { imageUrl: "/seafood/tunasteak.webp", name: "Tuna Steak", price: 109000 },
  { imageUrl: "/seafood/9.jpg", name: "Kod Filet", price: 89000 },
  { imageUrl: "/seafood/10.webp", name: "Kerang Remis", price: 74000 },
];
const allProducts: Product[] = [
  ...sayurProducts,
  ...meatProducts,
  ...seafoodProducts,
];

const CartPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, removeItem, clearCart, addItemToCart, toggleItemChecked } =
    useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      item.isChecked ? total + item.price * item.quantity : total,
    0
  );

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

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    const shuffledProducts = allProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);
    setRecommendedProducts(shuffledProducts);
  }, []);

  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/login");
    return null;
  }

  return (
    <div className="container mx-auto pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600"></h1>
      <div className="flex items-center mb-4">
        <img
          src="/cart_icon.png"
          alt="CartIcon"
          className="w-25 h-20 mr-8 object-contain"
        />
        <h2 className="text-5xl font-semibold text-green-600">Keranjang Belanja</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col p-5 border bg-gray-100 md:flex-row md:space-x-60">
          <div className="text-left mb-6 md:mb-0 md:w-1/2">
            <p className="text-4xl font-bold mb-3 text-green-600">
              Wah, keranjang belanjamu kosong!
            </p>
            <p className="text-xl text-gray-600">
              Yuk, beli kebutuhanmu sekarang!
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-100 shadow-lg md:w-1/3">
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
            <button
              disabled
              className="mt-4 w-full bg-gray-300 text-white px-4 py-2 rounded-md"
            >
              Checkout
            </button>
            <button
              disabled
              className="mt-2 w-full bg-gray-300 text-white px-4 py-2 rounded-md"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      ) : (
        // Display cart items and summary section if the cart is not empty
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
              {cartItems.map((item) => (
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
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-gray-600">
                        Rp {item.price} x {item.quantity}
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
                      onClick={() => removeItem(item.name)}
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

      <section className="mt-12">
        <h2 className="text-4xl font-bold mb-6 text-left text-green-600">
          Rekomendasi Untukmu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-5 mx-6">
          {recommendedProducts.map((product, index) => (
            <ProductCard
              key={index}
              imageUrl={product.imageUrl}
              name={product.name}
              desc={product.desc}
              stock={product.stock}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
