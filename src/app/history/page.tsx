"use client";

import { useOrders } from "@/hooks/useOrders";

export default function HistoryPage() {
  const { orders, loading } = useOrders();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">Order #{order._id}</p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold">
                Total: Rp {order.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <p>
                    {item.name} x{item.quantity}
                  </p>
                  <p>Rp {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
