import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil order_id dan transaction_status dari notifikasi Midtrans
    const { order_id, transaction_status } = body;

    // Pemetaan status Midtrans ke status di database
    const statusMap: Record<string, "SELESAI" | "DITUNDA" | "DIBATALKAN" | "SEDANG_DIPROSES"> = {
      settlement: "SELESAI",
      pending: "DITUNDA",
      cancel: "DIBATALKAN",
      deny: "DIBATALKAN",
      expire: "DIBATALKAN",
    };

    const mappedStatus = statusMap[transaction_status] || "DITUNDA";

    // Update status di database
    const updatedHistory = await prisma.history.update({
      where: { id: order_id },
      data: {
        midtransPaymentStatus: transaction_status,
        status: mappedStatus,
      },
    });

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
