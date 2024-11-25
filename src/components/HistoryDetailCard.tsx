"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import LoadingComponent from "./loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  address?: string;
}

interface DetailedHistoryCardData {
  id: string;
  date: string;
  status: string;
  totalAmount: number;
  user: User;
  items: Product[];
}
interface DetailedHistoryCardProps {
  id: string;
  onClose: () => void; // Callback function from the parent
}
export default function HistoryDetailCard({
  id,
  onClose,
}: DetailedHistoryCardProps) {
  const [data, setData] = useState<DetailedHistoryCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNoDataFound, setShowNoDataFound] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/history/${id}`, { method: "GET" });

        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  const generatePDF = () => {
    if (!data) return;

    const doc = new jsPDF();

    // Add logo or header
    doc.setFontSize(20);
    doc.text("Order Receipt", 10, 20);
    doc.setFontSize(12);
    doc.text("Thank you for your order!", 10, 30);

    // Add user and order details
    doc.setFontSize(14);
    doc.text("Order Details", 10, 40);
    doc.setFontSize(12);
    doc.text(`Order ID: ${data.id}`, 10, 50);
    doc.text(`Order Date: ${data.date}`, 10, 60);
    doc.text(`Status: ${data.status}`, 10, 70);
    doc.text(`Total Amount: Rp${data.totalAmount.toLocaleString()}`, 10, 80);

    doc.text("Customer Details", 10, 90);
    doc.text(`Name: ${data.user.name}`, 10, 100);
    doc.text(`Email: ${data.user.email}`, 10, 110);

    // Add product details
    let yPosition = 120;
    doc.setFontSize(14);
    doc.text("Items Purchased", 10, yPosition);

    doc.setFontSize(12);
    yPosition += 10;

    data.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.product.name}`, 10, yPosition);
      doc.text(`   - Quantity: ${item.quantity}`, 10, yPosition + 10);
      doc.text(
        `   - Price: Rp${item.price.toLocaleString()} (Subtotal: Rp${(
          item.price * item.quantity
        ).toLocaleString()})`,
        10,
        yPosition + 20
      );
      yPosition += 30;

      // Check if we need a page break
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 10, 290);

    // Save the PDF
    doc.save(`Order_${data.id}.pdf`);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40" />

        {/* Card Container */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Card className="p-6 border rounded-lg shadow-md bg-white text-gray-800 flex flex-col items-center w-full max-w-lg mx-auto">
              <button
                className="flex justify-end w-full text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                x
              </button>
              <p className="text-red-500 font-semibold">Error: {error}</p>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    setShowNoDataFound(true);
    return (
      <>
        <div className="fixed w-full h-screen flex items-center justify-center top-0 left-0 bg-black bg-opacity-20" />
        <div className="fixed w-full h-screen flex items-center justify-center top-0 left-0 ">
          <Card className="p-6 border rounded-lg shadow-md bg-white text-gray-800 flex flex-col items-center">
            <button className="flex justify-end w-full" onClick={onClose}>
              x
            </button>
            <p className="text-gray-500 font-semibold">No Data Found</p>
          </Card>
        </div>
        {showNoDataFound && (
          <AlertDialog open={showNoDataFound}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tidak Ada Data Ditemukan</AlertDialogTitle>
                <AlertDialogDescription>
                  Silakan coba lagi
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-[#0B9343] hover:bg-[#0B7B3E]"
                  onClick={() => setShowNoDataFound(false)}
                >
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  const { date, status, totalAmount, user, items } = data;

  return (
    <>
      <div className="fixed inset-0 bg-black/80" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl mx-auto p-6 mt-24 border rounded-lg shadow-lg bg-white text-gray-800">
            <button
              className="flex justify-end w-full text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              x
            </button>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  width={60}
                  height={60}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div
                className={`mt-4 sm:mt-0 p-2 rounded-md text-sm font-semibold ${getStatusClass(
                  status
                )}`}
              >
                {status}
              </div>
            </div>

            {/* Order Information */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Order ID:</span> {id}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Order Date:</span> {date}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Total Amount:</span>{" "}
                <span className="text-green-600 font-bold">
                  Rp{totalAmount.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Alamat:</span> {user.address}
              </p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-4 mb-6">
              {items.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg shadow-sm"
                >
                  <Image
                    alt={product.product.name}
                    src={product.product.image}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <h4 className="font-semibold text-base">
                      {product.product.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Price: Rp{product.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Subtotal:{" "}
                      <span className="font-semibold">
                        Rp{(product.price * product.quantity).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Stock Available: {product.product.stock}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              {status === "SEDANG_DIPROSES" && (
                <Button
                  variant="custom"
                  className="bg-red-500 hover:bg-red-600 transition-colors duration-100 text-white font-medium px-4 py-2 text-sm"
                >
                  Cancel Order
                </Button>
              )}
              <Button
                onClick={generatePDF}
                variant="custom"
                className="bg-green-500 hover:bg-green-600 transition-colors duration-100 text-white font-medium px-4 py-2 text-sm"
              >
                Download
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function getStatusClass(state: string): string {
  switch (state) {
    case "SEDANG_DIPROSES":
      return "bg-yellow-600 text-yellow-600 bg-opacity-25";
    case "DITUNDA":
      return "bg-gray-500 text-gray-500 bg-opacity-25";
    case "DIBATALKAN":
      return "bg-red-500 text-red-500 bg-opacity-25";
    case "SELESAI":
      return "bg-green-500 text-green-500 bg-opacity-25";
    default:
      return "bg-blue-500 text-blue-500 bg-opacity-25";
  }
}
