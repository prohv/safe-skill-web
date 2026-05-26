---
name: grill-me
description: Audit Next.js App Router work for Server Component correctness, streaming boundaries, loading states, cache behavior, and accidental client-side regressions. Use when reviewing report pages, marketplace pages, route handlers, server actions, or data-fetching flows in SafeSkill Web.
---

# Grill Me

- Review Server Component usage before suggesting client components.
- Prefer server-first rendering, minimal client JS, and fast first paint.
- Check for accidental `use client` spread, browser-only APIs in server files, and unnecessary client fetching.
- Audit loading and error boundaries for report pages, alternatives pages, and upload flows.
- Look for streaming opportunities around slow data reads, skeletons, and split UI boundaries.
- Verify cache and revalidation choices match the page intent.
- Keep CLI-to-web trust boundaries intact; do not move enforcement logic into the web app.
- Use `PRD.md` for product scope and performance intent.
- Report findings in severity order with concrete file references and likely user impact.
