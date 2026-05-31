export type SignalSeverity = "critical" | "high" | "medium" | "low";

export type WebSignal = {
  rule: string;
  severity: SignalSeverity;
  file: string;
  line: number;
  snippet: string;
  explanation: string;
};

export type CLISignal = {
  rule: string;
  message: string;
  severity: number;
};

export type Signal = WebSignal | CLISignal;
