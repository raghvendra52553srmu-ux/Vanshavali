import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const trees = await prisma.tree.findMany({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(trees);
  } catch (error) {
    console.error("Error fetching trees:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { familyName, motto, origin, established, isPublic } = body;

    if (!familyName) {
      return NextResponse.json(
        { message: "Family name is required" },
        { status: 400 }
      );
    }

    const tree = await prisma.tree.create({
      data: {
        familyName,
        motto,
        origin,
        established,
        isPublic: !!isPublic,
        ownerId: user.id,
      },
    });

    return NextResponse.json(tree, { status: 201 });
  } catch (error) {
    console.error("Error creating tree:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
