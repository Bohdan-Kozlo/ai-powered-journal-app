import { Container } from "@/components/ui/container";
import { JournalEntryClient } from "@/components/journal/journal-entry-client";
import { ReturnToJournalButton } from "@/components/journal/return-to-journal-button";
import { getJournalEntry } from "@/server-actions/getJournalEntry";
import { JournalAnalysisData } from "@/components/journal/journal-analysis";

interface JournalEntry {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  journalAnalysis?: JournalAnalysisData | null;
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const entryId = (await params).id;
  const result = await getJournalEntry(entryId);

  if (!result.success || !result.data) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Entry Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {result.message ||
              "The journal entry you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <ReturnToJournalButton />
        </div>
      </Container>
    );
  }

  const entry = result.data as unknown as JournalEntry;

  return (
    <Container className="py-8">
      <JournalEntryClient initialEntry={entry} entryId={entryId} />
    </Container>
  );
}
