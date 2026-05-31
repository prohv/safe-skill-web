export interface Signal {
  rule: string;
  severity: "low" | "medium" | "high" | "critical";
  file: string;
  line: number;
  snippet: string;
  explanation: string;
}

const severityStyles: Record<string, string> = {
  low: "bg-risk-safe/10 text-risk-safe border border-risk-safe/20",
  medium: "bg-risk-warn/10 text-risk-warn border border-risk-warn/20",
  high: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
  critical: "bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20",
};

export function ReportDetails({ signals }: { signals: Signal[] }) {
  if (!signals || signals.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <h2 className="font-clash text-xl text-text-primary">Triggered Signals</h2>
      {signals.map((signal, i) => (
        <div
          key={i}
          className="rounded-xl bg-surface border border-border-subtle p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-clash text-sm text-text-primary">
              {signal.rule}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-satoshi ${
                severityStyles[signal.severity] || severityStyles.high
              }`}
            >
              {signal.severity.toUpperCase()}
            </span>
          </div>

          <p className="font-mono text-xs text-text-muted mb-3">
            {signal.file}:{signal.line}
          </p>

          <pre className="p-3 rounded-lg bg-elevated font-mono text-xs text-text-primary overflow-x-auto whitespace-pre-wrap">
            {signal.snippet}
          </pre>

          {signal.explanation && (
            <p className="font-satoshi text-sm text-text-secondary leading-relaxed mt-3">
              {signal.explanation}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
