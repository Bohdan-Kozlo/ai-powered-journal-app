import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

type EntryCardProps = {
  id: string;
  date: Date;
  summary: string;
  mood: "positive" | "negative" | "neutral";
  onClick?: () => void;
};

export function EntryCard({ date, summary, mood, onClick }: EntryCardProps) {
  const moodVariant = {
    positive: "positive",
    negative: "negative",
    neutral: "neutral",
  } as const;

  return (
    <Card
      className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>{formatDate(date)}</span>
        </div>
        <Badge variant={moodVariant[mood]}>
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{truncate(summary, 150)}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <p className="text-xs text-muted-foreground">Click to read more</p>
      </CardFooter>
    </Card>
  );
}
