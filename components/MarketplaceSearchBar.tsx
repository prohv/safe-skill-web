"use client";

import { Suspense } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SearchBarInner() {
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary">
        All <ChevronDown className="w-4 h-4" />
      </button>

      <form action="/marketplace" method="GET" className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          name="search"
          defaultValue={searchParams.get("search") || ""}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-teal/40 transition-colors"
          placeholder="Search skills..."
        />
        {searchParams.get("tag") && (
          <input type="hidden" name="tag" value={searchParams.get("tag")!} />
        )}
        {searchParams.get("sort") && (
          <input type="hidden" name="sort" value={searchParams.get("sort")!} />
        )}
      </form>

      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary">
        Sort By <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

export function MarketplaceSearchBar() {
  return (
    <Suspense fallback={<div className="h-[57px]" />}>
      <SearchBarInner />
    </Suspense>
  );
}
