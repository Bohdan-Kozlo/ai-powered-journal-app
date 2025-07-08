"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { JournalHeader } from "@/components/journal/journal-header";
import { JournalContent } from "@/components/journal/journal-content";
import {
  JournalAnalysis,
  JournalAnalysisData,
} from "@/components/journal/journal-analysis";

// Mock data for JournalEntry based on your schema
const mockJournalEntry = {
  id: "entry-123",
  content: `Today was incredibly productive. I managed to complete the main features for our project ahead of schedule.
  
The team meeting went well, and everyone seemed pleased with the progress we've made this sprint. I felt confident presenting my part and received positive feedback from both the project manager and other developers.

I've been implementing the new authentication system, which was challenging at first but became more straightforward once I understood the documentation better. Still need to add some edge case handling tomorrow, but the core functionality is working perfectly.

After work, I went for a 5km run to clear my head. It's amazing how physical exercise can reset your mental state. I'm feeling much more balanced now than I was this morning when I was slightly anxious about the presentation.

Tomorrow I plan to tackle the remaining tasks for this sprint and maybe start looking at the backlog for the next one. I'm feeling optimistic about our timeline and confident in the quality of what we're building.`,
  userId: "user-456",
  createdAt: new Date(2025, 6, 7), // July 7, 2025
  updatedAt: new Date(2025, 6, 7, 15, 30), // July 7, 2025, 15:30
};

const mockJournalAnalysis: JournalAnalysisData = {
  id: "analysis-789",
  summary:
    "This journal entry shows a productive workday with positive emotions. The author completed project features ahead of schedule and received positive feedback from their team. They also mention exercise helping their mental state and feeling optimistic about future tasks.",
  mood: "NEGATIVE", // or "POSITIVE" or "NEUTRAL"
  negative: true,
  entryId: "entry-123",
  createdAt: new Date(2025, 6, 7, 15, 35), // July 7, 2025, 15:35
  moodScore: 30, // Від 0 до 100
  positivePercentage: 5,
  neutralPercentage: 20,
  negativePercentage: 100,
};

export default function JournalEntryPage() {
  const [content, setContent] = useState(mockJournalEntry.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveContent = (newContent: string) => {
    // Here you would typically save the content to your backend
    setContent(newContent);
    console.log("Saving content:", newContent);
  };

  const handleRequestAnalysis = () => {
    // Here you would typically send the content for analysis
    console.log("Requesting analysis for content:", content);
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this journal entry? This action cannot be undone."
      )
    ) {
      // Here you would typically delete the entry from your backend
      console.log("Deleting entry:", mockJournalEntry.id);
      // Redirect to journal list page
      alert("Entry deleted successfully!");
      // In a real application, you would use router.push('/journal') or similar
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Journal Entry */}
        <div className="w-full md:w-2/3 space-y-6">
          <JournalHeader
            createdAt={mockJournalEntry.createdAt}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isEditing={isEditing}
          />

          <JournalContent
            content={content}
            updatedAt={mockJournalEntry.updatedAt}
            onSave={handleSaveContent}
          />
        </div>

        {/* Right side - Journal Analysis */}
        <div className="w-full md:w-1/3 space-y-6">
          <JournalAnalysis analysis={undefined} entryId={""} } />
        </div>
      </div>
    </Container>
  );
}
