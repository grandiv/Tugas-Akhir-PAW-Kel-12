import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get session data
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please login to access this resource." },
        { status: 401 }
      );
    }

    // Query user-specific histories
    const histories = await prisma.history.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!histories || histories.length === 0) {
      return NextResponse.json(
        { message: "No histories found for the user." },
        { status: 404 }
      );
    }

    // Format and validate data
    const formattedHistories = histories.map((history) => ({
      id: history.id || "Unknown ID",
      date: history.createdAt
        ? history.createdAt.toISOString().split("T")[0]
        : "Unknown Date",
      state: history.status || "Unknown Status",
      items: history.items.map((item) => {
        // Fallback for product data
        if (!item.product) {
          console.warn(
            `Missing product data for itemId: ${item.id}, productId: ${item.productId}`
          );
        }
        return {
          imageUrl: item.product?.image || "/default-image.png",
          name: item.product?.name || "Unknown Product",
          price: item.product?.price || 0,
          quantity: item.quantity || 0,
        };
      }),
    }));

    return NextResponse.json(formattedHistories);
  } catch (error) {
    console.error("Error fetching histories:", error);

    // Prisma-specific error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
