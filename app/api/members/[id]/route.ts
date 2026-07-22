import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const member = await prisma.member.findUnique({
      where: { id },
      include: { tree: true }
    });

    if (!member) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    if (member.tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        dateOfDeath: body.dateOfDeath,
        isAlive: body.isAlive,
        generation: body.generation,
        occupation: body.occupation,
        city: body.city,
        state: body.state,
        country: body.country,
        bio: body.bio,
        email: body.email,
        phone: body.phone,
        achievements: body.achievements,
        hobbies: body.hobbies,
        education: body.education,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const member = await prisma.member.findUnique({
      where: { id },
      include: { tree: true }
    });

    if (!member) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 });
    }

    if (member.tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
