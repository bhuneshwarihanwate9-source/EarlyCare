import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper to get current session from Supabase
 */
export async function getSupabaseSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Error fetching Supabase session:', error.message);
    return null;
  }
  return data.session;
}

/**
 * Sign in directly with email & password via Supabase
 */
export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase client is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Register directly with email & password via Supabase
 */
export async function signUpWithEmail(email, password, metadata = {}) {
  if (!supabase) throw new Error('Supabase client is not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out from Supabase session
 */
export async function signOutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('Supabase sign out error:', error.message);
}

/**
 * Request password reset email
 */
export async function resetUserPassword(email) {
  if (!supabase) throw new Error('Supabase client is not configured');
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#reset-password`,
  });
  if (error) throw error;
  return data;
}