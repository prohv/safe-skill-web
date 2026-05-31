"use client";

import { useState, useRef, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";

export function UploadZone({
  onFile,
  disabled,
  error,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
  error?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-2xl p-8
        flex flex-col items-center justify-center gap-2 py-12 px-8
        cursor-pointer transition-colors
        ${
          error
            ? "border-risk-blocked/40"
            : dragging
              ? "border-brand-teal/60 bg-overlay/50"
              : "border-border-strong hover:bg-overlay/50"
        }
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".js,.ts,.jsx,.tsx,.py,.json,.yaml,.yml,.sh,.txt,.zip"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <UploadCloud className="w-10 h-10 text-text-muted" />
      <p className="font-satoshi text-sm text-text-secondary text-center">
        Drop a skill file here or click to browse
      </p>
      <p className="font-satoshi text-xs text-text-muted text-center">
        Max 10MB · Quick scan only (not identical to CLI)
      </p>
      {error && (
        <p className="font-satoshi text-xs text-risk-blocked mt-1">{error}</p>
      )}
    </div>
  );
}
