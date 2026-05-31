"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Copy, Check, ExternalLink, Download } from "lucide-react";

type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

const riskBadgeClass: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe/10 text-risk-safe border border-risk-safe/20",
  WARN: "bg-risk-warn/10 text-risk-warn border border-risk-warn/20",
  BLOCKED: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
};

const riskBgClass: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe",
  WARN: "bg-risk-warn",
  BLOCKED: "bg-risk-blocked",
};

function deriveRisk(score: number): RiskStatus {
  if (score < 30) return "SAFE";
  if (score <= 70) return "WARN";
  return "BLOCKED";
}

export interface SkillData {
  id: string;
  name: string;
  description: string;
  tags: string[];
  riskScore: number;
  verified: boolean;
  installCommand?: string | null;
  sourceUrl?: string | null;
}

export function SkillModal({
  skill,
  open,
  onClose,
}: {
  skill: SkillData;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const risk = deriveRisk(skill.riskScore);
  const cmd = skill.installCommand || `npx safe-skill-${skill.id}`;
  const initialTagCount = 3;
  const visibleTags = tagsExpanded ? skill.tags : skill.tags.slice(0, initialTagCount);
  const extraCount = tagsExpanded ? 0 : skill.tags.length - initialTagCount;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border-default p-6 shadow-2xl opacity-100 scale-100 transition-all duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-overlay hover:bg-elevated transition-colors"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          {skill.verified && (
            <span className="px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-satoshi font-medium">
              ✓ Verified
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-satoshi font-medium ${riskBadgeClass[risk]}`}
          >
            {risk}
          </span>
        </div>

        <h2 className="font-clash text-3xl text-text-primary leading-tight mb-2">
          {skill.name}
        </h2>

        <p className="font-satoshi text-sm text-text-secondary leading-relaxed mb-4">
          {skill.description}
        </p>

        {skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-overlay text-text-muted text-[10px] font-satoshi"
              >
                {tag}
              </span>
            ))}
            {!tagsExpanded && extraCount > 0 && (
              <button
                onClick={() => setTagsExpanded(true)}
                className="px-2 py-0.5 rounded-full bg-overlay text-text-muted text-[10px] font-satoshi hover:bg-elevated transition-colors cursor-pointer"
              >
                +{extraCount} more
              </button>
            )}
            {tagsExpanded && (
              <button
                onClick={() => setTagsExpanded(false)}
                className="px-2 py-0.5 rounded-full bg-overlay text-text-muted text-[10px] font-satoshi hover:bg-elevated transition-colors cursor-pointer"
              >
                - Show less
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-elevated">
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-overlay mb-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${riskBgClass[risk]}`}
                style={{ width: `${Math.min(skill.riskScore, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-satoshi text-text-muted">
                Risk Score
              </span>
              <span className={`text-xs font-satoshi font-semibold ${risk === "SAFE" ? "text-risk-safe" : risk === "WARN" ? "text-risk-warn" : "text-risk-blocked"}`}>
                {skill.riskScore}/100
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-elevated border border-border-subtle p-3 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-satoshi text-text-muted font-medium">
              Install
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-satoshi text-brand-teal hover:text-accent-hover transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <code className="block font-mono text-xs text-text-primary bg-overlay rounded-lg px-3 py-2 overflow-x-auto">
            $ {cmd}
          </code>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scan"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white font-satoshi text-sm font-medium hover:brightness-110 transition-all"
          >
            <Download className="w-4 h-4" />
            Get Skill
          </Link>
          {skill.sourceUrl && (
            <a
              href={skill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-overlay text-text-secondary font-satoshi text-sm hover:bg-elevated transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
