import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema/skills";
import { ilike, or, and, arrayContains } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");

  const conditions = [];

  if (tag) {
    conditions.push(arrayContains(skills.tags, [tag]));
  }
  if (search) {
    const fuzzy = or(
      ilike(skills.name, `%${search}%`),
      ilike(skills.description, `%${search}%`)
    );
    if (fuzzy) conditions.push(fuzzy);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const rows = await db.select().from(skills).where(where);

  return NextResponse.json(rows);
}
