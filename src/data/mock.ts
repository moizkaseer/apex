/**
 * Static/demo content extracted from the design's renderVals() *Defs arrays.
 * Screens combine this with live store state (data/useAppStore) and, where a
 * real integration is configured, with services/* data instead. Keeping this
 * separate from component code mirrors the source design's separation of
 * content from per-render view-model computation.
 */

// ── turn 2 · train tab ──
export const trainDays = [
  { day: 'Mon', title: 'Easy run + core', sub: '8 km Z2 · 20 min core', status: 'done' as const,
    rows: [{ k: 'Run', v: '8.1 km · 5:32/km' }, { k: 'Avg HR', v: '132 bpm' }, { k: 'Core circuit', v: '3 rounds' }], cta: 'View in Strava' },
  { day: 'Tue', title: 'Threshold intervals', sub: '5 × 1200m · 10K pace', status: 'today' as const,
    rows: [{ k: 'Warm-up', v: '15 min Z2' }, { k: 'Main set', v: '5 × 1200m @ 4:10/km' }, { k: 'Recovery', v: '90s jog' }, { k: 'Cool-down', v: '10 min easy' }], cta: 'Start on Apple Watch' },
  { day: 'Wed', title: 'Lower body strength', sub: 'Squat 5×5 @ 122 kg · accessories', status: 'planned' as const,
    rows: [{ k: 'Back squat', v: '5×5 @ 122 kg' }, { k: 'RDL', v: '3×8 @ 90 kg' }, { k: 'Split squat', v: '3×10/leg' }], cta: 'Preview session' },
  { day: 'Thu', title: 'Recovery spin', sub: '45 min Z1 · optional', status: 'planned' as const,
    rows: [{ k: 'Bike', v: '45 min · keep HR < 120' }, { k: 'Mobility', v: '15 min hips' }], cta: 'Preview session' },
  { day: 'Sat', title: 'Long run', sub: '24 km progressive · fueling practice', status: 'key' as const,
    rows: [{ k: 'Structure', v: '16 km Z2 → 8 km @ MP' }, { k: 'Fuel', v: '60 g carbs/hr' }, { k: 'Why it matters', v: 'race simulation' }], cta: 'Preview session' },
];

// ── turn 2 · fuel tab ──
export const meals = [
  { slot: 'photo', title: 'Breakfast', sub: '6:55 · photo-logged · AI 94%', kcal: '612', tag: 'AI', good: true,
    rows: [{ k: 'Detected', v: 'oats, eggs, berries' }, { k: 'Macros', v: '42P / 68C / 18F' }, { k: 'Confidence', v: '94% · tap to correct' }] },
  { slot: 'photo', title: 'Post-run shake', sub: '7:40 · photo-logged · AI 98%', kcal: '340', tag: 'AI', good: true,
    rows: [{ k: 'Detected', v: 'whey, banana, milk' }, { k: 'Macros', v: '38P / 41C / 6F' }] },
  { slot: 'next', title: 'Lunch', sub: 'target 850 kcal · high protein', kcal: '—', tag: 'NEXT', good: false,
    rows: [{ k: 'Suggestion', v: 'chicken + rice bowl' }, { k: 'Why', v: 'closes 48 g protein gap' }, { k: 'Alternative', v: 'salmon poke' }] },
  { slot: 'plan', title: 'Dinner', sub: 'target 780 kcal · pre-strength day', kcal: '—', tag: 'PLAN', good: false,
    rows: [{ k: 'Suggestion', v: 'pasta + lean beef' }, { k: 'Carb load', v: 'Wed is squat day' }] },
];
export const fuelMacros = [
  { name: 'Protein', val: '132 / 190g', pct: 69 },
  { name: 'Carbs', val: '204 / 340g', pct: 60 },
  { name: 'Fat', val: '48 / 85g', pct: 56 },
];

// ── turn 2 · body tab ──
export const bodyRangeData: Record<number, { delta: string; bars: number[] }> = {
  0: { delta: '−0.6 kg · 4 wks', bars: [44, 42, 40, 38] },
  1: { delta: '−1.8 kg · 8 wks', bars: [58, 56, 57, 52, 49, 47, 44, 40] },
  2: { delta: '−4.1 kg · 6 mo', bars: [72, 70, 66, 68, 62, 58, 52, 47, 44, 42, 41, 40] },
};
export const bodyMeasurements = [
  { name: 'Waist', val: '81.2', delta: '−1.4', good: true },
  { name: 'Chest', val: '104.0', delta: '+0.6', good: true },
  { name: 'Thigh', val: '61.8', delta: '+0.4', good: true },
  { name: 'Arm', val: '38.1', delta: '0.0', good: null },
];
export const photoRows = [
  { k: 'Est. body fat', v: '14.2% (−0.8)' },
  { k: 'Est. lean mass', v: '+0.4 kg' },
  { k: 'Waist (visual)', v: '−1.1 cm' },
  { k: 'Posture note', v: 'right shoulder higher' },
];

// ── turn 2 · coach tab ──
export const chatFull = [
  { who: 'coach', text: 'Solid run this morning — 12.4 km at 4:52/km, imported from Strava. Load is at 93% of your safe ceiling, so I’d protect tomorrow’s squat session.' },
  { who: 'me', text: 'Should I still do intervals today?' },
  { who: 'coach', text: 'Yes, but capped: HRV is down 8%, so run the 5 × 1200m at the slow end (4:14/km) and cut rep 5 if pace drifts more than 4 seconds. Quality over ego today.' },
  { who: 'me', text: 'What should lunch look like?' },
  { who: 'coach', text: 'You’re 48 g short on protein for the day. Chicken + rice bowl (~850 kcal) fits your remaining budget and fuels Wednesday’s squats. Snap a photo and I’ll log it.' },
] as const;
export const suggestionSets = [
  ['What should lunch look like?', 'Move intervals to Thursday', 'How’s my ramp rate?'],
  ['Log lunch for me', 'Plan Saturday’s fueling'],
];

// ── turn 3 · onboarding ──
export const welcomePoints = [
  'One dashboard for training, food and body',
  'AI coach that reads every source you connect',
  'Weekly photo check-ins verify real progress',
];
export const goalDefs = [
  { name: 'Race performance', sub: 'Running, cycling, triathlon — periodized to a date',
    note: 'I’ll periodize around your race date and treat lifting as support work.' },
  { name: 'Build muscle, stay athletic', sub: 'Hypertrophy blocks with engine maintenance',
    note: 'Strength leads. I’ll cap cardio so it never eats your recovery.' },
  { name: 'Hybrid — strong and fast', sub: 'CrossFit-style balance of lifting and conditioning',
    note: 'Expect careful sequencing — hard runs never land the day before heavy squats.' },
  { name: 'Body recomposition', sub: 'Drop fat, hold lean mass, photo check-ins weekly',
    note: 'Slow cut: ≈0.25 kg/wk, protein high, weekly AI photo check-ins to verify.' },
];
export const serviceDefs = [
  { key: 'appleHealth', initials: 'AH', name: 'Apple Health', sub: 'Workouts, sleep, HRV, weight' },
  { key: 'strava', initials: 'ST', name: 'Strava', sub: 'Runs, rides, routes, segments' },
  { key: 'garmin', initials: 'GA', name: 'Garmin', sub: 'Watch metrics, training status' },
  { key: 'whoop', initials: 'WH', name: 'Whoop', sub: 'Recovery, strain, sleep debt' },
  { key: 'myfitnesspal', initials: 'MF', name: 'MyFitnessPal', sub: 'Food history — imports 2 yrs of logs' },
  { key: 'oura', initials: 'OU', name: 'Oura', sub: 'Sleep staging, readiness' },
];
export const planBars = [
  { day: 'M', h: 28, tone: 'accent' as const }, { day: 'T', h: 52, tone: 'light' as const },
  { day: 'W', h: 44, tone: 'muted' as const }, { day: 'T', h: 18, tone: 'accent' as const },
  { day: 'F', h: 0.5, tone: 'faint' as const }, { day: 'S', h: 64, tone: 'light' as const },
  { day: 'S', h: 22, tone: 'accent' as const },
];

// ── turn 4 · workout live ──
export const runRepPaces = ['4:08', '4:11', '4:09', '4:12', '4:10'];
export const runElapsedByRep = ['22:41', '28:56', '35:12', '41:30', '47:48', '52:06'];
export const runDistByRep = ['4.6', '5.8', '7.0', '8.2', '9.4', '10.6'];
export const strengthSetLabel = '122 kg × 5';
export const strengthRpeByeSet = [7, 7.5, 8, 8.5, 9];
export const splitTimes = [
  { n: 1, time: '4:08', pct: 96, fast: true },
  { n: 2, time: '4:11', pct: 90, fast: false },
  { n: 3, time: '4:09', pct: 94, fast: true },
  { n: 4, time: '4:12', pct: 88, fast: false },
  { n: 5, time: '4:07', pct: 98, fast: true },
];

// ── turn 5 · meal capture ──
export const mealItemDefs = [
  { name: 'Grilled chicken', baseG: 180, baseKcal: 297, baseP: 56, note: 'lean' },
  { name: 'Jasmine rice', baseG: 200, baseKcal: 260, baseP: 5, note: 'mostly carbs' },
  { name: 'Avocado + dressing', baseG: 70, baseKcal: 175, baseP: 2, note: 'healthy fats' },
];
export const portionSizeMult = [0.7, 1, 1.35];
export const portionSizeLabels = ['S', 'M', 'L'];

// ── turn 6 · progress photo ──
export const poseNames = ['FRONT', 'SIDE', 'BACK'];
export const poseData = [
  { label: 'front pose', verdict: 'Leaner through the waist. Shoulders holding their line.',
    deltas: [
      { k: 'Waist (visual)', v: '−1.1 CM', good: true },
      { k: 'Shoulder width', v: 'HELD', good: null },
      { k: 'Est. body fat', v: '−0.8 PT', good: true },
      { k: 'Symmetry', v: 'R SHOULDER +1°', good: null },
    ] },
  { label: 'side pose', verdict: 'Flatter midsection; posture is more stacked than week 24.',
    deltas: [
      { k: 'Abdomen profile', v: '−1.4 CM', good: true },
      { k: 'Posture (ear-hip)', v: 'IMPROVED', good: true },
      { k: 'Glute fullness', v: 'HELD', good: null },
    ] },
  { label: 'back pose', verdict: 'Upper back detail is coming through — lats and rear delts up.',
    deltas: [
      { k: 'Back width', v: '+0.6 CM', good: true },
      { k: 'Rear delt detail', v: 'UP', good: true },
      { k: 'Lower back fold', v: '−0.9 CM', good: true },
    ] },
];
export const filmstripLabels = ['W16', 'W18', 'W20', 'W22', 'W24', 'W28'];
export const bodyFatHeights = [58, 56, 55, 52, 50, 48, 45, 44, 42, 40, 38, 36];
export const milestoneDefs = [
  { title: 'First visible ab line', week: 'WK 25',
    detail: 'AI flagged upper-ab definition in the week 25 front pose — the first structural change of the cut.' },
  { title: 'Waist under 82 cm', week: 'WK 26',
    detail: 'Visual waist estimate crossed 82 cm while squat top sets kept climbing. Recomposition, not just loss.' },
  { title: 'Lean mass verified', week: 'WK 28',
    detail: 'Photos + scale agree: −4.1 kg total with lean mass flat. 96% of loss estimated as fat.' },
];

// ── turn 7 · coach chat detail ──
export const whyDefs = [
  { initials: 'ST', title: 'Strava history', sub: 'Last 6 Sunday long runs', weightLabel: 'WEIGHT HIGH',
    detail: 'You’ve run 6 of your last 8 long runs on Sunday mornings — average pace and completion are better than Saturday attempts.',
    heights: [22, 26, 20, 30, 28, 34, 32], barCaption: 'SUNDAY LONG-RUN COMPLETION · LAST 7 WEEKS', accent: '#2f6f4f' },
  { initials: 'HR', title: 'HRV trend', sub: 'Apple Health · 7-day', weightLabel: 'WEIGHT MED',
    detail: 'HRV is stable at 64 ms. You can absorb a long run on Sunday with one fewer recovery day — but Monday must go easy.',
    heights: [24, 22, 26, 25, 28, 27, 30], barCaption: 'HRV MS · TRENDING UP', accent: '#3a5fa8' },
  { initials: 'RC', title: 'Race calendar', sub: 'City Half · 8 weeks out', weightLabel: 'WEIGHT HIGH',
    detail: '8 weeks out, the long-run progression is the single most protected element of your plan. Skipping costs more than shifting.',
    heights: [16, 20, 24, 28, 30, 34, 36], barCaption: 'LONG-RUN KM PROGRESSION TO RACE', accent: '#2f6f4f' },
  { initials: 'CA', title: 'Your calendar', sub: 'Saturday · all-day event', weightLabel: 'WEIGHT LOW',
    detail: 'Wedding blocks Saturday 11:00–23:00. A pre-dawn 24 km before a wedding historically ends in poor sleep + skipped runs.',
    heights: [30, 30, 30, 8, 30, 30, 30], barCaption: 'AVAILABLE TRAINING HOURS · THIS WEEK', accent: '#d4763f' },
];

// ── turn 8 · settings & integrations ──
export const connectionDefs = [
  { key: 'appleHealth', initials: 'AH', name: 'Apple Health', status: 'Sleep, HRV, weight · synced 6:41', ok: true },
  { key: 'strava', initials: 'SV', name: 'Strava', status: 'Runs & rides · synced 6:41', ok: true },
  { key: 'appleWatch', initials: 'AW', name: 'Apple Watch', status: 'Workouts, live HR · paired', ok: true },
  { key: 'scale', initials: 'WS', name: 'Smart scale', status: 'Reauthorize — token expired', ok: false },
];
export const coachPrefDefs = [
  { name: 'Auto-adjust my plan', sub: 'Coach reshapes the week when recovery or life gets in the way' },
  { name: 'Fueling reminders', sub: 'Pre-workout carb and post-workout protein nudges' },
  { name: 'Hard-truth mode', sub: 'Blunt feedback when training and food don’t match the goal' },
];
export const dataTypeDefs = [
  { name: 'Activities', sub: 'Runs, rides, workouts' },
  { name: 'Heart rate', sub: 'In-activity HR streams' },
  { name: 'Body weight', sub: 'Push weight to Strava profile' },
  { name: 'Nutrition', sub: 'Meals & calories' },
];
export const dataModeLabels = ['OFF', 'READ', 'READ + WRITE'];

// ── turn 9 · weekly plan ──
export const weekShapeDefs = [
  { day: 'MON', h: 18, done: true }, { day: 'TUE', h: 52, done: true }, { day: 'WED', h: 30, today: true },
  { day: 'THU', h: 58 }, { day: 'FRI', h: 14 }, { day: 'SAT', h: 40 }, { day: 'SUN', h: 68 },
];
export const planDayDefs = [
  { day: 'MON', title: 'Rest', sub: 'Full recovery · mobility 15 min', state: 'done' as const,
    blocks: [{ k: 'Hip mobility flow', v: '15 MIN' }], cta: 'View log' },
  { day: 'TUE', title: 'Threshold intervals', sub: '5 × 1200m · 68 min · TSS 82', state: 'done' as const,
    blocks: [{ k: 'Warm-up', v: '15 MIN · Z2' }, { k: '5 × 1200m @ 4:10', v: 'HIT 4:08 AVG' }, { k: 'Cool-down', v: '10 MIN' }], cta: 'View log' },
  { day: 'WED', title: 'Lower body · strength', sub: 'Squat 5×5 @ 122 kg · 55 min', state: 'today' as const,
    blocks: [{ k: 'Back squat 5×5', v: '122 KG TOP' }, { k: 'RDL 3×8', v: '90 KG' }, { k: 'Split squat 3×10', v: '2×24 KG' }], cta: 'Start session' },
  { day: 'THU', title: 'Tempo run', sub: '40 min @ 4:35/km · TSS 74', state: 'future' as const,
    blocks: [{ k: 'Tempo block', v: '2 × 20 MIN' }, { k: 'Fueling', v: '60G CARB PRE' }], cta: 'Preview' },
  { day: 'FRI', title: 'Recovery spin', sub: '30 min Z1 · optional', state: 'future' as const,
    blocks: [{ k: 'Easy spin', v: '30 MIN · Z1' }], cta: 'Preview' },
  { day: 'SAT', title: 'Upper body · strength', sub: 'Press focus · 45 min', state: 'future' as const,
    blocks: [{ k: 'Bench 4×6', v: '92 KG' }, { k: 'Weighted pull-up 4×6', v: '+20 KG' }], cta: 'Preview' },
  { day: 'SUN', title: 'Long run', sub: '24 km progressive · TSS 96', state: 'key' as const,
    blocks: [{ k: '14 km steady', v: '5:10/KM' }, { k: '8 km progressive', v: '4:50 → 4:25' }, { k: '2 km float', v: 'EASY' }], cta: 'Preview' },
];
export const trainingLoadArc = [26, 32, 38, 30, 44, 50, 56, 42, 62, 68, 40, 24];
export const phaseDefs = [
  { name: 'Base', weeks: 'WK 22–25 · DONE',
    detail: 'Aerobic volume and strength foundation. Long runs to 18 km, squat rebuilt to 120 kg. Goal: arrive at build undamaged.' },
  { name: 'Build', weeks: 'WK 26–29 · NOW',
    detail: 'Threshold and tempo work layered on the base. Load climbs 6% per week with a recovery week at 29. This is where fitness is made.' },
  { name: 'Peak', weeks: 'WK 30–31',
    detail: 'Race-pace specificity: two key sessions per week at goal pace, long run peaks at 26 km. Strength shifts to maintenance.' },
  { name: 'Taper & race', weeks: 'WK 32–33',
    detail: 'Volume drops 40%, intensity stays. Carb load Thursday–Saturday. Race day: 4:25/km target — the plan says it’s there.' },
];

// ── turn 10 · body & weight trends ──
export const bodyTrendRangeNames = ['4W', '12W', '6M'];
export const bodyMetricDefs = [
  { name: 'Weight', source: 'Smart scale · daily', val: '78.4 kg', delta: '−4.1 KG', good: true,
    headline: '78.4', hDelta: '−4.1 KG THIS BLOCK', hNote: 'Trend line, not this morning’s number. Daily noise runs ±0.8 kg.',
    chartLabel: 'Weight · kg', curve: [88, 86, 85, 83, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60] },
  { name: 'Est. body fat', source: 'AI photo check-ins · weekly', val: '14.2%', delta: '−2.6 PT', good: true,
    headline: '14.2%', hDelta: '−2.6 PT THIS BLOCK', hNote: 'Estimated from weekly photos cross-checked against scale data.',
    chartLabel: 'Body fat · %', curve: [84, 83, 82, 80, 78, 76, 74, 71, 68, 65, 61, 58, 54, 50, 46, 43] },
  { name: 'Lean mass', source: 'Derived · scale + photos', val: '66.9 kg', delta: 'HELD ±0.3', good: null,
    headline: '66.9', hDelta: 'HELD ±0.3 KG', hNote: 'The number this whole cut is designed to protect. Flat is a win.',
    chartLabel: 'Lean mass · kg', curve: [70, 71, 70, 72, 71, 70, 71, 72, 71, 70, 71, 71, 72, 71, 71, 72] },
  { name: 'Waist (visual)', source: 'AI photo check-ins', val: '81.2 cm', delta: '−3.8 CM', good: true,
    headline: '81.2', hDelta: '−3.8 CM THIS BLOCK', hNote: 'Measured visually from front-pose photos at matched distance.',
    chartLabel: 'Waist · cm', curve: [90, 89, 88, 86, 85, 83, 81, 79, 76, 73, 70, 67, 64, 61, 58, 55] },
];
export const weighWhyRows = [
  { k: 'Glycogen + water', v: '+0.5–0.9 KG EXPECTED' },
  { k: 'Sodium (refuel meal)', v: 'ELEVATED' },
  { k: 'Fat change possible in 1 day', v: '±0.1 KG MAX' },
];
export const morningWeighHeights = [46, 45, 44, 45, 43, 42, 43, 41, 40, 41, 39, 38, 37, 44];

// ── turn 11 · paywall ──
export const pwHooks = [
  { text: 'You lose 40+ min of quality sleep after evening sessions', tag: 'APPLE HEALTH' },
  { text: 'Your long-run pace decays 4% when protein is under target', tag: 'STRAVA + MEALS' },
  { text: '3 of your last 4 weeks ended under planned load', tag: 'PLAN VS ACTUAL' },
];
export const tierDefs = [
  { name: 'Athlete', sub: 'Everything you log, organized', priceA: '€4.99', priceM: '€6.99', flagged: false,
    features: ['All integrations · unlimited sources', 'Full training + meal history', 'Weekly plan (static)', 'Trend charts'] },
  { name: 'Pro', sub: 'The AI coach works for you', priceA: '€9.99', priceM: '€14.99', flagged: true,
    features: ['AI photo body analysis', 'Adaptive plan — reshapes your week', 'Coach chat with your data', 'Meal photo logging + macro targets', 'Conflict-free multi-source merging'] },
];

// ── turn 12 · notifications & nudges ──
export const nudgeTypeDefs = [
  { name: 'Fueling windows', example: '"60 g carbs in the next 40 min — long run at 6:00."' },
  { name: 'Recovery alerts', example: '"HRV down 8% — today’s plan just got easier."' },
  { name: 'Session reminders', example: '"Squats at 17:30. Bar’s loaded: 122 kg top set."' },
  { name: 'Streaks & milestones', example: '"12 weeks of consistent Sundays."' },
  { name: 'Sleep protection', example: '"Hard double tomorrow — in bed by 22:00."' },
];
export const lockScreenNudges = [
  { title: 'APEX · Fueling', time: '16:50', body: 'Squats in 40 min. You’re 48 g short on carbs for a quality session — banana + rice cake covers it.', hasActions: true, action1: 'Logged it', action2: 'Skip' },
  { title: 'APEX · Session', time: '17:25', body: 'Lower body in 5. Last week’s top set was 120 kg — today calls for 122.', hasActions: false },
  { title: 'APEX · Recovery', time: '19:12', body: 'Solid session — 4 of 5 sets at RPE 8. Protein window open for another 90 min: 42 g to target.', hasActions: true, action1: 'Snap dinner', action2: 'Later' },
  { title: 'APEX · Plan', time: '20:30', body: 'Strava import: tomorrow’s tempo adjusted −10% — today’s squat volume was above plan.', hasActions: false },
  { title: 'APEX · Sleep', time: '21:30', body: 'Hard double tomorrow. In bed by 22:00 protects the 6:00 run — 30 min to wind down.', hasActions: true, action1: 'Set alarm', action2: 'Dismiss' },
];

// ── turn 13 · race day ──
export const raceCheckDefs = [
  { name: 'Wake + hydrate', sub: '500 ml water, electrolytes', time: '5:30' },
  { name: 'Breakfast', sub: '110 g carbs · oats, banana, honey — 3h out', time: '6:00' },
  { name: 'Leave for start', sub: '25 min walk — doubles as activation', time: '7:35' },
  { name: 'Gel + sip', sub: '25 g carbs, 20 min before gun', time: '8:40' },
  { name: 'Strides + line up', sub: '4 × 20 s build-ups, corral B', time: '8:45' },
];
export const raceSplits = [
  { seg: '0–5K', pace: '4:31', pct: 78, fast: false },
  { seg: '5–10K', pace: '4:27', pct: 84, fast: false },
  { seg: '10–15K', pace: '4:24', pct: 89, fast: true },
  { seg: '15–21K', pace: '4:19', pct: 97, fast: true },
];
export const raceLearningDefs = [
  { title: 'Your threshold is higher than we trained',
    detail: 'You held 172 bpm for the final 6 km without fade. Next block trains threshold at 4:15/km, not 4:25 — a full tier up.' },
  { title: 'Fueling plan executed perfectly',
    detail: 'Both gels on schedule, no GI issues, no bonk signature in the HR data. Same protocol locks in for the next race.' },
  { title: 'Taper length was right',
    detail: '10 days of reduced volume produced a 92 readiness on race morning — your best of the year. 10 days becomes your default taper.' },
];

// ── turn 14 · social & crew ──
export const crewPalette = [
  { bg: '#1c1c1a', fg: '#faf9f6' }, { bg: '#2f6f4f', fg: '#faf9f6' },
  { bg: '#d4763f', fg: '#faf9f6' }, { bg: '#e4e1d8', fg: '#6d6b63' },
];
export const crewBoardDefs = [
  { initials: 'MK', name: 'Mika', pct: 96, p: 1 },
  { initials: 'AM', name: 'You', pct: 92, p: 0, you: true },
  { initials: 'JD', name: 'Jonas', pct: 84, p: 2 },
  { initials: 'SR', name: 'Sara', pct: 71, p: 3 },
];
export const crewFeedDefs = [
  { initials: 'MK', name: 'Mika', p: 1, action: 'hit a 20-min FTP test', detail: 'VIA STRAVA · 302 W · +9 W', time: '2H AGO', baseRespects: 4,
    note: '"Everything above 290 hurt. Worth it."' },
  { initials: 'JD', name: 'Jonas', p: 2, action: 'finished week 3 of his cut', detail: 'BODY · −0.6 KG · LEAN MASS HELD', time: '5H AGO', baseRespects: 3,
    note: 'Photo check-in confirmed: strength flat, waist down. Textbook week.' },
  { initials: 'SR', name: 'Sara', p: 3, action: 'came back from injury', detail: 'FIRST RUN IN 6 WEEKS · 5 KM EASY', time: '7H AGO', baseRespects: 5,
    note: '"Slowest 5K of my life and the happiest I’ve been all month."' },
];
export const sharedSessionRoster = [
  { initials: 'MK', name: 'Mika', p: 1, pace: '2:48', status: 'IN' as const },
  { initials: 'AM', name: 'You', p: 0, pace: '2:56', status: null },
  { initials: 'JD', name: 'Jonas', p: 2, pace: '3:04', status: 'IN' as const },
  { initials: 'SR', name: 'Sara', p: 3, pace: '3:40 · 4 REPS', status: 'MAYBE' as const },
];

// ── turn 15 · injury & recovery ──
export const injuryZoneNames = ['Foot', 'Achilles', 'Shin', 'Knee', 'Calf', 'Hamstring', 'Hip', 'Low back', 'Shoulder'];
export const severityDefs = [
  { name: 'Aware', sub: 'noticeable, no limp' },
  { name: 'Nagging', sub: 'changes my stride' },
  { name: 'Sharp', sub: 'made me stop' },
];
export const nigLevelDefs = (zoneName: string) => [
  { badge: 'MONITOR', tone: 'good' as const,
    verdict: 'Train on — with two guardrails.',
    changes: [
      { k: 'Tomorrow’s tempo', v: 'KEPT · FLAT ROUTE', tone: 'good' as const },
      { k: 'Sunday long run', v: 'KEPT · WATCH FLAG ON', tone: 'good' as const },
      { k: 'Calf raises 3×15', v: 'ADDED DAILY', tone: 'neutral' as const },
    ],
    note: `An aware-level ${zoneName} with your load history is usually tissue adapting. Flag it again if it’s still there in 3 days.` },
  { badge: 'ADJUSTED', tone: 'warn' as const,
    verdict: 'Intensity comes down before it gets worse.',
    changes: [
      { k: 'Tomorrow’s tempo', v: '→ EASY 40 MIN', tone: 'warn' as const },
      { k: 'Sunday long run', v: '−30% · FLAT', tone: 'warn' as const },
      { k: 'Strength lower body', v: 'PAUSED 4 DAYS', tone: 'neutral' as const },
    ],
    note: `A nagging ${zoneName} that changes stride is the last cheap warning you get. Four easy days now beats four weeks off later.` },
  { badge: 'PROTECT', tone: 'danger' as const,
    verdict: 'Running stops today. Recovery plan starts now.',
    changes: [
      { k: 'All running', v: 'PAUSED', tone: 'danger' as const },
      { k: 'Cross-training (bike/swim)', v: 'FROM THURSDAY', tone: 'neutral' as const },
      { k: 'Return-to-run protocol', v: 'STAGED · 5 GATES', tone: 'good' as const },
    ],
    note: 'Sharp pain that stops a run is a hard line. The race plan reshapes around recovery — 8 weeks is still enough if we start now.' },
];
export const returnToRunStages = [
  { name: 'Pain-free walking', sub: '45 min brisk, two days running', tag: 'CLEARED', state: 'done' as const },
  { name: 'Jog-walk intervals', sub: '8 × (2 min jog / 1 min walk)', tag: 'CLEARED', state: 'done' as const },
  { name: 'Continuous easy running', sub: '20 → 40 min over 4 sessions, flat only', tag: 'DAY 2 OF 4', state: 'now' as const },
  { name: 'Tempo reintroduction', sub: 'Strides first, then 2 × 10 min tempo', tag: 'LOCKED', state: 'locked' as const },
  { name: 'Full training', sub: 'Back on plan · achilles flag stays 2 wks', tag: 'LOCKED', state: 'locked' as const },
];

// ── turn 16 · sleep & recovery ──
// stage codes: 1 = light/core, 2 = REM, 3 = deep
export const sleepStageSeq = [2, 3, 3, 2, 1, 1, 2, 3, 2, 1, 3, 3, 2, 1, 1, 2, 2, 3, 2, 1, 2, 1, 1, 2];
export const sleepNightMetrics = [
  { name: 'HRV', val: '64 ms', delta: '+6 VS BASELINE', good: true },
  { name: 'RHR', val: '47 bpm', delta: '−1 VS BASELINE', good: true },
  { name: 'RESP', val: '13.8 /m', delta: 'STABLE', good: null },
];
export const recoveryFactorDefs = [
  { name: 'HRV rebound', reading: '64 MS · +6 VS 30-DAY BASELINE', pts: '+34', pct: 92, good: true,
    detail: 'Your highest-weighted factor. Overnight HRV recovered past baseline within one night of a hard interval session — the clearest green light your body gives.' },
  { name: 'Sleep', reading: '7H 42M · QUALITY 86', pts: '+28', pct: 84, good: true,
    detail: '1h 38m of deep sleep, right in your muscle-repair window after strength-adjacent load. 18 minutes short of target — the only thing keeping this from full marks.' },
  { name: 'Training load balance', reading: 'RAMP +6% · BELOW CEILING', pts: '+16', pct: 70, good: true,
    detail: 'Acute load is rising but still under your safe ceiling of 660. The model holds a few points back because yesterday was your third quality day in five.' },
  { name: 'Muscle stress', reading: 'YESTERDAY RPE 8 · LEGS', pts: '+4', pct: 38, good: false,
    detail: 'Intervals left residual leg fatigue — expected and planned. This is why today is quality-not-volume, and why tonight’s sleep target is 8h 15m.' },
];

// ── turn 17 · watch companion ──
export const watchRepPaces = ['4:06', '4:07', '4:08', '4:09', '4:12'];
