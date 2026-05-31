"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function TagPillsInner({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  const base = (extra: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    return `/marketplace${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link
        href={base({ tag: "" })}
        className={`px-3 py-1.5 rounded-full text-xs font-satoshi whitespace-nowrap transition-colors ${
          !activeTag
            ? "bg-brand-teal/10 text-brand-teal"
            : "bg-overlay text-text-secondary hover:bg-elevated"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={base({ tag })}
          className={`px-3 py-1.5 rounded-full text-xs font-satoshi whitespace-nowrap transition-colors ${
            activeTag === tag
              ? "bg-brand-teal/10 text-brand-teal"
              : "bg-overlay text-text-secondary hover:bg-elevated"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

export function TagPills({ tags }: { tags: string[] }) {
  return (
    <Suspense fallback={<div className="flex gap-2 overflow-x-auto pb-1 h-9" />}>
      <TagPillsInner tags={tags} />
    </Suspense>
  );
}
