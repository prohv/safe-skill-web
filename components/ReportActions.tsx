"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

export function ReportActions({
  reportId,
  signalRules,
}: {
  reportId: string;
  signalRules: string[];
}) {
  const [copied, setCopied] = useState(false);

  const primaryTag = signalRules[0] || "";
  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `/report/${reportId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {primaryTag && (
        <Link
          href={`/marketplace?tag=${encodeURIComponent(primaryTag)}`}
          className="px-4 py-2 rounded-xl bg-brand-teal/10 text-brand-teal font-satoshi text-sm hover:bg-brand-teal/20 transition-colors"
        >
          See Safe Alternatives →
        </Link>
      )}

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-overlay text-text-secondary font-satoshi text-sm hover:bg-elevated transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> Copy Report Link
          </>
        )}
      </button>
    </div>
  );
}
