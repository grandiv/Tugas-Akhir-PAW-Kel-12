import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil order_id dan new_status dari body
    const { order_id, new_status } = body;

    // Update status di database
    const updatedHistory = await prisma.history.update({
      where: { id: order_id },
      data: {
        midtransPaymentStatus: new_status,
        status: new_status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transaction status updated manually",
      data: updatedHistory,
    });
  } catch (error) {
    console.error("Error updating status manually:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
