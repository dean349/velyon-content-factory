# Velyon Website Content Factory: Comprehensive Product Requirements Document (PRD) & Architecture Implementation Specification

## Document Overview
This document serves as the absolute source of truth, technical blueprint, and execution roadmap for the **Velyon Website Content Factory**. It details a next-generation full-stack architecture, cognitive ingestion stack, custom AI synthesis engine, and a 21st-century premium frontend strategy designed to turn raw corporate source materials into production-ready sitemaps, wireframes, code assets, and cinematic reels.

---

## 1. Executive Summary & Vision
The **Velyon Website Content Factory** is an enterprise-grade web application workspace designed to automate, optimize, and synthesize brand-compliant digital assets. By scraping live target sites, parsing markdown design specs, and ingesting Framer-Motion component curves, Velyon converts fragmented developer and marketing inputs into perfectly structured website components.

### Core Value Pillars
1. **Zero-Lag Ingestion**: Cognitive headless scrapers extract computed CSS variables, typography pairings, interactive DOM boundaries, and corporate voice tones in real time.
2. **Deterministic Branding**: Built-in enforcement of design system rules, eliminating marketing "AI slop" or alignment drift.
3. **Multimodal Cohesion**: Concurrent output of interactive visual sitemaps, responsive structural wireframes, case-study analytics grids, and cinematic media reels in a single unified pipeline.
4. **Agentic Ready**: Out-of-the-box support for MCP (Model Context Protocol) servers to bridge local developer IDEs with premium design registries like **21st.dev**.

---

## 2. Comprehensive System Architecture & Data Flow

```
              ┌────────────────────────────────────────┐
              │     Ingestion & Concierge Inputs       │
              │  (URL Scrape, Markdown Spec, Registry) │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │     Server-Sent Events (SSE) Pipe      │
              │      (Progress Stages 1, 2, 3, 4)      │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │      Multimodal AI Synthesis Hub       │
              │ (Coordinates Sitemaps & Wireframes)    │
              └───────────────────┬────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Visual Sitemap  │      │ Page Wireframes │      │ Analytics Grids │
│ Hierarchy (SVG) │      │ (Desktop/Mobile)│      │ & Media Assets  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### The Architectural Secret: Server-Sent Events (SSE) Pipeline
Traditional long-running generation jobs suffer from HTTP timeout restrictions or require aggressive, resource-heavy polling. Velyon solves this by leveraging **Server-Sent Events (SSE)** (`text/event-stream`) to establish a unidirectional, persistent, low-latency communication pipe from server to browser.

#### The 4-Stage Synthesis Lifecycle:
* **Stage 1: Ingestion Pipeline Alignment (`/api/synth/ingest`)**
  * Spawns headless browser frames, mounts secure document parsers, and merges crawled tokens.
  * *Server Output*: Semantic vector maps, color tokens (`#f43f5e`, `#6366f1`), and voice profile logs.
* **Stage 2: Structural DNA Mapping (`/api/synth/dna`)**
  * Runs token-matching compilers. Enforces layout constraints (e.g., standard container padding `p-6` or dynamic grid heights).
  * *Server Output*: JSON tree representation of sitemaps and parent-child navigation matrices.
* **Stage 3: High-Fidelity Asset Synthesis (`/api/synth/assets`)**
  * Pulls media parameters and triggers parallel worker threads to package SVG vectors, ambient noise loops, and markdown copy files.
  * *Server Output*: Compiled visual CSS declarations and Framer Motion spring physical curves.
* **Stage 4: Code Generation & Quality Gate (`/api/synth/validate`)**
  * Triggers TypeScript AST parser to validate component imports and styles against standard syntax rules.
  * *Server Output*: Completed status flag, AST compile scores, and deployment zip configurations.

---

## 3. High-Fidelity Module Specifications

### Module A: Concierge Interview & Dynamic Ingest Deck
Designed as the primary intake system for raw customer assets, this module supports three clean modes of operation:
1. **🌐 Headless Website Crawler**:
   * Accepts target URL inputs (default: `https://velyon.io`).
   * Orchestrates dynamic DOM scanning. Extracts inline Tailwind classes, computes active color matrices, parses typographic weights, and flags interactive drawer navigation paths.
   * Outputs raw branding guidelines and brand voice summaries (e.g., "Highly technical, enterprise-grade, transparent. Focus on hard pipeline metrics").
2. **📄 Design System MD Parser**:
   * Features a Drag & Drop zone supporting file system `.md` drops.
   * Compiles design parameters directly into active styling pipelines. Enforces primary/secondary/success variables.
3. **🔌 Registry Importer**:
   * Direct paste-bin supporting raw React/Tailwind component copy from Framer Motion, 21st.dev, or motionsites.ai.
   * Instantly extracts physics parameters (such as `stiffness: 210` and `damping: 20`) and translates them into uniform motion specs.

### Module B: Interactive Sitemap Navigation Matrix
Rather than static bulleted lists, Velyon renders website blueprints using visual hierarchical node layouts.
* **Graphical Canvas**: Rendered via premium inline SVG connectors representing parent-child route structures from `/` through sub-directories `/products/ingestion` and `/about/brand`.
* **State-Controlled Inspector Drawer**: Displays detailed metadata upon selecting individual nodes:
  * *Route Slug*: (e.g. `/products/ingestion`).
  * *Conversion Objective*: Direct action triggers to capture file uploads.
  * *SEO Target*: Key terms and indexing priorities.
  * *Active Modules*: Component recommendations (e.g., "3D Ambient Neon Header").

### Module C: Responsive Component Wireframe Grid
A complete page layout blueprinting tool mapping 9 distinct enterprise templates across desktop and mobile form factors.
* **Responsive Mode Toggle**: Smoothly transitions layout cards from a fluid three-column desktop matrix to a single-column stacked mobile viewport (enforcing standard touch targets of $\ge 44\text{px}$).
* **Active Section Focus Specs**: Selecting structural blocks (Hero Section, Bento Matrix, Sandbox, Testimonial Slider, or CTA Banner) updates the inspector sidebar with code-level variables:
  * *Framer Motion Spring Specs*: Explicit curve configurations.
  * *CSS Class Declarations*: Exact Tailwind classes used for the blocks.
  * *Responsive Grid Layouts*: Columns and padding variables (`grid-cols-1 md:grid-cols-3 gap-4`).

---

## 4. Full-Stack Developer Shopping List & Core Technologies

### Framework & Build Orchestration
* **Frontend Library**: `React 18.3` with `TypeScript` (Strict Mode).
* **Build System**: `Vite` for local dev server, paired with `esbuild` for CJS backend compilation.
* **Server Runtime**: `Node.js` (LTS 20+) executing Express with TSX wrappers.
* **Build Command**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`

### Styling & Visual Polish
* **Utility CSS**: `Tailwind CSS v4` using `@import "tailwindcss"` imports.
* **Icons**: `lucide-react` (Strict standard). No custom inline SVG blobs allowed.
* **Core Font Pairing**:
  * *Display (Headings)*: **Space Grotesk** (Tech-forward, tight tracking `-0.05em`).
  * *Body Copy*: **Inter** (Excellent readability at high density).
  * *Data & Telemetry*: **JetBrains Mono** (Technical, high legibility).

### Backend Integrations & Persistence
* **Primary Database**: `Firebase Firestore` for active user configuration storage, draft preservation, and state synchronization.
* **Authentication**: `Firebase Auth` securing client team logins.
* **Real-time Pipeline**: Native `Server-Sent Events (SSE)` for unidirectional stream logs.
* **Hosting Container**: `Cloud Run` container ingress listening on port `3000` with host binded to `0.0.0.0`.

---

## 5. Monetization, Dashboard & 21st-Century Frontend Strategy

### Monetization Model (The Money Engine)
The platform features a three-tiered business model designed to scale with enterprise ingestion volume:
1. **Developer Sandbox (Free)**: Access to 2 basic templates, standard manual ingestion, local storage caching.
2. **Growth Content Suite ($149/mo)**: Unlimited URL scanning, full 9-page visual sitemaps, active custom markdown styling injections, SVG downloads.
3. **Enterprise Ingestion Core ($799/mo)**: Real-time SSE pipelines, dedicated MCP server connections, automated 21st.dev registry synchronizations, and white-labeled PDF presentation exports.

### Premium Frontend Registry Strategy
A modern visual product cannot exist in isolation. By integrating directly with **21st.dev**, Velyon maps parsed branding color codes and typography rules directly to verified, accessible React-Tailwind components. Using custom prompts, the model injects corporate colors (`Rose Neon` or `Deep Indigo`) directly into shadcn-compatible components, compiling clean layouts instantly for the user's project folder.

---

## 6. Comprehensive 90-Day Implementation Timeline

### Phase 1: Ingestion & Core Foundation (Days 1–30)
* Set up standard full-stack Express + Vite boilerplate. Bind port `3000` and deploy to Cloud Run.
* Provision Firebase Firestore collection schemas for `blueprints` and `scraped_metrics`.
* Implement headless crawler routes using sandbox-friendly selectors. Ensure URL scraping captures computed CSS styles and font hierarchies accurately.

### Phase 2: SSE Pipeline & Interactive Mapping (Days 31–60)
* Build the multi-stage Server-Sent Events (SSE) generator. Support stage callbacks from raw file parses down to output packaging.
* Implement the Interactive Sitemap Node Canvas using fluid SVG scaling. Wire node triggers to the Inspector drawer state.
* Construct the Page Wireframe Grid component, complete with responsive Desktop/Mobile toggles and element highlight borders.

### Phase 3: Premium Integrations & Launch (Days 61–90)
* Connect custom MCP servers and wire component injection mappings from the 21st.dev component marketplace.
* Establish secure Stripe billing webhook routes for subscription tier upgrades.
* Run full TypeScript compilation audits, and execute thorough Lighthouse audit passes targeting performance, accessibility ($\ge 95$), and SEO structure.

---

*This document is compiled, approved, and integrated directly into the Velyon Website Content Factory codebase configuration rules.*
