"use client";

import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AverageMoodCardProps {
  averageScore: number;
  totalEntries: number;
  analyzedEntries: number;
}

export function AverageMoodCard({
  averageScore,
  totalEntries,
  analyzedEntries,
}: AverageMoodCardProps) {
  const getMoodColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getMoodDescription = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    if (score >= 30) return "Poor";
    return "Very Poor";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Average Mood Score
        </CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={`text-2xl font-bold ${getMoodColor(averageScore)}`}>
            {averageScore}
          </div>
          <div className="text-sm text-muted-foreground">/ 100</div>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            {getMoodDescription(averageScore)} mood overall
          </p>
          <p className="text-xs text-muted-foreground">
            Based on {analyzedEntries} of {totalEntries} entries
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
