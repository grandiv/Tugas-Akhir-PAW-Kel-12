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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState(false);
  const [showFailedToAddAlert, setShowFailedToAddAlert] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
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
        throw new Error("Failed to add to cart");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to add to cart");
      }

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      setShowFailedToAddAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Card className="max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:max-w-full md:max-w-sm">
          <CardHeader className="h-[17vw]">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardContent>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{desc}</CardDescription>
            <p className="text-lg font-semibold text-green-600">Rp {price}</p>
            <p className="text-sm text-gray-500">{netto}</p>
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
                <span className="loader mr-2" />
              ) : stock > 0 ? (
                "Tambah"
              ) : (
                "Stok Habis"
              )}
            </button>
          </CardFooter>
        </Card>

        {showNotification && (
          <AlertDialog open={showNotification}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sukses</AlertDialogTitle>
                <AlertDialogDescription>
                  Berhasil Menambahkan Barang ke Keranjang
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {showFailedToAddAlert && (
        <AlertDialog open={showFailedToAddAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Gagal Menambahkan Barang</AlertDialogTitle>
              <AlertDialogDescription>Silakan coba lagi</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-[#0B9343] hover:bg-[#0B7B3E]"
                onClick={() => setShowFailedToAddAlert(false)}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ProductCard;
