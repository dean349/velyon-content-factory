import React from 'react';
import { GapSectionProps } from './types';
import { PerformanceData } from '../../../types/portfolio';
import { Gauge, Activity, TrendingUp } from 'lucide-react';

export const PerformanceDataSection: React.FC<GapSectionProps<PerformanceData>> = ({ data, onChange }) => {
  const perf: PerformanceData = data || {};
  const update = (patch: Partial<PerformanceData>) => onChange({ ...perf, ...patch });

  const NumberInput: React.FC<{ label: string; value: number | undefined; onChange: (v: number) => void; max?: number }> = ({ label, value, onChange, max = 100 }) => (
    <div className="space-y-1">
      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <input type="number" min={0} max={max} value={value || ''} onChange={e => onChange(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
    </div>
  );

  const TextInput: React.FC<{ label: string; value: string | undefined; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1">
      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Lighthouse Scores */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><Gauge size={14} className="text-amber-400" /> Lighthouse Scores</h4>
        <div className="grid grid-cols-4 gap-3">
          <NumberInput label="Performance" value={perf.lighthouseScore?.performance} onChange={v => update({ lighthouseScore: { ...perf.lighthouseScore, performance: v, accessibility: perf.lighthouseScore?.accessibility || 0, seo: perf.lighthouseScore?.seo || 0, bestPractices: perf.lighthouseScore?.bestPractices || 0 } })} />
          <NumberInput label="Accessibility" value={perf.lighthouseScore?.accessibility} onChange={v => update({ lighthouseScore: { ...perf.lighthouseScore, accessibility: v, performance: perf.lighthouseScore?.performance || 0, seo: perf.lighthouseScore?.seo || 0, bestPractices: perf.lighthouseScore?.bestPractices || 0 } })} />
          <NumberInput label="SEO" value={perf.lighthouseScore?.seo} onChange={v => update({ lighthouseScore: { ...perf.lighthouseScore, seo: v, performance: perf.lighthouseScore?.performance || 0, accessibility: perf.lighthouseScore?.accessibility || 0, bestPractices: perf.lighthouseScore?.bestPractices || 0 } })} />
          <NumberInput label="Best Practices" value={perf.lighthouseScore?.bestPractices} onChange={v => update({ lighthouseScore: { ...perf.lighthouseScore, bestPractices: v, performance: perf.lighthouseScore?.performance || 0, accessibility: perf.lighthouseScore?.accessibility || 0, seo: perf.lighthouseScore?.seo || 0 } })} />
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><Activity size={14} className="text-emerald-400" /> Core Web Vitals</h4>
        <div className="grid grid-cols-4 gap-3">
          <TextInput label="LCP" value={perf.coreWebVitals?.lcp} onChange={v => update({ coreWebVitals: { ...perf.coreWebVitals, lcp: v, fid: perf.coreWebVitals?.fid || '', cls: perf.coreWebVitals?.cls || '', ttfb: perf.coreWebVitals?.ttfb || '' } })} placeholder="e.g., 1.2s" />
          <TextInput label="FID" value={perf.coreWebVitals?.fid} onChange={v => update({ coreWebVitals: { ...perf.coreWebVitals, fid: v, lcp: perf.coreWebVitals?.lcp || '', cls: perf.coreWebVitals?.cls || '', ttfb: perf.coreWebVitals?.ttfb || '' } })} placeholder="e.g., 50ms" />
          <TextInput label="CLS" value={perf.coreWebVitals?.cls} onChange={v => update({ coreWebVitals: { ...perf.coreWebVitals, cls: v, lcp: perf.coreWebVitals?.lcp || '', fid: perf.coreWebVitals?.fid || '', ttfb: perf.coreWebVitals?.ttfb || '' } })} placeholder="e.g., 0.05" />
          <TextInput label="TTFB" value={perf.coreWebVitals?.ttfb} onChange={v => update({ coreWebVitals: { ...perf.coreWebVitals, ttfb: v, lcp: perf.coreWebVitals?.lcp || '', fid: perf.coreWebVitals?.fid || '', cls: perf.coreWebVitals?.cls || '' } })} placeholder="e.g., 200ms" />
        </div>
      </div>

      {/* Traffic Data */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><TrendingUp size={14} className="text-blue-400" /> Traffic Data</h4>
        <div className="grid grid-cols-3 gap-3">
          <TextInput label="Monthly Visits" value={perf.trafficData?.monthlyVisits} onChange={v => update({ trafficData: { ...perf.trafficData, monthlyVisits: v, bounceRate: perf.trafficData?.bounceRate || '', avgSessionDuration: perf.trafficData?.avgSessionDuration || '' } })} placeholder="e.g., 50K" />
          <TextInput label="Bounce Rate" value={perf.trafficData?.bounceRate} onChange={v => update({ trafficData: { ...perf.trafficData, bounceRate: v, monthlyVisits: perf.trafficData?.monthlyVisits || '', avgSessionDuration: perf.trafficData?.avgSessionDuration || '' } })} placeholder="e.g., 35%" />
          <TextInput label="Avg Session" value={perf.trafficData?.avgSessionDuration} onChange={v => update({ trafficData: { ...perf.trafficData, avgSessionDuration: v, monthlyVisits: perf.trafficData?.monthlyVisits || '', bounceRate: perf.trafficData?.bounceRate || '' } })} placeholder="e.g., 4m 30s" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <TextInput label="Conversion Rate" value={perf.conversionRate} onChange={v => update({ conversionRate: v })} placeholder="e.g., 3.2%" />
        <TextInput label="Analytics Source" value={perf.analyticsSource} onChange={v => update({ analyticsSource: v })} placeholder="e.g., GA4" />
        <TextInput label="Last Measured" value={perf.lastMeasured} onChange={v => update({ lastMeasured: v })} placeholder="ISO date" />
      </div>
    </div>
  );
};
