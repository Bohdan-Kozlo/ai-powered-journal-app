"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import Link from "next/link";

const mockUser = {
  name: "Alex",
};

const mockEntries = [
  {
    id: "1",
    date: "2025-07-06",
    summary: "Had a productive day at work and went for a run in the evening.",
  },
  {
    id: "2",
    date: "2025-07-05",
    summary: "Felt a bit tired, but managed to finish reading a book.",
  },
  {
    id: "3",
    date: "2025-07-04",
    summary: "Spent quality time with family and cooked dinner together.",
  },
];

export default function DashboardPage() {
  const [aiQuery, setAiQuery] = useState("");
  // For UI only, no logic for AI response
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
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {mockUser.name}!
              </h1>
              <div className="text-muted-foreground text-sm">
                {formattedDate} &middot; {formattedTime}
              </div>
            </div>
          </div>

          {/* AI Response Section (top) */}
          <Card>
            <CardHeader>
              <h3 className="text-base font-medium">AI Response</h3>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground italic text-sm">
                The AI&apos;s answer will appear here.
              </div>
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
              <form className="space-y-4">
                <Textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Type your question for the AI..."
                  className="min-h-[100px] text-base font-sans leading-relaxed resize-none"
                  disabled
                />
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
              <Button disabled>Send</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right sidebar: Last 5 Journal Entries */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card>
            <CardHeader>
              <h3 className="text-base font-medium">Last 3 Journal Entries</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/journal/${entry.id}`}
                    className="block p-3 rounded-md border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {entry.summary}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
