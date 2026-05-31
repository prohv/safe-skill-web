import { FilterBar } from "@/components/FilterBar";
import { SkillFolderCard } from "@/components/SkillFolderCard";

export default function HomePage() {
  return (
    <>
      <FilterBar />

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard
              title="Top Safe Skills"
              description="The 10 highest-verified, lowest-risk skills in the marketplace"
              risk="SAFE"
              riskScore={5}
              verified
              href="/marketplace?sort=risk-asc"
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard
              title="Web & Dev Skills"
              description="Safe skills for web development, APIs, and tooling"
              risk="SAFE"
              riskScore={10}
              verified
              href="/marketplace?tag=dev"
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard
              title="Community Picks"
              description="Most scanned and community-approved skills this week"
              risk="SAFE"
              riskScore={15}
              verified
              href="/marketplace?sort=popular"
            />
          </div>
        </div>
      </div>
    </>
  );
}
