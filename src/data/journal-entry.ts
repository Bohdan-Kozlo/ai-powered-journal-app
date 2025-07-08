import { getUserByClerkId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getJournalEntries() {
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
}

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

export async function journalEntryById(entryId: string) {
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
}
