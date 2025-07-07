import { EntryCard } from "@/components/journal/entry-card";
import { NewEntryCard } from "@/components/journal/new-entry-card";
import { Container } from "@/components/ui/container";

// Mock data for entries
const mockEntries = [
  {
    id: "1",
    date: new Date(2025, 6, 7), // July 7, 2025
    summary:
      "Today was productive. I completed my project ahead of schedule and received positive feedback from my team.",
    mood: "positive",
  },
  {
    id: "2",
    date: new Date(2025, 6, 6), // July 6, 2025
    summary:
      "Feeling stressed about upcoming deadlines. Need to better manage my time and prioritize tasks.",
    mood: "negative",
  },
  {
    id: "3",
    date: new Date(2025, 6, 5), // July 5, 2025
    summary:
      "Spent time with family today. It was relaxing but I'm still thinking about work projects.",
    mood: "neutral",
  },
  {
    id: "4",
    date: new Date(2025, 6, 4), // July 4, 2025
    summary:
      "Celebrated the holiday with friends. Had a great time at the barbecue and enjoyed the fireworks display.",
    mood: "positive",
  },
  {
    id: "5",
    date: new Date(2025, 6, 3), // July 3, 2025
    summary:
      "Difficult day at work. Encountered several technical issues that took hours to resolve.",
    mood: "negative",
  },
];

export default function JournalPage() {
  return (
    <main className="flex-1">
      <Container>
        <div className="py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Journal</h1>
            <p className="text-muted-foreground">
              {mockEntries.length} entries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewEntryCard />

            {mockEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                id={entry.id}
                date={entry.date}
                summary={entry.summary}
                mood={entry.mood as "positive" | "negative" | "neutral"}
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
