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
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-start pl-10 text-white"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        <div className="z-10 text-left w-1/2">
          <h1 className="text-6xl md:text-7xl font-bold">
            Penuhi <span className="text-green-500">Protein</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-6 py-2 rounded-lg text-3xl">
            Kualitas terbaik dari peternak lokal
          </p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <button className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600">
              Shop now
            </button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md inline-block bg-white bg-opacity-10">
              📍 Only in Yogyakarta
            </div>
          </div>
        </div>

        {/* Hero Icon positioned to the right and within half the screen */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-center overflow-hidden">
          <img
            src="/daging/daging_icon.png"
            alt="Fresh Vegetables"
            className="w-3/4 h-auto"
          />
        </div>
      </section>

      {/* Display Product Count aligned to the left */}
      <p className="text-left text-lg my-4 ml-6">
        Menampilkan dari <span className="font-bold">20 produk</span>
      </p>

      {/* Meat Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5 mt-8">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={index}
            imageUrl={product.imageUrl}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
