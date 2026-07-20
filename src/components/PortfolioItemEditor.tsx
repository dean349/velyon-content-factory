import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, EyeOff, Lock, Unlock, Plus, Trash2, 
  Edit3, Copy, Download, Zap, Globe, Database, 
  Layers, Users, Award, Target, Flag, X, Save, 
  ChevronRight, ChevronDown, AlertCircle, CheckCircle2,
  Code, Brain, Server, HardDrive, Wifi, Key, TestTube,
  FileText, Image, Video, Link, Tag, Calendar, Clock,
  Star, ArrowUpRight, MoreVertical, Hash, Type
} from 'lucide-react';
import { DiscoveredItem, CaseStudyMetric, PortfolioAsset, TeamMember, StackEntry, DiscoveryComment, CommentType } from './portfolio-types';

interface PortfolioItemEditorProps {
  item: DiscoveredItem;
  onSave: (item: DiscoveredItem) => void;
  onClose: () => void;
  allItems: DiscoveredItem[];
  onAddComment: (itemId: string, comment: Omit<DiscoveryComment, 'id' | 'itemId' | 'createdAt'>) => DiscoveryComment;
  onResolveComment: (itemId: string, commentId: string, resolvedBy: string) => boolean;
}

export const PortfolioItemEditor: React.FC<PortfolioItemEditorProps> = ({ 
  item, onSave, onClose, allItems, onAddComment, onResolveComment 
}) => {
  const [editMode, setEditMode] = useState<'overview' | 'metrics' | 'assets' | 'team' | 'redaction' | 'content' | 'techstack' | 'comments'>('overview');
  const [localItem, setLocalItem] = useState<DiscoveredItem>(item);
  const [showCommentModal, setShowCommentModal] = useState<{ fieldPath: string; type?: CommentType } | null>(null);

  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const updateField = <K extends keyof DiscoveredItem>(field: K, value: DiscoveredItem[K]) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (fieldPath: string, value: any) => {
    setLocalItem(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const paths = fieldPath.split('.');
      let current: any = clone;
      for (let i = 0; i < paths.length - 1; i++) {
        const key = paths[i];
        const nextKey = paths[i + 1];
        if (Array.isArray(current)) {
          const index = parseInt(key, 10);
          if (isNaN(index)) return prev;
          current = current[index];
        } else {
          current = current[key];
        }
        if (current === undefined) return prev;
      }
      const lastKey = paths[paths.length - 1];
      if (Array.isArray(current)) {
        const index = parseInt(lastKey, 10);
        if (isNaN(index)) return prev;
        current[index] = value;
      } else {
        current[lastKey] = value;
      }
      return clone;
    });
  };

  const addMetric = () => {
    const newMetric: CaseStudyMetric = {
      id: `metric-${Date.now()}`,
      label: '',
      value: '',
      context: '',
      category: 'efficiency',
      isHero: localItem.metrics.length === 0,
      verified: false
    };
    updateField('metrics', [...localItem.metrics, newMetric]);
  };

  const updateMetric = (id: string, field: keyof CaseStudyMetric, value: any) => {
    updateField('metrics', localItem.metrics.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMetric = (id: string) => {
    updateField('metrics', localItem.metrics.filter(m => m.id !== id));
  };

  const addAsset = () => {
    const newAsset: PortfolioAsset = {
      id: `asset-${Date.now()}`,
      type: 'screenshot',
      url: '',
      alt: '',
      isHero: localItem.assets.length === 0
    };
    updateField('assets', [...localItem.assets, newAsset]);
  };

  const updateAsset = (id: string, field: keyof PortfolioAsset, value: any) => {
    updateField('assets', localItem.assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id: string) => {
    updateField('assets', localItem.assets.filter(a => a.id !== id));
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: '',
      role: '',
      isVelyon: true,
      contribution: ''
    };
    updateField('team', [...localItem.team, newMember]);
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    updateField('team', localItem.team.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeTeamMember = (id: string) => {
    updateField('team', localItem.team.filter(m => m.id !== id));
  };

  const addStackEntry = (category: keyof DiscoveredItem['techStack']) => {
    const newEntry: StackEntry = {
      name: '',
      category,
      confidence: 'manual',
      source: 'user-input',
      detectedAt: new Date().toISOString()
    };
    updateField('techStack', {
      ...localItem.techStack,
      [category]: [...(localItem.techStack[category] || []), newEntry]
    });
  };

  const updateStackEntry = (category: keyof DiscoveredItem['techStack'], index: number, field: keyof StackEntry, value: any) => {
    const stack = { ...localItem.techStack };
    stack[category] = [...(stack[category] || [])];
    stack[category][index] = { ...stack[category][index], [field]: value };
    updateField('techStack', stack);
  };

  const removeStackEntry = (category: keyof DiscoveredItem['techStack'], index: number) => {
    const stack = { ...localItem.techStack };
    stack[category] = stack[category].filter((_, i) => i !== index);
    updateField('techStack', stack);
  };

  const toggleVisibility = (level: DiscoveredItem['visibility']) => {
    updateField('visibility', level);
    if (level === 'redacted') {
      updateField('clientContext', { ...localItem.clientContext, isNamed: false, ndaStatus: 'denied' });
    } else if (level === 'client-approved') {
      updateField('clientContext', { ...localItem.clientContext, isNamed: true, ndaStatus: 'approved' });
    } else if (level === 'public') {
      updateField('clientContext', { ...localItem.clientContext, isNamed: true, ndaStatus: 'approved' });
    } else if (level === 'internal-only') {
      updateField('clientContext', { ...localItem.clientContext, isNamed: false, ndaStatus: 'internal' });
    }
  };

  const handleSave = () => {
    // Add enrichment history
    const enriched = {
      ...localItem,
      enrichmentHistory: [
        ...localItem.enrichmentHistory,
        {
          id: `enrich-${Date.now()}`,
          timestamp: new Date().toISOString(),
          triggeredBy: 'user-edit' as const,
          fieldsUpdated: Object.keys(localItem),
          source: 'manual',
          changes: []
        }
      ]
    };
    onSave(enriched);
  };

  const getStatusConfig = (status: DiscoveredItem['status']) => {
    const configs: Record<DiscoveredItem['status'], { color: string; bg: string; icon: React.ReactNode }> = {
      production: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <CheckCircle2 size={12} className="text-emerald-400" /> },
      beta: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <TestTube size={12} className="text-blue-400" /> },
      alpha: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <Brain size={12} className="text-purple-400" /> },
      deprecated: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <AlertCircle size={12} className="text-amber-400" /> },
      archived: { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Archive size={12} className="text-slate-400" /> },
      internal: { color: 'text-indigo-400', bg: 'bg-indigo-500/20', icon: <Shield size={12} className="text-indigo-400" /> }
    };
    return configs[status] || configs.internal;
  };

  const getVisibilityConfig = (vis: DiscoveredItem['visibility']) => {
    const configs: Record<DiscoveredItem['visibility'], { color: string; bg: string; icon: React.ReactNode; label: string }> = {
      public: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <Globe size={12} className="text-emerald-400" />, label: 'Public' },
      'client-approved': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Eye size={12} className="text-blue-400" />, label: 'Client Approved' },
      redacted: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Lock size={12} className="text-amber-400" />, label: 'Redacted' },
      'internal-only': { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Shield size={12} className="text-slate-400" />, label: 'Internal Only' }
    };
    return configs[vis] || configs['internal-only'];
  };

  const getConfidenceColor = (conf: StackEntry['confidence']) => {
    const colors: Record<StackEntry['confidence'], string> = {
      detected: 'text-emerald-400 bg-emerald-500/20',
      inferred: 'text-blue-400 bg-blue-500/20',
      manual: 'text-indigo-400 bg-indigo-500/20',
      fabricated: 'text-amber-400 bg-amber-500/20'
    };
    return colors[conf];
  };

  const getCommentTypeColor = (type: CommentType) => {
    const colors: Record<CommentType, { color: string; bg: string; icon: React.ReactNode }> = {
      'missing-info': { color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertCircle size={10} className="text-red-400" /> },
      'auto-generate': { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <Brain size={10} className="text-purple-400" /> },
      'fabricated': { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Star size={10} className="text-amber-400" /> },
      'needs-review': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Eye size={10} className="text-blue-400" /> },
      'legal-hold': { color: 'text-rose-400', bg: 'bg-rose-500/20', icon: <Shield size={10} className="text-rose-400" /> },
      'technical-debt': { color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Wrench size={10} className="text-orange-400" /> },
      'client-feedback': { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <MessageSquare size={10} className="text-emerald-400" /> },
      'general': { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <FileText size={10} className="text-slate-400" /> }
    };
    return colors[type] || colors.general;
  };

  return (
    <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/30">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200"><X size={18} /></button>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            {
              'webapp': 'bg-indigo-500/20 text-indigo-400',
              'ai-tool': 'bg-rose-500/20 text-rose-400',
              'system': 'bg-purple-500/20 text-purple-400',
              'product': 'bg-emerald-500/20 text-emerald-400',
              'extension': 'bg-amber-500/20 text-amber-400',
              'api': 'bg-blue-500/20 text-blue-400',
              'library': 'bg-cyan-500/20 text-cyan-400',
              'pipeline': 'bg-orange-500/20 text-orange-400'
            }[localItem.sourceType] || 'bg-slate-500/20 text-slate-400'
          }`}>
            {{
              'webapp': <Globe size={20} />,
              'ai-tool': <Zap size={20} />,
              'system': <Database size={20} />,
              'product': <Layers size={20} />,
              'extension': <Puzzle size={20} />,
              'api': <Code size={20} />,
              'library': <BookOpen size={20} />,
              'pipeline': <GitBranch size={20} />
            }[localItem.sourceType] || <Box size={20} />}
          </div>
          <div>
            <input
              value={localItem.name}
              onChange={e => updateField('name', e.target.value)}
              className="bg-transparent border-none text-white font-bold text-lg focus:outline-none w-64"
            />
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span>{localItem.slug}</span>
              <span>•</span>
              <span>{localItem.discoveryMethod}</span>
              <span>•</span>
              <span>{new Date(localItem.discoveredAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={localItem.visibility}
              onChange={e => toggleVisibility(e.target.value as any)}
              className={`bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono ${getVisibilityConfig(localItem.visibility).bg} border-${getVisibilityConfig(localItem.visibility).color.replace('text-', '')}/30`}
            >
              <option value="public">🌍 Public</option>
              <option value="client-approved">✅ Client Approved</option>
              <option value="redacted">🔒 Redacted</option>
              <option value="internal-only">🏢 Internal Only</option>
            </select>
            <button onClick={handleSave} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
              <Save size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30 border-b border-white/5 px-2 py-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: <FileText size={12} /> },
          { id: 'metrics', label: 'Metrics', icon: <Award size={12} /> },
          { id: 'assets', label: 'Assets', icon: <Image size={12} /> },
          { id: 'team', label: 'Team', icon: <Users size={12} /> },
          { id: 'techstack', label: 'Tech Stack', icon: <Code size={12} /> },
          { id: 'redaction', label: 'Redaction', icon: <Shield size={12} /> },
          { id: 'content', label: 'Content Hints', icon: <Target size={12} /> },
          { id: 'comments', label: 'Comments', icon: <MessageSquare size={12} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setEditMode(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all min-w-[100px] justify-center whitespace-nowrap ${
              editMode === tab.id
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {editMode === 'overview' && <OverviewPanel item={localItem} updateField={updateField} updateNestedField={updateNestedField} />}
        {editMode === 'metrics' && <MetricsPanel item={localItem} updateField={updateField} addMetric={addMetric} updateMetric={updateMetric} removeMetric={removeMetric} onAddComment={showCommentModal ? onAddComment : undefined} />}
        {editMode === 'assets' && <AssetsPanel item={localItem} updateField={updateField} addAsset={addAsset} updateAsset={updateAsset} removeAsset={removeAsset} />}
        {editMode === 'team' && <TeamPanel item={localItem} updateField={updateField} addTeamMember={addTeamMember} updateTeamMember={updateTeamMember} removeTeamMember={removeTeamMember} />}
        {editMode === 'techstack' && <TechStackPanel item={localItem} updateField={updateField} addStackEntry={addStackEntry} updateStackEntry={updateStackEntry} removeStackEntry={removeStackEntry} getConfidenceColor={getConfidenceColor} onAddComment={showCommentModal ? onAddComment : undefined} />}
        {editMode === 'redaction' && <RedactionPanel item={localItem} updateField={updateField} updateNestedField={updateNestedField} />}
        {editMode === 'content' && <ContentHintsPanel item={localItem} updateField={updateField} updateNestedField={updateNestedField} />}
        {editMode === 'comments' && <CommentsPanel item={localItem} comments={localItem.comments} onAddComment={onAddComment} onResolveComment={onResolveComment} getCommentTypeColor={getCommentTypeColor} />}
      </div>
    </div>
  );
};

// ============================================================
// SUB-PANELS
// ============================================================

const OverviewPanel: React.FC<{ item: DiscoveredItem; updateField: any; updateNestedField: any }> = ({ item, updateField, updateNestedField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Tagline" value={item.tagline} onChange={v => updateField('tagline', v)} placeholder="One-line value proposition" />
      <Field label="Status" value={item.status} onChange={v => updateField('status', v as any)} type="select" options={['production','beta','alpha','deprecated','archived','internal']} />
    </div>
    <Field label="Description" value={item.description} onChange={v => updateField('description', v)} multiline rows={4} />
    <Field label="Long Description (Case Study Narrative)" value={item.longDescription || ''} onChange={v => updateField('longDescription', v)} multiline rows={8} />
    
    <div className="border-t border-white/5 pt-6">
      <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2"><Code size={16} className="text-indigo-400"/> Tech Stack Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['frontend','backend','ai','infrastructure','monitoring'].map(cat => (
          <TagField key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} tags={item.techStack[cat as keyof typeof item.techStack]?.map(s => s.name) || []} onChange={v => updateNestedField(`techStack.${cat}`, v.map(name => ({ name, category: cat, confidence: 'manual' as const, source: 'user-input' as const, detectedAt: new Date().toISOString() })))} suggestions={getStackSuggestions(cat)} />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TagField label="Industry Tags" tags={item.industryTags} onChange={v => updateField('industryTags', v)} suggestions={['FinTech','Healthcare','Legal','Retail','Manufacturing','Logistics','EdTech','PropTech','InsurTech','GovTech']} />
      <TagField label="Capability Tags" tags={item.capabilityTags} onChange={v => updateField('capabilityTags', v)} suggestions={['RAG','Agent','LLM Search','Computer Vision','Time Series','NLP','Recommendation','Anomaly Detection']} />
      <TagField label="Product Tags" tags={item.productTags} onChange={v => updateField('productTags', v)} suggestions={[]} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TagField label="Methodology Phases" tags={item.methodologyPhases} onChange={v => updateField('methodologyPhases', v)} suggestions={['Discovery','Architecture','Implementation','Evaluation','Deployment','Scaling']} />
      <TagField label="Related Products" tags={item.relatedProducts} onChange={v => updateField('relatedProducts', v)} suggestions={[]} />
      <TagField label="Related Cases" tags={item.relatedCases} onChange={v => updateField('relatedCases', v)} suggestions={[]} />
    </div>
  </div>
);

const MetricsPanel: React.FC<{ item: DiscoveredItem; updateField: any; addMetric: any; updateMetric: any; removeMetric: any; onAddComment: any }> = ({ 
  item, updateField, addMetric, updateMetric, removeMetric, onAddComment 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-slate-100">Impact Metrics</h3>
      <button onClick={addMetric} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/30 flex items-center gap-1.5"><Plus size={12} /> Add Metric</button>
    </div>

    {item.metrics.length === 0 ? (
      <div className="text-center py-12 text-slate-500">
        <Award size={48} className="mx-auto mb-4 opacity-30" />
        <p>No metrics defined. Add your first hero metric.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {item.metrics.map((metric, index) => (
          <div key={metric.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${metric.isHero ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {metric.isHero ? '★ HERO' : `Metric ${index + 1}`}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateMetric(metric.id, 'isHero', !metric.isHero)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-slate-200" title="Toggle Hero">
                  {metric.isHero ? <Star size={14} className="text-rose-400 fill-rose-400" /> : <Star size={14} />}
                </button>
                <button onClick={() => updateMetric(metric.id, 'verified', !metric.verified)} className={`p-1 rounded ${metric.verified ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400'}`} title="Verified">
                  <CheckCircle2 size={12} />
                </button>
                <button onClick={() => onAddComment(item.id, { fieldPath: `metrics[${index}].value`, type: 'missing-info', content: '', author: 'user', resolved: false })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-slate-200" title="Add Comment">
                  <MessageSquare size={12} />
                </button>
                <button onClick={() => removeMetric(metric.id)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Field label="Label" value={metric.label} onChange={v => updateMetric(metric.id, 'label', v)} placeholder="e.g., Inference Latency Reduction" size="sm" />
              <Field label="Value" value={metric.value} onChange={v => updateMetric(metric.id, 'value', v)} placeholder="e.g., 87%" size="sm" />
              <Field label="Context" value={metric.context} onChange={v => updateMetric(metric.id, 'context', v)} placeholder="e.g., reduction in p99 latency" size="sm" />
              <Field label="Category" value={metric.category} onChange={v => updateMetric(metric.id, 'category', v as any)} type="select" options={['speed','cost','accuracy','adoption','revenue','efficiency','latency','throughput','quality','custom']} size="sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Estimation Method" value={metric.estimationMethod || ''} onChange={v => updateMetric(metric.id, 'estimationMethod', v as any)} type="select" options={['industry-benchmark','similar-project','extrapolation','client-report','educated-guess']} size="sm" />
              <Field label="Confidence Min" value={metric.confidenceInterval?.min || ''} onChange={v => updateMetric(metric.id, 'confidenceInterval', { ...metric.confidenceInterval, min: v })} placeholder="Min" size="sm" />
              <Field label="Confidence Max" value={metric.confidenceInterval?.max || ''} onChange={v => updateMetric(metric.id, 'confidenceInterval', { ...metric.confidenceInterval, max: v })} placeholder="Max" size="sm" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className={`px-1.5 py-0.5 rounded ${getConfidenceColor(metric.verificationSource as any).replace('text-', 'bg-').replace('text-', 'text-')}`}>
                {metric.verificationSource || 'unverified'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AssetsPanel: React.FC<{ item: DiscoveredItem; updateField: any; addAsset: any; updateAsset: any; removeAsset: any }> = ({ 
  item, updateField, addAsset, updateAsset, removeAsset 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-slate-100">Media Assets</h3>
      <button onClick={addAsset} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/30 flex items-center gap-1.5"><Plus size={12} /> Add Asset</button>
    </div>

    {item.assets.length === 0 ? (
      <div className="text-center py-12 text-slate-500">
        <Image size={48} className="mx-auto mb-4 opacity-30" />
        <p>No assets uploaded. Add screenshots, architecture diagrams, demo videos, etc.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {item.assets.map((asset, index) => (
          <div key={asset.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${asset.isHero ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {asset.isHero ? '★ HERO' : `Asset ${index + 1}`}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => updateAsset(asset.id, 'isHero', !asset.isHero)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-slate-200" title="Toggle Hero">
                  {asset.isHero ? <Star size={12} className="text-rose-400 fill-rose-400" /> : <Star size={12} />}
                </button>
                <button onClick={() => removeAsset(asset.id)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
              </div>
            </div>
            <Field label="Type" value={asset.type} onChange={v => updateAsset(asset.id, 'type', v as any)} type="select" options={['screenshot','architecture-diagram','video-demo','logo','ui-component','data-viz','testimonial-video','code-snippet','wireframe','flowchart','dashboard-capture']} size="sm" />
            <Field label="URL" value={asset.url} onChange={v => updateAsset(asset.id, 'url', v)} placeholder="https://..." size="sm" />
            <Field label="Alt Text" value={asset.alt} onChange={v => updateAsset(asset.id, 'alt', v)} placeholder="Description for accessibility" size="sm" />
            <Field label="Caption" value={asset.caption || ''} onChange={v => updateAsset(asset.id, 'caption', v)} placeholder="Optional caption" size="sm" />
            <Field label="Redacted Version URL" value={asset.redactedVersion || ''} onChange={v => updateAsset(asset.id, 'redactedVersion', v)} placeholder="Blurred/anonymized variant" size="sm" />
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="px-1.5 py-0.5 bg-white/5 rounded">{asset.generatedBy || 'user-upload'}</span>
              {asset.generatedAt && <span>{new Date(asset.generatedAt).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TeamPanel: React.FC<{ item: DiscoveredItem; updateField: any; addTeamMember: any; updateTeamMember: any; removeTeamMember: any }> = ({ 
  item, updateField, addTeamMember, updateTeamMember, removeTeamMember 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-slate-100">Team Members</h3>
      <button onClick={addTeamMember} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/30 flex items-center gap-1.5"><Plus size={12} /> Add Member</button>
    </div>

    {item.team.length === 0 ? (
      <div className="text-center py-12 text-slate-500">
        <Users size={48} className="mx-auto mb-4 opacity-30" />
        <p>No team members added.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {item.team.map((member, index) => (
          <div key={member.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100">{member.name || `Member ${index + 1}`}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => removeTeamMember(member.id)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Name" value={member.name} onChange={v => updateTeamMember(member.id, 'name', v)} size="sm" />
              <Field label="Role" value={member.role} onChange={v => updateTeamMember(member.id, 'role', v)} size="sm" />
              <Field label="Contribution" value={member.contribution} onChange={v => updateTeamMember(member.id, 'contribution', v)} size="sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Field label="Avatar URL" value={member.avatar || ''} onChange={v => updateTeamMember(member.id, 'avatar', v)} placeholder="https://..." size="sm" />
              <Field label="LinkedIn" value={member.linkedin || ''} onChange={v => updateTeamMember(member.id, 'linkedin', v)} placeholder="https://linkedin.com/in/..." size="sm" />
              <Field label="Email" value={member.email || ''} onChange={v => updateTeamMember(member.id, 'email', v)} placeholder="name@velyon.io" size="sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={member.isVelyon} onChange={e => updateTeamMember(member.id, 'isVelyon', e.target.checked)} className="w-4 h-4 accent-rose-500" />
                <span className="text-slate-300">Velyon Team</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Hours Invested" value={member.hoursInvested?.toString() || ''} onChange={v => updateTeamMember(member.id, 'hoursInvested', parseInt(v) || undefined)} type="number" size="sm" />
              <Field label="Period" value={member.period?.start || ''} onChange={v => updateTeamMember(member.id, 'period', { ...member.period, start: v })} placeholder="Start date (ISO)" size="sm" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TechStackPanel: React.FC<{ item: DiscoveredItem; updateField: any; addStackEntry: any; updateStackEntry: any; removeStackEntry: any; getConfidenceColor: any; onAddComment: any }> = ({ 
  item, updateField, addStackEntry, updateStackEntry, removeStackEntry, getConfidenceColor, onAddComment 
}) => {
  const categories = ['frontend', 'backend', 'ai', 'infrastructure', 'monitoring', 'database', 'messaging', 'auth', 'testing', 'cicd'] as const;

  return (
    <div className="space-y-6">
      {categories.map((cat, catIndex) => (
        <div key={cat} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-100 capitalize">{cat}</h4>
            <button onClick={() => addStackEntry(cat)} className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={10} /> Add</button>
          </div>
          {(item.techStack[cat] || []).length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No entries. Click "Add" to start.</p>
          ) : (
            <div className="space-y-2">
              {(item.techStack[cat] || []).map((entry, entryIndex) => (
                <div key={`${cat}-${entryIndex}`} className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <input 
                    type="text" 
                    value={entry.name} 
                    onChange={e => updateStackEntry(cat, entryIndex, 'name', e.target.value)} 
                    placeholder="Technology name" 
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-semibold"
                  />
                  <select 
                    value={entry.confidence} 
                    onChange={e => updateStackEntry(cat, entryIndex, 'confidence', e.target.value as any)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${getConfidenceColor(entry.confidence)}`}
                  >
                    <option value="detected">🔍 Detected</option>
                    <option value="inferred">🧠 Inferred</option>
                    <option value="manual">✋ Manual</option>
                    <option value="fabricated">✨ Fabricated</option>
                  </select>
                  <select 
                    value={entry.source} 
                    onChange={e => updateStackEntry(cat, entryIndex, 'source', e.target.value as any)}
                    className="px-2 py-1 rounded text-[10px] font-bold border bg-black/40 text-slate-200"
                  >
                    <option value="package.json">📦 package.json</option>
                    <option value="wappalyzer">🔍 Wappalyzer</option>
                    <option value="header">📡 Header</option>
                    <option value="meta-tag">🏷️ Meta Tag</option>
                    <option value="dockerfile">🐳 Dockerfile</option>
                    <option value="k8s-manifest">☸️ K8s Manifest</option>
                    <option value="user-input">✋ User Input</option>
                    <option value="ai-generated">🤖 AI Generated</option>
                  </select>
                  <input 
                    type="text" 
                    value={entry.version || ''} 
                    onChange={e => updateStackEntry(cat, entryIndex, 'version', e.target.value)} 
                    placeholder="Version" 
                    className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40 font-mono"
                  />
                  <button onClick={() => removeStackEntry(cat, entryIndex)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
                  <button onClick={() => onAddComment(item.id, { fieldPath: `techStack.${cat}[${entryIndex}].name`, type: 'missing-info', content: '', author: 'user', resolved: false })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-slate-200" title="Add Comment"><MessageSquare size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RedactionPanel: React.FC<{ item: DiscoveredItem; updateField: any; updateNestedField: any }> = ({ item, updateField, updateNestedField }) => (
  <div className="space-y-6">
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
      <h4 className="font-bold text-indigo-400 flex items-center gap-2 mb-3"><Shield size={18} /> Redaction Strategy</h4>
      <p className="text-sm text-slate-300">Define how this project appears in public galleries, case studies, and product pages.</p>
      </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['public', 'client-approved', 'redacted', 'internal-only'].map(level => (
        <VisibilityCard 
          key={level} 
          level={level as any} 
          active={item.visibility === level}
          onClick={() => updateField('visibility', level)}
        />
      ))}
    </div>

    {item.visibility === 'redacted' && (
      <div className="space-y-4 border-t border-white/5 pt-6">
        <h4 className="font-bold text-slate-100">Redacted Client Profile</h4>
        <Field 
          label="Archetype (Public-Facing Description)" 
          value={item.clientContext.archetype || ''} 
          onChange={v => updateNestedField('clientContext.archetype', v)}
          placeholder="e.g., Tier-1 Multi-National Investment Bank"
        />
        <Field 
          label="Approved Assets (Asset IDs cleared for public use)" 
          value={item.clientContext.approvedAssets.join(', ')} 
          onChange={v => updateNestedField('clientContext.approvedAssets', v.split(',').map(s => s.trim()).filter(Boolean))}
          multiline rows={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Hide Metrics (comma-separated IDs)" value={item.clientContext.redactionRules?.hideMetrics?.join(', ') || ''} onChange={v => updateNestedField('clientContext.redactionRules.hideMetrics', v.split(',').map(s => s.trim()).filter(Boolean))} multiline rows={2} />
          <Field label="Anonymize Metrics (comma-separated IDs)" value={item.clientContext.redactionRules?.anonymizeMetrics?.join(', ') || ''} onChange={v => updateNestedField('clientContext.redactionRules.anonymizeMetrics', v.split(',').map(s => s.trim()).filter(Boolean))} multiline rows={2} />
        </div>
      </div>
    )}
  </div>
);

const ContentHintsPanel: React.FC<{ item: DiscoveredItem; updateField: any; updateNestedField: any }> = ({ item, updateField, updateNestedField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Suggested Case Study Format" value={item.contentHints.suggestedCaseStudyFormat} onChange={v => updateNestedField('contentHints.suggestedCaseStudyFormat', v as any)} type="select" options={['technical-deep-dive','business-outcome','transformation-story','product-showcase','architecture-review']} />
      <Field label="Target Audiences" value={item.contentHints.targetAudiences.join(', ')} onChange={v => updateNestedField('contentHints.targetAudiences', v.split(',').map(s => s.trim()).filter(Boolean))} multiline rows={2} />
    </div>
    <TagField label="Key Technical Insights" tags={item.contentHints.keyTechnicalInsights} onChange={v => updateNestedField('contentHints.keyTechnicalInsights', v)} suggestions={['RAG with validator loop','Multi-agent orchestration','Synthetic data generation','Streaming SSE architecture','Edge deployment']} />
    <TagField label="Replicable Patterns" tags={item.contentHints.replicablePatterns} onChange={v => updateNestedField('contentHints.replicablePatterns', v)} suggestions={['Vercel Edge + SSE','Supabase RLS + PGVector','Gemini 2.5 multi-modal','Framer Motion spring curves','21st.dev component injection']} />
    <TagField label="Notable Constraints" tags={item.contentHints.notableConstraints} onChange={v => updateNestedField('contentHints.notableConstraints', v)} suggestions={['NDA restrictions','Legacy system integration','Regulatory compliance','Data residency','Token budget limits']} />
    <TagField label="SEO Keywords" tags={item.contentHints.seoKeywords} onChange={v => updateNestedField('contentHints.seoKeywords', v)} suggestions={['Agentic AI','RAG pipeline','LLM evaluation','Multi-agent','Production AI']} />
    <TagField label="Competitive Differentiators" tags={item.contentHints.competitiveDifferentiators} onChange={v => updateNestedField('contentHints.competitiveDifferentiators', v)} suggestions={['Sub-100ms latency','99.9% factual accuracy','Zero-hallucination guarantee','Self-healing pipelines']} />
  </div>
);

const CommentsPanel: React.FC<{ item: DiscoveredItem; comments: DiscoveryComment[]; onAddComment: any; onResolveComment: any; getCommentTypeColor: any }> = ({ 
  item, comments, onAddComment, onResolveComment, getCommentTypeColor 
}) => {
  const [showModal, setShowModal] = useState<{ fieldPath: string; type?: CommentType } | null>(null);
  const [modalFieldPath, setModalFieldPath] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-100">Annotations & Comments</h3>
        <button onClick={() => { setModalFieldPath('general'); setShowModal({ fieldPath: 'general', type: 'general' }); }} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-500/30 flex items-center gap-1.5"><Plus size={12} /> Add Comment</button>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p>No comments yet. Flag missing info, request AI generation, or note fabricated estimates.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {comments.map((comment, index) => (
            <CommentCard 
              key={comment.id} 
              comment={comment} 
              index={index}
              onResolve={() => onResolveComment(item.id, comment.id, 'current-user')}
              getTypeColor={getCommentTypeColor}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CommentModal 
          fieldPath={modalFieldPath} 
          onClose={() => { setShowModal(null); setModalFieldPath(''); }}
          onSubmit={(type, content, prompt, context, confidence, source) => {
            onAddComment(item.id, { fieldPath: modalFieldPath, type, content, author: 'user', resolved: false, generationPrompt: prompt, generationContext: context, fabricationConfidence: confidence, fabricationSource: source });
            setShowModal(null);
            setModalFieldPath('');
          }}
        />
      )}
    </div>
  );
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number; type?: 'text' | 'select'; options?: string[]; size?: 'sm' | 'md' }> = ({ 
  label, value, onChange, placeholder, multiline, rows = 3, type = 'text', options, size = 'md' 
}) => (
  <div className="space-y-1.5">
    <label className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 ${size === 'sm' ? 'text-[9px]' : ''}`}>{label}</label>
    {type === 'select' ? (
      <select value={value} onChange={e => onChange(e.target.value)} className={`w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 ${size === 'sm' ? 'py-1.5' : 'py-2'}`}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-semibold ${size === 'sm' ? 'py-1.5' : ''}`} />
    )}
  </div>
);

const TagField: React.FC<{ label: string; tags: string[]; onChange: (tags: string[]) => void; suggestions: string[] }> = ({ label, tags, onChange, suggestions }) => {
  const [input, setInput] = useState('');
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-full flex items-center gap-1.5">
            {tag}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="hover:text-rose-400"><X size={10} /></button>
          </span>
        ))}
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { onChange([...tags, input.trim()]); setInput(''); } }} 
          placeholder="Add tag..." 
          className="flex-1 min-w-[120px] bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40"
          list={label.toLowerCase().replace(/\s+/g, '-')}
        />
        {suggestions.length > 0 && <datalist id={label.toLowerCase().replace(/\s+/g, '-')}>{suggestions.map(s => <option key={s} value={s} />)}</datalist>}
      </div>
    </div>
  );
};

const VisibilityCard: React.FC<{ level: DiscoveredItem['visibility']; active: boolean; onClick: () => void }> = ({ level, active, onClick }) => {
  const configs: Record<DiscoveredItem['visibility'], { color: string; bg: string; icon: React.ReactNode; label: string; desc: string }> = {
    public: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <Globe size={20} className="text-emerald-400" />, label: 'Public', desc: 'Full attribution: client name, logo, metrics, team' },
    'client-approved': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Eye size={20} className="text-blue-400" />, label: 'Client Approved', desc: 'Named client, approved assets only, selective metrics' },
    redacted: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Lock size={20} className="text-amber-400" />, label: 'Redacted', desc: 'Archetype only (e.g., "Top-5 Global Bank"), blurred assets, anonymized metrics' },
    'internal-only': { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: <Shield size={20} className="text-slate-400" />, label: 'Internal Only', desc: 'Never appears in public galleries. Internal reference only.' }
  };
  const config = configs[level];
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl border-2 transition-all text-left ${active ? `border-${config.color.replace('text-', '')} ${config.bg} shadow-lg shadow-${config.color.replace('text-', '')}/20` : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} border border-${config.color.replace('text-', '')}/30`}>{config.icon}</div>
        <div>
          <div className={`font-bold text-slate-100 ${config.color}`}>{config.label}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{config.desc}</div>
        </div>
      </div>
      {active && <div className="mt-3 text-[10px] font-bold text-rose-400 flex items-center gap-1"><CheckCircle2 size={10} /> Currently Active</div>}
    </button>
  );
};

const CommentCard: React.FC<{ comment: DiscoveryComment; index: number; onResolve: () => void; getTypeColor: any }> = ({ comment, index, onResolve, getTypeColor }) => {
  const colors = getCommentTypeColor(comment.type);
  return (
    <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className={`${colors.bg} ${colors.color} px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1`}>
            {colors.icon} {comment.type.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-slate-500">{comment.fieldPath}</span>
          {comment.fabricationConfidence && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {Math.round(comment.fabricationConfidence * 100)}% {comment.fabricationSource}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!comment.resolved && <button onClick={onResolve} className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded text-slate-400" title="Resolve"><CheckCircle2 size={12} /></button>}
          <span className="text-[9px] text-slate-600">{new Date(comment.createdAt).toLocaleString()}</span>
          <span className="text-[9px] text-slate-600">by {comment.author}</span>
        </div>
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">{comment.content}</div>
      {comment.generationPrompt && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 space-y-2 text-[10px]">
          <div className="font-bold text-purple-400">🤖 Generation Prompt:</div>
          <div className="font-mono text-slate-300">{comment.generationPrompt}</div>
          {comment.generationContext && (
            <>
              <div className="font-bold text-purple-400">Context:</div>
              <div className="font-mono text-slate-400">{comment.generationContext}</div>
            </>
          )}
        </div>
      )}
      {comment.resolved && (
        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
          <CheckCircle2 size={10} /> Resolved by {comment.resolvedBy} at {comment.resolvedAt ? new Date(comment.resolvedAt).toLocaleString() : 'unknown'}
        </div>
      )}
    </div>
  );
};

const CommentModal: React.FC<{ fieldPath: string; onClose: () => void; onSubmit: (type: CommentType, content: string, prompt?: string, context?: string, confidence?: number, source?: string) => void }> = ({ fieldPath, onClose, onSubmit }) => {
  const [type, setType] = useState<CommentType>('general');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [confidence, setConfidence] = useState(0.5);
  const [source, setSource] = useState<'industry-benchmark' | 'similar-project' | 'extrapolation' | 'client-report' | 'educated-guess'>('educated-guess');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100">Add Comment to <span className="font-mono text-rose-400">{fieldPath}</span></h3>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-200"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['missing-info','auto-generate','fabricated','needs-review','legal-hold','technical-debt','client-feedback','general'].map(t => (
            <button key={t} onClick={() => setType(t as CommentType)} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${type === t ? 'bg-rose-500 text-white' : 'bg-black/40 border border-white/10 text-slate-400 hover:text-slate-200'}`}>{t.replace('-', ' ').toUpperCase()}</button>
          ))}
        </div>
        <Field label="Content" value={content} onChange={setContent} multiline rows={4} placeholder="Describe what's missing, what to generate, or what you estimated..." />
        {type === 'auto-generate' && (
          <>
            <Field label="Generation Prompt" value={prompt} onChange={setPrompt} multiline rows={3} placeholder="e.g., Write a 3-paragraph case study narrative focusing on the RAG validator loop..." />
            <Field label="Additional Context" value={context} onChange={setContext} multiline rows={2} placeholder="Any extra context for the AI..." />
          </>
        )}
        {type === 'fabricated' && (
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="range" min="0" max="1" step="0.05" value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))} className="flex-1 accent-amber-500" />
              <span className="font-bold text-amber-400">Confidence: {Math.round(confidence * 100)}%</span>
            </label>
            <Field label="Fabrication Source" value={source} onChange={e => setSource(e.target.value as any)} type="select" options={['industry-benchmark','similar-project','extrapolation','client-report','educated-guess']} />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-slate-400 hover:text-slate-200 font-bold text-xs">Cancel</button>
          <button onClick={() => onSubmit(type, content, prompt || undefined, context || undefined, confidence, source)} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl">Add Comment</button>
        </div>
      </div>
    </div>
  );
};

// Missing icons
const Archive = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="1"/><path d="M6 15h12"/><path d="M10 3v6"/></svg>;
const Puzzle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M18 8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><path d="M6 18a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2z"/><path d="M4 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/></svg>;
const GitBranch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>;
const Wrench = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 16.2l4.6-4.6a2.1 2.1 0 0 0 0-3l-1.4-1.4a2.1 2.1 0 0 0-3 0l-3.2 3.2"/><path d="m15.7 17.3-6.5 6.5a2.1 2.1 0 0 1-3-3l1.8-1.8"/></svg>;

export default PortfolioItemEditor;