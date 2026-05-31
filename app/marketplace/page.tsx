import { db } from "@/db";
import { skills } from "@/db/schema/skills";
import { arrayContains, ilike, or, and, asc, desc } from "drizzle-orm";
import { MarketplaceSearchBar } from "@/components/MarketplaceSearchBar";
import { TagPills } from "@/components/TagPills";
import { SkillGrid } from "@/components/SkillGrid";

interface PageProps {
  searchParams: Promise<{ tag?: string; search?: string; sort?: string }>;
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const { tag, search, sort } = await searchParams;

  const conditions = [];
  if (tag) conditions.push(arrayContains(skills.tags, [tag]));
  if (search) {
    const fuzzy = or(
      ilike(skills.name, `%${search}%`),
      ilike(skills.description, `%${search}%`)
    );
    if (fuzzy) conditions.push(fuzzy);
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows =
    sort === "risk-asc"
      ? await db.select().from(skills).where(where).orderBy(asc(skills.riskScore))
      : sort === "risk-desc"
        ? await db.select().from(skills).where(where).orderBy(desc(skills.riskScore))
        : await db.select().from(skills).where(where);

  const allRows = await db
    .select({ tags: skills.tags, id: skills.id })
    .from(skills);
  const uniqueTags = [...new Set(allRows.flatMap((r) => r.tags))].sort();

  return (
    <>
      <MarketplaceSearchBar />

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <TagPills tags={uniqueTags} />
        </div>

        <div className="py-6">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-clash text-xl text-text-secondary mb-2">
                No skills found
              </p>
              <p className="font-satoshi text-sm text-text-muted">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <SkillGrid skills={rows} />
          )}
        </div>
      </div>
    </>
  );
}
