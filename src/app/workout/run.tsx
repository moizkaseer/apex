import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MonoText, SansText, SerifText } from '@/components/ui';
import { colors, onDark, radii, spacing } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { runDistByRep, runElapsedByRep, runRepPaces } from '@/data/mock';

/**
 * Turn 4a — run intervals live. Full-bleed dark workout screen.
 * Source: Fitness Dashboard Options.dc.html lines 1932-2004 (markup),
 * 3691-3700 + 4022-4038 (derived state).
 */
export default function RunIntervalsScreen() {
  const rep = useAppStore((s) => s.runRep); // completed reps 0..5
  const paused = useAppStore((s) => s.runPaused);
  const lapDone = useAppStore((s) => s.lapDone);
  const togglePause = useAppStore((s) => s.togglePause);

  const runDone = rep >= 5;

  const dots = [0, 1, 2, 3, 4].map((i) => ({
    key: i,
    color: i < rep ? colors.accent : i === rep && !runDone ? colors.textOnDark : colors.trackOnDark,
  }));

  const runPhaseLabel = runDone
    ? 'ALL REPS COMPLETE — COOL-DOWN 10 MIN EASY'
    : paused
      ? `PAUSED — REP ${rep + 1} OF 5`
      : `REP ${rep + 1} OF 5 — 1200M @ 10K PACE`;

  const runPace = runDone ? '5:40' : paused ? '—:—' : runRepPaces[rep];
  const paceVerdict = runDone ? 'SESSION COMPLETE' : paused ? 'ON HOLD' : rep % 2 === 1 ? '2S OFF — SETTLE IN' : 'ON TARGET';
  const paceVerdictColor = runDone ? colors.accent : paused ? colors.textOnDarkMuted : rep % 2 === 1 ? colors.warning : colors.accent;

  const runElapsed = runElapsedByRep[rep];
  const runDist = runDistByRep[rep];

  const runCoachNote = runDone
    ? 'That’s the session. Keep the cool-down honest — HR under 130 the whole way home.'
    : rep >= 3
      ? 'Last reps. Form over pace: tall hips, quick feet. Cut it if pace drifts past 4:14.'
      : 'Smooth so far. Keep the recovery jogs moving — walking resets your rhythm.';

  const pauseLabel = paused ? 'Resume' : 'Pause';
  const lapBg = runDone ? colors.primary : colors.textOnDark;
  const lapFg = runDone ? colors.textOnDark : colors.inkBlack;
  const lapLabel = runDone ? 'Finish · save session ↺' : 'Lap done';

  const onLap = () => {
    if (runDone) {
      router.push('/workout/complete');
    } else {
      lapDone();
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.inkBlack }}>
      <View style={{ flex: 1, paddingHorizontal: 26, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} spaced upper color={colors.textOnDarkMuted}>
            Threshold intervals
          </MonoText>
          <MonoText size={10} spaced={false} upper={false} color={colors.accent}>
            ● watch connected
          </MonoText>
        </View>

        {/* rep dots */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 18 }}>
          {dots.map((d) => (
            <View key={d.key} style={{ flex: 1, height: 6, borderRadius: radii.pill, backgroundColor: d.color }} />
          ))}
        </View>
        <MonoText size={11} spaced={false} upper={false} color={colors.textOnDarkMuted} style={{ marginTop: 10 }}>
          {runPhaseLabel}
        </MonoText>

        {/* big metric */}
        <View style={{ alignItems: 'center', paddingTop: 26, paddingBottom: 10 }}>
          <SerifText size={96} weight="medium" color={colors.textOnDark} style={{ lineHeight: 96 }}>
            {runPace}
          </SerifText>
          <MonoText size={11} spaced upper color={colors.textOnDarkMuted} style={{ marginTop: 8 }}>
            pace /km · target 4:10
          </MonoText>
          <View
            style={{
              borderWidth: 1,
              borderColor: paceVerdictColor,
              borderRadius: radii.pill,
              paddingVertical: 5,
              paddingHorizontal: 14,
              marginTop: 14,
            }}
          >
            <MonoText size={11} spaced={false} upper={false} color={paceVerdictColor}>
              {paceVerdict}
            </MonoText>
          </View>
        </View>

        {/* secondary metrics */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 18 }}>
          <MetricBox label="TIME" value={runElapsed} />
          <MetricBox label="HR" value="172" />
          <MetricBox label="DIST" value={runDist} />
        </View>

        {/* HR zone bar */}
        <View style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', height: 8, borderRadius: radii.pill, overflow: 'hidden', gap: 2 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={{ flex: 1, backgroundColor: i === 3 ? colors.warning : colors.trackOnDark }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <MonoText size={9} spaced={false} upper={false} color={colors.textOnDarkMuted}>Z1</MonoText>
            <MonoText size={9} spaced={false} upper={false} color={colors.textOnDarkMuted}>Z2</MonoText>
            <MonoText size={9} spaced={false} upper={false} color={colors.textOnDarkMuted}>Z3</MonoText>
            <MonoText size={9} spaced={false} upper={false} color={colors.warning}>Z4 · threshold</MonoText>
            <MonoText size={9} spaced={false} upper={false} color={colors.textOnDarkMuted}>Z5</MonoText>
          </View>
        </View>

        {/* coach note */}
        <View style={{ backgroundColor: colors.inkRaised, borderRadius: radii.lg, padding: 14, marginTop: spacing.lg }}>
          <SansText size={13} color={colors.textOnDarkSecondary} style={{ lineHeight: 19.5 }}>
            <MonoText size={9.5} spaced upper color={colors.accent}>coach · </MonoText>
            {runCoachNote}
          </SansText>
        </View>

        <View style={{ flex: 1 }} />

        {/* controls */}
        <View style={{ flexDirection: 'row', gap: spacing.md, paddingVertical: 18 }}>
          <Pressable
            onPress={togglePause}
            style={({ pressed }) => ({
              width: 92,
              borderWidth: 1.5,
              borderColor: onDark(0.3),
              borderRadius: radii.pill,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <SansText size={14} weight="bold" color={colors.textOnDark}>{pauseLabel}</SansText>
          </Pressable>
          <Pressable
            onPress={onLap}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: lapBg,
              borderRadius: radii.pill,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <SansText size={15} weight="extrabold" color={lapFg}>{lapLabel}</SansText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.inkRaised, borderRadius: radii.lg, padding: 14, alignItems: 'center' }}>
      <MonoText size={9} spaced upper color={colors.textOnDarkMuted}>{label}</MonoText>
      <SerifText size={24} weight="medium" color={colors.textOnDark} style={{ marginTop: 4 }}>{value}</SerifText>
    </View>
  );
}
