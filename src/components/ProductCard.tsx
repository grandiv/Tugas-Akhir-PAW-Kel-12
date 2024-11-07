// src/app/components/ProductCard.tsx
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  imageUrl: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, name, price }) => {
  const { addItemToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false); // State untuk notifikasi

  const handleAddToCart = () => {
    addItemToCart({ imageUrl, name, price, quantity: 1, isChecked: true });
    setShowNotification(true); // Tampilkan notifikasi

    // Sembunyikan notifikasi setelah 2 detik
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <Card className="max-w-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <CardHeader className="h-[17vw]">
          <img src={imageUrl} alt={name} className="rounded-t-lg object-cover mx-auto" />
        </CardHeader>
        <CardContent>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Rp {price}</CardDescription>
        </CardContent>
        <CardFooter>
          <button onClick={handleAddToCart} className="bg-green-600 text-white px-4 py-2 rounded-md w-full">
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
