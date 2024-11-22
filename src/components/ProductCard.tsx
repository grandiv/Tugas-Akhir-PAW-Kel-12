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
  imageUrl: string;
  name: string;
  desc: string;
  stock: number;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  name,
  desc,
  stock,
  price,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItemToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    addItemToCart({ imageUrl, name, price, quantity: 1, isChecked: true });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <Card className="max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <CardHeader className="h-[17vw]">
          <img
            src={imageUrl}
            alt={name}
            className="rounded-t-lg object-cover mx-auto"
          />
        </CardHeader>
        <CardContent className="pb-2">
          <CardTitle>{name}</CardTitle>
          {/* Price */}
          <CardDescription className="font-bold text-[22px] pt-2">
            Rp{price}
          </CardDescription>
          {/* Desc */}
          <CardDescription className="text-gray-700 text-sm mt-1">
            Netto: {desc}
          </CardDescription>
          {/* Stock */}
          <CardDescription className="text-gray-500 text-sm">
            Stock: {stock}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
          >
            Tambah
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
