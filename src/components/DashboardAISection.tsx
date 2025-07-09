"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { handleAIQuery } from "@/server-actions/handleAIQuery";

interface DashboardAISectionProps {
  analyzedEntries: number;
}

export function DashboardAISection({
  analyzedEntries,
}: DashboardAISectionProps) {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aiQuery.trim()) {
      toast.error("Please enter a question");
      return;
    }

    startTransition(async () => {
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
      }
    });
  };

  const handleGenerateInsights = () => {
    if (analyzedEntries === 0) {
      toast.error("No analyzed entries to generate insights from");
      return;
    }

    const insightsQuery =
      "Based on my journal entries, what patterns do you see in my mood and emotions? Give me insights about my personal growth and well-being.";

    setAiQuery(insightsQuery);

    startTransition(async () => {
      setAiResponse(null);

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
      }
    });
  };

  const handleReset = () => {
    setAiQuery("");
    setAiResponse(null);
  };

  return (
    <>
      {/* AI Response Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">AI Insights</h3>
            {analyzedEntries > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateInsights}
                disabled={isPending}
              >
                {isPending ? (
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
          {isPending ? (
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
              Ask me anything about your journal entries, and I&apos;ll provide
              insights and analysis.
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
              disabled={isPending}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending || !aiQuery}
          >
            Clear
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending || !aiQuery.trim()}
          >
            {isPending ? (
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
    </>
  );
}
