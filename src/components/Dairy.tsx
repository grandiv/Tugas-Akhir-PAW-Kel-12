"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import { Button } from "./ui/button";
import Sort from "@/context/Sort";

const dairyProduct = [
    {imageUrl: "/dairy/AnchorUnsaltedButter227gr.png", name: "Mentega Tawar", price: 50000},
    {imageUrl: "/dairy/cimorybites120gr.png", name: "Yogurt Bites Stroberi ", price: 10000},
    {imageUrl: "/dairy/CimoryGreekYogurtPlain.png", name: "Greek Yogurt Rasa Plain ", price: 65000},
    {imageUrl: "/dairy/cimorysqueezebanana.png", name: "Yogurt Squeeze Pisang", price: 8000},
    {imageUrl: "/dairy/Greenfields.png", name: " Susu Full Cream", price: 40000},
    {imageUrl: "/dairy/susukedelaivsoy300ml.png", name: "Susu Kedelai", price: 15000},
    {imageUrl: "/dairy/susuoatsidecoffe.png", name: "Susu Oat", price: 10000},
    {imageUrl: "/dairy/kejukraft150gr.png", name: "Keju Cheddar", price: 9000},
    {imageUrl: "/dairy/kejubabybel.png", name: "Keju Babybel", price: 60000},
    {imageUrl: "/dairy/kejuparmesan.png", name: "Keju Parmesan", price: 55000},
];

export default function DairyPage() {
    const { searchTerm } = useSearch();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  
    const filteredProducts = dairyProduct
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
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
            Menampilkan dari <span className="font-bold">10 produk</span>
          </p>
          <Sort onSortChange={setSortOrder} />
        </div>
  
        {/* Dairy Product Section */}
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