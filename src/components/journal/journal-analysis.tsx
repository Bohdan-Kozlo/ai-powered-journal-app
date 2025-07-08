"use client";

import { Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";

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
  analysis: JournalAnalysisData;
  entryId: string;
}

export function JournalAnalysis({
  analysis,
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

  const moodColor = getMoodColor(analysis.mood, analysis.negative);

  const moodLabel =
    analysis.mood.charAt(0).toUpperCase() +
    analysis.mood.slice(1).toLowerCase();

  const handleAnalysisRequest = async () => {
    setIsAnalysisRequested(true);

    try {
     
    } catch (error) {
      console.error("Error requesting analysis:", error);
      toast.error("Failed to analyze entry. Please try again.");
    } finally {
      setIsAnalysisRequested(false);
    }
  };

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
