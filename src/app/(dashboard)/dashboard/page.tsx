import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/server-actions/getDashboardData";
import { DashboardAISection } from "@/components/DashboardAISection";

interface DashboardEntry {
  id: string;
  createdAt: string | Date;
  content: string;
  journalAnalysis?: {
    summary?: string;
    mood?: string;
  } | null;
}

interface DashboardData {
  recentEntries: DashboardEntry[];
  totalEntries: number;
  analyzedEntries: number;
}

export default async function DashboardPage() {
  const result = await getDashboardData(5);
  const dashboardData = result.success
    ? (result.data as unknown as DashboardData)
    : null;

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!result.success) {
    return (
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{result.message}</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main left content */}
        <div className="flex-1 space-y-8">
          {/* Greeting Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back!</h1>
              <div className="text-muted-foreground text-sm">
                {formattedDate} &middot; {formattedTime}
              </div>
              {dashboardData && (
                <div className="text-muted-foreground text-sm mt-1">
                  {dashboardData.totalEntries} entries &middot;{" "}
                  {dashboardData.analyzedEntries} analyzed
                </div>
              )}
            </div>
          </div>

          {/* AI Section - Client Component */}
          <DashboardAISection
            analyzedEntries={dashboardData?.analyzedEntries || 0}
          />
        </div>

        {/* Right sidebar: Recent Journal Entries */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card>
            <CardHeader>
              <h3 className="text-base font-medium">Recent Journal Entries</h3>
            </CardHeader>
            <CardContent>
              {dashboardData?.recentEntries &&
              dashboardData.recentEntries.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentEntries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/journal/${entry.id}`}
                      className="block p-3 rounded-md border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        {entry.journalAnalysis?.mood && (
                          <span className="text-xs text-muted-foreground">
                            {entry.journalAnalysis.mood}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {entry.journalAnalysis?.summary ||
                          entry.content.slice(0, 80) +
                            (entry.content.length > 80 ? "..." : "")}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No journal entries yet.</p>
                  <Link
                    href="/journal/new"
                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                  >
                    Write your first entry
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
