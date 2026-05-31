import { SkillCard } from "./SkillCard";

interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  riskScore: number;
  verified: boolean;
}

export function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {skills.map((skill) => (
        <div key={skill.id} className="col-span-12 md:col-span-6 lg:col-span-4">
          <SkillCard
            name={skill.name}
            description={skill.description}
            tags={skill.tags}
            riskScore={skill.riskScore}
            verified={skill.verified}
          />
        </div>
      ))}
    </div>
  );
}
