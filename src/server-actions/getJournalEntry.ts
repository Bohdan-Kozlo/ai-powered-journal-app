"use server";

import { journalEntryById } from "@/data/journal-entry";
import { ActionResponse } from "@/lib/types";

export async function getJournalEntry(
  entryId: string
): Promise<ActionResponse> {
  try {
    const entry = await journalEntryById(entryId);

    if (!entry) {
      return {
        success: false,
        message: "Journal entry not found",
        error: "Entry not found or access denied",
      };
    }

    return {
      success: true,
      message: "Journal entry retrieved successfully",
      data: entry,
    };
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return {
      success: false,
      message: "Failed to fetch journal entry",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
