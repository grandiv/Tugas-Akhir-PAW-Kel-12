"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Sort from "@/context/Sort";
import Image from "next/image";
import { Button } from "./ui/button";

export default function BuahPage() {
  const { searchTerm } = useSearch();
  const [buahProducts, setBuahProducts] = useState([]);
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
        const response = await fetch("/api/product?category=Buah", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
  
        const data = await response.json();
        setBuahProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const filteredProducts = buahProducts
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
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-between px-20 text-white gap-[10vw]"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        <div className="z-10 text-left w-fit">
          <h1 className="text-6xl md:text-7xl font-bold">
            <span className="text-white">Segar,</span>{" "}
            <span className="text-[#E2A312]">Sehat,</span>{" "}
            <span className="text-green-500">Alami</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-6 py-2 rounded-lg text-3xl">
            <span className="text-green-500">Kesegaran</span> dari buah pilihan
          </p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <Button
              onClick={scrollToProducts}
              variant="custom"
              className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600"
            >
              Belanja Sekarang
            </Button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md bg-white bg-opacity-10">
              📍 Hanya di Yogyakarta
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-center overflow-hidden">
          <Image
            src="/buah/buah_hero.png"
            alt="Buah"
            className="object-cover"
            width={500}
            height={287}
          />
        </div>
      </section>

      {/* Display Product Count and Sort Option */}
      <div className="flex items-center justify-between my-4 mx-6">
        <p>
          Menampilkan dari{" "}
          <span className="font-bold">{filteredProducts.length} produk</span>
        </p>
        <Sort onSortChange={setSortOrder} />
      </div>

      {/* Product Section */}
      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : error ? (
        <p className="text-center mt-8 text-red-500">{error}</p>
      ) : (
        <div
          ref={productsRef} // Attach the ref for scrolling
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5"
        >
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
