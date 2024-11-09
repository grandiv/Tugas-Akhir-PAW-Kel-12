import React from "react";
import { CartItem } from "@/context/CartContext";

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, shippingCost, grandTotal }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      {/* Shipping Address Section */}
      <section className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-600">Alamat Pengiriman</h2>
        <p>Nama User (08-----)</p>
        <p>Jalan......</p>
      </section>

      {/* Ordered Products Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Produk Dipesan</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2">Produk</th>
              <th className="text-left p-2">Harga Satuan</th>
              <th className="text-left p-2">Jumlah</th>
              <th className="text-left p-2">Subtotal Produk</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.name} className="border-t">
                <td className="p-4 flex items-start">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                  </div>
                </td>
                <td className="p-4">Rp {item.price.toLocaleString()}</td>
                <td className="p-4 text-center">{item.quantity}</td>
                <td className="p-4">Rp {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Order Summary Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
        <div className="flex justify-between mb-2">
          <span>Total Harga</span>
          <span>Rp {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total Ongkos Kirim</span>
          <span>Rp {shippingCost.toLocaleString()}</span>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="flex justify-between font-bold">
          <span>Total Belanja</span>
          <span>Rp {grandTotal.toLocaleString()}</span>
        </div>
      </section>

      {/* Payment Method Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>
        {/* Add payment method options here if necessary */}
      </section>

      {/* Order Button */}
      <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
        Buat Pesanan
      </button>
    </div>
  );
};

export default Checkout;
