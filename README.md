# SafeSkill Web

**Discover, scan, and deploy safe MCP skills.** A cloud-facing security intelligence layer for the SafeSkill ecosystem.

---

## Overview

SafeSkill Web is the **visualization and marketplace layer** for SafeSkill. It provides:

- **Scan report viewer** — visualizes CLI/GUI scan results with risk scores, code snippets, and explanations
- **Skill marketplace** — curated catalog of 15 verified skills with install commands and detail modals
- **Upload scanner** — browser-based quick scan for non-CLI users (7-rule pipeline, 10MB cap)
- **Alternatives engine** — suggests safe alternatives when a skill matches dangerous patterns

**System boundary:** The Go CLI performs core security enforcement. The web app **explains, stores, and presents** results.

---

## Architecture

```
[Go CLI] ──POST /api/report──→ [Next.js Web App] ──→ [Vercel]
                                    │
                                 ┌──┴───────────────────────────┐
                                 │ API Layer (5 Route Handlers)  │
                                 │ Neon Postgres (Drizzle ORM)   │
                                 │ Report Viewer                 │
                                 │ Marketplace + Skill Detail     │
                                 │ Upload Scanner (7-rule engine)│
                                 └──────────────────────────────┘
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
| Animations | Motion (animated gradient), CSS keyframes (cards, FAB) |
| Icons | Lucide React |
| Fonts | Clash Display (headings) + Satoshi (body) — variable WOFF2 |
| Hosting | Vercel |

---

## Quick Start

```bash
git clone https://github.com/prohv/safe-skill-web
cd safe-skill-web
bun install
cp .env.example .env.local          # Add your Neon Postgres URL
bun run db:push                      # Push schema to database
bun run db:seed                      # Seed marketplace with 15 skills
bun run dev                          # Start dev server
```

**Environment variable:**
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

---

## Database

### `reports`

| Column | Type | Description |
|--------|------|-------------|
| `id` | text (PK) | Unique report ID (UUID/hex from CLI) |
| `risk` | integer | 0-100 risk score |
| `status` | text | `SAFE`, `WARN`, or `BLOCKED` |
| `summary` | text | One-line description of findings |
| `signals` | jsonb | Array of triggered signal objects (CLI or Web format) |
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
bun run db:push    # Push schema changes to Neon
bun run db:seed    # Seed/refresh marketplace skills
bun run db:studio  # Open Drizzle Studio GUI
```

---

## API Reference

### `POST /api/report` — CLI Report Ingestion

Accepts both **CLI signal format** (number severity, message) and **web signal format** (string severity, file/line/snippet).

**Request:**
```json
{
  "id": "a1b2c3d4",
  "risk": 85,
  "status": "BLOCKED",
  "summary": "3 critical signals found in skill.js",
  "signals": [
    {
      "rule": "ShellExec",
      "severity": 80,
      "message": "Executes shell commands via child_process"
    }
  ]
}
```

**Signal validation:**
- `severity` can be a number (80/50/30/20) or a string (`critical`/`high`/`medium`/`low`)
- CLI format: `{ rule, severity: number, message }`
- Web format: `{ rule, severity: string, file, line, snippet, explanation }`

**Response `201`:** `{ "id": "a1b2c3d4", "url": "/report/a1b2c3d4" }`

### `GET /api/report/{id}` — Fetch Report

Returns full report JSON (signals in whatever format they were stored). `404` if not found.

### `GET /api/skills` — List Marketplace Skills

Optional params: `?tag=dev` (filter by tag), `?search=code` (fuzzy name/description search).

### `GET /api/alternatives` — Safe Alternatives

Required param: `?tags=dev,security` (comma-separated). Uses Postgres `&&` array overlap. Returns up to 5 verified skills with matching tags (risk < 30), ordered by risk ascending.

### `POST /api/scan-upload` — Browser Upload Scan

Multipart form-data with a `file` field. Max 10MB. Runs the 7-rule scan engine pipeline. Returns `{ id, url }` on success.

---

## CLI Integration

```go
// After CLI scan: POST report to web app
payload := map[string]interface{}{
    "id":      uuid.New().String(),
    "risk":    85,
    "status":  "BLOCKED",
    "summary": "3 critical signals detected",
    "signals": []map[string]interface{}{
        {"rule": "ShellExec", "severity": 80, "message": "Executes shell commands"},
    },
}

body, _ := json.Marshal(payload)
resp, _ := http.Post(
    "https://safeskill.vercel.app/api/report",
    "application/json",
    bytes.NewReader(body),
)

var result map[string]string
json.NewDecoder(resp.Body).Decode(&result)
fmt.Printf("→ View: https://safeskill.vercel.app%s\n", result["url"])
```

**Security:** No authentication. Access via unguessable UUID/hex IDs. Links are shareable but not enumerable.

---

## Project Structure

```
safe-skill-web/
├── app/
│   ├── (main)/                    # Shared route group (PillNav shell)
│   │   ├── layout.tsx             # PillNav + ambient bg
│   │   ├── page.tsx               # Landing page with GradientText heading
│   │   ├── marketplace/           # Skill grid, dropdown filters
│   │   ├── reports/               # Reports list table
│   │   ├── report/[id]/           # Report detail (both signal shapes)
│   │   └── scan/                  # Upload scanner
│   ├── api/
│   │   ├── report/                # POST/GET reports (dual signal shapes)
│   │   ├── skills/                # GET skills list
│   │   ├── alternatives/          # GET alternatives (&& overlap)
│   │   └── scan-upload/           # POST file scan
│   ├── globals.css                # Theme tokens, animations, risk auras
│   ├── layout.tsx                 # Root layout (fonts, metadata, favicon)
│   └── not-found.tsx              # Global 404 page
├── components/
│   ├── PillNav.tsx                # Unified nav bar (logo + icons + hover labels)
│   ├── GradientText.tsx           # Animated gradient heading (Motion)
│   ├── SkillFolderCard.tsx        # Landing page category cards
│   ├── SkillCard.tsx              # Marketplace skill card
│   ├── SkillGrid.tsx              # Responsive card grid
│   ├── SkillModal.tsx             # Skill detail popup (install, risk, source)
│   ├── MarketplaceSearchBar.tsx   # Dropdown tag filter + sort + search
│   ├── ReportHero.tsx             # Big risk score hero
│   ├── ReportDetails.tsx          # Signal cards (handles CLI + Web shapes)
│   ├── ReportActions.tsx          # Copy link + see alternatives
│   ├── ReportList.tsx             # Reports table
│   ├── UploadZone.tsx             # Drag-and-drop file upload
│   ├── ScanProgress.tsx           # 3-phase progress indicator
│   ├── RiskBadge.tsx              # SAFE/WARN/BLOCKED badge
│   └── FilterBar.tsx              # Landing page search (presentational)
├── db/
│   ├── schema/                    # Drizzle table definitions
│   ├── index.ts                   # DB client singleton
│   └── seed.ts                    # 15 curated skills
├── lib/
│   ├── types.ts                   # Shared Signal type (WebSignal | CLISignal)
│   ├── severity.ts                # normalizeSeverity() + isCLISignal()
│   └── scan-engine.ts             # 7-rule scan pipeline (aggregate → boost → classify)
└── public/
    └── safeskill-logo.svg         # Site logo & favicon
```

---

## Features

### Landing Page (`/`)
- Animated gradient heading via `GradientText` (Motion-powered, diagonal sweep)
- 3 category cards with Lucide icon covers (ShieldCheck, Code2, Users) — icons glow on hover
- Responsive 12-column grid linking to filtered marketplace views

### Marketplace (`/marketplace`)
- 15 curated skills in responsive card grid (1 col mobile, 2 tablet, 3 desktop)
- **All dropdown** — filter by tag (click-outside-close, custom scrollbar)
- **Sort dropdown** — 6 options: Default, Risk Low→High, Risk High→Low, SAFE first, WARN first, BLOCKED first
- Fuzzy search across name + description
- Click any card → **SkillModal** with risk bar, copyable install command, source link, "Get Skill" CTA

### Report Viewer (`/reports` + `/report/{id}`)
- Reports table with truncated ID (mono), risk score, RiskBadge, date
- Empty state: "No reports yet — run a scan from the CLI"
- Report detail with large risk score hero (Clash Display 6xl, color-coded)
- Signal cards **handle both CLI and Web formats** via `isCLISignal()` branching
  - CLI signals: shows message text
  - Web signals: shows file:line, code snippet, explanation
- "See Safe Alternatives" links to marketplace with matched tag
- "Copy Report Link" via clipboard API

### Upload Scanner (`/scan`)
- Drag-and-drop or click-to-browse file upload
- Dashed border upload zone with `UploadCloud` icon
- 10MB file size limit with inline error
- 3-phase progress indicator: Uploading → Scanning → Report
- Runs the **7-rule scan pipeline** on the server

### 7-Rule Scan Engine

```
file content → runRules() → aggregate() → applyBoosts() → classify() → summarize()
```

| Rule | Severity | Detects |
|------|----------|---------|
| `ShellExec` | 80 | `child_process.exec()`, `execSync()`, `spawn()` |
| `DynamicEval` | 50 | `eval()`, `new Function()` |
| `PostinstallHook` | 50 | `postinstall` scripts in package.json |
| `Obfuscation` | 30 | Lines with Shannon entropy > 4.5 |
| `NetworkAccess` | 30 | `fetch()`, `axios`, `https.request()` |
| `EnvAccess` | 30 | `process.env`, `dotenv.config()` |
| `ChildProcess` | 20 | `child_process`, `fork()`, `spawnSync()` |

**Pipeline:**
1. **Run rules** — 7 regex/entropy-based detectors against raw content
2. **Aggregate** — deduplicate by `rule:message` composite key, sort by severity desc
3. **Boost** — combo bonuses (Obfuscation + DynamicEval = +30, Network + Env = +25), any severity ≥ 80 = instant max (100), clamp 0-100
4. **Classify** — < 30 SAFE, < 70 WARN, ≥ 70 BLOCKED
5. **Summarize** — counts by severity tier

### Navigation (PillNav)
- Unified floating pill nav at top center
- Logo + brand name + icon links (Home, Marketplace, Reports, Docs)
- SaaS-style hover tooltips: slide-up pill labels on icon hover
- Scan CTA button (accent color)
- Docs link → GitHub repo README

### Design System
- **Dark mode first** — `#0a0a0f` base with layered surface colors
- **Brand gradient** — Electric blue (`#00BFFF`) → Royal blue (`#4169E1`) → Deep blue (`#1E3A8A`)
- **Risk auras** — SAFE (emerald box-shadow), WARN (amber), BLOCKED (red)
- **Animations** — Staggered card reveal (`card-in` keyframes), card hover lift, FAB pulse
- **Textures** — 4-layer radial gradient ambient background + subtle dot-grid overlay
- **Responsive** — 12-column grid across sm/md/lg/xl breakpoints

---

## Skills Marketplace

15 pre-seeded verified skills from real GitHub sources:

| # | Skill | Tags | Risk |
|---|-------|------|------|
| 1 | **Caveman** — Ultra-compressed communication | productivity, communication, efficiency | 5 |
| 2 | **Grill Me** — Architecture & code review drilling | dev, review, architecture, qa | 10 |
| 3 | **Diagnose** — reproduce → isolate → instrument → fix | debugging, dev, workflow | 8 |
| 4 | **TDD** — Red-green-refactor loops | testing, dev, methodology | 5 |
| 5 | **Improve Codebase Architecture** — Clean spaghetti code | architecture, dev, refactoring | 20 |
| 6 | **Zoom Out** — High-level system explanations | architecture, design, system-design | 5 |
| 7 | **Grill With Docs** — Challenge against ADRs | review, docs, architecture | 10 |
| 8 | **Prototype** — Fast throwaway implementations | dev, prototyping, productivity | 15 |
| 9 | **Handoff** — Agent-to-agent context docs | productivity, collaboration, workflow | 8 |
| 10 | **Write A Skill** — Create new agent skills | dev, productivity, tooling | 25 |
| 11 | **To PRD** — Conversations → PRDs | product, docs, planning | 5 |
| 12 | **To Issues** — PRDs → GitHub issues | project-management, dev, github | 10 |
| 13 | **Triage** — Issue triaging workflow | workflow, github, productivity | 5 |
| 14 | **Git Guardrails** — Prevent dangerous git ops | git, devops, safety | 30 |
| 15 | **Setup Pre Commit** — Husky + lint-staged + tests | git, devops, quality | 20 |

---

## License

MIT

---

**Made with [OpenCode](https://github.com/anomalyco/opencode)**
