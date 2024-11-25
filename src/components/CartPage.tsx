"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  imageUrl: string;
  quantity: number;
  totalPrice: number;
  isChecked: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedTotal, setSelectedTotal] = useState(0); // Total for selected items
  const [selectedGrandTotal, setSelectedGrandTotal] = useState(0); // Grand total with shipping
  const [shippingCost, setShippingCost] = useState(15000);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cart data from the API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", { method: "GET" });
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cartItems);
        updateSummary(data.cartItems); // Update summary after fetching cart
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = (items: CartItem[]) => {
    // Calculate total for selected items
    const selectedTotal = items
      .filter((item) => item.isChecked)
      .reduce((total, item) => total + item.productPrice * item.quantity, 0);

    setSelectedTotal(selectedTotal);
    setSelectedGrandTotal(selectedTotal + shippingCost);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (item: CartItem, change: number) => {
    const updatedQuantity = item.quantity + change;
    if (updatedQuantity <= 0) return;

    try {
      const updatedCart = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: {
            cartItems: [
              {
                id: item.id,
                quantity: updatedQuantity,
                isChecked: item.isChecked,
              },
            ],
          },
        }),
      });

      if (updatedCart.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleCheckboxChange = async (id: string) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setCartItems(updatedItems);
    updateSummary(updatedItems); // Update summary after checkbox change

    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: { cartItems: updatedItems },
        }),
      });
    } catch (error) {
      console.error("Failed to update checkbox:", error);
    }
  };

  const handleSelectAllChange = async () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedItems = cartItems.map((item) => ({
      ...item,
      isChecked: newSelectAll,
    }));
    setCartItems(updatedItems);
    updateSummary(updatedItems); // Update summary after select all

    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: { cartItems: updatedItems },
        }),
      });
    } catch (error) {
      console.error("Failed to update select all:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCart();
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCart();
      } else {
        console.error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Checkout berhasil!");
          router.push("/history"); // Redirect to history page
        } else {
          console.error("Checkout failed:", data.error);
          alert(`Gagal melakukan checkout: ${data.error}`);
        }
      } else {
        console.error("Failed to checkout:", response.statusText);
        alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };
  

  const isCartEmpty = cartItems.length === 0;

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
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-lg bg-white"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.id)}
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
                      onClick={() => handleRemoveItem(item.id)}
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
              <span>Rp {selectedTotal}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Total Ongkos Kirim:</span>
              <span>Rp {shippingCost}</span>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <span>Total Belanja:</span>
              <span>Rp {selectedGrandTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Checkout
            </button>
            <button
              onClick={handleClearCart}
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
