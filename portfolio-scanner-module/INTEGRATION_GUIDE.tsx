// ============================================================
// INTEGRATION GUIDE: Adding Portfolio Scanner to FactoryView.tsx
// ============================================================

// 1. ADD IMPORTS (top of FactoryView.tsx)
/*
import { PortfolioItemEditor } from './components/PortfolioItemEditor';
import { portfolioScanner, DiscoveredItem, DiscoverySourceConfig } from '../lib/portfolioScanner';
import { Box, Search, Zap, Edit3, Play, CheckCircle2, AlertCircle, Download, UploadCloud, RefreshCw, GitBranch, Triangle, Github, Server, Globe, Plus, Eye, Lock, Shield, Archive } from 'lucide-react';
*/

// 2. ADD STATE (inside FactoryView component)
/*
// Portfolio Scanner State
const [portfolioItems, setPortfolioItems] = useState<DiscoveredItem[]>(() => {
  try {
    const saved = localStorage.getItem('velyon_portfolio_items');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});

const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<DiscoveredItem | null>(null);
const [scannerMode, setScannerMode] = useState<'discover' | 'curate' | 'generate'>('discover');
const [scanSources, setScanSources] = useState<{
  vercel: boolean; netlify: boolean; cloudflare: boolean; github: boolean; urlCrawl: boolean;
}>({ vercel: true, netlify: false, cloudflare: false, github: true, urlCrawl: true });
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
*/

// 3. PERSISTENCE EFFECT
/*
useEffect(() => {
  localStorage.setItem('velyon_portfolio_items', JSON.stringify(portfolioItems));
}, [portfolioItems]);
*/

// 4. DISCOVERY HANDLERS
/*
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
    
    if (scanSources.cloudflare && discoveryConfig.cloudflare?.accountId && discoveryConfig.cloudflare?.apiToken) {
      setDiscoveryLogs(prev => [...prev, '[CLOUDFLARE] Fetching pages projects...']);
      const items = await portfolioScanner.discoverCloudflarePages(discoveryConfig.cloudflare);
      allItems.push(...items);
      setDiscoveryLogs(prev => [...prev, `[CLOUDFLARE] Discovered ${items.length} projects`]);
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
    
    // Merge with existing (avoid duplicates by ID)
    const merged = [...portfolioItems];
    for (const item of allItems) {
      const existingIndex = merged.findIndex(m => m.id === item.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = item; // Update
      } else {
        merged.push(item); // Add new
      }
    }
    
    setPortfolioItems(merged);
    setDiscoveryLogs(prev => [...prev, `[PORTFOLIO] Total items: ${merged.length}. Discovery complete!`]);
    
  } catch (error) {
    setDiscoveryLogs(prev => [...prev, `[ERROR] ${error instanceof Error ? error.message : 'Unknown error'}`]);
  } finally {
    setIsDiscovering(false);
  }
};

const handleSavePortfolioItem = (item: DiscoveredItem) => {
  setPortfolioItems(prev => {
    const idx = prev.findIndex(p => p.id === item.id);
    if (idx >= 0) {
      const updated = [...prev];
      updated[idx] = item;
      return updated;
    }
    return [...prev, item];
  });
  setSelectedPortfolioItem(null);
};

const handleBatchGenerate = () => {
  if (batchGenerateItems.length === 0) return;
  
  const inputs = portfolioScanner.generateBatchCaseStudyInputs(batchGenerateItems);
  
  // Feed each into the existing synthesis engine
  for (const input of inputs) {
    setSelectedInputs(input.selectedInputs);
    setSelectedTopic(input.topic);
    setSelectedOutputs(input.selectedOutputs);
    setClientName(input.clientName);
    setIndustry(input.industry);
    setMetricValue(input.metricValue);
    
    // Store custom context for synthesis
    setLogs(prev => [...prev, `[BATCH] Queued: ${input.clientName} - ${input.metricValue}`]);
    
    // Trigger synthesis (your existing handleStartSynthesis)
    handleStartSynthesis();
    
    // Small delay between generations
    await new Promise(r => setTimeout(r, 2000));
  }
  
  setBatchGenerateItems([]);
};
*/

// 5. ADD 5TH INGEST TAB (in the ingest tab switcher, around line 873)
/*
{ id: 'portfolio', label: '📦 Portfolio Scanner', icon: <Box size={12} /> }
*/

// 6. ADD PORTFOLIO TAB CONTENT (inside the ingestTab conditional render, after registry tab)
/*
{ingestTab === 'portfolio' && (
  <div className="space-y-4 flex-1 flex flex-col">
    {/* Mode Selector */}
    <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
      {[
        { id: 'discover', label: '🔍 Discover', desc: 'Scan Vercel, Netlify, Cloudflare, GitHub, URLs' },
        { id: 'curate', label: '✏️ Curate', desc: 'Edit, redact, enrich, add comments' },
        { id: 'generate', label: '⚡ Generate', desc: 'Batch generate case studies via Synthesis Engine' }
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
              { key: 'vercel', label: 'Vercel', icon: <Triangle className="text-indigo-400" size={16} />, desc: 'Team projects with framework detection & git linking' },
              { key: 'netlify', label: 'Netlify', icon: <Globe className="text-emerald-400" size={16} />, desc: 'Sites with build config, edge functions, forms' },
              { key: 'cloudflare', label: 'Cloudflare Pages', icon: <Server className="text-purple-400" size={16} />, desc: 'Pages projects with Workers, KV, D1, R2' },
              { key: 'github', label: 'GitHub Repos', icon: <Github className="text-slate-300" size={16} />, desc: 'Org repos with topics→type, languages, readmes' },
              { key: 'github', label: 'GitHub Pages', icon: <ArrowUpRight className="text-blue-400" size={16} />, desc: 'Auto-detects username.github.io/repo deployments' },
              { key: 'urlCrawl', label: 'URL Crawl', icon: <Globe className="text-rose-400" size={16} />, desc: 'Any URL - extracts brand, stack, screenshots' }
            ].map(source => (
              <label key={source.key + (source.label.includes('Pages') ? '-pages' : '')} className="flex items-center gap-3 p-3 bg-black/30 border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all">
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
              <input placeholder="Vercel Team ID" value={discoveryConfig.vercel?.teamId} onChange={e => setDiscoveryConfig(prev => ({ ...prev, vercel: { ...prev.vercel, teamId: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/40 font-mono" />
              <input placeholder="Vercel Access Token" type="password" value={discoveryConfig.vercel?.token} onChange={e => setDiscoveryConfig(prev => ({ ...prev, vercel: { ...prev.vercel, token: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/40 font-mono" />
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={discoveryConfig.vercel?.includePreviewDeployments} onChange={e => setDiscoveryConfig(prev => ({ ...prev, vercel: { ...prev.vercel, includePreviewDeployments: e.target.checked } }))} className="w-4 h-4 accent-rose-500" />
                <span>Include Preview Deployments</span>
              </label>
            </div>
          )}
          
          {scanSources.netlify && (
            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-emerald-400 mb-2">Netlify Configuration</div>
              <input placeholder="Site IDs (comma-separated)" value={discoveryConfig.netlify?.siteIds?.join(', ')} onChange={e => setDiscoveryConfig(prev => ({ ...prev, netlify: { ...prev.netlify, siteIds: e.target.value.split(',').map(s => s.trim()) } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500/40 font-mono" />
              <input placeholder="Netlify Token" type="password" value={discoveryConfig.netlify?.token} onChange={e => setDiscoveryConfig(prev => ({ ...prev, netlify: { ...prev.netlify, token: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500/40 font-mono" />
            </div>
          )}
          
          {scanSources.cloudflare && (
            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-purple-400 mb-2">Cloudflare Configuration</div>
              <input placeholder="Account ID" value={discoveryConfig.cloudflare?.accountId} onChange={e => setDiscoveryConfig(prev => ({ ...prev, cloudflare: { ...prev.cloudflare, accountId: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500/40 font-mono" />
              <input placeholder="API Token" type="password" value={discoveryConfig.cloudflare?.apiToken} onChange={e => setDiscoveryConfig(prev => ({ ...prev, cloudflare: { ...prev.cloudflare, apiToken: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500/40 font-mono" />
              <input placeholder="Project Names (comma-separated, optional)" value={discoveryConfig.cloudflare?.projectNames?.join(', ')} onChange={e => setDiscoveryConfig(prev => ({ ...prev, cloudflare: { ...prev.cloudflare, projectNames: e.target.value.split(',').map(s => s.trim()) } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500/40 font-mono" />
            </div>
          )}
          
          {scanSources.github && (
            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-slate-300 mb-2">GitHub Configuration</div>
              <input placeholder="GitHub Organization" value={discoveryConfig.github?.org} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, org: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
              <input placeholder="GitHub Token (optional, for private repos)" type="password" value={discoveryConfig.github?.token} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, token: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={discoveryConfig.github?.includePrivate} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, includePrivate: e.target.checked } }))} className="w-4 h-4 accent-rose-500" />
                <span>Include Private Repos</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Topic Filter (comma-separated)" value={discoveryConfig.github?.repoFilter?.topics?.join(', ')} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, repoFilter: { ...prev.github?.repoFilter, topics: e.target.value.split(',').map(s => s.trim()) } }))} className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
                <input placeholder="Language Filter (comma-separated)" value={discoveryConfig.github?.repoFilter?.languages?.join(', ')} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, repoFilter: { ...prev.github?.repoFilter, languages: e.target.value.split(',').map(s => s.trim()) } }))} className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" />
              </div>
              <input placeholder="Pushed After (YYYY-MM-DD)" value={discoveryConfig.github?.repoFilter?.pushedAfter} onChange={e => setDiscoveryConfig(prev => ({ ...prev, github: { ...prev.github, repoFilter: { ...prev.github?.repoFilter, pushedAfter: e.target.value } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-slate-400/40 font-mono" type="date" />
            </div>
          )}
          
          {scanSources.urlCrawl && (
            <div className="mb-4 space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-rose-400 mb-2">URL Crawl Configuration</div>
              <textarea placeholder="One URL per line" value={discoveryConfig.urlCrawl?.urls?.join('\n')} onChange={e => setDiscoveryConfig(prev => ({ ...prev, urlCrawl: { ...prev.urlCrawl, urls: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) } }))} className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-500/40 font-mono" rows={4} />
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={discoveryConfig.urlCrawl?.followRedirects} onChange={e => setDiscoveryConfig(prev => ({ ...prev, urlCrawl: { ...prev.urlCrawl, followRedirects: e.target.checked } }))} className="w-4 h-4 accent-rose-500" />
                <span>Follow Redirects</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={discoveryConfig.urlCrawl?.extractAssets} onChange={e => setDiscoveryConfig(prev => ({ ...prev, urlCrawl: { ...prev.urlCrawl, extractAssets: e.target.checked } }))} className="w-4 h-4 accent-rose-500" />
                <span>Extract Assets (screenshots, logos)</span>
              </label>
            </div>
          )}
          
          <button 
            onClick={handleRunDiscovery}
            disabled={isDiscovering}
            className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            {isDiscovering ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Discovering...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Run Portfolio Discovery</span>
              </>
            )}
          </button>
          
          {/* Discovery Logs */}
          {(isDiscovering || discoveryLogs.length > 0) && (
            <div className="mt-4 bg-black border border-white/5 rounded-xl p-3 font-mono text-[9px] text-slate-400 h-48 overflow-y-auto space-y-1">
              <div className="text-indigo-400 border-b border-white/5 pb-1 mb-1.5 flex justify-between">
                <span>DISCOVERY STREAM</span>
                <span className={isDiscovering ? "animate-pulse text-rose-400" : "text-emerald-400"}>
                  {isDiscovering ? '● DISCOVERING' : '● COMPLETE'}
                </span>
              </div>
              {discoveryLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-600 font-bold mr-1.5">[{i + 1}]</span>
                  <span className={log.includes("[ERROR]") ? "text-red-400" : log.includes("Discovered") ? "text-emerald-400 font-bold" : log.includes("Fetching") ? "text-indigo-400" : "text-slate-300"}>
                    {log}
                  </span>
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
          <PortfolioItemEditor
            item={selectedPortfolioItem}
            onSave={handleSavePortfolioItem}
            onClose={() => setSelectedPortfolioItem(null)}
            allItems={portfolioItems}
            onAddComment={portfolioScanner.addComment.bind(portfolioScanner)}
            onResolveComment={portfolioScanner.resolveComment.bind(portfolioScanner)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Box size={64} className="mb-4 opacity-30" />
            <h3 className="font-bold text-slate-100 mb-2">Select a project to curate</h3>
            <p className="text-sm">Click a project in the list below to edit its details, metrics, assets, team, redaction rules, and add comments.</p>
          </div>
        )}
        
        {/* Project List Sidebar */}
        <div className="border-t border-white/5 pt-4 max-h-64 overflow-y-auto">
          <h4 className="font-bold text-slate-100 mb-3 text-xs uppercase tracking-wider">Projects ({portfolioItems.length})</h4>
          <div className="space-y-2">
            {portfolioItems.map(item => {
              const visConfig = {
                public: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                'client-approved': { color: 'text-blue-400', bg: 'bg-blue-500/20' },
                redacted: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
                'internal-only': { color: 'text-slate-400', bg: 'bg-slate-500/20' }
              }[item.visibility];
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPortfolioItem(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedPortfolioItem?.id === item.id
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${visConfig.bg}`}>
                    {{
                      'webapp': <Globe size={16} className="text-indigo-400" />,
                      'ai-tool': <Zap size={16} className="text-rose-400" />,
                      'system': <Database size={16} className="text-purple-400" />,
                      'product': <Layers size={16} className="text-emerald-400" />,
                      'extension': <Puzzle size={16} className="text-amber-400" />,
                      'api': <Code size={16} className="text-blue-400" />,
                      'library': <BookOpen size={16} className="text-cyan-400" />,
                      'pipeline': <GitBranch size={16} className="text-orange-400" />
                    }[item.sourceType] || <Box size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-slate-100 truncate">{item.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${visConfig.bg} ${visConfig.color}`}>
                        {item.visibility}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{item.discoveryMethod}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.discoveryStatus === 'generation-ready' ? 'bg-emerald-500/20 text-emerald-400' : item.discoveryStatus === 'curated' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {item.discoveryStatus}
                    </span>
                    {item.comments.length > 0 && (
                      <span className="text-[9px] text-rose-400 flex items-center gap-1">
                        <MessageSquare size={10} /> {item.comments.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {/* GENERATE MODE */}
    {scannerMode === 'generate' && (
      <div className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100">Batch Case Study Generation</h3>
          <span className="text-xs text-slate-400">{batchGenerateItems.length} of {portfolioItems.filter(i => i.visibility !== 'internal-only').length} eligible selected</span>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {portfolioItems.filter(i => i.visibility !== 'internal-only').map(item => {
            const isSelected = batchGenerateItems.includes(item.id);
            const channels = batchOutputChannels[item.id] || ['uicomponent', 'md', 'video'];
            
            return (
              <label key={item.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                isSelected ? 'bg-rose-500/10 border-rose-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'
              }`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={e => setBatchGenerateItems(prev => e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id))}
                  className="w-4 h-4 accent-rose-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-100 truncate">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.sourceType}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      item.visibility === 'public' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.visibility === 'client-approved' ? 'bg-blue-500/20 text-blue-400' :
                      item.visibility === 'redacted' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.visibility}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex flex-wrap gap-2">
                    {item.industryTags.slice(0,3).map(t => <span key={t} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">{t}</span>)}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.metrics.length} metrics • {item.assets.length} assets • {item.team.length} team</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={channels.join(',')}
                    onChange={e => setBatchOutputChannels(prev => ({ ...prev, [item.id]: e.target.value.split(',') }))}
                    className="bg-black/40 border border-white/10 rounded-xl px-2 py-1 text-xs text-slate-200"
                    multiple
                    size={4}
                  >
                    <option value="uicomponent">21st.dev React Canvas</option>
                    <option value="md">Markdown/PDF Report</option>
                    <option value="notebook">NotebookLM Audio Spec</option>
                    <option value="video">HeyGen/Higgsfield Reel</option>
                  </select>
                </div>
              </label>
            );
          })}
        </div>
        
        <button
          onClick={handleBatchGenerate}
          disabled={batchGenerateItems.length === 0}
          className="w-full h-12 bg-gradient-to-r from-rose-500 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
        >
          <Zap size={16} /> <span>Generate {batchGenerateItems.length} Case Studies via Synthesis Engine</span>
        </button>
      </div>
    )}
  </div>
)}
*/