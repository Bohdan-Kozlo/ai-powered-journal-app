import { Container } from "@/components/ui/container";
import { getAnalyticsData } from "@/server-actions/getAnalyticsData";
import { MoodTrendChart } from "@/components/analytics/MoodTrendChart";
import { SentimentDistribution } from "@/components/analytics/SentimentDistribution";
import { AverageMoodCard } from "@/components/analytics/AverageMoodCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";

interface MoodTrendData {
  date: string;
  moodScore: number;
  mood: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentData {
  sentiment: string;
  count: number;
  fill: string;
}

interface AnalyticsData {
  moodTrend: MoodTrendData[];
  emotionDistribution: Array<{
    mood: string;
    count: number;
    percentage: number;
  }>;
  sentimentDistribution: SentimentData[];
  averageMoodScore: number;
  totalEntries: number;
  analyzedEntries: number;
}

export default async function AnalyticsPage() {
  const result = await getAnalyticsData();
  const analyticsData = result.success
    ? (result.data as unknown as AnalyticsData)
    : null;

  if (!result.success) {
    return (
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Analytics</h2>
            <p className="text-muted-foreground mb-4">{result.message}</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!analyticsData || analyticsData.analyzedEntries === 0) {
    return (
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Analytics Data Yet</h2>
            <p className="text-muted-foreground mb-4">
              Create some journal entries and let them be analyzed to see your
              analytics.
            </p>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
            >
              Write your first entry
              <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Insights into your emotional journey and patterns
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {analyticsData.analyzedEntries} of {analyticsData.totalEntries}{" "}
              entries analyzed
            </p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AverageMoodCard
            averageScore={analyticsData.averageMoodScore}
            totalEntries={analyticsData.totalEntries}
            analyzedEntries={analyticsData.analyzedEntries}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalEntries}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.analyzedEntries} analyzed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Common Mood
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.emotionDistribution.length > 0
                  ? analyticsData.emotionDistribution[0].mood
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.emotionDistribution.length > 0
                  ? `${analyticsData.emotionDistribution[0].percentage}% of entries`
                  : "No data available"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <MoodTrendChart data={analyticsData.moodTrend} />
          </div>

          <SentimentDistribution data={analyticsData.sentimentDistribution} />

          <Card>
            <CardHeader>
              <CardTitle>Emotion Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.emotionDistribution.map((emotion) => (
                  <div
                    key={emotion.mood}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{emotion.mood}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${emotion.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {emotion.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
