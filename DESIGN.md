# SafeSkill — Design System & Landing Page Spec

> **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Lucide React  
> **Theme:** Dark mode first · 12-column responsive grid · Clash Display + Satoshi

---

## 1. Design Philosophy

SafeSkill is a **security intelligence layer** — not a dev tool dashboard, not a marketing site. The aesthetic should feel like a command center with taste: dark, precise, with just enough color to feel alive. Think _surgical brutalism meets soft neon glow_ — confident, direct, zero fluff.

The reference image (BagSync) gives us the **structural DNA**: floating card clusters, a persistent bottom nav, a centered search bar, and a top identity bar. We adapt this shell into SafeSkill's world — swapping playfulness for authority, pastels for deep gradient tones, product imagery for skill metadata.

**One unforgettable detail:** Every risk state (SAFE / WARN / BLOCKED) has its own gradient aura that bleeds into the card background — not just a badge, but a mood. The whole card _feels_ the risk.

---

## 2. Color System

All colors are defined as CSS custom properties and mapped to Tailwind via `tailwind.config.ts`.

### Base Palette

```css
:root {
  /* Backgrounds — layered depth */
  --bg-base:        #0a0a0f;   /* near-black, slightly blue-tinted */
  --bg-surface:     #111118;   /* card backgrounds */
  --bg-elevated:    #16161f;   /* modals, dropdowns */
  --bg-overlay:     #1c1c28;   /* hover states, subtle separation */

  /* Borders */
  --border-subtle:  rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong:  rgba(255,255,255,0.18);

  /* Text */
  --text-primary:   #f0f0f5;
  --text-secondary: #9090a8;
  --text-muted:     #55556a;

  /* Brand gradient — teal-to-violet, used sparingly */
  --brand-from:     #2dd4bf;   /* teal-400 */
  --brand-mid:      #818cf8;   /* indigo-400 */
  --brand-to:       #a78bfa;   /* violet-400 */

  /* Risk states */
  --risk-safe:      #34d399;   /* emerald-400 */
  --risk-safe-glow: rgba(52, 211, 153, 0.12);
  --risk-warn:      #fbbf24;   /* amber-400 */
  --risk-warn-glow: rgba(251, 191, 36, 0.12);
  --risk-blocked:   #f87171;   /* red-400 */
  --risk-blocked-glow: rgba(248, 113, 113, 0.12);

  /* Accent — for CTAs, active states */
  --accent:         #2dd4bf;
  --accent-hover:   #5eead4;
}
```

### Gradient Recipes

```css
/* Page ambient background — subtle gradient mesh */
.bg-ambient {
  background:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(45,212,191,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(167,139,250,0.07) 0%, transparent 60%),
    var(--bg-base);
}

/* Brand text gradient */
.text-brand-gradient {
  background: linear-gradient(135deg, var(--brand-from), var(--brand-mid), var(--brand-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Card accent line (top border on hover) */
.card-glow-top {
  border-top: 1px solid transparent;
  background-image: linear-gradient(var(--bg-surface), var(--bg-surface)),
    linear-gradient(90deg, var(--brand-from), var(--brand-to));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

/* Folder card — risk aura variants */
.folder-safe    { box-shadow: 0 0 0 1px var(--risk-safe-glow), inset 0 1px 0 rgba(52,211,153,0.15); }
.folder-warn    { box-shadow: 0 0 0 1px var(--risk-warn-glow), inset 0 1px 0 rgba(251,191,36,0.15); }
.folder-blocked { box-shadow: 0 0 0 1px var(--risk-blocked-glow), inset 0 1px 0 rgba(248,113,113,0.15); }
```

### Tailwind Config Extension

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      base:     '#0a0a0f',
      surface:  '#111118',
      elevated: '#16161f',
      overlay:  '#1c1c28',
      brand: {
        teal:   '#2dd4bf',
        indigo: '#818cf8',
        violet: '#a78bfa',
      },
      risk: {
        safe:    '#34d399',
        warn:    '#fbbf24',
        blocked: '#f87171',
      },
    },
  },
}
```

---

## 3. Typography

### Fonts

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings | **Clash Display** | Medium (500) | TTF to be added to `/public/fonts/` |
| Body / UI text | **Satoshi** | Regular (400) | TTF to be added to `/public/fonts/` |
| Mono (code, IDs) | **JetBrains Mono** | Regular | CDN or local |

### Font Loading (Next.js)

```ts
// app/layout.tsx — local font setup
import localFont from 'next/font/local'

const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Medium.ttf',
  variable: '--font-clash',
  display: 'swap',
})

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Regular.ttf',
  variable: '--font-satoshi',
  display: 'swap',
})
```

Place both TTF files in `/public/fonts/` when ready.

### Type Scale

```css
/* Tailwind class → usage */
text-5xl  font-clash   /* Page title: "Explore Skills" */
text-4xl  font-clash   /* Section heading */
text-2xl  font-clash   /* Card title */
text-lg   font-satoshi /* Card subtitle, descriptions */
text-sm   font-satoshi /* Labels, meta, tags */
text-xs   font-satoshi /* Captions, timestamps, muted info */
```

### Rules
- Clash Display is **only** for headings and titles — never body copy
- Line height on display text: `leading-tight` (1.15)
- Letter spacing on display: `tracking-tight` (-0.01em)
- Body line height: `leading-relaxed` (1.625)
- Never use bold weight on Satoshi in body — use size and color contrast instead

---

## 4. Grid System

### 12-Column Layout

```tsx
// Wrapper — used on every page
<div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-12 gap-4 lg:gap-6">
    {/* content */}
  </div>
</div>
```

### Breakpoints (Tailwind defaults)

| Name | px | Usage |
|---|---|---|
| `sm` | 640px | Stack nav icons, single column cards |
| `md` | 768px | 2-col card grid |
| `lg` | 1024px | 3-col card grid, full layout |
| `xl` | 1280px | Max-width container active |

### Column Spans — Common Patterns

```
Full width:          col-span-12
Two-thirds:          col-span-12 md:col-span-8
One-third:           col-span-12 md:col-span-4
Three equal (cards): col-span-12 md:col-span-6 lg:col-span-4
Search bar:          col-span-12 md:col-span-6 (centered)
```

---

## 5. Spacing & Shape

```
Base unit: 4px (Tailwind default)

Component padding:    p-4 (16px) — cards, inputs
Section gaps:         gap-4 / gap-6
Page vertical rhythm: py-6 top bar, py-4 sections
Border radius:        rounded-2xl cards, rounded-xl inputs, rounded-full pills/buttons
```

---

## 6. Component Library

### 6.1 Top Bar

Mirrors the reference image structure. Pinned to top.

```
[Logo + Wordmark]        [Title + Subtitle — center]        [Icon buttons]
```

```tsx
<header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
  {/* Left: Logo */}
  <div className="flex items-center gap-2">
    <ShieldCheckIcon className="w-6 h-6 text-brand-teal" />
    <span className="font-clash text-lg text-text-primary">SafeSkill</span>
  </div>

  {/* Center: Title */}
  <div className="text-center">
    <h1 className="font-clash text-2xl text-text-primary">Explore Skills</h1>
    <p className="font-satoshi text-sm text-text-secondary">
      Discover, scan, and deploy safe MCP skills
    </p>
  </div>

  {/* Right: Actions */}
  <div className="flex items-center gap-2">
    <button className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors">
      <LayoutGridIcon className="w-5 h-5 text-text-secondary" />
    </button>
    <button className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors">
      <ListIcon className="w-5 h-5 text-text-secondary" />
    </button>
  </div>
</header>
```

---

### 6.2 Filter Bar + Search

Below the top bar. Full-width row.

```
[Filter Dropdown]    [Search Input — center, wider]    [Sort Dropdown]
```

```tsx
<div className="flex items-center gap-3 px-6 py-3">
  {/* Filter */}
  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary">
    All <ChevronDownIcon className="w-4 h-4" />
  </button>

  {/* Search — takes remaining space */}
  <div className="flex-1 relative">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
    <input
      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-overlay border border-white/[0.08]
                 font-satoshi text-sm text-text-primary placeholder:text-text-muted
                 focus:outline-none focus:border-brand-teal/40 transition-colors"
      placeholder="Search skills..."
    />
  </div>

  {/* Sort */}
  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-overlay border border-white/[0.08] font-satoshi text-sm text-text-secondary">
    Sort By <ChevronDownIcon className="w-4 h-4" />
  </button>
</div>
```

---

### 6.3 Skill Folder Card

This is the **core component** — adapts the stacked clipboard look from the reference. Three cards per row on desktop.

**Card anatomy:**
```
┌─────────────────────────────────┐
│  [Image placeholder — top peek] │  ← skill category image (add later)
│─────────────────────────────────│
│  [Tag row: verified badge, risk] │
│                                 │
│  Title (Clash Display, 2xl)     │
│  Description (Satoshi, sm)      │
│                                 │
│  [Risk Score]        [→ button] │
└─────────────────────────────────┘
```

```tsx
// Risk aura applied to wrapper:
// safe → emerald glow · warn → amber glow · blocked → red glow

<div className={`
  relative rounded-2xl bg-surface border border-white/[0.08] p-5
  transition-all duration-300 hover:border-white/[0.16] hover:translate-y-[-2px]
  ${riskClass}  // folder-safe | folder-warn | folder-blocked
`}>
  {/* Image slot — top overflow */}
  <div className="h-28 rounded-xl bg-overlay mb-4 overflow-hidden">
    {/* Placeholder: "Image to be added" */}
    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-satoshi">
      Cover image · coming soon
    </div>
  </div>

  {/* Badges */}
  <div className="flex items-center gap-2 mb-3">
    {verified && (
      <span className="px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-satoshi">
        ✓ Verified
      </span>
    )}
    <span className={`px-2 py-0.5 rounded-full text-xs font-satoshi ${riskBadge}`}>
      {status}
    </span>
  </div>

  {/* Title */}
  <h2 className="font-clash text-2xl text-text-primary leading-tight mb-2">
    {title}
  </h2>

  {/* Description */}
  <p className="font-satoshi text-sm text-text-secondary leading-relaxed mb-4">
    {description}
  </p>

  {/* Footer */}
  <div className="flex items-center justify-between">
    <span className="font-satoshi text-sm text-text-muted">
      Risk: <span className={riskTextClass}>{score}</span>
    </span>
    <button className="p-2 rounded-xl bg-overlay hover:bg-elevated transition-colors">
      <ArrowRightIcon className="w-4 h-4 text-text-secondary" />
    </button>
  </div>
</div>
```

**Three default card categories (landing page):**

| Card | Title | Description |
|---|---|---|
| 1 | Top Safe Skills | The 10 highest-verified, lowest-risk skills in the marketplace |
| 2 | Web & Dev Skills | Safe skills for web development, APIs, and tooling |
| 3 | Community Picks | Most scanned and community-approved skills this week |

> 📸 **Note:** Each card has an image slot at the top (`h-28` placeholder). Images to be generated and dropped in later — reference the slot via `skill.coverImage` prop.

---

### 6.4 Bottom Navigation Bar

Persistent. Sits flush at the bottom. Mirrors reference layout with center FAB.

```
[Home]  [Marketplace]  [Reports]  [Scan]       [+]       [Settings]  [→ Logout placeholder]
         Left cluster                     Center FAB        Right cluster
```

```tsx
<nav className="
  fixed bottom-0 left-0 right-0 z-50
  flex items-center justify-between
  px-8 py-3
  bg-surface/90 backdrop-blur-xl
  border-t border-white/[0.06]
">
  {/* Left cluster */}
  <div className="flex items-center gap-1">
    <NavBtn icon={<HomeIcon />} label="Home" href="/" />
    <NavBtn icon={<ShoppingBagIcon />} label="Marketplace" href="/marketplace" />
    <NavBtn icon={<FileTextIcon />} label="Reports" href="/reports" />
    <NavBtn icon={<UploadIcon />} label="Scan" href="/scan" />
  </div>

  {/* Center FAB — add skill */}
  <button className="
    w-11 h-11 rounded-full
    bg-gradient-to-br from-brand-teal to-brand-violet
    flex items-center justify-center
    shadow-lg shadow-brand-teal/20
    hover:scale-105 active:scale-95 transition-transform
  ">
    <PlusIcon className="w-5 h-5 text-white" />
  </button>

  {/* Right cluster */}
  <div className="flex items-center gap-1">
    <NavBtn icon={<SettingsIcon />} label="Settings" href="/settings" />
    {/* Auth placeholder — disabled, no auth in MVP */}
    <div className="p-2 rounded-xl opacity-30 cursor-not-allowed">
      <LogOutIcon className="w-5 h-5 text-text-muted" />
    </div>
  </div>
</nav>

{/* NavBtn helper */}
// Each icon button: p-2.5, rounded-xl, hover:bg-overlay, active state via bg-elevated + text-brand-teal
```

**Nav icons (all Lucide React):**

| Button | Icon | Route |
|---|---|---|
| Home | `HomeIcon` | `/` |
| Marketplace | `ShoppingBagIcon` | `/marketplace` |
| Reports | `FileTextIcon` | `/reports` |
| Scan | `UploadCloudIcon` | `/scan` |
| + FAB | `PlusIcon` | action / modal |
| Settings | `SettingsIcon` | `/settings` |

> No auth/logout button in MVP. The logout slot is visually present but `opacity-30 cursor-not-allowed` — acts as a future placeholder without cluttering.

---

### 6.5 Risk Badge Component

Used inside cards, report pages, and the marketplace.

```tsx
// Variants
const riskVariants = {
  SAFE:    'bg-risk-safe/10 text-risk-safe border border-risk-safe/20',
  WARN:    'bg-risk-warn/10 text-risk-warn border border-risk-warn/20',
  BLOCKED: 'bg-risk-blocked/10 text-risk-blocked border border-risk-blocked/20',
}

<span className={`px-2.5 py-1 rounded-full text-xs font-satoshi ${riskVariants[status]}`}>
  {status}
</span>
```

---

## 7. Page Layout — Landing (Home)

Full layout assembly for `/` (the skills explorer / home screen).

```
┌──────────────────────────────────────────────────────┐
│  TOP BAR: Logo · "Explore Skills" · Grid/List icons  │  h-16
├──────────────────────────────────────────────────────┤
│  FILTER BAR: [All ▾]  [🔍 Search skills...]  [Sort▾] │  h-14
├──────────────────────────────────────────────────────┤
│                                                      │
│  CARD GRID — 3 columns (lg), 2 (md), 1 (sm)          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Top Safe   │  │ Web & Dev  │  │ Community  │     │
│  │ Skills     │  │ Skills     │  │ Picks      │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
├──────────────────────────────────────────────────────┤
│  BOTTOM NAV: [Home][Market][Reports][Scan] [+] [⚙]  │  h-16
└──────────────────────────────────────────────────────┘
```

```tsx
// app/(home)/page.tsx structure

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ambient pb-20">
      <TopBar />
      <FilterBar />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard category="top-safe" />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard category="web-dev" />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <SkillFolderCard category="community" />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
```

---

## 8. Interaction & Motion

Keep it subtle — this is a tool, not a marketing page.

```css
/* Global transitions */
* { transition-property: colors, opacity, transform, border-color, box-shadow; transition-duration: 150ms; }

/* Card hover */
.skill-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

/* FAB pulse (subtle, once) */
@keyframes fab-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.3); }
  50%       { box-shadow: 0 0 0 8px rgba(45,212,191,0); }
}
.fab-btn { animation: fab-pulse 2.5s ease-in-out 1; }

/* Page load — staggered card reveal */
.skill-card { opacity: 0; animation: card-in 0.4s ease forwards; }
.skill-card:nth-child(1) { animation-delay: 0.05s; }
.skill-card:nth-child(2) { animation-delay: 0.12s; }
.skill-card:nth-child(3) { animation-delay: 0.19s; }

@keyframes card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 9. Other Pages — Design Continuity

All pages follow the same shell: `TopBar + content + BottomNav`. Page-specific notes:

### `/marketplace`
- Same card grid structure
- Tags as horizontal pill filters (scrollable row on mobile)
- Verified badge prominent
- Risk score shown as a mini bar, not just text

### `/reports`
- Table or list view (not cards)
- Each row: report ID (mono), risk badge, status, date, → arrow
- Empty state: "No reports yet — run a scan from the CLI"

### `/report/:id`
- Full-width layout, no grid
- Hero section: large risk score number (Clash Display, 6xl) + status badge
- Below: triggered rules list, code snippet blocks (mono font, dark bg)
- Actions: "See Safe Alternatives →" | "Copy Report Link"

### `/scan`
- Upload zone: dashed border, `UploadCloudIcon`, drag-and-drop
- File size note: "Max 10MB · Quick scan only (not identical to CLI)"
- Progress state after upload

---

## 10. Asset Checklist

```
/public/fonts/
  ClashDisplay-Medium.ttf       ← add when ready
  Satoshi-Regular.ttf           ← add when ready

/public/images/skills/
  top-safe-cover.{jpg|webp}     ← generate & add (card 1)
  web-dev-cover.{jpg|webp}      ← generate & add (card 2)
  community-cover.{jpg|webp}    ← generate & add (card 3)
```

> 📸 All three `SkillFolderCard` components include an `h-28` image slot at the top. Drop generated images here when ready. Slot renders a placeholder until then.

---

## 11. Color Theme Options (Pick One)

Three gradient direction options to choose from — all dark mode, all non-generic:

### Option A — Teal × Violet _(recommended)_
Teal anchors the brand (safe = teal), violet adds depth. Feels like a modern CLI tool with visual taste.
`#2dd4bf → #818cf8 → #a78bfa`

### Option B — Cyan × Rose
More aggressive contrast. Good if you want the blocked/risk states to feel more dramatic.
`#22d3ee → #e879f9 → #fb7185`

### Option C — Lime × Blue (terminal energy)
If you want it to feel closer to a hacker tool. Lime pops hard on dark.
`#a3e635 → #38bdf8 → #818cf8`

> **Recommendation:** Option A. It's the most SaaS-legible — `teal = safe`, `violet = intelligence layer`, `risk states` get their own distinct colors that don't clash with brand.

---

*This document covers the landing page in full and the shell for all other pages. Update with copy, images, and final font files as they become available.*
