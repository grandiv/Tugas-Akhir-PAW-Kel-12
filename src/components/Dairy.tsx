"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Sort from "@/context/Sort";
import { Button } from "./ui/button";

export default function DairyPage() {
  const { searchTerm } = useSearch();
  const [dairyProducts, setDairyProducts] = useState([]);
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
        const response = await fetch("/api/product?category=Dairy", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
  
        const data = await response.json();
        setDairyProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = dairyProducts
    .filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else if (sortOrder === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-start pl-10 text-white"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        <div className="z-10 text-left w-full">
          <h1 className="text-4xl md:text-6xl font-bold whitespace-nowrap">
            Kaya Kalsium, <span className="text-green-500">Kaya Manfaat</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-8 py-3 rounded-lg text-2xl md:text-3xl max-w-[90%]">
            Kualitas produk susu terbaik setiap hari.
          </p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <Button
              onClick={scrollToProducts}
              variant={"custom"}
              className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600"
            >
              Belanja Sekarang
            </Button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md inline-block bg-white bg-opacity-10">
              📍 Hanya di Yogyakarta
            </div>
          </div>
        </div>

        {/* Hero Icon */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-center overflow-hidden">
          <img
            src="/dairy/dairy_icon.png"
            alt="Dairy Products"
            width={717}
            height={348}
          />
        </div>
      </section>

      {/* Display Product Count and Sort Option */}
      <div className="flex items-center justify-between my-4 mx-6">
        <p className="text-left text-lg">
          Menampilkan dari{" "}
          <span className="font-bold">{filteredProducts.length} produk</span>
        </p>
        <Sort onSortChange={setSortOrder} />
      </div>

      {/* Dairy Product Section */}
      {isLoading ? (
        <p className="text-center mt-8">Loading products...</p>
      ) : error ? (
        <p className="text-center mt-8 text-red-500">{error}</p>
      ) : (
        <div
          ref={productsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5 mt-8"
        >
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard
              key={index}
              id={product.id}
              netto={product.netto}
              desc={product.desc}
              imageUrl={product.imageUrl}
              name={product.name}
              price={product.price}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
