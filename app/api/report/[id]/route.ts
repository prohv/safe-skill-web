import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "report not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
