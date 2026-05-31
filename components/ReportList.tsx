import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RiskBadge } from "./RiskBadge";

type RiskStatus = "SAFE" | "WARN" | "BLOCKED";

function deriveRisk(score: number): RiskStatus {
  if (score < 30) return "SAFE";
  if (score <= 70) return "WARN";
  return "BLOCKED";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getReports() {
  return db
    .select({
      id: reports.id,
      risk: reports.risk,
      status: reports.status,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .orderBy(desc(reports.createdAt));
}

export async function ReportList() {
  const rows = await getReports();

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border-subtle">
          <th className="text-left font-satoshi text-xs text-text-muted font-normal pb-3 pr-4">
            Report ID
          </th>
          <th className="text-left font-satoshi text-xs text-text-muted font-normal pb-3 pr-4">
            Risk
          </th>
          <th className="text-left font-satoshi text-xs text-text-muted font-normal pb-3 pr-4">
            Status
          </th>
          <th className="text-left font-satoshi text-xs text-text-muted font-normal pb-3 pr-4">
            Date
          </th>
          <th className="pb-3 w-10" />
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.id}
            className="border-b border-border-subtle/50 hover:bg-overlay/50 transition-colors"
          >
            <td className="py-3 pr-4">
              <span className="font-mono text-xs text-text-secondary truncate block max-w-40">
                {r.id.slice(0, 8)}…
              </span>
            </td>
            <td className="py-3 pr-4">
              <span
                className={`font-mono text-sm ${
                  deriveRisk(r.risk) === "SAFE"
                    ? "text-risk-safe"
                    : deriveRisk(r.risk) === "WARN"
                      ? "text-risk-warn"
                      : "text-risk-blocked"
                }`}
              >
                {r.risk}
              </span>
            </td>
            <td className="py-3 pr-4">
              <RiskBadge status={r.status as RiskStatus} />
            </td>
            <td className="py-3 pr-4">
              <time className="font-satoshi text-xs text-text-muted">
                {formatDate(new Date(r.createdAt))}
              </time>
            </td>
            <td className="py-3">
              <Link
                href={`/report/${r.id}`}
                className="p-2 rounded-xl hover:bg-overlay transition-colors inline-flex"
              >
                <ArrowRight className="w-4 h-4 text-text-muted hover:text-text-primary" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
