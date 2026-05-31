import { SkillCard } from "./SkillCard";

export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  riskScore: number;
  verified: boolean;
  installCommand?: string | null;
  sourceUrl?: string | null;
}

export function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {skills.map((skill) => (
        <div key={skill.id} className="col-span-12 md:col-span-6 lg:col-span-4">
          <SkillCard {...skill} />
        </div>
      ))}
    </div>
  );
}
