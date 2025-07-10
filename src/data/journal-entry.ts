import { getUserByClerkId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { JournalAnalysisResult } from "@/lib/llm";
import { cache } from "react";

export const getJournalEntries = cache(async function getJournalEntries() {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return null;
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      include: {
        journalAnalysis: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return entries;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return null;
  }
});

export async function createJournalEntry(
  data: Omit<
    Prisma.JournalEntryCreateInput,
    "user" | "journalAnalysis" | "userId"
  > & { content: string }
) {
  const user = await getUserByClerkId();
  if (!user) {
    return null;
  }

  try {
    const newEntry = await prisma.journalEntry.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return newEntry;
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return null;
  }
}

export const journalEntryById = cache(async function journalEntryById(
  entryId: string
) {
  const user = await getUserByClerkId();
  if (!user) {
    return null;
  }

  try {
    const entry = await prisma.journalEntry.findUnique({
      where: {
        id: entryId,
        userId: user.id,
      },
      include: {
        journalAnalysis: true,
      },
    });

    return entry;
  } catch (error) {
    console.error("Error fetching journal entry by ID:", error);
    return null;
  }
});

export async function createJournalAnalysis(
  entryId: string,
  analysisData: JournalAnalysisResult
) {
  try {
    const existing = await prisma.journalAnalysis.findUnique({
      where: { entryId },
    });

    if (existing) {
      const updated = await prisma.journalAnalysis.update({
        where: { entryId },
        data: {
          summary: analysisData.summary,
          mood: analysisData.mood,
          negative: analysisData.negative,
          moodScore: analysisData.moodScore,
          positivePercentage: analysisData.positivePercentage,
          neutralPercentage: analysisData.neutralPercentage,
          negativePercentage: analysisData.negativePercentage,
        },
      });
      return updated;
    }

    const analysis = await prisma.journalAnalysis.create({
      data: {
        entryId,
        summary: analysisData.summary,
        mood: analysisData.mood,
        negative: analysisData.negative,
        moodScore: analysisData.moodScore,
        positivePercentage: analysisData.positivePercentage,
        neutralPercentage: analysisData.neutralPercentage,
        negativePercentage: analysisData.negativePercentage,
      },
    });

    return analysis;
  } catch (error) {
    console.error("Error creating journal analysis:", error);
    return null;
  }
}
