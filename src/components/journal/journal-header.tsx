"use client";

import { CalendarIcon, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface JournalHeaderProps {
  createdAt: Date;
  onDelete: () => void;
  onEdit: () => void;
  isEditing: boolean;
}

export function JournalHeader({
  createdAt,
  onDelete,
  onEdit,
  isEditing,
}: JournalHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Journal Entry</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!isEditing && (
          <>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit Entry
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
