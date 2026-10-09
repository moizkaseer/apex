# Implementation brief for screen agents

You're implementing one slice of a React Native (Expo Router, TypeScript) fitness app called
APEX, cloned pixel-for-pixel from a Claude Design HTML prototype. The prototype is at
`../project/Fitness Dashboard Options.dc.html` (relative to this `mobile/` dir) — **read your
assigned line ranges from it directly**; don't rely on a paraphrase. It's an `<x-dc>` template
format: `{{ expr }}` is a bound value, `<sc-if value="{{ cond }}">` is a conditional block,
`<sc-for list="{{ arr }}" as="x">` is a loop. Each screen is wrapped in
`<x-import component-from-global-scope="IOSDevice" ...>` — that's just the design tool's phone
bezel for preview; ignore it, your screen IS the full-screen content inside it. The JS driving
all interactivity/computed values lives in the `<script type="text/x-dc" data-dc-script>` block
near the end of the same file (search for `// ── turn N ·` comments to find your section).

## What already exists — use it, don't rebuild it

- `src/theme/tokens.ts` — colors, spacing, radii, font families. Every color in your screen
  should come from here (or `onDark(alpha)` for `rgba(250,249,246,a)` overlays). If you need a
  color the palette doesn't have, add it to tokens.ts rather than inlining a hex.
- `src/components/ui/*` (barrel: `@/components/ui`) — `SerifText`, `MonoText`, `SansText`,
  `Card`, `Pill`, `ProgressRing`, `BarChart`, `Sparkline`, `RangeBar`, `ConnectorLine`,
  `ToggleSwitch`, `Button`, `Avatar`, `ScreenContainer`, `SegmentedTabs`, `ExpandableRow`,
  `Toast`, `KeyValueRow`. Read `src/components/ui/*.tsx` before writing a screen — most of what
  you need to compose is already there. Extend a component (add a prop) rather than
  reimplementing its layout elsewhere.
- `src/store/useAppStore.ts` — global zustand store, one hook: `useAppStore(s => s.someField)`
  and `useAppStore(s => s.someAction)`. It already has every field/action your screen's
  interactive state needs (mirrors the design's `state{}`/actions 1:1 — check there first).
  Don't add local `useState` for anything that's already a store field.
- `src/data/mock.ts` — the static content arrays (goals, meals, chat transcript, etc.), typed
  and organized by turn. Import what you need; don't re-transcribe content that's already there.
- `src/services/*` — real integration clients: `healthkit`, `strava`, `claude`, `purchases`,
  `notifications`, plus `computeReadiness`/`readinessWord`. Screens that show live data the
  design sources from Apple Health/Strava/AI should call these (they degrade gracefully to
  `null`/`[]` when unconfigured — pair with mock.ts as a fallback for display, don't block
  the UI on a live connection).
- `src/app/*` — Expo Router file-based routes. Your target files already exist as stub
  screens (`StubScreen` placeholder) — replace the stub file's content entirely. Use
  `import { router } from 'expo-router'` and `router.push('/some/route')` to navigate; use
  `useLocalSearchParams()` for dynamic segments like `settings/integration/[id].tsx`.

## Ground rules

1. **Pixel fidelity first.** Match the source's layout, spacing, type scale, and color exactly
   — translate px values fairly literally into RN `StyleSheet`/inline style numbers (RN uses
   unitless dp, so `20px` → `20`). Font sizes, radii, gaps, padding should all trace back to a
   number you can find in the HTML.
2. **Every `{{ expr }}` and `onClick`/`onTap` in the source must become working interactivity**
   wired to the store — don't ship a static screenshot. If the source shows an `sc-if` toggling
   between two states, your screen must actually toggle.
3. **No inline hex colors, no ad-hoc font sizes duplicated across files** — pull from
   `theme/tokens.ts`. If a shared pattern would help another screen too, put it in
   `components/ui` instead of copy-pasting.
4. **TypeScript strict, no `any`** unless truly unavoidable (some third-party lib typing gaps
   are fine to cast). Run `npx tsc --noEmit` in `mobile/` before you finish and fix everything
   your files introduce.
5. **Real navigation, not dead ends.** Any button/row in the source that implies going
   somewhere else (e.g. "Start on Apple Watch" → workout live screen, a meal row → meal detail,
   a plan day → training plan) should `router.push` to the real route if it exists in
   `src/app/*`. If the target route belongs to a different agent's turn and doesn't exist yet,
   still wire the `router.push` call to the correct path (see the route map you were given) —
   it'll resolve once that agent lands.
6. **Don't touch files outside your assigned scope** (other screens, `store`, `theme`,
   `components/ui`, `services`, `data/mock.ts`) unless a change there is strictly required to
   support your screen — in that case, only *add* (a new store field/action, a new mock export,
   a new small ui component), never rewrite what's already there, since other agents are
   working in parallel.
7. Use `ScreenContainer` for standard scrollable screens; for full-bleed dark screens (workout
   live, race day) you can set `tone="dark"` or build the layout directly with
   `SafeAreaView`/`View` if `ScreenContainer`'s padding doesn't fit — match the source's exact
   background treatment.
8. Images/camera: use `expo-camera`'s `CameraView` and `expo-image-picker` for real photo
   capture where the design shows a camera/shutter screen. Convert to base64 and call the
   relevant `services/claude.ts` function for AI analysis, showing a loading state while it
   resolves, matching the design's "AI analyzing…" beat if present.
9. **No real photo assets exist.** Where the source shows an actual photo (progress-photo
   filmstrip, meal photo, avatar-with-photo), render a placeholder: a solid/muted `Card`
   background (use `colors.cardFlat` or `colors.ink` per the source's tone) with a centered
   small mono label or icon-ish glyph — don't try to load a missing image file. The repeating
   diagonal-stripe "you" placeholder in the source can just be a flat `colors.cardFlat` circle.
   For an actual camera viewfinder screen (meal/progress capture), use the real
   `expo-camera` `CameraView` — that one should genuinely show the device camera feed.
10. When you're done, report back which files you created/modified and confirm `tsc --noEmit`
    is clean.
