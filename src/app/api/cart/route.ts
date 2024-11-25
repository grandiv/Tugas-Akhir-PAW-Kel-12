import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db"; // Assumes prisma is exported from a shared db utility
import { authOptions } from "../auth/[...nextauth]/route";
export async function POST(request: Request) {
  try {
    // Validate user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log(session?.user?.id);

    // Parse request body
    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid input. Ensure productId and quantity are provided and valid.",
        },
        { status: 400 }
      );
    }

    // Try to find the user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session?.user?.id },
    });

    // If cart doesn't exist, create a new cart
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session?.user?.id, // Associate cart with the user
        },
      });
    }

    console.log(cart);

    // Find the product by productId
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    console.log(product);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    console.log("existingCartItem", existingCartItem);

    if (existingCartItem) {
      console.log("existingCartItem");
      // Update the existing cart item
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity, // Add quantity to the existing amount
          isChecked: true, // Assuming the item is checked by default
        },
      });
      console.log("updatedCartItem", existingCartItem);

      return NextResponse.json({ success: true, cartItem: updatedCartItem });
    }
    console.log(cart.id, session.user.id, product.id, quantity);

    // If the product doesn't exist in the cart, create a new cart item
    const newCartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id.toString(), // Ensure this is a valid ObjectId string
        productId: product.id.toString(), // Ensure this is a valid ObjectId string
        quantity: quantity, // Ensure quantity is an integer
        isChecked: true, // Defaults to true, but you can set if needed
      },
    });

    console.log("newCartItem", newCartItem);

    return NextResponse.json(
      { success: true, cartItem: newCartItem },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" + error.message },
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
    console.log(session?.user?.id);
    const userId = session?.user?.id;

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No cart items found for this user" },
        { status: 404 }
      );
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
