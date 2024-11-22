import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update user with default profile picture
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profilePicture: "/user.png",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Profile picture delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove profile picture" },
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        nama: true,
        email: true,
        nohandphone: true,
        alamat: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { nama, email, nohandphone, alamat, profilePicture } = data;

    // Validate email format
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nama,
        email,
        nohandphone,
        alamat,
        profilePicture,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        nama: updatedUser.nama,
        email: updatedUser.email,
        nohandphone: updatedUser.nohandphone,
        alamat: updatedUser.alamat,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
