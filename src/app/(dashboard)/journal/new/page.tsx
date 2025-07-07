"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, SaveIcon, RotateCcw } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NewJournalPage() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const today = new Date();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      // Here you would send the data to your backend
      console.log("Saving journal entry:", { content, date: today });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success message or redirect
      alert("Journal entry saved successfully!");
      // In a real app, you might redirect: router.push('/journal');
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (content && confirm("Are you sure you want to clear the content?")) {
      setContent("");
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">New Journal Entry</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(today)}</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">
              Express your thoughts, reflections, and experiences...
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your journal entry here... What's on your mind today?"
                  className="min-h-[400px] text-base font-sans leading-relaxed resize-none"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
              disabled={!content || isSaving}
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={!content || isSaving}
            >
              <SaveIcon className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Your entry will be analyzed automatically after saving</p>
        </div>
      </div>
    </Container>
  );
}
