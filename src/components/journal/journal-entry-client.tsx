"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JournalHeader } from "@/components/journal/journal-header";
import { JournalContent } from "@/components/journal/journal-content";
import {
  JournalAnalysis,
  JournalAnalysisData,
} from "@/components/journal/journal-analysis";
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

interface JournalEntryClientProps {
  initialEntry: JournalEntry;
  entryId: string;
}

export function JournalEntryClient({
  initialEntry,
  entryId,
}: JournalEntryClientProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry>(initialEntry);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Auto-analyze entry if it doesn't have analysis
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
            setEntry((prev) => ({ ...prev, journalAnalysis: analysisData }));
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
  }, [entryId, entry]);

  const handleSaveContent = async (newContent: string) => {
    try {
      const result = await updateJournalEntry(entryId, newContent);

      if (result.success) {
        setEntry((prev) => ({
          ...prev,
          content: newContent,
          updatedAt: new Date(),
        }));
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
    setEntry((prev) => ({ ...prev, journalAnalysis: analysis }));
  };

  return (
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
  );
}
