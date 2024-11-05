"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import Image from "next/image";
import { Button } from "./ui/button";

const sayurProducts = [
  {
    imageUrl: "/sayur/1.png",
    name: "kol merah",
    price: 30000,
  },
  {
    imageUrl: "/sayur/2.png",
    name: "Kangkung",
    price: 40000,
  },
  {
    imageUrl: "/sayur/3.png",
    name: "Sawi",
    price: 58000,
  },
  { imageUrl: "/sayur/4.png", name: "Sayur Pare 400gr", price: 20000 },
  { imageUrl: "/sayur/5.png", name: "Bayam 400gr", price: 30000 },
  { imageUrl: "/sayur/6.png", name: "Ubi 500gr", price: 20000 },
  { imageUrl: "/sayur/7.png", name: "Brokoli 400gr", price: 30999 },
    {
        imageUrl: "/sayur/8.png",
        name: "Buncis 400gr",
        price: 10900,
    },
  { imageUrl: "/sayur/9.png", name: "Wortel 400gr", price: 89000 },
];

export default function Sayur() {
  const { searchTerm } = useSearch();

  const filteredProducts = sayurProducts.filter((product) =>
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
            Sehat adalah <span className="text-green-500">Kekayaan</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-6 py-2 rounded-lg text-3xl">
            Kualitas terbaik dari pasar lokal
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
            src="/sayur/sayur2.png"
            alt="Sayur"
            className="object-cover"
            width={500}
            height={287}
          />
        </div>
      </section>

      <p className="text-left text-lg my-4 ml-6">
        Menampilkan dari{" "}
        <span className="font-bold">{sayurProducts.length} produk</span>
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
