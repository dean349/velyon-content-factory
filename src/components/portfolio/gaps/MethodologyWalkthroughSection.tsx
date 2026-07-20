import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { MethodologyPhase } from '../../../types/portfolio';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export const MethodologyWalkthroughSection: React.FC<GapSectionProps<MethodologyPhase[]>> = ({ data, onChange }) => {
  const phases: MethodologyPhase[] = data || [];
  const update = (updated: MethodologyPhase[]) => onChange(updated);

  const addPhase = () => {
    update([...phases, { name: '', description: '', deliverables: [], challenges: '', duration: '', order: phases.length + 1, keyDecisions: [] }]);
  };

  const updatePhase = (index: number, patch: Partial<MethodologyPhase>) => {
    update(phases.map((p: MethodologyPhase, i: number) => i === index ? { ...p, ...patch } : p));
  };

  const removePhase = (index: number) => {
    update(phases.filter((_: MethodologyPhase, i: number) => i !== index));
  };

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
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-100 text-sm">Methodology Phases</h4>
        <button onClick={addPhase} className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={10} /> Add Phase</button>
      </div>

      {phases.length === 0 ? (
        <p className="text-slate-500 text-xs text-center py-6">No phases defined. Add phases to walk through your methodology.</p>
      ) : (
        <div className="space-y-3">
          {phases.map((phase: MethodologyPhase, i: number) => (
            <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical size={12} className="text-slate-600" />
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">#{phase.order}</span>
                  <input value={phase.name} onChange={e => updatePhase(i, { name: e.target.value })} placeholder="Phase name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-bold" />
                  <input value={phase.duration} onChange={e => updatePhase(i, { duration: e.target.value })} placeholder="Duration" className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
                  <input type="number" value={phase.order} onChange={e => updatePhase(i, { order: parseInt(e.target.value) || 0 })} className="w-12 bg-black/40 border border-white/10 rounded-lg px-1 py-1 text-[10px] text-slate-400 outline-none text-center" />
                </div>
                <button onClick={() => removePhase(i)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
              </div>

              <textarea value={phase.description} onChange={e => updatePhase(i, { description: e.target.value })} rows={2} placeholder="What happens in this phase..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Deliverables</label>
                <TagInput tags={phase.deliverables} onAdd={deliverables => updatePhase(i, { deliverables })} placeholder="Add deliverable..." />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Challenges</label>
                <textarea value={phase.challenges} onChange={e => updatePhase(i, { challenges: e.target.value })} rows={2} placeholder="What challenges arose..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Key Decisions</label>
                <TagInput tags={phase.keyDecisions || []} onAdd={keyDecisions => updatePhase(i, { keyDecisions })} placeholder="Add decision..." />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
