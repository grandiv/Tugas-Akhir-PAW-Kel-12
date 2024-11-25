import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db"; // Assumes prisma is exported from a shared db utility
import { authOptions } from "../auth/[...nextauth]/route";

// src/app/api/cart/route.ts
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: {
            create: [
              {
                productId,
                quantity,
                isChecked: true,
              },
            ],
          },
        },
        include: { items: true },
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            isChecked: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/cart:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
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

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Return empty cart instead of 404
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        success: true,
        cartItems: [],
        grandTotal: 0,
        shippingCost: 15000,
        totalPrice: 0,
      });
    }

    // Format the response
    const formattedCartItems = cart.items.map((item) => ({
      id: item?.id ?? "",
      productId: item?.productId ?? "",
      productName: item.product?.name || "Unknown Product",
      productPrice: item.product?.price || 0,
      imageUrl: item.product?.image || "",
      quantity: item?.quantity ?? "",
      totalPrice: item?.quantity * (item.product?.price || 0),
      isChecked: item?.isChecked ?? false,
    }));

    const grandTotal = cart.items.reduce((total, item) => {
      return total + item?.quantity * (item.product?.price || 0);
    }, 0); // Initial value is 0

    return NextResponse.json({
      success: true,
      grandTotal: grandTotal,
      shippingCost: 15000,
      totalPrice: grandTotal + 15000,
      cartItems: formattedCartItems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart items" + error.message },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    // Validate user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse and validate the request body
    const { items } = await request.json();
    const { cartItems } = items;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input. Provide a list of cart items to update.",
        },
        { status: 400 }
      );
    }

    const updatedCartItems: any[] = [];
    let grandTotal = 0;

    // Use a transaction to ensure consistency
    await prisma.$transaction(async (prisma) => {
      for (const item of cartItems) {
        const { id, quantity, isChecked } = item;

        if (!id || quantity === undefined || quantity < 0) {
          throw new Error(
            `Invalid cart item: ${JSON.stringify(
              item
            )}. Ensure "id" and "quantity" are provided and valid.`
          );
        }

        if (quantity === 0) {
          // If quantity is zero, remove the item
          await prisma.cartItem.delete({ where: { id } });
        } else {
          // Update the cart item
          const updatedItem = await prisma.cartItem.update({
            where: { id },
            data: {
              quantity,
              isChecked: isChecked ?? true,
            },
            include: {
              product: { select: { price: true } },
            },
          });

          // Recalculate grand total on the fly
          grandTotal +=
            updatedItem.quantity * (updatedItem.product?.price ?? 0);
          updatedCartItems.push(updatedItem);
        }
      }
    });

    // Calculate the total price with a fixed shipping cost
    const shippingCost = 15000;
    const totalPrice = grandTotal + shippingCost;

    return NextResponse.json({
      success: true,
      updatedCartItems,
      grandTotal,
      shippingCost,
      totalPrice,
    });
  } catch (error: any) {
    console.error("Error updating cart items:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the user's cart exists
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found." },
        { status: 404 }
      );
    }

    // Delete all items in the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}