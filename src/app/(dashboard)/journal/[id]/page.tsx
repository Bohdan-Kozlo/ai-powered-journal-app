"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { JournalHeader } from "@/components/journal/journal-header";
import { JournalContent } from "@/components/journal/journal-content";
import {
  JournalAnalysis,
  JournalAnalysisData,
} from "@/components/journal/journal-analysis";
import { getJournalEntry } from "@/server-actions/getJournalEntry";
import { updateJournalEntry } from "@/server-actions/updateJournalEntry";
import { deleteJournalEntry } from "@/server-actions/deleteJournalEntry";
import { analyzeJournalEntryAction } from "@/server-actions/analyzeJournalEntry";
import { toast } from "react-hot-toast";

interface JournalEntry {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  journalAnalysis?: JournalAnalysisData | null;
}

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getJournalEntry(entryId);

        if (result.success && result.data) {
          const entryData = result.data as unknown as JournalEntry;
          setEntry(entryData);
        } else {
          setError(result.message || "Failed to load journal entry");
          toast.error(result.message || "Failed to load journal entry");
        }
      } catch (error) {
        console.error("Error fetching journal entry:", error);
        setError("Failed to load journal entry");
        toast.error("Failed to load journal entry");
      } finally {
        setIsLoading(false);
      }
    };

    if (entryId) {
      fetchEntry();
    }
  }, [entryId]);

  useEffect(() => {
    const analyze = async () => {
      if (entry && !entry.journalAnalysis && entry.content.trim().length > 0) {
        setIsAnalyzing(true);
        try {
          const analysisResult = await analyzeJournalEntryAction(
            entryId,
            entry.content
          );
          if (analysisResult.success && analysisResult.data) {
            const analysisData =
              analysisResult.data as unknown as JournalAnalysisData;
            setEntry((prev) =>
              prev ? { ...prev, journalAnalysis: analysisData } : null
            );
            toast.success("Entry analyzed successfully!");
          }
        } catch (error) {
          console.error("Auto-analysis failed:", error);
          toast.error("Failed to analyze entry");
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, entryId]);

  const handleSaveContent = async (newContent: string) => {
    try {
      const result = await updateJournalEntry(entryId, newContent);

      if (result.success) {
        setEntry((prev) =>
          prev ? { ...prev, content: newContent, updatedAt: new Date() } : null
        );
        toast.success("Entry updated successfully!");
      } else {
        toast.error(result.message || "Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Failed to update entry");
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this journal entry? This action cannot be undone."
      )
    ) {
      try {
        const result = await deleteJournalEntry(entryId);

        if (result.success) {
          toast.success("Entry deleted successfully!");
          router.push("/journal");
        } else {
          toast.error(result.message || "Failed to delete entry");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Failed to delete entry");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAnalysisComplete = (analysis: JournalAnalysisData) => {
    setEntry((prev) => (prev ? { ...prev, journalAnalysis: analysis } : null));
  };

  // Loading state
  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error || !entry) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Entry Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error ||
              "The journal entry you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <button
            onClick={() => router.push("/journal")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Journal
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Journal Entry */}
        <div className="w-full md:w-2/3 space-y-6">
          <JournalHeader
            createdAt={entry.createdAt}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isEditing={isEditing}
          />

          <JournalContent
            content={entry.content}
            updatedAt={entry.updatedAt}
            onSave={handleSaveContent}
          />
        </div>

        {/* Right side - Journal Analysis */}
        <div className="w-full md:w-1/3 space-y-6">
          <JournalAnalysis
            analysis={entry.journalAnalysis || null}
            entryId={entryId}
            content={entry.content}
            isLoading={isAnalyzing}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </div>
    </Container>
  );
}
