import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";
import { cache } from "react";

export const getUserByClerkId = cache(
  async function getUserByClerkId(options?: {
    include?: Prisma.UserInclude;
    select?: Prisma.UserSelect;
  }) {
    const { userId } = await auth();

    if (!userId) return null;

    return await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId,
      },
      ...options,
    });
  }
);
