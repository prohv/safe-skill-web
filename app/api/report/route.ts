import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { id, risk, status, summary, signals } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (typeof risk !== "number" || risk < 0 || risk > 100) {
    return NextResponse.json(
      { error: "risk must be a number between 0 and 100" },
      { status: 400 }
    );
  }
  if (!["SAFE", "WARN", "BLOCKED"].includes(status as string)) {
    return NextResponse.json(
      { error: "status must be SAFE, WARN, or BLOCKED" },
      { status: 400 }
    );
  }
  if (!summary || typeof summary !== "string") {
    return NextResponse.json({ error: "summary is required" }, { status: 400 });
  }
  if (signals !== undefined && !Array.isArray(signals)) {
    return NextResponse.json(
      { error: "signals must be an array" },
      { status: 400 }
    );
  }

  // Validate each signal accepts both Web and CLI shapes
  if (signals) {
    for (const s of signals as Record<string, unknown>[]) {
      if (!s.rule || typeof s.rule !== "string") {
        return NextResponse.json(
          { error: "each signal must have a rule string" },
          { status: 400 }
        );
      }
      if (
        typeof s.severity !== "number" &&
        !["critical", "high", "medium", "low"].includes(s.severity as string)
      ) {
        return NextResponse.json(
          {
            error:
              "signal severity must be a number or critical/high/medium/low",
          },
          { status: 400 }
        );
      }
    }
  }

  await db.insert(reports).values({
    id,
    risk,
    status: status as string,
    summary,
    signals: (signals ?? []) as unknown as typeof reports.$inferInsert["signals"],
  });

  return NextResponse.json({ id, url: `/report/${id}` }, { status: 201 });
}
