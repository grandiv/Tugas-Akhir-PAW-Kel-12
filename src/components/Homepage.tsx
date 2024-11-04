import React from "react";

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
        <h2 className="text-3xl font-bold mb-8 text-center">Our New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example Product Cards */}
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Product 1</h3>
            <p className="text-gray-600">Description of Product 1.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Product 2</h3>
            <p className="text-gray-600">Description of Product 2.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Product 3</h3>
            <p className="text-gray-600">Description of Product 3.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
