"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard"; // Adjust the path as needed
import LoadingComponent from "./loading";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  desc: string;
  imageUrl: string;
  stock: number;
  netto: string;
  createdAt: string;
  updatedAt: string;
}

// Advertisement images
const adImages = [
  "/homepage/Iklan_1.jpg",
  "/homepage/Iklan_2.jpg",
  "/homepage/Iklan_3.jpg",
  "/homepage/Iklan_4.jpg",
];

// Sliding Advertisement Component
const AdSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % adImages.length);
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {adImages.map((src, index) => (
        <Image
          key={index}
          width={1920}
          height={1080}
          src={src}
          alt={`Ad ${index + 1}`}
          priority={true}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ position: index === currentIndex ? "relative" : "absolute" }}
        />
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {adImages.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};


// HomePage Component
const HomePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle scroll event to show/hide arrow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNextSlide = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % newProducts.length);
  };

  const handlePrevSlide = () => {
    setSlideIndex(
      (prevIndex) => (prevIndex - 1 + newProducts.length) % newProducts.length
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Fetch data using the native fetch API
        const response = await fetch("/api/product");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          // Get random 10 products for "Mungkin Anda Suka" section
          const randomProducts = [...data]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
          setProducts(randomProducts);

          // Get latest 5 products for "Produk Terbaru" section
          const latestProducts = [...data]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);
          setNewProducts(latestProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-[95vh] bg-cover bg-center flex items-center justify-start pl-10 text-white"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        <div className="z-10 text-left w-1/2">
          <h1 className="text-7xl md:text-8xl font-bold">
            100% <span className="text-green-500">Lokal</span>
          </h1>
          <p className="mt-4 bg-yellow-500 text-gray-900 inline-block px-6 py-2 rounded-lg text-3xl">
            Fresh & Natural dari Alam
          </p>
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <button className="mt-4 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-md text-lg hover:bg-green-600">
              Belanja Sekarang
            </button>
            <div className="mt-4 md:mt-0 text-green-500 border border-green-500 px-4 py-2 rounded-md inline-block bg-white bg-opacity-10">
              📍 Hanya di Yogyakarta
            </div>
          </div>
        </div>

        {/* Hero Icon */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-center overflow-hidden">
          <Image
            width={1920}
            height={1080}
            src="/homepage/hero_icon.png"
            alt="Fresh Vegetables"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Scroll Down Arrow */}
        {isScrolled && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </section>

      {/* Sliding Advertisement Section */}
      <section className="w-full bg-gray-100">
        <AdSlider />
      </section>

      {/* Our New Product Section with Sliding Carousel */}
      <section className="w-full py-16 px-10">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Produk Terbaru Kami
        </h2>
        <div className="relative flex items-center">
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 z-10 p-2 bg-gray-200 rounded-full max-md"
          >
            ◀
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-hidden w-full place-self-center">
            {isLoading ? (
              <LoadingComponent />
            ) : error ? (
              <p className="text-center col-span-5 text-red-500">{error}</p>
            ) : (
              newProducts
                .slice(slideIndex, slideIndex + 5)
                .map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imageUrl={product.imageUrl}
                    name={product.name}
                    desc={product.desc}
                    netto={product.netto}
                    stock={product.stock}
                    price={product.price}
                  />
                ))
            )}
          </div>
          <button
            onClick={handleNextSlide}
            className="absolute right-0 z-10 p-2 bg-gray-200 rounded-full"
          >
            ▶
          </button>
        </div>
      </section>

      {/* Ads Section */}
      <section className="flex items-center justify-center py-10">
        <div
          className="relative flex items-center w-[100%] max-w-6xl rounded-lg overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url('/homepage/background.png')` }}
        >
          <div className="flex-shrink-0 w-1/3 h-full">
            <Image
              width={1920}
              height={1080}
              src="/homepage/ads_icon.png"
              alt="Grocery Delivery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center w-2/3 p-8 text-left text-white">
            <h2 className="text-4xl font-bold mb-4">Gratis Ongkir 10K</h2>
            <p className="mb-6 text-lg">
              Belanja hingga Rp 100.000,- dan dapatkan gratis ongkir
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700">
                Belanja Sekarang
              </button>
              <button className="px-6 py-2 bg-yellow-500 rounded-md text-gray-900 hover:bg-yellow-600">
                Gratis Ongkir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Product Section */}
      <section className="w-full py-16 px-10">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Mungkin Anda Suka
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 place-self-center">
          {isLoading ? (
            <LoadingComponent />
          ) : error ? (
            <p className="text-center col-span-5 text-red-500">{error}</p>
          ) : (
            products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                desc={product.desc}
                netto={product.netto}
                stock={product.stock}
                price={product.price}
              />
            ))
          )}
        </div>
      </section>

      {/* Order Ads Section */}
      <section className="w-full">
        <div className="relative w-full h-auto">
          <Image
            width={1920}
            height={1080}
            src="/homepage/iklan_5.jpg"
            alt="Advertisement"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Expected Ads Section */}
      <section className="w-full">
        <div className="relative w-full h-auto">
          <Image
            width={1920}
            height={1080}
            src="/homepage/iklan_6.jpg"
            alt="Advertisement"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
