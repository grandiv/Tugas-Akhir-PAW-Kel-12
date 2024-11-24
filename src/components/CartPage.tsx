'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { useSession } from 'next-auth/react';

interface Product {
  imageUrl: string;
  name: string;
  price: number;
}

const sayurProducts: Product[] = [
  { imageUrl: '/sayur/1.png', name: 'Kol Merah', price: 20000 },
  { imageUrl: '/sayur/2.png', name: 'Kangkung', price: 10000 },
  { imageUrl: '/sayur/3.png', name: 'Sawi', price: 8000 },
  { imageUrl: '/sayur/4.png', name: 'Sayur Pare', price: 10000 },
  { imageUrl: '/sayur/5.png', name: 'Bayam', price: 20000 },
  { imageUrl: '/sayur/6.png', name: 'Ubi', price: 20000 },
  { imageUrl: '/sayur/7.png', name: 'Brokoli', price: 30999 },
  { imageUrl: '/sayur/8.png', name: 'Buncis', price: 10900 },
  { imageUrl: '/sayur/9.png', name: 'Wortel', price: 10000 },
];

const allProducts: Product[] = [...sayurProducts];

const CartPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, removeItem, clearCart, addItemToCart, toggleItemChecked } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    // Redirect to login if the user is not logged in
    if (!session?.user) {
      router.push('/login');
    }
  }, [session, router]);

  const totalPrice = cartItems.reduce(
    (total, item) => (item.isChecked ? total + item.price * item.quantity : total),
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
      router.push('/checkout');
    }
  };

  useEffect(() => {
    const shuffledProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 15);
    setRecommendedProducts(shuffledProducts);
  }, []);

  if (!session?.user) {
    return null; // Return null until redirection happens
  }

  return (
    <div className="container mx-auto pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600"></h1>
      <div className="flex items-center mb-4">
        <h2 className="text-5xl font-semibold text-green-600">Keranjang Belanja</h2>
      </div>

      {cartItems.length === 0 ? (
        <div>Keranjang belanja kosong.</div>
      ) : (
        <div>
          <div>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
          </div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.name}>
                <div>
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(item.name)}
                  />
                  {item.name}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
