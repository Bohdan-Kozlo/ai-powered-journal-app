"use server";

import { getJournalEntries } from "@/data/journal-entry";
import { ActionResponse } from "@/lib/types";
import { cache } from "react";

export const getDashboardData = cache(async function getDashboardData(
  limit: number = 3
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

    // Get the most recent entries
    const recentEntries = entries.slice(0, limit);

    // Count entries with analysis
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
});
