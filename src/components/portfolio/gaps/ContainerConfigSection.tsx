import React from 'react';
import { GapSectionProps } from './types';
import { ContainerConfig, DockerImage, K8sManifest, HelmChart } from '../../../types/portfolio';
import { Plus, Trash2, Container } from 'lucide-react';

export const ContainerConfigSection: React.FC<GapSectionProps<ContainerConfig>> = ({ data, onChange }) => {
  const config: ContainerConfig = data || { dockerImages: [], kubernetesManifests: [], deploymentEnvironment: '' };
  const update = (patch: Partial<ContainerConfig>) => onChange({ ...config, ...patch });

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Deployment Environment</label>
        <input value={config.deploymentEnvironment} onChange={e => update({ deploymentEnvironment: e.target.value })} placeholder="e.g., AWS EKS, GKE, local" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40" />
      </div>

      {/* Docker Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Container size={10} /> Docker Images</label>
          <button onClick={() => update({ dockerImages: [...config.dockerImages, { name: '', tag: '', registry: '' }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {config.dockerImages.map((img: DockerImage, i: number) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
            <div className="flex items-center gap-2">
              <input value={img.name} onChange={e => { const updated = [...config.dockerImages]; updated[i] = { ...img, name: e.target.value }; update({ dockerImages: updated }); }} placeholder="Image name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <input value={img.tag} onChange={e => { const updated = [...config.dockerImages]; updated[i] = { ...img, tag: e.target.value }; update({ dockerImages: updated }); }} placeholder="Tag" className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none font-mono" />
              <input value={img.registry} onChange={e => { const updated = [...config.dockerImages]; updated[i] = { ...img, registry: e.target.value }; update({ dockerImages: updated }); }} placeholder="Registry" className="w-28 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
              <button onClick={() => update({ dockerImages: config.dockerImages.filter((_: DockerImage, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* K8s Manifests */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Kubernetes Manifests</label>
          <button onClick={() => update({ kubernetesManifests: [...config.kubernetesManifests, { name: '', namespace: 'default', kind: 'Deployment' }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {config.kubernetesManifests.map((manifest: K8sManifest, i: number) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
            <div className="flex items-center gap-2">
              <input value={manifest.name} onChange={e => { const updated = [...config.kubernetesManifests]; updated[i] = { ...manifest, name: e.target.value }; update({ kubernetesManifests: updated }); }} placeholder="Name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <input value={manifest.namespace} onChange={e => { const updated = [...config.kubernetesManifests]; updated[i] = { ...manifest, namespace: e.target.value }; update({ kubernetesManifests: updated }); }} placeholder="Namespace" className="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
              <select value={manifest.kind} onChange={e => { const updated = [...config.kubernetesManifests]; updated[i] = { ...manifest, kind: e.target.value }; update({ kubernetesManifests: updated }); }} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none">
                {['Deployment', 'Service', 'ConfigMap', 'Secret', 'Ingress', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob'].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <button onClick={() => update({ kubernetesManifests: config.kubernetesManifests.filter((_: K8sManifest, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Helm Charts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Helm Charts</label>
          <button onClick={() => update({ helmCharts: [...(config.helmCharts || []), { name: '', version: '', repository: '' }] })} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[9px] font-bold rounded-lg hover:bg-indigo-500/30 flex items-center gap-1"><Plus size={8} /> Add</button>
        </div>
        {(config.helmCharts || []).map((chart: HelmChart, i: number) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-2">
            <div className="flex items-center gap-2">
              <input value={chart.name} onChange={e => { const updated = [...(config.helmCharts || [])]; updated[i] = { ...chart, name: e.target.value }; update({ helmCharts: updated }); }} placeholder="Chart name" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none" />
              <input value={chart.version} onChange={e => { const updated = [...(config.helmCharts || [])]; updated[i] = { ...chart, version: e.target.value }; update({ helmCharts: updated }); }} placeholder="Version" className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none font-mono" />
              <input value={chart.repository} onChange={e => { const updated = [...(config.helmCharts || [])]; updated[i] = { ...chart, repository: e.target.value }; update({ helmCharts: updated }); }} placeholder="Repo URL" className="w-32 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-slate-400 outline-none" />
              <button onClick={() => update({ helmCharts: (config.helmCharts || []).filter((_: HelmChart, idx: number) => idx !== i) })} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-rose-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
