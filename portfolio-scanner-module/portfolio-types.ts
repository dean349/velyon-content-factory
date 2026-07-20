export type DiscoveryMethod = 
  | 'vercel' 
  | 'netlify' 
  | 'cloudflare' 
  | 'github-repo' 
  | 'github-pages' 
  | 'url-crawl' 
  | 'docker' 
  | 'kubernetes' 
  | 'manual-entry';

export type DiscoveryStatus = 'pending' | 'discovered' | 'enriched' | 'curated' | 'redacted' | 'generation-ready' | 'archived';

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
  fieldPath: string;
  type: CommentType;
  content: string;
  author: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  generationPrompt?: string;
  generationContext?: string;
  fabricationConfidence?: number;
  fabricationSource?: string;
}

export interface DiscoverySourceConfig {
  vercel?: {
    teamId: string;
    token: string;
    includePreviewDeployments?: boolean;
  };
  netlify?: {
    siteIds: string[];
    token: string;
  };
  cloudflare?: {
    accountId: string;
    apiToken: string;
    projectNames?: string[];
  };
  github?: {
    org: string;
    token?: string;
    includePrivate?: boolean;
    repoFilter?: {
      topics?: string[];
      languages?: string[];
      pushedAfter?: string;
      archived?: boolean;
    };
    pages?: {
      enabledOnly?: boolean;
      customDomains?: boolean;
    };
  };
  urlCrawl?: {
    urls: string[];
    followRedirects?: boolean;
    maxDepth?: number;
    waitForSelectors?: string[];
    extractAssets?: boolean;
  };
  docker?: {
    registryUrl: string;
    token: string;
    imageFilter?: string;
  };
  kubernetes?: {
    kubeconfig: string;
    namespaces?: string[];
    labelSelector?: string;
  };
}

export interface DiscoveredItem {
  id: string;
  sourceType: 'webapp' | 'ai-tool' | 'system' | 'product' | 'extension' | 'api' | 'library' | 'pipeline';
  discoveredAt: string;
  discoveryMethod: DiscoveryMethod;
  discoveryStatus: DiscoveryStatus;
  sourceConfigSnapshot: Partial<DiscoverySourceConfig>;
  sourceUrl?: string;
  repoUrl?: string;
  deployUrl?: string;
  packageUrl?: string;
  docsUrl?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;
  status: 'production' | 'beta' | 'alpha' | 'deprecated' | 'archived' | 'internal';
  visibility: 'public' | 'client-approved' | 'redacted' | 'internal-only';
  industryTags: string[];
  capabilityTags: string[];
  productTags: string[];
  techStack: TechStack;
  metrics: CaseStudyMetric[];
  assets: PortfolioAsset[];
  clientContext: ClientContext;
  team: TeamMember[];
  methodologyPhases: string[];
  relatedProducts: string[];
  relatedCases: string[];
  relatedIndustries: string[];
  contentHints: ContentHints;
  comments: DiscoveryComment[];
  enrichmentHistory: EnrichmentEntry[];
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
  redactionRules?: {
    hideMetrics?: string[];
    anonymizeMetrics?: string[];
    hideTechStack?: string[];
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

export interface BatchGenerationJob {
  id: string;
  name: string;
  createdAt: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  items: string[];
  outputChannels: string[];
  synthesisConfigs: Record<string, any>;
  results: GenerationResult[];
}

export interface GenerationResult {
  itemId: string;
  success: boolean;
  outputs: Record<string, string>;
  errors?: string[];
  synthesisLogs: string[];
}