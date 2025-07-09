"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A sentiment distribution pie chart";

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-2))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface SentimentData {
  sentiment: string;
  count: number;
  fill: string;
}

interface SentimentDistributionProps {
  data: SentimentData[];
}

export function SentimentDistribution({ data }: SentimentDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const positivePercentage =
    total > 0
      ? Math.round(
          ((data.find((d) => d.sentiment === "Positive")?.count || 0) / total) *
            100
        )
      : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>Overall emotional balance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="sentiment"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {positivePercentage >= 50
            ? "Mostly positive"
            : "Room for improvement"}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {positivePercentage}% positive entries
        </div>
      </CardFooter>
    </Card>
  );
}
