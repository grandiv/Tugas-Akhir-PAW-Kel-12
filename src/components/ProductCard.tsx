import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  imageUrl: string;
  name: string;
  desc: string;
  netto: string;
  stock: number;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  name,
  desc,
  netto,
  stock,
  price,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      setIsAddingToCart(true);

      // Add item to cart in database
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      // Update local cart state
      addItemToCart({
        imageUrl,
        name,
        price,
        quantity: 1,
        isChecked: true,
      });

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(error instanceof Error ? error.message : "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative">
      <Card className="max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:max-w-full md:max-w-sm">
        <CardHeader className="h-[17vw]">
          <img
            src={imageUrl || "/default-placeholder.png"}
            alt={name}
            className="rounded-t-lg object-cover mx-auto"
          />
        </CardHeader>
        <CardContent className="pb-2">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="font-bold text-[22px] pt-2">
            Rp{price.toLocaleString("id-ID")}
          </CardDescription>
          <CardDescription className="text-gray-700 text-sm mt-1">
            {desc}
          </CardDescription>
          <CardDescription className="text-gray-500 text-sm">
            Netto: {netto}
          </CardDescription>
          <CardDescription
            className={`text-sm ${
              stock > 0 ? "text-gray-500" : "text-red-500"
            }`}
          >
            Stock: {stock > 0 ? stock : "Stok Habis"}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0 || isAddingToCart}
            className={`${
              stock > 0
                ? "bg-green-600 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            } px-4 py-2 rounded-md w-full disabled:opacity-50`}
          >
            {isAddingToCart
              ? "Menambahkan..."
              : stock > 0
              ? "Tambah"
              : "Stok Habis"}
          </button>
        </CardFooter>
      </Card>

      {showNotification && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded shadow-lg">
          Barang telah disimpan di keranjang
        </div>
      )}
    </div>
  );
};

export default ProductCard;
