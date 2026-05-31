import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

const riskTextClass: Record<RiskStatus, string> = {
  SAFE: "text-risk-safe",
  WARN: "text-risk-warn",
  BLOCKED: "text-risk-blocked",
};

const riskAuraClass: Record<RiskStatus, string> = {
  SAFE: "folder-safe",
  WARN: "folder-warn",
  BLOCKED: "folder-blocked",
};

const riskBadgeClass: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe/10 text-risk-safe border border-risk-safe/20",
  WARN: "bg-risk-warn/10 text-risk-warn border border-risk-warn/20",
  BLOCKED: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
};

export function SkillFolderCard({
  title,
  description,
  risk,
  riskScore,
  verified,
  href,
  coverIcon,
}: {
  title: string;
  description: string;
  risk: RiskStatus;
  riskScore: number;
  verified?: boolean;
  href: string;
  coverIcon?: LucideIcon;
}) {
  const CoverIcon = coverIcon || ShieldCheck;
  return (
    <div
      className={`
        skill-card skill-card-hover group h-full flex flex-col relative rounded-2xl bg-surface
        border border-white/[0.08] p-5
        transition-all duration-300
        hover:border-white/[0.16] hover:translate-y-[-2px]
        ${riskAuraClass[risk]}
      `}
    >
      <div className="h-28 rounded-xl bg-overlay/50 mb-4 overflow-hidden flex items-center justify-center group-hover:bg-overlay transition-colors duration-300">
        <CoverIcon className="w-16 h-16 text-text-muted/20 group-hover:text-brand-teal group-hover:drop-shadow-[0_0_8px_rgba(0,191,255,0.35)] transition-all duration-300" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        {verified && (
          <span className="px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-satoshi">
            ✓ Verified
          </span>
        )}
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-satoshi ${riskBadgeClass[risk]}`}
        >
          {risk}
        </span>
      </div>

      <h2 className="font-clash text-3xl text-text-primary leading-tight mb-2">
        {title}
      </h2>

      <p className="font-satoshi text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="font-satoshi text-sm text-text-muted">
          Risk: <span className={riskTextClass[risk]}>{riskScore}</span>
        </span>
        <Link
          href={href}
          className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-text-secondary" />
        </Link>
      </div>
    </div>
  );
}
