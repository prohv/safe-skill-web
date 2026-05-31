"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Home, ShoppingBag, FileText, BookOpen, Plus } from "lucide-react";

const items = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: BookOpen, label: "Docs", href: "https://docs.safeskill.dev" },
] as const;

export function PillNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border-default max-w-fit">
      <Link href="/" className="flex items-center gap-1.5 p-1.5 shrink-0 mr-1">
        <ShieldCheck className="w-6 h-6 text-brand-teal" />
        <span className="font-clash text-base text-text-primary">
          SafeSkill
        </span>
      </Link>

      <div className="w-px h-5 bg-border-default" />

      {items.map(({ icon: Icon, label, href }) => {
        const active = pathname === href;

        return (
          <Link
            key={label}
            href={href}
            className="group relative flex flex-col items-center p-2 rounded-xl transition-colors"
          >
            <Icon
              className={`w-5 h-5 transition-colors ${
                active ? "text-brand-teal" : "text-text-secondary group-hover:text-text-primary"
              }`}
            />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-elevated border border-border-default text-[10px] font-satoshi text-text-secondary whitespace-nowrap shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
              {label}
            </span>
          </Link>
        );
      })}

      <div className="w-px h-5 bg-border-default" />

      <Link
        href="/scan"
        className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group relative"
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-elevated border border-border-default text-[10px] font-satoshi text-text-secondary whitespace-nowrap shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
          Scan
        </span>
      </Link>
    </nav>
  );
}
