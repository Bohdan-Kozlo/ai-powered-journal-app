import { EntryCard } from "@/components/journal/entry-card";
import { NewEntryCard } from "@/components/journal/new-entry-card";
import { Container } from "@/components/ui/container";
import { getJournalEntries } from "@/data/journal-entry";
import Link from "next/link";

interface JournalEntry {
  id: string;
  createdAt: string | Date;
  content: string;
  journalAnalysis: {
    summary?: string;
    mood?: string;
  } | null;
}

export default async function JournalPage() {
  const entries = ((await getJournalEntries()) || []) as JournalEntry[];

  return (
    <main className="flex-1">
      <Container>
        <div className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Journal</h1>
            <p className="text-muted-foreground">{entries.length} entries</p>
          </div>

          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground mb-8">
              No journal entries found. Start by creating a new entry!
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/journal/new">
              <NewEntryCard />
            </Link>

            {entries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <EntryCard
                  id={entry.id}
                  date={new Date(entry.createdAt)}
                  summary={
                    entry.journalAnalysis?.summary ||
                    entry.content?.slice(0, 50) ||
                    "No summary"
                  }
                  mood={
                    (entry.journalAnalysis?.mood?.toLowerCase() as
                      | "positive"
                      | "negative"
                      | "neutral") || "neutral"
                  }
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
