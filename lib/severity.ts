import type { Signal, SignalSeverity, CLISignal } from "./types";

export function normalizeSeverity(v: number | string): {
  label: SignalSeverity;
  value: number;
} {
  if (typeof v === "number") {
    if (v >= 80) return { label: "critical", value: v };
    if (v >= 50) return { label: "high", value: v };
    if (v >= 30) return { label: "medium", value: v };
    return { label: "low", value: v };
  }
  const map: Record<string, number> = {
    critical: 80,
    high: 50,
    medium: 30,
    low: 10,
  };
  return { label: v as SignalSeverity, value: map[v] ?? 30 };
}

export function isCLISignal(s: Signal): s is CLISignal {
  return typeof s.severity === "number";
}
