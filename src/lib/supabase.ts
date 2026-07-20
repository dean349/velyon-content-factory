import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client if configured, or null.
 * Leverages lazy initialization to avoid crashing on startup if variables are empty.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey);
    }
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export interface IngestedAsset {
  id: string;
  name: string;
  size: number;
  type: string; // 'pdf' | 'md' | 'video'
  category: 'pdfs' | 'markdown' | 'videos';
  uploadedAt: string;
  url: string;
  isRealSupabase: boolean;
}

// Local simulation state stored in localStorage for continuity during mock-mode previewing
const LOCAL_STORAGE_KEY = 'velyon_simulated_supabase_assets';

export function getSimulatedAssets(): IngestedAsset[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read simulated assets:', e);
  }

  // Pre-seed some default demo assets
  const defaults: IngestedAsset[] = [
    {
      id: 'demo-1',
      name: 'velyon_global_brand_guidelines_v2.pdf',
      size: 4820100, // ~4.6 MB
      type: 'pdf',
      category: 'pdfs',
      uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      url: '#',
      isRealSupabase: false,
    },
    {
      id: 'demo-2',
      name: 'rose_neon_theme_tokens.md',
      size: 14200, // ~14 KB
      type: 'md',
      category: 'markdown',
      uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      url: '#',
      isRealSupabase: false,
    },
    {
      id: 'demo-3',
      name: 'dean_keynote_testimonial_final.mp4',
      size: 45290100, // ~43.2 MB
      type: 'video',
      category: 'videos',
      uploadedAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      url: '#',
      isRealSupabase: false,
    }
  ];
  saveSimulatedAssets(defaults);
  return defaults;
}

export function saveSimulatedAssets(assets: IngestedAsset[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error('Failed to save simulated assets:', e);
  }
}
