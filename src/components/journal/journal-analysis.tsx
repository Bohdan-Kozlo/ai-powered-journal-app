"use client";

import { Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

import { analyzeJournalEntryAction } from "@/server-actions/analyzeJournalEntry";

export interface EmotionData {
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

export interface JournalAnalysisData {
  id: string;
  summary: string;
  mood: string;
  negative: boolean;
  entryId: string;
  createdAt: Date;
  moodScore: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
}

interface JournalAnalysisProps {
  analysis: JournalAnalysisData | null;
  entryId: string;
  content: string;
  isLoading?: boolean;
  onAnalysisComplete?: (analysis: JournalAnalysisData) => void;
}

export function JournalAnalysis({
  analysis,
  entryId,
  content,
  isLoading = false,
  onAnalysisComplete,
}: JournalAnalysisProps) {
  const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);

  const getMoodColor = (mood: string, negative: boolean) => {
    switch (mood.toUpperCase()) {
      case "HAPPY":
      case "EXCITED":
        return "#22c55e"; // green
      case "CALM":
      case "NEUTRAL":
        return "#94a3b8"; // gray
      case "SAD":
      case "ANGRY":
        return "#ef4444"; // red
      default:
        return negative ? "#ef4444" : "#22c55e";
    }
  };

  const handleAnalysisRequest = async () => {
    if (!content || content.trim().length === 0) {
      toast.error("Cannot analyze empty content");
      return;
    }

    setIsAnalysisRequested(true);

    try {
      const result = await analyzeJournalEntryAction(entryId, content);

      if (result.success && result.data) {
        toast.success("Analysis completed successfully!");
        const analysisData = result.data as unknown as JournalAnalysisData;
        onAnalysisComplete?.(analysisData);
      } else {
        toast.error(result.message || "Failed to analyze entry");
      }
    } catch (error) {
      console.error("Error requesting analysis:", error);
      toast.error("Failed to analyze entry. Please try again.");
    } finally {
      setIsAnalysisRequested(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">Entry Analysis</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Analyzing your entry...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No analysis available
  if (!analysis) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">Entry Analysis</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click below to analyze the emotional content of this entry
              </p>
              <Button
                onClick={handleAnalysisRequest}
                className="flex items-center gap-2"
                disabled={isAnalysisRequested}
              >
                <Zap className="h-4 w-4" />
                {isAnalysisRequested ? "Analyzing..." : "Analyze Entry"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Analysis available
  const moodColor = getMoodColor(analysis.mood, analysis.negative);
  const moodLabel =
    analysis.mood.charAt(0).toUpperCase() +
    analysis.mood.slice(1).toLowerCase();

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Entry Analysis</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mood Indicator with Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Mood</p>
              <Badge
                style={{
                  backgroundColor: moodColor,
                  color: "#fff",
                }}
              >
                {moodLabel}
              </Badge>
            </div>
          </div>

          {/* Mood Score (0-100) */}
          <div>
            <p className="text-sm font-medium mb-1">Mood Score</p>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  backgroundColor: moodColor,
                  width: `${analysis.moodScore}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-muted-foreground">
              {analysis.moodScore}/100
            </p>
          </div>

          {/* Sentiment Breakdown */}
          <div>
            <p className="text-sm font-medium mb-2">Emotion Distribution</p>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-green-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{
                      width: `${analysis.positivePercentage}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Positive {analysis.positivePercentage}%
                </p>
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-gray-400 rounded-full"
                    style={{
                      width: `${analysis.neutralPercentage}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Neutral {analysis.neutralPercentage}%
                </p>
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-red-200 rounded-full">
                  <div
                    className="h-2 bg-red-500 rounded-full"
                    style={{
                      width: `${analysis.negativePercentage}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Negative {analysis.negativePercentage}%
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <p className="text-sm font-medium mb-2">AI Summary</p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">{analysis.summary}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Analysis created: {formatDate(analysis.createdAt)} at{" "}
              {analysis.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Send for Analysis Button */}
          <div className="pt-4">
            <Button
              onClick={handleAnalysisRequest}
              className="w-full flex items-center gap-2 justify-center"
              variant="secondary"
              disabled={isAnalysisRequested}
            >
              <Zap className="h-4 w-4" />
              {isAnalysisRequested ? "Re-analyzing..." : "Re-analyze Entry"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
