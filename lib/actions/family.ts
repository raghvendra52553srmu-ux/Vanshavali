"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { familySchema } from "@/lib/validations/family";
import { revalidatePath } from "next/cache";

export async function createFamily(data: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = familySchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid data");
  }

  const family = await prisma.tree.create({
    data: {
      ...result.data,
      ownerId: session.user.id,
      collaborators: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        }
      }
    },
  });

  revalidatePath("/dashboard");
  return family;
}

export async function getMyFamilies() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return prisma.tree.findMany({
    where: {
      collaborators: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}
