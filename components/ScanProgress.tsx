const phases = ["Uploading", "Scanning", "Report"];

export function ScanProgress({ phase }: { phase: number }) {
  return (
    <div className="flex items-center gap-2 py-8 justify-center">
      {phases.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-satoshi font-medium transition-colors ${
              i < phase
                ? "bg-brand-teal/30 text-brand-teal"
                : i === phase
                  ? "bg-brand-teal text-white"
                  : "bg-overlay text-text-muted"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`font-satoshi text-sm ${
              i === phase ? "text-text-primary" : "text-text-muted"
            }`}
          >
            {label}
          </span>
          {i < phases.length - 1 && (
            <div className="w-6 h-px bg-border-default" />
          )}
        </div>
      ))}
    </div>
  );
}
