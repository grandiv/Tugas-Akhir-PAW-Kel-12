"use client";

import HistoryCard from "@/components/HistoryCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface History {
  id: string;
  date: string;
  state: string;
  items: Product[];
}

const RiwayatPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/history", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: History[] = await response.json();
        setHistoryData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching history data:", error);
        setError("Failed to load history data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  // Fungsi untuk menangani pembatalan di state lokal
  const handleCancel = (id: string) => {
    setHistoryData((prevData) =>
      prevData.map((history) =>
        history.id === id ? { ...history, state: "DIBATALKAN" } : history
      )
    );
  };

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
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : historyData.length > 0 ? (
          historyData.map((history) => (
            <HistoryCard
              key={history.id}
              id={history.id}
              date={history.date}
              items={history.items}
              state={history.state}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <p>No history data available.</p>
        )}
      </div>
    </main>
  );
};

export default RiwayatPage;
