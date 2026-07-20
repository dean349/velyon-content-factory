import React from 'react';
import { GapSectionProps } from './types';
import { DeliveryMetadata } from '../../../types/portfolio';
import { Package } from 'lucide-react';

export const DeliveryMetadataSection: React.FC<GapSectionProps<DeliveryMetadata>> = ({ data, onChange }) => {
  const meta: DeliveryMetadata = data || { budgetRange: '', timeline: '', teamSize: 0, engagementModel: 'fixed-price', startDate: '' };
  const update = (patch: Partial<DeliveryMetadata>) => onChange({ ...meta, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Budget Range</label>
          <input value={meta.budgetRange} onChange={e => update({ budgetRange: e.target.value })} placeholder="e.g., $50K-$100K" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Timeline</label>
          <input value={meta.timeline} onChange={e => update({ timeline: e.target.value })} placeholder="e.g., 12 weeks" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Team Size</label>
          <input type="number" value={meta.teamSize || ''} onChange={e => update({ teamSize: parseInt(e.target.value) || 0 })} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total Hours</label>
          <input type="number" value={meta.totalHours || ''} onChange={e => update({ totalHours: parseInt(e.target.value) || undefined })} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Engagement Model</label>
          <select value={meta.engagementModel} onChange={e => update({ engagementModel: e.target.value as any })} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none">
            {(['fixed-price', 'time-and-materials', 'retainer', 'equity', 'pro-bono'] as const).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Start Date</label>
          <input value={meta.startDate} onChange={e => update({ startDate: e.target.value })} placeholder="ISO date" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">End Date</label>
          <input value={meta.endDate || ''} onChange={e => update({ endDate: e.target.value })} placeholder="ISO date" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Project Manager</label>
          <input value={meta.projectManager || ''} onChange={e => update({ projectManager: e.target.value })} placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
      </div>
    </div>
  );
};
