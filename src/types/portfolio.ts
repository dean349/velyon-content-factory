export type DiscoveryMethod = 
  | 'vercel' 
  | 'netlify' 
  | 'github-repo' 
  | 'github-pages' 
  | 'url-crawl' 
  | 'docker' 
  | 'kubernetes' 
  | 'manual-entry';

export type DiscoveryStatus = 'pending' | 'discovered' | 'enriched' | 'curated' | 'redacted' | 'generation-ready' | 'archived';

// Which showcase catalog an item belongs to: work delivered for a client, or a
// proprietary tool/system Velyon built and owns itself. Orthogonal to `sourceType`
// (which describes the technical shape of the item, e.g. webapp vs api vs library).
export type CatalogType = 'case-study' | 'product';

export type CommentType = 
  | 'missing-info' 
  | 'auto-generate' 
  | 'fabricated' 
  | 'needs-review' 
  | 'legal-hold' 
  | 'technical-debt' 
  | 'client-feedback' 
  | 'general';

export interface DiscoveryComment {
  id: string;
  itemId: string;
  fieldPath: string;              // e.g., "metrics[0].value", "techStack.ai", "clientContext.archetype"
  type: CommentType;
  content: string;
  author: string;                 // User identifier
  createdAt: string;              // ISO timestamp
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  // For auto-generate requests
  generationPrompt?: string;      // Prompt for AI to fill this field
  generationContext?: string;     // Additional context for generation
  // For fabricated entries
  fabricationConfidence?: number; // 0-1, how confident we are in made-up data
  fabricationSource?: string;     // "estimated from similar projects" | "industry benchmark" | "educated guess"
}

export interface DiscoverySourceConfig {
  // Vercel
  vercel?: {
    teamId: string;
    token: string;
    includePreviewDeployments?: boolean;
  };
  // Netlify
  netlify?: {
    siteIds: string[];
    token: string;
  };
  // GitHub
  github?: {
    org: string;
    token?: string;               // Optional for public repos only
    includePrivate?: boolean;
    repoFilter?: {
      topics?: string[];          // Only repos with these topics
      languages?: string[];       // Only these languages
      pushedAfter?: string;       // ISO date
      archived?: boolean;
    };
    // GitHub Pages specific
    pages?: {
      enabledOnly?: boolean;
      customDomains?: boolean;
    };
  };
  // URL Crawl
  urlCrawl?: {
    urls: string[];
    followRedirects?: boolean;
    maxDepth?: number;
    waitForSelectors?: string[];  // Wait for specific elements
    extractAssets?: boolean;      // Download screenshots, logos
  };
  // Docker
  docker?: {
    registryUrl: string;
    token: string;
    imageFilter?: string;         // e.g., "velyon/*"
  };
  // Kubernetes
  kubernetes?: {
    kubeconfig: string;
    namespaces?: string[];
    labelSelector?: string;       // e.g., "velyon.io/product=true"
  };
}

export interface DiscoveredItem {
  id: string;
  sourceType: 'webapp' | 'ai-tool' | 'system' | 'product' | 'extension' | 'api' | 'library' | 'pipeline';
  
  // Discovery Metadata
  discoveredAt: string;
  discoveryMethod: DiscoveryMethod;
  discoveryStatus: DiscoveryStatus;
  sourceConfigSnapshot: Partial<DiscoverySourceConfig>; // What config was used

  // Catalog: which showcase this item belongs to. Client work (case-study) is kept
  // structurally separate from Velyon's own proprietary tools/systems (product) so
  // the two can be listed independently and then cross-linked (see relatedProducts /
  // relatedCases below) without conflating "work we did for a client" with "IP we built and own."
  catalogType: CatalogType;

  // Source References
  sourceUrl?: string;             // Primary URL (deployed app, repo, package)
  repoUrl?: string;               // GitHub/GitLab repo
  deployUrl?: string;             // Live deployment URL
  packageUrl?: string;            // npm, PyPI, Docker Hub, etc.
  docsUrl?: string;               // Documentation site
  
  // Identity
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;
  
  // Classification
  status: 'production' | 'beta' | 'alpha' | 'deprecated' | 'archived' | 'internal';
  visibility: 'public' | 'client-approved' | 'redacted' | 'internal-only';
  industryTags: string[];
  capabilityTags: string[];
  productTags: string[];
  
  // Technical Stack (enriched from discovery)
  techStack: TechStack;
  
  // Metrics & Impact
  metrics: CaseStudyMetric[];
  
  // Media Assets
  assets: PortfolioAsset[];
  
  // Client Context (for redaction logic)
  clientContext: ClientContext;
  
  // Team & Process
  team: TeamMember[];
  methodologyPhases: string[];
  
  // Cross-linking
  relatedProducts: string[];
  relatedCases: string[];
  relatedIndustries: string[];
  
  // Content Generation Hints
  contentHints: ContentHints;
  
  // Comments/Annotations
  comments: DiscoveryComment[];
  
  // Enrichment Tracking
  enrichmentHistory: EnrichmentEntry[];

  // Gap 1: Client Intake & Narrative Capture
  clientIntake?: ClientIntake;

  // Gap 2: Client Testimonials & Social Proof
  testimonials?: Testimonial[];

  // Gap 3: Before/After Transformation Evidence
  transformation?: TransformationEvidence;

  // Gap 4: Project Delivery Metadata
  deliveryMetadata?: DeliveryMetadata;

  // Gap 5: Methodology Walkthrough
  methodologyWalkthrough?: MethodologyPhase[];

  // Gap 6: Client Approval Workflow
  approvalWorkflow?: ApprovalWorkflow;

  // Gap 7: Performance & Analytics Data
  performanceData?: PerformanceData;

  // Gap 8: Competitive/Alternative Context
  competitiveContext?: CompetitiveContext;

  // Gap 9: Docker & Kubernetes Discovery
  containerConfig?: ContainerConfig;

  // Gap 10: Post-Launch Impact Tracking
  postLaunchTracking?: PostLaunchTracking;

  // Gap 11: Case Study Templates & Format Engine
  suggestedTemplate?: CaseStudyTemplate;

  // Gap 12: Export & Multi-Format Output
  exportConfigs?: ExportConfig[];

  // Gap 13: Velyon Product Profile (only meaningful when catalogType === 'product')
  productProfile?: ProductProfile;

  // Gap 14: AI Classification — what type of AI methodology, architecture, and tools this item uses.
  // Replaces the Team tab which was always the same on every entry.
  aiClassification?: AIClassification;
}

export interface TechStack {
  frontend: StackEntry[];
  backend: StackEntry[];
  ai: StackEntry[];
  infrastructure: StackEntry[];
  monitoring: StackEntry[];
  database: StackEntry[];
  messaging: StackEntry[];
  auth: StackEntry[];
  testing: StackEntry[];
  cicd: StackEntry[];
}

export interface StackEntry {
  name: string;
  version?: string;
  category: string;
  confidence: 'detected' | 'inferred' | 'manual' | 'fabricated';
  source: 'package.json' | 'wappalyzer' | 'header' | 'meta-tag' | 'dockerfile' | 'k8s-manifest' | 'user-input' | 'ai-generated';
  detectedAt: string;
  // For fabricated entries
  commentId?: string;
}

export interface CaseStudyMetric {
  id: string;
  label: string;
  value: string;
  context: string;
  category: 'speed' | 'cost' | 'accuracy' | 'adoption' | 'revenue' | 'efficiency' | 'latency' | 'throughput' | 'quality' | 'custom';
  isHero: boolean;
  verified: boolean;
  verificationSource?: string;
  // For fabricated/estimated metrics
  estimationMethod?: 'industry-benchmark' | 'similar-project' | 'extrapolation' | 'client-report' | 'educated-guess';
  confidenceInterval?: { min: string; max: string };
  commentId?: string;
}

export interface PortfolioAsset {
  id: string;
  type: 'screenshot' | 'architecture-diagram' | 'video-demo' | 'logo' | 'ui-component' | 'data-viz' | 'testimonial-video' | 'code-snippet' | 'wireframe' | 'flowchart' | 'dashboard-capture';
  url: string;
  alt: string;
  caption?: string;
  isHero: boolean;
  redactedVersion?: string;
  // Generation metadata
  generatedBy?: 'crawler' | 'user-upload' | 'ai-generated' | 'figma-export' | 'code-extraction';
  generatedAt?: string;
  commentId?: string;
}

export interface ClientContext {
  isNamed: boolean;
  clientName?: string;
  clientLogo?: string;
  archetype?: string;
  ndaStatus: 'approved' | 'pending' | 'denied' | 'internal' | 'unknown';
  approvedAssets: string[];
  // Redaction rules
  redactionRules?: {
    hideMetrics?: string[];           // Metric IDs to hide
    anonymizeMetrics?: string[];      // Metric IDs to anonymize
    hideTechStack?: string[];         // Stack entry names to hide
    replaceClientReferences?: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
  email?: string;
  isVelyon: boolean;
  contribution: string;
  // Time tracking
  hoursInvested?: number;
  period?: { start: string; end?: string };
  commentId?: string;
}

export interface ContentHints {
  suggestedCaseStudyFormat: 'technical-deep-dive' | 'business-outcome' | 'transformation-story' | 'product-showcase' | 'architecture-review';
  keyTechnicalInsights: string[];
  replicablePatterns: string[];
  notableConstraints: string[];
  targetAudiences: ('cto' | 'vp-eng' | 'ml-engineer' | 'product-manager' | 'investor' | 'peer')[];
  seoKeywords: string[];
  competitiveDifferentiators: string[];
}

export interface EnrichmentEntry {
  id: string;
  timestamp: string;
  triggeredBy: 'discovery' | 'crawler' | 'github-sync' | 'user-edit' | 'ai-enrichment' | 'scheduled';
  fieldsUpdated: string[];
  source: string;
  changes: { field: string; oldValue: any; newValue: any }[];
}

export interface DiscoverySession {
  id: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed' | 'partial';
  sourceConfigs: DiscoverySourceConfig;
  itemsDiscovered: number;
  itemsEnriched: number;
  itemsWithComments: number;
  errors: DiscoveryError[];
}

export interface DiscoveryError {
  source: string;
  itemId?: string;
  error: string;
  timestamp: string;
  recoverable: boolean;
}

// Generation Request Types
export interface FieldGenerationRequest {
  fieldPath: string;
  currentValue: any;
  prompt: string;
  context: string;
  examples?: any[];
  constraints?: string;
  model?: 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gpt-4o' | 'claude-3.5-sonnet';
  temperature?: number;
}

// Batch Generation Output
export interface BatchGenerationJob {
  id: string;
  name: string;
  createdAt: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  items: string[]; // DiscoveredItem IDs
  outputChannels: string[];
  synthesisConfigs: Record<string, any>;
  results: GenerationResult[];
}

export interface GenerationResult {
  itemId: string;
  success: boolean;
  outputs: Record<string, string>; // channel -> content
  errors?: string[];
  synthesisLogs: string[];
}

// ============================================================
// GAP TYPES: 12 Missing Features for Complete Case Study Capture
// ============================================================

// Gap 1: Client Intake & Narrative Capture
export interface ClientIntake {
  problemStatement: string;
  businessObjectives: string[];
  decisionContext: string;
  stakeholderQuotes: StakeholderQuote[];
  alternativesConsidered: string[];
  whyVelyonWon: string;
  projectScope: string;
  successCriteria: string[];
}

export interface StakeholderQuote {
  name: string;
  role: string;
  quote: string;
  approved: boolean;
  recordedAt?: string;
}

// Gap 2: Client Testimonials & Social Proof
export interface Testimonial {
  id: string;
  type: 'text' | 'video' | 'audio';
  content: string;
  attribution: string;
  role: string;
  company?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  assetUrl?: string;
  recordedAt?: string;
  tags?: string[];
}

// Gap 3: Before/After Transformation Evidence
export interface TransformationEvidence {
  before: EvidenceSnapshot;
  after: EvidenceSnapshot;
  timeline: string;
  metrics: MetricComparison[];
  narrativeSummary: string;
}

export interface EvidenceSnapshot {
  screenshots: string[];
  architectureDiagram?: string;
  description: string;
  capturedAt?: string;
}

export interface MetricComparison {
  metric: string;
  before: string;
  after: string;
  improvement: string;
  unit?: string;
}

// Gap 4: Project Delivery Metadata
export interface DeliveryMetadata {
  budgetRange: string;
  timeline: string;
  teamSize: number;
  engagementModel: 'fixed-price' | 'time-and-materials' | 'retainer' | 'equity' | 'pro-bono';
  startDate: string;
  endDate?: string;
  totalHours?: number;
  projectManager?: string;
}

// Gap 5: Methodology Walkthrough
export interface MethodologyPhase {
  name: string;
  description: string;
  deliverables: string[];
  challenges: string;
  duration: string;
  order: number;
  keyDecisions?: string[];
}

// Gap 6: Client Approval Workflow
export interface ApprovalWorkflow {
  ndaStatus: 'none' | 'pending' | 'active' | 'expired';
  ndaExpiryDate?: string;
  signOffTracking: SignOff[];
  assetClearance: AssetClearance[];
  legalContact?: string;
}

export interface SignOff {
  person: string;
  role: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface AssetClearance {
  assetId: string;
  assetType: string;
  status: 'cleared' | 'restricted' | 'blocked';
  restrictions?: string;
  clearedBy?: string;
  clearedAt?: string;
}

// Gap 7: Performance & Analytics Data
export interface PerformanceData {
  lighthouseScore?: { performance: number; accessibility: number; seo: number; bestPractices: number };
  coreWebVitals?: { lcp: string; fid: string; cls: string; ttfb: string };
  conversionRate?: string;
  trafficData?: { monthlyVisits: string; bounceRate: string; avgSessionDuration: string };
  analyticsSource?: string;
  lastMeasured?: string;
}

// Gap 8: Competitive/Alternative Context
export interface CompetitiveContext {
  alternativesEvaluated: Alternative[];
  whyVelyonWon: string;
  differentiators: string[];
  buyerJourney: string;
  decisionFactors: string[];
}

export interface Alternative {
  name: string;
  type: 'diy' | 'competitor' | 'agency' | 'internal-team';
  estimatedCost?: string;
  pros: string[];
  cons: string[];
  whyNotChosen: string;
}

// Gap 9: Docker & Kubernetes Discovery
export interface ContainerConfig {
  dockerImages: DockerImage[];
  kubernetesManifests: K8sManifest[];
  helmCharts?: HelmChart[];
  deploymentEnvironment: string;
}

export interface DockerImage {
  name: string;
  tag: string;
  registry: string;
  size?: string;
  lastUpdated?: string;
}

export interface K8sManifest {
  name: string;
  namespace: string;
  kind: string;
  replicas?: number;
  resources?: string;
}

export interface HelmChart {
  name: string;
  version: string;
  repository: string;
}

// Gap 10: Post-Launch Impact Tracking
export interface PostLaunchTracking {
  roi30Day?: ROISnapshot;
  roi60Day?: ROISnapshot;
  roi90Day?: ROISnapshot;
  npsScore?: number;
  clientSatisfaction?: string;
  renewalStatus?: 'renewed' | 'expanding' | 'at-risk' | 'churned';
  lastUpdated?: string;
}

export interface ROISnapshot {
  revenueImpact: string;
  costSavings: string;
  efficiencyGain: string;
  customMetrics?: { label: string; value: string }[];
  measuredAt: string;
}

// Gap 11: Case Study Templates & Format Engine
export interface CaseStudyTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  promptTemplate: string;
  targetAudience: string[];
  estimatedLength: string;
}

export interface TemplateSection {
  name: string;
  prompt: string;
  required: boolean;
  order: number;
}

// Gap 12: Export & Multi-Format Output
export interface ExportConfig {
  format: 'notebooklm' | 'cinematic' | 'pdf' | 'cms' | 'social' | 'markdown';
  template?: string;
  includeMetrics: boolean;
  includeTestimonials: boolean;
  includeMethodology: boolean;
  brandVoice?: string;
  customSections?: string[];
}

// Gap 13: Velyon Product Profile (proprietary tools/systems Velyon built and owns —
// distinct from client case studies). Intentionally has NO pricing/tier fields yet.
export interface ProductProfile {
  deliveryModel: ('consulting-led' | 'co-build' | 'license' | 'managed')[];
  maturityStage: 'concept' | 'alpha' | 'beta' | 'production' | 'sunset';
  targetUseCases: string[];
  keyCapabilities: string[];
  internalOnly: boolean; // true = not yet ready to appear in the public /products catalog
}

// AI Classification — what type of AI methodology, architecture, and tools the item uses.
// Replaces the Team tab (which was always "Dean + AI agents" on every entry and carried zero signal).
export type AICategory =
  | 'agentic-ai' | 'generative-ai' | 'predictive-ai' | 'computer-vision'
  | 'nlp' | 'recommendation' | 'anomaly-detection' | 'speech-audio'
  | 'custom-models' | 'data-mlops' | 'edge-ai' | 'knowledge-reasoning';

export type AIArchitecture =
  | 'multi-agent' | 'rag-pipeline' | 'single-agent-tools' | 'model-pipeline'
  | 'fine-tuned-model' | 'api-orchestration' | 'real-time-streaming'
  | 'batch-processing' | 'hybrid-complex';

export type AIAutonomyLevel =
  | 'fully-autonomous' | 'human-in-the-loop' | 'human-approval-required' | 'advisory-only';

export interface AIClassification {
  primaryCategories: AICategory[];
  architecturePattern: AIArchitecture | '';
  modelsUsed: string[];
  autonomyLevel: AIAutonomyLevel | '';
  methodologies: string[];
  confidence?: number;
  source?: 'manual' | 'auto-classify-url' | 'deep-scan-github';
  lastClassifiedAt?: string;
}