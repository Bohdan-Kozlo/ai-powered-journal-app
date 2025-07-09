"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

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

export const description = "A mood trend area chart";

const chartConfig = {
  moodScore: {
    label: "Mood Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MoodTrendData {
  date: string;
  moodScore: number;
  mood: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface MoodTrendChartProps {
  data: MoodTrendData[];
}

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  const averageScore =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.moodScore, 0) / data.length
        )
      : 0;

  const trend =
    data.length > 1 ? data[data.length - 1].moodScore - data[0].moodScore : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trend</CardTitle>
        <CardDescription>
          Your mood score over the last {data.length} entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="moodScore"
                type="monotone"
                fill="var(--color-moodScore)"
                fillOpacity={0.4}
                stroke="var(--color-moodScore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend >= 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(trend)} points
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Average score: {averageScore}/100
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
