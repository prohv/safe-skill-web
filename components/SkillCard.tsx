"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SkillModal, type SkillData } from "./SkillModal";

type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

const riskTextClass: Record<RiskStatus, string> = {
  SAFE: "text-risk-safe",
  WARN: "text-risk-warn",
  BLOCKED: "text-risk-blocked",
};

const riskBgClass: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe",
  WARN: "bg-risk-warn",
  BLOCKED: "bg-risk-blocked",
};

const riskBadgeClass: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe/10 text-risk-safe border border-risk-safe/20",
  WARN: "bg-risk-warn/10 text-risk-warn border border-risk-warn/20",
  BLOCKED: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
};

function deriveRisk(score: number): RiskStatus {
  if (score < 30) return "SAFE";
  if (score <= 70) return "WARN";
  return "BLOCKED";
}

export function SkillCard(skill: SkillData) {
  const [open, setOpen] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const risk = deriveRisk(skill.riskScore);
  const initialTagCount = 3;
  const visibleTags = tagsExpanded
    ? skill.tags
    : skill.tags.slice(0, initialTagCount);
  const extraCount = tagsExpanded ? 0 : skill.tags.length - initialTagCount;

  return (
    <>
      <div
        className="skill-card skill-card-hover h-full flex flex-col relative rounded-2xl bg-surface border border-white/[0.08] p-5 transition-all duration-300 hover:border-white/[0.16] hover:translate-y-[-2px] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2 mb-3">
          {skill.verified && (
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
          {skill.name}
        </h2>

        <p className="font-satoshi text-sm text-text-secondary leading-relaxed mb-3 line-clamp-2">
          {skill.description}
        </p>

        {skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
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
                onClick={(e) => {
                  e.stopPropagation();
                  setTagsExpanded(true);
                }}
                className="px-2 py-0.5 rounded-full bg-overlay text-text-muted text-[10px] font-satoshi hover:bg-elevated transition-colors cursor-pointer"
              >
                +{extraCount} more
              </button>
            )}
            {tagsExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTagsExpanded(false);
                }}
                className="px-2 py-0.5 rounded-full bg-overlay text-text-muted text-[10px] font-satoshi hover:bg-elevated transition-colors cursor-pointer"
              >
                - Show less
              </button>
            )}
          </div>
        )}

        <div className="h-1.5 rounded-full bg-overlay mb-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${riskBgClass[risk]}`}
            style={{ width: `${Math.min(skill.riskScore, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-satoshi text-xs text-text-muted">
            Risk:{" "}
            <span className={riskTextClass[risk]}>{skill.riskScore}</span>
          </span>
          <div
            className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <ArrowRight className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </div>

      <SkillModal skill={skill} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
