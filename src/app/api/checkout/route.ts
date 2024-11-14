import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items, totalAmount } = await request.json();

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          items: {
            create: items.map(
              (item: {
                productId: string;
                name: string;
                price: number;
                quantity: number;
              }) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })
            ),
          },
        },
        include: {
          items: true,
        },
      });

      // Clear cart
      await tx.cart.update({
        where: { userId: session.user.id },
        data: {
          items: {
            deleteMany: {},
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
