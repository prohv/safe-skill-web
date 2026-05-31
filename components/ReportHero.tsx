import { RiskBadge } from "./RiskBadge";

type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

function deriveRisk(score: number): RiskStatus {
  if (score < 30) return "SAFE";
  if (score <= 70) return "WARN";
  return "BLOCKED";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function ReportHero({
  risk,
  status,
  summary,
  createdAt,
}: {
  risk: number;
  status: string;
  summary: string;
  createdAt: Date;
}) {
  const level = deriveRisk(risk);

  const scoreColor =
    level === "SAFE"
      ? "text-risk-safe"
      : level === "WARN"
        ? "text-risk-warn"
        : "text-risk-blocked";

  return (
    <div className="flex flex-col items-center text-center py-12 gap-3">
      <p className={`font-clash text-6xl leading-none ${scoreColor}`}>
        {risk}
      </p>
      <RiskBadge status={status as RiskStatus} />
      <p className="font-satoshi text-sm text-text-secondary max-w-lg">
        {summary}
      </p>
      <time className="font-satoshi text-xs text-text-muted">
        {formatDate(new Date(createdAt))}
      </time>
    </div>
  );
}
