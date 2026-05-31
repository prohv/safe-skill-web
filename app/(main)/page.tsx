import { FilterBar } from "@/components/FilterBar";
import { SkillFolderCard } from "@/components/SkillFolderCard";
import GradientText from "@/components/GradientText";

export default function HomePage() {
  return (
    <>
      <section className="text-center py-10 md:py-14 px-4">
        <GradientText
          colors={["#00BFFF", "#00BFFF", "#4169E1", "#1E3A8A"]}
          animationSpeed={4}
          direction="diagonal"
          className="inline-flex"
        >
          <h1 className="font-clash text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Discover Safe Skills
          </h1>
        </GradientText>
        <p className="font-satoshi text-lg text-text-secondary max-w-xl mx-auto mt-4">
          Verified MCP marketplace for your AI toolkit
        </p>
      </section>

      <FilterBar />

      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
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
