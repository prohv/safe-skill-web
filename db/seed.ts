import { db } from "./index";
import { skills } from "./schema/skills";
import { sql } from "drizzle-orm";

const seedSkills = [
  {
    id: "caveman",
    name: "Caveman",
    description: "Ultra-compressed communication mode. Cuts token usage ~75% with caveman speak while keeping full technical accuracy. Supports lite, full, and ultra intensity levels.",
    tags: ["productivity", "communication", "ai", "tokens", "efficiency"],
    riskScore: 5,
    verified: true,
    installCommand: "npx safe-skill-caveman",
    sourceUrl: "https://github.com/safeskill/caveman",
  },
  {
    id: "grill-me",
    name: "Grill Me",
    description: "Relentless code review grill. Subjects your code to brutal questioning, edge-case analysis, and quality checks before PR approval.",
    tags: ["dev", "qa", "review", "pr", "quality"],
    riskScore: 10,
    verified: true,
    installCommand: "npx safe-skill-grill-me",
    sourceUrl: "https://github.com/safeskill/grill-me",
  },
  {
    id: "code-review",
    name: "Code Review",
    description: "Comprehensive code review checklist for pull requests. Covers correctness, performance, security, style, and edge cases across all languages.",
    tags: ["dev", "qa", "automation", "pr", "best-practices"],
    riskScore: 15,
    verified: true,
    installCommand: "npx safe-skill-code-review",
    sourceUrl: "https://github.com/safeskill/code-review",
  },
  {
    id: "security-review",
    name: "Security Review",
    description: "Systematic security code review for vulnerabilities. Covers injection, XSS, auth, crypto, and OWASP top 10 with actionable reports.",
    tags: ["security", "dev", "audit", "owasp", "vulnerabilities"],
    riskScore: 20,
    verified: true,
    installCommand: "npx safe-skill-security-review",
    sourceUrl: "https://github.com/safeskill/security-review",
  },
  {
    id: "semgrep",
    name: "Semgrep Scanner",
    description: "Run static analysis scans and create custom detection rules across 30+ languages. Automate security pattern enforcement in CI/CD pipelines.",
    tags: ["security", "static-analysis", "linting", "ci-cd", "patterns"],
    riskScore: 25,
    verified: true,
    installCommand: "npx safe-skill-semgrep",
    sourceUrl: "https://github.com/safeskill/semgrep",
  },
  {
    id: "vulnhunter",
    name: "Vuln Hunter",
    description: "Detects dangerous APIs, footgun patterns, and error-prone configurations across codebases with variant analysis and remediation suggestions.",
    tags: ["security", "analysis", "dev", "footguns", "remediation"],
    riskScore: 30,
    verified: true,
    installCommand: "npx safe-skill-vulnhunter",
    sourceUrl: "https://github.com/safeskill/vulnhunter",
  },
  {
    id: "find-skills",
    name: "Skill Explorer",
    description: "Discover, search, and install agent skills from the curated marketplace. Browse by category, rating, and compatibility.",
    tags: ["discovery", "utility", "marketplace", "search", "curated"],
    riskScore: 5,
    verified: true,
    installCommand: "npx safe-skill-find",
    sourceUrl: "https://github.com/safeskill/find-skills",
  },
  {
    id: "customize-opencode",
    name: "Opencode Config",
    description: "Configure opencode agents, subagents, MCP servers, and permission rules. Edit opencode.json and skill configurations.",
    tags: ["dev", "config", "tooling", "mcp", "permissions"],
    riskScore: 20,
    verified: true,
    installCommand: "npx safe-skill-opencode-config",
    sourceUrl: "https://github.com/safeskill/opencode-config",
  },
  {
    id: "tailwind-speedrun",
    name: "Tailwind Speedrun",
    description: "Rapid component development with Tailwind CSS v4. Generates production-ready responsive UI from plain English descriptions.",
    tags: ["design", "frontend", "css", "tailwind", "ui"],
    riskScore: 8,
    verified: true,
    installCommand: "npx safe-skill-tailwind-speedrun",
    sourceUrl: "https://github.com/safeskill/tailwind-speedrun",
  },
  {
    id: "schema-sync",
    name: "Schema Sync",
    description: "Database schema synchronization and migration assistant for Drizzle and Prisma ORM projects. Handles rollbacks and diff generation.",
    tags: ["db", "dev", "migration"],
    riskScore: 18,
    verified: true,
    installCommand: "npx safe-skill-schema-sync",
    sourceUrl: "https://github.com/safeskill/schema-sync",
  },
  {
    id: "mock-seeder",
    name: "Mock Seeder",
    description: "Generate realistic mock data and seed scripts for development and testing environments with configurable schemas and volume.",
    tags: ["db", "testing", "dev", "data"],
    riskScore: 12,
    verified: true,
    installCommand: "npx safe-skill-mock-seeder",
    sourceUrl: "https://github.com/safeskill/mock-seeder",
  },
  {
    id: "eslint-guard",
    name: "ESLint Guard",
    description: "Custom ESLint rule enforcement with project-specific patterns and conventions. Integrates into CI pipelines and pre-commit hooks.",
    tags: ["linting", "dev", "quality"],
    riskScore: 15,
    verified: true,
    installCommand: "npx safe-skill-eslint-guard",
    sourceUrl: "https://github.com/safeskill/eslint-guard",
  },
  {
    id: "git-guardian",
    name: "Git Guardian",
    description: "Pre-commit hooks, branch protection rules, and automated git workflow enforcement. Blocks secrets, large files, and force-pushes.",
    tags: ["git", "devops", "hooks", "security"],
    riskScore: 22,
    verified: true,
    installCommand: "npx safe-skill-git-guardian",
    sourceUrl: "https://github.com/safeskill/git-guardian",
  },
  {
    id: "api-docs-gen",
    name: "API Docs Gen",
    description: "Auto-generate API documentation from TypeScript types, JSDoc comments, and route definitions. Supports OpenAPI and GraphQL.",
    tags: ["docs", "api", "automation"],
    riskScore: 8,
    verified: true,
    installCommand: "npx safe-skill-api-docs-gen",
    sourceUrl: "https://github.com/safeskill/api-docs-gen",
  },
  {
    id: "storybook-gen",
    name: "Storybook Gen",
    description: "Generate Storybook stories directly from React components by analyzing props, types, and default values. Supports CSF3 format.",
    tags: ["frontend", "docs", "components"],
    riskScore: 10,
    verified: true,
    installCommand: "npx safe-skill-storybook-gen",
    sourceUrl: "https://github.com/safeskill/storybook-gen",
  },
];

async function main() {
  // Remove old dummy skills — keep only the 15 seeded above
  await db.delete(skills);

  // Insert new skills
  await db.insert(skills).values(seedSkills);
  console.log(`✓ Seeded ${seedSkills.length} skills`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
