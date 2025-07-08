"use server";

import { ActionResponse } from "@/lib/types";
import { createJournalEntry } from "@/data/journal-entry";

export async function handleCreateJournalEntry(data: {
  content: string;
}): Promise<ActionResponse> {
  try {
    const newEntry = await createJournalEntry({ content: data.content });
    if (!newEntry) {
      return {
        success: false,
        message: "Failed to create journal entry",
        error: "No entry created",
      };
    }
    return {
      success: true,
      message: "Journal entry created successfully",
      data: { entryId: newEntry.id },
    };
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return {
      success: false,
      message: "Failed to create journal entry or user not authenticated",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
