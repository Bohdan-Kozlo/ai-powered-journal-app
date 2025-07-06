import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Hero } from "@/components/hero";
import Link from "next/link";
import { Bookmark, BookOpen, PenLine } from "lucide-react";
import HomeNav from "@/components/homeNav";

export default function Home() {
  return (
    <main className="flex-1">
      <HomeNav />
      <Container className="flex flex-col items-center justify-center min-h-[80vh]">
        <Hero
          title="Reflectify"
          description="Your AI-powered personal journal for daily reflections, mood analysis, and intelligent insights based on your entries."
        >
          <Button size="lg" asChild>
            <Link href="/dashboard" className="gap-2">
              <PenLine className="h-4 w-4" />
              Start Journaling
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-in" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </Hero>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <PenLine className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Daily Entries</h3>
            <p className="text-muted-foreground">
              Write daily reflections and keep track of your thoughts and
              feelings.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <Bookmark className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-muted-foreground">
              Get insights about your mood and emotional patterns using AI
              technology.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <BookOpen className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Personal Insights</h3>
            <p className="text-muted-foreground">
              Ask questions about your journal entries and get personalized
              insights.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
