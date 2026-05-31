export interface ScanSignal {
  rule: string;
  severity: number;
  message: string;
}

export interface ScanResult {
  signals: ScanSignal[];
  risk: number;
  status: "SAFE" | "WARN" | "BLOCKED";
  summary: string;
}

const SOURCE_EXTS = [".js", ".mjs", ".cjs", ".ts", ".tsx", ".sh", ".bash", ".py", ".json"];
const SKIP_DIRS = ["node_modules", ".git", ".safeskill"];
const MAX_FILE_SIZE = 1024 * 1024;

function isBinary(content: string): boolean {
  return content.includes("\x00");
}

function shannonEntropy(s: string): number {
  const counts = new Map<string, number>();
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let e = 0;
  for (const c of counts.values()) {
    const f = c / s.length;
    if (f > 0) e -= f * Math.log2(f);
  }
  return e;
}

function runRules(content: string): ScanSignal[] {
  const signals: ScanSignal[] = [];

  // 1. ShellExec (severity 80)
  if (/child_process\.(exec|execSync|execFile|execFileSync|fork)\s*\(/.test(content) ||
      /(?:^|\s)exec(?:Sync)?\s*\(/.test(content)) {
    signals.push({ rule: "ShellExec", severity: 80, message: "Executes shell commands via child_process" });
  }

  // 2. DynamicEval (severity 50)
  if (/\beval\s*\(/.test(content) || /new\s+Function\s*\(/.test(content)) {
    signals.push({ rule: "DynamicEval", severity: 50, message: "Dynamic code execution via eval or new Function" });
  }

  // 3. PostinstallHook (severity 50)
  if (/"postinstall"\s*:/.test(content) || /'postinstall'\s*:/.test(content) ||
      /\.postinstall\s*=/.test(content) || /postinstall\b/.test(content)) {
    signals.push({ rule: "PostinstallHook", severity: 50, message: "Postinstall script hook detected — runs code on package install" });
  }

  // 4. Obfuscation (severity 30)
  const longLines = content.split("\n").filter((l) => l.trim().length > 50);
  const highEntropyLines = longLines.filter((l) => shannonEntropy(l) > 4.5);
  if (highEntropyLines.length > 0) {
    signals.push({
      rule: "Obfuscation",
      severity: 30,
      message: `High entropy content detected (${highEntropyLines.length} lines with entropy > 4.5) — possible obfuscation`,
    });
  }

  // 5. NetworkAccess (severity 30)
  if (/\bfetch\s*\(/.test(content) || /\baxios\b/.test(content) ||
      /https?\.request\b/.test(content) || /\bg(?:et|ot)\s*\(/.test(content) ||
      /require\s*\(['"`]https?:/.test(content)) {
    signals.push({ rule: "NetworkAccess", severity: 30, message: "Makes network requests to external URLs" });
  }

  // 6. EnvAccess (severity 30)
  if (/process\.env\b/.test(content) || /dotenv\.config\b/.test(content)) {
    signals.push({ rule: "EnvAccess", severity: 30, message: "Accesses environment variables — may read sensitive data" });
  }

  // 7. ChildProcess (severity 20)
  if (/\bchild_process\b/.test(content) || /\bspawn(?:Sync)?\s*\(/.test(content) ||
      /\bfork\s*\(/.test(content)) {
    signals.push({ rule: "ChildProcess", severity: 20, message: "Spawning child processes" });
  }

  return signals;
}

function aggregate(signals: ScanSignal[]): ScanSignal[] {
  const seen = new Map<string, ScanSignal>();
  for (const sig of signals) {
    seen.set(sig.rule + ":" + sig.message, sig);
  }
  return [...seen.values()].sort((a, b) => b.severity - a.severity);
}

function applyBoosts(signals: ScanSignal[], score: number): number {
  const has = (name: string) => signals.some((s) => s.rule === name);

  if (has("Obfuscation") && has("DynamicEval")) score += 30;
  if (has("NetworkAccess") && has("EnvAccess")) score += 25;

  if (signals.some((s) => s.severity >= 80)) return 100;

  return Math.min(100, Math.max(0, score));
}

function classify(score: number): ScanResult["status"] {
  if (score < 30) return "SAFE";
  if (score < 70) return "WARN";
  return "BLOCKED";
}

function summarize(signals: ScanSignal[]): string {
  if (signals.length === 0) return "No threats detected";
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const s of signals) {
    if (s.severity >= 80) counts.critical++;
    else if (s.severity >= 50) counts.high++;
    else if (s.severity >= 30) counts.medium++;
    else counts.low++;
  }
  return (
    Object.entries(counts)
      .filter(([, n]) => n > 0)
      .map(([k, n]) => `${n} ${k}`)
      .join(", ") + " signal(s) detected"
  );
}

export function scanContent(content: string, filename: string): ScanResult {
  if (isBinary(content)) {
    return { signals: [], risk: 0, status: "SAFE", summary: "No threats detected" };
  }

  const signals = runRules(content);
  const deduped = aggregate(signals);

  if (deduped.length === 0) {
    return { signals: [], risk: 0, status: "SAFE", summary: "No threats detected" };
  }

  const rawScore = deduped.reduce((sum, s) => sum + s.severity, 0);
  const risk = applyBoosts(deduped, rawScore);
  const status = classify(risk);
  const summary = summarize(deduped);

  return { signals: deduped, risk, status, summary };
}
