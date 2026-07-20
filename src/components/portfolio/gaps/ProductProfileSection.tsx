import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { ProductProfile } from '../../../types/portfolio';
import { CheckCircle2 } from 'lucide-react';

const DELIVERY_MODELS: { key: ProductProfile['deliveryModel'][number]; label: string; desc: string }[] = [
  { key: 'consulting-led', label: 'Consulting-Led', desc: 'Velyon team implements it directly for the client' },
  { key: 'co-build', label: 'Co-Build', desc: 'Built alongside the client\u2019s own engineers' },
  { key: 'license', label: 'License', desc: 'Client licenses the product and runs it themselves' },
  { key: 'managed', label: 'Managed', desc: 'Velyon hosts and operates it on the client\u2019s behalf' },
];

const MATURITY_STAGES: ProductProfile['maturityStage'][] = ['concept', 'alpha', 'beta', 'production', 'sunset'];

const TagArray: React.FC<{ label: string; tags: string[]; onAdd: (t: string[]) => void; placeholder?: string }> = ({ label, tags, onAdd, placeholder }) => {
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
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { onAdd([...tags, input.trim()]); setInput(''); } }}
          placeholder={placeholder || 'Add...'}
          className="flex-1 min-w-[120px] bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] text-slate-200 outline-none"
        />
      </div>
    </div>
  );
};

export const ProductProfileSection: React.FC<GapSectionProps<ProductProfile>> = ({ data, onChange }) => {
  const profile: ProductProfile = data || {
    deliveryModel: [],
    maturityStage: 'beta',
    targetUseCases: [],
    keyCapabilities: [],
    internalOnly: true,
  };
  const update = (patch: Partial<ProductProfile>) => onChange({ ...profile, ...patch });

  const toggleDeliveryModel = (key: ProductProfile['deliveryModel'][number]) => {
    const has = profile.deliveryModel.includes(key);
    update({ deliveryModel: has ? profile.deliveryModel.filter(k => k !== key) : [...profile.deliveryModel, key] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
        <h4 className="font-bold text-emerald-400 mb-1">🚀 Velyon Product Profile</h4>
        <p className="text-sm text-slate-300">This is one of Velyon's own proprietary tools/systems — not client-delivered work. This profile is what powers the separate <span className="font-mono text-emerald-400">/products</span> catalog.</p>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Delivery Model (how clients can access this product)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DELIVERY_MODELS.map(dm => {
            const active = profile.deliveryModel.includes(dm.key);
            return (
              <button
                key={dm.key}
                onClick={() => toggleDeliveryModel(dm.key)}
                className={`text-left p-3 rounded-xl border transition-all ${active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/30 border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${active ? 'text-emerald-400' : 'text-slate-200'}`}>{dm.label}</span>
                  {active && <CheckCircle2 size={12} className="text-emerald-400" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{dm.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Maturity Stage</label>
        <select
          value={profile.maturityStage}
          onChange={e => update({ maturityStage: e.target.value as ProductProfile['maturityStage'] })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/40"
        >
          {MATURITY_STAGES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <TagArray label="Target Use Cases" tags={profile.targetUseCases} onAdd={targetUseCases => update({ targetUseCases })} placeholder="e.g., Fraud detection..." />
      <TagArray label="Key Capabilities" tags={profile.keyCapabilities} onAdd={keyCapabilities => update({ keyCapabilities })} placeholder="e.g., Real-time inference..." />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={profile.internalOnly} onChange={e => update({ internalOnly: e.target.checked })} className="w-4 h-4 accent-emerald-500" />
        <span className="text-slate-300">Internal only — not ready to appear in the public /products catalog yet</span>
      </label>
    </div>
  );
};
