---
name: mock-seeder
description: Stand up zero-database mock data for the SafeSkill marketplace and related views. Use when prototyping marketplace pages, alternatives flows, verified badges, tag filters, and report-driven recommendations before Neon or Drizzle wiring exists.
---

# Mock Seeder

- Start with static in-repo data instead of adding database complexity.
- Seed only the fields needed by the current UI and PRD: id, name, description, tags, risk score, and verified state.
- Keep mock data realistic enough to exercise filters, empty states, and blocked-to-alternative flows.
- Prefer plain TypeScript objects or arrays that can be swapped for Drizzle later with minimal churn.
- Include a small spread of safe, borderline, and high-risk examples when helpful for UX validation.
- Avoid inventing auth, dashboards, or non-MVP marketplace behavior.
- Use `PRD.md` to keep mock structures aligned with the intended product.
