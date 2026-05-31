# SafeSkill Web

**Discover, scan, and deploy safe MCP skills.** A cloud-facing security intelligence layer for the SafeSkill ecosystem.

---

## Overview

SafeSkill Web is the **visualization and marketplace layer** for SafeSkill. It provides:

- **Scan report viewer** — visualizes CLI scan results with risk scores, code snippets, and explanations
- **Skill marketplace** — curated catalog of verified safe skills with install commands and source links
- **Upload scanner** — browser-based quick scan for non-CLI users (simplified rules, 10MB cap)
- **Alternatives engine** — suggests safe replacements when a skill is flagged as dangerous

**System boundary:** The Go CLI performs core security enforcement and scanning. The web app **explains, stores, and presents** results.

---

## Architecture

```
[Go CLI]  ──POST /api/report──→  [Next.js Web App]  ──→  [Vercel]
                                      │
                                   ┌──┴──────────────────────┐
                                   │ API Layer (Route Handlers)│
                                   │ Neon Postgres (Drizzle)   │
                                   │ Report Viewer / Marketplace│
                                   │ Upload Scanner            │
                                   └─────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, CSS custom properties |
| Database | Neon Postgres (serverless) |
| ORM | Drizzle ORM 0.45 |
| Animations | Motion, CSS keyframes |
| Icons | Lucide React |
| Fonts | Clash Display (headings) + Satoshi (body) |
| Hosting | Vercel |

---

## Quick Start

```bash
git clone <repo-url>
cd safe-skill-web
bun install
cp .env.example .env.local     # Add your Neon Postgres URL
bun run db:push                 # Push schema to database
bun run db:seed                 # Seed marketplace with 15 skills
bun run dev                     # Start dev server
```

**Environment variable:**
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

---

## Database

Two tables in **Neon Postgres** managed via Drizzle ORM.

### `reports`

| Column | Type | Description |
|--------|------|-------------|
| `id` | text (PK) | Unique report ID (CLI provides UUID/hex) |
| `risk` | integer | 0-100 risk score |
| `status` | text | `SAFE`, `WARN`, or `BLOCKED` |
| `summary` | text | One-line description of findings |
| `signals` | jsonb | Array of triggered rule objects |
| `created_at` | timestamp | Auto-set on insert |

### `skills`

| Column | Type | Description |
|--------|------|-------------|
| `id` | text (PK) | Skill slug |
| `name` | text | Display name |
| `description` | text | Detailed description |
| `tags` | text[] | Array of category tags |
| `risk_score` | integer | 0-100 risk assessment |
| `verified` | boolean | Whether the skill has been curated |
| `install_command` | text | Command to install the skill |
| `source_url` | text | Link to source repository |

```bash
bun run db:push    # Push schema changes
bun run db:seed    # Seed/refresh marketplace skills
bun run db:studio  # Open Drizzle Studio GUI
```

---

## API Reference

### `POST /api/report` — CLI Report Ingestion

The Go CLI submits scan results here.

**Request:**
```json
{
  "id": "a1b2c3d4",
  "risk": 85,
  "status": "BLOCKED",
  "summary": "3 critical signals found in skill.js",
  "signals": [
    {
      "rule": "exec-dangerous",
      "severity": "critical",
      "file": "skill.js",
      "line": 42,
      "snippet": "child_process.exec(userInput)",
      "explanation": "Executes arbitrary shell commands"
    }
  ]
}
```

**Validation:** `id` (required string), `risk` (0-100), `status` (SAFE|WARN|BLOCKED), `summary` (required), `signals` (optional array).

**Response `201`:**
```json
{ "id": "a1b2c3d4", "url": "/report/a1b2c3d4" }
```

### `GET /api/report/{id}` — Fetch Report

Returns full report JSON. `404` if not found.

### `GET /api/skills` — List Marketplace Skills

**Optional params:** `?tag=dev` (filter by tag), `?search=code` (fuzzy search).

### `GET /api/alternatives` — Safe Alternatives

**Required param:** `?tags=dev,security` (comma-separated). Returns up to 5 verified skills with matching tags (risk < 30), ordered by risk ascending.

### `POST /api/scan-upload` — Browser Upload Scan

Multipart form-data with a `file` field. Max 10MB. Returns `{ id, url }` on success.

---

## CLI Integration

```go
// The Go CLI POSTs scan results after each scan
payload := map[string]interface{}{
    "id":      uuid.New().String(),
    "risk":    85,
    "status":  "BLOCKED",
    "summary": "3 critical signals detected",
    "signals": signals,
}

resp, _ := http.Post(
    "https://safeskill.vercel.app/api/report",
    "application/json",
    jsonBody,
)

var result map[string]string
json.NewDecoder(resp.Body).Decode(&result)
fmt.Printf("→ View report: https://safeskill.vercel.app%s\n", result["url"])
```

**Security:** No authentication. Access via unguessable UUID/hex IDs.

---

## Project Structure

```
safe-skill-web/
├── app/
│   ├── (main)/                    # Route group (shared layout)
│   │   ├── layout.tsx             # PillNav + content shell
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── marketplace/           # Skills marketplace
│   │   ├── reports/               # All reports list
│   │   ├── report/[id]/           # Report detail
│   │   └── scan/                  # Upload scanner
│   ├── api/
│   │   ├── report/                # POST/GET reports
│   │   ├── skills/                # GET skill list
│   │   ├── alternatives/          # GET safe alternatives
│   │   └── scan-upload/           # POST file scan
│   ├── globals.css                # Theme tokens, animations
│   └── layout.tsx                 # Root layout, fonts, metadata
├── components/                    # 16 React components
├── db/
│   ├── schema/                    # Drizzle table definitions
│   ├── index.ts                   # DB client singleton
│   └── seed.ts                    # 15 curated skills
├── lib/
│   └── scan-engine.ts             # 8-rule pattern scanner
└── public/
    └── safeskill-logo.svg         # Site logo & favicon
```

---

## Features

### Landing Page (`/`)
- Animated gradient "Discover Safe Skills" heading
- 3 category cards linking to filtered marketplace views
- Responsive 12-column grid

### Marketplace (`/marketplace`)
- 15 curated skills in a responsive card grid
- Dropdown tag filter (20+ unique tags)
- 6 sort options: Default, Risk Low→High, Risk High→Low, SAFE/WARN/BLOCKED first
- Fuzzy search
- Skill detail modal with risk bar, install command, source link

### Report Viewer (`/reports` + `/report/{id}`)
- Reports table with ID, risk score, status, date
- Empty state for no reports
- Report detail with risk score hero, signal cards with code snippets
- "See Alternatives" links to marketplace
- "Copy Report Link" button

### Upload Scanner (`/scan`)
- Drag-and-drop file upload (dashed border zone)
- 10MB limit with error feedback
- 3-phase progress indicator

### Design System
- Dark mode first (`#0a0a0f` base)
- Brand gradient: Electric blue → Royal blue → Deep blue
- Risk auras: SAFE (emerald), WARN (amber), BLOCKED (red)
- Staggered card reveal, hover lift, smooth transitions
- Responsive 12-column grid (sm/md/lg/xl)

---

## Skills Marketplace

15 pre-seeded verified skills:

| # | Skill | Tags | Risk |
|---|-------|------|------|
| 1 | **Caveman** — Ultra-compressed communication mode | productivity, communication, efficiency | 5 |
| 2 | **Grill Me** — Architecture & code review drilling | dev, review, architecture, qa | 10 |
| 3 | **Diagnose** — Structured debugging workflow | debugging, dev, workflow | 8 |
| 4 | **TDD** — Red-green-refactor loops | testing, dev, methodology | 5 |
| 5 | **Improve Codebase Architecture** — Clean AI-generated spaghetti | architecture, dev, refactoring | 20 |
| 6 | **Zoom Out** — High-level system explanations | architecture, design, system-design | 5 |
| 7 | **Grill With Docs** — Challenge designs against ADRs | review, docs, architecture | 10 |
| 8 | **Prototype** — Fast throwaway implementations | dev, prototyping, productivity | 15 |
| 9 | **Handoff** — Compact agent-to-agent context docs | productivity, collaboration, workflow | 8 |
| 10 | **Write A Skill** — Create new agent skills | dev, productivity, tooling | 25 |
| 11 | **To PRD** — Convert conversations to PRDs | product, docs, planning | 5 |
| 12 | **To Issues** — PRDs to GitHub issues | project-management, dev, github | 10 |
| 13 | **Triage** — Issue triaging workflow | workflow, github, productivity | 5 |
| 14 | **Git Guardrails** — Prevent dangerous git operations | git, devops, safety | 30 |
| 15 | **Setup Pre Commit** — Husky, lint-staged, tests | git, devops, quality | 20 |

---

## Scan Engine (Browser Upload)

8 detection patterns for the upload-based scanner (simplified, not identical to CLI):

| Rule | Pattern | Severity |
|------|---------|----------|
| `exec-dangerous` | `child_process.exec()` / `execSync()` | critical |
| `exec-spawn` | `child_process.spawn()` | high |
| `eval-usage` | `eval()` | high |
| `new-function` | `new Function()` | high |
| `fs-write` | `fs.writeFile()` / `fs.unlink()` / `fs.rm()` | medium |
| `network-request` | `https.request()` / `fetch(url)` | medium |
| `require-dynamic` | `require(non-string-literal)` | low |
| `shell-injection` | Unsanitized input to `.exec()` | critical |

Risk = `weightedSum / maxPossible × 100`. Weights: low=1, medium=2, high=3, critical=4. Dedup by rule+line.

---

## License

MIT

---

**Made with [OpenCode](https://github.com/anomalyco/opencode)**
