import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db"; // Prisma client
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the cart for the user
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty." },
        { status: 400 }
      );
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for product: ${item.product.name}.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate the total amount for the history entry
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Begin a transaction
    const history = await prisma.$transaction(async (tx) => {
      // Create a new history entry
      const historyEntry = await tx.history.create({
        data: {
          userId: session.user.id,
          totalAmount,
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

      // Reduce product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Delete all items in the cart
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
      message: "Checkout successful.",
      historyId: history.id,
    });
  } catch (error) {
    console.error("Error during checkout:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
