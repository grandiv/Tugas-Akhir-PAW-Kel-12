import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/history/:path*",
    "/api/profile/:path*",
    "/api/cart/:path*",
    "/api/checkout/:path*",
    "/api/orders/:path*",
  ],
};
