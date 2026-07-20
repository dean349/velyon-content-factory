import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { AIClassification, AICategory, AIArchitecture, AIAutonomyLevel, DiscoveredItem } from '../../../types/portfolio';
import { CheckCircle2, X, Brain, Sparkles, Search } from 'lucide-react';

const CATEGORIES: { id: AICategory; label: string; icon: string; desc: string }[] = [
  { id: 'agentic-ai', label: 'Agentic AI', icon: '🤖', desc: 'Autonomous agents, tool-calling, multi-step reasoning' },
  { id: 'generative-ai', label: 'Generative AI', icon: '✨', desc: 'Text, image, video, audio, code generation' },
  { id: 'predictive-ai', label: 'Predictive AI', icon: '📈', desc: 'Forecasting, scoring, time-series' },
  { id: 'computer-vision', label: 'Computer Vision', icon: '👁️', desc: 'Image classification, OCR, object detection' },
  { id: 'nlp', label: 'NLP / Understanding', icon: '💬', desc: 'Sentiment, entities, summarisation, translation' },
  { id: 'recommendation', label: 'Recommendation', icon: '🎯', desc: 'Personalisation, ranking, collaborative filtering' },
  { id: 'anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', desc: 'Fraud, monitoring, outlier analysis' },
  { id: 'speech-audio', label: 'Speech & Audio', icon: '🎙️', desc: 'STT, TTS, transcription, audio classification' },
  { id: 'custom-models', label: 'Custom Models', icon: '🧠', desc: 'Fine-tuned / trained from scratch' },
  { id: 'data-mlops', label: 'Data & MLOps', icon: '⚙️', desc: 'Pipelines, feature stores, drift, monitoring' },
  { id: 'edge-ai', label: 'Edge AI', icon: '📱', desc: 'On-device, IoT, offline inference' },
  { id: 'knowledge-reasoning', label: 'Knowledge & Reasoning', icon: '🔗', desc: 'Knowledge graphs, logic, graph RAG' },
];

const ARCHITECTURES: { id: AIArchitecture; label: string; desc: string }[] = [
  { id: 'multi-agent', label: 'Multi-Agent System', desc: 'Multiple agents collaborating' },
  { id: 'rag-pipeline', label: 'RAG Pipeline', desc: 'Retrieval-augmented generation' },
  { id: 'single-agent-tools', label: 'Single Agent + Tools', desc: 'One agent with tool access' },
  { id: 'model-pipeline', label: 'Model Pipeline', desc: 'Sequential model chain' },
  { id: 'fine-tuned-model', label: 'Fine-Tuned Model', desc: 'Custom-trained with serving wrapper' },
  { id: 'api-orchestration', label: 'API Orchestration', desc: 'Multiple AI APIs stitched together' },
  { id: 'real-time-streaming', label: 'Real-Time Streaming', desc: 'Low-latency SSE / WebSockets' },
  { id: 'batch-processing', label: 'Batch Processing', desc: 'Scheduled offline runs' },
  { id: 'hybrid-complex', label: 'Hybrid / Complex', desc: 'Combination of approaches' },
];

const AUTONOMY_LEVELS: { id: AIAutonomyLevel; label: string; desc: string }[] = [
  { id: 'fully-autonomous', label: 'Fully Autonomous', desc: 'No human in the loop' },
  { id: 'human-in-the-loop', label: 'Human-in-the-Loop', desc: 'AI proposes, human reviews' },
  { id: 'human-approval-required', label: 'Human-Approval-Required', desc: 'AI works, human approves output' },
  { id: 'advisory-only', label: 'Advisory Only', desc: 'AI suggests, human acts' },
];

const MODEL_SUGGESTIONS = [
  'Claude Opus 4', 'Claude Sonnet 5', 'Claude Fable 5', 'GPT-4o', 'GPT-4o-mini',
  'Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Llama 3 (fine-tuned)', 'Whisper', 'Turbo',
  'DALL-E 3', 'Midjourney', 'YOLO', 'EfficientDet', 'OpenAI Embeddings',
  'Pinecone', 'Weaviate', 'Qdrant', 'Supabase pgvector', 'Hugging Face Transformers',
  'LangChain', 'LangGraph', 'CrewAI', 'AutoGen', 'custom-finetuned',
  'ElevenLabs', 'HeyGen', 'Higgsfield',
];

const METHODOLOGY_SUGGESTIONS = [
  'Chain-of-Thought (CoT)', 'Validator Loop', 'Synthetic Data Generation',
  'Few-Shot Prompting', 'DPO / RLHF Fine-Tuning', 'MCTS / Tree-of-Thought',
  'Structured Output (JSON mode)', 'Multi-Modal Fusion', 'Knowledge Graph + LLM',
  'Embedding + Reranking', 'Prompt Chaining', 'Self-Healing / Self-Correcting',
  'Streaming SSE Architecture', 'Edge / On-Device Inference',
];

const TagField: React.FC<{ label: string; tags: string[]; onChange: (tags: string[]) => void; suggestions: string[]; placeholder?: string }> = ({ label, tags, onChange, suggestions, placeholder }) => {
  const [input, setInput] = useState('');
  const dlId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag: string, i: number) => (
          <span key={i} className="px-2 py-0.5 bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold rounded-full flex items-center gap-1">
            {tag}
            <button onClick={() => onChange(tags.filter((_: string, idx: number) => idx !== i))} className="hover:text-rose-400"><X size={10} /></button>
          </span>
        ))}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { onChange([...tags, input.trim()]); setInput(''); } }} placeholder={placeholder || 'Add...'} className="flex-1 min-w-[140px] bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-slate-200 outline-none focus:border-violet-500/40" list={dlId} />
        {suggestions.length > 0 && <datalist id={dlId}>{suggestions.map(s => <option key={s} value={s} />)}</datalist>}
      </div>
    </div>
  );
};

export const AIMethodologySection: React.FC<{ item: DiscoveredItem; data: AIClassification | undefined; onChange: (data: AIClassification) => void; onAutoClassify?: () => void; onDeepScanGitHub?: () => void }> = ({ item, data, onChange, onAutoClassify, onDeepScanGitHub }) => {
  const [classifying, setClassifying] = useState(false);
  const ai: AIClassification = data || { primaryCategories: [], architecturePattern: '', modelsUsed: [], autonomyLevel: '', methodologies: [] };
  const update = (patch: Partial<AIClassification>) => onChange({ ...ai, ...patch });

  const toggleCategory = (id: AICategory) => {
    const has = ai.primaryCategories.includes(id);
    update({ primaryCategories: has ? ai.primaryCategories.filter(c => c !== id) : [...ai.primaryCategories, id] });
  };

  const handleClassify = async (fn?: () => void) => {
    if (!fn) return;
    setClassifying(true);
    try { fn(); } finally { setTimeout(() => setClassifying(false), 1000); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4">
        <h4 className="font-bold text-violet-400 flex items-center gap-2 mb-1"><Brain size={18} /> AI Classification</h4>
        <p className="text-sm text-slate-300">What type of AI does this project use? This powers the capabilities taxonomy on velyon.io and lets prospects filter by AI type.</p>
      </div>

      {(onAutoClassify || onDeepScanGitHub) && (
        <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            {onAutoClassify && (
              <button onClick={() => handleClassify(onAutoClassify)} disabled={classifying} className="px-4 py-2 bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-bold rounded-xl hover:bg-violet-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Sparkles size={14} /> {classifying ? 'Classifying...' : 'Auto-classify from URL'}
              </button>
            )}
            {onDeepScanGitHub && item.repoUrl && (
              <button onClick={() => handleClassify(onDeepScanGitHub)} disabled={classifying} className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl hover:bg-indigo-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Search size={14} /> {classifying ? 'Scanning...' : 'Deep scan repo'}
              </button>
            )}
            {classifying && <span className="text-xs text-slate-500 animate-pulse">Analyzing project...</span>}
          </div>
          {ai.source && (
            <div className="text-[10px] text-slate-500 flex items-center gap-2">
              {ai.lastClassifiedAt && <span>{new Date(ai.lastClassifiedAt).toLocaleDateString()}</span>}
              <span className={`px-1.5 py-0.5 rounded ${ai.source === 'deep-scan-github' ? 'bg-indigo-500/20 text-indigo-400' : ai.source === 'auto-classify-url' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {ai.source === 'deep-scan-github' ? '🔍 GitHub scan' : ai.source === 'auto-classify-url' ? '🤖 URL classify' : '✋ Manual'}
              </span>
              {ai.confidence !== undefined && <span>{Math.round(ai.confidence * 100)}%</span>}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Primary AI Category <span className="text-slate-600 normal-case">(select all that apply)</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(cat => {
            const active = ai.primaryCategories.includes(cat.id);
            return (
              <button key={cat.id} onClick={() => toggleCategory(cat.id)} className={`text-left p-3 rounded-xl border transition-all ${active ? 'bg-violet-500/10 border-violet-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-base mr-1.5">{cat.icon}</span>
                  <span className={`text-[11px] font-bold flex-1 ${active ? 'text-violet-400' : 'text-slate-200'}`}>{cat.label}</span>
                  {active && <CheckCircle2 size={12} className="text-violet-400 shrink-0" />}
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{cat.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Architecture Pattern <span className="text-slate-600 normal-case">(pick one)</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ARCHITECTURES.map(arch => {
            const active = ai.architecturePattern === arch.id;
            return (
              <button key={arch.id} onClick={() => update({ architecturePattern: active ? '' : arch.id })} className={`text-left p-3 rounded-xl border transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${active ? 'text-indigo-400' : 'text-slate-200'}`}>{arch.label}</span>
                  {active && <CheckCircle2 size={12} className="text-indigo-400 shrink-0" />}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{arch.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <TagField label="Models & Services Used" tags={ai.modelsUsed} onChange={modelsUsed => update({ modelsUsed })} suggestions={MODEL_SUGGESTIONS} placeholder="e.g. Claude Opus 4, GPT-4o..." />

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Autonomy Level</label>
        <div className="grid grid-cols-2 gap-2">
          {AUTONOMY_LEVELS.map(level => {
            const active = ai.autonomyLevel === level.id;
            return (
              <button key={level.id} onClick={() => update({ autonomyLevel: active ? '' : level.id })} className={`text-left p-3 rounded-xl border transition-all ${active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${active ? 'text-emerald-400' : 'text-slate-200'}`}>{level.label}</span>
                  {active && <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{level.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <TagField label="Key AI Methodology" tags={ai.methodologies} onChange={methodologies => update({ methodologies })} suggestions={METHODOLOGY_SUGGESTIONS} placeholder="e.g. Validator Loop, Chain-of-Thought..." />
    </div>
  );
};
