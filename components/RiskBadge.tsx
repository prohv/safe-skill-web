type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

const variants: Record<RiskStatus, string> = {
  SAFE: "bg-risk-safe/10 text-risk-safe border border-risk-safe/20",
  WARN: "bg-risk-warn/10 text-risk-warn border border-risk-warn/20",
  BLOCKED: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
};

export function RiskBadge({ status }: { status: RiskStatus }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-satoshi ${variants[status]}`}
    >
      {status}
    </span>
  );
}
