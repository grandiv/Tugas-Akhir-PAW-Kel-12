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
  id: string; // Tambahkan id untuk mengidentifikasi produk
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
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      setShowNotification(false); // Pastikan notifikasi tidak tampil dulu
      setIsLoading(true); // Mulai loader

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal menambahkan produk ke keranjang"
        );
      }

      setShowNotification(true); // Tampilkan notifikasi berhasil
      setTimeout(() => setShowNotification(false), 2000);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false); // Hentikan loader
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
          {/* Price */}
          <CardDescription className="font-bold text-[22px] pt-2">
            Rp{price?.toLocaleString("id-ID")}
          </CardDescription>
          {/* Desc */}
          <CardDescription className="text-gray-700 text-sm mt-1">
            {desc}
          </CardDescription>
          {/* Netto */}
          <CardDescription className="text-gray-500 text-sm">
            Netto: {netto}
          </CardDescription>
          {/* Stock */}
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
            className={`${
              stock > 0
                ? "bg-green-600 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            } px-4 py-2 rounded-md w-full flex items-center justify-center`}
            disabled={stock <= 0 || isLoading}
          >
            {isLoading ? (
              <span className="loader mr-2" /> // Tambahkan loader styling atau gunakan library seperti `react-spinners`
            ) : stock > 0 ? (
              "Tambah"
            ) : (
              "Stok Habis"
            )}
          </button>
        </CardFooter>
      </Card>

      {/* Notifikasi */}
      {showNotification && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded shadow-lg">
          Barang telah disimpan di keranjang
        </div>
      )}
    </div>
  );
};

export default ProductCard;
