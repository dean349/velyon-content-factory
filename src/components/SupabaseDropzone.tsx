import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  FileText, 
  Film, 
  File, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getSupabaseClient, getSimulatedAssets, saveSimulatedAssets, IngestedAsset } from '../lib/supabase';

interface SupabaseDropzoneProps {
  onMdParsed?: (content: string, fileName: string) => void;
  onPdfParsed?: (fileName: string, size: number) => void;
  onVideoParsed?: (fileName: string, size: number) => void;
  onAddLog?: (log: string) => void;
}

export const SupabaseDropzone: React.FC<SupabaseDropzoneProps> = ({
  onMdParsed,
  onPdfParsed,
  onVideoParsed,
  onAddLog
}) => {
  const [assets, setAssets] = useState<IngestedAsset[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'pdfs' | 'markdown' | 'videos'>('all');
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  const supabase = getSupabaseClient();
  const isRealSupabase = supabase !== null;

  // Load initial assets
  useEffect(() => {
    if (isRealSupabase && supabase) {
      fetchSupabaseAssets();
    } else {
      setAssets(getSimulatedAssets());
    }
  }, [isRealSupabase]);

  // Fetch real assets from Supabase
  const fetchSupabaseAssets = async () => {
    if (!supabase) return;
    try {
      const fetchedList: IngestedAsset[] = [];
      const folders: ('pdfs' | 'markdown' | 'videos')[] = ['pdfs', 'markdown', 'videos'];

      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from('velyon-assets')
          .list(folder, {
            limit: 100,
            sortBy: { column: 'name', order: 'desc' }
          });

        if (error) {
          // If bucket doesn't exist, this might fail, which is fine
          console.warn(`Could not list ${folder} in Supabase:`, error.message);
          continue;
        }

        if (data) {
          data.forEach(item => {
            // Ignore placeholders or folder system nodes
            if (item.name === '.emptyFolderPlaceholder') return;

            const filePath = `${folder}/${item.name}`;
            const { data: urlData } = supabase.storage
              .from('velyon-assets')
              .getPublicUrl(filePath);

            let type = 'pdf';
            if (folder === 'markdown') type = 'md';
            if (folder === 'videos') type = 'video';

            fetchedList.push({
              id: `${folder}-${item.id || item.name}`,
              name: item.name,
              size: item.metadata?.size || 0,
              type,
              category: folder,
              uploadedAt: item.created_at || new Date().toISOString(),
              url: urlData.publicUrl || '#',
              isRealSupabase: true
            });
          });
        }
      }

      setAssets(fetchedList);
    } catch (e: any) {
      console.error('Error fetching Supabase assets:', e);
      // Fallback to local
      setAssets(getSimulatedAssets());
    }
  };

  // Drag and Drop handle
  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const log = (msg: string) => {
      if (onAddLog) onAddLog(msg);
      console.log(msg);
    };

    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        let category: 'pdfs' | 'markdown' | 'videos' = 'pdfs';
        let type = 'pdf';

        if (fileExt === 'md' || fileExt === 'txt') {
          category = 'markdown';
          type = 'md';
        } else if (['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(fileExt || '')) {
          category = 'videos';
          type = 'video';
        }

        log(`[SUPABASE]: Initiating ingestion for file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`);

        // If it's a markdown file, let's parse and compile it client side immediately for the visual editor
        if (type === 'md') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            if (onMdParsed) {
              onMdParsed(text, file.name);
            }
          };
          reader.readAsText(file);
        } else if (type === 'pdf') {
          if (onPdfParsed) onPdfParsed(file.name, file.size);
        } else if (type === 'video') {
          if (onVideoParsed) onVideoParsed(file.name, file.size);
        }

        if (isRealSupabase && supabase) {
          // Real Supabase upload
          const filePath = `${category}/${Date.now()}-${file.name}`;
          const { error: uploadErr } = await supabase.storage
            .from('velyon-assets')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadErr) {
            throw new Error(`Supabase upload failed: ${uploadErr.message}. Make sure the bucket 'velyon-assets' exists.`);
          }

          log(`[SUPABASE]: Successfully uploaded "${file.name}" to remote bucket path: "${filePath}"`);
        } else {
          // Simulated upload
          const newAsset: IngestedAsset = {
            id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type,
            category,
            uploadedAt: new Date().toISOString(),
            url: '#',
            isRealSupabase: false
          };

          const updated = [newAsset, ...assets];
          setAssets(updated);
          saveSimulatedAssets(updated);

          log(`[SUPABASE/LOCAL]: Simulated storage complete for "${file.name}". Asset mapped into active workspace stream.`);
        }
      }

      // Re-fetch assets
      if (isRealSupabase) {
        await fetchSupabaseAssets();
      }

      setUploadSuccess(`Successfully ingested ${acceptedFiles.length} file(s) into organized buckets.`);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error occurred while storing assets in bucket.');
      log(`[SUPABASE ERROR]: Ingestion aborted. ${err.message || 'Store exception'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt', '.md'],
      'video/*': ['.mp4', '.mov', '.webm', '.mkv', '.avi']
    }
  } as any);

  const handleDeleteAsset = async (asset: IngestedAsset) => {
    const log = (msg: string) => {
      if (onAddLog) onAddLog(msg);
    };

    try {
      if (asset.isRealSupabase && supabase) {
        const filePath = `${asset.category}/${asset.name}`;
        const { error } = await supabase.storage
          .from('velyon-assets')
          .remove([filePath]);

        if (error) {
          throw new Error(error.message);
        }

        log(`[SUPABASE]: Deleted asset "${asset.name}" from storage bucket.`);
        await fetchSupabaseAssets();
      } else {
        const updated = assets.filter(a => a.id !== asset.id);
        setAssets(updated);
        saveSimulatedAssets(updated);
        log(`[SUPABASE/LOCAL]: Removed simulated asset "${asset.name}".`);
      }
      setUploadSuccess(`Removed file "${asset.name}" successfully.`);
    } catch (err: any) {
      setUploadError(`Failed to delete file: ${err.message}`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(a => {
    if (activeCategoryFilter === 'all') return true;
    return a.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-4 flex-1 flex flex-col justify-between">
      
      {/* Bucket Connection Status Bar */}
      <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <Database size={14} className={isRealSupabase ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-300">
            {isRealSupabase ? '🟢 Connected to Supabase Cloud' : '🟡 Offline Simulator Mode'}
          </span>
        </div>
        
        <button
          onClick={() => setShowSetupGuide(!showSetupGuide)}
          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1"
        >
          <Info size={11} />
          <span>{showSetupGuide ? 'Hide API Setup' : 'How to Connect Supabase?'}</span>
        </button>
      </div>

      {/* API Setup Instructions Guide */}
      {showSetupGuide && (
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 space-y-3 text-xs text-indigo-300/90 leading-relaxed">
          <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
            <Layers size={13} className="text-rose-400" />
            <span>Supabase Storage Integration Instructions</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-2 text-[11px] text-slate-300">
            <li>
              Log into your <strong className="text-white">Supabase Dashboard</strong> and create a new bucket named <code className="bg-black/50 px-1 py-0.5 rounded text-rose-300 font-mono">velyon-assets</code>.
            </li>
            <li>
              Set bucket permission policies to <strong className="text-white">Public</strong>, or add policies allowing authenticated uploads and reads.
            </li>
            <li>
              Open your secret settings / env variables and set:
              <div className="mt-1 bg-black/60 p-2 rounded font-mono text-[9px] text-emerald-400 space-y-0.5">
                <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=your-anon-key-string</div>
              </div>
            </li>
            <li>
              Reload the app to activate real cloud uploads!
            </li>
          </ol>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div 
        {...getRootProps()} 
        className={`border border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all ${
          isDragActive 
            ? 'border-rose-500 bg-rose-500/5 shadow-lg scale-[1.01]' 
            : 'border-white/10 hover:border-white/20 bg-black/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {isUploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <UploadCloud size={24} />
            )}
          </div>
          {isDragActive && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-200">
            {isDragActive ? 'Drop files here immediately!' : 'Drag & Drop assets here'}
          </p>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Supports design system PDFs, MD configuration specs, and mp4/webm/mov testimonial videos
          </p>
        </div>

        <div className="flex gap-2 text-[8px] font-mono text-slate-600 bg-black/40 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
          <span>PDF (Design System)</span>
          <span>•</span>
          <span>MD (Style Specs)</span>
          <span>•</span>
          <span>Videos (Testimonials)</span>
        </div>
      </div>

      {/* Upload Feedback Toasts */}
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-red-400">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5 leading-normal">
            <span className="font-bold">Failed to ingest asset:</span>
            <p className="text-[11px] opacity-90">{uploadError}</p>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-400">
          <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5 leading-normal">
            <span className="font-bold">Ingestion Successful:</span>
            <p className="text-[11px] opacity-90">{uploadSuccess}</p>
          </div>
        </div>
      )}

      {/* Ingested Asset Drawer Grid */}
      <div className="space-y-3 mt-1">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
            Supabase Buckets Asset Drawer
          </span>
          <span className="text-[9px] text-slate-500 font-bold font-mono">
            {assets.length} Ingested Elements
          </span>
        </div>

        {/* Category filtering */}
        <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5 w-fit">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'pdfs', label: 'PDF Specs' },
            { id: 'markdown', label: 'MD Codes' },
            { id: 'videos', label: 'Videos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id as any)}
              className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                activeCategoryFilter === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Assets List */}
        <div className="grid grid-cols-1 gap-2 max-h-[190px] overflow-y-auto pr-1">
          {filteredAssets.length === 0 ? (
            <div className="py-8 text-center text-[10px] text-slate-600 font-mono italic">
              No files ingested in this bucket folder yet.
            </div>
          ) : (
            filteredAssets.map(asset => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between bg-black/25 border border-white/5 p-2.5 rounded-xl hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* File icon matching the type */}
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                    asset.type === 'pdf' ? 'bg-rose-500/10 text-rose-400' :
                    asset.type === 'md' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {asset.type === 'pdf' ? <File size={13} /> :
                     asset.type === 'md' ? <FileText size={13} /> :
                     <Film size={13} />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-200 truncate pr-2 max-w-[200px]">
                      {asset.name}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mt-0.5">
                      <span>{formatBytes(asset.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{asset.category} bucket folder</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
                  {asset.url !== '#' && (
                    <a 
                      href={asset.url}
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                      title="View public bucket asset"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteAsset(asset)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
                    title="Remove from Supabase Storage"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
