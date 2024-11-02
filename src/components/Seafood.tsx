"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";

const seafoodProducts = [
  {
    imageUrl: "/seafood/atlanticsalmon.jpeg",
    name: "Atlantic Salmon Fillets",
    price: 99000,
  },
  {
    imageUrl: "/seafood/rawshrimp.webp",
    name: "Raw Shrimp, Peeled & Deveined",
    price: 40000,
  },
  { imageUrl: "/seafood/3.jpg", name: "Alaskan King Crab Legs", price: 58000 },
  { imageUrl: "/seafood/4.jpg", name: "Scallops, Wild Caught", price: 69000 },
  { imageUrl: "/seafood/5.webp", name: "Fresh Oysters (Dozen)", price: 73000 },
  { imageUrl: "/seafood/6.jpeg", name: "Lobster Tails", price: 49000 },
  { imageUrl: "/seafood/7.jpg", name: "Tilapia Fillets", price: 50999 },
  { imageUrl: "/seafood/tunasteak.webp", name: "Tuna Steaks", price: 109000 },
  { imageUrl: "/seafood/9.jpg", name: "Cod Fillets", price: 89000 },
  { imageUrl: "/seafood/10.webp", name: "Mussels, Fresh", price: 74000 },
];

export default function Seafood() {
  const { searchTerm } = useSearch();

  const filteredProducts = seafoodProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-6 gap-5">
      {filteredProducts.map((product, index) => (
        <ProductCard
          key={index}
          imageUrl={product.imageUrl}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  );
}
