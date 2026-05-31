"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

function Dropdown({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .dropdown-scroll::-webkit-scrollbar { width: 4px; }
        .dropdown-scroll::-webkit-scrollbar-track { background: transparent; }
        .dropdown-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        .dropdown-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>
      <div
        ref={ref}
        className="absolute top-full mt-1.5 left-0 min-w-[160px] rounded-xl bg-elevated border border-border-default shadow-lg shadow-black/30 py-1 z-50 max-h-72 overflow-y-auto dropdown-scroll"
      >
        {children}
      </div>
    </>
  );
}

function DropdownItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-1.5 text-sm font-satoshi transition-colors ${
        active
          ? "text-brand-teal bg-brand-teal/5"
          : "text-text-secondary hover:bg-overlay hover:text-text-primary"
      }`}
    >
      {label}
      {active && <Check className="w-3.5 h-3.5 text-brand-teal" />}
    </Link>
  );
}

function SearchBarInner({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";
  const search = searchParams.get("search") || "";
  const activeSort = searchParams.get("sort") || "";

  const [allOpen, setAllOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const allHref = (tag: string) => {
    const p = new URLSearchParams();
    if (tag) p.set("tag", tag);
    if (search) p.set("search", search);
    if (activeSort) p.set("sort", activeSort);
    const qs = p.toString();
    return `/marketplace${qs ? `?${qs}` : ""}`;
  };

  const sortHref = (sort: string) => {
    const p = new URLSearchParams();
    if (activeTag) p.set("tag", activeTag);
    if (search) p.set("search", search);
    if (sort) p.set("sort", sort);
    const qs = p.toString();
    return `/marketplace${qs ? `?${qs}` : ""}`;
  };

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "risk-asc", label: "Risk: Low to High" },
    { value: "risk-desc", label: "Risk: High to Low" },
    { value: "safe", label: "SAFE first" },
    { value: "warn", label: "WARN first" },
    { value: "blocked", label: "BLOCKED first" },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-xl flex items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-3 flex-wrap">
      <div className="relative">
        <button
          onClick={() => {
            setAllOpen((o) => !o);
            setSortOpen(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-satoshi text-sm shrink-0 transition-colors border ${
            !activeTag
              ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20"
              : "bg-overlay border-white/[0.08] text-text-secondary hover:bg-elevated"
          }`}
        >
          {activeTag || "All"} <ChevronDown className="w-4 h-4" />
        </button>
        <Dropdown open={allOpen} onClose={() => setAllOpen(false)}>
          <DropdownItem
            href={allHref("")}
            label="All"
            active={!activeTag}
            onClick={() => setAllOpen(false)}
          />
          {tags.map((tag) => (
            <DropdownItem
              key={tag}
              href={allHref(tag)}
              label={tag}
              active={activeTag === tag}
              onClick={() => setAllOpen(false)}
            />
          ))}
        </Dropdown>
      </div>

      <form action="/marketplace" method="GET" className="relative flex-1 min-w-[160px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          name="search"
          defaultValue={search}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-teal/40 transition-colors"
          placeholder="Search skills..."
        />
        {activeTag && <input type="hidden" name="tag" value={activeTag} />}
        {activeSort && <input type="hidden" name="sort" value={activeSort} />}
      </form>

      <div className="relative">
        <button
          onClick={() => {
            setSortOpen((o) => !o);
            setAllOpen(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-satoshi text-sm shrink-0 transition-colors border ${
            activeSort
              ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20"
              : "bg-overlay border-white/[0.08] text-text-secondary hover:bg-elevated"
          }`}
        >
          Sort By <ChevronDown className="w-4 h-4" />
        </button>
        <Dropdown open={sortOpen} onClose={() => setSortOpen(false)}>
          {sortOptions.map((opt) => (
            <DropdownItem
              key={opt.value}
              href={sortHref(opt.value)}
              label={opt.label}
              active={activeSort === opt.value}
              onClick={() => setSortOpen(false)}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

export function MarketplaceSearchBar({ tags = [] }: { tags?: string[] }) {
  return (
    <Suspense fallback={<div className="h-[57px]" />}>
      <SearchBarInner tags={tags} />
    </Suspense>
  );
}
