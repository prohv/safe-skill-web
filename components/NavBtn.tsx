"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export function NavBtn({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`p-2.5 rounded-xl transition-colors ${
        active
          ? "bg-elevated text-brand-teal"
          : "hover:bg-overlay text-text-secondary"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="sr-only">{label}</span>
    </Link>
  );
}
