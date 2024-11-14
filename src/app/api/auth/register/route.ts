// route.ts
import { NextResponse } from "next/server";
import { register } from "@/services/auth";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Request data:", data);

    const { user } = await register(data);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nama: user.nama,
          nohandphone: user.nohandphone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      {
        status:
          errorMessage.includes("required") ||
          errorMessage.includes("match") ||
          errorMessage.includes("already")
            ? 400
            : 500,
      }
    );
  }
}
