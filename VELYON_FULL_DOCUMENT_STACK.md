# Velyon Website Content Factory: Full Document Stack (Tier 1 — Product & Engineering)

This master document bundles the comprehensive Product Requirements Document (PRD), Technical Architecture Document (TAD), Design Specification (DESIGN.md), and API Specification for the internal alignment of the Velyon engineering team.

---

## SECTION 1: Product Requirements Document (PRD)

### 1.1 Document Control & Stakeholders
*   **Title**: Velyon Website Content Factory (PRD-001)
*   **Version**: v1.1.0-Release
*   **Status**: Approved / Ready for Sprint Planning
*   **Authors**: Product Management & System Engineering (Velyon Core)
*   **Target Audience**: Developers, Core Designers, Marketing Leads, Platform Engineers

---

### 1.2 Product Vision & Problem Statement
High-growth startups and mature enterprise operations face an exponential challenge when launching brand-compliant marketing campaigns. Raw design inputs (design systems, brand books, testimonial footage, feature checklists) remain scattered across disparate formats.
*   **The Problem**: AI content generators often introduce "AI slop"—non-deterministic color variables, erratic layout structures, and poor text hierarchy—rendering assets useless to engineering teams.
*   **The Solution**: The **Velyon Website Content Factory** provides a deterministic visual sandbox. It ingests real-world brand specs (via headless scrapers, file-drops, or third-party registries like **21st.dev**) and synthesizes them into organized, component-ready schemas, interactive sitemaps, responsive layout wireframes, and standardized presentation structures (Google NotebookLM slides, cinematic video prompts) backed by solid Supabase and LocalStorage persistence layers.

---

### 1.3 Key Features & Functional Requirements

#### 1.3.1 Module A: Multi-Modal Ingestion Deck (The Intake Engine)
*   **FR-1.1**: The platform must support dragging & dropping `.pdf` (design system rules), `.md` (text guidelines), and major video formats (MP4, MOV, WebM testimonials) via `react-dropzone`.
*   **FR-1.2**: Ingested items must upload directly to organized folder directories on Supabase Storage (`velyon-assets/pdfs/`, `velyon-assets/markdown/`, `velyon-assets/videos/`) when active credentials exist.
*   **FR-1.3**: Fall back gracefully to a robust client-side `localStorage` cache simulator when Supabase API keys are not detected, ensuring 100% stable sandbox usability.
*   **FR-1.4**: Perform real-time parsing of `.md` markdown specs upon drop, immediately updating visual system variables (primary/secondary color lists, font selections, voice profiles).

#### 1.3.2 Module B: Interactive Sitemap Navigation Matrix
*   **FR-2.1**: Dynamically render a visual, hierarchical node-and-connector tree representing 9 distinct corporate template routes using inline interactive SVGs.
*   **FR-2.2**: Node lines must adapt fluidly during container resize operations via reactive observer monitoring.
*   **FR-2.3**: Integrate an Inspector Drawer sidebar displaying active node data upon cursor clicks:
    *   *Route Slug*: (e.g. `/products/ingestion`, `/about/brand`)
    *   *Conversion Metric & Objective*: Specific visitor actions required.
    *   *SEO Target keywords*: Pre-calculated metadata.
    *   *Required Modules*: List of specific page widgets to load.

#### 1.3.3 Module C: Responsive Layout Wireframe Grid
*   **FR-3.1**: Render modular wireframe layout skeletons mapping distinct corporate layouts (Homepage, Product Suite, Case Studies, and Sandbox Requests).
*   **FR-3.2**: Feature a high-fidelity desktop-to-mobile slider that switches viewport dimensions dynamically (desktop fluid grid vs. tight mobile 44px-target stack).
*   **FR-3.3**: Interactive section cards within the canvas (Hero, Bento Grid, Sandbox, Testimonial, and CTA Banner) must update a sidebar displaying precise Framer Motion spring transition variables and CSS classes.

#### 1.3.4 Module D: Structured Output Exporters (Google NotebookLM & Cinematic Reels)
*   **FR-4.1**: Generate structured JSON payloads specifically curated to seed **Google NotebookLM** slide decks, complete with slide indices, focus metrics, bullet arrays, and detailed speaker scripts.
*   **FR-4.2**: Generate structured timeline payloads for cinematic generation (Higgsfield, Sora, Runway Gen-3), mapping multi-shot sequences, visual prompt directives, and ElevenLabs voice-track script overlays.
*   **FR-4.3**: Provide single-click copy buttons with instant browser clipboard integration.

---

### 1.4 Success Metrics (KPIs)
*   **Developer Onboarding Time**: Reduction in campaign-to-code iteration time from days to under 15 minutes.
*   **Branding Accuracy (Strict Mode)**: 100% adherence to active style rules, validated using computed AST lint passes.
*   **Lighthouse Target Score**: Performance $\ge 90$, Accessibility $\ge 95$, SEO Structure $\ge 95$.

---
---

## SECTION 2: Technical Architecture Document (TAD)

### 2.1 Technology Stack & Architectural Decision Records (ADR)

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Modern rendering, fast local compilation speed, robust ecosystem support. |
| **Styling** | Tailwind CSS v4 | Class-based rapid styling. Standardized design tokens. |
| **Icons** | Lucide React | Unified vector icon standard. Prevents asset clutter. |
| **State** | React useState + Context | Highly responsive localized state. Prevents unnecessary full-tree re-renders. |
| **File Intake** | React Dropzone | Native HTML5 Drag and Drop wrappers with responsive feedback loops. |
| **Backend DB** | Supabase JS client | Lazy-initialized multi-modal cloud asset storage and sync hooks. |
| **Persistence** | LocalStorage Simulator | Full sandbox usability, retaining data even during browser tab close events. |

---

### 2.2 Core Component Map & Data Lifecycle

```
  [User Action: Drop File]
             │
             ▼
   [SupabaseDropzone.tsx] ───(Real Keys Detected?)───► Yes ──► [Upload to Supabase Storage]
             │                                                         │
             No                                                        ▼
             │                                              [Get Public Asset URL]
             ▼                                                         │
   [Write to LocalStorage]                                             │
             │                                                         │
             ▼                                                         ▼
   [Sync Component State] ◄────────────────────────────────────────────┘
             │
             ├─► [Update Ingestion Logs]
             ├─► [Parse Markdown Spec / Set Colors]
             └─► [Refresh Asset Drawer Grid]
```

### 2.3 Supabase Storage Folder Hierarchy & Policies
For real cloud integration, the platform structures the `velyon-assets` storage bucket as follows:
*   `velyon-assets/pdfs/`: Contains brand system rules.
*   `velyon-assets/markdown/`: Holds design specs, voice tokens, and checklist markdown files.
*   `velyon-assets/videos/`: Houses video testimonial materials.

#### Recommended PostgreSQL Row Level Security (RLS) Rules for Storage:
```sql
-- Allow read access to all public assets in 'velyon-assets'
create policy "Allow public read access"
  on storage.objects for select
  using ( bucket_id = 'velyon-assets' );

-- Allow authenticated uploads to 'velyon-assets'
create policy "Allow authenticated uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'velyon-assets' 
    and auth.role() = 'authenticated'
  );
```

---
---

## SECTION 3: Design Specification (DESIGN.md)

### 3.1 Design System Tokens & Global CSS Pairings
The visual language of Velyon is clean, elegant, and high-contrast, adopting a **Deep Cosmic Slate** aesthetic.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --color-cosmic-black: #030308;
  --color-cosmic-card: #090911;
  --color-rose-neon: #f43f5e;
  --color-indigo-neon: #6366f1;
}
```

### 3.2 Visual Component Hierarchy
*   **Desktop Canvas Limit**: Max-width is locked at `max-w-7xl mx-auto px-4` to prevent visual elements from blowing out on wide ultra-screens.
*   **Component Modularity**:
    *   `App.tsx`: Orchestrates active view states, global telemetry metrics, and high-level routing.
    *   `FactoryView.tsx`: Synthesizes content pipelines. Houses layout controls, sitemaps, wireframes, and exporter sections.
    *   `SupabaseDropzone.tsx`: Completely isolated drop container, asset state list, and Supabase integration logic.

---
---

## SECTION 4: API & Data Contracts Specification (API_SPEC.md)

This section maps out key client-to-server data models.

### 4.1 Ingested Asset Data Contract
```typescript
interface IngestedAsset {
  id: string;          // Format: 'sim-UUID' or 'sup-UUID'
  name: string;        // Raw uploaded filename
  size: number;        // Byte size of target asset
  type: string;        // 'pdf' | 'md' | 'video'
  category: string;    // 'pdfs' | 'markdown' | 'videos'
  uploadedAt: string;  // ISO timestamp
  url: string;         // Public URL or mock preview hash
  isRealSupabase: boolean;
}
```

### 4.2 Google NotebookLM Slides Payload Contract
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "NotebookLMSlidesPayload",
  "type": "object",
  "properties": {
    "notebook_metadata": {
      "type": "object",
      "properties": {
        "source": { "type": "string" },
        "client": { "type": "string" },
        "industry": { "type": "string" },
        "conversion_metric": { "type": "string" },
        "system_stability": { "type": "string" }
      },
      "required": ["source", "client", "industry"]
    },
    "slides_structure": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "slide": { "type": "integer" },
          "title": { "type": "string" },
          "focus": { "type": "string" },
          "bullets": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["slide", "title", "focus", "bullets"]
      }
    }
  },
  "required": ["notebook_metadata", "slides_structure"]
}
```

### 4.3 Generative Video Script Contract
```json
{
  "video_metadata": {
    "source": "Velyon Cinematic Reel Generator",
    "client": "Velyon Ventures",
    "ratio": "16:9",
    "fps": 24,
    "motion_magnitude": "65%"
  },
  "timeline_shots": [
    {
      "shot": 1,
      "timecode": "0:00 - 0:02",
      "type": "Establishing Wide Shot",
      "visual_prompt": "Drone in futuristic skyscraper in night. Neon rose (#f43f5e) and indigo (#6366f1) details.",
      "audio_subtitles": "Welcome to the future of digital asset synthesis."
    }
  ]
}
```

---
---

## SECTION 5: Additional Engineering Recommendations

### 5.1 MCP Integration Schema for 21st.dev / Developer IDEs
To enable seamless asset synchronization directly into active developer workspaces, Velyon recommends implementing a custom **Model Context Protocol (MCP)** server.

#### Schema Concept:
```typescript
interface McpComponentResponse {
  componentName: string;
  targetPath: string; // e.g., 'src/components/VelyonHeader.tsx'
  brandRulesApplied: {
    primaryColor: string;
    secondaryColor: string;
    fontDisplay: string;
  };
  componentSource: string; // Raw React/Tailwind code ready to write to disk
}
```
This enables agents running locally in tools like Cursor or VS Code to pull computed designs from the `velyon-assets` storage bucket and write files directly into the client repository on demand.

### 5.2 CI/CD Deployment Strategy
*   **Static Asset Build**: Configured via Vite static build pipeline, writing output index structures directly into `/dist`.
*   **Cloud Ingress Containerization**: Wrap the runtime using lightweight scratch images and deploy directly into automated serverless pools (such as Google Cloud Run), listening strictly on Port `3000`.

---
*End of internal product alignment specification document.*
