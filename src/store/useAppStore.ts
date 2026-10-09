import { create } from 'zustand';

/**
 * Single global store mirroring the interactive `state{}` from the Claude
 * Design prototype (Fitness Dashboard Options.dc.html, script section).
 * Field names intentionally match the source so the mapping from design
 * intent -> implementation stays traceable. Grouped by the "turn" that
 * introduced them.
 */
export interface AppState {
  // athlete / identity
  athleteName: string;
  readiness: number; // 0-100, normally computed — see services/readiness.ts
  onboardingComplete: boolean;

  // turn 2 — main tabs
  openDay: number | null;
  openMeal: number | null;
  bodyRange: number; // shared by turn 2 body tab + turn 10 (screens use their own local default)
  chatStep: number;

  // turn 1a — today
  sessionOpen: boolean;
  macrosOpen: boolean;
  aTab: number;

  // turn 2 — body tab (AI photo check-in card)
  photoOpen: boolean;

  // turn 3 — onboarding
  goal: number;
  connected: Record<number, boolean>;
  planReady: boolean;

  // turn 4 — workout live
  runRep: number;
  runPaused: boolean;
  setsLogged: number;

  // turn 5 — meal capture
  shotTaken: boolean;
  portions: Record<number, number>;
  lastPhotoBase64: string | null;

  // turn 6 — progress photo
  ppStep: number;
  ppPose: number;
  openMilestone: number;

  // turn 7 — coach chat
  swapChoice: 'apply' | 'decline' | null;
  openWhy: number;
  coachChoice: 'swap' | 'keep' | null;

  // turn 8 — settings
  coachToggles: Record<number, boolean>;
  dataModes: Record<number, number>;

  // turn 9 — weekly plan
  openPlanDay: number;
  openPhase: number;

  // turn 10 — body trends
  bodyMetric: number;
  weighWhyOpen: boolean;

  // turn 11 — paywall
  pwTier: number;
  pwAnnual: boolean;

  // turn 12 — notifications
  nudgeBudget: number;
  nudgeTypes: Record<number, boolean>;

  // turn 13 — race day
  raceChecks: Record<number, boolean>;
  openLearning: number;

  // turn 14 — social
  respects: Record<number, boolean>;
  rsvp: 'yes' | 'no' | null;

  // turn 15 — injury
  nigZone: number;
  nigSev: number;
  painToday: number;
  openFactor: number | null; // also reused by turn 16 recovery factors

  // turn 16 — sleep
  // (openFactor above)

  // turn 17 — watch companion
  wRep: number;
  wFuel: 'done' | 'skip' | null;
  wRpe: number | null;

  // misc
  toast: number | null;
}

export interface AppActions {
  setAthleteName: (name: string) => void;
  setReadiness: (v: number) => void;
  completeOnboarding: () => void;

  toggleOpenDay: (i: number) => void;
  toggleOpenMeal: (i: number) => void;
  setBodyRange: (i: number) => void;
  advanceChatStep: () => void;

  toggleSession: () => void;
  toggleMacros: () => void;
  setATab: (i: number) => void;
  togglePhoto: () => void;

  setGoal: (i: number) => void;
  toggleConnected: (i: number) => void;
  generatePlan: () => void;
  resetPlan: () => void;

  lapDone: () => void;
  togglePause: () => void;
  logSet: () => void;
  undoSet: () => void;

  takeShot: () => void;
  retakeShot: () => void;
  cyclePortion: (i: number) => void;
  setLastPhotoBase64: (b64: string | null) => void;

  ppAdvance: () => void;
  ppReset: () => void;
  setPpPose: (i: number) => void;
  toggleMilestone: (i: number) => void;

  acceptSwap: () => void;
  declineSwap: () => void;
  toggleOpenWhy: (i: number) => void;
  acceptPlanSwap: () => void;
  keepPlan: () => void;

  toggleCoachPref: (i: number) => void;
  cycleDataMode: (i: number) => void;

  toggleOpenPlanDay: (i: number) => void;
  toggleOpenPhase: (i: number) => void;

  setBodyMetric: (i: number) => void;
  toggleWeighWhy: () => void;

  setPwTier: (i: number) => void;
  setPwAnnual: (annual: boolean) => void;

  setNudgeBudget: (v: number) => void;
  toggleNudgeType: (i: number) => void;

  toggleRaceCheck: (i: number) => void;
  toggleOpenLearning: (i: number) => void;

  toggleRespect: (i: number) => void;
  setRsvp: (v: 'yes' | 'no') => void;

  setNigZone: (i: number) => void;
  setNigSev: (i: number) => void;
  setPainToday: (n: number) => void;
  toggleOpenFactor: (i: number) => void;

  wAdvanceRep: () => void;
  setWFuel: (v: 'done' | 'skip' | null) => void;
  setWRpe: (n: number) => void;

  setToast: (i: number | null) => void;
}

const toggleRecord = <T extends Record<number, boolean>>(rec: T, i: number): T => ({ ...rec, [i]: !rec[i] } as T);

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  athleteName: 'Moiz',
  readiness: 66,
  onboardingComplete: false,

  openDay: 1,
  openMeal: null,
  bodyRange: 1,
  chatStep: 0,

  sessionOpen: false,
  macrosOpen: false,
  aTab: 0,
  photoOpen: false,

  goal: 0,
  connected: { 0: true },
  planReady: false,

  runRep: 2,
  runPaused: false,
  setsLogged: 2,

  shotTaken: false,
  portions: { 0: 1, 1: 1, 2: 1 },
  lastPhotoBase64: null,

  ppStep: 0,
  ppPose: 0,
  openMilestone: 0,

  swapChoice: null,
  openWhy: 0,
  coachChoice: null,

  coachToggles: { 0: true, 1: true, 2: false },
  dataModes: { 0: 2, 1: 2, 2: 1, 3: 0 },

  openPlanDay: 1,
  openPhase: 1,

  bodyMetric: 0,
  weighWhyOpen: false,

  pwTier: 1,
  pwAnnual: true,

  nudgeBudget: 5,
  nudgeTypes: { 0: true, 1: true, 2: true, 3: false, 4: true },

  raceChecks: { 0: true, 1: true },
  openLearning: 0,

  respects: { 0: false, 1: true, 2: false },
  rsvp: null,

  nigZone: 4,
  nigSev: 0,
  painToday: 1,
  openFactor: 0,

  wRep: 2,
  wFuel: null,
  wRpe: null,

  toast: null,

  // ── actions ──
  setAthleteName: (name) => set({ athleteName: name }),
  setReadiness: (v) => set({ readiness: Math.max(0, Math.min(100, v)) }),
  completeOnboarding: () => set({ onboardingComplete: true }),

  toggleOpenDay: (i) => set((s) => ({ openDay: s.openDay === i ? null : i })),
  toggleOpenMeal: (i) => set((s) => ({ openMeal: s.openMeal === i ? null : i })),
  setBodyRange: (i) => set({ bodyRange: i }),
  advanceChatStep: () => set((s) => ({ chatStep: Math.min(s.chatStep + 1, 1) })),

  toggleSession: () => set((s) => ({ sessionOpen: !s.sessionOpen })),
  toggleMacros: () => set((s) => ({ macrosOpen: !s.macrosOpen })),
  setATab: (i) => set({ aTab: i }),
  togglePhoto: () => set((s) => ({ photoOpen: !s.photoOpen })),

  setGoal: (i) => set({ goal: i }),
  toggleConnected: (i) => set((s) => ({ connected: toggleRecord(s.connected, i) })),
  generatePlan: () => set({ planReady: true }),
  resetPlan: () => set({ planReady: false }),

  lapDone: () =>
    set((s) => ({
      runRep: s.runRep >= 5 ? 2 : s.runRep + 1,
      runPaused: false,
    })),
  togglePause: () => set((s) => ({ runPaused: !s.runPaused })),
  logSet: () => set((s) => ({ setsLogged: Math.min(5, s.setsLogged + 1) })),
  undoSet: () => set((s) => ({ setsLogged: Math.max(0, s.setsLogged - 1) })),

  takeShot: () => set({ shotTaken: true }),
  retakeShot: () => set({ shotTaken: false, lastPhotoBase64: null }),
  cyclePortion: (i) => set((s) => ({ portions: { ...s.portions, [i]: ((s.portions[i] ?? 1) + 1) % 3 } })),
  setLastPhotoBase64: (b64) => set({ lastPhotoBase64: b64 }),

  ppAdvance: () => set((s) => ({ ppStep: s.ppStep >= 2 ? 0 : s.ppStep + 1 })),
  ppReset: () => set({ ppStep: 0 }),
  setPpPose: (i) => set({ ppPose: i }),
  toggleMilestone: (i) => set((s) => ({ openMilestone: s.openMilestone === i ? -1 : i })),

  acceptSwap: () => set({ swapChoice: 'apply' }),
  declineSwap: () => set({ swapChoice: 'decline' }),
  toggleOpenWhy: (i) => set((s) => ({ openWhy: s.openWhy === i ? -1 : i })),
  acceptPlanSwap: () => set({ coachChoice: 'swap' }),
  keepPlan: () => set({ coachChoice: 'keep' }),

  toggleCoachPref: (i) => set((s) => ({ coachToggles: toggleRecord(s.coachToggles, i) })),
  cycleDataMode: (i) => set((s) => ({ dataModes: { ...s.dataModes, [i]: ((s.dataModes[i] ?? 0) + 1) % 3 } })),

  toggleOpenPlanDay: (i) => set((s) => ({ openPlanDay: s.openPlanDay === i ? -1 : i })),
  toggleOpenPhase: (i) => set((s) => ({ openPhase: s.openPhase === i ? -1 : i })),

  setBodyMetric: (i) => set({ bodyMetric: i }),
  toggleWeighWhy: () => set((s) => ({ weighWhyOpen: !s.weighWhyOpen })),

  setPwTier: (i) => set({ pwTier: i }),
  setPwAnnual: (annual) => set({ pwAnnual: annual }),

  setNudgeBudget: (v) => set({ nudgeBudget: Math.max(1, Math.min(10, v)) }),
  toggleNudgeType: (i) => set((s) => ({ nudgeTypes: toggleRecord(s.nudgeTypes, i) })),

  toggleRaceCheck: (i) => set((s) => ({ raceChecks: toggleRecord(s.raceChecks, i) })),
  toggleOpenLearning: (i) => set((s) => ({ openLearning: s.openLearning === i ? -1 : i })),

  toggleRespect: (i) => set((s) => ({ respects: toggleRecord(s.respects, i) })),
  setRsvp: (v) => set({ rsvp: v }),

  setNigZone: (i) => set({ nigZone: i }),
  setNigSev: (i) => set({ nigSev: i }),
  setPainToday: (n) => set({ painToday: n }),
  toggleOpenFactor: (i) => set((s) => ({ openFactor: s.openFactor === i ? null : i })),

  wAdvanceRep: () => set((s) => ({ wRep: s.wRep >= 5 ? 0 : s.wRep + 1 })),
  setWFuel: (v) => set({ wFuel: v }),
  setWRpe: (n) => set({ wRpe: n }),

  setToast: (i) => set({ toast: i }),
}));
