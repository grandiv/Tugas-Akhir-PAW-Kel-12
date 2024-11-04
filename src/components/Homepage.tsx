import React from "react";
import ProductCard from "@/components/ProductCard";  // Adjust the path as needed

const seafoodProducts = [
  {
    imageUrl: "/seafood/atlanticsalmon.jpeg",
    name: "Atlantic Salmon Fillets",
    price: 99000,
  },
  {
    imageUrl: "/seafood/rawshrimp.webp",
    name: "Raw Shrimp, Peeled & Deveined",
    price: 40000,
  },
  {
    imageUrl: "/seafood/4.jpg",
    name: "Scallops, Wild Caught",
    price: 69000,
  },
  {
    imageUrl: "/seafood/6.jpeg",
    name: "Lobster Tails",
    price: 49000,
  },
  { imageUrl: "/seafood/4.jpg", name: "Scallops, Wild Caught", price: 69000 },
];

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-start pl-10 text-white"
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
            src="/homepage/hero_icon.png"
            alt="Fresh Vegetables"
            className="w-3/4 h-auto"
          />
        </div>
      </section>

      {/* New Product Section */}
      <section className="w-full py-16 px-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Our New Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {seafoodProducts.map((product, index) => (
            <ProductCard
              key={index}
              imageUrl={product.imageUrl}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </section>

       {/* Ads Section */}
       <section className="flex items-center justify-center py-10">
      {/* Container with background image */}
      <div
        className="relative flex items-center w-[80%] max-w-4xl rounded-lg overflow-hidden shadow-lg bg-cover bg-center"
        style={{ backgroundImage: `url('/homepage/background.png')` }}
      >
        {/* Image on the left side */}
        <div className="flex-shrink-0 w-1/3 h-full">
          <img
            src="/homepage/ads_icon.png"
            alt="Grocery Delivery"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text and Buttons on the right side */}
        <div className="flex flex-col justify-center w-2/3 p-8 text-left text-white">
          <h2 className="text-4xl font-bold mb-4">Gratis Ongkir 50K</h2>
          <p className="mb-6 text-lg">
            Belanja hingga Rp 50.000,- dan dapatkan gratis ongkir
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700">
              Shop now
            </button>
            <button className="px-6 py-2 bg-yellow-500 rounded-md text-gray-900 hover:bg-yellow-600">
              Gratis Ongkir
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default HomePage;
