import { useAppStore } from '@/store/useAppStore';

import { pullProfile, startProfileSync, stopProfileSync } from './profileSync';
import { supabase } from './supabase';

let started = false;

/**
 * Tracks the Supabase session for the app's lifetime: records the user in the
 * store, pulls their profile on sign-in, and clears per-user state on
 * sign-out. Call once at startup. Without Supabase configured the app runs
 * signed-out and authReady flips immediately.
 */
export function initAuth() {
  if (started) return;
  started = true;
  const { setAuth, resetForSignOut } = useAppStore.getState();

  if (!supabase) {
    setAuth(null);
    return;
  }

  void supabase.auth.getSession().then(async ({ data }) => {
    const userId = data.session?.user.id ?? null;
    if (userId) {
      await pullProfile(userId);
      startProfileSync(userId);
    }
    setAuth(userId);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') return; // handled by getSession above
    const userId = session?.user.id ?? null;
    if (userId === useAppStore.getState().userId) return; // token refresh, same user

    // supabase-js warns against awaiting its own calls inside this callback; defer them.
    setTimeout(async () => {
      if (event === 'SIGNED_OUT' || !userId) {
        stopProfileSync();
        resetForSignOut();
        setAuth(null);
        return;
      }
      await pullProfile(userId);
      startProfileSync(userId);
      setAuth(userId);
    }, 0);
  });
}
