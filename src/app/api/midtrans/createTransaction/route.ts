import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import midtransClient  from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Fetch the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty." },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for product: ${item.product.name}.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Configure Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: false, // Set to true if live
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });

    // Midtrans transaction parameters
    const transactionParams = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`, // Unique order ID
        gross_amount: totalAmount,
      },
      item_details: cart.items.map((item) => ({
        id: item.productId,
        price: item.product.price,
        quantity: item.quantity,
        name: item.product.name,
      })),
      customer_details: {
        first_name: session.user.name || "Guest",
        email: session.user.email || undefined,
        // phone: session.user.phone || "081234567890", // Default phone if not available
      },
    };

    // Create transaction with Midtrans
    const midtransResponse = await snap.createTransaction(transactionParams);

    // Begin a transaction to create history, update stock, and clear cart
    const history = await prisma.$transaction(async (tx) => {
      // Create a new history record
      const historyEntry = await prisma.history.create({
        data: {
          userId: session.user.id,
          totalAmount,
          midtransTransactionId: midtransResponse.token, // Kolom baru
          midtransPaymentStatus: "pending", // Kolom baru
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
      });      

      // Update stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Delete all cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Delete the cart itself
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return historyEntry;
    });

    return NextResponse.json({
      success: true,
      message: "Transaction created successfully.",
      redirectUrl: midtransResponse.redirect_url,
      historyId: history.id,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
