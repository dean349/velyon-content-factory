import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { CompetitiveContext, Alternative } from '../../../types/portfolio';
import { Plus, Trash2, Swords } from 'lucide-react';

export const CompetitiveContextSection: React.FC<GapSectionProps<CompetitiveContext>> = ({ data, onChange }) => {
  const ctx: CompetitiveContext = data || { alternativesEvaluated: [], whyVelyonWon: '', differentiators: [], buyerJourney: '', decisionFactors: [] };
  const update = (patch: Partial<CompetitiveContext>) => onChange({ ...ctx, ...patch });

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
      {/* Alternatives Evaluated */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Swords size={10} /> Alternatives Evaluated</label>
          <button onClick={() => update({ alternativesEvaluated: [...ctx.alternativesEvaluated, { name: '', type: 'competitor', pros: [], cons: [], whyNotChosen: '' }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {ctx.alternativesEvaluated.map((alt: Alternative, i: number) => (
          <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input value={alt.name} onChange={e => { const updated = [...ctx.alternativesEvaluated]; updated[i] = { ...alt, name: e.target.value }; update({ alternativesEvaluated: updated }); }} placeholder="Name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none font-bold" />
              <select value={alt.type} onChange={e => { const updated = [...ctx.alternativesEvaluated]; updated[i] = { ...alt, type: e.target.value as any }; update({ alternativesEvaluated: updated }); }} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none">
                {(['diy', 'competitor', 'agency', 'internal-team'] as const).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={alt.estimatedCost || ''} onChange={e => { const updated = [...ctx.alternativesEvaluated]; updated[i] = { ...alt, estimatedCost: e.target.value }; update({ alternativesEvaluated: updated }); }} placeholder="Cost" className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
              <button onClick={() => update({ alternativesEvaluated: ctx.alternativesEvaluated.filter((_: Alternative, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
            <textarea value={alt.whyNotChosen} onChange={e => { const updated = [...ctx.alternativesEvaluated]; updated[i] = { ...alt, whyNotChosen: e.target.value }; update({ alternativesEvaluated: updated }); }} rows={2} placeholder="Why not chosen..." className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-300 outline-none resize-none" />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Why Velyon Won</label>
        <textarea value={ctx.whyVelyonWon} onChange={e => update({ whyVelyonWon: e.target.value })} rows={3} placeholder="What made Velyon the winning choice..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Buyer Journey</label>
        <textarea value={ctx.buyerJourney} onChange={e => update({ buyerJourney: e.target.value })} rows={2} placeholder="How did the buyer progress through their decision..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Differentiators</label>
        <TagInput tags={ctx.differentiators} onAdd={differentiators => update({ differentiators })} placeholder="Add differentiator..." />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Decision Factors</label>
        <TagInput tags={ctx.decisionFactors} onAdd={decisionFactors => update({ decisionFactors })} placeholder="Add factor..." />
      </div>
    </div>
  );
};
