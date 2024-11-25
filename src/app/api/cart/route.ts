import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { useSession } from "next-auth/react";

const prisma = new PrismaClient();
// const session = useSession();

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();
    const session = await getServerSession(authOptions);

    // Ensure the user is logged in
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Validate input
    if (!userId || !productId || quantity == null) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product does not exist" },
        { status: 404 }
      );
    }

    // Check if the cart exists for the user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }, // Include existing items
    });

    // If no cart exists, create a new one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [], // Start with an empty cart
        },
      });
    }

    // Check if the item already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });

      return NextResponse.json({
        success: true,
        message: "Cart item quantity updated",
        data: updatedCartItem,
      });
    } else {
      // Create a new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          isChecked: true, // Default value
        },
      });

      return NextResponse.json({
        success: true,
        message: "Cart item added",
        data: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.cart) {
      return NextResponse.json([]);
    }

    const formattedCartItems = user.cart.items.map((item) => ({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      isChecked: item.isChecked,
      product: item.product,
    }));

    return NextResponse.json(formattedCartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}