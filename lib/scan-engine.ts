export interface Signal {
  rule: string;
  severity: "low" | "medium" | "high" | "critical";
  file: string;
  line: number;
  snippet: string;
  explanation: string;
}

interface ScanResult {
  signals: Signal[];
  risk: number;
  status: "SAFE" | "WARN" | "BLOCKED";
  summary: string;
}

const patterns: { rule: string; regex: RegExp; severity: Signal["severity"]; explanation: string }[] = [
  {
    rule: "exec-dangerous",
    regex: /child_process\.(exec|execFile|fork|execSync)\s*\(/,
    severity: "critical",
    explanation: "Executes arbitrary shell commands — full system access risk",
  },
  {
    rule: "exec-spawn",
    regex: /child_process\.(spawn|spawnSync)\s*\(/,
    severity: "high",
    explanation: "Spawns child processes with user-supplied arguments",
  },
  {
    rule: "eval-usage",
    regex: /\beval\s*\(/,
    severity: "high",
    explanation: "Dynamic code execution — arbitrary code injection vector",
  },
  {
    rule: "new-function",
    regex: /new\s+Function\s*\(/,
    severity: "high",
    explanation: "Creates functions from strings — same risk as eval",
  },
  {
    rule: "fs-write",
    regex: /fs\.(writeFile|writeFileSync|unlink|unlinkSync|rm|rmSync|rmdir|rmdirSync)\s*\(/,
    severity: "medium",
    explanation: "Writes or deletes filesystem entries",
  },
  {
    rule: "network-request",
    regex: /https?\.request\b|fetch\s*\(\s*['"`]https?:\/\//,
    severity: "medium",
    explanation: "Makes outbound network requests to untrusted URLs",
  },
  {
    rule: "require-dynamic",
    regex: /require\s*\(\s*[^'"`]/,
    severity: "low",
    explanation: "Dynamic module loading — could load untrusted code",
  },
  {
    rule: "shell-injection",
    regex: /\.exec\s*\(\s*(?!['"`/])\s*\S/,
    severity: "critical",
    explanation: "Unsanitized input passed directly to shell exec",
  },
];

const severityWeight: Record<Signal["severity"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function scanContent(
  content: string,
  filename: string
): ScanResult {
  const lines = content.split("\n");
  const signals: Signal[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("//") || line.trim().startsWith("#")) continue;

    for (const p of patterns) {
      p.regex.lastIndex = 0;
      if (p.regex.test(line)) {
        signals.push({
          rule: p.rule,
          severity: p.severity,
          file: filename,
          line: i + 1,
          snippet: line.trim().slice(0, 200),
          explanation: p.explanation,
        });
      }
    }
  }

  if (signals.length === 0) {
    return {
      signals: [],
      risk: 0,
      status: "SAFE",
      summary: "No dangerous patterns detected",
    };
  }

  const deduped = signals.filter(
    (s, i, a) => a.findIndex((x) => x.rule === s.rule && x.line === s.line) === i
  );

  const maxWeight = deduped.length * 4;
  const weightedSum = deduped.reduce(
    (sum, s) => sum + severityWeight[s.severity],
    0
  );
  const risk = Math.min(
    Math.round((weightedSum / Math.max(maxWeight, 1)) * 100),
    100
  );

  const criticalCount = deduped.filter((s) => s.severity === "critical").length;
  const highCount = deduped.filter((s) => s.severity === "high").length;
  const total = deduped.length;

  let status: ScanResult["status"] = "SAFE";
  if (risk >= 70) status = "BLOCKED";
  else if (risk >= 30) status = "WARN";

  const summary =
    total === 0
      ? "No dangerous patterns detected"
      : `${total} signal${total > 1 ? "s" : ""} found` +
        (criticalCount > 0 ? ` (${criticalCount} critical)` : "") +
        (highCount > 0 ? ` (${highCount} high)` : "");

  return { signals: deduped, risk, status, summary };
}
