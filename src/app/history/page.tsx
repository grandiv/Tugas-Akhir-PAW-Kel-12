import HistoryCard from "@/components/HistoryCard";
import Image from "next/image";
import React from "react";

const dummyHistoryData = [
  {
    date: "01-11-2023",
    productList: [
      {
        imageUrl: "/sayur/1.png",
        name: "Tomat 500gr",
        price: 8000,
        quantity: 2,
      },
      {
        imageUrl: "/sayur/2.png",
        name: "Kentang 1kg",
        price: 15000,
        quantity: 2,
      },
    ],
    state: "Completed",
  },
  {
    date: "02-11-2023",
    productList: [
      {
        imageUrl: "/sayur/3.png",
        name: "Bawang Merah 250gr",
        price: 12000,
        quantity: 2,
      },
      {
        imageUrl: "/sayur/4.png",
        name: "Bawang Putih 250gr",
        price: 11000,
        quantity: 2,
      },
      {
        imageUrl: "/sayur/5.png",
        name: "Cabai Merah 200gr",
        price: 14000,
        quantity: 2,
      },
    ],
    state: "On Process",
  },
  {
    date: "03-11-2023",
    productList: [
      {
        imageUrl: "/sayur/6.png",
        name: "Bayam 300gr",
        price: 5000,
        quantity: 2,
      },
      {
        imageUrl: "/sayur/7.png",
        name: "Sawi Hijau 300gr",
        price: 6000,
        quantity: 2,
      },
    ],
    state: "Cancel",
  },
];

const RiwayatPage: React.FC = () => {
  return (
    <main className="pt-20">
      <div className="flex items-center mb-4">
        <Image
          src="/Logo_icon.png"
          alt="Logo"
          height={1000}
          width={1000}
          className="w-24 h-20 mr-8 object-contain"
        />
        <h2 className="text-5xl font-semibold text-green-600">History</h2>
      </div>
      <div className="flex flex-col gap-[8px] p-2">
        {dummyHistoryData.map((history, index) => (
          <HistoryCard
            key={index}
            date={history.date}
            productList={history.productList}
            state={history.state}
          />
        ))}
      </div>
    </main>
  );
};

export default RiwayatPage;
