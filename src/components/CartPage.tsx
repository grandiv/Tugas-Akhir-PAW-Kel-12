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

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cart', { cache: 'no-store' });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch cart items');
        }

        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError(
          error instanceof Error ? error.message : 'An error occurred while fetching cart items'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Remove an item from the cart
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
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }

      // Update local state after successful deletion
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove item from cart');
    }
  };

  // Calculate the total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <main className="pt-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl md:text-5xl font-semibold text-green-600">Shopping Cart</h2>
        <div className="text-xl font-semibold">
          Total: Rp{calculateTotal().toLocaleString('id-ID')}
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
