"use server";

import { prisma } from "@/lib/prisma";
import { getUserByClerkId } from "@/lib/auth";
import { ActionResponse } from "@/lib/types";

export async function deleteJournalEntry(
  entryId: string
): Promise<ActionResponse> {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
        error: "Authentication required",
      };
    }

    const existingEntry = await prisma.journalEntry.findUnique({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return {
        success: false,
        message: "Journal entry not found",
        error: "Entry not found or access denied",
      };
    }

    await prisma.journalEntry.delete({
      where: {
        id: entryId,
      },
    });

    return {
      success: true,
      message: "Journal entry deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return {
      success: false,
      message: "Failed to delete journal entry",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
