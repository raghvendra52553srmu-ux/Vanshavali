import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const body = await req.json();
    const { treeId, members } = body;

    if (!treeId || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { message: "Missing required fields or invalid members array" },
        { status: 400 }
      );
    }

    // Verify tree ownership
    const tree = await prisma.tree.findUnique({ where: { id: treeId } });
    if (!tree || tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden or not found" }, { status: 403 });
    }

    // Create the members in a transaction
    const createdMembers = await prisma.$transaction(
      members.map((m: any) => 
        prisma.member.create({
          data: {
            treeId,
            firstName: m.firstName || "Unknown",
            lastName: m.lastName || "",
            gender: m.gender || "unknown",
            dateOfBirth: m.dateOfBirth || "Unknown",
            dateOfDeath: m.dateOfDeath,
            isAlive: String(m.isAlive).toLowerCase() === "false" ? false : true,
            generation: m.generation ? parseInt(m.generation, 10) : 0,
            occupation: m.occupation,
            city: m.city,
            state: m.state,
            country: m.country,
            bio: m.bio,
            email: m.email,
            phone: m.phone
          }
        })
      )
    );

    return NextResponse.json({ success: true, count: createdMembers.length }, { status: 201 });
  } catch (error) {
    console.error("Error bulk creating members:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
