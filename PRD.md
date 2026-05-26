# Product Requirements Document (PRD)

## Component: SafeSkill Web Platform

---

# 1\. Overview

SafeSkill Web is the **cloud-facing layer** of the SafeSkill ecosystem.

It provides:

- **report visualization**

- **skill marketplace (safe alternatives)**

- **optional upload-based scanning**

- **lightweight intelligence layer over CLI outputs**

It does **NOT perform core security enforcement**.
All trust decisions originate from the Go CLI.

---

# 2\. Core Responsibilities

### Mandatory

- display scan reports via `report_id`

- store and retrieve reports

- provide marketplace (safe skills)

- suggest alternatives based on scan

### Optional (MVP included)

- upload skill/file for scan

- basic server-side scanning (simplified rules)

---

# 3\. Non-Goals

- performing full/deep scanning (CLI responsibility)

- replacing proxy logic

- real-time monitoring

- multi-user auth system

---

# 4\. System Architecture

```text
[ Go CLI ]
   └── POST /api/report → Website Backend

[ Next.js Web App ]
   ├── API Layer (Route Handlers / Server Actions)
   ├── DB (Neon Postgres via Drizzle)
   ├── Report Viewer
   ├── Marketplace
   └── Upload Scanner (optional)
```

---

# 5\. Tech Stack

## Frontend

- Next.js (App Router)

- TypeScript

- React (minimal client usage)

## Backend (within Next.js)

- Route Handlers / Server Actions

- Drizzle ORM

- Neon Postgres

## Hosting

- Vercel

---

# 6\. Performance Design

### Principles

- server-first rendering

- minimal client JS

- no recomputation

- fast read-heavy system

---

## Optimizations

### 1\. Server Components

- report pages rendered server-side

- no client fetching required

---

### 2\. Lightweight API

- CLI sends compact JSON

- no large payloads

---

### 3\. Indexed DB queries

- index on `report_id`

- fast lookup

---

### 4\. Static Marketplace (MVP)

- pre-seeded data

- no heavy queries

---

# 7\. Data Models

---

## Reports Table

```sql
reports:
- id (string, primary key)
- risk (int)
- status (string)
- summary (text)
- signals (jsonb)
- created_at (timestamp)
```

---

## Skills Table (Marketplace)

```sql
skills:
- id
- name
- description
- tags (array/text)
- risk_score
- verified (boolean)
```

---

# 8\. API Design

---

## 8.1 Report Ingestion (CLI → Web)

```http
POST /api/report
```

Payload:

```json
{
  "id": "abc123",
  "risk": 85,
  "status": "BLOCKED",
  "summary": "...",
  "signals": [...]
}
```

---

## 8.2 Report Fetch

```http
GET /api/report/:id
```

---

## 8.3 Upload Scan (Optional)

```http
POST /api/scan-upload
```

- accepts file/repo

- runs simplified scan

- returns report

---

# 9\. Report Flow

---

## CLI → Web

```text
scan → generate report → POST to backend → store → return link
```

---

## User

```text
open /report/:id → fetch → render
```

---

# 10\. Report Viewer

---

## Simple View (above fold)

- Risk score (big)

- Status (SAFE/WARN/BLOCKED)

- 1-line summary

---

## Detailed View

- list of triggered rules

- matched code snippets

- explanation

- breakdown

---

## Actions

- see alternatives

- copy report link

---

# 11\. Marketplace

---

## Purpose

- provide safe alternatives when blocked

- act as discovery layer

---

## Features

- curated skill list

- tag-based filtering

- risk indicators

- “verified” badge

---

## Integration

When blocked:

```text
→ redirect to /alternatives?tag=xyz
```

---

# 12\. Upload Scanner (Optional Feature)

---

## Purpose

- allow non-CLI users to test skills

---

## Behavior

- upload zip or provide repo URL

- backend extracts + scans

- uses simplified rule set

---

## Constraints

- file size limit (e.g. 5–10 MB)

- time limit per scan

- no heavy processing

---

## Important

- not identical to CLI scanner

- positioned as “quick check”

---

# 13\. Security Model

---

## Report Access

- no authentication

- access via unguessable ID (UUID/hex)

Example:

```text
/report/9f3a8c1e7b2d4a6c
```

---

## Assumptions

- ID is sufficiently random

- links are shareable but not enumerable

---

# 14\. UX Principles

- fast load (<1s target)

- minimal clicks

- clear risk visibility

- separation:

    - CLI → decision

    - Web → explanation

---

# 15\. CLI Integration

---

## CLI Output

```text
BLOCKED (Risk: 85)
→ View report: https://safeskill.dev/report/abc123
```

---

## Flow

- CLI sends report

- website stores

- user opens link

---

# 16\. Feature Prioritization

---

## MUST

- report ingestion

- report viewer

- marketplace (static)

- alternatives

---

## SHOULD

- upload scan

---

## AVOID

- auth system

- real-time sync

- complex search

---

# 17\. Future Scope

- authenticated users

- report history

- dynamic marketplace

- reputation scoring

- org dashboards

---

# 18\. Positioning

SafeSkill Web is:

> a lightweight intelligence and discovery layer on top of a local security enforcement engine.

---

# Final Summary

- CLI = enforcement + scanning + truth

- Web = visualization + marketplace + accessibility

- DB = storage only

- System optimized for:

    - speed

    - simplicity

    - demo clarity

    - extensibility

---