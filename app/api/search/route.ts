import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const treeId = searchParams.get("treeId");
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
       return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const whereClause: any = {
      tree: {
        ownerId: user.id
      }
    };

    if (treeId) {
      whereClause.treeId = treeId;
    }

    if (query) {
      whereClause.OR = [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } },
        { occupation: { contains: query } }
      ];
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        tree: {
          select: { familyName: true }
        }
      },
      take: 20
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
