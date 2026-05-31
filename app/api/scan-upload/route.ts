import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { scanContent } from "@/lib/scan-engine";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 10MB limit" },
      { status: 400 }
    );
  }

  const text = await file.text();
  const result = scanContent(text, file.name);

  const id = crypto.randomUUID();

  await db.insert(reports).values({
    id,
    risk: result.risk,
    status: result.status,
    summary: result.summary,
    signals: result.signals as unknown as typeof reports.$inferInsert["signals"],
  });

  return NextResponse.json({ id, url: `/report/${id}` }, { status: 201 });
}
