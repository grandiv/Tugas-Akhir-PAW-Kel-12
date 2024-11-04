import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ProductCardProps {
  imageUrl: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, name, price }) => {
  return (
    <Card className="max-w-sm flex flex-col justify-between h-[24rem]">
      <CardHeader className="h-[12rem]">
        <Image
          src={imageUrl}
          alt={name}
          width={200}
          height={200}
          className="rounded-t-lg object-cover mx-auto"
        />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between text-left px-4">
        <div>
          <CardTitle className="text-base font-bold mt-2 mb-1">{name}</CardTitle>
          <CardDescription className="text-sm"> {/* Removed mb-1 */}
            Rp {price.toLocaleString()}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="px-4"> {/* Removed mt-1 */}
        <button className="bg-green-600 text-white text-sm px-3 py-1 rounded-md w-full">
          Tambah
        </button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
