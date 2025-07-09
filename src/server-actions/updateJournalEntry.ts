"use server";

import { prisma } from "@/lib/prisma";
import { getUserByClerkId } from "@/lib/auth";
import { ActionResponse } from "@/lib/types";

export async function updateJournalEntry(
  entryId: string,
  content: string
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

    const updatedEntry = await prisma.journalEntry.update({
      where: {
        id: entryId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Journal entry updated successfully",
      data: updatedEntry,
    };
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return {
      success: false,
      message: "Failed to update journal entry",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
