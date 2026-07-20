import { 
  DiscoveredItem, 
  DiscoveryMethod, 
  DiscoverySourceConfig, 
  DiscoveryComment,
  CommentType,
  TechStack,
  StackEntry,
  CaseStudyMetric,
  PortfolioAsset,
  ClientContext,
  TeamMember,
  ContentHints,
  EnrichmentEntry,
  FieldGenerationRequest,
  DiscoveryStatus,
  CatalogType
} from '../types/portfolio';

export class PortfolioScanner {
  private items: Map<string, DiscoveredItem> = new Map();
  private comments: Map<string, DiscoveryComment[]> = new Map();
  private generationQueue: FieldGenerationRequest[] = [];

  // ============================================================
  // DISCOVERY METHODS
  // ============================================================

  // 1. Vercel Projects Discovery
  async discoverVercelProjects(config: DiscoverySourceConfig['vercel']): Promise<DiscoveredItem[]> {
    if (!config?.teamId || !config?.token) {
      throw new Error('Vercel discovery requires teamId and token');
    }

    const items: DiscoveredItem[] = [];
    let hasMore = true;
    let after: string | undefined;

    while (hasMore) {
      const url = new URL('https://api.vercel.com/v9/projects');
      url.searchParams.set('teamId', config.teamId);
      url.searchParams.set('limit', '100');
      if (after) url.searchParams.set('after', after);
      if (config.includePreviewDeployments) url.searchParams.set('includePreviewDeployments', 'true');

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${config.token}` }
      });

      if (!res.ok) {
        throw new Error(`Vercel API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const projects = data.projects || [];

      for (const project of projects) {
        items.push(this.transformVercelProject(project, config));
      }

      hasMore = data.pagination?.hasMore || false;
      after = data.pagination?.next?.after;
    }

    return items;
  }

  private transformVercelProject(project: any, config: DiscoverySourceConfig['vercel']): DiscoveredItem {
    const framework = project.framework || 'Unknown';
    const repoUrl = project.gitRepository 
      ? `https://github.com/${project.gitRepository}` 
      : undefined;

    return this.createBaseItem({
      id: `vercel-${project.id}`,
      sourceType: 'webapp',
      discoveryMethod: 'vercel',
      sourceUrl: `https://${project.name}.vercel.app`,
      deployUrl: `https://${project.name}.vercel.app`,
      repoUrl,
      name: project.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      slug: project.name.toLowerCase(),
      tagline: `Deployed on Vercel • ${framework}`,
      description: `Production web application deployed on Vercel with automatic CI/CD. Framework: ${framework}. ${project.updatedAt ? `Last deployed: ${new Date(project.updatedAt).toLocaleDateString()}.` : ''}`,
      techStack: {
        frontend: [{ name: framework, category: 'frontend', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        backend: [],
        ai: [],
        infrastructure: [{ name: 'Vercel', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Edge Network', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Git Integration', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        monitoring: [{ name: 'Vercel Analytics', category: 'monitoring', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Vercel Speed Insights', category: 'monitoring', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        database: [],
        messaging: [],
        auth: [],
        testing: [],
        cicd: [{ name: 'Vercel Git Integration', category: 'cicd', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }]
      },
      status: 'production',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { vercel: { teamId: config?.teamId || '', token: config?.token || '', includePreviewDeployments: config?.includePreviewDeployments } },
      comments: []
    });
  }

  // 2. Netlify Sites Discovery
  async discoverNetlifySites(config: DiscoverySourceConfig['netlify']): Promise<DiscoveredItem[]> {
    if (!config?.siteIds?.length || !config?.token) {
      throw new Error('Netlify discovery requires siteIds and token');
    }

    const items: DiscoveredItem[] = [];

    for (const siteId of config.siteIds) {
      const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
        headers: { Authorization: `Bearer ${config.token}` }
      });

      if (!res.ok) continue;

      const site = await res.json();
      items.push(this.transformNetlifySite(site, config));
    }

    return items;
  }

  private transformNetlifySite(site: any, config: DiscoverySourceConfig['netlify']): DiscoveredItem {
    const buildSettings = site.build_settings || {};
    const framework = buildSettings.framework || 'Static Site';

    return this.createBaseItem({
      id: `netlify-${site.id}`,
      sourceType: 'webapp',
      discoveryMethod: 'netlify',
      sourceUrl: site.url,
      deployUrl: site.ssl_url || site.url,
      repoUrl: site.repo_url,
      name: site.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      slug: site.name.toLowerCase(),
      tagline: `Hosted on Netlify • ${framework}`,
      description: `Web application deployed on Netlify with continuous deployment. Build command: ${buildSettings.cmd || 'N/A'}. Framework: ${framework}.`,
      techStack: {
        frontend: [{ name: framework, category: 'frontend', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        backend: [],
        ai: [],
        infrastructure: [{ name: 'Netlify', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Edge Functions', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Netlify Forms', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Netlify Identity', category: 'infrastructure', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        monitoring: [{ name: 'Netlify Analytics', category: 'monitoring', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }],
        database: [],
        messaging: [],
        auth: site.identity_instances?.length ? [{ name: 'Netlify Identity', category: 'auth', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }] : [],
        testing: [],
        cicd: [{ name: 'Netlify Build', category: 'cicd', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }, { name: 'Git Integration', category: 'cicd', confidence: 'detected', source: 'header', detectedAt: new Date().toISOString() }]
      },
      status: site.state === 'ready' ? 'production' : 'beta',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { netlify: { siteIds: config?.siteIds || [], token: config?.token || '' } },
      comments: []
    });
  }

  // 3. GitHub Repositories Discovery
  async discoverGitHubRepos(config: DiscoverySourceConfig['github']): Promise<DiscoveredItem[]> {
    if (!config?.org) {
      throw new Error('GitHub discovery requires org');
    }

    const items: DiscoveredItem[] = [];
    let page = 1;
    let hasMore = true;

    const headers: HeadersInit = { 
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (config.token) headers['Authorization'] = `Bearer ${config.token}`;

    while (hasMore) {
      const url = new URL(`https://api.github.com/orgs/${config.org}/repos`);
      url.searchParams.set('per_page', '100');
      url.searchParams.set('page', page.toString());
      url.searchParams.set('type', config.includePrivate ? 'all' : 'public');
      url.searchParams.set('sort', 'pushed');
      url.searchParams.set('direction', 'desc');

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) {
        if (res.status === 403) throw new Error('GitHub API rate limited or unauthorized');
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const repos = await res.json();
      if (!repos.length) break;

      for (const repo of repos) {
        if (this.shouldIncludeRepo(repo, config.repoFilter)) {
          items.push(await this.transformGitHubRepo(repo, config));
        }
      }

      hasMore = repos.length === 100;
      page++;

      // Rate limit courtesy
      await new Promise(r => setTimeout(r, 100));
    }

    return items;
  }

  private shouldIncludeRepo(repo: any, filter?: { topics?: string[]; languages?: string[]; pushedAfter?: string; archived?: boolean }): boolean {
    if (!filter) return true;
    if (filter.archived === false && repo.archived) return false;
    if (filter.pushedAfter && new Date(repo.pushed_at) < new Date(filter.pushedAfter)) return false;
    if (filter.languages?.length && !filter.languages.includes(repo.language)) return false;
    if (filter.topics?.length && !filter.topics.some((t: string) => repo.topics?.includes(t))) return false;
    return true;
  }

  private async transformGitHubRepo(repo: any, config: DiscoverySourceConfig['github']): Promise<DiscoveredItem> {
    const now = new Date().toISOString();
    // Detect source type from topics
    const topics = repo.topics || [];
    let sourceType: DiscoveredItem['sourceType'] = 'webapp';
    if (topics.some((t: string) => ['ai', 'llm', 'ml', 'rag', 'agent'].includes(t))) sourceType = 'ai-tool';
    if (topics.some((t: string) => ['library', 'sdk', 'package'].includes(t))) sourceType = 'library';
    if (topics.some((t: string) => ['pipeline', 'etl', 'data-engineering'].includes(t))) sourceType = 'pipeline';
    if (topics.some((t: string) => ['extension', 'plugin', 'vscode'].includes(t))) sourceType = 'extension';
    if (topics.some((t: string) => ['api', 'backend', 'microservice'].includes(t))) sourceType = 'api';

    // Get languages
    let languages: string[] = [];
    if (repo.language) languages.push(repo.language);
    if (config?.token) {
      try {
        const langRes = await fetch(`https://api.github.com/repos/${repo.full_name}/languages`, {
          headers: { Authorization: `Bearer ${config.token}` }
        });
        if (langRes.ok) {
          const langData = await langRes.json();
          languages = Object.keys(langData);
        }
      } catch {}
    }

    // Get readme for long description
    let longDescription: string | undefined;
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
        headers: { Authorization: `Bearer ${config?.token}`, Accept: 'application/vnd.github.v3.raw' }
      });
      if (readmeRes.ok) {
        longDescription = await readmeRes.text();
      }
    } catch {}

    // Detect deploy URL from GitHub Pages or repo metadata
    let deployUrl: string | undefined;
    if (repo.has_pages) {
      const owner = repo.owner.login;
      deployUrl = `https://${owner}.github.io/${repo.name}/`;
    }

    return this.createBaseItem({
      id: `github-${repo.id}`,
      sourceType,
      discoveryMethod: repo.has_pages ? 'github-pages' : 'github-repo',
      sourceUrl: repo.html_url,
      repoUrl: repo.html_url,
      deployUrl,
      packageUrl: repo.homepage,
      name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      slug: repo.name.toLowerCase(),
      tagline: repo.description || `${sourceType} • ${repo.language || 'Multi-language'} • ${repo.stargazers_count}★`,
      description: repo.description || `GitHub repository: ${repo.full_name}. ${repo.stargazers_count} stars, ${repo.forks_count} forks. Primary language: ${repo.language || 'N/A'}.`,
      longDescription,
      techStack: {
        frontend: languages.filter(l => ['TypeScript', 'JavaScript', 'TSX', 'JSX', 'Vue', 'Svelte'].includes(l)).map(l => ({ name: l, category: 'frontend', confidence: 'detected' as const, source: 'header' as const, detectedAt: now })),
        backend: languages.filter(l => ['Python', 'Go', 'Rust', 'Java', 'C#', 'Node.js', 'Ruby', 'PHP'].includes(l)).map(l => ({ name: l, category: 'backend', confidence: 'detected' as const, source: 'header' as const, detectedAt: now })),
        ai: topics.filter((t: string) => ['langchain', 'llamaindex', 'pinecone', 'weaviate', 'chromadb', 'qdrant', 'milvus', 'ollama', 'huggingface', 'transformers', 'pytorch', 'tensorflow', 'jax'].includes(t)).map((t: string) => ({ name: t, category: 'ai', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        infrastructure: ['GitHub Actions', 'Docker'].concat(topics.filter((t: string) => ['kubernetes', 'terraform', 'ansible', 'aws', 'gcp', 'azure'].includes(t))).map((t: string) => ({ name: t, category: 'infrastructure', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        monitoring: topics.filter((t: string) => ['prometheus', 'grafana', 'datadog', 'sentry'].includes(t)).map((t: string) => ({ name: t, category: 'monitoring', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        database: topics.filter((t: string) => ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'supabase', 'planetscale', 'neon'].includes(t)).map((t: string) => ({ name: t, category: 'database', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        messaging: topics.filter((t: string) => ['kafka', 'rabbitmq', 'nats', 'redis-streams'].includes(t)).map((t: string) => ({ name: t, category: 'messaging', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        auth: topics.filter((t: string) => ['clerk', 'auth0', 'nextauth', 'supabase-auth', 'firebase-auth'].includes(t)).map((t: string) => ({ name: t, category: 'auth', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        testing: topics.filter((t: string) => ['jest', 'vitest', 'playwright', 'cypress', 'pytest'].includes(t)).map((t: string) => ({ name: t, category: 'testing', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now })),
        cicd: ['GitHub Actions'].concat(topics.filter((t: string) => ['argo', 'tekton', 'jenkins'].includes(t))).map((t: string) => ({ name: t, category: 'cicd', confidence: 'inferred' as const, source: 'meta-tag' as const, detectedAt: now }))
      },
      status: repo.archived ? 'archived' : repo.has_pages ? 'production' : 'beta',
      visibility: repo.private ? 'internal-only' : 'public',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { github: { org: config?.org || '', includePrivate: config?.includePrivate } },
      comments: [],
      metrics: repo.stargazers_count ? [{
        id: `github-stars-${repo.id}`,
        label: 'GitHub Stars',
        value: repo.stargazers_count.toLocaleString(),
        context: 'community adoption & credibility',
        category: 'adoption',
        isHero: true,
        verified: true,
        verificationSource: 'GitHub API'
      }] : []
    });
  }

  // 5. URL Crawl Discovery
  async discoverFromUrls(config: DiscoverySourceConfig['urlCrawl']): Promise<DiscoveredItem[]> {
    if (!config?.urls?.length) {
      throw new Error('URL crawl requires at least one URL');
    }

    const items: DiscoveredItem[] = [];

    for (const url of config.urls) {
      try {
        const item = await this.crawlUrlForPortfolioData(url, config);
        items.push(item);
      } catch (error) {
        console.error(`Failed to crawl ${url}:`, error);
        // Create minimal item with error comment
        const errorItem = this.createBaseItem({
          id: `url-${this.hashUrl(url)}`,
          sourceType: 'webapp',
          discoveryMethod: 'url-crawl',
          sourceUrl: url,
          deployUrl: url,
          name: this.extractNameFromUrl(url),
          slug: this.urlToSlug(url),
          tagline: 'Discovered via URL crawl (partial)',
          description: `Attempted to crawl ${url}. ${error instanceof Error ? error.message : 'Unknown error'}. Manual enrichment required.`,
          techStack: this.getEmptyTechStack(),
          status: 'beta',
          discoveryStatus: 'discovered',
          sourceConfigSnapshot: { urlCrawl: { urls: config.urls } },
          comments: [{
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            itemId: `url-${this.hashUrl(url)}`,
            fieldPath: 'techStack',
            type: 'missing-info',
            content: `Crawler failed: ${error instanceof Error ? error.message : 'Unknown error'}. Tech stack needs manual entry.`,
            author: 'system',
            createdAt: new Date().toISOString(),
            resolved: false
          }]
        });
        items.push(errorItem);
      }
    }

    return items;
  }

  private async crawlUrlForPortfolioData(url: string, config: DiscoverySourceConfig['urlCrawl']): Promise<DiscoveredItem> {
    // This would integrate with your existing handleWebCrawl in FactoryView
    // For now, return a structured item that the crawler can enrich
    const hostname = new URL(url).hostname;
    const name = hostname.replace('www.', '').split('.')[0];
    
    return this.createBaseItem({
      id: `url-${this.hashUrl(url)}`,
      sourceType: 'webapp',
      discoveryMethod: 'url-crawl',
      sourceUrl: url,
      deployUrl: url,
      name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
      slug: this.urlToSlug(url),
      tagline: 'Discovered via URL crawl',
      description: `Web application discovered at ${url}. Awaiting full crawl enrichment.`,
      techStack: this.getEmptyTechStack(),
      status: 'production',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { urlCrawl: { urls: config?.urls || [], followRedirects: config?.followRedirects } },
      comments: []
    });
  }

  // ============================================================
  // COMMENT SYSTEM
  // ============================================================

  addComment(itemId: string, comment: Omit<DiscoveryComment, 'id' | 'itemId' | 'createdAt' | 'resolved'>): DiscoveryComment {
    const newComment: DiscoveryComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      createdAt: new Date().toISOString(),
      resolved: false
    };

    const existing = this.comments.get(itemId) || [];
    existing.push(newComment);
    this.comments.set(itemId, existing);

    // Also add to item if it exists
    const item = this.items.get(itemId);
    if (item) {
      item.comments = existing;
    }

    return newComment;
  }

  resolveComment(itemId: string, commentId: string, resolvedBy: string): boolean {
    const comments = this.comments.get(itemId);
    if (!comments) return false;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return false;

    comment.resolved = true;
    comment.resolvedAt = new Date().toISOString();
    comment.resolvedBy = resolvedBy;

    const item = this.items.get(itemId);
    if (item) {
      item.comments = comments;
    }

    return true;
  }

  getComments(itemId: string): DiscoveryComment[] {
    return this.comments.get(itemId) || [];
  }

  getUnresolvedComments(itemId: string): DiscoveryComment[] {
    return (this.comments.get(itemId) || []).filter(c => !c.resolved);
  }

  // Helper to add structured comments for common scenarios
  flagMissingInfo(itemId: string, fieldPath: string, details: string): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'missing-info',
      content: `Missing information for ${fieldPath}: ${details}`,
      author: 'user',
      generationPrompt: `Generate appropriate value for ${fieldPath} based on context: ${details}`,
      generationContext: `Field path: ${fieldPath}. Current project context available in item.`
    });
  }

  requestAutoGenerate(itemId: string, fieldPath: string, prompt: string, context?: string, model?: FieldGenerationRequest['model']): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'auto-generate',
      content: `Auto-generation requested for ${fieldPath}`,
      author: 'user',
      generationPrompt: prompt,
      generationContext: context
    });
  }

  markFabricated(itemId: string, fieldPath: string, value: any, confidence: number, source: DiscoveryComment['fabricationSource']): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'fabricated',
      content: `Fabricated/estimated value for ${fieldPath}: ${JSON.stringify(value)} (confidence: ${Math.round(confidence * 100)}%)`,
      author: 'user',
      fabricationConfidence: confidence,
      fabricationSource: source
    });
  }

  // ============================================================
  // GENERATION REQUEST QUEUE
  // ============================================================

  queueGenerationRequest(request: FieldGenerationRequest): void {
    this.generationQueue.push(request);
  }

  getGenerationQueue(): FieldGenerationRequest[] {
    return [...this.generationQueue];
  }

  clearGenerationQueue(): void {
    this.generationQueue = [];
  }

  // ============================================================
  // MANUAL ENTRY (for items that aren't scanned — e.g. internal tools/CLIs,
  // or any of Velyon's own products that don't have their own Vercel/GitHub deploy)
  // ============================================================

  createManualEntry(name: string, catalogType: CatalogType): DiscoveredItem {
    return this.createBaseItem({
      name,
      catalogType,
      discoveryMethod: 'manual-entry',
      discoveryStatus: 'discovered',
      sourceType: catalogType === 'product' ? 'product' : 'webapp',
      ...(catalogType === 'product' ? {
        productProfile: {
          deliveryModel: [],
          maturityStage: 'beta',
          targetUseCases: [],
          keyCapabilities: [],
          internalOnly: true
        }
      } : {})
    });
  }

  // ============================================================
  // CROSS-LINK SYNC: Client case studies declare which Velyon products they used
  // (item.relatedProducts, edited on the case-study side). This derives the reverse
  // link — which case studies used each product (item.relatedCases on product items)
  // — so the relationship only has to be declared once and stays consistent.
  // ============================================================

  syncCrossLinks(allItems: DiscoveredItem[]): DiscoveredItem[] {
    const casesByProductId = new Map<string, string[]>();

    for (const item of allItems) {
      if (item.catalogType !== 'case-study') continue;
      for (const productId of item.relatedProducts || []) {
        const existing = casesByProductId.get(productId) || [];
        if (!existing.includes(item.id)) existing.push(item.id);
        casesByProductId.set(productId, existing);
      }
    }

    return allItems.map(item => {
      if (item.catalogType !== 'product') return item;
      const derivedCases = casesByProductId.get(item.id) || [];
      const sameSet =
        derivedCases.length === (item.relatedCases || []).length &&
        derivedCases.every(id => (item.relatedCases || []).includes(id));
      if (sameSet) return item;
      return { ...item, relatedCases: derivedCases };
    });
  }

  // ============================================================
  // BASE ITEM CREATION
  // ============================================================

  private createBaseItem(partial: Partial<DiscoveredItem>): DiscoveredItem {
    const now = new Date().toISOString();
    const id = partial.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const item: DiscoveredItem = {
      id,
      sourceType: partial.sourceType || 'webapp',
      discoveredAt: partial.discoveredAt || now,
      discoveryMethod: partial.discoveryMethod || 'manual-entry',
      discoveryStatus: partial.discoveryStatus || 'discovered',
      sourceConfigSnapshot: partial.sourceConfigSnapshot || {},
      catalogType: partial.catalogType || 'case-study',
      sourceUrl: partial.sourceUrl,
      repoUrl: partial.repoUrl,
      deployUrl: partial.deployUrl,
      packageUrl: partial.packageUrl,
      docsUrl: partial.docsUrl,
      name: partial.name || 'Unnamed Project',
      slug: partial.slug || this.slugify(partial.name || 'unnamed-project'),
      tagline: partial.tagline || '',
      description: partial.description || '',
      longDescription: partial.longDescription,
      status: partial.status || 'beta',
      visibility: partial.visibility || 'internal-only',
      industryTags: partial.industryTags || [],
      capabilityTags: partial.capabilityTags || [],
      productTags: partial.productTags || [],
      techStack: partial.techStack || this.getEmptyTechStack(),
      metrics: partial.metrics || [],
      assets: partial.assets || [],
      clientContext: partial.clientContext || {
        isNamed: false,
        ndaStatus: 'unknown',
        approvedAssets: []
      },
      team: partial.team || [],
      methodologyPhases: partial.methodologyPhases || [],
      relatedProducts: partial.relatedProducts || [],
      relatedCases: partial.relatedCases || [],
      relatedIndustries: partial.relatedIndustries || [],
      contentHints: partial.contentHints || {
        suggestedCaseStudyFormat: 'technical-deep-dive',
        keyTechnicalInsights: [],
        replicablePatterns: [],
        notableConstraints: [],
        targetAudiences: [],
        seoKeywords: [],
        competitiveDifferentiators: []
      },
      comments: partial.comments || [],
      enrichmentHistory: partial.enrichmentHistory || [{
        id: `enrich-${Date.now()}`,
        timestamp: now,
        triggeredBy: 'discovery',
        fieldsUpdated: Object.keys(partial),
        source: partial.discoveryMethod || 'manual-entry',
        changes: []
      }],
      productProfile: partial.productProfile
    };

    this.items.set(id, item);
    if (item.comments.length) {
      this.comments.set(id, item.comments);
    }

    return item;
  }

  private getEmptyTechStack(): TechStack {
    return {
      frontend: [],
      backend: [],
      ai: [],
      infrastructure: [],
      monitoring: [],
      database: [],
      messaging: [],
      auth: [],
      testing: [],
      cicd: []
    };
  }

  // ============================================================
  // ENRICHMENT & TRANSFORMATION
  // ============================================================

  enrichItem(itemId: string, updates: Partial<DiscoveredItem>, triggeredBy: EnrichmentEntry['triggeredBy'] = 'user-edit'): DiscoveredItem | null {
    const item = this.items.get(itemId);
    if (!item) return null;

    const changes: EnrichmentEntry['changes'] = [];
    for (const [key, newValue] of Object.entries(updates)) {
      const oldValue = (item as any)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue });
      }
    }

    const enrichedItem = { ...item, ...updates };
    enrichedItem.enrichmentHistory = [
      ...item.enrichmentHistory,
      {
        id: `enrich-${Date.now()}`,
        timestamp: new Date().toISOString(),
        triggeredBy,
        fieldsUpdated: Object.keys(updates),
        source: 'manual',
        changes
      }
    ];

    this.items.set(itemId, enrichedItem);
    return enrichedItem;
  }

  applyRedaction(itemId: string, level: 'full' | 'partial' | 'internal'): DiscoveredItem | null {
    const item = this.items.get(itemId);
    if (!item) return null;

    const redacted = { ...item };
    const now = new Date().toISOString();

    if (level === 'full' || item.visibility === 'redacted') {
      redacted.visibility = 'redacted';
      redacted.clientContext = {
        ...redacted.clientContext,
        isNamed: false,
        clientName: undefined,
        clientLogo: undefined,
        archetype: redacted.clientContext.archetype || this.generateArchetype(item),
        ndaStatus: 'denied'
      };
      redacted.assets = redacted.assets.map(a => ({
        ...a,
        url: a.redactedVersion || a.url,
        alt: `[REDACTED] ${a.alt}`
      }));
      redacted.metrics = redacted.metrics.map(m => ({
        ...m,
        context: m.context.replace(
          new RegExp(item.clientContext.clientName || '', 'gi'), 
          redacted.clientContext.archetype || 'Client'
        )
      }));

      // Add redaction comment
      this.addComment(itemId, {
        fieldPath: 'clientContext',
        type: 'general',
        content: `Applied full redaction. Client renamed to archetype: "${redacted.clientContext.archetype}"`,
        author: 'user'
      });
    }

    if (level === 'partial') {
      redacted.visibility = 'client-approved';
      redacted.clientContext = {
        ...redacted.clientContext,
        isNamed: true,
        ndaStatus: 'approved'
      };
    }

    if (level === 'internal') {
      redacted.visibility = 'internal-only';
    }

    redacted.enrichmentHistory.push({
      id: `enrich-${Date.now()}`,
      timestamp: now,
      triggeredBy: 'user-edit',
      fieldsUpdated: ['visibility', 'clientContext'],
      source: 'redaction-engine',
      changes: [{ field: 'visibility', oldValue: item.visibility, newValue: redacted.visibility }]
    });

    this.items.set(itemId, redacted);
    return redacted;
  }

  private generateArchetype(item: DiscoveredItem): string {
    const industry = item.industryTags[0] || 'Enterprise';
    const sizeMetric = item.metrics.find(m => 
      m.label.toLowerCase().includes('employee') || 
      m.label.toLowerCase().includes('revenue') ||
      m.label.toLowerCase().includes('user') ||
      m.label.toLowerCase().includes('customer')
    );
    const size = sizeMetric?.value;
    return size 
      ? `${size} ${industry} Organization`
      : `Major ${industry} Player`;
  }

  // ============================================================
  // CASE STUDY GENERATION INPUT (feeds Factory synthesis)
  // ============================================================

  generateCaseStudyInput(itemId: string): {
    topic: 'casestudy';
    clientName: string;
    industry: string;
    metricValue: string;
    selectedInputs: string[];
    selectedOutputs: string[];
    customContext: string;
  } | null {
    const item = this.items.get(itemId);
    if (!item) return null;

    const heroMetric = item.metrics.find(m => m.isHero) || item.metrics[0];
    const clientDisplayName = item.clientContext.isNamed 
      ? item.clientContext.clientName! 
      : item.clientContext.archetype || 'Confidential Client';

    return {
      topic: 'casestudy',
      clientName: clientDisplayName,
      industry: item.industryTags[0] || 'Technology',
      metricValue: heroMetric 
        ? `${heroMetric.value} ${heroMetric.context}` 
        : 'Significant improvement',
      selectedInputs: ['testimonials', 'file', 'image'],
      selectedOutputs: ['uicomponent', 'md', 'video', 'notebook'],
      customContext: this.buildSynthesisContext(item)
    };
  }

  generateBatchCaseStudyInputs(itemIds: string[]): Array<{
    topic: 'casestudy';
    clientName: string;
    industry: string;
    metricValue: string;
    selectedInputs: string[];
    selectedOutputs: string[];
    customContext: string;
  }> {
    return itemIds
      .map(id => this.generateCaseStudyInput(id))
      .filter((v): v is NonNullable<typeof v> => v !== null);
  }

  private buildSynthesisContext(item: DiscoveredItem): string {
    const heroMetric = item.metrics.find(m => m.isHero);
    const unverifiedMetrics = item.metrics.filter(m => !m.verified);
    const fabricatedMetrics = item.metrics.filter(m => m.estimationMethod);
    
    let context = `
PROJECT: ${item.name}
CLIENT: ${item.clientContext.isNamed ? item.clientContext.clientName : item.clientContext.archetype}
INDUSTRY: ${item.industryTags.join(', ') || 'Not specified'}
STATUS: ${item.status}
VISIBILITY: ${item.visibility}
DISCOVERY METHOD: ${item.discoveryMethod}

TECHNICAL STACK:
- Frontend: ${item.techStack.frontend.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- Backend: ${item.techStack.backend.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- AI/ML: ${item.techStack.ai.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- Infrastructure: ${item.techStack.infrastructure.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- Database: ${item.techStack.database.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- Auth: ${item.techStack.auth.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}
- CI/CD: ${item.techStack.cicd.map(s => `${s.name} (${s.confidence})`).join(', ') || 'Not specified'}

KEY METRICS:
${item.metrics.map(m => `- ${m.label}: ${m.value} (${m.context}) [${m.verified ? 'VERIFIED' : 'UNVERIFIED'}${m.estimationMethod ? ` • ESTIMATED (${m.estimationMethod})` : ''}${m.confidenceInterval ? ` • CI: ${m.confidenceInterval.min}-${m.confidenceInterval.max}` : ''}]`).join('\n') || 'No metrics recorded'}

METHODOLOGY PHASES:
${item.methodologyPhases.map((p, i) => `${i+1}. ${p}`).join('\n') || 'Not defined'}

TEAM:
${item.team.map(t => `- ${t.name} (${t.role}${t.isVelyon ? ' • Velyon' : ''}): ${t.contribution}`).join('\n') || 'Not recorded'}

ASSETS AVAILABLE:
${item.assets.map(a => `- ${a.type}: ${a.alt} (${a.generatedBy || 'unknown'})`).join('\n') || 'No assets'}

CONTENT HINTS:
- Suggested Format: ${item.contentHints.suggestedCaseStudyFormat}
- Technical Insights: ${item.contentHints.keyTechnicalInsights.join(', ') || 'None'}
- Replicable Patterns: ${item.contentHints.replicablePatterns.join(', ') || 'None'}
- Notable Constraints: ${item.contentHints.notableConstraints.join(', ') || 'None'}
- Target Audiences: ${item.contentHints.targetAudiences.join(', ') || 'General'}
- SEO Keywords: ${item.contentHints.seoKeywords.join(', ') || 'None'}
- Competitive Differentiators: ${item.contentHints.competitiveDifferentiators.join(', ') || 'None'}

UNRESOLVED COMMENTS:
${this.getUnresolvedComments(item.id).map(c => `- [${c.type.toUpperCase()}] ${c.fieldPath}: ${c.content}`).join('\n') || 'None'}

REDACTION LEVEL: ${item.visibility}
${item.visibility === 'redacted' ? 'USE ARCHETYPE: ' + item.clientContext.archetype : ''}
${item.visibility === 'client-approved' ? 'CLIENT APPROVED FOR PUBLIC USE' : ''}
`.trim();

    return context;
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  getItem(itemId: string): DiscoveredItem | undefined {
    return this.items.get(itemId);
  }

  getAllItems(): DiscoveredItem[] {
    return Array.from(this.items.values());
  }

  getItemsByVisibility(visibility: DiscoveredItem['visibility']): DiscoveredItem[] {
    return Array.from(this.items.values()).filter(i => i.visibility === visibility);
  }

  getItemsByMethod(method: DiscoveryMethod): DiscoveredItem[] {
    return Array.from(this.items.values()).filter(i => i.discoveryMethod === method);
  }

  getItemsReadyForGeneration(): DiscoveredItem[] {
    return Array.from(this.items.values()).filter(i => 
      i.discoveryStatus === 'generation-ready' || 
      (i.discoveryStatus === 'curated' && i.metrics.length > 0)
    );
  }

  deleteItem(itemId: string): boolean {
    this.comments.delete(itemId);
    return this.items.delete(itemId);
  }

  updateDiscoveryStatus(itemId: string, status: DiscoveryStatus): DiscoveredItem | null {
    return this.enrichItem(itemId, { discoveryStatus: status }, 'user-edit');
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================

  exportToJSON(): string {
    const data = {
      items: Array.from(this.items.entries()),
      comments: Array.from(this.comments.entries()),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  importFromJSON(json: string): void {
    const data = JSON.parse(json);
    this.items = new Map(data.items);
    this.comments = new Map(data.comments);
  }

  saveToLocalStorage(prefix: string = 'velyon_portfolio'): void {
    localStorage.setItem(`${prefix}_items`, JSON.stringify(Array.from(this.items.entries())));
    localStorage.setItem(`${prefix}_comments`, JSON.stringify(Array.from(this.comments.entries())));
  }

  loadFromLocalStorage(prefix: string = 'velyon_portfolio'): void {
    try {
      const itemsData = localStorage.getItem(`${prefix}_items`);
      const commentsData = localStorage.getItem(`${prefix}_comments`);
      
      if (itemsData) this.items = new Map(JSON.parse(itemsData));
      if (commentsData) this.comments = new Map(JSON.parse(commentsData));
    } catch (e) {
      console.error('Failed to load portfolio from localStorage:', e);
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private hashUrl(url: string): string {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  private extractNameFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown';
    }
  }

  private urlToSlug(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').replace(/\./g, '-');
    } catch {
      return 'unknown-url';
    }
  }
}

// Singleton instance
export const portfolioScanner = new PortfolioScanner();