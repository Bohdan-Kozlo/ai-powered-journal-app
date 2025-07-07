import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, Plus } from "lucide-react";

type NewEntryCardProps = {
  onClick?: () => void;
};

export function NewEntryCard({ onClick }: NewEntryCardProps) {
  return (
    <Card
      className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow border-dashed"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-center pb-2">
        <PenLine className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-medium">New Journal Entry</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Record your thoughts, feelings, and experiences
        </p>
        <Button className="mt-4" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Create New Entry
        </Button>
      </CardContent>
    </Card>
  );
}
