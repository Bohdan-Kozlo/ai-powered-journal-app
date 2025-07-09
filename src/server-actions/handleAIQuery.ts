"use server";

import { getJournalEntries } from "@/data/journal-entry";
import { handleJournalQuery } from "@/lib/llm";
import { ActionResponse } from "@/lib/types";

export async function handleAIQuery(query: string): Promise<ActionResponse> {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: "Query cannot be empty",
        error: "Empty query",
      };
    }

    const entries = await getJournalEntries();

    if (!entries) {
      return {
        success: false,
        message: "User not authenticated",
        error: "Authentication required",
      };
    }

    const response = await handleJournalQuery(query, entries);

    return {
      success: true,
      message: "AI response generated successfully",
      data: {
        response,
      },
    };
  } catch (error) {
    console.error("Error handling AI query:", error);
    return {
      success: false,
      message: "Failed to process AI query",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
