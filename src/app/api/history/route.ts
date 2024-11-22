import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const formattedHistories = histories.map((history) => ({
      id: history.id,
      date: history.createdAt.toISOString().split("T")[0],
      state: history.status,
      items: history.items.map((item) => ({
        imageUrl: item.product?.image || "/default-image.png",
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }));

    return NextResponse.json(formattedHistories);
  } catch (error) {
    console.error("Error fetching histories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
