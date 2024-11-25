// src/components/CartPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import CartCard from '@/components/CartCard';

interface Product {
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  isChecked: boolean;
  product: Product;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        console.log('Initiating cart items fetch...');
        
        const response = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (Array.isArray(data)) {
          setCartItems(data);
          setError(null);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Detailed fetch error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load cart items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }

      setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <main className="pt-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl md:text-5xl font-semibold text-green-600">Shopping Cart</h2>
        <div className="text-xl font-semibold">
          Total: Rp{calculateTotal().toLocaleString()}
        </div>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading cart items...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartCard
              key={item.id}
              id={item.id}
              name={item.product.name}
              price={item.product.price}
              quantity={item.quantity}
              imageUrl={item.product.image}
              onRemove={handleRemoveItem}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;