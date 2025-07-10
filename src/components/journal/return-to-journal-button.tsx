"use client";

import { useRouter } from "next/navigation";

export function ReturnToJournalButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/journal")}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      Return to Journal
    </button>
  );
}
