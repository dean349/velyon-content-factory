import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { ExportConfig } from '../../../types/portfolio';
import { Download } from 'lucide-react';

const FORMAT_OPTIONS: { value: ExportConfig['format']; label: string; desc: string; icon: string }[] = [
  { value: 'notebooklm', label: 'NotebookLM', desc: 'Google NotebookLM JSON', icon: '📓' },
  { value: 'cinematic', label: 'Cinematic', desc: 'Video script format', icon: '🎬' },
  { value: 'pdf', label: 'PDF', desc: 'Print-ready document', icon: '📄' },
  { value: 'cms', label: 'CMS', desc: 'Headless CMS payload', icon: '🖥️' },
  { value: 'social', label: 'Social', desc: 'Social media posts', icon: '📱' },
  { value: 'markdown', label: 'Markdown', desc: 'Plain markdown', icon: '📝' },
];

export const ExportConfigSection: React.FC<GapSectionProps<ExportConfig>> = ({ data, onChange }) => {
  const config: ExportConfig = data || { format: 'markdown', includeMetrics: true, includeTestimonials: true, includeMethodology: false };
  const update = (patch: Partial<ExportConfig>) => onChange({ ...config, ...patch });

  const TagInput: React.FC<{ tags: string[]; onAdd: (t: string[]) => void; placeholder: string }> = ({ tags, onAdd, placeholder }) => {
    const [input, setInput] = useState('');
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag: string, i: number) => (
          <span key={i} className="px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-full flex items-center gap-1">
            {tag}
            <button onClick={() => onAdd(tags.filter((_: string, idx: number) => idx !== i))} className="hover:text-rose-400">×</button>
          </span>
        ))}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { onAdd([...tags, input.trim()]); setInput(''); } }} placeholder={placeholder} className="flex-1 min-w-[80px] bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] text-slate-200 outline-none" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Download size={10} /> Export Format</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => update({ format: opt.value })} className={`p-3 rounded-xl border-2 transition-all text-left ${config.format === opt.value ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 hover:border-white/10 bg-black/30'}`}>
              <div className="text-lg mb-1">{opt.icon}</div>
              <div className="text-xs font-bold text-slate-100">{opt.label}</div>
              <div className="text-[9px] text-slate-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Template (optional)</label>
        <input value={config.template || ''} onChange={e => update({ template: e.target.value })} placeholder="Template name or path" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
      </div>

      {/* Boolean Toggles */}
      <div className="flex items-center gap-4">
        {([
          { key: 'includeMetrics' as const, label: 'Include Metrics' },
          { key: 'includeTestimonials' as const, label: 'Include Testimonials' },
          { key: 'includeMethodology' as const, label: 'Include Methodology' },
        ]).map(toggle => (
          <button key={toggle.key} onClick={() => update({ [toggle.key]: !config[toggle.key] })} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${config[toggle.key] ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-black/40 border-white/10 text-slate-500'}`}>
            <div className={`w-3 h-3 rounded-sm border ${config[toggle.key] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`} />
            {toggle.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Brand Voice</label>
        <textarea value={config.brandVoice || ''} onChange={e => update({ brandVoice: e.target.value })} rows={2} placeholder="e.g., Professional but approachable, technical depth, no jargon..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Custom Sections</label>
        <TagInput tags={config.customSections || []} onAdd={customSections => update({ customSections })} placeholder="Add custom section..." />
      </div>
    </div>
  );
};
