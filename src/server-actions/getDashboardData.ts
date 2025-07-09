"use server";

import { getJournalEntries } from "@/data/journal-entry";
import { ActionResponse } from "@/lib/types";

export async function getDashboardData(
  limit: number = 5
): Promise<ActionResponse> {
  try {
    const entries = await getJournalEntries();

    if (!entries) {
      return {
        success: false,
        message: "User not authenticated",
        error: "Authentication required",
      };
    }

    const recentEntries = entries.slice(0, limit);

    const entriesWithAnalysis = entries.filter(
      (entry) => entry.journalAnalysis
    );

    return {
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        recentEntries,
        totalEntries: entries.length,
        analyzedEntries: entriesWithAnalysis.length,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
