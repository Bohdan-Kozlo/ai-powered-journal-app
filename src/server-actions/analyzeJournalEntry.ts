"use server";

import { createJournalAnalysis } from "@/data/journal-entry";
import { analyzeJournalEntry } from "@/lib/llm";
import { ActionResponse } from "@/lib/types";

export async function analyzeJournalEntryAction(
  entryId: string,
  content: string
): Promise<ActionResponse> {
  try {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        message: "Cannot analyze empty content",
        error: "Content is empty",
      };
    }

    const analysisResult = await analyzeJournalEntry(content);

    const analysis = await createJournalAnalysis(entryId, analysisResult);

    if (!analysis) {
      return {
        success: false,
        message: "Failed to save analysis",
        error: "Database error",
      };
    }

    return {
      success: true,
      message: "Analysis completed successfully",
      data: {
        id: analysis.id,
        summary: analysis.summary,
        mood: analysis.mood,
        negative: analysis.negative,
        entryId: analysis.entryId,
        createdAt: analysis.createdAt,
        moodScore: analysis.moodScore,
        positivePercentage: analysis.positivePercentage,
        neutralPercentage: analysis.neutralPercentage,
        negativePercentage: analysis.negativePercentage,
      },
    };
  } catch (error) {
    console.error("Error analyzing journal entry:", error);
    return {
      success: false,
      message: "Failed to analyze journal entry",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
