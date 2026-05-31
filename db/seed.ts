import { db } from "./index";
import { skills } from "./schema/skills";

const seedSkills = [
  {
    id: "sql-explorer",
    name: "SQL Explorer",
    description: "Read-only SQL query tool for safe database exploration.",
    tags: ["data", "dev", "utility"],
    riskScore: 15,
    verified: true,
  },
  {
    id: "weather",
    name: "Weather API",
    description: "Fetch current weather and forecasts via OpenWeatherMap.",
    tags: ["api", "utility"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description: "Render and preview markdown files in real-time.",
    tags: ["dev", "productivity"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "file-reader",
    name: "Safe File Reader",
    description: "Read-only file access for approved project paths.",
    tags: ["utility", "dev"],
    riskScore: 10,
    verified: true,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and prettify JSON data.",
    tags: ["dev", "data"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "color-palette",
    name: "Color Palette Generator",
    description: "Generate accessible color palettes from a base hue.",
    tags: ["design", "dev"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "timezone",
    name: "Timezone Converter",
    description: "Convert times across timezones with DST awareness.",
    tags: ["utility", "productivity"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "uuid-gen",
    name: "UUID Generator",
    description: "Generate v4 UUIDs for IDs and keys.",
    tags: ["dev", "utility"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "emoji-finder",
    name: "Emoji Finder",
    description: "Search and copy emoji by keyword or category.",
    tags: ["productivity"],
    riskScore: 5,
    verified: true,
  },
  {
    id: "clipboard",
    name: "Clipboard Manager",
    description: "Read and write clipboard content within sandbox limits.",
    tags: ["utility"],
    riskScore: 20,
    verified: true,
  },
];

async function main() {
  await db.insert(skills).values(seedSkills).onConflictDoNothing();
  console.log(`✓ Seeded ${seedSkills.length} skills`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
