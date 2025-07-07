"use client";

import { useState } from "react";
import { SaveIcon, RotateCcw } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

interface JournalContentProps {
  content: string;
  updatedAt: Date;
  onSave: (content: string) => void;
}

export function JournalContent({
  content: initialContent,
  updatedAt,
  onSave,
}: JournalContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [originalContent, setOriginalContent] = useState(initialContent);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalContent(content);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(content);
  };

  const handleReset = () => {
    setContent(originalContent);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline" size="sm">
            Edit Entry
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] font-sans text-base leading-relaxed"
            />
          ) : (
            <div className="prose max-w-none">
              {content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <SaveIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="flex justify-end text-xs text-muted-foreground">
        Last updated: {formatDate(updatedAt)} at{" "}
        {updatedAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
