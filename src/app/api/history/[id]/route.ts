import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient, Prisma } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";


const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: historyId } = params;

    // Find the history entry
    const history = await prisma.history.findUnique({
      where: { id: historyId },
      include: {
        items: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });

    if (!history) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    if (history.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to cancel this order." },
        { status: 403 }
      );
    }

    if (history.status === "DIBATALKAN") {
      return NextResponse.json(
        { success: false, error: "Order has already been canceled." },
        { status: 400 }
      );
    }

    // Begin transaction to cancel order and restore stock
    await prisma.$transaction(async (tx) => {
      // Restore stock for each product in the order
      for (const item of history.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Update history status to DIBATALKAN
      await tx.history.update({
        where: { id: historyId },
        data: { status: "DIBATALKAN" },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Order canceled and stock restored successfully.",
    });
  } catch (error : any) {
    console.error("Error canceling order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "History ID not provided." },
        { status: 400 }
      );
    }

    // Query untuk mendapatkan satu history berdasarkan ID, termasuk detail user dan items
    const history = await prisma.history.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true, // Detail produk pada setiap item
          },
        },
        user: true, // Detail user terkait history ini
      },
    });

    if (!history) {
      return NextResponse.json(
        { message: "History not found." },
        { status: 404 }
      );
    }

    // Format data untuk dikirimkan ke klien
    const formattedHistory = {
      id: history.id,
      date: history.createdAt.toISOString().split("T")[0],
      status: history.status,
      totalAmount: history.totalAmount,
      user: {
        id: history.user?.id || "Unknown User ID",
        name: history.user?.nama || "Unknown User Name",
        email: history.user?.email || "Unknown Email",
        profilePicture:
          history.user?.profilePicture || "/default-profile.png",
      },
      items: history.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product?.id || "Unknown Product ID",
          name: item.product?.name || "Unknown Product Name",
          image: item.product?.image || "/default-image.png",
          price: item.product?.price || 0,
          stock: item.product?.stock || 0,
        },
      })),
    };

    return NextResponse.json(formattedHistory, { status: 200 });
  } catch (error) {
    console.error("Error fetching history:", error);

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}