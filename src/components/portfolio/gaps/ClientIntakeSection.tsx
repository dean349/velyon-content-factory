import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { ClientIntake, StakeholderQuote } from '../../../types/portfolio';
import { Plus, Trash2, Quote, CheckCircle2 } from 'lucide-react';

export const ClientIntakeSection: React.FC<GapSectionProps<ClientIntake>> = ({ data, onChange }) => {
  const intake: ClientIntake = data || { problemStatement: '', businessObjectives: [], decisionContext: '', stakeholderQuotes: [], alternativesConsidered: [], whyVelyonWon: '', projectScope: '', successCriteria: [] };
  const update = (patch: Partial<ClientIntake>) => onChange({ ...intake, ...patch });

  const TagArray: React.FC<{ label: string; tags: string[]; onAdd: (t: string[]) => void }> = ({ label, tags, onAdd }) => {
    const [input, setInput] = useState('');
    return (
      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-full flex items-center gap-1">
              {tag}
              <button onClick={() => onAdd(tags.filter((_: string, idx: number) => idx !== i))} className="hover:text-rose-400">×</button>
            </span>
          ))}
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { onAdd([...tags, input.trim()]); setInput(''); } }} placeholder="Add..." className="flex-1 min-w-[80px] bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] text-slate-200 outline-none" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Problem Statement</label>
        <textarea value={intake.problemStatement} onChange={e => update({ problemStatement: e.target.value })} rows={3} placeholder="What problem did the client face?" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      <TagArray label="Business Objectives" tags={intake.businessObjectives} onAdd={businessObjectives => update({ businessObjectives })} />

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Decision Context</label>
        <textarea value={intake.decisionContext} onChange={e => update({ decisionContext: e.target.value })} rows={2} placeholder="How did they decide to work with Velyon?" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      {/* Stakeholder Quotes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Quote size={10} /> Stakeholder Quotes</label>
          <button onClick={() => update({ stakeholderQuotes: [...intake.stakeholderQuotes, { name: '', role: '', quote: '', approved: false }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {intake.stakeholderQuotes.map((sq: StakeholderQuote, i: number) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input value={sq.name} onChange={e => { const updated = [...intake.stakeholderQuotes]; updated[i] = { ...sq, name: e.target.value }; update({ stakeholderQuotes: updated }); }} placeholder="Name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <input value={sq.role} onChange={e => { const updated = [...intake.stakeholderQuotes]; updated[i] = { ...sq, role: e.target.value }; update({ stakeholderQuotes: updated }); }} placeholder="Role" className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <button onClick={() => update({ stakeholderQuotes: intake.stakeholderQuotes.filter((_: StakeholderQuote, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
            <textarea value={sq.quote} onChange={e => { const updated = [...intake.stakeholderQuotes]; updated[i] = { ...sq, quote: e.target.value }; update({ stakeholderQuotes: updated }); }} rows={2} placeholder="The quote..." className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-300 outline-none resize-none" />
            <button onClick={() => { const updated = [...intake.stakeholderQuotes]; updated[i] = { ...sq, approved: !sq.approved }; update({ stakeholderQuotes: updated }); }} className={`flex items-center gap-1 text-[9px] font-bold ${sq.approved ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 size={10} /> {sq.approved ? 'Approved' : 'Approve'}</button>
          </div>
        ))}
      </div>

      <TagArray label="Alternatives Considered" tags={intake.alternativesConsidered} onAdd={alternativesConsidered => update({ alternativesConsidered })} />

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Why Velyon Won</label>
        <textarea value={intake.whyVelyonWon} onChange={e => update({ whyVelyonWon: e.target.value })} rows={2} placeholder="What made the client choose Velyon?" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Project Scope</label>
        <textarea value={intake.projectScope} onChange={e => update({ projectScope: e.target.value })} rows={2} placeholder="What was included in the engagement?" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      <TagArray label="Success Criteria" tags={intake.successCriteria} onAdd={successCriteria => update({ successCriteria })} />
    </div>
  );
};
