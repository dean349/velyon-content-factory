import React from 'react';
import { GapSectionProps } from './types';
import { TransformationEvidence, MetricComparison } from '../../../types/portfolio';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export const TransformationSection: React.FC<GapSectionProps<TransformationEvidence>> = ({ data, onChange }) => {
  const trans: TransformationEvidence = data || { before: { screenshots: [], description: '' }, after: { screenshots: [], description: '' }, timeline: '', metrics: [], narrativeSummary: '' };
  const update = (patch: Partial<TransformationEvidence>) => onChange({ ...trans, ...patch });

  const SnapshotCard: React.FC<{ label: string; side: 'before' | 'after'; snapshot: TransformationEvidence['before'] }> = ({ label, side, snapshot }) => (
    <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
      <h5 className={`font-bold text-xs ${side === 'before' ? 'text-red-400' : 'text-emerald-400'}`}>{label}</h5>
      <textarea value={snapshot.description} onChange={e => update({ [side]: { ...trans[side], description: e.target.value } })} rows={3} placeholder={`${label} state description...`} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />
      <input value={snapshot.capturedAt || ''} onChange={e => update({ [side]: { ...trans[side], capturedAt: e.target.value } })} placeholder="Captured at (ISO date)" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <SnapshotCard label="Before" side="before" snapshot={trans.before} />
        <SnapshotCard label="After" side="after" snapshot={trans.after} />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Timeline</label>
        <input value={trans.timeline} onChange={e => update({ timeline: e.target.value })} placeholder="e.g., 12 weeks" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
      </div>

      {/* Metric Comparisons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><ArrowRight size={10} /> Metric Comparisons</label>
          <button onClick={() => update({ metrics: [...trans.metrics, { metric: '', before: '', after: '', improvement: '' }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {trans.metrics.map((m: MetricComparison, i: number) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <input value={m.metric} onChange={e => { const updated = [...trans.metrics]; updated[i] = { ...m, metric: e.target.value }; update({ metrics: updated }); }} placeholder="Metric" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <input value={m.before} onChange={e => { const updated = [...trans.metrics]; updated[i] = { ...m, before: e.target.value }; update({ metrics: updated }); }} placeholder="Before" className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-red-400 outline-none" />
              <ArrowRight size={10} className="text-slate-500" />
              <input value={m.after} onChange={e => { const updated = [...trans.metrics]; updated[i] = { ...m, after: e.target.value }; update({ metrics: updated }); }} placeholder="After" className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-emerald-400 outline-none" />
              <input value={m.improvement} onChange={e => { const updated = [...trans.metrics]; updated[i] = { ...m, improvement: e.target.value }; update({ metrics: updated }); }} placeholder="Δ" className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-amber-400 outline-none" />
              <button onClick={() => update({ metrics: trans.metrics.filter((_: MetricComparison, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Narrative Summary</label>
        <textarea value={trans.narrativeSummary} onChange={e => update({ narrativeSummary: e.target.value })} rows={4} placeholder="Tell the transformation story..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>
    </div>
  );
};
