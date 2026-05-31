import { Search, ChevronDown } from "lucide-react";

export function FilterBar() {
  return (
    <div className="mx-auto w-full max-w-screen-xl flex items-center justify-center gap-3 px-4 sm:px-6 lg:px-8 py-3">
      <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary shrink-0">
        All <ChevronDown className="w-4 h-4" />
      </button>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-teal/40 transition-colors"
          placeholder="Search skills..."
        />
      </div>

      <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary shrink-0">
        Sort By <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
