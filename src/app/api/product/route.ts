import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    // Get products by category
    if (category) {
      const products = await prisma.product.findMany({
        where: { category },
      });

      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        desc: product.description || "No description available",
        imageUrl: product.image || "/default-image.png",
        stock: product.stock || 0,
        netto: product.netto,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));

      return NextResponse.json(formattedProducts);
    }

    // Get all products
    const products = await prisma.product.findMany();

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      desc: product.description || "No description available",
      imageUrl: product.image || "/default-image.png",
      stock: product.stock || 0,
      netto: product.netto,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// create product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, category, image, netto, stock } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { error: "Price and stock must be positive values" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description: description || "No description available",
        category,
        image: image || "/default-image.png",
        netto: netto || "0",
        stock: stock || 0,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// update product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, desc, category, imageUrl, netto, stock } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updateData = {
      ...(name && { name }),
      ...(price !== undefined && { price }),
      ...(desc !== undefined && { description: desc }),
      ...(category && { category }),
      ...(imageUrl && { image: imageUrl }),
      ...(netto && { netto }),
      ...(stock !== undefined && { stock }),
    };

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
