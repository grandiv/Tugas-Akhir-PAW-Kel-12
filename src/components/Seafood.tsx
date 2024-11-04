"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import { Button } from "./ui/button";

const seafoodProducts = [
  {
    imageUrl: "/seafood/atlanticsalmon.jpeg",
    name: "Salmon Filet",
    price: 99000,
  },
  {
    imageUrl: "/seafood/rawshrimp.webp",
    name: "Udang Mentah Kupas",
    price: 40000,
  },
  {
    imageUrl: "/seafood/3.jpg",
    name: "Kaki Kepiting Alaskan King",
    price: 58000,
  },
  { imageUrl: "/seafood/4.jpg", name: "Kerang", price: 69000 },
  { imageUrl: "/seafood/5.webp", name: "Tiram Segar (1 Lusin)", price: 73000 },
  { imageUrl: "/seafood/6.jpeg", name: "Buntut Lobster", price: 49000 },
  { imageUrl: "/seafood/7.jpg", name: "Ikan Nila Filet", price: 50999 },
  {
    imageUrl: "/seafood/tunasteak.webp",
    name: "Ikan Tuna Steak",
    price: 109000,
  },
  { imageUrl: "/seafood/9.jpg", name: "Ikan Kod Filet", price: 89000 },
  { imageUrl: "/seafood/10.webp", name: "Kerang Remis Segar", price: 74000 },
];

export default function Seafood() {
  const { searchTerm } = useSearch();

  const filteredProducts = seafoodProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-between px-20 text-white gap-[10vw]"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        <div className="z-10 text-left w-fit">
          <h1 className="text-6xl md:text-7xl font-bold">
            Segar dari <span className="text-green-500">Laut</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-6 py-2 rounded-lg text-3xl">
            Kualitas terbaik dari peternak lokal
          </p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <Button
              variant={"custom"}
              className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600"
            >
              Shop now
            </Button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md inline-block bg-white bg-opacity-10">
              📍 Only in Yogyakarta
            </div>
          </div>
        </div>

        <div className="relative h-fit right-0 w-fit flex items-end justify-center overflow-hidden">
          <Image
            src="/seafood/seafoodhero.png"
            alt="Seafood"
            className="object-cover"
            width={500}
            height={287}
          />
        </div>
      </section>

      <p className="text-left text-lg my-4 ml-6">
        Menampilkan dari{" "}
        <span className="font-bold">{seafoodProducts.length} produk</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5 mb-11">
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
