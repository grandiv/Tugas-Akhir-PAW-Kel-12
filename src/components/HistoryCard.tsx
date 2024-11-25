"use client";

import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import HistoryDetailCard from "./HistoryDetailCard";

interface Product {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface HistoryCardProps {
  id: string; // History ID
  date: string;
  state: string;
  items: Product[];
  onCancel?: (id: string) => void; // Callback for successful cancellation
}

export default function HistoryCard({
  id,
  date,
  state,
  items,
  onCancel,
}: HistoryCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const handleDetailCard = async () => {
    setDetailOpen(!isDetailOpen);
  }

  // Fungsi untuk menangani pembatalan order
  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Cancel order result:", result);

      // Panggil callback untuk memperbarui state di parent component
      if (onCancel) onCancel(id);
      alert("Order cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const totalAmount = items.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <>
    <Card className="p-4 border rounded-lg shadow-sm bg-white text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <p className="font-medium text-lg">{date}</p>
        <div className={`p-2 rounded-[3px] text-sm font-semibold ${getStatusClass(state)}`}>
          {state}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((product, index) => (
          <Card
            key={index}
            className="flex items-center gap-4 p-3 border rounded-lg shadow-sm"
          >
            <Image
              alt={product.name}
              src={product.imageUrl}
              height={1000}
              width={1000}
              className="w-20 h-20 rounded object-cover"
            />
            <div className="flex flex-col flex-1">
              <h3 className="font-semibold text-base">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Rp{product.price.toLocaleString()} x {product.quantity}
              </p>
            </div>
            <p className="font-semibold text-sm text-right">
              Rp{(product.price * product.quantity).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold text-lg">Total:</p>
        <p className="font-bold text-xl text-green-600">
          Rp{totalAmount.toLocaleString()}
        </p>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        {state === "SEDANG_DIPROSES" && (
          <Button
            variant="custom"
            className="bg-red-500 hover:bg-red-600 transition-colors duration-100 text-white font-medium px-4 py-2 text-sm"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </Button>
        )}
        <Button
          variant="custom"
          className="bg-green-500 hover:bg-green-600 transition-colors duration-100 text-white font-medium px-4 py-2 text-sm"
          onClick={handleDetailCard}
        >
          See Detail
        </Button>
      </div>
    </Card>
    {isDetailOpen&&<HistoryDetailCard id={id} onClose={handleDetailCard}/>}
    </>
  );
}

function getStatusClass(state: string): string {
  switch (state) {
    case "SEDANG_DIPROSES":
      return "bg-yellow-600 text-yellow-600 bg-opacity-25";
    case "DITUNDA":
      return "bg-green-500 text-green-500 bg-opacity-25";
    case "DIBATALKAN":
      return "bg-red-500 text-red-500 bg-opacity-25";
    default:
      return "bg-blue-500 text-blue-500 bg-opacity-25";
  }
}
