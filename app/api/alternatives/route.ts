import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema/skills";
import { and, or, arrayContains, lt, eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tagsParam = searchParams.get("tags");

  if (!tagsParam) {
    return NextResponse.json(
      { error: "tags query parameter is required" },
      { status: 400 }
    );
  }

  const tagList = tagsParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tagList.length === 0) {
    return NextResponse.json([]);
  }

  const tagConditions = tagList.map((tag) => arrayContains(skills.tags, [tag]));

  const rows = await db
    .select()
    .from(skills)
    .where(
      and(
        or(...tagConditions),
        lt(skills.riskScore, 30),
        eq(skills.verified, true)
      )
    )
    .orderBy(asc(skills.riskScore))
    .limit(5);

  return NextResponse.json(rows);
}
