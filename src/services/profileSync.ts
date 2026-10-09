import { useAppStore, type AppState } from '@/store/useAppStore';

import { supabase } from './supabase';

/**
 * Keeps the signed-in user's profile row and the local store in step:
 * pull once on sign-in (the server copy wins, so a reinstall restores
 * onboarding and settings), then push local changes back, debounced.
 */

type SyncedSettings = Pick<AppState, 'connected' | 'planReady' | 'coachToggles' | 'dataModes' | 'nudgeBudget' | 'nudgeTypes'>;

interface ProfileRow {
  display_name: string;
  goal_type: string | null;
  onboarding_complete: boolean;
  settings: Partial<SyncedSettings>;
}

// profiles.goal_type values, in goalDefs order (data/mock.ts).
const GOAL_TYPES = ['race', 'muscle', 'hybrid', 'recomp'] as const;

function snapshot(s: AppState): ProfileRow {
  return {
    display_name: s.athleteName || 'Athlete',
    goal_type: GOAL_TYPES[s.goal] ?? null,
    onboarding_complete: s.onboardingComplete,
    settings: {
      connected: s.connected,
      planReady: s.planReady,
      coachToggles: s.coachToggles,
      dataModes: s.dataModes,
      nudgeBudget: s.nudgeBudget,
      nudgeTypes: s.nudgeTypes,
    },
  };
}

/** Loads the profile into the store. A fresh account (onboarding not done) keeps local choices instead. */
export async function pullProfile(userId: string) {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, goal_type, onboarding_complete, settings')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();
  if (error) {
    console.warn('[profile] pull failed', error.message);
    return;
  }
  // 'Athlete' is the column default, not a real name.
  const name = data?.display_name && data.display_name !== 'Athlete' ? data.display_name : null;
  if (!data?.onboarding_complete) {
    if (name) useAppStore.setState({ athleteName: name });
    return;
  }
  const goal = GOAL_TYPES.indexOf(data.goal_type as (typeof GOAL_TYPES)[number]);
  useAppStore.setState({
    ...data.settings,
    athleteName: name ?? useAppStore.getState().athleteName,
    goal: goal >= 0 ? goal : useAppStore.getState().goal,
    onboardingComplete: true,
  });
}

async function pushProfile(userId: string) {
  if (!supabase) return;
  const { error } = await supabase
    .from('profiles')
    .update({ ...snapshot(useAppStore.getState()), updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) console.warn('[profile] push failed', error.message);
}

let unsubscribe: (() => void) | null = null;

/** Starts pushing store changes for this user; call again on user change, stopProfileSync on sign-out. */
export function startProfileSync(userId: string) {
  stopProfileSync();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let last = JSON.stringify(snapshot(useAppStore.getState()));

  const unsub = useAppStore.subscribe((state) => {
    const next = JSON.stringify(snapshot(state));
    if (next === last) return;
    last = next;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void pushProfile(userId), 1500);
  });
  unsubscribe = () => {
    if (timer) clearTimeout(timer);
    unsub();
  };
}

export function stopProfileSync() {
  unsubscribe?.();
  unsubscribe = null;
}
