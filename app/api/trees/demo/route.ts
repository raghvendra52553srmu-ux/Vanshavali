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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1. Create the Demo Tree
    const tree = await prisma.tree.create({
      data: {
        familyName: "The Sterling Family (Demo)",
        motto: "Per aspera ad astra",
        origin: "London, UK",
        established: "1850",
        isPublic: false,
        ownerId: user.id,
      },
    });

    // 2. Create Members
    const patriarch = await prisma.member.create({
      data: {
        treeId: tree.id,
        firstName: "Arthur",
        lastName: "Sterling",
        gender: "Male",
        dateOfBirth: "1850-05-12",
        dateOfDeath: "1922-11-04",
        isAlive: false,
        generation: 1,
        occupation: "Watchmaker",
        city: "London",
        country: "UK",
        bio: "Founder of the Sterling clock legacy.",
      },
    });

    const matriarch = await prisma.member.create({
      data: {
        treeId: tree.id,
        firstName: "Eleanor",
        lastName: "Sterling",
        gender: "Female",
        dateOfBirth: "1855-08-22",
        dateOfDeath: "1930-01-15",
        isAlive: false,
        generation: 1,
        occupation: "Botanist",
        city: "London",
        country: "UK",
        bio: "Renowned for her work in the royal gardens.",
      },
    });

    const son = await prisma.member.create({
      data: {
        treeId: tree.id,
        firstName: "William",
        lastName: "Sterling",
        gender: "Male",
        dateOfBirth: "1880-03-15",
        dateOfDeath: "1955-09-20",
        isAlive: false,
        generation: 2,
        occupation: "Architect",
        city: "London",
        country: "UK",
        bio: "Designed several iconic buildings in the city.",
      },
    });

    const daughter = await prisma.member.create({
      data: {
        treeId: tree.id,
        firstName: "Victoria",
        lastName: "Sterling",
        gender: "Female",
        dateOfBirth: "1885-11-30",
        dateOfDeath: "1968-04-12",
        isAlive: false,
        generation: 2,
        occupation: "Author",
        city: "Paris",
        country: "France",
        bio: "Published acclaimed historical fiction novels.",
      },
    });

    // 3. Create Relationships
    // Spouse
    await prisma.relationship.create({
      data: {
        type: "SPOUSE",
        member1Id: patriarch.id,
        member2Id: matriarch.id,
      },
    });

    // Children of Arthur & Eleanor
    const childrenIds = [son.id, daughter.id];
    for (const childId of childrenIds) {
      await prisma.relationship.create({
        data: { type: "PARENT", member1Id: patriarch.id, member2Id: childId },
      });
      await prisma.relationship.create({
        data: { type: "PARENT", member1Id: matriarch.id, member2Id: childId },
      });
    }

    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error creating demo tree:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
