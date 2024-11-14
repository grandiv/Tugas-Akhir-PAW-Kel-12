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
      const newOrder = await tx.history.create({
        data: {
          userId: session.user.id,
          totalAmount,
          status: "PENDING",
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
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.history.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
