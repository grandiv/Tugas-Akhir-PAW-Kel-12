"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Sort from "@/context/Sort";
import { Button } from "./ui/button";

export default function Meat() {
  const { searchTerm } = useSearch();
  const [meatProducts, setMeatProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/product?category=Daging");
        setMeatProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = meatProducts
    .filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

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
            <Button
                onClick={scrollToProducts}
                className="px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600"
              >
                Belanja Sekarang
              </Button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md inline-block bg-white bg-opacity-10">
              📍 Hanya di Yogyakarta
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

      {/* Display Product Count and Sort Option */}
      <div className="flex items-center justify-between my-4 mx-6">
        <p className="text-left text-lg">
          Menampilkan dari <span className="font-bold">10 produk</span>
        </p>
        <Sort onSortChange={setSortOrder} />
      </div>

      {/* Meat Product Section */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5">
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
