import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db"; // Prisma client
import { authOptions } from "../../auth/[...nextauth]/route"; // Auth options

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required." },
        { status: 400 }
      );
    }

    // Check if the cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Item not found or unauthorized." },
        { status: 404 }
      );
    }

    // Delete the specific cart item
    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Item deleted successfully." });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
