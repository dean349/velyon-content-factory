import React from 'react';
import { GapSectionProps, GapSectionConfig } from './types';
import { Testimonial as TestimonialType } from '../../../types/portfolio';
import { Plus, Trash2, Star, CheckCircle2, XCircle, Clock, Video, FileText, Headphones } from 'lucide-react';

const TYPE_ICONS: Record<TestimonialType['type'], React.ReactNode> = {
  text: <FileText size={12} />,
  video: <Video size={12} />,
  audio: <Headphones size={12} />,
};

const STATUS_STYLES: Record<TestimonialType['approvalStatus'], string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_ICONS: Record<TestimonialType['approvalStatus'], React.ReactNode> = {
  pending: <Clock size={10} />,
  approved: <CheckCircle2 size={10} />,
  rejected: <XCircle size={10} />,
};

export const TestimonialSection: React.FC<GapSectionProps<TestimonialType[]>> = ({ data, onChange }) => {
  const items = data || [];

  const add = () => {
    onChange([...items, {
      id: `test-${Date.now()}`,
      type: 'text',
      content: '',
      attribution: '',
      role: '',
      approvalStatus: 'pending',
    }]);
  };

  const update = (id: string, field: keyof TestimonialType, value: any) => {
    onChange(items.map((t: TestimonialType) => t.id === id ? { ...t, [field]: value } : t));
  };

  const remove = (id: string) => {
    onChange(items.filter((t: TestimonialType) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-100 text-sm">Client Testimonials</h4>
        <button onClick={add} className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1">
          <Plus size={10} /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No testimonials yet. Add client quotes, video links, or audio clips.</p>
      ) : (
        <div className="space-y-3">
          {items.map((t: TestimonialType) => (
            <div key={t.id} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-white/5 text-slate-400">{TYPE_ICONS[t.type]}</span>
                  <select value={t.type} onChange={e => update(t.id, 'type', e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 font-mono">
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${STATUS_STYLES[t.approvalStatus]}`}>
                    {STATUS_ICONS[t.approvalStatus]} {t.approvalStatus}
                  </span>
                </div>
                <button onClick={() => remove(t.id)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
              </div>

              <textarea value={t.content} onChange={e => update(t.id, 'content', e.target.value)} placeholder="The testimonial quote..." rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />

              <div className="grid grid-cols-2 gap-2">
                <input value={t.attribution} onChange={e => update(t.id, 'attribution', e.target.value)} placeholder="Attribution (e.g., Jane Smith)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
                <input value={t.role} onChange={e => update(t.id, 'role', e.target.value)} placeholder="Role (e.g., CTO)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input value={t.company || ''} onChange={e => update(t.id, 'company', e.target.value)} placeholder="Company" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
                <input value={t.assetUrl || ''} onChange={e => update(t.id, 'assetUrl', e.target.value)} placeholder="Asset URL (video/audio)" className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
              </div>

              <div className="flex items-center gap-2">
                {(['pending', 'approved', 'rejected'] as const).map(status => (
                  <button key={status} onClick={() => update(t.id, 'approvalStatus', status)} className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${t.approvalStatus === status ? STATUS_STYLES[status] : 'bg-black/40 border-white/10 text-slate-500 hover:text-slate-300'}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
