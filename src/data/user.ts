import { prisma } from "@/lib/prisma";
import { UserCreateInput, UserUpdateInput } from "@/lib/types";

export async function createUser(user: UserCreateInput) {
  try {
    return await prisma.user.create({
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function updateUser(clerkId: string, data: UserUpdateInput) {
  try {
    return await prisma.user.update({
      where: { clerkId },
      data,
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    return await prisma.user.delete({
      where: { clerkId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
