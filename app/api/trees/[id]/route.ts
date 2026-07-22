import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const tree = await prisma.tree.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            relationshipsAsMember1: true,
            relationshipsAsMember2: true
          }
        },
        owner: {
          select: { name: true, email: true },
        },
      },
    });

    if (!tree) {
      return NextResponse.json({ message: "Tree not found" }, { status: 404 });
    }

    if (!tree.isPublic) {
      if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (tree.ownerId !== user?.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    const mappedMembers = tree.members.map((m: any) => {
      const parentIds: string[] = [];
      const childrenIds: string[] = [];
      let spouseId: string | undefined = undefined;

      const rels = [...m.relationshipsAsMember1, ...m.relationshipsAsMember2];
      
      rels.forEach(r => {
        if (r.type === "PARENT") {
          // If this member is member1, they are the parent of member2
          if (r.member1Id === m.id) {
            childrenIds.push(r.member2Id);
          } else {
            parentIds.push(r.member1Id);
          }
        } else if (r.type === "SPOUSE") {
          spouseId = r.member1Id === m.id ? r.member2Id : r.member1Id;
        }
      });

      // Remove the raw relationship arrays to clean up the payload
      const { relationshipsAsMember1, relationshipsAsMember2, ...rest } = m;
      
      return {
        ...rest,
        parentIds,
        childrenIds,
        spouseId
      };
    });

    const responseTree = {
      ...tree,
      members: mappedMembers
    };

    return NextResponse.json(responseTree);
  } catch (error) {
    console.error("Error fetching tree:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const tree = await prisma.tree.findUnique({
      where: { id },
    });

    if (!tree) {
      return NextResponse.json({ message: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const updatedTree = await prisma.tree.update({
      where: { id },
      data: {
        familyName: body.familyName,
        motto: body.motto,
        origin: body.origin,
        established: body.established,
        isPublic: body.isPublic,
      },
    });

    return NextResponse.json(updatedTree);
  } catch (error) {
    console.error("Error updating tree:", error);
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
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const tree = await prisma.tree.findUnique({
      where: { id },
    });

    if (!tree) {
      return NextResponse.json({ message: "Tree not found" }, { status: 404 });
    }

    if (tree.ownerId !== user?.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.tree.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tree deleted successfully" });
  } catch (error) {
    console.error("Error deleting tree:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
