"use client";

import React, { useState, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import { Button } from "./ui/button";
import Sort from "@/context/Sort";

const seafoodProducts = [
  {
    imageUrl: "/seafood/atlanticsalmon.jpeg",
    name: "Salmon Filet",
    desc: "100g",
    stock: 10,
    price: 99000,
  },
  {
    imageUrl: "/seafood/rawshrimp.webp",
    name: "Udang Kupas",
    desc: "100g",
    stock: 10,
    price: 40000,
  },
  {
    imageUrl: "/seafood/3.jpg",
    name: "Kaki Alaskan",
    desc: "100g",
    stock: 10,
    price: 58000,
  },
  {
    imageUrl: "/seafood/4.jpg",
    name: "Kerang",
    desc: "100g",
    stock: 10,
    price: 69000,
  },
  {
    imageUrl: "/seafood/5.webp",
    name: "Tiram Segar",
    desc: "100g",
    stock: 10,
    price: 73000,
  },
  {
    imageUrl: "/seafood/6.jpeg",
    name: "Buntut Lobster",
    desc: "100g",
    stock: 10,
    price: 49000,
  },
  {
    imageUrl: "/seafood/7.jpg",
    name: "Nila Filet",
    desc: "100g",
    stock: 10,
    price: 50999,
  },
  {
    imageUrl: "/seafood/tunasteak.webp",
    name: "Tuna Steak",
    desc: "100g",
    stock: 10,
    price: 109000,
  },
  {
    imageUrl: "/seafood/9.jpg",
    name: "Ikan Kod Filet",
    desc: "100g",
    stock: 10,
    price: 89000,
  },
  {
    imageUrl: "/seafood/10.webp",
    name: "Kerang Remis",
    desc: "100g",
    stock: 10,
    price: 74000,
  },
];

export default function Seafood() {
  const { searchTerm } = useSearch();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = seafoodProducts
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
      <section
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-start pl-10 text-white"
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

        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-center overflow-hidden">
          <Image
            src="/seafood/seafood_hero.png"
            alt="Seafood"
            className="object-cover my-auto"
            width={500}
            height={287}
          />
        </div>
      </section>

      <div className="flex items-center justify-between my-4 mx-6">
        <p className="text-left text-lg">
          Menampilkan dari{" "}
          <span className="font-bold">{seafoodProducts.length} produk</span>
        </p>
        <Sort onSortChange={setSortOrder} />
      </div>

      <div
        ref={productsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5 mb-4"
      >
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={index}
            imageUrl={product.imageUrl}
            name={product.name}
            desc={product.desc}
            stock={product.stock}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
