import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil transaction_id dan transaction_status dari notifikasi Midtrans
    const { transaction_id, transaction_status } = body;

    // Pemetaan status Midtrans ke status di database
    const statusMap: Record<string, "SELESAI" | "DITUNDA" | "DIBATALKAN" | "SEDANG_DIPROSES"> = {
      settlement: "SELESAI",   // Pembayaran berhasil
      pending: "DITUNDA",      // Pembayaran tertunda
      cancel: "DIBATALKAN",    // Pembayaran dibatalkan
      deny: "DIBATALKAN",      // Pembayaran ditolak
      expire: "DIBATALKAN",    // Pembayaran kadaluwarsa
    };

    const mappedStatus = statusMap[transaction_status] || "DITUNDA"; // Default "DITUNDA" jika status tidak dikenali

    // Update status di database berdasarkan midtransTransactionId yang sesuai dengan transaction_id
    const updatedHistory = await prisma.history.update({
      where: {
        midtransTransactionId: transaction_id,  // Pencocokan berdasarkan transaction_id yang diterima
      },
      data: {
        midtransPaymentStatus: transaction_status,  // Menyimpan status transaksi dari Midtrans
        status: mappedStatus,                      // Menyimpan status yang dipetakan
      },
    });

    // Mengirimkan response bahwa transaksi berhasil diupdate
    return NextResponse.json({
      success: true,
      message: "Transaction status updated successfully",
      data: updatedHistory,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
