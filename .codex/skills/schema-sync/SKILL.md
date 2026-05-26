---
name: schema-sync
description: Align CLI payloads, API contracts, and Drizzle schema structure for SafeSkill Web. Use when defining or reviewing report ingestion, report retrieval, marketplace records, JSON fields, IDs, timestamps, enums, and validation boundaries between the Go CLI and Next.js backend.
---

# Schema Sync

- Treat the CLI payload and PRD data model as the contract baseline.
- Map each incoming field to storage shape, validation rules, and UI usage.
- Check naming, nullability, types, defaults, indexes, and status vocabulary.
- Verify `report_id` or `id` handling stays consistent across API routes, DB schema, and page params.
- Keep `signals` flexible enough for JSON payloads without weakening validation around required top-level fields.
- Prefer explicit adapters when CLI shape and DB shape differ.
- Flag drift between PRD examples, route handlers, and Drizzle definitions.
- Use `PRD.md` for the current canonical product structure.
