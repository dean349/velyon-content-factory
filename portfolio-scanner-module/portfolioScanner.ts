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
  DiscoveryStatus
} from './portfolio-types';

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
      name: project.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug: project.name.toLowerCase(),
      tagline: `Deployed on Vercel • ${framework}`,
      description: `Production web application deployed on Vercel with automatic CI/CD. Framework: ${framework}. ${project.updatedAt ? `Last deployed: ${new Date(project.updatedAt).toLocaleDateString()}.` : ''}`,
      techStack: {
        frontend: [framework],
        backend: [],
        ai: [],
        infrastructure: ['Vercel', 'Edge Network', 'Git Integration'],
        monitoring: ['Vercel Analytics', 'Vercel Speed Insights'],
        database: [],
        messaging: [],
        auth: [],
        testing: [],
        cicd: ['Vercel Git Integration']
      },
      status: 'production',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { vercel: { teamId: config?.teamId, includePreviewDeployments: config?.includePreviewDeployments } },
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
      name: site.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug: site.name.toLowerCase(),
      tagline: `Hosted on Netlify • ${framework}`,
      description: `Web application deployed on Netlify with continuous deployment. Build command: ${buildSettings.cmd || 'N/A'}. Framework: ${framework}.`,
      techStack: {
        frontend: [framework],
        backend: [],
        ai: [],
        infrastructure: ['Netlify', 'Edge Functions', 'Netlify Forms', 'Netlify Identity'],
        monitoring: ['Netlify Analytics'],
        database: [],
        messaging: [],
        auth: site.identity_instances?.length ? ['Netlify Identity'] : [],
        testing: [],
        cicd: ['Netlify Build', 'Git Integration']
      },
      status: site.state === 'ready' ? 'production' : 'beta',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { netlify: { siteIds: config?.siteIds } },
      comments: []
    });
  }

  // 3. Cloudflare Pages Discovery
  async discoverCloudflarePages(config: DiscoverySourceConfig['cloudflare']): Promise<DiscoveredItem[]> {
    if (!config?.accountId || !config?.apiToken) {
      throw new Error('Cloudflare discovery requires accountId and apiToken');
    }

    const items: DiscoveredItem[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/pages/projects`);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('per_page', '100');

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${config.apiToken}` }
      });

      if (!res.ok) {
        throw new Error(`Cloudflare API error: ${res.status}`);
      }

      const data = await res.json();
      const projects = data.result || [];

      for (const project of projects) {
        if (!config.projectNames?.length || config.projectNames.includes(project.name)) {
          items.push(this.transformCloudflareProject(project, config));
        }
      }

      hasMore = data.result_info?.page < data.result_info?.total_pages;
      page++;
    }

    return items;
  }

  private transformCloudflareProject(project: any, config: DiscoverySourceConfig['cloudflare']): DiscoveredItem {
    const deployment = project.latest_deployment;
    const buildConfig = project.build_config || {};

    return this.createBaseItem({
      id: `cf-pages-${project.id}`,
      sourceType: 'webapp',
      discoveryMethod: 'cloudflare',
      sourceUrl: deployment?.url || `https://${project.name}.pages.dev`,
      deployUrl: deployment?.url || `https://${project.name}.pages.dev`,
      repoUrl: project.source?.config?.repo_url,
      name: project.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug: project.name.toLowerCase(),
      tagline: `Cloudflare Pages • ${buildConfig.build_command || 'Static'}`,
      description: `Web application deployed on Cloudflare Pages. Build: ${buildConfig.build_command || 'N/A'}. Output: ${buildConfig.destination_dir || 'N/A'}. ${deployment?.created_on ? `Last deployed: ${new Date(deployment.created_on).toLocaleDateString()}.` : ''}`,
      techStack: {
        frontend: [buildConfig.build_command?.includes('next') ? 'Next.js' : buildConfig.build_command?.includes('vite') ? 'Vite' : 'Static'],
        backend: [],
        ai: [],
        infrastructure: ['Cloudflare Pages', 'Cloudflare Workers', 'Cloudflare KV', 'Cloudflare R2'],
        monitoring: ['Cloudflare Web Analytics'],
        database: project.d1_databases?.length ? ['Cloudflare D1'] : [],
        messaging: [],
        auth: [],
        testing: [],
        cicd: ['Cloudflare Pages CI/CD', 'Git Integration']
      },
      status: 'production',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { cloudflare: { accountId: config?.accountId, projectNames: config?.projectNames } },
      comments: []
    });
  }

  // 4. GitHub Repositories Discovery
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
      await new Promise(r => setTimeout(r, 100));
    }

    return items;
  }

  private shouldIncludeRepo(repo: any, filter?: DiscoverySourceConfig['github']['repoFilter']): boolean {
    if (!filter) return true;
    if (filter.archived === false && repo.archived) return false;
    if (filter.pushedAfter && new Date(repo.pushed_at) < new Date(filter.pushedAfter)) return false;
    if (filter.languages?.length && !filter.languages.includes(repo.language)) return false;
    if (filter.topics?.length && !filter.topics.some(t => repo.topics?.includes(t))) return false;
    return true;
  }

  private async transformGitHubRepo(repo: any, config: DiscoverySourceConfig['github']): Promise<DiscoveredItem> {
    const topics = repo.topics || [];
    let sourceType: DiscoveredItem['sourceType'] = 'webapp';
    if (topics.some((t: string) => ['ai', 'llm', 'ml', 'rag', 'agent'].includes(t))) sourceType = 'ai-tool';
    if (topics.some((t: string) => ['library', 'sdk', 'package'].includes(t))) sourceType = 'library';
    if (topics.some((t: string) => ['pipeline', 'etl', 'data-engineering'].includes(t))) sourceType = 'pipeline';
    if (topics.some((t: string) => ['extension', 'plugin', 'vscode'].includes(t))) sourceType = 'extension';
    if (topics.some((t: string) => ['api', 'backend', 'microservice'].includes(t))) sourceType = 'api';

    let languages: string[] = [];
    if (repo.language) languages.push(repo.language);
    if (config.token) {
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

    let longDescription: string | undefined;
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
        headers: { Authorization: `Bearer ${config.token}`, Accept: 'application/vnd.github.v3.raw' }
      });
      if (readmeRes.ok) {
        longDescription = await readmeRes.text();
      }
    } catch {}

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
      name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug: repo.name.toLowerCase(),
      tagline: repo.description || `${sourceType} • ${repo.language || 'Multi-language'} • ${repo.stargazers_count}★`,
      description: repo.description || `GitHub repository: ${repo.full_name}. ${repo.stargazers_count} stars, ${repo.forks_count} forks. Primary language: ${repo.language || 'N/A'}.`,
      longDescription,
      techStack: {
        frontend: languages.filter(l => ['TypeScript', 'JavaScript', 'TSX', 'JSX', 'Vue', 'Svelte'].includes(l)),
        backend: languages.filter(l => ['Python', 'Go', 'Rust', 'Java', 'C#', 'Node.js', 'Ruby', 'PHP'].includes(l)),
        ai: topics.filter((t: string) => ['langchain', 'llamaindex', 'pinecone', 'weaviate', 'chromadb', 'qdrant', 'milvus', 'ollama', 'huggingface', 'transformers', 'pytorch', 'tensorflow', 'jax'].includes(t)),
        infrastructure: ['GitHub Actions', 'Docker'].concat(topics.filter(t => ['kubernetes', 'terraform', 'ansible', 'aws', 'gcp', 'azure'].includes(t))),
        monitoring: topics.filter(t => ['prometheus', 'grafana', 'datadog', 'sentry'].includes(t)),
        database: topics.filter(t => ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'supabase', 'planetscale', 'neon'].includes(t)),
        messaging: topics.filter(t => ['kafka', 'rabbitmq', 'nats', 'redis-streams'].includes(t)),
        auth: topics.filter(t => ['clerk', 'auth0', 'nextauth', 'supabase-auth', 'firebase-auth'].includes(t)),
        testing: topics.filter(t => ['jest', 'vitest', 'playwright', 'cypress', 'pytest'].includes(t)),
        cicd: ['GitHub Actions'].concat(topics.filter(t => ['argo', 'tekton', 'jenkins'].includes(t)))
      },
      status: repo.archived ? 'archived' : repo.has_pages ? 'production' : 'beta',
      visibility: repo.private ? 'internal-only' : 'public',
      discoveryStatus: 'discovered',
      sourceConfigSnapshot: { github: { org: config?.org, includePrivate: config?.includePrivate } },
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
          sourceConfigSnapshot: { urlCrawl: { urls: config.urls, followRedirects: config?.followRedirects } },
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
      sourceConfigSnapshot: { urlCrawl: { urls: config?.urls, followRedirects: config?.followRedirects } },
      comments: []
    });
  }

  // ============================================================
  // COMMENT SYSTEM
  // ============================================================

  addComment(itemId: string, comment: Omit<DiscoveryComment, 'id' | 'itemId' | 'createdAt'>): DiscoveryComment {
    const fullComment: DiscoveryComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      createdAt: new Date().toISOString()
    };
    
    const existing = this.comments.get(itemId) || [];
    this.comments.set(itemId, [...existing, fullComment]);
    
    const item = this.items.get(itemId);
    if (item) {
      item.comments = [...item.comments, fullComment];
      this.items.set(itemId, item);
    }
    
    return fullComment;
  }

  flagMissingInfo(itemId: string, fieldPath: string, details: string): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'missing-info',
      content: details,
      author: 'user',
      resolved: false
    });
  }

  requestAutoGenerate(itemId: string, fieldPath: string, prompt: string, context: string): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'auto-generate',
      content: `Auto-generation requested: ${prompt}`,
      author: 'user',
      resolved: false,
      generationPrompt: prompt,
      generationContext: context
    });
  }

  markFabricated(itemId: string, fieldPath: string, value: string, confidence: number, source: 'industry-benchmark' | 'similar-project' | 'extrapolation' | 'client-report' | 'educated-guess'): DiscoveryComment {
    return this.addComment(itemId, {
      fieldPath,
      type: 'fabricated',
      content: `Fabricated/estimated value: "${value}" (confidence: ${Math.round(confidence * 100)}%, source: ${source})`,
      author: 'user',
      resolved: false,
      fabricationConfidence: confidence,
      fabricationSource: source
    });
  }

  resolveComment(itemId: string, commentId: string, resolvedBy: string): boolean {
    const comments = this.comments.get(itemId) || [];
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      comment.resolvedAt = new Date().toISOString();
      comment.resolvedBy = resolvedBy;
      this.comments.set(itemId, comments);
      
      const item = this.items.get(itemId);
      if (item) {
        item.comments = item.comments.map(c => c.id === commentId ? comment : c);
        this.items.set(itemId, item);
      }
      return true;
    }
    return false;
  }

  getComments(itemId: string): DiscoveryComment[] {
    return this.comments.get(itemId) || [];
  }

  // ============================================================
  // ITEM MANAGEMENT
  // ============================================================

  saveItem(item: DiscoveredItem): void {
    this.items.set(item.id, item);
  }

  getItem(itemId: string): DiscoveredItem | undefined {
    return this.items.get(itemId);
  }

  getAllItems(): DiscoveredItem[] {
    return Array.from(this.items.values());
  }

  deleteItem(itemId: string): boolean {
    this.comments.delete(itemId);
    return this.items.delete(itemId);
  }

  updateItemField(itemId: string, fieldPath: string, value: any): boolean {
    const item = this.items.get(itemId);
    if (!item) return false;

    const paths = fieldPath.split('.');
    let current: any = item;
    for (let i = 0; i < paths.length - 1; i++) {
      const key = paths[i];
      const nextKey = paths[i + 1];
      if (Array.isArray(current)) {
        const index = parseInt(key, 10);
        if (isNaN(index)) return false;
        current = current[index];
      } else {
        current = current[key];
      }
      if (current === undefined) return false;
    }

    const lastKey = paths[paths.length - 1];
    if (Array.isArray(current)) {
      const index = parseInt(lastKey, 10);
      if (isNaN(index)) return false;
      current[index] = value;
    } else {
      current[lastKey] = value;
    }

    // Add enrichment history
    item.enrichmentHistory = item.enrichmentHistory || [];
    item.enrichmentHistory.push({
      id: `enrich-${Date.now()}`,
      timestamp: new Date().toISOString(),
      triggeredBy: 'user-edit',
      fieldsUpdated: [fieldPath],
      source: 'manual',
      changes: [{ field: fieldPath, oldValue: undefined, newValue: value }]
    });

    this.items.set(itemId, item);
    return true;
  }

  // ============================================================
  // REDACTION ENGINE
  // ============================================================

  applyRedaction(item: DiscoveredItem, level: 'full' | 'partial' | 'internal'): DiscoveredItem {
    const redacted = { ...item };
    
    if (level === 'full' || item.visibility === 'redacted') {
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
        context: m.context.replace(new RegExp(item.clientContext.clientName || '', 'gi'), redacted.clientContext.archetype || 'Client')
      }));
      if (item.clientContext.redactionRules?.hideMetrics) {
        redacted.metrics = redacted.metrics.filter(m => !item.clientContext.redactionRules!.hideMetrics!.includes(m.id));
      }
    }
    
    if (level === 'partial') {
      redacted.clientContext.isNamed = true;
    }
    
    return redacted;
  }

  private generateArchetype(item: DiscoveredItem): string {
    const industry = item.industryTags[0] || 'Enterprise';
    const size = item.metrics.find(m => m.label.toLowerCase().includes('employee') || m.label.toLowerCase().includes('revenue'))?.value;
    return size 
      ? `${size} ${industry} Organization`
      : `Major ${industry} Player`;
  }

  // ============================================================
  // CASE STUDY GENERATOR (feeds Factory synthesis)
  // ============================================================

  generateCaseStudyInput(item: DiscoveredItem): {
    topic: 'casestudy';
    clientName: string;
    industry: string;
    metricValue: string;
    selectedInputs: string[];
    selectedOutputs: string[];
    customContext: string;
  } {
    const heroMetric = item.metrics.find(m => m.isHero) || item.metrics[0];
    
    return {
      topic: 'casestudy',
      clientName: item.clientContext.isNamed ? item.clientContext.clientName! : item.clientContext.archetype || 'Confidential Client',
      industry: item.industryTags[0] || 'Technology',
      metricValue: heroMetric ? `${heroMetric.value} ${heroMetric.context}` : 'Significant improvement',
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
    itemId: string;
  }> {
    return itemIds
      .map(id => this.items.get(id))
      .filter(Boolean)
      .map(item => ({
        ...this.generateCaseStudyInput(item!),
        itemId: item!.id
      }));
  }

  private buildSynthesisContext(item: DiscoveredItem): string {
    return `
PROJECT: ${item.name}
CLIENT: ${item.clientContext.isNamed ? item.clientContext.clientName : item.clientContext.archetype}
INDUSTRY: ${item.industryTags.join(', ')}
STATUS: ${item.status}

TECHNICAL STACK:
- Frontend: ${item.techStack.frontend.map(s => s.name).join(', ') || 'Not specified'}
- Backend: ${item.techStack.backend.map(s => s.name).join(', ') || 'Not specified'}
- AI/ML: ${item.techStack.ai.map(s => s.name).join(', ') || 'Not specified'}
- Infrastructure: ${item.techStack.infrastructure.map(s => s.name).join(', ')}

KEY METRICS:
${item.metrics.map(m => `- ${m.label}: ${m.value} (${m.context})`).join('\n')}

METHODOLOGY PHASES:
${item.methodologyPhases.map((p, i) => `${i+1}. ${p}`).join('\n')}

TEAM:
${item.team.map(t => `- ${t.name} (${t.role}): ${t.contribution}`).join('\n')}

CONTENT HINTS:
- Format: ${item.contentHints.suggestedCaseStudyFormat}
- Technical Insights: ${item.contentHints.keyTechnicalInsights.join(', ')}
- Replicable Patterns: ${item.contentHints.replicablePatterns.join(', ')}
- Constraints: ${item.contentHints.notableConstraints.join(', ')}

REDACTION LEVEL: ${item.visibility}
${item.visibility === 'redacted' ? 'USE ARCHETYPE: ' + item.clientContext.archetype : ''}
`.trim();
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================

  exportToJson(): string {
    const data = {
      items: Array.from(this.items.values()),
      comments: Object.fromEntries(this.comments),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  importFromJson(json: string): { items: number; comments: number } {
    const data = JSON.parse(json);
    this.items.clear();
    this.comments.clear();
    
    for (const item of data.items || []) {
      this.items.set(item.id, item);
    }
    for (const [itemId, comments] of Object.entries(data.comments || {})) {
      this.comments.set(itemId, comments as DiscoveryComment[]);
    }
    
    return { items: this.items.size, comments: Array.from(this.comments.values()).flat().length };
  }

  saveToLocalStorage(key: string = 'velyon_portfolio_scanner'): void {
    localStorage.setItem(key, this.exportToJson());
  }

  loadFromLocalStorage(key: string = 'velyon_portfolio_scanner'): { items: number; comments: number } {
    const data = localStorage.getItem(key);
    if (!data) return { items: 0, comments: 0 };
    return this.importFromJson(data);
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private createBaseItem(partial: Partial<DiscoveredItem>): DiscoveredItem {
    const now = new Date().toISOString();
    return {
      id: partial.id || `item-${Date.now()}`,
      sourceType: partial.sourceType || 'webapp',
      discoveredAt: partial.discoveredAt || now,
      discoveryMethod: partial.discoveryMethod || 'manual-entry',
      discoveryStatus: partial.discoveryStatus || 'discovered',
      sourceConfigSnapshot: partial.sourceConfigSnapshot || {},
      sourceUrl: partial.sourceUrl,
      repoUrl: partial.repoUrl,
      deployUrl: partial.deployUrl,
      packageUrl: partial.packageUrl,
      docsUrl: partial.docsUrl,
      name: partial.name || 'Unnamed Project',
      slug: partial.slug || partial.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed',
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
        archetype: 'Confidential Client',
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
      enrichmentHistory: partial.enrichmentHistory || []
    };
  }

  private getEmptyTechStack(): TechStack {
    return {
      frontend: [], backend: [], ai: [], infrastructure: [],
      monitoring: [], database: [], messaging: [], auth: [],
      testing: [], cicd: []
    };
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

export const portfolioScanner = new PortfolioScanner();