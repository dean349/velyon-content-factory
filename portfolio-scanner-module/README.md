# Velyon Portfolio Scanner Module

## Overview
A complete portfolio discovery, curation, and generation system for the Velyon Website Content Factory. Scans deployed projects across Vercel, Netlify, Cloudflare Pages, GitHub (repos + Pages), and arbitrary URLs — then enriches them with structured metadata, metrics, assets, team info, redaction rules, and comments for seamless case study generation via the existing Synthesis Engine.

---

## Files

| File | Purpose |
|------|---------|
| `portfolio-types.ts` | Complete TypeScript types for DiscoveredItem, TechStack, Metrics, Assets, Comments, Redaction, Generation |
| `portfolioScanner.ts` | Core engine: 6 discovery methods, comment system, redaction engine, case study input generator, persistence |
| `PortfolioItemEditor.tsx` | Full-featured curation UI: 8 tabs (Overview, Metrics, Assets, Team, Tech Stack, Redaction, Content Hints, Comments) |
| `INTEGRATION_GUIDE.tsx` | Step-by-step integration into `FactoryView.tsx` with state, handlers, and 5th ingest tab UI |

---

## Discovery Methods

| Method | Source | Auto-Extracts |
|--------|--------|---------------|
| **Vercel** | `/v9/projects` | Framework, git repo, deploy URL, analytics |
| **Netlify** | `/api/v1/sites` | Build config, framework, edge functions, forms |
| **Cloudflare Pages** | `/client/v4/accounts/:id/pages/projects` | Build command, Workers, KV, D1, R2 |
| **GitHub Repos** | `/orgs/:org/repos` | Languages, topics→sourceType, readme, stars, private/public |
| **GitHub Pages** | `repo.has_pages` | Auto `username.github.io/repo` deploy URL |
| **URL Crawl** | Your existing `handleWebCrawl` | Brand, tech stack, screenshots, assets |

---

## Comment System (8 Types)

```typescript
type CommentType = 
  | 'missing-info'      // "Latency metric missing"
  | 'auto-generate'     // "AI: write 3-paragraph case study narrative"
  | 'fabricated'        // "Estimated 40% cost reduction (75% confidence, industry-benchmark)"
  | 'needs-review'      // "Legal to approve client name"
  | 'legal-hold'        // "NDA pending - do not publish"
  | 'technical-debt'    // "Auth module needs refactor"
  | 'client-feedback'   // "Client said 'best dashboard they've seen'"
  | 'general';          // Free-form
```

Each comment tracks: `fieldPath`, `generationPrompt`/`context`, `fabricationConfidence`/`source`, `resolved` workflow.

---

## Redaction Engine

| Visibility | Client Name | Logo | Metrics | Assets | Use Case |
|------------|-------------|------|---------|--------|----------|
| `public` | ✅ | ✅ | ✅ | ✅ | Fully approved |
| `client-approved` | ✅ | ✅ | Selective | Approved only | Client sign-off |
| `redacted` | Archetype only | ❌ | Anonymized | Blurred | NDA / confidential |
| `internal-only` | ❌ | ❌ | ❌ | ❌ | Internal reference |

Archetype examples: "Tier-1 Multi-National Investment Bank", "Fortune-100 Auto Manufacturer", "Major Healthcare Provider".

---

## Quick Start

### 1. Copy Files
```bash
cp -r portfolio-scanner-module/* ../src/
# Or manually copy:
# portfolio-types.ts → src/types/
# portfolioScanner.ts → src/lib/
# PortfolioItemEditor.tsx → src/components/
```

### 2. Add Imports to `FactoryView.tsx`
```typescript
import { PortfolioItemEditor } from './components/PortfolioItemEditor';
import { portfolioScanner, DiscoveredItem, DiscoverySourceConfig } from '../lib/portfolioScanner';
import { Box, Search, Zap, Triangle, Github, Globe, Server, Plus, Eye, Lock, Shield, RefreshCw, GitBranch, CheckCircle2, AlertCircle, Download, UploadCloud, ArrowUpRight, Play, MessageSquare, Star, MoreVertical } from 'lucide-react';
```

### 3. Add State (inside component)
```typescript
const [portfolioItems, setPortfolioItems] = useState<DiscoveredItem[]>(() => {
  try { return JSON.parse(localStorage.getItem('velyon_portfolio_items') || '[]'); } catch { return []; }
});
const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<DiscoveredItem | null>(null);
const [scannerMode, setScannerMode] = useState<'discover' | 'curate' | 'generate'>('discover');
const [scanSources, setScanSources] = useState({ vercel: true, netlify: false, cloudflare: false, github: true, urlCrawl: true });
const [isDiscovering, setIsDiscovering] = useState(false);
const [discoveryLogs, setDiscoveryLogs] = useState<string[]>([]);
const [discoveryConfig, setDiscoveryConfig] = useState<Partial<DiscoverySourceConfig>>({
  vercel: { teamId: '', token: '', includePreviewDeployments: false },
  netlify: { siteIds: [], token: '' },
  cloudflare: { accountId: '', apiToken: '', projectNames: [] },
  github: { org: '', token: '', includePrivate: false, repoFilter: { topics: [], languages: [], pushedAfter: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0] }, pages: { enabledOnly: true } },
  urlCrawl: { urls: ['https://velyon.io'], followRedirects: true, maxDepth: 2, extractAssets: true }
});
const [batchGenerateItems, setBatchGenerateItems] = useState<string[]>([]);
const [batchOutputChannels, setBatchOutputChannels] = useState<Record<string, string[]>>({});
```

### 4. Add Persistence Effect
```typescript
useEffect(() => {
  localStorage.setItem('velyon_portfolio_items', JSON.stringify(portfolioItems));
}, [portfolioItems]);
```

### 5. Add Discovery Handlers
```typescript
const handleRunDiscovery = async () => {
  setIsDiscovering(true);
  setDiscoveryLogs(['[PORTFOLIO] Starting portfolio discovery...']);
  const allItems: DiscoveredItem[] = [];
  
  try {
    if (scanSources.vercel && discoveryConfig.vercel?.teamId && discoveryConfig.vercel?.token) {
      setDiscoveryLogs(p => [...p, '[VERCEL] Fetching projects...']);
      const items = await portfolioScanner.discoverVercelProjects(discoveryConfig.vercel!);
      allItems.push(...items);
      setDiscoveryLogs(p => [...p, `[VERCEL] Discovered ${items.length} projects`]);
    }
    if (scanSources.netlify && discoveryConfig.netlify?.siteIds?.length && discoveryConfig.netlify?.token) {
      setDiscoveryLogs(p => [...p, '[NETLIFY] Fetching sites...']);
      const items = await portfolioScanner.discoverNetlifySites(discoveryConfig.netlify!);
      allItems.push(...items);
      setDiscoveryLogs(p => [...p, `[NETLIFY] Discovered ${items.length} sites`]);
    }
    if (scanSources.cloudflare && discoveryConfig.cloudflare?.accountId && discoveryConfig.cloudflare?.apiToken) {
      setDiscoveryLogs(p => [...p, '[CLOUDFLARE] Fetching pages projects...']);
      const items = await portfolioScanner.discoverCloudflarePages(discoveryConfig.cloudflare!);
      allItems.push(...items);
      setDiscoveryLogs(p => [...p, `[CLOUDFLARE] Discovered ${items.length} projects`]);
    }
    if (scanSources.github && discoveryConfig.github?.org) {
      setDiscoveryLogs(p => [...p, '[GITHUB] Fetching repositories...']);
      const items = await portfolioScanner.discoverGitHubRepos(discoveryConfig.github!);
      allItems.push(...items);
      setDiscoveryLogs(p => [...p, `[GITHUB] Discovered ${items.length} repos`]);
    }
    if (scanSources.urlCrawl && discoveryConfig.urlCrawl?.urls?.length) {
      setDiscoveryLogs(p => [...p, '[URL CRAWL] Crawling URLs...']);
      const items = await portfolioScanner.discoverFromUrls(discoveryConfig.urlCrawl!);
      allItems.push(...items);
      setDiscoveryLogs(p => [...p, `[URL CRAWL] Discovered ${items.length} URLs`]);
    }
    
    // Merge (dedupe by ID)
    const merged = [...portfolioItems];
    for (const item of allItems) {
      const idx = merged.findIndex(m => m.id === item.id);
      if (idx >= 0) merged[idx] = item;
      else merged.push(item);
    }
    setPortfolioItems(merged);
    setDiscoveryLogs(p => [...p, `[PORTFOLIO] Total: ${merged.length}. Complete!`]);
  } catch (e) {
    setDiscoveryLogs(p => [...p, `[ERROR] ${e instanceof Error ? e.message : 'Unknown'}`]);
  } finally {
    setIsDiscovering(false);
  }
};

const handleSavePortfolioItem = (item: DiscoveredItem) => {
  setPortfolioItems(p => {
    const idx = p.findIndex(x => x.id === item.id);
    if (idx >= 0) { const u = [...p]; u[idx] = item; return u; }
    return [...p, item];
  });
  setSelectedPortfolioItem(null);
};

const handleBatchGenerate = () => {
  if (!batchGenerateItems.length) return;
  const inputs = portfolioScanner.generateBatchCaseStudyInputs(batchGenerateItems);
  for (const input of inputs) {
    setSelectedInputs(input.selectedInputs);
    setSelectedTopic(input.topic);
    setSelectedOutputs(input.selectedOutputs);
    setClientName(input.clientName);
    setIndustry(input.industry);
    setMetricValue(input.metricValue);
    handleStartSynthesis();
    await new Promise(r => setTimeout(r, 2000));
  }
  setBatchGenerateItems([]);
};
```

### 6. Add 5th Ingest Tab
In the ingest tab switcher (around line 873), add:
```tsx
{ id: 'portfolio', label: '📦 Portfolio Scanner', icon: <Box size={12} /> }
```

### 7. Add Portfolio Tab Content
Paste the full conditional block from `INTEGRATION_GUIDE.tsx` (lines 200-600+) inside the ingestTab render section.

---

## Usage Flow

### Discover
1. Select sources (Vercel, GitHub, URLs, etc.)
2. Enter credentials (team IDs, tokens)
3. Click **"Run Portfolio Discovery"**
4. Watch live logs as projects are discovered

### Curate
1. Click a project in the sidebar
2. Edit across 8 tabs:
   - **Overview** — Identity, description, tags, methodology
   - **Metrics** — Add hero metrics, set verified/estimated
   - **Assets** — Upload screenshots, diagrams, videos
   - **Team** — Add members, roles, contributions
   - **Tech Stack** — Per-category entries with confidence/source
   - **Redaction** — Set visibility, archetype, rules
   - **Content Hints** — Format, insights, SEO, differentiators
   - **Comments** — Flag missing, request AI gen, mark fabricated
3. Click **Save** — persists to localStorage

### Generate
1. Switch to **Generate** mode
2. Check projects to batch-generate (only non-internal)
3. Select output channels per project
4. Click **"Generate N Case Studies via Synthesis Engine"**
5. Feeds your existing `handleStartSynthesis()` pipeline

---

## Environment Variables Needed

```env
# Vercel
VITE_VERCEL_TEAM_ID=your-team-id
VITE_VERCEL_TOKEN=your-access-token

# Netlify
VITE_NETLIFY_TOKEN=your-token

# Cloudflare
VITE_CLOUDFLARE_ACCOUNT_ID=your-account-id
VITE_CLOUDFLARE_API_TOKEN=your-token

# GitHub
VITE_GITHUB_TOKEN=your-token  # Optional for private repos
```

---

## Data Schema Highlights

```typescript
// Core item
interface DiscoveredItem {
  id: string;
  sourceType: 'webapp' | 'ai-tool' | 'system' | 'product' | 'extension' | 'api' | 'library' | 'pipeline';
  discoveryMethod: 'vercel' | 'netlify' | 'cloudflare' | 'github-repo' | 'github-pages' | 'url-crawl' | 'docker' | 'kubernetes' | 'manual-entry';
  discoveryStatus: 'pending' | 'discovered' | 'enriched' | 'curated' | 'redacted' | 'generation-ready' | 'archived';
  visibility: 'public' | 'client-approved' | 'redacted' | 'internal-only';
  techStack: { frontend: StackEntry[]; backend: StackEntry[]; ai: StackEntry[]; ... };
  metrics: CaseStudyMetric[];
  assets: PortfolioAsset[];
  clientContext: { isNamed: boolean; archetype?: string; ndaStatus: 'approved' | 'pending' | 'denied' | 'internal' | 'unknown'; redactionRules?: {...} };
  team: TeamMember[];
  comments: DiscoveryComment[];
  enrichmentHistory: EnrichmentEntry[];
}

// Metric with estimation tracking
interface CaseStudyMetric {
  label: string; value: string; context: string;
  category: 'speed' | 'cost' | 'accuracy' | 'adoption' | 'revenue' | 'efficiency' | 'latency' | 'throughput' | 'quality' | 'custom';
  isHero: boolean; verified: boolean;
  estimationMethod?: 'industry-benchmark' | 'similar-project' | 'extrapolation' | 'client-report' | 'educated-guess';
  confidenceInterval?: { min: string; max: string };
}
```

---

## Integration with Synthesis Engine

The `generateCaseStudyInput(item)` returns:
```typescript
{
  topic: 'casestudy',
  clientName: 'Confidential Client' | 'Actual Name',
  industry: 'FinTech',
  metricValue: '87% reduction in inference latency',
  selectedInputs: ['testimonials', 'file', 'image'],
  selectedOutputs: ['uicomponent', 'md', 'video', 'notebook'],
  customContext: `PROJECT: ...\nTECHNICAL STACK: ...\nKEY METRICS: ...\nREDACTION LEVEL: redacted\nUSE ARCHETYPE: Tier-1 Investment Bank`
}
```

This maps directly to your existing synthesis engine inputs.

---

## Next Steps

1. **Test Vercel discovery** with your actual team/projects
2. **Curate 3-5 flagship projects** manually to validate schema
3. **Test redaction flow** with one named + one redacted client
4. **Batch generate** and verify synthesis output quality
5. **Add Docker/K8s discovery** if you have internal services
6. **Connect to CMS** for production deployment (replace localStorage)

---

## Support

- All types in `portfolio-types.ts` — extend as needed
- Scanner methods return `Promise<DiscoveredItem[]>` — easy to compose
- Comment system integrates with your existing log/notification system
- Redaction rules are enforced at generation time via `customContext`