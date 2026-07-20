import React from 'react';
import { GapSectionProps } from './types';
import { ApprovalWorkflow, SignOff, AssetClearance } from '../../../types/portfolio';
import { Plus, Trash2, CheckCircle2, XCircle, Clock, Shield, FileCheck, AlertTriangle } from 'lucide-react';

const NDA_STYLES: Record<ApprovalWorkflow['ndaStatus'], { color: string; bg: string; border: string }> = {
  none: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  expired: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
};

const SIGNOFF_STYLES: Record<SignOff['status'], { color: string; bg: string; icon: React.ReactNode }> = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Clock size={10} /> },
  approved: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <CheckCircle2 size={10} /> },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/20', icon: <XCircle size={10} /> },
};

const CLEARANCE_STYLES: Record<AssetClearance['status'], { color: string; bg: string }> = {
  cleared: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  restricted: { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  blocked: { color: 'text-red-400', bg: 'bg-red-500/20' },
};

export const ApprovalWorkflowSection: React.FC<GapSectionProps<ApprovalWorkflow>> = ({ data, onChange }) => {
  const workflow: ApprovalWorkflow = data || { ndaStatus: 'none', signOffTracking: [], assetClearance: [] };

  const update = (patch: Partial<ApprovalWorkflow>) => onChange({ ...workflow, ...patch });

  const addSignOff = () => {
    update({ signOffTracking: [...workflow.signOffTracking, { person: '', role: '', date: '', status: 'pending' }] });
  };

  const updateSignOff = (index: number, field: keyof SignOff, value: any) => {
    const updated = workflow.signOffTracking.map((s: SignOff, i: number) => i === index ? { ...s, [field]: value } : s);
    update({ signOffTracking: updated });
  };

  const removeSignOff = (index: number) => {
    update({ signOffTracking: workflow.signOffTracking.filter((_: SignOff, i: number) => i !== index) });
  };

  const addClearance = () => {
    update({ assetClearance: [...workflow.assetClearance, { assetId: '', assetType: '', status: 'cleared' }] });
  };

  const updateClearance = (index: number, field: keyof AssetClearance, value: any) => {
    const updated = workflow.assetClearance.map((a: AssetClearance, i: number) => i === index ? { ...a, [field]: value } : a);
    update({ assetClearance: updated });
  };

  const removeClearance = (index: number) => {
    update({ assetClearance: workflow.assetClearance.filter((_: AssetClearance, i: number) => i !== index) });
  };

  const ndaStyle = NDA_STYLES[workflow.ndaStatus];

  return (
    <div className="space-y-6">
      {/* NDA Status */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><Shield size={14} className="text-indigo-400" /> NDA Status</h4>
        <div className="flex items-center gap-2">
          {(['none', 'pending', 'active', 'expired'] as const).map(status => {
            const style = NDA_STYLES[status];
            return (
              <button key={status} onClick={() => update({ ndaStatus: status })} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${workflow.ndaStatus === status ? `${style.color} ${style.bg} ${style.border}` : 'bg-black/40 border-white/10 text-slate-500 hover:text-slate-300'}`}>
                {status}
              </button>
            );
          })}
        </div>
        {workflow.ndaStatus !== 'none' && (
          <div className="grid grid-cols-2 gap-2">
            <input value={workflow.ndaExpiryDate || ''} onChange={e => update({ ndaExpiryDate: e.target.value })} placeholder="NDA Expiry Date" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
            <input value={workflow.legalContact || ''} onChange={e => update({ legalContact: e.target.value })} placeholder="Legal Contact" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
          </div>
        )}
      </div>

      {/* Sign-Off Tracking */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><FileCheck size={14} className="text-emerald-400" /> Sign-Off Tracking</h4>
          <button onClick={addSignOff} className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={10} /> Add</button>
        </div>
        {workflow.signOffTracking.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-4">No sign-offs tracked yet.</p>
        ) : (
          <div className="space-y-2">
            {workflow.signOffTracking.map((signoff: SignOff, i: number) => {
              const style = SIGNOFF_STYLES[signoff.status];
              return (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input value={signoff.person} onChange={e => updateSignOff(i, 'person', e.target.value)} placeholder="Person" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40" />
                      <input value={signoff.role} onChange={e => updateSignOff(i, 'role', e.target.value)} placeholder="Role" className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40" />
                      <input value={signoff.date} onChange={e => updateSignOff(i, 'date', e.target.value)} placeholder="Date" className="w-28 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40" />
                    </div>
                    <div className="flex items-center gap-1">
                      {(['pending', 'approved', 'rejected'] as const).map(s => (
                        <button key={s} onClick={() => updateSignOff(i, 'status', s)} className={`p-1 rounded text-[9px] font-bold transition-all ${signoff.status === s ? `${style.color} ${style.bg}` : 'bg-black/40 text-slate-500 hover:text-slate-300'}`}>
                          {SIGNOFF_STYLES[s].icon}
                        </button>
                      ))}
                      <button onClick={() => removeSignOff(i)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
                    </div>
                  </div>
                  <input value={signoff.notes || ''} onChange={e => updateSignOff(i, 'notes', e.target.value)} placeholder="Notes (optional)" className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none focus:border-indigo-500/40" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Clearance */}
      <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-amber-400" /> Asset Clearance</h4>
          <button onClick={addClearance} className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={10} /> Add</button>
        </div>
        {workflow.assetClearance.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-4">No assets tracked for clearance.</p>
        ) : (
          <div className="space-y-2">
            {workflow.assetClearance.map((asset: AssetClearance, i: number) => {
              const style = CLEARANCE_STYLES[asset.status];
              return (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input value={asset.assetId} onChange={e => updateClearance(i, 'assetId', e.target.value)} placeholder="Asset ID" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40" />
                      <input value={asset.assetType} onChange={e => updateClearance(i, 'assetType', e.target.value)} placeholder="Type" className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none focus:border-indigo-500/40" />
                    </div>
                    <div className="flex items-center gap-1">
                      {(['cleared', 'restricted', 'blocked'] as const).map(s => (
                        <button key={s} onClick={() => updateClearance(i, 'status', s)} className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${asset.status === s ? `${CLEARANCE_STYLES[s].color} ${CLEARANCE_STYLES[s].bg}` : 'bg-black/40 text-slate-500 hover:text-slate-300'}`}>
                          {s}
                        </button>
                      ))}
                      <button onClick={() => removeClearance(i)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={asset.clearedBy || ''} onChange={e => updateClearance(i, 'clearedBy', e.target.value)} placeholder="Cleared by" className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none focus:border-indigo-500/40" />
                    <input value={asset.clearedAt || ''} onChange={e => updateClearance(i, 'clearedAt', e.target.value)} placeholder="Cleared at" className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none focus:border-indigo-500/40" />
                  </div>
                  {asset.status === 'restricted' && (
                    <input value={asset.restrictions || ''} onChange={e => updateClearance(i, 'restrictions', e.target.value)} placeholder="Restrictions" className="w-full bg-black/40 border border-amber-500/20 rounded-lg px-2 py-1 text-[10px] text-amber-400 outline-none focus:border-amber-500/40" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
