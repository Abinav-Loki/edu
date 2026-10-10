import { createClient, SupabaseClient, Session, User as SupabaseUser } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    "[Supabase] Configuration missing or invalid. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
  );
}

// Client configuration with persistent local storage session support
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://placeholder-url.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "eduguard_auth_token",
    },
  }
);

// Auth helper utilities
export async function authSignIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please set your credentials in .env.");
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function authSignUp(email: string, password: string, metadata?: Record<string, any>) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please set your credentials in .env.");
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata || {} },
  });
  if (error) throw error;
  return data;
}

export async function authSignOut() {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function authGetSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn("[Supabase] Get session error:", error.message);
    return null;
  }
  return data.session;
}

export async function authGetUser(): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("[Supabase] Get user error:", error.message);
    return null;
  }
  return data.user;
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback as any);
}
