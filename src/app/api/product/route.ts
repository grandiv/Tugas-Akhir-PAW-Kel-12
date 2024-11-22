import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const category = url.searchParams.get("category"); 

    //get product by category
    if (category) {
      const products = await prisma.product.findMany({
        where: { category },
      });

      return NextResponse.json(products, { status: 200 });
    }

    // get all product
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
