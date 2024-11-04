"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";

// Define meat products with images named "1.png" to "8.png"
const meatProducts = [
  { imageUrl: "/daging/1.png", name: "Daging Iga", price: 120000 },
  { imageUrl: "/daging/2.png", name: "Daging Ham", price: 75000 },
  { imageUrl: "/daging/3.png", name: "Daging Sapi Giling", price: 50000 },
  { imageUrl: "/daging/4.png", name: "Dada Ayam", price: 130000 },
  { imageUrl: "/daging/5.png", name: "Tulang Sapi", price: 45000 },
  { imageUrl: "/daging/6.png", name: "Ayam Utuh", price: 85000 },
  { imageUrl: "/daging/7.png", name: "Paha Ayam", price: 100000 },
  { imageUrl: "/daging/8.png", name: "Daging Sapi Steak", price: 90000 },
];

export default function Meat() {
  const { searchTerm } = useSearch();

  // Filter products based on search term
  const filteredProducts = meatProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5">
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
