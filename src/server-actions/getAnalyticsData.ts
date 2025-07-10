"use server";

import { getJournalEntries } from "@/data/journal-entry";
import { ActionResponse } from "@/lib/types";
import { cache } from "react";

export const getAnalyticsData = cache(
  async function getAnalyticsData(): Promise<ActionResponse> {
    try {
      const entries = await getJournalEntries();

      if (!entries) {
        return {
          success: false,
          message: "User not authenticated",
          error: "Authentication required",
        };
      }

      const analyzedEntries = entries.filter((entry) => entry.journalAnalysis);

      if (analyzedEntries.length === 0) {
        return {
          success: true,
          message: "No analyzed entries found",
          data: {
            moodTrend: [],
            emotionDistribution: [],
            averageMoodScore: 0,
            totalEntries: entries.length,
            analyzedEntries: 0,
          },
        };
      }

      const moodTrend = analyzedEntries
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .slice(-30)
        .map((entry) => ({
          date: new Date(entry.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          moodScore: entry.journalAnalysis!.moodScore,
          mood: entry.journalAnalysis!.mood,
          positive: entry.journalAnalysis!.positivePercentage,
          neutral: entry.journalAnalysis!.neutralPercentage,
          negative: entry.journalAnalysis!.negativePercentage,
        }));

      const emotionCounts = analyzedEntries.reduce((acc, entry) => {
        const mood = entry.journalAnalysis!.mood;
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const emotionDistribution = Object.entries(emotionCounts).map(
        ([mood, count]) => ({
          mood,
          count,
          percentage: Math.round((count / analyzedEntries.length) * 100),
        })
      );

      const totalMoodScore = analyzedEntries.reduce(
        (sum, entry) => sum + entry.journalAnalysis!.moodScore,
        0
      );
      const averageMoodScore = Math.round(
        totalMoodScore / analyzedEntries.length
      );

      const sentimentCounts = analyzedEntries.reduce(
        (acc, entry) => {
          const analysis = entry.journalAnalysis!;
          const maxPercentage = Math.max(
            analysis.positivePercentage,
            analysis.neutralPercentage,
            analysis.negativePercentage
          );

          if (maxPercentage === analysis.positivePercentage) {
            acc.positive += 1;
          } else if (maxPercentage === analysis.neutralPercentage) {
            acc.neutral += 1;
          } else {
            acc.negative += 1;
          }

          return acc;
        },
        { positive: 0, neutral: 0, negative: 0 }
      );

      const sentimentDistribution = [
        {
          sentiment: "Positive",
          count: sentimentCounts.positive,
          fill: "hsl(var(--chart-1))",
        },
        {
          sentiment: "Neutral",
          count: sentimentCounts.neutral,
          fill: "hsl(var(--chart-2))",
        },
        {
          sentiment: "Negative",
          count: sentimentCounts.negative,
          fill: "hsl(var(--chart-3))",
        },
      ];

      return {
        success: true,
        message: "Analytics data retrieved successfully",
        data: {
          moodTrend,
          emotionDistribution,
          sentimentDistribution,
          averageMoodScore,
          totalEntries: entries.length,
          analyzedEntries: analyzedEntries.length,
        },
      };
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return {
        success: false,
        message: "Failed to fetch analytics data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);
