import React, { useState } from 'react';
import { GapSectionProps } from './types';
import { CaseStudyTemplate, TemplateSection } from '../../../types/portfolio';
import { Plus, Trash2, FileText } from 'lucide-react';

export const CaseStudyTemplateSection: React.FC<GapSectionProps<CaseStudyTemplate>> = ({ data, onChange }) => {
  const template: CaseStudyTemplate = data || { id: '', name: '', description: '', sections: [], promptTemplate: '', targetAudience: [], estimatedLength: '' };
  const update = (patch: Partial<CaseStudyTemplate>) => onChange({ ...template, ...patch });

  const addSection = () => {
    update({ sections: [...template.sections, { name: '', prompt: '', required: true, order: template.sections.length + 1 }] });
  };

  const updateSection = (index: number, patch: Partial<TemplateSection>) => {
    update({ sections: template.sections.map((s: TemplateSection, i: number) => i === index ? { ...s, ...patch } : s) });
  };

  const removeSection = (index: number) => {
    update({ sections: template.sections.filter((_: TemplateSection, i: number) => i !== index) });
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Template Name</label>
          <input value={template.name} onChange={e => update({ name: e.target.value })} placeholder="e.g., Technical Deep-Dive" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-bold" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Estimated Length</label>
          <input value={template.estimatedLength} onChange={e => update({ estimatedLength: e.target.value })} placeholder="e.g., 2,500 words" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Description</label>
        <textarea value={template.description} onChange={e => update({ description: e.target.value })} rows={2} placeholder="What this template produces..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Prompt Template</label>
        <textarea value={template.promptTemplate} onChange={e => update({ promptTemplate: e.target.value })} rows={4} placeholder="AI prompt template with {{variables}}..." className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/40 font-mono resize-none" />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Target Audience</label>
        <TagInput tags={template.targetAudience} onAdd={targetAudience => update({ targetAudience })} placeholder="Add audience..." />
      </div>

      {/* Template Sections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><FileText size={10} /> Template Sections</label>
          <button onClick={addSection} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {template.sections.map((section: TemplateSection, i: number) => (
          <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-rose-400">#{section.order}</span>
              <input value={section.name} onChange={e => updateSection(i, { name: e.target.value })} placeholder="Section name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none font-bold" />
              <button onClick={() => updateSection(i, { required: !section.required })} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${section.required ? 'bg-rose-500/20 text-rose-400' : 'bg-black/40 text-slate-500'}`}>{section.required ? 'Required' : 'Optional'}</button>
              <button onClick={() => removeSection(i)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
            <textarea value={section.prompt} onChange={e => updateSection(i, { prompt: e.target.value })} rows={2} placeholder="Prompt for this section..." className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-300 outline-none resize-none font-mono" />
          </div>
        ))}
      </div>
    </div>
  );
};
