import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import Image from "next/image";
import LoadingComponent from "./loading";

export default function Checkout() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit_card",
  });

  const [cartData, setCartData] = useState({
    cartItems: [],
    subtotal: 0,
    shippingCost: 0,
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart data
        const cartResponse = await fetch("/api/cart");
        const cartData = await cartResponse.json();

        if (cartData.success) {
          const checkedItems = cartData.cartItems.filter(
            (item: any) => item.isChecked
          );
          const subtotal = checkedItems.reduce(
            (sum: any, item: any) => sum + item.productPrice * item.quantity,
            0
          );
          const total = subtotal + cartData.shippingCost;

          setCartData({
            cartItems: checkedItems,
            subtotal,
            shippingCost: cartData.shippingCost,
            total,
          });
        } else {
          setErrorMessage(cartData.error || "Failed to fetch cart data");
        }

        // Fetch user profile
        const profileResponse = await fetch("/api/profile");
        const profileData = await profileResponse.json();

        if (profileData.success) {
          setFormData({
            fullName: profileData.user.nama || "",
            email: profileData.user.email || "",
            phone: profileData.user.nohandphone || "",
            address: profileData.user.alamat || "",
            paymentMethod: "credit_card",
          });
        } else {
          setErrorMessage(profileData.error || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingDetails: formData,
          cartItems: cartData.cartItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessAlert(true);
      } else {
        setErrorMessage(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Error placing order");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (errorMessage) {
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">
                Informasi Pengiriman
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Metode Pembayaran
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="e_wallet">E-Wallet</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Buat Pesanan
                </button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">
                  Rincian Pemesanan
                </h2>
                <div className="space-y-4">
                  {cartData.cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={item.imageUrl || "/default-product.png"}
                        height={500}
                        width={500}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="text-sm text-gray-500">
                          Quantitas: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          Rp {item.productPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        Rp{" "}
                        {(item.productPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>Rp {cartData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Pemesanan</span>
                    <span>Rp {cartData.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rp {cartData.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">Estimasi Pengiriman</h3>
                <p className="text-gray-600">24 jam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessAlert && (
        <AlertDialog open={showSuccessAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Order Berhasil Dipesan</AlertDialogTitle>
              <AlertDialogDescription>
                Silakan cek riwayat pembelian Anda
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-[#0B9343] hover:bg-[#0B7B3E]"
                onClick={() => router.push("/history")}
              >
                Lihat Riwayat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
