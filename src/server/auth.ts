/**
 * Server-only: verifies the caller's Supabase session on API routes and
 * charges their monthly AI quota. Never import from a screen.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export interface AuthedUser {
  id: string;
  /** Supabase client acting as this user, so RLS and auth.uid() apply. */
  db: SupabaseClient;
}

/**
 * Returns the signed-in user, or a 401 response. When Supabase isn't
 * configured, development builds pass through as an anonymous user so the
 * routes stay testable; production refuses (fail closed).
 */
export async function requireUser(request: Request): Promise<{ user: AuthedUser | null } | { error: Response }> {
  if (!URL || !KEY) {
    if (process.env.NODE_ENV === 'production') {
      return { error: Response.json({ error: 'Accounts are not configured on the server.' }, { status: 501 }) };
    }
    return { user: null };
  }

  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) {
    return { error: Response.json({ error: 'Sign in required.' }, { status: 401 }) };
  }

  const db = createClient(URL, KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await db.auth.getClaims(token);
  const id = data?.claims.sub;
  if (error || !id) {
    return { error: Response.json({ error: 'Session expired — sign in again.' }, { status: 401 }) };
  }
  return { user: { id, db } };
}

/** Counts one request against the user's monthly quota; returns a 429 response when it's used up. */
export async function chargeQuota(user: AuthedUser | null, kind: 'chat' | 'vision'): Promise<Response | null> {
  if (!user) return null; // dev without Supabase
  const { data, error } = await user.db.rpc('consume_ai_quota', { p_kind: kind });
  if (error) {
    console.error('[quota] consume_ai_quota failed:', error.message);
    return Response.json({ error: 'Could not check your AI allowance.' }, { status: 503 });
  }
  if (data !== true) {
    return Response.json({ error: 'Monthly AI limit reached — it resets on the 1st.' }, { status: 429 });
  }
  return null;
}
