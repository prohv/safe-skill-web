"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <AlertTriangle className="w-12 h-12 text-risk-blocked mb-4" />
      <p className="font-clash text-xl text-text-secondary mb-2">
        Something went wrong
      </p>
      <p className="font-satoshi text-sm text-text-muted max-w-md mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-overlay text-text-secondary font-satoshi text-sm hover:bg-elevated transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
