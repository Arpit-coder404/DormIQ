/**
 * DormIQ Supabase Service Abstraction
 * Supports real Supabase connectivity when environment variables are supplied,
 * otherwise gracefully falls back to local reactive storage.
 */

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isConnected: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConnected: Boolean(supabaseUrl && supabaseAnonKey),
  };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConnected;
};

