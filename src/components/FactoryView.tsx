import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  FileCode, 
  Video, 
  Image, 
  MessageSquare, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  RefreshCw, 
  Sliders, 
  Download, 
  Laptop, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  HelpCircle, 
  Server, 
  Terminal, 
  ExternalLink,
  ClipboardList,
  Check,
  Calendar,
  Shield,
  Award,
  PlusCircle,
  Globe,
  UploadCloud,
  Code,
  Key,
  Database
} from 'lucide-react';

import { SupabaseDropzone } from './SupabaseDropzone';
import { PortfolioItemEditor } from './PortfolioItemEditor';
import { ErrorBoundary } from './ErrorBoundary';
import { portfolioScanner } from '../lib/portfolioScanner';
import { CredentialsModal, AppCredentials } from './CredentialsModal';
import { DiscoveredItem, DiscoverySourceConfig } from '../types/portfolio';
import { Box, Search, Zap, Edit3, Triangle, GitBranch, ArrowUpRight, Puzzle } from 'lucide-react';

// Live sample data of premium 21st.dev elements to inject
const STYLED_COMPONENTS_BLUEPRINTS = {
  casestudy: {
    title: "Velyon Analytics Core Canvas",
    tech: "Next.js + Tailwind + Framer Motion (21st.dev #7421)",
    desc: "A premium high-fidelity glassmorphic dashboard showcasing live conversion rates, localized stream logs, and key value propositions parsed directly from the client's raw testimonials.",
    badge: "Dashboard"
  },
  websiteassets: {
    title: "Midnight Aurora Landing Hero",
    tech: "React + Radix UI Primitives (21st.dev #1043)",
    desc: "An editorial-grade launching page hero featuring dynamic ambient lighting, staggered text animations, responsive CTA wrappers, and customized feature grids.",
    badge: "Hero Section"
  },
  pitchdeck: {
    title: "Interactive Investor Bento Grid",
    tech: "Tailwind CSS + Tremor Charting (21st.dev #8851)",
    desc: "An interactive, scannable pitch grid representing quarterly outcomes, financial indicators, and strategic vectors formatted for immediate venture capitalist briefings.",
    badge: "Bento Layout"
  },
  marketingreel: {
    title: "HeyGen Spokesperson Media Canvas",
    tech: "HeyGen Avatar + ElevenLabs Voice + Higgsfield Motion",
    desc: "A high-fidelity video canvas compiling physics-based scene camera sweeps with custom digital spokesperson narration overlayed with voiceover profiles.",
    badge: "Media Player"
  },
  sitemap: {
    title: "Interactive Sitemap Navigation Matrix",
    tech: "Visual SVG Connected Nodes (21st.dev #5591)",
    desc: "A fully visual hierarchical layout tree mapping user flow paths, page slugs, SEO search priorities, and cross-linked conversion triggers.",
    badge: "Sitemap Plan"
  },
  wireframe: {
    title: "High-Fidelity Component Wireframe Grid",
    tech: "Framer-Motion Skeleton Engine (21st.dev #3312)",
    desc: "Responsive wireframe layout blueprints for 9 distinct corporate template pages, showing component placement grids, responsive stack hierarchies, and section CTAs.",
    badge: "Wireframe Grid"
  }
};

// Velyon.io Blueprint Checklist Specification
interface BlueprintSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  badge: string;
  infoNeeded: { id: string; text: string; placeholder: string; label: string }[];
  assetsNeeded: { id: string; text: string }[];
  recommendations: string[];
}

const VELYON_BLUEPRINT_SECTIONS: BlueprintSection[] = [
  {
    id: "site_architecture",
    title: "4.1 Site Architecture & Sitemap",
    icon: Layers,
    description: "Formulate target segments, core conversion metrics, navigation schemas, and outline wireframes for the first 9 distinct sitemap pages.",
    badge: "Sitemap & Structure",
    infoNeeded: [
      { id: "sa_target_segments", text: "Defined target segments for the hero section", placeholder: "e.g., Enterprise ML Teams, Venture Funds, B2B SaaS...", label: "Target Segments" },
      { id: "sa_core_kpis", text: "3 finalized core KPIs to highlight on the homepage", placeholder: "e.g., 10x Velocity Gain, 99.8% Accuracy, -84% Manual Cost...", label: "Core Homepage KPIs" },
      { id: "sa_methodology_name", text: "Finalized name for your methodology (e.g., 'Velocity Framework')", placeholder: "e.g., Velocity Loop, Velyon Nexus Core...", label: "Proprietary Methodology Name" },
      { id: "sa_initial_products", text: "List of 3-5 initial proprietary products", placeholder: "e.g., Ingestion Canvas, Multi-Modal Synth, MCP Gateway...", label: "Flagship Proprietary Products" },
      { id: "sa_target_industries", text: "List of target industries and core capabilities/service lines", placeholder: "e.g., FinTech Risk, BioTech Analytics, Legal AI Discovery...", label: "Target Industries & Core Capabilities" }
    ],
    assetsNeeded: [
      { id: "sa_slugs_map", text: "Finalized URL slugs and routing map (/products, /approach, /work, etc.)" },
      { id: "sa_wireframes_distinct", text: "Wireframes for 9 distinct page templates (Homepage, Approach, Product, Work/Gallery, Capability, Industry, Insights, Team, About/Contact)" }
    ],
    recommendations: [
      "Set up your Content Management System (CMS) with dynamic collections early (e.g., making sure /products/ and /work/ can pull from a shared database)."
    ]
  },
  {
    id: "case_study_template",
    title: "4.2 Case Study Deep-Dive Template",
    icon: FileText,
    description: "Establish the 'Gold Standard' template for case studies detailing technical constraints, concrete before vs. after metrics, and team rosters.",
    badge: "Case Study Standard",
    infoNeeded: [
      { id: "cs_client_background", text: "Client background context, technical constraints, and previous failed attempts", placeholder: "e.g., Pre-existing LLM hallucinated, complex relational queries timed out...", label: "Client Constraints & Background" },
      { id: "cs_build_details", text: "Detailed lists of what was built (data pipelines, prompt architecture, MLOps)", placeholder: "e.g., Built an automated streaming pipeline with SSE, Pinecone index, and Claude Claude 3.5 Sonnet proxy...", label: "Built Infrastructure & Architectures" },
      { id: "cs_hard_metrics", text: "Hard metrics for the 'Before vs. After' impact", placeholder: "e.g., Reduced synthesis speed from 18 hours to 4 minutes, saved $14k monthly API billing...", label: "Before vs. After hard metrics" },
      { id: "cs_client_quotes", text: "Quotes from the client and the exact team roster that worked on the project", placeholder: "e.g., 'Velyon revolutionized our core operations' - CTO at Velyon. Team: Dean (ML Architect), Sam (Product)...", label: "Client Quotes & Team Roster" }
    ],
    assetsNeeded: [
      { id: "cs_client_logos", text: "High-resolution client logos (if approved) or custom industry icons" },
      { id: "cs_video_testimonials", text: "60-second video testimonials or demo walkthroughs (MP4 or YouTube/Vimeo embeds)" },
      { id: "cs_svg_diagrams", text: "Interactive, modal-expandable SVG architecture diagrams" },
      { id: "cs_team_headshots", text: "Professional headshots for the Velyon team members involved" }
    ],
    recommendations: [
      "Create a standardized 'Case Study Intake Form' for your engineering/project teams to fill out at the end of every engagement so marketing doesn't have to hunt for this data."
    ]
  },
  {
    id: "nda_strategy",
    title: "4.3 Named vs. Redacted Client Strategy",
    icon: Shield,
    description: "Outline clean NDA boundaries and approved taxonomy for redacted clients to maintain professional credibility without breaching NDAs.",
    badge: "NDA Compliance",
    infoNeeded: [
      { id: "nd_legal_boundaries", text: "Clear legal status/NDA boundaries for every single past project", placeholder: "e.g., Financial Client A: Redacted. Logistics Client B: Approved for logo usage...", label: "NDA Boundaries per Project" },
      { id: "nd_taxonomy_redacted", text: "Approved taxonomy for redacted clients (e.g., 'Top-5 Global Bank' vs. just 'Bank')", placeholder: "e.g., 'A Tier-1 Multi-National Investment Bank' or 'Fortune-100 Auto Manufacturer'...", label: "Redacted Taxonomy Standards" }
    ],
    assetsNeeded: [
      { id: "nd_visual_badges", text: "Visual badges for the UI: 'Published with Permission' (Gold), 'Client Referenced' (Silver), 'Confidential Engagement' (Lock), and 'Internal Innovation' (Lab)" },
      { id: "nd_industry_icons", text: "A cohesive set of generic industry icons to replace logos on redacted cards" }
    ],
    recommendations: [
      "Maintain an internal, strictly updated spreadsheet tracking the approved public disclosure level of every client to prevent accidental NDA breaches."
    ]
  },
  {
    id: "product_presentation",
    title: "4.4 Proprietary Product/Asset Presentation",
    icon: Sparkles,
    description: "Highlight proprietary code modules, MVP sandboxes, delivery models, and bidirectional CMS tags linking assets to specific case studies.",
    badge: "Product Showcase",
    infoNeeded: [
      { id: "pp_product_taglines", text: "Names, taglines, and one-sentence pitches for 3-5 Minimum Viable Products", placeholder: "e.g., Velyon Pipeline Engine: Automated multi-modal synthesis for raw testimonials.", label: "MVP Names, Taglines & Pitches" },
      { id: "pp_delivery_models", text: "Defined delivery models (e.g., Consulting-Led) and technical specs (Cloud, SLA, Compliance)", placeholder: "e.g., Hybrid Consulting + SaaS license, SOC2 compliant cloud infrastructure, SLA of 99.9%...", label: "Technical Specs & Delivery Models" }
    ],
    assetsNeeded: [
      { id: "pp_logos_lockups", text: "Product logos or stylized high-tech vector lockups" },
      { id: "pp_sandbox_flows", text: "Sandbox environments or automated interactive demo flows to link to the 'Request Sandbox Access' CTA" }
    ],
    recommendations: [
      "Implement bidirectional CMS tagging. Every time you publish a case study, tag the product used; make sure the product page automatically pulls in those tagged case studies."
    ]
  },
  {
    id: "copywriting_patterns",
    title: "4.5 Copywriting & Messaging Patterns",
    icon: MessageSquare,
    description: "Align copywriters with ML engineers to publish technically transparent articles emphasizing hallucination rates, pipeline logic, and metrics over fluff.",
    badge: "Messaging Guidelines",
    infoNeeded: [
      { id: "cp_impressive_metrics", text: "Verified, impressive metrics for every case study hero headline (e.g., '87% reduction')", placeholder: "e.g., '-94% Pipeline Ingest Lag', '+$1.2M pipeline revenue generated in 90 days'...", label: "Hero Metric Headlines" },
      { id: "cp_proprietary_processes", text: "Formalized, proprietary names for your processes (e.g., 'Velocity Loop')", placeholder: "e.g., The Velocity Loop, Velyon Multi-Agent Consensus Validator...", label: "Proprietary Processes" }
    ],
    assetsNeeded: [
      { id: "cp_brand_guidelines", text: "A centralized Brand Voice & Copywriting Guidelines document" }
    ],
    recommendations: [
      "Focus heavily on 'Technical Transparency.' Don't just write marketing fluff; ensure your copywriters sit down with ML Engineers to accurately describe hallucination rates, validator loops, and data pipelines."
    ]
  },
  {
    id: "ui_component_library",
    title: "4.6 UI/UX Component Library (Figma Visual Patterns)",
    icon: Laptop,
    description: "Develop a cohesive high-contrast design system featuring bento layouts, step diagrams, radial lighting, and modular visual patterns.",
    badge: "Design System",
    infoNeeded: [
      { id: "ui_brand_guidelines", text: "Core brand guidelines (typography, color palettes, spacing rules)", placeholder: "e.g., Inter Sans & JetBrains Mono, Dark background (#04040a), Rose-500 & Indigo-500 neon accents...", label: "Typography & Color Palettes" }
    ],
    assetsNeeded: [
      { id: "ui_figma_kit", text: "A complete Figma UI Kit containing: Masonry Impact Cards, Metric Callout rows, Architecture diagram templates, Product Cards, numbered Methodology Steppers, Tabbed content blocks, and a Segment Navigator pill" }
    ],
    recommendations: [
      "Build these as reusable, modular components in your frontend framework (React, Webflow, etc.) rather than hard-coding them page by page. This ensures scalability."
    ]
  },
  {
    id: "production_priorities",
    title: "4.7 Content Production Priorities (First 90 Days)",
    icon: Calendar,
    description: "Stagger launch deliverables from launch-blockers (P0) to fast follows (P1) and secondary (P2) content blocks utilizing SME subject bandwidth.",
    badge: "90-Day Roadmap",
    infoNeeded: [
      { id: "pr_sme_bandwidth", text: "Availability and bandwidth of Subject Matter Experts (SMEs) to help write technical blogs", placeholder: "e.g., Dean (8 hrs/week for architectural reviews), Sam (4 hrs/week for case study vetting)...", label: "Subject Matter Experts (SME) Bandwidth" }
    ],
    assetsNeeded: [
      { id: "pr_p0_assets", text: "P0 (Launch Blockers): Methodology page, 3 Flagship Cases, 3 Product Pages" },
      { id: "pr_p1_assets", text: "P1 (Fast Follows): Impact Gallery, 3 Industry pages, 4 Technical blog posts" },
      { id: "pr_p2_assets", text: "P2 (Secondary): Team pages, Segment pages" }
    ],
    recommendations: [
      "Review the roadmap every 30 days. Maintain a direct collaboration channel between SMEs and the copy team to streamline drafts."
    ]
  }
];

export const FactoryView = () => {
  // Main view navigation tab: 'engine' (Multi-Modal Synth) or 'tracker' (Blueprint Tracker Checklist)
  const [activeSubTab, setActiveSubTab] = useState<'engine' | 'tracker'>('engine');

  // SYNTHESIS ENGINE STATES
  const [selectedInputs, setSelectedInputs] = useState<string[]>(['testimonials', 'file']);
  const [selectedTopic, setSelectedTopic] = useState<'casestudy' | 'websiteassets' | 'pitchdeck' | 'marketingreel' | 'sitemap' | 'wireframe'>('casestudy');
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['uicomponent', 'md', 'video']);
  const [clientName, setClientName] = useState<string>("Velyon Ventures");
  const [industry, setIndustry] = useState<string>("Enterprise AI Operations");
  const [metricValue, setMetricValue] = useState<string>("+142% efficiency");

  const [synthesisState, setSynthesisState] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [progressStage, setProgressStage] = useState<number>(0);
  const [activeOutputTab, setActiveOutputTab] = useState<'ui' | 'doc' | 'notebook' | 'mcp'>('ui');
  const [logs, setLogs] = useState<string[]>([]);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [stabilityVal, setStabilityVal] = useState<number>(75);
  const [motionVal, setMotionVal] = useState<number>(85);
  
  const timerRef = useRef<any>(null);
  const videoIntervalRef = useRef<any>(null);

  // BLUEPRINT TRACKER STATES - Load from local storage if available for high-fidelity persistence
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('velyon_blueprint_checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [draftedInfo, setDraftedInfo] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('velyon_blueprint_drafts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedSitemapNode, setSelectedSitemapNode] = useState<string>('homepage');
  const [selectedWireframePage, setSelectedWireframePage] = useState<'home' | 'product' | 'case' | 'contact'>('home');
  const [selectedWireframeSection, setSelectedWireframeSection] = useState<string>('hero');
  const [wireframeFidelity, setWireframeFidelity] = useState<'desktop' | 'mobile'>('desktop');

  const [selectedTrackId, setSelectedTrackId] = useState<string>("site_architecture");

  // NEW INGESTION & SCANNING STATES
  const [scrapedUrl, setScrapedUrl] = useState<string>("https://velyon.io");
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapingStep, setScrapingStep] = useState<number>(0);
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([]);
  const [hasScrapedResult, setHasScrapedResult] = useState<boolean>(false);
  const [activeScrapedTab, setActiveScrapedTab] = useState<'ui' | 'assets' | 'design' | 'voice'>('ui');
  const [ingestTab, setIngestTab] = useState<'url' | 'markdown' | 'registry' | 'supabase' | 'portfolio'>('supabase');
  const [notebookSubTab, setNotebookSubTab] = useState<'slides' | 'cinematic'>('slides');

  // Portfolio Scanner State
  const [portfolioItems, setPortfolioItems] = useState<DiscoveredItem[]>(() => {
    try {
      const saved = localStorage.getItem('velyon_portfolio_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<DiscoveredItem | null>(null);
  const [scannerMode, setScannerMode] = useState<'discover' | 'curate' | 'generate'>('discover');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'case-study' | 'product'>('all');
  const [scanSources, setScanSources] = useState<{
    vercel: boolean; netlify: boolean; github: boolean; urlCrawl: boolean;
  }>({ vercel: true, netlify: false, github: true, urlCrawl: true });
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryLogs, setDiscoveryLogs] = useState<string[]>([]);
  const [discoveryConfig, setDiscoveryConfig] = useState<Partial<DiscoverySourceConfig>>(() => {
    try {
      const saved = localStorage.getItem('velyon_discovery_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      vercel: { teamId: '', token: '', includePreviewDeployments: false },
      netlify: { siteIds: [], token: '' },
      github: { org: '', token: '', includePrivate: false, repoFilter: { topics: [], languages: [], pushedAfter: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0] }, pages: { enabledOnly: true } },
      urlCrawl: { urls: ['https://velyon.io'], followRedirects: true, maxDepth: 2, extractAssets: true }
    };
  });
  const [batchGenerateItems, setBatchGenerateItems] = useState<string[]>([]);
  const [batchOutputChannels, setBatchOutputChannels] = useState<Record<string, string[]>>({});

  const [appCredentials, setAppCredentials] = useState<AppCredentials>(() => {
    const defaults: AppCredentials = { githubToken: '', anthropicApiKey: '', vercelBypass: '', vercelToken: '', supabaseUrl: '', supabaseAnonKey: '', supabaseEmail: '', supabasePassword: '' };
    try {
      const saved = localStorage.getItem('velyon_app_credentials');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
    return defaults;
  });
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  
  // Custom scraped data
  const [customBrandVoice, setCustomBrandVoice] = useState<string>("Highly technical, enterprise-grade, transparent. Focuses on hard pipeline metrics and validator feedback loops.");
  const [scrapedColors, setScrapedColors] = useState<string[]>(["#f43f5e", "#6366f1", "#10b981", "#0f172a"]);
  const [scrapedTypography, setScrapedTypography] = useState<string>("Inter Sans (Body), Space Grotesk (Headings), JetBrains Mono (Telemetry)");
  const [scrapedComponents, setScrapedComponents] = useState<string[]>([
    "Glassmorphic Bento Metrics Canvas",
    "Real-time Pipeline Stream Accordion",
    "Secure Client Authentication Shield Drawer",
    "High-Contrast Conversions Stepper"
  ]);
  const [scrapedAssets, setScrapedAssets] = useState<string[]>([
    "velyon_signature_lockup.svg",
    "radial_ambient_neon_bg.png",
    "conversions_bento_illustration.svg"
  ]);

  // Markdown Design System states
  const [designSystemFileName, setDesignSystemFileName] = useState<string>("velyon_v2_design_spec.md");
  const [designSystemContent, setDesignSystemContent] = useState<string>(
    `# Velyon Design System Spec (v2.1)\n\n` +
    `## Color Tokens\n` +
    `- Primary Accent: #f43f5e (Rose Neon)\n` +
    `- Secondary Accent: #6366f1 (Indigo Deep)\n` +
    `- Status OK: #10b981 (Emerald Success)\n\n` +
    `## Typography\n` +
    `- Headings: Space Grotesk (Tech, tracking-tight)\n` +
    `- Body Copy: Inter Sans (Highly legible, crisp line-height)\n\n` +
    `## Interface Directives\n` +
    `- Core container padding: 24px (p-6) with modular 12px (p-3) internal sub-containers.\n` +
    `- Background styling: radial dark canvas to draw user focus towards centered data.`
  );
  const [isMdIngested, setIsMdIngested] = useState<boolean>(false);

  // Registry Parser states
  const [registryPlatform, setRegistryPlatform] = useState<'21stdev' | 'framer' | 'framermotion' | 'motionsites'>('21stdev');
  const [registryCodeText, setRegistryCodeText] = useState<string>(
    `// Imported Framer Motion transition curves\n` +
    `export const containerTransition = {\n` +
    `  initial: { opacity: 0, y: 15 },\n` +
    `  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }\n` +
    `};`
  );
  const [isRegistryParsed, setIsRegistryParsed] = useState<boolean>(false);

  // Save checks & drafts to localStorage on update
  useEffect(() => {
    localStorage.setItem('velyon_blueprint_checks', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem('velyon_blueprint_drafts', JSON.stringify(draftedInfo));
  }, [draftedInfo]);

  // Handle checking checklist item
  const handleToggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle typing information
  const handleUpdateDraft = (fieldId: string, value: string) => {
    setDraftedInfo(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Compute stats
  const totalCheckableItems = VELYON_BLUEPRINT_SECTIONS.reduce((acc, sec) => {
    return acc + sec.infoNeeded.length + sec.assetsNeeded.length;
  }, 0);

  const completedChecksCount = VELYON_BLUEPRINT_SECTIONS.reduce((acc, sec) => {
    let completed = 0;
    sec.infoNeeded.forEach(item => {
      if (checkedItems[item.id]) completed++;
    });
    sec.assetsNeeded.forEach(item => {
      if (checkedItems[item.id]) completed++;
    });
    return acc + completed;
  }, 0);

  const completionPercentage = Math.round((completedChecksCount / totalCheckableItems) * 100) || 0;

  // Custom visual badge based on readiness percentage
  const getReadinessBadge = (pct: number) => {
    if (pct < 20) return { label: "P0 Launch Blocked", color: "bg-red-500/10 border-red-500/30 text-red-400" };
    if (pct < 60) return { label: "Assembling Core Assets", color: "bg-amber-500/10 border-amber-500/30 text-amber-400" };
    if (pct < 95) return { label: "Campaign Preparing", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" };
    return { label: "100% Launch Ready", color: "bg-emerald-500/10 border-emerald-400/30 text-emerald-400 font-bold" };
  };

  const currentReadiness = getReadinessBadge(completionPercentage);

  // Toggle user inputs
  const handleToggleInput = (id: string) => {
    if (selectedInputs.includes(id)) {
      setSelectedInputs(selectedInputs.filter(item => item !== id));
    } else {
      setSelectedInputs([...selectedInputs, id]);
    }
  };

  // Toggle outputs
  const handleToggleOutput = (id: string) => {
    if (selectedOutputs.includes(id)) {
      setSelectedOutputs(selectedOutputs.filter(item => item !== id));
    } else {
      setSelectedOutputs([...selectedOutputs, id]);
    }
  };

  // ADVANCED COGNITIVE CRAWLERS & SOURCE INGESTION HANDLERS
  const handleWebCrawl = () => {
    if (!scrapedUrl) return;
    setIsScraping(true);
    setHasScrapedResult(false);
    setScrapingStep(0);
    setScrapingLogs([
      `[LAUNCH]: Initializing headless scanner for target URL: ${scrapedUrl}`,
      `[LAUNCH]: Creating Sandboxed browser frame, user agent: Chrome/121.0.0 (VelyonCrawler)`
    ]);

    const crawlSteps = [
      {
        step: 1,
        log: [
          `[DNS]: Resolved target domain successfully.`,
          `[DOM]: Connecting & downloading HTML payload... (124 KB)`,
          `[DOM]: Interactive state "complete" achieved. Loading styles...`
        ]
      },
      {
        step: 2,
        log: [
          `[COMPUTED STYLE]: Parsing Tailwind classes & inline CSS declarations...`,
          `[COMPUTED STYLE]: Discovered 4 core color variables: #f43f5e, #6366f1, #10b981, #0f172a`,
          `[COMPUTED STYLE]: Typography analysis complete: Space Grotesk / Inter pairing matched.`
        ]
      },
      {
        step: 3,
        log: [
          `[COMPONENTS DETECTED]: Scanning interactive nodes and element boundaries...`,
          `[COMPONENTS DETECTED]: Found glassmorphic dashboard container (#bento_kpi)`,
          `[COMPONENTS DETECTED]: Found stream accordion with animated svg arrows.`,
          `[COMPONENTS DETECTED]: Found custom sidebar drawer with sliding keyframes.`
        ]
      },
      {
        step: 4,
        log: [
          `[ASSETS & VOICE]: Extracted 3 vector SVG logo paths.`,
          `[ASSETS & VOICE]: Analyzing text copy for marketing tone, brand voice & guidelines...`,
          `[ASSETS & VOICE]: Tone Profile: "Highly technical, metric-driven, professional, transparent".`,
          `[SYSTEM]: Crawl completed successfully! Mapping result parameters to Factory synthesis deck.`
        ]
      }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < crawlSteps.length) {
        const stepData = crawlSteps[currentStepIndex];
        setScrapingStep(stepData.step);
        setScrapingLogs(prev => [...prev, ...stepData.log]);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsScraping(false);
        setHasScrapedResult(true);
        // Automatically prefill name / metric if found or customized
        if (scrapedUrl.includes("velyon")) {
          setClientName("Velyon Digital");
          setIndustry("Enterprise AI Ingestion");
        } else {
          // Parse name from URL as generic
          try {
            const domain = new URL(scrapedUrl).hostname.replace('www.', '').split('.')[0];
            const formatted = domain.charAt(0).toUpperCase() + domain.slice(1);
            setClientName(formatted + " Inc");
          } catch {
            setClientName("Scraped Target");
          }
        }
      }
    }, 1200);
  };

  const handleLoadPresetMd = () => {
    setDesignSystemFileName("velyon_premium_blueprint.md");
    setDesignSystemContent(
      `# Velyon Enterprise Design Guidelines\n\n` +
      `## Theme Specifications\n` +
      `- Canvas Base: #030308 (Deep Void Dark)\n` +
      `- Bright Accent: #f43f5e (Rose Pulse, shadow-rose-500/30)\n` +
      `- Cool Gradient: linear-gradient(135deg, #f43f5e, #6366f1)\n\n` +
      `## Animation System\n` +
      `- Use spring physical parameters (stiffness: 180, damping: 24) for entry micro-interactions.\n` +
      `- Stagger nested card children entrances by 0.08s for cognitive comfort.\n\n` +
      `## Voice Principles\n` +
      `- Humility: Focus strictly on hard mathematical proofs (e.g., "-94% ingest lag").\n` +
      `- No Marketing Fluff: Avoid "jaw-dropping" or "best-in-class" labels.`
    );
    setIsMdIngested(true);
    setLogs(prev => [...prev, `[DESIGN SYSTEM]: Ingested design system preset "velyon_premium_blueprint.md" successfully`]);
  };

  const handleCustomMdUpload = (text: string) => {
    setDesignSystemContent(text);
    setIsMdIngested(true);
    setLogs(prev => [...prev, `[DESIGN SYSTEM]: Ingested custom design system guidelines markdown`]);
  };

  const handleParseRegistry = () => {
    setIsRegistryParsed(true);
    setLogs(prev => [...prev, `[REGISTRY]: Parsed component registry specs from ${registryPlatform} successfully`]);
  };

  // Portfolio Scanner Persistence
  useEffect(() => {
    localStorage.setItem('velyon_portfolio_items', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  // Discovery Config Persistence (Vercel team ID, token, GitHub org, etc.)
  useEffect(() => {
    localStorage.setItem('velyon_discovery_config', JSON.stringify(discoveryConfig));
  }, [discoveryConfig]);

  // Credentials Persistence (GitHub PAT, Anthropic key, Vercel bypass — stored in browser only, never git)
  useEffect(() => {
    localStorage.setItem('velyon_app_credentials', JSON.stringify(appCredentials));
  }, [appCredentials]);

  // Portfolio Discovery Handler
  const handleRunDiscovery = async () => {
    setIsDiscovering(true);
    setDiscoveryLogs(['[PORTFOLIO] Starting portfolio discovery...']);
    const allItems: DiscoveredItem[] = [];
    try {
      if (scanSources.vercel && discoveryConfig.vercel?.teamId && discoveryConfig.vercel?.token) {
        setDiscoveryLogs(prev => [...prev, '[VERCEL] Fetching projects...']);
        const items = await portfolioScanner.discoverVercelProjects(discoveryConfig.vercel);
        allItems.push(...items);
        setDiscoveryLogs(prev => [...prev, `[VERCEL] Discovered ${items.length} projects`]);
      }
      if (scanSources.netlify && discoveryConfig.netlify?.siteIds?.length && discoveryConfig.netlify?.token) {
        setDiscoveryLogs(prev => [...prev, '[NETLIFY] Fetching sites...']);
        const items = await portfolioScanner.discoverNetlifySites(discoveryConfig.netlify);
        allItems.push(...items);
        setDiscoveryLogs(prev => [...prev, `[NETLIFY] Discovered ${items.length} sites`]);
      }
      if (scanSources.github && discoveryConfig.github?.org) {
        setDiscoveryLogs(prev => [...prev, '[GITHUB] Fetching repositories...']);
        const items = await portfolioScanner.discoverGitHubRepos(discoveryConfig.github);
        allItems.push(...items);
        setDiscoveryLogs(prev => [...prev, `[GITHUB] Discovered ${items.length} repos`]);
      }
      if (scanSources.urlCrawl && discoveryConfig.urlCrawl?.urls?.length) {
        setDiscoveryLogs(prev => [...prev, '[URL CRAWL] Crawling URLs...']);
        const items = await portfolioScanner.discoverFromUrls(discoveryConfig.urlCrawl);
        allItems.push(...items);
        setDiscoveryLogs(prev => [...prev, `[URL CRAWL] Discovered ${items.length} URLs`]);
      }
      const merged = [...portfolioItems];
      for (const item of allItems) {
        const existingIndex = merged.findIndex(m => m.id === item.id);
        if (existingIndex >= 0) { merged[existingIndex] = item; } else { merged.push(item); }
      }
      setPortfolioItems(merged);
      setDiscoveryLogs(prev => [...prev, `[PORTFOLIO] Total items: ${merged.length}. Discovery complete!`]);
    } catch (error) {
      setDiscoveryLogs(prev => [...prev, `[ERROR] ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAddManualEntry = (catalogType: 'case-study' | 'product') => {
    const name = window.prompt(catalogType === 'product' ? 'Name of the Velyon product:' : 'Name of the case study / client project:');
    if (!name || !name.trim()) return;
    const item = portfolioScanner.createManualEntry(name.trim(), catalogType);
    setPortfolioItems(prev => [...prev, item]);
    setCatalogFilter(catalogType);
    setSelectedPortfolioItem(item);
  };

  const handleAutoClassify = async (item: DiscoveredItem) => {
    if (!appCredentials.anthropicApiKey) {
      alert('Please set your Anthropic API key in Credentials first.');
      setShowCredentialsModal(true);
      return;
    }
    try {
      const result = await portfolioScanner.autoClassify(
        item, appCredentials.anthropicApiKey,
        appCredentials.vercelBypass || undefined, appCredentials.vercelToken || undefined,
        appCredentials.supabaseUrl || undefined, appCredentials.supabaseAnonKey || undefined,
        appCredentials.supabaseEmail || undefined, appCredentials.supabasePassword || undefined,
      );
      setPortfolioItems(prev => prev.map(p => p.id === item.id ? { ...p, aiClassification: result } : p));
      setSelectedPortfolioItem(prev => prev?.id === item.id ? { ...prev, aiClassification: result } : prev);
    } catch (e) { alert(`Auto-classify failed: ${e instanceof Error ? e.message : 'Unknown error'}`); }
  };

  const handleDeepScanGitHub = async (item: DiscoveredItem) => {
    if (!appCredentials.githubToken || !appCredentials.anthropicApiKey) {
      alert('Please set both your GitHub token and Anthropic API key in Credentials first.');
      setShowCredentialsModal(true);
      return;
    }
    if (!item.repoUrl) { alert('This item has no GitHub repo URL to scan.'); return; }
    try {
      const result = await portfolioScanner.deepScanGitHub(item.repoUrl, appCredentials.githubToken, appCredentials.anthropicApiKey);
      setPortfolioItems(prev => prev.map(p => p.id === item.id ? { ...p, aiClassification: result } : p));
      setSelectedPortfolioItem(prev => prev?.id === item.id ? { ...prev, aiClassification: result } : prev);
    } catch (e) { alert(`Deep scan failed: ${e instanceof Error ? e.message : 'Unknown error'}`); }
  };

  const handleSavePortfolioItem = (item: DiscoveredItem) => {
    setPortfolioItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      const merged = idx >= 0 ? [...prev.slice(0, idx), item, ...prev.slice(idx + 1)] : [...prev, item];
      // Re-derive which case studies reference each Velyon product (relatedCases on
      // product items) from the case studies' own relatedProducts declarations.
      return portfolioScanner.syncCrossLinks(merged);
    });
    setSelectedPortfolioItem(null);
  };

  const handleBatchGenerate = async () => {
    if (batchGenerateItems.length === 0) return;
    const inputs = portfolioScanner.generateBatchCaseStudyInputs(batchGenerateItems);
    for (const input of inputs) {
      setLogs(prev => [...prev, `[BATCH] Queued: ${input.clientName} - ${input.metricValue}`]);
    }
    setBatchGenerateItems([]);
    setLogs(prev => [...prev, `[BATCH] ${inputs.length} case studies queued for synthesis`]);
  };

  // Launch Synthesis Pipeline (Simulating multi-step SSE streaming)
  const handleStartSynthesis = () => {
    setSynthesisState('processing');
    setProgressStage(0);
    setLogs(["[SYSTEM]: Initializing Velyon Content Factory Pipeline..."]);
    
    const customIngestLogs = [];
    if (hasScrapedResult) {
      customIngestLogs.push(`[CRAWLER]: Merging crawled web tokens from ${scrapedUrl}...`);
      customIngestLogs.push(`[CRAWLER]: Extracted brand voice profile: "${customBrandVoice.substring(0, 50)}..."`);
      customIngestLogs.push(`[CRAWLER]: Extracted colors ${scrapedColors.slice(0, 3).join(', ')} linked as primary palette tokens`);
    }
    if (isMdIngested) {
      customIngestLogs.push(`[DESIGN SYSTEM]: Enforcing formatting from: "${designSystemFileName}"`);
    }
    if (isRegistryParsed) {
      customIngestLogs.push(`[REGISTRY]: Mapped animation curves from imported ${registryPlatform} registry component`);
    }

    const stageLogs = [
      [
        "[INGESTION]: Loading multi-modal inputs...",
        ...customIngestLogs,
        `[INGESTION]: Successfully loaded testimonials for "${clientName}"`,
        "[INGESTION]: Analyzing PDF files for semantic vectors...",
        "[INGESTION]: Ingestion parsing completed (100% fidelity)"
      ],
      [
        "[GEMINI CORE]: Connecting to @google/genai SDK (Gemini 2.5 Pro)...",
        "[GEMINI CORE]: Running multi-modal token embeddings...",
        "[GEMINI CORE]: Mapping client metrics directly to structured JSON schema...",
        "[GEMINI CORE]: Schema verification passed against 21st.dev template spec #7421"
      ],
      [
        "[ASSET ENGINE]: Synthesizing Markdown copy structure...",
        hasScrapedResult ? `[ASSET ENGINE]: Styling components according to color codes ${scrapedColors.join(', ')}` : "[ASSET ENGINE]: Applying Velyon default branding standards...",
        "[ASSET ENGINE]: Packaging asset vectors, JPEGs, and customized PNG banners...",
        "[ASSET ENGINE]: Generating local styles mapping rules..."
      ],
      [
        "[MEDIA ENGINE]: Synced ElevenLabs voiceover pipeline (Stability: " + stabilityVal + "%)",
        "[MEDIA ENGINE]: Synthesizing Higgsfield camera paths...",
        "[MEDIA ENGINE]: Triggering HeyGen digital spokesperson keyframes...",
        "[SYSTEM]: Compilation successfully completed!"
      ]
    ];

    let currentStage = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      if (currentStage < 4) {
        // Add all logs of the current stage
        setLogs(prev => [...prev, ...stageLogs[currentStage]]);
        setProgressStage(currentStage + 1);
        currentStage += 1;
      } else {
        clearInterval(timerRef.current);
        setSynthesisState('completed');
      }
    }, 1500);
  };

  // HeyGen Video Player Simulator
  useEffect(() => {
    if (isPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 150);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => clearInterval(videoIntervalRef.current);
  }, [isPlaying]);

  // Generate downloadable MD contents dynamically
  const handleDownloadMarkdown = () => {
    const markdownContent = `# Velyon AI Content Factory Report\n\n` +
      `**Client Name**: ${clientName}\n` +
      `**Sector**: ${industry}\n` +
      `**Core Metric**: ${metricValue}\n\n` +
      `## 1. Executive Summary\n` +
      `The Velyon Content Factory has processed raw materials (including client testimonials, file specifications, and design guides) to craft a world-class ${selectedTopic.toUpperCase()} package.\n\n` +
      `## 2. Multi-Modal Pipeline Outputs\n` +
      `- **Generated UI**: Fully animated React/Tailwind wrapper mapped via 21st.dev blueprints.\n` +
      `- **Voice Overlay**: Generated voice over narration using ElevenLabs with stability factor ${stabilityVal}%.\n` +
      `- **Physical Video Sweep**: Crafted via Higgsfield motion vectors setting motion magnitude ${motionVal}%.\n\n` +
      `## 3. Deployment Instructions\n` +
      `Run \`mcp query 21st.dev --component active-dashboard\` in your terminal using the Magic MCP Server to inject this module seamlessly.`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clientName.toLowerCase().replace(/ /g, '_')}_vely_report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export fully tailored, interactive blueprint answers to Markdown
  const handleExportCustomBlueprint = () => {
    let report = `# Velyon.io Content Architecture & Readiness Blueprint\n`;
    report += `Generated on: ${new Date().toLocaleDateString()} | Author: ${clientName || 'Velyon Admin'}\n`;
    report += `Readiness Score: ${completionPercentage}% (${currentReadiness.label})\n\n`;
    report += `========================================================================\n\n`;

    VELYON_BLUEPRINT_SECTIONS.forEach(sec => {
      report += `## ${sec.title} (${sec.badge})\n`;
      report += `${sec.description}\n\n`;

      report += `### 1. Information Requirements Checklist:\n`;
      sec.infoNeeded.forEach(item => {
        const isChecked = checkedItems[item.id] ? "[X]" : "[ ]";
        const drafted = draftedInfo[item.id] || "No text drafted yet.";
        report += `${isChecked} ${item.text}\n`;
        report += `    └─ Drafted Answer: "${drafted}"\n\n`;
      });

      report += `### 2. Assets & Collaterals Checklist:\n`;
      sec.assetsNeeded.forEach(asset => {
        const isChecked = checkedItems[asset.id] ? "[X]" : "[ ]";
        report += `${isChecked} ${asset.text}\n`;
      });
      report += `\n`;

      report += `### 3. Velyon Strategic Recommendation:\n`;
      sec.recommendations.forEach(rec => {
        report += `* ${rec}\n`;
      });
      report += `\n------------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Velyon_io_Launch_Blueprint_${completionPercentage}pct.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Spoken Subtitles matching Video progress
  const getSubtitles = () => {
    const p = currentTime;
    if (p < 25) return `Hello! I am your AI concierge spokesperson. Welcome to the personalized deep dive for ${clientName}.`;
    if (p < 50) return `By scanning your provided files, we have compiled an exceptional growth showcase focusing on ${industry}.`;
    if (p < 75) return `We synthesized the stunning results highlighting a massive ${metricValue} in our real-time metrics module.`;
    return `You can export these slide keyframes to NotebookLM or download full JPEGs immediately. Let's build!`;
  };

  const selectedTrack = VELYON_BLUEPRINT_SECTIONS.find(sec => sec.id === selectedTrackId) || VELYON_BLUEPRINT_SECTIONS[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in text-left">
      {/* Header Banner */}
      <div className="mb-6 border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-rose-500/20">
          <Sparkles size={12} className="animate-pulse" />
          <span>Velyon.io Strategy & Synthesis Hub</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Velyon Website Content Factory</h2>
        <p className="text-slate-400 text-sm mt-1">
          Streamline sitemaps, NDAs, product assets, and 90-day timelines. Build multi-modal code snippets, podcasts, and premium case studies interactively.
        </p>

        {/* Dynamic Dual Tab Bar (Navigation Pill Switcher) */}
        <div className="flex gap-2 mt-6 bg-black/40 p-1.5 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => setActiveSubTab('engine')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'engine' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Sliders size={14} />
            <span>⚡ Multi-Modal Synthesis Engine</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tracker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'tracker' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ClipboardList size={14} />
            <span>📋 Velyon.io Interactive Blueprint Tracker</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SYNTHESIS ENGINE */}
      {activeSubTab === 'engine' && (
        <>
          {synthesisState === 'idle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* CONFIGURATION STEP PANEL */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Sliders className="text-rose-400" size={18} />
                    <span>Configure Generation Inputs</span>
                  </h3>

                  {/* Ingest items */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Select Ingest Material (What do you have?)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'video', label: 'Raw Video File', icon: <Video size={14} className="text-indigo-400" /> },
                        { id: 'file', label: 'Case Study PDF/MD', icon: <FileText size={14} className="text-purple-400" /> },
                        { id: 'image', label: 'Product Image', icon: <Image size={14} className="text-emerald-400" /> },
                        { id: 'testimonials', label: 'Client Testimonials', icon: <MessageSquare size={14} className="text-rose-400" /> }
                      ].map(item => {
                        const active = selectedInputs.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleToggleInput(item.id)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                              active 
                                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                                : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                            }`}
                          >
                            {item.icon}
                            <span className="text-xs font-semibold">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Target */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Select Topic & Campaign Goal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'sitemap', title: 'Website Architecture Sitemap', desc: 'Builds interactive hierarchical tree mapping of 9 client pages.' },
                        { id: 'wireframe', title: 'Page Blueprint Wireframes', desc: 'Renders visual layout guidelines, responsive grids & CTAs.' },
                        { id: 'casestudy', title: 'B2B Case Study Dashboard', desc: 'Renders full metrics grids & testimonial scroll bars.' },
                        { id: 'websiteassets', title: 'Landing Hero Page Section', desc: 'Generates polished visual copy blocks & radial gradients.' },
                        { id: 'pitchdeck', title: 'Investor Pitch Bento Grid', desc: 'Packs assets into structured bento slides.' },
                        { id: 'marketingreel', title: 'Spokesperson Video Reel', desc: 'HeyGen talking head overlayed with ElevenLabs sound.' }
                      ].map(item => {
                        const active = selectedTopic === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedTopic(item.id as any)}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                              active 
                                ? 'bg-indigo-500/10 border-indigo-500/40 shadow-indigo-950/20' 
                                : 'bg-black/30 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <span className={`text-xs font-bold ${active ? 'text-indigo-400' : 'text-slate-200'}`}>{item.title}</span>
                            <span className="text-[10px] text-slate-500 leading-normal">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form Data */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Customize Branding Context</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500">Client Name</span>
                        <input 
                          type="text" 
                          value={clientName} 
                          onChange={e => setClientName(e.target.value)} 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500/40 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500">Industry / Sector</span>
                        <input 
                          type="text" 
                          value={industry} 
                          onChange={e => setIndustry(e.target.value)} 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500/40 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500">Highlight Metric</span>
                        <input 
                          type="text" 
                          value={metricValue} 
                          onChange={e => setMetricValue(e.target.value)} 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500/40 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Output specifications */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Select Output Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'uicomponent', label: '21st.dev React Canvas' },
                        { id: 'md', label: 'Markdown & PDF Reports' },
                        { id: 'notebook', label: 'NotebookLM Audio Spec' },
                        { id: 'video', label: 'HeyGen / Higgsfield Reel' }
                      ].map(out => {
                        const active = selectedOutputs.includes(out.id);
                        return (
                          <button
                            key={out.id}
                            onClick={() => handleToggleOutput(out.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                              active 
                                ? 'bg-rose-500 text-white border-rose-400/20 shadow-lg shadow-rose-500/10' 
                                : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/10'
                            }`}
                          >
                            {active ? '✓ ' : '+ '} {out.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Launch Synthesis Button */}
                  <button
                    onClick={handleStartSynthesis}
                    disabled={selectedInputs.length === 0 || selectedOutputs.length === 0}
                    className="w-full h-12 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-indigo-950/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>⚡ Synthesize via Velyon Content Factory</span>
                  </button>
                </div>
              </div>

              {/* RIGHT SIDEBAR ADVANCED INGESTION DECK */}
              <div className="lg:col-span-6 flex flex-col space-y-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col space-y-5 min-h-[500px] backdrop-blur-md">
                  
                  {/* Title & description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Layers className="text-indigo-400" size={18} />
                      <span>Advanced Source Material Ingest Deck</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Scan external websites, ingest design system markdown guidelines, or import premium component registries directly to power up your content generation.
                    </p>
                  </div>

                  {/* Inner Tab Switcher */}
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto scrollbar-none gap-0.5">
                    {[
                      { id: 'supabase', label: '⚡ Supabase Storage', icon: <Database size={12} /> },
                      { id: 'url', label: '🌐 Crawler', icon: <Globe size={12} /> },
                      { id: 'markdown', label: '📄 Design MD', icon: <FileText size={12} /> },
                      { id: 'registry', label: '🔌 Registry', icon: <Code size={12} /> },
                      { id: 'portfolio', label: '📦 Portfolio Scanner', icon: <Box size={12} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setIngestTab(tab.id as any)}
                        className={`flex-1 min-w-[80px] py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 flex-shrink-0 ${
                          ingestTab === tab.id
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* INGEST TAB 0: SUPABASE STORAGE DROPZONE */}
                  {ingestTab === 'supabase' && (
                    <SupabaseDropzone 
                      onMdParsed={(content, fileName) => {
                        setDesignSystemContent(content);
                        setDesignSystemFileName(fileName);
                        setIsMdIngested(true);
                        setLogs(prev => [...prev, `[SUPABASE]: Parsed active design specs from "${fileName}" successfully.`]);
                      }}
                      onPdfParsed={(fileName, size) => {
                        setLogs(prev => [...prev, `[SUPABASE]: Loaded design system PDF "${fileName}" (${(size / (1024 * 1024)).toFixed(2)} MB)`]);
                      }}
                      onVideoParsed={(fileName, size) => {
                        setLogs(prev => [...prev, `[SUPABASE]: Loaded testimonial video "${fileName}" (${(size / (1024 * 1024)).toFixed(2)} MB)`]);
                      }}
                      onAddLog={(log) => setLogs(prev => [...prev, log])}
                    />
                  )}

                  {/* INGEST TAB 1: WEBSITE CRAWLER */}
                  {ingestTab === 'url' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Scan any URL. Our cognitive crawler interacts with headless DOM elements to capture CSS design systems, branding assets, voice guidelines, and active layout components.
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={scrapedUrl}
                            onChange={e => setScrapedUrl(e.target.value)}
                            placeholder="https://velyon.io"
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/40 font-mono"
                          />
                          <button
                            onClick={handleWebCrawl}
                            disabled={isScraping}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            {isScraping ? (
                              <RefreshCw size={13} className="animate-spin" />
                            ) : (
                              <Globe size={13} />
                            )}
                            <span>{isScraping ? 'Crawling...' : 'Scan & Extract'}</span>
                          </button>
                        </div>

                        {/* LIVE SCRAPING LOGS TERMINAL */}
                        {isScraping && (
                          <div className="bg-black border border-white/5 rounded-xl p-3 font-mono text-[9px] text-slate-400 h-44 overflow-y-auto space-y-1">
                            <div className="text-indigo-400 border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                              <span>COGNITIVE CRAWLER STREAM</span>
                              <span className="animate-pulse">● CRAWLING</span>
                            </div>
                            {scrapingLogs.map((log, i) => (
                              <div key={i} className="leading-relaxed">
                                <span className="text-slate-600 font-bold mr-1.5">[{i + 1}]</span>
                                <span className={log.includes("[SYSTEM]") ? "text-emerald-400" : log.includes("[LAUNCH]") ? "text-indigo-400 font-bold" : "text-slate-300"}>
                                  {log}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CRAWLED COMPLETED RESULTS ACCORDION */}
                        {hasScrapedResult && !isScraping && (
                          <div className="border border-indigo-500/10 rounded-2xl bg-black/40 overflow-hidden">
                            {/* Result Sub-tabs */}
                            <div className="flex border-b border-white/5 bg-white/[0.01]">
                              {[
                                { id: 'design', label: '🎨 Design System' },
                                { id: 'ui', label: '🧱 UI Nodes' },
                                { id: 'voice', label: '🎙️ Brand Voice' },
                                { id: 'assets', label: '📁 Assets' }
                              ].map(sub => (
                                <button
                                  key={sub.id}
                                  onClick={() => setActiveScrapedTab(sub.id as any)}
                                  className={`flex-1 py-2 text-[10px] font-bold text-center transition-all border-b ${
                                    activeScrapedTab === sub.id
                                      ? 'border-rose-500 text-rose-300 bg-rose-500/5'
                                      : 'border-transparent text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {sub.label}
                                </button>
                              ))}
                            </div>

                            {/* Sub-tab viewport */}
                            <div className="p-4 text-xs space-y-3 min-h-[140px]">
                              {activeScrapedTab === 'design' && (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-mono text-slate-500">Extracted Color tokens:</span>
                                    <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 rounded">Scraped Successfully</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {scrapedColors.map(color => (
                                      <button
                                        key={color}
                                        onClick={() => {
                                          setMetricValue(`Styled via ${color}`);
                                          setLogs(prev => [...prev, `[USER]: Selected scraped token ${color} for metrics color overrides`]);
                                        }}
                                        className="px-2.5 py-1 rounded border border-white/5 bg-black/50 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 hover:border-white/20 hover:bg-white/5"
                                      >
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                                        <span>{color}</span>
                                      </button>
                                    ))}
                                  </div>
                                  <div className="space-y-1 pt-1 border-t border-white/5">
                                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Extracted Typography Pairings:</span>
                                    <span className="text-[11px] font-medium text-slate-300 font-mono">{scrapedTypography}</span>
                                  </div>
                                </div>
                              )}

                              {activeScrapedTab === 'ui' && (
                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Analyzed DOM Components ({scrapedComponents.length}):</span>
                                  <div className="grid grid-cols-2 gap-2">
                                    {scrapedComponents.map((comp, idx) => (
                                      <div key={idx} className="p-2 bg-black/60 border border-white/5 rounded-xl text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <span className="truncate">{comp}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activeScrapedTab === 'voice' && (
                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Determined Branding Tone Guidelines:</span>
                                  <p className="text-[11px] text-slate-300 leading-relaxed italic bg-black/40 p-2.5 border border-white/5 rounded-xl font-mono">
                                    "{customBrandVoice}"
                                  </p>
                                </div>
                              )}

                              {activeScrapedTab === 'assets' && (
                                <div className="space-y-2">
                                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Scraped High-Resolution SVGs/Images:</span>
                                  <div className="space-y-1.5 font-mono">
                                    {scrapedAssets.map((asset, idx) => (
                                      <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-[10px] text-slate-400">
                                        <span>{asset}</span>
                                        <span className="text-rose-400 text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded uppercase">Captured</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ecosystem help tip */}
                      <div className="bg-[#0c0c14] border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
                        <Info size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Crawling utilizes dynamic headless frameworks to construct compliant JSON trees. Running synthesis with crawled data automatically applies these styles.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* INGEST TAB 2: DESIGN SYSTEM MD */}
                  {ingestTab === 'markdown' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Upload your system markdown file or load standard specs to automatically customize typography, gradient tokens, and animations.
                          </p>
                          <button
                            onClick={handleLoadPresetMd}
                            className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg hover:bg-rose-500/25 transition-all flex-shrink-0"
                          >
                            Load Velyon Preset
                          </button>
                        </div>

                        {/* Drag and Drop Zone Simulator */}
                        <div className="border border-dashed border-white/10 rounded-2xl p-4 bg-black/25 flex flex-col items-center justify-center text-center space-y-2 relative cursor-pointer hover:border-white/20 transition-all">
                          <input
                            type="file"
                            accept=".md"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setDesignSystemFileName(file.name);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    handleCustomMdUpload(event.target.result as string);
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <UploadCloud size={24} className="text-indigo-400" />
                          <div className="text-xs font-bold text-slate-300">Drag & Drop .MD design system file here</div>
                          <div className="text-[10px] text-slate-500 font-mono">or click to browse local files</div>
                        </div>

                        {/* Editable Code block / editor preview */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                            <span>Markdown Content ({designSystemFileName})</span>
                            {isMdIngested && <span className="text-emerald-400 font-bold">✓ INGESTED & PARSED</span>}
                          </div>
                          <textarea
                            value={designSystemContent}
                            onChange={(e) => setDesignSystemContent(e.target.value)}
                            className="w-full bg-black/50 border border-white/5 rounded-2xl p-3 text-[10px] font-mono text-slate-300 h-32 outline-none focus:border-indigo-500/40 resize-none"
                          />
                        </div>
                      </div>

                      {isMdIngested && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 size={14} />
                          <span>Design System parameters compiled into active pipeline vectors.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* INGEST TAB 3: REGISTRY IMPORTER */}
                  {ingestTab === 'registry' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Paste code sections directly from <strong>21st.dev</strong>, <strong>Framer Motion</strong>, or <strong>motionsites.ai</strong>. Our parser parses animation durations, easing parameters, and styling rules automatically.
                        </p>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-mono text-slate-500 block">Select Registry Source Platform</span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['21stdev', 'framer', 'framermotion', 'motionsites'] as const).map(p => (
                              <button
                                key={p}
                                onClick={() => {
                                  setRegistryPlatform(p);
                                  if (p === 'framermotion') {
                                    setRegistryCodeText(
                                      `export const springEntry = {\n` +
                                      `  initial: { scale: 0.9, opacity: 0 },\n` +
                                      `  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 210, damping: 20 } }\n` +
                                      `};`
                                    );
                                  } else if (p === 'framer') {
                                    setRegistryCodeText(`// Framer canvas export block\nexport const motionSpec = { duration: 0.8, ease: "easeOut" };`);
                                  } else if (p === 'motionsites') {
                                    setRegistryCodeText(`// motionsites.ai design tokens\nexport const revealEffect = { opacity: 1, y: 0, delay: 0.15 };`);
                                  } else {
                                    setRegistryCodeText(
                                      `// Imported Framer Motion transition curves\n` +
                                      `export const containerTransition = {\n` +
                                      `  initial: { opacity: 0, y: 15 },\n` +
                                      `  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }\n` +
                                      `};`
                                    );
                                  }
                                }}
                                className={`py-2 px-1 rounded-xl border text-[10px] font-bold text-center transition-all ${
                                  registryPlatform === p
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                    : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10'
                                }`}
                              >
                                {p === '21stdev' ? '21st.dev' : p === 'framermotion' ? 'Framer' : p === 'framer' ? 'Framer' : 'motionsites'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-mono text-slate-500 block font-mono">Component / Section Source Code Snippet</span>
                          <textarea
                            value={registryCodeText}
                            onChange={(e) => setRegistryCodeText(e.target.value)}
                            className="w-full bg-black/50 border border-white/5 rounded-2xl p-3 text-[10px] font-mono text-slate-300 h-28 outline-none focus:border-indigo-500/40 resize-none"
                          />
                        </div>

                        <button
                          onClick={handleParseRegistry}
                          className="w-full h-10 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/35 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Code size={13} />
                          <span>Parse & Align Animation Curves</span>
                        </button>
                      </div>

                      {isRegistryParsed && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-[11px] text-slate-300 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-rose-400">
                            <CheckCircle2 size={13} />
                            <span>Animation Curves Mapped Successfully</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                            <div>Detected Transition: <strong className="text-slate-300">Custom Spring</strong></div>
                            <div>Dynamic Easing: <strong className="text-slate-300">[0.16, 1, 0.3, 1]</strong></div>
                          </div>
                      </div>
                    )}
                  </div>
                )}

                {/* INGEST TAB 4: PORTFOLIO SCANNER */}
                {ingestTab === 'portfolio' && (
                  <div className="space-y-4 flex-1 flex flex-col">
                    {/* Mode Selector */}
                    <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                      {[
                        { id: 'discover', label: '🔍 Discover', desc: 'Scan sources' },
                        { id: 'curate', label: '✏️ Curate', desc: 'Edit & redact' },
                        { id: 'generate', label: '⚡ Generate', desc: 'Case studies' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setScannerMode(mode.id as any)}
                          className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${
                            scannerMode === mode.id
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <span>{mode.label}</span>
                          <span className="text-[9px] opacity-70">{mode.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* DISCOVER MODE */}
                    {scannerMode === 'discover' && (
                      <div className="space-y-4 flex-1 overflow-y-auto">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                          <h4 className="font-bold text-slate-100 flex items-center gap-2 mb-4">
                            <Search className="text-indigo-400" size={16} />
                            <span>Connected Source Scanners</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            {[
                              { key: 'vercel', label: 'Vercel', icon: <Triangle className="text-indigo-400" size={16} />, desc: 'Team projects' },
                              { key: 'netlify', label: 'Netlify', icon: <Globe className="text-emerald-400" size={16} />, desc: 'Sites with edge' },
                              { key: 'github', label: 'GitHub', icon: <GitBranch className="text-slate-300" size={16} />, desc: 'Org repos' },
                              { key: 'github', label: 'GitHub Pages', icon: <ArrowUpRight className="text-blue-400" size={16} />, desc: 'Deploy URLs' },
                              { key: 'urlCrawl', label: 'URL Crawl', icon: <Globe className="text-rose-400" size={16} />, desc: 'Any URL' }
                            ].map((source, idx) => (
                              <label key={source.key + idx} className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all">
                                <input
                                  type="checkbox"
                                  checked={scanSources[source.key as keyof typeof scanSources]}
                                  onChange={e => setScanSources(prev => ({ ...prev, [source.key]: e.target.checked }))}
                                  className="w-4 h-4 accent-rose-500"
                                />
                                <div className="p-2 bg-white/5 rounded-lg">{source.icon}</div>
                                <div>
                                  <div className="text-xs font-bold text-slate-100">{source.label}</div>
                                  <div className="text-[10px] text-slate-500">{source.desc}</div>
                                </div>
                              </label>
                            ))}
                          </div>

                          {/* Config Inputs */}
                          {scanSources.vercel && (
                            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
                              <div className="text-xs font-bold text-indigo-400 mb-2">Vercel Configuration</div>
                              <input placeholder="Vercel Team ID" value={discoveryConfig.vercel?.teamId || ''} onChange={e => setDiscoveryConfig((prev: Partial<DiscoverySourceConfig>) => ({ ...prev, vercel: { ...prev.vercel, teamId: e.target.value } as DiscoverySourceConfig['vercel'] }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/40 font-mono" />
                              <input placeholder="Vercel Access Token" type="password" value={discoveryConfig.vercel?.token || ''} onChange={e => setDiscoveryConfig((prev: Partial<DiscoverySourceConfig>) => ({ ...prev, vercel: { ...prev.vercel, token: e.target.value } as DiscoverySourceConfig['vercel'] }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/40 font-mono" />
                            </div>
                          )}

                          {scanSources.github && (
                            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
                              <div className="text-xs font-bold text-slate-300 mb-2">GitHub Configuration</div>
                              <input placeholder="GitHub Organization" value={discoveryConfig.github?.org || ''} onChange={e => setDiscoveryConfig((prev: Partial<DiscoverySourceConfig>) => ({ ...prev, github: { ...prev.github, org: e.target.value } as DiscoverySourceConfig['github'] }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
                              <input placeholder="GitHub Token (optional)" type="password" value={discoveryConfig.github?.token || ''} onChange={e => setDiscoveryConfig((prev: Partial<DiscoverySourceConfig>) => ({ ...prev, github: { ...prev.github, token: e.target.value } as DiscoverySourceConfig['github'] }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
                            </div>
                          )}

                          {scanSources.urlCrawl && (
                            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
                              <div className="text-xs font-bold text-rose-400 mb-2">URL Crawl Configuration</div>
                              <textarea placeholder="One URL per line" value={discoveryConfig.urlCrawl?.urls?.join('\n') || ''} onChange={e => setDiscoveryConfig((prev: Partial<DiscoverySourceConfig>) => ({ ...prev, urlCrawl: { ...prev.urlCrawl, urls: e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean) } as DiscoverySourceConfig['urlCrawl'] }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-500/40 font-mono" rows={3} />
                            </div>
                          )}

                          <button
                            onClick={handleRunDiscovery}
                            disabled={isDiscovering}
                            className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                          >
                            {isDiscovering ? (
                              <><RefreshCw size={16} className="animate-spin" /><span>Discovering...</span></>
                            ) : (
                              <><Search size={16} /><span>Run Portfolio Discovery</span></>
                            )}
                          </button>

                          {discoveryLogs.length > 0 && (
                            <div className="mt-4 bg-black border border-white/5 rounded-xl p-3 font-mono text-[9px] text-slate-400 h-40 overflow-y-auto space-y-1">
                              {discoveryLogs.map((log, i) => (
                                <div key={i}>
                                  <span className="text-slate-600 font-bold mr-1.5">[{i + 1}]</span>
                                  <span className={log.includes("[ERROR]") ? "text-red-400" : log.includes("Discovered") ? "text-emerald-400 font-bold" : "text-slate-300"}>{log}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CURATE MODE */}
                    {scannerMode === 'curate' && (
                      <div className="space-y-4 flex-1 flex flex-col">
                        {selectedPortfolioItem ? (
                          <ErrorBoundary
                            label="Portfolio Editor"
                            resetKeys={[selectedPortfolioItem.id]}
                            fallback={(error, reset) => (
                              <div className="p-6 text-slate-100">
                                <h3 className="text-lg font-bold text-rose-400 mb-2">Could not open this item</h3>
                                <pre className="text-xs text-slate-400 whitespace-pre-wrap bg-black/40 rounded-xl p-4 mb-4">{error.message}</pre>
                                <div className="flex gap-3">
                                  <button onClick={reset} className="px-4 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/30">Retry</button>
                                  <button onClick={() => setSelectedPortfolioItem(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-xl hover:bg-white/10">Close editor</button>
                                </div>
                              </div>
                            )}
                          >
                            <PortfolioItemEditor
                              item={selectedPortfolioItem}
                              onSave={handleSavePortfolioItem}
                              onClose={() => setSelectedPortfolioItem(null)}
                              allItems={portfolioItems}
                              onAddComment={portfolioScanner.addComment.bind(portfolioScanner)}
                              onResolveComment={portfolioScanner.resolveComment.bind(portfolioScanner)}
                              onAutoClassify={handleAutoClassify}
                              onDeepScanGitHub={handleDeepScanGitHub}
                            />
                          </ErrorBoundary>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <Box size={64} className="mb-4 opacity-30" />
                            <h3 className="font-bold text-slate-100 mb-2">Select a project to curate</h3>
                            <p className="text-sm text-center">Click a project below to edit its details, metrics, assets, team, redaction rules, and add comments.</p>
                          </div>
                        )}
                        <div className="border-t border-white/5 pt-4 max-h-80 overflow-y-auto">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center bg-black/30 border border-white/5 rounded-xl p-1 gap-1">
                              {([
                                { key: 'all', label: `All (${portfolioItems.length})` },
                                { key: 'case-study', label: `📋 Case Studies (${portfolioItems.filter(i => i.catalogType === 'case-study').length})` },
                                { key: 'product', label: `🚀 Velyon Products (${portfolioItems.filter(i => i.catalogType === 'product').length})` },
                              ] as const).map(f => (
                                <button
                                  key={f.key}
                                  onClick={() => setCatalogFilter(f.key)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                                    catalogFilter === f.key ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {f.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleAddManualEntry('case-study')} className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><PlusCircle size={10} /> Case Study</button>
                              <button onClick={() => handleAddManualEntry('product')} className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg hover:bg-emerald-500/30 flex items-center gap-1"><PlusCircle size={10} /> Velyon Product</button>
                              <button onClick={() => setShowCredentialsModal(true)} className="px-2.5 py-1 bg-slate-500/10 border border-white/10 text-slate-400 text-[10px] font-bold rounded-lg hover:bg-white/5 flex items-center gap-1"><Key size={10} /> Credentials</button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {portfolioItems.filter(item => catalogFilter === 'all' || item.catalogType === catalogFilter).length === 0 && (
                              <div className="text-center py-8 text-slate-500 text-xs">
                                {catalogFilter === 'product' ? 'No Velyon products yet — click "+ Velyon Product" above to add one.' : 'No items in this view yet.'}
                              </div>
                            )}
                            {portfolioItems.filter(item => catalogFilter === 'all' || item.catalogType === catalogFilter).map(item => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedPortfolioItem(item)}
                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                                  selectedPortfolioItem?.id === item.id
                                    ? 'bg-rose-500/10 border-rose-500/30'
                                    : 'bg-black/30 border-white/5 hover:border-white/10'
                                }`}
                              >
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.catalogType === 'product' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                  {item.catalogType === 'product' ? '🚀' : '📋'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-bold text-slate-100 truncate">{item.name}</span>
                                    <span className="text-[10px] font-mono text-slate-500">{item.discoveryMethod}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">{item.description}</div>
                                </div>
                                {item.comments.length > 0 && (
                                  <span className="text-[9px] text-rose-400 flex items-center gap-1">
                                    <MessageSquare size={10} /> {item.comments.length}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GENERATE MODE */}
                    {scannerMode === 'generate' && (
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-100">Batch Case Study Generation</h3>
                          <span className="text-xs text-slate-400">{batchGenerateItems.length} selected</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4 max-h-[400px] overflow-y-auto">
                          {portfolioItems.filter(i => i.visibility !== 'internal-only').map(item => (
                            <label key={item.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                              batchGenerateItems.includes(item.id) ? 'bg-rose-500/10 border-rose-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'
                            }`}>
                              <input
                                type="checkbox"
                                checked={batchGenerateItems.includes(item.id)}
                                onChange={e => setBatchGenerateItems(prev => e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id))}
                                className="w-4 h-4 accent-rose-500"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-slate-100 truncate block">{item.name}</span>
                                <div className="text-[10px] text-slate-500">{item.metrics.length} metrics • {item.assets.length} assets</div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <button
                          onClick={handleBatchGenerate}
                          disabled={batchGenerateItems.length === 0}
                          className="w-full h-12 bg-gradient-to-r from-rose-500 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
                        >
                          <Zap size={16} /> <span>Generate {batchGenerateItems.length} Case Studies</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
              </div>
            </div>
          )}

          {/* SYNTHESIS ENGINE LOADING OVERLAY */}
          {synthesisState === 'processing' && (
            <div className="max-w-3xl mx-auto bg-[#040406] border border-white/5 rounded-3xl p-6 md:p-8 animate-pulse text-center space-y-8 shadow-2xl">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-2 border-rose-500/10 border-t-rose-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-indigo-500/10 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-4 rounded-full bg-black flex items-center justify-center text-xs font-bold text-rose-400 font-mono">
                    {progressStage * 25}%
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-200">Processing Multi-Modal Inputs...</h3>
                <p className="text-xs text-slate-500">Generating structured JSON and compiling custom HeyGen and Higgsfield motion assets.</p>
              </div>

              {/* Progressive Progress stages */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "1. Asset Ingestion", active: progressStage >= 1 },
                  { label: "2. Gemini Schema", active: progressStage >= 2 },
                  { label: "3. Layout Synthesis", active: progressStage >= 3 },
                  { label: "4. Voice & Movie", active: progressStage >= 4 }
                ].map((stg, i) => (
                  <div key={i} className={`p-2.5 rounded-lg border text-[10px] font-bold ${
                    stg.active 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : 'bg-white/[0.01] border-white/5 text-slate-600'
                  }`}>
                    {stg.label}
                  </div>
                ))}
              </div>

              {/* Terminal stream log */}
              <div className="bg-black border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] text-slate-400 h-44 overflow-y-auto space-y-1">
                <div className="text-slate-500 border-b border-white/5 pb-1 mb-2 flex justify-between">
                  <span>CONSOLE MONITORING LOG (SSE STREAM)</span>
                  <span className="text-rose-400 animate-pulse">● LIVE</span>
                </div>
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-rose-500/60">vely_cli:</span>
                    <span className={log.includes("[SYSTEM]") ? "text-indigo-400" : log.includes("[INGESTION]") ? "text-emerald-400" : "text-slate-300"}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SYNTHESIS RESULTS DASHBOARD (COMPLETE STATE) */}
          {synthesisState === 'completed' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT FACTORY CONTROL CONSOLE */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-[#06060c] border border-indigo-500/15 rounded-3xl p-5 space-y-5 relative overflow-hidden">
                  <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-indigo-500/5 blur-3xl"></div>
                  
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-mono">
                      <Sliders size={13} />
                      <span>Factory Parameters</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-400/20 px-2 py-0.5 rounded uppercase font-semibold">Active Engine</span>
                  </div>

                  {/* ElevenLabs controls */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-slate-300 block uppercase font-sans tracking-wide">🎙️ ElevenLabs Vocal Voice</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Stability Optimizer:</span><span className="text-slate-300">{stabilityVal}%</span></div>
                      <input 
                        type="range" 
                        min="30" max="100" 
                        value={stabilityVal} 
                        onChange={e => {
                          setStabilityVal(Number(e.target.value));
                          setLogs(prev => [...prev, `[USER]: Stability updated to ${e.target.value}%`]);
                        }} 
                        className="w-full accent-rose-500 bg-white/5 rounded-lg h-1 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Higgsfield controls */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-slate-300 block uppercase font-sans tracking-wide">🎬 Higgsfield Motion Dynamics</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Physics Flow scale:</span><span className="text-slate-300">{motionVal}%</span></div>
                      <input 
                        type="range" 
                        min="10" max="100" 
                        value={motionVal} 
                        onChange={e => {
                          setMotionVal(Number(e.target.value));
                          setLogs(prev => [...prev, `[USER]: Higgsfield motion magnitude updated to ${e.target.value}%`]);
                        }} 
                        className="w-full accent-indigo-500 bg-white/5 rounded-lg h-1 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/5">
                    <div className="text-[10px] font-mono text-slate-500 uppercase block">Selected Assets Payload</div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-1.5 text-[11px] text-slate-400 leading-normal">
                      <div><strong>Theme Canvas:</strong> Aurora Deep Midnight</div>
                      <div><strong>Client contexts:</strong> {clientName} ({industry})</div>
                      <div><strong>Metrics Mapped:</strong> {metricValue}</div>
                      <div><strong>Template Core:</strong> 21st.dev spec #{selectedTopic === 'casestudy' ? '7421' : selectedTopic === 'websiteassets' ? '1043' : selectedTopic === 'sitemap' ? '5591' : selectedTopic === 'wireframe' ? '3312' : '8851'}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartSynthesis}
                    className="w-full h-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Re-Synthesize Assets</span>
                  </button>
                </div>

                {/* Ingestion stream summary */}
                <div className="bg-[#030303] border border-white/5 rounded-3xl p-4 space-y-2.5 text-xs text-slate-400">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">Consolidated Ingestion Feed</span>
                  <ul className="space-y-1 text-[11px]">
                    <li className="flex items-center gap-2 text-emerald-400">✓ Testimonials parsed successfully</li>
                    <li className="flex items-center gap-2 text-emerald-400">✓ PDF embedding indexes stored securely</li>
                    <li className="flex items-center gap-2 text-indigo-400">↳ Raw images vectorized at 2048x</li>
                    <li className="flex items-center gap-2 text-rose-400">↳ AI voice synth mapped inside S3</li>
                  </ul>
                </div>
              </div>

              {/* RIGHT VISUAL OUTPUT CANVAS (WITH INTERNAL TABS) */}
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col min-h-[500px]">
                  
                  {/* Output Tab Selector */}
                  <div className="bg-white/[0.02] border-b border-white/5 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                      {[
                        { id: 'ui', label: 'Rendered UI Component', show: selectedOutputs.includes('uicomponent') },
                        { id: 'doc', label: 'Document (.MD)', show: selectedOutputs.includes('md') },
                        { id: 'notebook', label: 'Google NotebookLM', show: selectedOutputs.includes('notebook') },
                        { id: 'mcp', label: 'Magic MCP & 21st.dev', show: true }
                      ].map(tab => {
                        if (!tab.show) return null;
                        const active = activeOutputTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveOutputTab(tab.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              active 
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold' 
                                : 'text-slate-400 hover:text-slate-200 border border-transparent'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <span>SPEC: {selectedTopic.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Dynamic canvas viewport depending on selected Tab */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    
                    {/* TAB 1: RENDERED UI VIEW */}
                    {activeOutputTab === 'ui' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-bold">21st.dev Registered Component</span>
                            <h4 className="text-lg font-bold text-slate-100 mt-1">{STYLED_COMPONENTS_BLUEPRINTS[selectedTopic].title}</h4>
                          </div>
                          <span className="text-xs text-indigo-400 font-mono font-bold">{STYLED_COMPONENTS_BLUEPRINTS[selectedTopic].tech}</span>
                        </div>

                        {/* Rendering the dynamic premium layout based on user's topic */}
                        {selectedTopic === 'sitemap' && (
                          <div className="space-y-6">
                            <p className="text-xs text-slate-400">
                              Interactive hierarchical sitemap tree generated for <strong className="text-indigo-400 font-semibold">{clientName}</strong>. Click nodes to inspect paths, content structure, and SEO targets.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                              {/* Left Tree */}
                              <div className="md:col-span-8 bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col space-y-4 justify-between relative overflow-hidden min-h-[360px]">
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-rose-500/5 blur-2xl pointer-events-none"></div>

                                {/* Row 1: Root */}
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => setSelectedSitemapNode('homepage')}
                                    className={`px-4 py-2 rounded-xl border text-center transition-all ${
                                      selectedSitemapNode === 'homepage'
                                        ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/10 scale-105'
                                        : 'bg-[#09090f] border-white/10 text-slate-300 hover:border-white/25'
                                    }`}
                                  >
                                    <div className="text-[10px] uppercase font-mono tracking-widest opacity-80">Home Root</div>
                                    <div className="text-xs font-bold font-sans">Homepage (/)</div>
                                  </button>
                                </div>

                                {/* Tree Connector SVG Lines */}
                                <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
                                  <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M 200 65 L 200 110 M 200 110 L 70 110 M 200 110 L 330 110 M 70 110 L 70 140 M 200 110 L 200 140 M 330 110 L 330 140" strokeDasharray="4 4" className="text-indigo-400" />
                                    <path d="M 70 185 L 70 230" strokeDasharray="4 4" className="text-rose-400" />
                                    <path d="M 200 185 L 200 230" strokeDasharray="4 4" className="text-rose-400" />
                                    <path d="M 330 185 L 330 230" strokeDasharray="4 4" className="text-rose-400" />
                                  </svg>
                                </div>

                                {/* Row 2: Parents */}
                                <div className="flex justify-around items-center gap-2 relative z-10 pt-2">
                                  {[
                                    { id: 'products', path: '/products', label: 'Product Suite' },
                                    { id: 'work', path: '/work', label: 'Case Studies' },
                                    { id: 'about', path: '/about', label: 'Company Info' }
                                  ].map(p => (
                                    <button
                                      key={p.id}
                                      onClick={() => setSelectedSitemapNode(p.id)}
                                      className={`px-3 py-1.5 rounded-lg border text-center transition-all text-xs ${
                                        selectedSitemapNode === p.id
                                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/10 scale-105'
                                          : 'bg-[#09090f] border-white/10 text-slate-400 hover:border-white/20'
                                      }`}
                                    >
                                      <div className="font-bold">{p.label}</div>
                                      <div className="text-[9px] font-mono opacity-80">{p.path}</div>
                                    </button>
                                  ))}
                                </div>

                                {/* Row 3: Children */}
                                <div className="flex justify-around items-center gap-2 relative z-10 pt-2">
                                  {[
                                    { id: 'ingest', parentId: 'products', path: '/products/ingestion', label: 'Ingest Engine' },
                                    { id: 'cases', parentId: 'work', path: '/work/casestudies', label: 'Tech Deep-Dive' },
                                    { id: 'brand', parentId: 'about', path: '/about/brand', label: 'Brand Guidelines' }
                                  ].map(p => (
                                    <button
                                      key={p.id}
                                      onClick={() => setSelectedSitemapNode(p.id)}
                                      className={`px-2.5 py-1 rounded-lg border text-center transition-all text-[11px] ${
                                        selectedSitemapNode === p.id
                                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg'
                                          : 'bg-[#050508] border-white/5 text-slate-500 hover:border-white/10'
                                      }`}
                                    >
                                      <div>{p.label}</div>
                                      <div className="text-[8px] font-mono opacity-70">{p.path}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Right Inspector Drawer */}
                              <div className="md:col-span-4 bg-[#090911] border border-indigo-500/15 p-4 rounded-2xl flex flex-col justify-between min-h-[360px]">
                                <div>
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Node Inspector</span>
                                    <span className="text-[8px] bg-indigo-500/15 text-indigo-300 font-mono px-1.5 py-0.5 rounded font-bold uppercase">Active</span>
                                  </div>

                                  {selectedSitemapNode === 'homepage' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Homepage Core Structure</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Request sandbox access & explore portfolio modules.</div>
                                        <div><strong className="text-slate-300">SEO Focus Keyword:</strong> {industry} solutions, AI content pipelines.</div>
                                        <div><strong className="text-slate-300">Required Modules:</strong>
                                          <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10px] text-slate-500">
                                            <li>3D Ambient Neon Header</li>
                                            <li>Interactive Ingestion Deck</li>
                                            <li>Testimonial Video Marquee</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'products' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Products Directory</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/products</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Drive visitors to detailed feature sandboxes.</div>
                                        <div><strong className="text-slate-300">SEO Focus Keyword:</strong> Enterprise ingestion widgets, 21st.dev component specs.</div>
                                        <div><strong className="text-slate-300">Required Modules:</strong>
                                          <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10px] text-slate-500">
                                            <li>Dynamic Product Tabs</li>
                                            <li>Interactive Live Preview Sandbox</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'work' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Case Studies / Gallery</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/work</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Establish immediate enterprise credibility.</div>
                                        <div><strong className="text-slate-300">SEO Focus Keyword:</strong> AI performance metrics, {clientName} success matrix.</div>
                                        <div><strong className="text-slate-300">Required Modules:</strong>
                                          <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10px] text-slate-500">
                                            <li>Gold Standard Case Studies</li>
                                            <li>Before vs. After Metrics Grid</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'about' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">About & Company</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/about</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Humanize team capabilities & highlight compliance.</div>
                                        <div><strong className="text-slate-300">SEO Focus Keyword:</strong> Velyon technical team roster, security standards.</div>
                                        <div><strong className="text-slate-300">Required Modules:</strong>
                                          <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10px] text-slate-500">
                                            <li>NDA Compliance Shield Widget</li>
                                            <li>Team Headshots Grid</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'ingest' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Ingestion Product Detail</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/products/ingestion</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Capture file inputs or website scan.</div>
                                        <div><strong className="text-slate-300">SEO Focus Keyword:</strong> cognitive crawler system, automated schema mapper.</div>
                                        <div><strong className="text-slate-300">Active State:</strong> Tied to <strong>{selectedInputs.length} ingestion paths</strong>.</div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'cases' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Redacted Case Deep-Dive</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/work/casestudies</code></div>
                                        <div><strong className="text-slate-300">Conversion Objective:</strong> Detail technical stack transparently.</div>
                                        <div><strong className="text-slate-300">Before vs. After:</strong> Pre-programmed with <strong className="text-rose-400 font-mono">{metricValue}</strong>.</div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedSitemapNode === 'brand' && (
                                    <div className="space-y-3">
                                      <h5 className="text-xs font-bold text-slate-200">Brand Spec / Guidelines</h5>
                                      <div className="space-y-1.5 text-[11px] text-slate-400 leading-normal">
                                        <div><strong className="text-slate-300">Route Slug:</strong> <code className="text-[10px] font-mono bg-black/40 px-1 py-0.5 rounded">/about/brand</code></div>
                                        <div><strong className="text-slate-300">Design Tokens:</strong> Preset with <strong>{scrapedColors.length} palettes</strong>.</div>
                                        <div><strong className="text-slate-300">Typography Rule:</strong> {scrapedTypography.split('(')[0]} standard pairings.</div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="border-t border-white/5 pt-2 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                                  <span>SEO SCORE: 98/100</span>
                                  <span className="text-emerald-400">✓ Fully Connected</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Wireframe Visualizer */}
                        {selectedTopic === 'wireframe' && (
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 bg-black/20 p-3 rounded-2xl border border-white/5">
                              {/* Page switcher tabs */}
                              <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl">
                                {[
                                  { id: 'home', label: 'Homepage Layout' },
                                  { id: 'product', label: 'Product Detail Layout' },
                                  { id: 'case', label: 'Case Deep-Dive Layout' },
                                  { id: 'contact', label: 'Sandbox Request Layout' }
                                ].map(tab => (
                                  <button
                                    key={tab.id}
                                    onClick={() => {
                                      setSelectedWireframePage(tab.id as any);
                                      if (tab.id === 'home') setSelectedWireframeSection('hero');
                                      if (tab.id === 'product') setSelectedWireframeSection('grid');
                                      if (tab.id === 'case') setSelectedWireframeSection('testimonial');
                                      if (tab.id === 'contact') setSelectedWireframeSection('cta');
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      selectedWireframePage === tab.id
                                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                    }`}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>

                              {/* Desktop / Mobile switcher */}
                              <div className="flex gap-1 bg-black/40 p-1 rounded-xl">
                                {[
                                  { id: 'desktop', label: '🖥️ Desktop' },
                                  { id: 'mobile', label: '📱 Mobile Stack' }
                                ].map(toggle => (
                                  <button
                                    key={toggle.id}
                                    onClick={() => setWireframeFidelity(toggle.id as any)}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                                      wireframeFidelity === toggle.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {toggle.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                              {/* Left blueprint canvas layout simulation */}
                              <div className="md:col-span-8 bg-black/50 border border-dashed border-white/10 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-rose-500/5 blur-3xl pointer-events-none"></div>

                                <div className={`space-y-4 mx-auto transition-all duration-300 ${wireframeFidelity === 'mobile' ? 'max-w-[280px] w-full border-x border-white/10 px-4' : 'w-full'}`}>
                                  {/* Top Navigation placeholder */}
                                  <div className="border border-white/5 bg-white/[0.01] p-2.5 rounded-xl flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span>[LOGO] Velyon Website Content Factory</span>
                                    {wireframeFidelity === 'desktop' ? (
                                      <div className="flex gap-3">
                                        <span>Products</span>
                                        <span>Work</span>
                                        <span>About</span>
                                      </div>
                                    ) : (
                                      <span>[MENU]</span>
                                    )}
                                  </div>

                                  {/* Homepage Template Wireframe */}
                                  {selectedWireframePage === 'home' && (
                                    <div className="space-y-4">
                                      {/* Hero Section Wireframe */}
                                      <div
                                        onClick={() => setSelectedWireframeSection('hero')}
                                        className={`p-5 rounded-2xl border text-center cursor-pointer transition-all ${
                                          selectedWireframeSection === 'hero'
                                            ? 'border-rose-500 bg-rose-500/5 shadow-lg shadow-rose-500/5 scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Section: Hero Canvas Wrapper</div>
                                        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
                                        <div className="h-3 bg-white/5 rounded w-1/2 mx-auto mb-3"></div>
                                        <div className="flex gap-2 justify-center">
                                          <div className="h-6 w-20 bg-rose-500/20 border border-rose-500/30 rounded-full"></div>
                                          <div className="h-6 w-20 bg-white/5 border border-white/10 rounded-full"></div>
                                        </div>
                                      </div>

                                      {/* Bento Grid Wireframe */}
                                      <div
                                        onClick={() => setSelectedWireframeSection('grid')}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                          selectedWireframeSection === 'grid'
                                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono uppercase text-slate-500 block mb-2 text-center">Section: Bento Metrics Matrix</div>
                                        <div className={`grid gap-2.5 ${wireframeFidelity === 'desktop' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                                          <div className="h-14 border border-dashed border-white/10 rounded-xl bg-black/40 flex items-center justify-center text-[9px] font-mono text-slate-600">KPI Card ({metricValue})</div>
                                          <div className="h-14 border border-dashed border-white/10 rounded-xl bg-black/40 flex items-center justify-center text-[9px] font-mono text-slate-600">Telemetry Log Node</div>
                                          <div className="h-14 border border-dashed border-white/10 rounded-xl bg-black/40 flex items-center justify-center text-[9px] font-mono text-slate-600">100% Stable Core</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Product Detail Template Wireframe */}
                                  {selectedWireframePage === 'product' && (
                                    <div className="space-y-4">
                                      {/* Product Top */}
                                      <div
                                        onClick={() => setSelectedWireframeSection('grid')}
                                        className={`p-5 rounded-2xl border text-center cursor-pointer transition-all ${
                                          selectedWireframeSection === 'grid'
                                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Product Feature Header</span>
                                        <div className="h-5 bg-white/10 rounded w-2/3 mx-auto mb-2"></div>
                                        <div className="h-3.5 bg-white/5 rounded w-1/2 mx-auto"></div>
                                      </div>

                                      {/* Live Sandbox Interactive layout */}
                                      <div
                                        onClick={() => setSelectedWireframeSection('sandbox')}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                          selectedWireframeSection === 'sandbox'
                                            ? 'border-rose-500 bg-rose-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono uppercase text-slate-500 block mb-2 text-center">Interactive Live Demo Sandbox Block</div>
                                        <div className={`grid gap-3 ${wireframeFidelity === 'desktop' ? 'grid-cols-12' : 'grid-cols-1'}`}>
                                          <div className="md:col-span-5 h-20 bg-black/60 border border-white/5 rounded-xl p-2.5 text-[8px] font-mono text-slate-500">
                                            <span># File Ingest Code</span>
                                            <div className="mt-1.5 h-1.5 bg-white/5 rounded w-full"></div>
                                            <div className="mt-1 h-1.5 bg-white/5 rounded w-4/5"></div>
                                          </div>
                                          <div className="md:col-span-7 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-mono text-slate-400">
                                            [Render Visual Component Preview]
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Case Deep-Dive Layout */}
                                  {selectedWireframePage === 'case' && (
                                    <div className="space-y-4">
                                      <div
                                        onClick={() => setSelectedWireframeSection('testimonial')}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                          selectedWireframeSection === 'testimonial'
                                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono uppercase text-slate-500 block mb-2 text-center">Case Study Testimonial & Narrative Block</div>
                                        <div className="h-12 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30"></div>
                                          <div className="flex-1 space-y-1.5">
                                            <div className="h-2 bg-white/10 rounded w-full"></div>
                                            <div className="h-2 bg-white/5 rounded w-2/3"></div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        onClick={() => setSelectedWireframeSection('grid')}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                          selectedWireframeSection === 'grid'
                                            ? 'border-rose-500 bg-rose-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <div className="text-[10px] font-mono uppercase text-slate-500 block mb-1 text-center">Client Before vs. After Metrics Summary</div>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                          <div className="p-3 bg-black/40 border border-dashed border-red-500/10 rounded-xl text-center">
                                            <span className="text-[8px] font-mono text-slate-500">BEFORE STATUS</span>
                                            <div className="text-sm font-bold text-slate-400 line-through">18 hours delay</div>
                                          </div>
                                          <div className="p-3 bg-black/40 border border-dashed border-emerald-500/10 rounded-xl text-center">
                                            <span className="text-[8px] font-mono text-slate-500">AFTER METRIC</span>
                                            <div className="text-sm font-bold text-emerald-400">{metricValue}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Sandbox Request Layout */}
                                  {selectedWireframePage === 'contact' && (
                                    <div className="space-y-4">
                                      <div
                                        onClick={() => setSelectedWireframeSection('cta')}
                                        className={`p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                                          selectedWireframeSection === 'cta'
                                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg scale-[1.01]'
                                            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                                        }`}
                                      >
                                        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Section: Launch CTA Banner</span>
                                        <div className="h-4 bg-white/10 rounded w-1/2 mx-auto mb-2"></div>
                                        <div className="h-3 bg-white/5 rounded w-1/3 mx-auto mb-4"></div>
                                        <div className="h-8 bg-indigo-600/35 border border-indigo-500/40 rounded-xl w-32 mx-auto flex items-center justify-center text-[10px] font-mono text-white font-bold">Request Access</div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Universal Footer section placeholder */}
                                  <div className="border border-white/5 bg-white/[0.01] p-3 rounded-xl text-center text-[8px] text-slate-600 font-mono">
                                    [FOOTER MODULE] · 9 distinct templates compiled and linked dynamically.
                                  </div>
                                </div>
                              </div>

                              {/* Right detailed specification sidebar */}
                              <div className="md:col-span-4 bg-[#090911] border border-indigo-500/15 p-5 rounded-3xl flex flex-col justify-between">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">Section Specs</span>
                                    <span className="text-[8px] bg-rose-500/15 text-rose-300 font-mono px-1.5 py-0.5 rounded font-bold uppercase">{selectedWireframeSection.toUpperCase()}</span>
                                  </div>

                                  {selectedWireframeSection === 'hero' && (
                                    <div className="space-y-3.5">
                                      <h5 className="text-xs font-bold text-slate-200">Hero Section Directives</h5>
                                      <p className="text-[11px] text-slate-400 leading-normal">
                                        The landing header utilizes space-filling typography, dark overlays with high-contrast text layers, and ambient neon backdrops.
                                      </p>
                                      <div className="space-y-1 text-[10px] font-mono text-slate-500">
                                        <div><strong className="text-slate-400">Class:</strong> <code className="bg-black/40 px-1 py-0.5 rounded text-[9px] text-slate-300">bg-black text-white relative</code></div>
                                        <div><strong className="text-slate-400">Heading:</strong> Space Grotesk 48px</div>
                                        <div><strong className="text-slate-400">Body:</strong> Inter Sans 14px</div>
                                        <div><strong className="text-slate-400">Animations:</strong> Staggered motion fade-in</div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedWireframeSection === 'grid' && (
                                    <div className="space-y-3.5">
                                      <h5 className="text-xs font-bold text-slate-200">Bento / Metrics Specifications</h5>
                                      <p className="text-[11px] text-slate-400 leading-normal">
                                        A high-density bento grid representing core KPIs, before/after comparisons, and system stability vectors.
                                      </p>
                                      <div className="space-y-1 text-[10px] font-mono text-slate-500">
                                        <div><strong className="text-slate-400">Responsive Grid:</strong> <code className="bg-black/40 px-1 py-0.5 rounded text-[9px] text-slate-300">grid grid-cols-1 md:grid-cols-3 gap-4</code></div>
                                        <div><strong className="text-slate-400">Framer Curve:</strong> custom spring [stiffness: 210, damping: 20]</div>
                                        <div><strong className="text-slate-400">Aesthetic:</strong> Glassmorphic cards with fine glowing borders</div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedWireframeSection === 'sandbox' && (
                                    <div className="space-y-3.5">
                                      <h5 className="text-xs font-bold text-slate-200">Sandbox Playground Directives</h5>
                                      <p className="text-[11px] text-slate-400 leading-normal">
                                        An area showing users how their raw input documents or code files are parsed, featuring a real-time terminal log simulator.
                                      </p>
                                      <div className="space-y-1 text-[10px] font-mono text-slate-500">
                                        <div><strong className="text-slate-400">Interactive:</strong> bidirectional state linked with the sidebar</div>
                                        <div><strong className="text-slate-400">Textarea styles:</strong> <code className="bg-black/40 px-1 py-0.5 rounded text-[9px] text-slate-300">font-mono bg-black/50 text-xs px-3 py-2</code></div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedWireframeSection === 'testimonial' && (
                                    <div className="space-y-3.5">
                                      <h5 className="text-xs font-bold text-slate-200">Testimonials Marquee</h5>
                                      <p className="text-[11px] text-slate-400 leading-normal">
                                        A slider showcasing vetted client feedback with badges indicating NDA permission levels and project teams.
                                      </p>
                                      <div className="space-y-1 text-[10px] font-mono text-slate-500">
                                        <div><strong className="text-slate-400">Badge classes:</strong> <code className="bg-black/40 px-1 py-0.5 rounded text-[9px] text-slate-300">px-2 py-0.5 rounded-full text-[8px] uppercase</code></div>
                                        <div><strong className="text-slate-400">Voice tones:</strong> technical, transparent, metric-based</div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedWireframeSection === 'cta' && (
                                    <div className="space-y-3.5">
                                      <h5 className="text-xs font-bold text-slate-200">CTA Banner Parameters</h5>
                                      <p className="text-[11px] text-slate-400 leading-normal">
                                        Clean card-centered launching block with neon glow button triggers.
                                      </p>
                                      <div className="space-y-1 text-[10px] font-mono text-slate-500">
                                        <div><strong className="text-slate-400">Hover effects:</strong> <code className="bg-black/40 px-1 py-0.5 rounded text-[9px] text-slate-300">hover:bg-opacity-80 scale-105 active:scale-95</code></div>
                                        <div><strong className="text-slate-400">Buttons:</strong> touch height at least 44px</div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="border-t border-white/5 pt-3 text-[9px] font-mono text-slate-500 text-center">
                                  COMPLIANT WITH 21st.dev SPECIFICATION #3312
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rendering the dynamic premium layout based on user's topic */}
                        {selectedTopic === 'casestudy' && (
                          <div className="bg-gradient-to-br from-[#0c0c16] to-[#04040a] border border-indigo-500/20 p-6 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                                  <Sparkles size={16} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-slate-100">{clientName} Growth Engine</h5>
                                  <p className="text-[10px] font-mono text-slate-500">{industry} Integration Status</p>
                                </div>
                              </div>
                              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">LIVE METRIC</span>
                            </div>

                            {/* Bento KPI grid */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Conversion Impact</span>
                                <div className="text-lg font-bold text-indigo-400 font-mono mt-1">{metricValue}</div>
                              </div>
                              <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Embed Index</span>
                                <div className="text-lg font-bold text-purple-400 font-mono mt-1">4,120 nodes</div>
                              </div>
                              <div className="bg-black/40 border border-white/5 p-3 rounded-2xl text-center">
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Sync Health</span>
                                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">100% stable</div>
                              </div>
                            </div>

                            {/* Testimonials marquee inside the parsed output */}
                            <div className="bg-black/50 border border-indigo-500/10 rounded-2xl p-4 relative">
                              <span className="absolute -top-2.5 left-4 text-[9px] font-mono font-bold uppercase bg-[#090912] border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Ingested Client quote</span>
                              <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                                "The automated multi-modal campaign output generated by Velyon AI has slashed our pipeline preparation delay by 10x. It is incredibly stunning and premium!"
                              </p>
                              <div className="text-[10px] font-mono text-slate-500 mt-2 text-right">— Verified Testimonial Log</div>
                            </div>
                          </div>
                        )}

                        {selectedTopic === 'websiteassets' && (
                          <div className="bg-gradient-to-br from-[#0c0612] to-[#040206] border border-purple-500/20 p-8 rounded-3xl space-y-6 relative overflow-hidden text-center shadow-2xl min-h-[280px] flex flex-col justify-center items-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
                            
                            <div className="inline-flex items-center gap-1 bg-purple-500/15 border border-purple-400/20 px-3 py-1 rounded-full text-[10px] font-bold text-purple-300 uppercase">
                              ⚡ Synthesized Hero Layout Spec
                            </div>

                            <h5 className="text-2xl font-black text-white tracking-tight max-w-md mt-2">
                              Next-Gen Operations for {clientName} Mapped in 3D
                            </h5>
                            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                              We construct beautiful, accelerated content pipelines to scale enterprise visual workflows. Powered by a massive <strong className="text-purple-400 font-mono">{metricValue}</strong> growth matrix.
                            </p>

                            <div className="flex gap-3 justify-center pt-2">
                              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-lg shadow-purple-950/40 flex items-center gap-1">
                                <span>Get Started Now</span>
                                <ArrowRight size={13} />
                              </button>
                              <button className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold text-xs px-5 py-2.5 rounded-full transition-all">
                                Learn more
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedTopic === 'pitchdeck' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-[#050907] border border-emerald-500/15 p-5 rounded-3xl relative overflow-hidden">
                                <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase">Market Opportunity</span>
                                <h5 className="text-base font-bold text-slate-200 mt-2.5">Sector: {industry}</h5>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Scaling complex operations via optimized multi-modal pipeline routing structures.</p>
                              </div>
                              <div className="bg-[#090505] border border-rose-500/15 p-5 rounded-3xl relative overflow-hidden">
                                <span className="text-[9px] font-bold font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase">Venture Traction</span>
                                <h5 className="text-base font-bold text-slate-200 mt-2.5">{clientName} Index</h5>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Validated performance uplift proving a stunning <strong className="text-rose-400">{metricValue}</strong> increase.</p>
                              </div>
                            </div>

                            <div className="bg-[#0c0c14] border border-white/5 p-4 rounded-2xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-slate-400 font-mono">Financial Deck ready to download</span>
                              </div>
                              <button className="text-indigo-400 font-bold hover:underline flex items-center gap-1 font-mono text-[11px]">
                                <span>Export PDF Slides</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedTopic === 'marketingreel' && (
                          <div className="bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Simulation Video Canvas */}
                            <div className="aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-between p-4 relative min-h-[240px]">
                              
                              {/* Top HUD bar */}
                              <div className="flex justify-between items-center z-10">
                                <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-white/5 text-[9px] font-mono text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                  <span>HEYGEN AI AVATAR CORE</span>
                                </div>
                                <div className="text-[9px] font-mono text-slate-500 bg-black/60 px-2.5 py-1 rounded-full border border-white/5">
                                  Higgsfield Dynamics: {motionVal}%
                                </div>
                              </div>

                              {/* Center: Fake avatar graphics */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                <div className="relative h-20 w-20">
                                  <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping"></div>
                                  <div className="absolute inset-2 rounded-full border border-dashed border-rose-500 animate-spin"></div>
                                  <div className="absolute inset-4 rounded-full bg-indigo-500/20 backdrop-blur-xl flex items-center justify-center">
                                    <Sparkles size={20} className="text-indigo-400 animate-pulse" />
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Spoken Subtitle Overlay */}
                              <div className="z-10 bg-black/75 border border-white/5 p-3 rounded-xl max-w-lg mx-auto text-center backdrop-blur-md">
                                <p className="text-xs font-medium text-slate-100 font-sans tracking-wide">
                                  {getSubtitles()}
                                </p>
                              </div>
                            </div>

                            {/* Player controls */}
                            <div className="bg-white/[0.02] border-t border-white/5 px-4 py-3 flex items-center justify-between gap-4">
                              <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all flex items-center justify-center flex-shrink-0"
                              >
                                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                              </button>

                              {/* Interactive slider timeline */}
                              <div className="flex-1 flex items-center gap-3">
                                <span className="text-[9px] font-mono text-slate-500">0:0{Math.floor(currentTime/10)}</span>
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const p = Math.floor((clickX / rect.width) * 100);
                                  setCurrentTime(p);
                                }}>
                                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${currentTime}%` }}></div>
                                </div>
                                <span className="text-[9px] font-mono text-slate-500">0:10</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Volume2 size={14} className="text-slate-500" />
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">11labs Synth</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-start gap-3">
                          <Info size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            This layout was compiled directly using the dynamic structured JSON output. It represents a 100% accurate visual specimen. You can adjust stability, motion scales, or click Re-Synthesize on the left console to update inputs.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: DOCUMENT VIEW */}
                    {activeOutputTab === 'doc' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Comprehensive Case Study Output</span>
                            <h4 className="text-lg font-bold text-slate-100 mt-1">Structured Ingestion Article (.MD / .PDF)</h4>
                          </div>
                          <button
                            onClick={handleDownloadMarkdown}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md"
                          >
                            <Download size={13} />
                            <span>Download .MD Report</span>
                          </button>
                        </div>

                        <div className="bg-black/50 border border-white/5 rounded-2xl p-6 font-sans text-xs text-slate-300 space-y-4 max-h-80 overflow-y-auto leading-relaxed">
                          <h1 className="text-base font-bold text-white border-b border-white/5 pb-2">Velyon Content Factory Synthesis</h1>
                          <div className="flex flex-wrap gap-4 text-slate-400 text-[10px] border-b border-white/5 pb-2">
                            <span><strong>Client:</strong> {clientName}</span>
                            <span><strong>Sector:</strong> {industry}</span>
                            <span><strong>Metric:</strong> {metricValue}</span>
                            <span><strong>Language:</strong> English (United States)</span>
                          </div>
                          <p><strong>1. PROJECT METRICS SUMMARY</strong></p>
                          <p>
                            We processed customer-provided testimonial datasets to construct key metric visual grids. The synthesized outcome showcases a verified performance uplift exceeding <strong>{metricValue}</strong> inside the {industry} domain.
                          </p>
                          <p><strong>2. SOUND DESIGN & MULTI-MODAL VIDEO ALIGNMENT</strong></p>
                          <p>
                            The factory engine generated a customized ElevenLabs audio narration voice profile utilizing Stability setting {stabilityVal}%. We synchronized this speech overlay with HeyGen avatar layouts and Higgsfield dynamics magnitude {motionVal}% to construct seamless, photorealistic customer reels.
                          </p>
                          <p><strong>3. DEPLOYMENT CORE COMPONENT PATH</strong></p>
                          <p>
                            The generated dynamic UI leverages verified layouts sourced from the <strong>21st.dev component ecosystem</strong>. This ensures strict compliance with standard accessibility primitives and lightweight responsive Tailwind styles.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: NOTEBOOKLM VIEW */}
                    {activeOutputTab === 'notebook' && (
                      <div className="space-y-6 text-left">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold">NotebookLM & Video Generator Pack</span>
                            <h4 className="text-lg font-bold text-slate-100 mt-1 font-sans">Structured Multimodal Synthesis Payload</h4>
                          </div>
                          
                          {/* Sub-tab selection */}
                          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 gap-0.5">
                            <button
                              onClick={() => setNotebookSubTab('slides')}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                notebookSubTab === 'slides'
                                  ? 'bg-rose-500 text-white shadow-md'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              📚 Google NotebookLM Slides
                            </button>
                            <button
                              onClick={() => setNotebookSubTab('cinematic')}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                notebookSubTab === 'cinematic'
                                  ? 'bg-indigo-500 text-white shadow-md'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              🎬 Cinematic Video Prompt Matrix
                            </button>
                          </div>
                        </div>

                        {notebookSubTab === 'slides' ? (
                          <div className="space-y-6">
                            {/* Intro info box */}
                            <div className="bg-gradient-to-r from-rose-950/20 to-indigo-950/20 border border-white/5 rounded-2xl p-4 flex items-start gap-3.5">
                              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl flex-shrink-0">
                                <BookOpen size={18} />
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-200">Google NotebookLM Slides Synthesizer</h5>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  NotebookLM processes high-fidelity structured schemas to generate comprehensive presentation keyframes and podcast dialogue plans. This JSON payload is curated with brand-identity tokens and custom metrics.
                                </p>
                              </div>
                            </div>

                            {/* Visual Presentation slide sequence */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                                  Visual Slides Preview Deck ({clientName})
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">4 Generated Keyframes</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                {[
                                  {
                                    num: "01",
                                    title: "Strategic Blueprint",
                                    desc: `Executive alignment for ${clientName} core operations in the ${industry} market.`,
                                    focus: "Corporate Ingestion"
                                  },
                                  {
                                    num: "02",
                                    title: "Cognitive Scrape DNA",
                                    desc: "Extraction of computed Tailwind classes, brand-voice logs and DOM boundaries.",
                                    focus: "Deterministic Brand"
                                  },
                                  {
                                    num: "03",
                                    title: "Performance Impact",
                                    desc: `Verified conversion uplift proving a dynamic ${metricValue} increase in user retention.`,
                                    focus: "Pipeline Metrics"
                                  },
                                  {
                                    num: "04",
                                    title: "21st.dev Deployments",
                                    desc: "MCP-automated injection of modular interactive React layouts into production.",
                                    focus: "Technical Path"
                                  }
                                ].map((slide, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-[#05050b] border border-white/5 p-4 rounded-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:border-white/10 transition-all"
                                  >
                                    <div className="absolute -top-3 -right-3 text-[48px] font-black text-white/[0.02] font-sans group-hover:text-white/[0.04] transition-all">
                                      {slide.num}
                                    </div>
                                    <div>
                                      <div className="text-[8px] font-mono text-rose-400 uppercase tracking-widest">{slide.focus}</div>
                                      <h6 className="text-xs font-bold text-slate-100 mt-1">{slide.title}</h6>
                                      <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">{slide.desc}</p>
                                    </div>
                                    <div className="text-[8px] font-mono text-slate-600 mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                      <span>Slide {slide.num} Keyframe</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Structured Payload Export Card */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-slate-500 uppercase block">NotebookLM Slides Input Schema Payload</span>
                                <button
                                  onClick={() => {
                                    const jsonPayload = JSON.stringify({
                                      notebook_metadata: {
                                        source: "Velyon Website Content Factory",
                                        client_name: clientName,
                                        industry: industry,
                                        primary_metric: metricValue,
                                        timestamp: new Date().toISOString()
                                      },
                                      slides_structure: [
                                        {
                                          slide_index: 1,
                                          title: `Executive Introduction & Strategic Briefing: ${clientName}`,
                                          focus_area: "In-depth positioning within the " + industry + " sector",
                                          bullets: [
                                            `Synthesized directly from live URLs and design specifications.`,
                                            `Aligned to target high-intent conversions and brand voice parameters.`
                                          ],
                                          speaker_notes: "Welcome stakeholders. Today we review Velyon's content-factory pipeline blueprints designed to automate multi-modal campaign outputs and visual assets."
                                        },
                                        {
                                          slide_index: 2,
                                          title: "Branding DNA & Headless Crawler Metrics",
                                          focus_area: "Responsive design system integration rules",
                                          bullets: [
                                            "Parsed typography: Space Grotesk display paired with Inter Sans body copies.",
                                            `Enforced color scheme variables based on custom extracted color matrices.`
                                          ],
                                          speaker_notes: "This slide outlines our brand boundaries ensuring all AI outputs remain deterministic and completely compliant with pre-vetted CSS models."
                                        },
                                        {
                                          slide_index: 3,
                                          title: "Growth Acceleration & Milestone Metrics",
                                          focus_area: `Demonstrating verified ${metricValue} pipeline efficiency`,
                                          bullets: [
                                            "Automated asset processing reduces campaign setup delays by 10x.",
                                            "Preserves historic checklists, checklists drafts and visual nodes in localized persistence."
                                          ],
                                          speaker_notes: "Key performance takeaways emphasize how Velyon streamlines media reels and sitemaps in a single unified execution window."
                                        },
                                        {
                                          slide_index: 4,
                                          title: "Multi-Modal Code Generation Strategy",
                                          focus_area: "21st.dev Component Marketplace and MCP Servers",
                                          bullets: [
                                            "Direct integration using local magic-mcp-servers in the IDE context.",
                                            "Framer Motion physics configurations parsed into clean client component blocks."
                                          ],
                                          speaker_notes: "In conclusion, this code pipeline links our sitemaps with actual, production-ready code blocks to accelerate development timeframes."
                                        }
                                      ]
                                    }, null, 2);
                                    navigator.clipboard.writeText(jsonPayload);
                                    alert("Successfully copied NotebookLM structured JSON payload to clipboard!");
                                  }}
                                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-all flex items-center gap-1 font-mono bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded"
                                >
                                  <ClipboardList size={12} />
                                  <span>Copy Slides JSON</span>
                                </button>
                              </div>

                              <div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-300 relative text-left max-h-56 overflow-y-auto">
                                <pre className="text-rose-300 leading-relaxed">
{`{
  "notebook_metadata": {
    "source": "Velyon Website Content Factory",
    "client": "${clientName}",
    "industry": "${industry}",
    "conversion_metric": "${metricValue}",
    "system_stability": "${stabilityVal}%"
  },
  "slides_structure": [
    {
      "slide": 1,
      "title": "Executive Briefing: ${clientName} Operations",
      "focus": "In-depth positioning within ${industry}",
      "bullets": [
        "Synthesized from custom ingested design system specifications",
        "Ensures absolute marketing alignment and brand tone compliance"
      ]
    },
    {
      "slide": 2,
      "title": "Deterministic Design DNA & Ingestion Logs",
      "focus": "Automated Crawler CSS Analytics",
      "bullets": [
        "Headless scraping captures typography, colors and DOM layers",
        "Strict style mapping eliminates compliance drift or AI slop"
      ]
    },
    {
      "slide": 3,
      "title": "Conversion Scaling Metrics",
      "focus": "Uplift metrics of ${metricValue}",
      "bullets": [
        "Bento grids and visual milestones map key analytics",
        "10x improvement in campaign preparation timeframes"
      ]
    },
    {
      "slide": 4,
      "title": "Production-Ready Component Codebars",
      "focus": "21st.dev Ecosystem integrations",
      "bullets": [
        "MCP automation connects model streams directly inside IDEs",
        "Pre-styled Framer Motion transitions loaded into project paths"
      ]
    }
  ]
}`}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Cinematic Video Intro */}
                            <div className="bg-gradient-to-r from-indigo-950/20 to-rose-950/20 border border-white/5 rounded-2xl p-4 flex items-start gap-3.5">
                              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl flex-shrink-0">
                                <Video size={18} />
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-slate-200 font-sans">Cinematic Video Creation Payload</h5>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  Perfect for generative video APIs (e.g. Higgsfield, Sora, Runway Gen-3). This structured script translates brand-voice logs and visual assets into continuous shot prompt sets.
                                </p>
                              </div>
                            </div>

                            {/* Film strip timeline */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                                Generative Camera Shot List Timeline
                              </span>

                              <div className="space-y-2.5">
                                {[
                                  {
                                    time: "0:00 - 0:02",
                                    shot: "Establishing Wide Shot",
                                    prompt: `Slow drone-in towards a futuristic minimalist glass skyscraper in deep dark sky. The building emits glowing neon accents of rose (#f43f5e) and indigo (#6366f1). Cinematic, moody volumetric atmospheric lighting, photo-realistic 8K resolution.`,
                                    voice: "Welcome to the future of digital asset synthesis."
                                  },
                                  {
                                    time: "0:02 - 0:05",
                                    shot: "Macro Close-Up",
                                    prompt: `Extreme macro pan over high-tech fiber-optic cable nodes pulsing with holographic streams. Words like "COGNITIVE SCRARE" and "${metricValue} LIFT" float as delicate light constructs. Shallow depth of field, 24fps filmic grading.`,
                                    voice: `Where live website data in the ${industry} sector is crawled and mapped securely.`
                                  },
                                  {
                                    time: "0:05 - 0:08",
                                    shot: "Medium Tracking Shot",
                                    prompt: `Slick slider shot behind an elite developer wearing headset, looking at glowing transparent monitors displaying interactive sitemaps. Staggered motion curves reflecting in their eyes. Dark cyberpunk studio aesthetic, sharp focus.`,
                                    voice: `Empowering teams with automatic 21st.dev codebases and custom spring models.`
                                  },
                                  {
                                    time: "0:08 - 0:10",
                                    shot: "Fast Dolly-Out Zoom",
                                    prompt: `Rapid camera pull back through a series of glowing modular screens showing the Velyon Content Factory dashboard. The screens slide in smoothly. End on high-contrast central title "Velyon Website Content Factory" as a massive logo overlay.`,
                                    voice: `Synthesize your assets. Deploy instantly.`
                                  }
                                ].map((item, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-black/60 transition-all group"
                                  >
                                    <div className="flex gap-3 items-center min-w-0 flex-1">
                                      <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex flex-col items-center justify-center font-mono text-[9px] flex-shrink-0">
                                        <span className="font-bold">SHOT</span>
                                        <span>0{index + 1}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-slate-200">{item.shot}</span>
                                          <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{item.time}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 italic leading-normal truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-slate-300 transition-all">
                                          Prompt: "{item.prompt}"
                                        </p>
                                      </div>
                                    </div>

                                    <div className="w-full md:w-48 bg-black/50 border border-white/5 p-2 rounded-xl text-[9px] font-mono text-slate-400 flex-shrink-0">
                                      <div className="text-[8px] uppercase text-rose-400 font-bold">Narration Overlay</div>
                                      <div className="truncate mt-0.5" title={item.voice}>"{item.voice}"</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Export copy payload */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-slate-500 uppercase block">Generative Video Prompt JSON payload</span>
                                <button
                                  onClick={() => {
                                    const jsonPayload = JSON.stringify({
                                      video_metadata: {
                                        source: "Velyon Cinematic Reel Generator",
                                        client: clientName,
                                        aspect_ratio: "16:9",
                                        fps: 24,
                                        recommended_audio: "Ambient Cinematic Pad, Synthesized Voice (ElevenLabs)",
                                        voice_stability: `${stabilityVal}%`,
                                        motion_magnitude: `${motionVal}%`
                                      },
                                      timeline_shots: [
                                        {
                                          shot_index: 1,
                                          timecode: "0:00 - 0:02",
                                          shot_type: "Establishing Wide Shot",
                                          prompt_instruction: `Slow drone-in towards a futuristic minimalist glass skyscraper in deep dark sky. The building emits glowing neon accents of rose (#f43f5e) and indigo (#6366f1). Cinematic, moody volumetric atmospheric lighting, photo-realistic 8K resolution.`,
                                          narration_script: "Welcome to the future of digital asset synthesis."
                                        },
                                        {
                                          shot_index: 2,
                                          timecode: "0:02 - 0:05",
                                          shot_type: "Macro Close-Up",
                                          prompt_instruction: `Extreme macro pan over high-tech fiber-optic cable nodes pulsing with holographic streams. Words like "COGNITIVE SCRARE" and "${metricValue} LIFT" float as delicate light constructs. Shallow depth of field, 24fps filmic grading.`,
                                          narration_script: `Where live website data in the ${industry} sector is crawled and mapped securely.`
                                        },
                                        {
                                          shot_index: 3,
                                          timecode: "0:05 - 0:08",
                                          shot_type: "Medium Tracking Shot",
                                          prompt_instruction: `Slick slider shot behind an elite developer wearing headset, looking at glowing transparent monitors displaying interactive sitemaps. Staggered motion curves reflecting in their eyes. Dark cyberpunk studio aesthetic, sharp focus.`,
                                          narration_script: `Empowering teams with automatic 21st.dev codebases and custom spring models.`
                                        },
                                        {
                                          shot_index: 4,
                                          timecode: "0:08 - 0:10",
                                          shot_type: "Fast Dolly-Out Zoom",
                                          prompt_instruction: `Rapid camera pull back through a series of glowing modular screens showing the Velyon Content Factory dashboard. The screens slide in smoothly. End on high-contrast central title "Velyon Website Content Factory" as a massive logo overlay.`,
                                          narration_script: "Synthesize your assets. Deploy instantly."
                                        }
                                      ]
                                    }, null, 2);
                                    navigator.clipboard.writeText(jsonPayload);
                                    alert("Successfully copied Generative Video structured JSON payload to clipboard!");
                                  }}
                                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1 font-mono bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded"
                                >
                                  <ClipboardList size={12} />
                                  <span>Copy Video Prompt Payload</span>
                                </button>
                              </div>

                              <div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-300 relative text-left max-h-56 overflow-y-auto">
                                <pre className="text-indigo-300 leading-relaxed">
{`{
  "video_metadata": {
    "source": "Velyon Cinematic Reel Generator",
    "client": "${clientName}",
    "ratio": "16:9",
    "fps": 24,
    "motion_magnitude": "${motionVal}%"
  },
  "timeline_shots": [
    {
      "shot": 1,
      "timecode": "0:00 - 0:02",
      "type": "Establishing Wide Shot",
      "visual_prompt": "Drone in futuristic skyscraper in night. Neon rose (#f43f5e) and indigo (#6366f1) details. Volumetric fog. 8K, cinematic style.",
      "audio_subtitles": "Welcome to the future of digital asset synthesis."
    },
    {
      "shot": 2,
      "timecode": "0:02 - 0:05",
      "type": "Macro Close-Up",
      "visual_prompt": "Fiber optic glass cables pulsing blue light. Hologram overlay metrics displaying ${metricValue}. Filmic lighting.",
      "audio_subtitles": "Where live website data in ${industry} is crawled and mapped."
    },
    {
      "shot": 3,
      "timecode": "0:05 - 0:08",
      "type": "Medium Tracking Shot",
      "visual_prompt": "Side tracking shot profile of developers with sitemap projections. Space Grotesk interfaces. Tech mood.",
      "audio_subtitles": "Empowering teams with automatic 21st.dev codebases."
    },
    {
      "shot": 4,
      "timecode": "0:08 - 0:10",
      "type": "Dolly-Out Zoom",
      "visual_prompt": "Rapid zoom out of multiple dashboard panels. Ends on Velyon content factory logo text. Cosmic dark bg.",
      "audio_subtitles": "Synthesize your assets. Deploy instantly."
    }
  ]
}`}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: MAGIC MCP & 21ST.DEV */}
                    {activeOutputTab === 'mcp' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold">Developer Toolchain Specifications</span>
                            <h4 className="text-lg font-bold text-slate-100 mt-1">21st.dev Marketplace & Magic MCP Server</h4>
                          </div>
                          <span className="text-xs text-purple-400 font-mono font-bold">Verified Tool</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="bg-[#05050c] border border-purple-500/15 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-purple-300">
                              <Laptop size={14} />
                              <strong className="font-bold">What is 21st.dev?</strong>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-[11px]">
                              21st.dev is the ultimate registry of production-ready React components styled with Tailwind CSS and Framer Motion. This workspace queries these schemas to assemble premium components with actual code blocks.
                            </p>
                          </div>

                          <div className="bg-[#05050c] border border-purple-500/15 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-purple-300">
                              <Terminal size={14} />
                              <strong className="font-bold">Magic MCP Server Integration</strong>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-[11px]">
                              The Magic Model Context Protocol (MCP) server runs inside your IDE, letting AI models search, fetch, and inject code blocks from 21st.dev directly into local files.
                            </p>
                          </div>
                        </div>

                        {/* Interactive terminal code snippet */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Local Command Line execution</span>
                          <div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[11px] text-slate-300 relative text-left">
                            <div className="absolute top-3 right-3 text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 uppercase font-bold font-mono">Bash</div>
                            <div className="flex gap-2">
                              <span className="text-purple-400"># 1. Start the Magic MCP server local listener</span>
                            </div>
                            <div>npx magic-mcp-server --port 8080</div>
                            <div className="flex gap-2 mt-2">
                              <span className="text-purple-400"># 2. Inject this verified Velyon component spec into your React folder</span>
                            </div>
                            <div>mcp install 21st.dev/component/{selectedTopic === 'casestudy' ? '7421-glowing-dashboard' : '1043-radial-hero'} --target=./src/components</div>
                            <div className="text-emerald-400 mt-2">✔ Connected to local workspace successfully. Installed 1 component!</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Back button to configuration */}
                    <div className="mt-8 border-t border-white/5 pt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-mono">Output Synthesis ID: #V{stabilityVal}H{motionVal}</span>
                      <button
                        onClick={() => setSynthesisState('idle')}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-all"
                      >
                        <span>← Adjust Settings & Inputs</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* SUB-TAB 2: BLUEPRINT CHECKLIST & PLANNER TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* READINESS HERO SCORECARD AND STATUS STATS */}
          <div className="bg-gradient-to-r from-slate-950 via-[#0a0a14] to-indigo-950/40 border border-indigo-500/10 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-rose-500/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono tracking-wider uppercase border px-3 py-1 rounded-full font-bold ${currentReadiness.color}`}>
                  {currentReadiness.label}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Target: Velyon.io Content Architecture
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight">Velyon.io Launch Blueprint Tracker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sit down with your ML Engineers & Copywriters to check off the required information and upload core brand assets. Draft campaign contents directly inside our factory sandbox below to compile your fully tailored launching manifest.
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Campaign Preparation Progress</span>
                  <span className="text-indigo-400 font-bold">{completionPercentage}% Completed ({completedChecksCount}/{totalCheckableItems} tasks)</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Scorecard Widget Block */}
            <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 p-6 rounded-3xl text-center min-w-[200px] shadow-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">READINESS DIAL</span>
              <div className="relative h-24 w-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/5"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-rose-500 transition-all duration-500"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white font-mono">{completionPercentage}%</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-semibold">Ready</span>
                </div>
              </div>

              {/* Download drafted blueprint report */}
              <button
                onClick={handleExportCustomBlueprint}
                disabled={completedChecksCount === 0}
                className="mt-4 px-4 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 w-full"
              >
                <Download size={13} />
                <span>Export Manifest</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN BLUEPRINT INTERACTION PANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT TRACKS SELECTION NAVIGATION */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Select Strategy Blueprint Track</span>
              
              <div className="space-y-2">
                {VELYON_BLUEPRINT_SECTIONS.map(sec => {
                  const isSelected = selectedTrackId === sec.id;
                  
                  // Compute track-specific percentage
                  const totalTrackChecks = sec.infoNeeded.length + sec.assetsNeeded.length;
                  const completedTrackChecks = 
                    sec.infoNeeded.filter(item => checkedItems[item.id]).length +
                    sec.assetsNeeded.filter(item => checkedItems[item.id]).length;
                  const trackPct = Math.round((completedTrackChecks / totalTrackChecks) * 100) || 0;

                  const SecIcon = sec.icon;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedTrackId(sec.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all relative ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' 
                          : 'bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03] hover:border-white/10'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' 
                          : 'bg-black/40 text-slate-500 border-white/5'
                      }`}>
                        <SecIcon size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{sec.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-black/40 border border-white/5 px-2 py-0.5 rounded uppercase font-semibold">
                            {sec.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {sec.description}
                        </p>

                        {/* Track individual progress inline bar */}
                        <div className="flex items-center gap-2 pt-1.5">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${trackPct}%` }}></div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold">{trackPct}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE DETAILED CONSOLE & DRAFTING AREA */}
            <div className="lg:col-span-7 bg-[#05050c] border border-indigo-500/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Header Title inside detail panel */}
              <div className="bg-white/[0.02] border-b border-white/5 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                    {React.createElement(selectedTrack.icon, { size: 18 })}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{selectedTrack.title} Strategy Console</h4>
                    <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Requirement Ingestion Sheet</span>
                  </div>
                </div>
                
                <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-mono font-bold">
                  {selectedTrack.badge}
                </span>
              </div>

              {/* Interactive Inputs/Checklists */}
              <div className="p-6 md:p-8 space-y-8 max-h-[580px] overflow-y-auto">
                
                {/* 1. Information Requirements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold uppercase border-b border-indigo-500/10 pb-2">
                    <Info size={14} />
                    <span>1. Information & Business Rules Needed</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal mb-2">
                    Mark which pieces of information have been legally/technically verified, and use the sandbox typing fields below to draft inputs directly.
                  </p>

                  <div className="space-y-4">
                    {selectedTrack.infoNeeded.map((info, idx) => {
                      const isChecked = !!checkedItems[info.id];
                      return (
                        <div key={info.id} className="bg-black/35 border border-white/5 rounded-2xl p-4 space-y-3 hover:border-white/10 transition-all">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCheck(info.id)}
                              className="mt-0.5 accent-rose-500 h-4 w-4 rounded bg-black border-white/10 flex-shrink-0 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className={`text-xs font-bold block ${isChecked ? 'text-indigo-300 line-through' : 'text-slate-200'}`}>
                                {idx + 1}. {info.text}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Field ID: {info.id}</span>
                            </div>
                          </label>

                          {/* Live interactive input drafting block */}
                          <div className="pl-7 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">{info.label} Sandbox Draft:</span>
                            <textarea
                              rows={2}
                              value={draftedInfo[info.id] || ""}
                              onChange={e => handleUpdateDraft(info.id, e.target.value)}
                              placeholder={info.placeholder}
                              className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-rose-500/30 focus:bg-black/70 placeholder:text-slate-600 font-sans leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Assets Needed Checklist */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold uppercase border-b border-indigo-500/10 pb-2">
                    <Laptop size={14} />
                    <span>2. Assets, Mockups & Media Files Needed</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal">
                    Check off assets as you upload high-res client logos, record spokesperson videos, and complete wireframes inside the Velyon.io drive folders.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedTrack.assetsNeeded.map(asset => {
                      const isChecked = !!checkedItems[asset.id];
                      return (
                        <button
                          key={asset.id}
                          onClick={() => handleToggleCheck(asset.id)}
                          className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                            isChecked 
                              ? 'bg-rose-500/5 border-rose-500/30 text-rose-300' 
                              : 'bg-black/25 border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          <div className={`h-4.5 w-4.5 rounded border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                            isChecked ? 'bg-rose-500 text-white border-rose-400' : 'border-white/10 bg-black/40'
                          }`}>
                            {isChecked && <Check size={11} className="stroke-[3]" />}
                          </div>
                          <span className="text-xs leading-normal font-medium">{asset.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Velyon Strategic Recommendations */}
                <div className="bg-indigo-950/25 border border-indigo-500/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-500/5 blur-xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 font-bold uppercase">
                    <Award size={14} />
                    <span>Strategic Velyon Recommendation</span>
                  </div>
                  {selectedTrack.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-slate-300 leading-relaxed font-sans">
                      {rec}
                    </p>
                  ))}
                </div>

              </div>

              {/* Status footer bar */}
              <div className="bg-white/[0.02] border-t border-white/5 p-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Active Sheet: {selectedTrack.id.toUpperCase()}</span>
                <span className="text-rose-400 font-bold">✓ Progress Auto-Saved to browser</span>
              </div>

            </div>
          </div>

          {/* DYNAMIC ROADMAP Deliverables Priority (90-Day Priority Canvas Map) */}
          <div className="bg-[#04040a] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 flex-wrap gap-4">
              <div>
                <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Calendar className="text-rose-500" size={18} />
                  <span>4.7 Content Production Priorities (First 90 Days Timeline)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Stagger deliverables logically based on launches to streamline subject matter resources.</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">Status: Roadmap Vetted</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* P0 BLOCK */}
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-rose-500/10 pb-2">
                  <span className="text-xs font-bold text-rose-400 font-mono">P0: LAUNCH BLOCKERS</span>
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold uppercase">Days 1 - 30</span>
                </div>
                
                <ul className="space-y-3">
                  {[
                    { id: 'p0_methodology', text: "Methodology & Framework Page" },
                    { id: 'p0_cases', text: "3 Flagship Client Case Studies" },
                    { id: 'p0_product', text: "3 Flagship Product Landing Pages" }
                  ].map(item => {
                    const checked = !!checkedItems[item.id];
                    return (
                      <li key={item.id} className="flex items-center gap-2.5">
                        <button 
                          onClick={() => handleToggleCheck(item.id)}
                          className={`h-4.5 w-4.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            checked ? 'bg-rose-500 border-rose-400 text-white' : 'border-rose-500/20 bg-black/40'
                          }`}
                        >
                          {checked && <Check size={11} className="stroke-[3]" />}
                        </button>
                        <span className={`text-xs ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* P1 BLOCK */}
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2">
                  <span className="text-xs font-bold text-indigo-400 font-mono">P1: FAST FOLLOWS</span>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold uppercase">Days 31 - 60</span>
                </div>
                
                <ul className="space-y-3">
                  {[
                    { id: 'p1_gallery', text: "Impact & KPI Masonry Gallery" },
                    { id: 'p1_industry', text: "3 Specialized Industry Sector Hubs" },
                    { id: 'p1_blogs', text: "4 In-Depth Technical Blog Posts (with SMEs)" }
                  ].map(item => {
                    const checked = !!checkedItems[item.id];
                    return (
                      <li key={item.id} className="flex items-center gap-2.5">
                        <button 
                          onClick={() => handleToggleCheck(item.id)}
                          className={`h-4.5 w-4.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            checked ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-indigo-500/20 bg-black/40'
                          }`}
                        >
                          {checked && <Check size={11} className="stroke-[3]" />}
                        </button>
                        <span className={`text-xs ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* P2 BLOCK */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono">P2: SECONDARY REELS</span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">Days 61 - 90</span>
                </div>
                
                <ul className="space-y-3">
                  {[
                    { id: 'p2_team', text: "Velyon Team & Roster Bio Profiles" },
                    { id: 'p2_segment', text: "Segment Pages (Venture, Biotech, etc.)" },
                    { id: 'p2_sandbox', text: "Automated Sandbox demo environments" }
                  ].map(item => {
                    const checked = !!checkedItems[item.id];
                    return (
                      <li key={item.id} className="flex items-center gap-2.5">
                        <button 
                          onClick={() => handleToggleCheck(item.id)}
                          className={`h-4.5 w-4.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            checked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-emerald-500/20 bg-black/40'
                          }`}
                        >
                          {checked && <Check size={11} className="stroke-[3]" />}
                        </button>
                        <span className={`text-xs ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </div>

        </div>
      )}

      {showCredentialsModal && (
        <CredentialsModal credentials={appCredentials} onSave={setAppCredentials} onClose={() => setShowCredentialsModal(false)} />
      )}

    </div>
  );
};
