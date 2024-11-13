import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    return NextResponse.json({
      success: true,
      items: cart?.items || [],
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        items: {
          create: items.map(
            (item: {
              productId: string;
              quantity: number;
              isChecked?: boolean;
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              isChecked: item.isChecked ?? true,
            })
          ),
        },
      },
      update: {
        items: {
          deleteMany: {},
          create: items.map(
            (item: {
              productId: string;
              quantity: number;
              isChecked?: boolean;
            }) => ({
              productId: item.productId,
              quantity: item.quantity,
              isChecked: item.isChecked ?? true,
            })
          ),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
