import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
}: {
  title: string;
  description: string;
  risk: RiskStatus;
  riskScore: number;
  verified?: boolean;
  href: string;
}) {
  return (
    <div
      className={`
        skill-card skill-card-hover relative rounded-2xl bg-surface
        border border-white/[0.08] p-5
        transition-all duration-300
        hover:border-white/[0.16] hover:translate-y-[-2px]
        ${riskAuraClass[risk]}
      `}
    >
      <div className="h-28 rounded-xl bg-overlay mb-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-satoshi">
          Cover image · coming soon
        </div>
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

      <h2 className="font-clash text-2xl text-text-primary leading-tight mb-2">
        {title}
      </h2>

      <p className="font-satoshi text-sm text-text-secondary leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex items-center justify-between">
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
