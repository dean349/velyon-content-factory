import React, { useState, useEffect } from 'react';

export interface AppCredentials {
  githubToken: string;
  anthropicApiKey: string;
  vercelBypass: string;
}

interface CredentialsModalProps {
  credentials: AppCredentials;
  onSave: (creds: AppCredentials) => void;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

const CredentialField: React.FC<FieldProps> = ({ label, description, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
        <button type="button" onClick={() => setShow(s => !s)} className="text-xs text-slate-500 hover:text-slate-300">
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <p className="text-xs text-slate-400">{description}</p>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 font-mono w-full outline-none focus:border-rose-500/40"
      />
    </div>
  );
};

export const CredentialsModal: React.FC<CredentialsModalProps> = ({ credentials, onSave, onClose }) => {
  const [githubToken, setGithubToken] = useState(credentials.githubToken);
  const [anthropicApiKey, setAnthropicApiKey] = useState(credentials.anthropicApiKey);
  const [vercelBypass, setVercelBypass] = useState(credentials.vercelBypass);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#090911] border border-white/10 rounded-3xl p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <h2 className="font-bold text-xl text-slate-100">🔑 Credentials</h2>
        <p className="text-xs text-slate-400 mt-1">Stored in browser memory only — never saved to disk or git</p>

        <div className="mt-6 space-y-5">
          <CredentialField label="GitHub Personal Access Token" description="For private repo access — needs 'repo' scope" value={githubToken} onChange={setGithubToken} />
          <CredentialField label="Anthropic API Key" description="For AI classification — your personal key" value={anthropicApiKey} onChange={setAnthropicApiKey} />
          <CredentialField label="Vercel Protection Bypass Secret" description="For password-protected deployments — from Vercel dashboard → Settings → Deployment Protection" value={vercelBypass} onChange={setVercelBypass} />
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200">Cancel</button>
          <button type="button" onClick={() => onSave({ githubToken, anthropicApiKey, vercelBypass })} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl px-6 py-2.5">💾 Save</button>
        </div>
      </div>
    </div>
  );
};
