# Portfolio Scanner & Curator — Full User Guide

This guide covers the **Portfolio Scanner** section of the Velyon Website Content Factory Studio — the part of the app you land in after clicking **⚡ Velyon Website Content Factory → Portfolio Scanner**. It walks through the entire pipeline: **Discover → Curate → Generate**, and every one of the 20 tabs inside the project editor.

If you're reading this because you just clicked a discovered project (like "Velyon Projects Dashboard") and felt lost — start with **Section 2**.

---

## 1. The Big Picture: Three Modes

The Portfolio Scanner has three modes, selected via the tabs at the top of the panel:

| Mode | What it does |
|---|---|
| **🔍 Discover** | Scans Vercel (and optionally Netlify/GitHub/URL Crawl) for real projects and pulls them in as raw, mostly-empty "discovered items" |
| **✏️ Curate** | Where you open one discovered item at a time and fill in the story — metrics, testimonials, team, tech stack, etc. **This is where you are now.** |
| **⚡ Generate** | Batch-select curated items and kick off case study generation (exports to markdown, NotebookLM, video scripts, etc.) |

**The pipeline is sequential.** An item goes: scanned (empty shell) → curated (you fill it in) → generation-ready (you flip its visibility and it appears in Generate mode).

---

## 2. What Just Happened When You Clicked "Velyon Projects Dashboard"

Vercel's API gave the scanner exactly four things about that project: its name, its live URL, its framework (e.g. React/Vite), and a last-deployed timestamp. **Everything else is empty** — no metrics, no client name, no testimonials, no team, no screenshots. That's normal. That's the whole point of the Curate step: you're the one who turns "a Vercel deployment" into "a case study."

The editor that opened has **20 tabs** across the top. They fall into two groups:

- **8 Core tabs** — always present, cover the basics (Overview, Metrics, Assets, Team, Tech Stack, Redaction, Content Hints, Comments)
- **12 Gap tabs** — deeper, optional-but-recommended sections added specifically to support rich, defensible case studies (Client Intake, Testimonials, Transformation, Delivery, Methodology, Approval, Performance, Competitive, Containers, Post-Launch, Template, Exports)

**None of the 12 gap tabs are required.** They exist so nothing gets lost when you *do* have the information. Fill in what applies; skip what doesn't.

---

## 3. Recommended Fill-In Order

The tabs render left-to-right in a fixed order, but that's **not** the best order to fill them in. Here's the sequence that actually makes sense:

1. **Overview** — name it, tag it, describe it (5 min)
2. **Client Intake** — capture the "why" before you forget it (10 min)
3. **Tech Stack** — verify/correct what was auto-detected (5 min)
4. **Metrics** — your hero numbers (10 min)
5. **Transformation** — before/after evidence (optional, 10 min)
6. **Testimonials** — quotes, if you have any (optional, 5 min)
7. **Assets** — screenshots, diagrams (10 min)
8. **Team** — who worked on it (5 min)
9. **Delivery / Methodology / Approval / Performance / Competitive / Containers / Post-Launch** — fill in whichever apply, skip the rest
10. **Content Hints** — tell the AI generator what angle to take (5 min)
11. **Redaction** — **critical, see Section 5** — decide what's public vs. internal
12. **Template / Exports** — configure output format, if ready to generate
13. **Comments** — flag anything you're unsure about, for later follow-up
14. **Save**

---

## 4. Tab-by-Tab Reference

### Core Tabs

#### 📄 Overview
The front page of the case study.
- **Tagline** — one-line value prop
- **Status** — production / beta / alpha / deprecated / archived / internal
- **Description** — short summary
- **Long Description** — the full case-study narrative (multi-paragraph)
- **Tech Stack Summary** — quick tag view of frontend/backend/AI/infra/monitoring (full editing happens in the Tech Stack tab)
- **Industry / Capability / Product Tags** — freeform tags with autocomplete suggestions
- **Methodology Phases, Related Products, Related Cases** — cross-linking tags

#### 🏆 Metrics
Your **hero numbers** — the stats that sell the case study.
- Each metric has: Label, Value, Context, Category (speed/cost/accuracy/adoption/revenue/efficiency/latency/throughput/quality/custom)
- **Estimation Method** — if a number isn't measured, say so honestly (industry-benchmark / similar-project / extrapolation / client-report / educated-guess)
- **Confidence Interval** (Min/Max) — for estimated numbers
- **★ Hero toggle** — mark your single best metric as the headline stat
- **✓ Verified toggle** — mark whether the number is confirmed or still provisional
- Click the comment icon on any metric to flag it as missing/unverified for later follow-up

#### 🖼️ Assets
Screenshots, diagrams, videos.
- Type: screenshot / architecture-diagram / video-demo / logo / ui-component / data-viz / testimonial-video / code-snippet / wireframe / flowchart / dashboard-capture
- URL, Alt Text, Caption
- **Redacted Version URL** — a blurred/anonymized variant to use when visibility = Redacted
- ★ Hero toggle for the lead image

#### 👥 Team
Who worked on it.
- Name, Role, Contribution, Avatar URL, LinkedIn, Email
- **Velyon Team** checkbox — distinguishes your people from client-side stakeholders
- Hours Invested, Period start date

#### 🧱 Tech Stack
Ten categories: frontend, backend, ai, infrastructure, monitoring, database, messaging, auth, testing, cicd.
- Each entry has a **Confidence** level: 🔍 Detected (from the scan) / 🧠 Inferred / ✋ Manual / ✨ Fabricated — be honest here, this feeds directly into how defensible your case study is
- **Source** — where the entry came from (package.json, header, Dockerfile, k8s-manifest, user-input, ai-generated, etc.)
- The Vercel scan auto-populates `frontend` (framework), `infrastructure` (Vercel, Edge Network, Git Integration), `monitoring` (Vercel Analytics, Speed Insights), and `cicd` (Git Integration) — everything else you add manually

#### 🔒 Redaction — **read Section 5 before skipping this**
Controls how the project appears publicly. Four levels: Public / Client Approved / Redacted / Internal Only. If you pick **Redacted**, you also set:
- **Archetype** — the public-facing description (e.g. *"Tier-1 Multi-National Investment Bank"* instead of the real client name)
- **Approved Assets** — which asset IDs are cleared for public display
- **Hide Metrics** / **Anonymize Metrics** — comma-separated metric IDs to suppress or blur

#### 🎯 Content Hints
Steers the AI when it generates the case study.
- **Suggested Format** — technical-deep-dive / business-outcome / transformation-story / product-showcase / architecture-review
- **Target Audiences** — cto, vp-eng, ml-engineer, product-manager, investor, peer
- **Key Technical Insights, Replicable Patterns, Notable Constraints, SEO Keywords, Competitive Differentiators** — all tag fields with suggestions

#### 💬 Comments
An annotation trail on the item itself.
- Comment types: missing-info, auto-generate, fabricated, needs-review, legal-hold, technical-debt, client-feedback, general
- Use this to leave yourself (or a teammate) notes like *"need real conversion numbers before this goes public"* — resolve them once addressed

---

### Gap Tabs (the 12 deeper sections)

| Tab | Captures | Skip if... |
|---|---|---|
| 📋 **Client Intake** | Problem statement, business objectives, decision context, stakeholder quotes, alternatives considered, why Velyon won, project scope, success criteria | You don't have client-side context yet |
| 💬 **Testimonials** | Text/video/audio testimonials with attribution, role, company, approval status | No testimonials collected yet |
| 🔄 **Transformation** | Before/after screenshots + narrative + metric comparisons (before → after → improvement, with units) | Nothing changed dramatically, or no before-state evidence exists |
| 📦 **Delivery** | Budget range, timeline, team size, engagement model (fixed-price/T&M/retainer/equity/pro-bono), start/end dates, total hours, PM | Internal project with no formal engagement terms |
| 🗺️ **Methodology** | Ordered phases: name, description, deliverables, challenges, duration, key decisions | Simple/one-shot project |
| ✅ **Approval** | NDA status + expiry, sign-off tracking (person/role/date/status), asset clearance status, legal contact | No NDA or approval process involved |
| 📊 **Performance** | Lighthouse scores, Core Web Vitals (LCP/FID/CLS/TTFB), conversion rate, traffic data | No analytics access |
| ⚔️ **Competitive** | Alternatives evaluated (DIY/competitor/agency/internal-team) with pros/cons/cost/why-not-chosen, differentiators, buyer journey | Client didn't shop around, or you don't know |
| 🐳 **Containers** | Docker images, K8s manifests, Helm charts, deployment environment | Not containerized (most Vercel-scanned SPAs won't need this) |
| 📈 **Post-Launch** | 30/60/90-day ROI snapshots, NPS score, client satisfaction, renewal status | Too early post-launch to have data |
| 📝 **Template** | Which case-study template/format to use, target sections, prompt template, target audience, estimated length | Using the default format |
| 📤 **Exports** | Output format selection: notebooklm / cinematic / pdf / cms / social / markdown, plus what to include (metrics/testimonials/methodology) and brand voice override | Not ready to export yet |

---

## 5. Critical Gotcha: Visibility Defaults to "Internal Only"

**Every freshly-scanned item defaults to `internal-only` visibility.** This matters because:

> **Generate mode only shows items where `visibility !== 'internal-only'`.**

If you curate a project fully but forget to change its visibility on the **Redaction** tab, it will **never appear in the Generate mode list** — it'll look like it silently disappeared. This is the #1 "why isn't my project showing up" trap.

**Fix:** Go to the **Redaction** tab → pick **Public**, **Client Approved**, or **Redacted** (anything except Internal Only) before switching to Generate mode.

---

## 6. Saving

Click the **Save** button (top-right of the editor, next to the visibility dropdown) to persist your changes. This:
- Writes an entry to the item's `enrichmentHistory` (an audit trail of every edit)
- Closes the editor and returns you to the project list
- Everything is stored in your browser's `localStorage` under the key `velyon_portfolio_items` — **it does not currently sync to a server**, so don't clear your browser data without exporting first

If the editor crashes for any reason, you'll now see a red error box with a **Try Again** button instead of a blank screen (this was just added) — click Try Again first, and if that doesn't help, Close Editor and reopen the item.

---

## 7. Generate Mode — Batch Case Study Creation

Once one or more items have a non-internal visibility:

1. Switch to **⚡ Generate**
2. Check the boxes next to every project you want to generate a case study for
3. Click **Generate N Case Studies**

This calls `generateBatchCaseStudyInputs()`, which builds a synthesis prompt per item from everything you filled in — tech stack, metrics, methodology, team, content hints, redaction level — and queues it for the content factory pipeline (markdown, NotebookLM export, video script, etc., depending on your Export Config).

---

## 8. Discovery Sources — What's Actually Connected

| Source | Status |
|---|---|
| **Vercel** | ✅ Fully working — pulls real project data via your Team ID + Access Token |
| **Netlify** | ✅ Fully working — needs Site IDs + token |
| **GitHub** | ✅ Fully working — pulls repos + README + language stats for an org |
| **URL Crawl** | ✅ Working (basic) — crawls any URL you give it |
| **Cloudflare** | ❌ Removed entirely (per your request — not used) |

---

## 9. Quick Troubleshooting

| Symptom | Likely cause |
|---|---|
| Project doesn't show up in Generate mode | Visibility is still "Internal Only" — go fix it in Redaction tab |
| Editor shows a red error box instead of your data | A render error was caught — click "Try Again", then "Close Editor" if it persists, and report which tab you were on |
| Metrics/Tech Stack look sparse right after scanning | Normal — Vercel's API only gives framework + infra basics; everything else is manual |
| Changes seem to disappear | Did you click **Save**? Changes only persist to `localStorage` on Save |
| Same project appears twice after re-running Discover | It shouldn't — the scanner merges by ID (`vercel-{projectId}`) and updates in place |

---

*Generated from the actual source of `PortfolioItemEditor.tsx`, `FactoryView.tsx`, `portfolioScanner.ts`, and `types/portfolio.ts` — reflects the app as of the error-boundary + Cloudflare-removal fix.*
