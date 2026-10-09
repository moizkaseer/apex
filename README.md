# APEX — Unified Fitness Dashboard

React Native / Expo implementation of the **"1a Editorial"** direction from the Claude Design handoff
(`../project/Fitness Dashboard Options.dc.html`, transcripts in `../chats/`). One hub for Apple Health,
Strava and the gym: readiness-first dashboard, AI coach, photo-logged meals, progress-photo check-ins,
adaptive training plan.

## Run it

```bash
npm install
npx expo start          # scan the QR with Expo Go (UI + mock data works everywhere)
```

Native integrations (HealthKit, notifications, RevenueCat) need a **dev client / EAS build** —
they are stubbed out gracefully in Expo Go:

```bash
npx expo run:ios        # or: eas build --profile development --platform ios
```

Verification without a device: `npm run typecheck` and `npx expo export --platform ios`.

## Configuration (real integrations)

Every integration is real, production-shaped code behind env vars. Without keys the app falls back to
the design's demo data, so it always runs. Set these in `.env` / EAS secrets:

| Variable | Enables |
| --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | Your backend proxying the Claude API — AI coach chat (`/api/claude/chat`), meal-photo + progress-photo vision analysis (`/api/claude/vision`). Keep the Anthropic API key server-side, never in the app. |
| `EXPO_PUBLIC_STRAVA_CLIENT_ID`, `EXPO_PUBLIC_STRAVA_CLIENT_SECRET` | Strava OAuth (expo-auth-session) + activity import. |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `_ANDROID_KEY` | Paywall checkout via RevenueCat (`athlete` / `pro` products). |
| — | HealthKit (`@kingstinct/react-native-healthkit`) and notifications (`expo-notifications`) need no keys, only a native build + iOS entitlements. |

Service layer lives in `src/services/` (healthkit, strava, claude, purchases, notifications, readiness).

## Architecture

```
src/
  app/            expo-router file-based routes (all 17 design turns)
    (tabs)/       Today · Train · Fuel · Body · Coach
    onboarding/   welcome → goal → connections → plan-ready
    workout/      live run intervals, strength logger, session complete
    meal/         camera → AI analysis → logged
    progress-photo/ guided capture → AI comparison → 12-week report
    coach-chat/   plan-change proposal + "why" source panel
    training-plan/ week view + 12-week block arc
    body-trends/  metric trends + weigh-in moment (modal)
    sleep/        sleep detail + readiness breakdown
    injury/       report a niggle + return-to-run protocol
    race-day/     race morning + post-race debrief
    social/       crew board/feed + shared session RSVP
    notifications/ lock-screen preview + nudge budget settings
    paywall/      tiers + locked-feature moment
    watch-preview/ Apple Watch companion faces (turn 17)
  components/ui/  design system: Text (serif/mono/sans), Card, Button, Pill,
                  ProgressRing, Charts, ExpandableRow, SegmentedTabs, …
  theme/tokens.ts every color/spacing/radius/font from the design — no stray hex in screens
  store/          zustand store mirroring the prototype's state{} field-for-field
  data/mock.ts    demo content extracted from the design's renderVals()
```

Conventions: screens compose `components/ui` primitives and style exclusively from `theme/tokens.ts`;
interactive state names match the design source (`openDay`, `wRep`, `pwTier`, …) so design → code
stays traceable.
