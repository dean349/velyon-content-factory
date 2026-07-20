import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { PostLaunchTracking, ROISnapshot } from '../../../types/portfolio';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';

export const PostLaunchTrackingSection: React.FC<GapSectionProps<PostLaunchTracking>> = ({ data, onChange }) => {
  const tracking: PostLaunchTracking = data || {};
  const update = (patch: Partial<PostLaunchTracking>) => onChange({ ...tracking, ...patch });

  const ROICard: React.FC<{ label: string; data: ROISnapshot | undefined; onChange: (v: ROISnapshot) => void }> = ({ label, data, onChange: setRoi }) => {
    const roi: ROISnapshot = data || { revenueImpact: '', costSavings: '', efficiencyGain: '', customMetrics: [], measuredAt: '' };
    return (
      <div className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-2">
        <h5 className="font-bold text-xs text-slate-100">{label}</h5>
        <input value={roi.revenueImpact} onChange={e => setRoi({ ...roi, revenueImpact: e.target.value })} placeholder="Revenue Impact" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
        <input value={roi.costSavings} onChange={e => setRoi({ ...roi, costSavings: e.target.value })} placeholder="Cost Savings" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
        <input value={roi.efficiencyGain} onChange={e => setRoi({ ...roi, efficiencyGain: e.target.value })} placeholder="Efficiency Gain" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
        <input value={roi.measuredAt} onChange={e => setRoi({ ...roi, measuredAt: e.target.value })} placeholder="Measured at (ISO)" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ROI Snapshots */}
      <div className="grid grid-cols-3 gap-3">
        <ROICard label="30-Day ROI" data={tracking.roi30Day} onChange={roi30Day => update({ roi30Day })} />
        <ROICard label="60-Day ROI" data={tracking.roi60Day} onChange={roi60Day => update({ roi60Day })} />
        <ROICard label="90-Day ROI" data={tracking.roi90Day} onChange={roi90Day => update({ roi90Day })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">NPS Score</label>
          <input type="range" min={0} max={100} value={tracking.npsScore || 50} onChange={e => update({ npsScore: parseInt(e.target.value) })} className="w-full accent-rose-500" />
          <span className="text-xs font-bold text-rose-400">{tracking.npsScore || '—'}</span>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Renewal Status</label>
          <div className="flex items-center gap-1">
            {(['renewed', 'expanding', 'at-risk', 'churned'] as const).map(status => (
              <button key={status} onClick={() => update({ renewalStatus: status })} className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${tracking.renewalStatus === status ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-black/40 border-white/10 text-slate-500 hover:text-slate-300'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Client Satisfaction</label>
        <textarea value={tracking.clientSatisfaction || ''} onChange={e => update({ clientSatisfaction: e.target.value })} rows={2} placeholder="How satisfied was the client post-launch?" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Last Updated</label>
        <input value={tracking.lastUpdated || ''} onChange={e => update({ lastUpdated: e.target.value })} placeholder="ISO date" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
      </div>
    </div>
  );
};
