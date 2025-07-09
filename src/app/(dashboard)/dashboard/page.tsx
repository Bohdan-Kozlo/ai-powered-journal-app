"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getDashboardData } from "@/server-actions/getDashboardData";
import { handleAIQuery } from "@/server-actions/handleAIQuery";

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

export default function DashboardPage() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getDashboardData(3);
        if (result.success && result.data) {
          const data = result.data as unknown as DashboardData;
          setDashboardData(data);
        } else {
          setError(result.message || "Failed to load dashboard data");
          toast.error(result.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aiQuery.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsQuerying(true);
    setAiResponse(null);

    try {
      const result = await handleAIQuery(aiQuery);

      if (result.success && result.data) {
        setAiResponse(result.data.response as string);
        toast.success("AI response generated!");
      } else {
        toast.error(result.message || "Failed to process AI query");
        setAiResponse(
          "Sorry, I couldn't process your question at the moment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error processing AI query:", error);
      toast.error("Failed to process AI query");
      setAiResponse(
        "Sorry, I couldn't process your question at the moment. Please try again."
      );
    } finally {
      setIsQuerying(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!dashboardData || dashboardData.analyzedEntries === 0) {
      toast.error("No analyzed entries to generate insights from");
      return;
    }

    const insightsQuery =
      "Based on my journal entries, what patterns do you see in my mood and emotions? Give me insights about my personal growth and well-being.";

    setIsQuerying(true);
    setAiResponse(null);
    setAiQuery(insightsQuery);

    try {
      const result = await handleAIQuery(insightsQuery);

      if (result.success && result.data) {
        setAiResponse(result.data.response as string);
        toast.success("Insights generated!");
      } else {
        toast.error(result.message || "Failed to generate insights");
        setAiResponse(
          "Sorry, I couldn't generate insights at the moment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights");
      setAiResponse(
        "Sorry, I couldn't generate insights at the moment. Please try again."
      );
    } finally {
      setIsQuerying(false);
    }
  };

  const handleReset = () => {
    setAiQuery("");
    setAiResponse(null);
  };

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

  // Loading state
  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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

          {/* AI Response Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">AI Insights</h3>
                {dashboardData && dashboardData.analyzedEntries > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateInsights}
                    disabled={isQuerying}
                  >
                    {isQuerying ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Generating...
                      </>
                    ) : (
                      "Generate Insights"
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isQuerying ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : aiResponse ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">
                  Ask me anything about your journal entries, and I&apos;ll
                  provide insights and analysis.
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Query Section */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Ask your Journal AI</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Get insights, summaries, or ask anything about your entries.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Type your question for the AI... (e.g., 'How has my mood changed over time?', 'What patterns do you see in my entries?')"
                  className="min-h-[100px] text-base font-sans leading-relaxed resize-none"
                  disabled={isQuerying}
                />
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isQuerying || !aiQuery}
              >
                Clear
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isQuerying || !aiQuery.trim()}
              >
                {isQuerying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Thinking...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </CardFooter>
          </Card>
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
