import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BuahList from "@/components/BuahList";

const BuahPage: React.FC = () => {
  return (
    <main>
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
            alt="Sayur"
            className="object-cover"
            width={500}
            height={287}
          />
        </div>
      </section>
      <BuahList />
    </main>
  );
};

export default BuahPage;
