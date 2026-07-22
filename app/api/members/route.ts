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
    const { 
      treeId, 
      firstName, 
      lastName, 
      gender, 
      dateOfBirth, 
      dateOfDeath, 
      isAlive,
      generation,
      occupation,
      city,
      state,
      country,
      bio,
      email,
      phone,
      parentIds, // array of strings
      spouseId, // string
      childrenIds // array of strings
    } = body;

    if (!treeId || !firstName || !lastName || !gender || !dateOfBirth) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify tree ownership
    const tree = await prisma.tree.findUnique({ where: { id: treeId } });
    if (!tree || tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden or not found" }, { status: 403 });
    }

    // Create the member
    const newMember = await prisma.member.create({
      data: {
        treeId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        dateOfDeath,
        isAlive: isAlive ?? true,
        generation: generation || 0,
        occupation,
        city,
        state,
        country,
        bio,
        email,
        phone
      },
    });

    // Create relationships if provided
    if (parentIds && Array.isArray(parentIds)) {
      for (const pId of parentIds) {
        await prisma.relationship.create({
          data: {
            member1Id: pId,
            member2Id: newMember.id,
            type: "PARENT" // member1 is PARENT of member2
          }
        });
      }
    }

    if (spouseId) {
      await prisma.relationship.create({
        data: {
          member1Id: newMember.id,
          member2Id: spouseId,
          type: "SPOUSE"
        }
      });
      // Spouses are mutual, but one record with SPOUSE type is enough to represent it,
      // as long as our frontend treats it symmetrically.
    }

    if (childrenIds && Array.isArray(childrenIds)) {
      for (const cId of childrenIds) {
        await prisma.relationship.create({
          data: {
            member1Id: newMember.id,
            member2Id: cId,
            type: "PARENT" // newMember is PARENT of cId
          }
        });
      }
    }

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
