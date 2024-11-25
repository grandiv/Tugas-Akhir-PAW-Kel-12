'use client';

import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

interface CartCardProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onRemove: (id: string) => void;
}

export default function CartCard({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onRemove,
}: CartCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this item from your cart?")) return;

    setIsRemoving(true);
    try {
      await onRemove(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const subtotal = price * quantity;

  return (
    <Card className="p-4 border rounded-lg shadow-sm bg-white text-gray-800">
      <div className="flex items-center gap-4">
        <Image
          alt={name}
          src={imageUrl}
          height={1000}
          width={1000}
          className="w-24 h-24 rounded object-cover"
        />
        <div className="flex flex-1 justify-between items-center">
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-gray-600">Rp{price.toLocaleString()} x {quantity}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-bold text-lg">
              Rp{subtotal.toLocaleString()}
            </p>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-red-500 hover:bg-red-600"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}