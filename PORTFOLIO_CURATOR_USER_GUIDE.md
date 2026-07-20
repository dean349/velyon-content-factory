# Portfolio Scanner & Curator — Full User Guide

This guide covers the **Portfolio Scanner** section of the Velyon Website Content Factory Studio — the part of the app you land in after clicking **⚡ Velyon Website Content Factory → Portfolio Scanner**. It walks through the entire pipeline: **Discover → Curate → Generate**, and every tab inside the project editor.

If you're reading this because you just clicked a discovered project and felt lost — start with **Section 2**.

---

## 1. The Big Picture: Three Modes

The Portfolio Scanner has three modes, selected via the tabs at the top of the panel:

| Mode | What it does |
|---|---|
| **🔍 Discover** | Scans Vercel (and optionally Netlify/GitHub/URL Crawl) for real deployed projects and pulls them in as raw, mostly-empty "discovered items" |
| **✏️ Curate** | Where you open one item at a time and fill in the story — metrics, team, tech stack, testimonials, etc. **This is where you are now.** |
| **⚡ Generate** | Batch-select curated items and kick off case study generation (exports to markdown, NotebookLM, video scripts, etc.) |

**The pipeline is sequential.** An item goes: scanned (empty shell) → curated (you fill it in) → generation-ready (you flip its visibility and it appears in Generate mode).

---

## 2. Two Catalogs, Not One

The Portfolio Scanner manages **two separate catalogs** in a single interface:

| Catalog | What it is | Examples |
|---|---|---|
| **📋 Case Studies** | Work delivered for a client — the proof Velyon can execute | "AI Fraud Detection Pipeline for [Bank]", "RAG Search System for [Legal Firm]" |
| **🚀 Velyon Products** | Proprietary AI tools/systems Velyon built and owns — your own IP, not client work | Velyon Validator Loop, Velyon Inference Proxy, any internal tool |

They live side by side in the Curate list and the editor, but they are **structurally distinct**: case-study-specific tabs (Client Intake, Transformation, Delivery, Approval, Competitive, etc.) only appear when you're editing a Case Study, and the Product Profile tab only appears when you're editing a Velyon Product.

### How to switch between them

In the **editor header** (top of the page, left side), you'll see two toggle buttons:

- **📋 Case Study** (indigo when active)
- **🚀 Velyon Product** (emerald when active)

Click to switch. When you do, the available tabs change automatically — tabs that don't apply to the current catalog type simply disappear. If you were viewing a tab that's no longer visible (e.g. you switch from Product to Case Study while on the Product Profile tab), you'll be dropped back to Overview automatically.

---

## 3. What Just Happened When You Clicked a Project

Vercel's API gave the scanner exactly four things about that project: its name, its live URL, its framework (e.g. React/Vite), and a last-deployed timestamp. **Everything else is empty** — no metrics, no client name, no testimonials, no team, no screenshots. That's normal. That's the whole point of the Curate step: you're the one who turns "a Vercel deployment" into "a case study" or "a product listing."

**New items default to Case Study.** If you clicked a project you know is a Velyon product (not client work), switch the toggle to **🚀 Velyon Product** immediately in the editor header before filling anything in — this ensures you get the right tabs.

---

## 4. Recommended Fill-In Order

The tabs render left-to-right in a fixed order, but that's **not** the best order to fill them in.

### For a Case Study:

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
11. **Redaction** — decide what's public vs. internal (see Section 7)
12. **Template / Exports** — configure output format, if ready to generate
13. **Related Products** — on the Overview tab, pick which Velyon products powered this case study (see Section 6)
14. **Comments** — flag anything you're unsure about, for later follow-up
15. **Save**

### For a Velyon Product:

1. **Overview** — name it, describe what it does (5 min)
2. **Product Profile** — delivery model, maturity stage, use cases, capabilities (10 min)
3. **Tech Stack** — verify/correct what was auto-detected (5 min)
4. **Metrics** — internal performance numbers, if applicable (5 min)
5. **Assets** — screenshots, diagrams (optional, 5 min)
6. **Team** — who built it (5 min)
7. **Methodology / Performance / Containers** — fill in if applicable
8. **Content Hints** — what angle to take if this gets surfaced on the website (5 min)
9. **Redaction** — visibility level (see Section 7)
10. **Export Configs** — output format (if ready)
11. **Related Cases** — on the Overview tab, this auto-populates from any case studies that link to this product (read-only, auto-synced)
12. **Comments** — flag anything, for follow-up
13. **Save**

---

## 5. Tab-by-Tab Reference

### Core Tabs (always visible, for both catalogs)

#### 📄 Overview
The front page of the entry.
- **Tagline** — one-line value prop
- **Status** — production / beta / alpha / deprecated / archived / internal
- **Description** — short summary
- **Long Description** — the full narrative (multi-paragraph)
- **Tech Stack Summary** — quick tag view of frontend/backend/AI/infra/monitoring (full editing in the Tech Stack tab)
- **Industry / Capability / Product Tags** — freeform tags with autocomplete suggestions
- **Methodology Phases** — freeform tag field
- **Related Products / Related Cases** — see Section 6 (Cross-Linking)

#### 🏆 Metrics
Your **hero numbers** — the stats that sell the entry.
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
Who built/delivered it.
- Name, Role, Contribution, Avatar URL, LinkedIn, Email
- **Velyon Team** checkbox — distinguishes your people from client-side stakeholders
- Hours Invested, Period start date

#### 🧱 Tech Stack
Ten categories: frontend, backend, ai, infrastructure, monitoring, database, messaging, auth, testing, cicd.
- Each entry has a **Confidence** level: 🔍 Detected (from the scan) / 🧠 Inferred / ✋ Manual / ✨ Fabricated
- **Source** — where the entry came from (package.json, header, Dockerfile, k8s-manifest, user-input, ai-generated, etc.)
- The Vercel scan auto-populates `frontend` (framework), `infrastructure` (Vercel, Edge Network, Git Integration), `monitoring` (Vercel Analytics, Speed Insights), and `cicd` (Git Integration) — everything else you add manually

#### 🧠 AI Methodology
Houses the **Auto Classify** and **Deep Scan GitHub** buttons — this is the tab most people miss.
- **Auto Classify** — fetches the item's live page (or repo README) and asks the AI to tag it: AI categories (agentic-ai, generative-ai, rag-pipeline, etc.), architecture pattern, autonomy level, models used, and methodologies. Runs through the middleware/Supabase auth flow automatically if the site is protected.
- **Deep Scan GitHub** — for repo-backed items, pulls README + package.json for a richer classification pass
- Below the buttons: the AI classification fields themselves, editable if you want to override what the AI picked
- Confidence score shown per classification — low confidence usually means the scanner couldn't reach the page/repo content and fell back to metadata only

#### 🔒 Redaction — **read Section 7 before skipping this**
Controls how the entry appears publicly. Four levels: Public / Client Approved / Redacted / Internal Only. If you pick **Redacted**, you also set:
- **Archetype** — the public-facing description (e.g. *"Tier-1 Multi-National Investment Bank"* instead of the real client name)
- **Approved Assets** — which asset IDs are cleared for public display
- **Hide Metrics** / **Anonymize Metrics** — comma-separated metric IDs to suppress or blur

#### 🎯 Content Hints
Steers the AI when it generates content.
- **Suggested Format** — technical-deep-dive / business-outcome / transformation-story / product-showcase / architecture-review
- **Target Audiences** — cto, vp-eng, ml-engineer, product-manager, investor, peer
- **Key Technical Insights, Replicable Patterns, Notable Constraints, SEO Keywords, Competitive Differentiators** — all tag fields with suggestions

#### 💬 Comments
An annotation trail on the entry itself.
- Comment types: missing-info, auto-generate, fabricated, needs-review, legal-hold, technical-debt, client-feedback, general
- Use this to leave yourself (or a teammate) notes like *"need real conversion numbers before this goes public"* — resolve them once addressed

---

### 🚀 Product Profile Tab (Velyon Products only)

This tab only appears when `catalogType = '🚀 Velyon Product'`. It captures what makes Velyon's own IP distinct:

- **Delivery Model** (multi-select, checkboxes):
  - Consulting-Led — Velyon team implements it directly for the client
  - Co-Build — built alongside the client's own engineers
  - License — client licenses the product and runs it themselves
  - Managed — Velyon hosts and operates it on the client's behalf

- **Maturity Stage**: concept → alpha → beta → production → sunset

- **Target Use Cases** — tag field (e.g. "Fraud detection", "Real-time inference", "Document retrieval")

- **Key Capabilities** — tag field (e.g. "Sub-100ms latency", "99.9% factual accuracy", "Self-healing pipelines")

- **Internal Only** checkbox — when checked, this product won't appear in the public /products catalog on velyon.io until you uncheck it

> **Note:** Pricing tiers are intentionally not included yet — this is deferred.

---

### Gap Tabs (the remaining deeper sections — Case Study-only tabs shown only for Case Studies)

| Tab | Visible for | Captures | Skip if... |
|---|---|---|---|
| 📋 **Client Intake** | Case Studies only | Problem statement, business objectives, decision context, stakeholder quotes, alternatives considered, why Velyon won, project scope, success criteria | No client-side context yet |
| 💬 **Testimonials** | Both | Text/video/audio testimonials with attribution, role, company, approval status | No testimonials collected yet |
| 🔄 **Transformation** | Case Studies only | Before/after screenshots + narrative + metric comparisons | Nothing changed dramatically, or no before-state evidence exists |
| 📦 **Delivery** | Case Studies only | Budget range, timeline, team size, engagement model (fixed-price/T&M/retainer/equity/pro-bono), start/end dates, total hours, PM | Internal project with no formal engagement terms |
| 🗺️ **Methodology** | Both | Ordered phases: name, description, deliverables, challenges, duration, key decisions | Simple/one-shot project |
| ✅ **Approval** | Case Studies only | NDA status + expiry, sign-off tracking (person/role/date/status), asset clearance status, legal contact | No NDA or approval process involved |
| 📊 **Performance** | Both | Lighthouse scores, Core Web Vitals (LCP/FID/CLS/TTFB), conversion rate, traffic data | No analytics access |
| ⚔️ **Competitive** | Case Studies only | Alternatives evaluated (DIY/competitor/agency/internal-team) with pros/cons/cost/why-not-chosen, differentiators, buyer journey | Client didn't shop around, or you don't know |
| 🐳 **Containers** | Both | Docker images, K8s manifests, Helm charts, deployment environment | Not containerized (most Vercel-scanned SPAs won't need this) |
| 📈 **Post-Launch** | Case Studies only | 30/60/90-day ROI snapshots, NPS score, client satisfaction, renewal status | Too early post-launch to have data |
| 📝 **Template** | Case Studies only | Which case-study template/format to use, target sections, prompt template, target audience, estimated length | Using the default format |
| 📤 **Exports** | Both | Output format selection: notebooklm / cinematic / pdf / cms / social / markdown, plus what to include and brand voice override | Not ready to export yet |

---

## 6. Cross-Linking: Case Studies ↔ Velyon Products

This is the feature that connects your two catalogs so that:
- A **case study** can declare "this was built using Product X" (appears in its Overview tab as a "Related Products" multi-select)
- A **product** automatically shows "this product was used in Case Study A and Case Study B" (appears in its Overview tab as a read-only "Related Cases" list)

### How it works

**Case Study side** (editable):
- In the **Overview** tab of a case study, find the **"🚀 Velyon Products Used In This Case Study"** multi-select
- Click **+ Add** to search through all Velyon Products in your portfolio
- Pick one or more products — each one becomes a tag; click **x** to remove it
- When you **Save**, the system automatically builds the reverse link

**Product side** (auto-derived, read-only):
- In the **Overview** tab of a product, find the **"📋 Case Studies Built With This Product"** section
- This fills itself in automatically — you can't (and don't need to) edit it manually
- It updates every time you save any case study that declares that product in its Related Products

### Why this is one-directional by design

You only ever declare the link from the case study → product direction. The reverse direction (product → case studies) is a **computed derivation**: the system walks through every case study, sees which products it references, and writes the reverse link. This prevents the two sides from getting out of sync and means you only have to do the work once.

---

## 7. Critical Gotcha: Visibility Defaults to "Internal Only"

**Every freshly-scanned item defaults to `internal-only` visibility.** This matters because:

> **Generate mode only shows items where `visibility !== 'internal-only'`.**

If you curate a project fully but forget to change its visibility on the **Redaction** tab, it will **never appear in the Generate mode list** — it'll look like it silently disappeared. This applies equally to both Case Studies and Velyon Products.

**Fix:** Go to the **Redaction** tab → pick **Public**, **Client Approved**, or **Redacted** (anything except Internal Only) before switching to Generate mode.

For Velyon Products specifically: the **Product Profile** tab also has an **"Internal Only"** checkbox — this is a separate gate. Uncheck it when the product is ready to appear on the public velyon.io /products page.

---

## 8. Saving

Click the **Save** button (top-right of the editor, next to the visibility dropdown) to persist your changes. This:
- Writes an entry to the item's `enrichmentHistory` (an audit trail of every edit)
- Re-syncs the bidirectional cross-links between case studies and products (Related Cases on products auto-updates)
- Closes the editor and returns you to the project list
- Everything is stored in your browser's `localStorage` under the key `velyon_portfolio_items` — **it does not currently sync to a server**, so don't clear your browser data without exporting first

If the editor crashes for any reason, you'll see a red error box with a **Try Again** button instead of a blank screen — click Try Again first, and if that doesn't help, Close Editor and reopen the item.

---

## 9. Generate Mode — Batch Content Creation

Once one or more items have a non-internal visibility:

1. Switch to **⚡ Generate**
2. Check the boxes next to every project you want to generate content for
3. Click **Generate N Case Studies**

This calls the synthesis engine, which builds a content prompt per item from everything you filled in — tech stack, metrics, methodology, team, content hints, redaction level — and queues it for the content factory pipeline (markdown, NotebookLM export, video script, etc., depending on your Export Config).

---

## 10. Adding Items Manually (Without Scanning)

Not all Velyon products or case studies will come through the Vercel/GitHub scanner. For anything that isn't scanned — internal tools, CLI utilities, projects on other platforms — use the manual add buttons in the Curate list:

- **+ Case Study** — creates a new, empty case study with `catalogType: 'case-study'` and opens it in the editor
- **+ Velyon Product** — creates a new, empty product with `catalogType: 'product'` and a blank Product Profile, and opens it in the editor

You'll be prompted for a name, then dropped straight into the editor to fill in the rest.

---

## 11. Discovery Sources — What's Actually Connected

| Source | Status |
|---|---|
| **Vercel** | ✅ Fully working — pulls real project data via your Team ID + Access Token |
| **Netlify** | ✅ Fully working — needs Site IDs + token |
| **GitHub** | ✅ Fully working — pulls repos + README + language stats for an org |
| **URL Crawl** | ✅ Working (basic) — crawls any URL you give it |
| **Cloudflare** | ❌ Removed entirely (not used) |

---

## 12. Curate List Filters

At the top of the project list in Curate mode, you'll see three filter buttons:

| Filter | Shows |
|---|---|
| **All** | Everything — both Case Studies and Velyon Products |
| **📋 Case Studies** | Only client work entries |
| **🚀 Velyon Products** | Only Velyon's own proprietary tools/systems |

Each filter shows a count so you can see at a glance how many items are in each catalog. Items also show a small tag badge (📋 or 🚀) next to their name for instant visual identification.

---

## 13. Quick Troubleshooting

| Symptom | Likely cause |
|---|---|
| Item doesn't show up in Generate mode | Visibility is still "Internal Only" — fix it in the Redaction tab |
| Tabs disappeared / wrong tabs showing | You switched the catalogType toggle — the editor hides inapplicable tabs automatically (case-study-only tabs vanish for Velyon Products, and the Product Profile tab only appears for Products) |
| Product Profile tab is missing | Make sure you've switched the editor to **🚀 Velyon Product** using the toggle in the header |
| Related Cases is empty on a Product | No case studies have linked to this product yet — curate a case study, select this product in its "Related Products" picker, and save |
| Editor shows a red error box | A render error was caught — click "Try Again", then "Close Editor" if it persists, and report which tab you were on |
| Metrics/Tech Stack look sparse right after scanning | Normal — Vercel's API only gives framework + infra basics; everything else is manual |
| Changes seem to disappear | Did you click **Save**? Changes only persist to `localStorage` on Save |
| Same project appears twice after re-running Discover | It shouldn't — the scanner merges by ID (`vercel-{projectId}`) and updates in place |

---

*Generated from the actual source of `PortfolioItemEditor.tsx`, `FactoryView.tsx`, `portfolioScanner.ts`, `types/portfolio.ts`, and the gap components — reflects the app as of the dual-catalog + cross-linking architecture (commit c8c697e).*
