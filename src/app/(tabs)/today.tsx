import { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, ProgressRing, RangeBar, Button } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { readinessWord } from '@/services';
import { fuelMacros } from '@/data/mock';

// Small, screen-local content (mirrors the design's inline `sessionSteps` / `weightBars` arrays —
// not reused elsewhere, so kept out of data/mock.ts).
const sessionSteps = [
  { name: 'Warm-up', detail: '15 min · Z2' },
  { name: '5 × 1200m', detail: '4:10/km · 90s jog' },
  { name: 'Cool-down', detail: '10 min · easy' },
];
const weightBarHeights = [40, 38, 39, 36, 34, 33, 31, 29];

function formatDateHeader(d: Date) {
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${day} · ${month} ${d.getDate()}`;
}

export default function TodayScreen() {
  const athleteName = useAppStore((s) => s.athleteName);
  const readiness = useAppStore((s) => s.readiness);
  const sessionOpen = useAppStore((s) => s.sessionOpen);
  const toggleSession = useAppStore((s) => s.toggleSession);
  const macrosOpen = useAppStore((s) => s.macrosOpen);
  const toggleMacros = useAppStore((s) => s.toggleMacros);

  const dateLabel = useMemo(() => formatDateHeader(new Date()), []);
  const word = readinessWord(readiness);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      {/* header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <MonoText size={11}>{dateLabel}</MonoText>
          <SerifText size={30} style={{ marginTop: 2 }}>
            {athleteName || 'Athlete'}
          </SerifText>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.cardFlat,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MonoText size={9}>you</MonoText>
        </Pressable>
      </View>

      {/* readiness hero — ring opens the breakdown, the note opens sleep detail */}
      <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm }}>
        <Pressable onPress={() => router.push('/sleep/recovery')}>
          <ProgressRing size={190} strokeWidth={13} progress={readiness}>
            <SerifText size={64} style={{ lineHeight: 68 }}>
              {readiness}
            </SerifText>
            <MonoText size={10} color={colors.primary}>
              {word}
            </MonoText>
          </ProgressRing>
        </Pressable>
        <Pressable onPress={() => router.push('/sleep/detail')}>
          <SansText size={13} color={colors.textSecondary} style={{ textAlign: 'center', maxWidth: 260, lineHeight: 20 }}>
            HRV steady, sleep 7h 42m. Today is built for quality — hit the intervals, then stop.
          </SansText>
        </Pressable>
      </View>

      {/* today's session */}
      <Card tone="dark" onPress={toggleSession}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            Today&rsquo;s session
          </MonoText>
          <MonoText size={10} color={colors.textOnDarkSecondary}>
            {sessionOpen ? 'close' : 'tap for detail'}
          </MonoText>
        </View>
        <SerifText size={25} color={colors.textOnDark} style={{ marginTop: spacing.sm }}>
          Threshold intervals
        </SerifText>
        <SansText size={13} color={colors.textOnDarkSecondary} style={{ marginTop: 2 }}>
          5 × 1200m · 10K pace · 68 min total
        </SansText>
        {sessionOpen ? (
          <View
            style={{
              marginTop: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: onDark(0.14),
              paddingTop: spacing.md,
              gap: spacing.sm,
            }}
          >
            {sessionSteps.map((step) => (
              <View key={step.name} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SansText size={13} color={colors.textOnDark}>
                  {step.name}
                </SansText>
                <MonoText size={11} spaced={false} upper={false} color={colors.textOnDarkSecondary}>
                  {step.detail}
                </MonoText>
              </View>
            ))}
            <View style={{ marginTop: spacing.xs }}>
              <Button label="Start on Apple Watch" variant="light" onPress={() => router.push('/workout/run')} />
            </View>
          </View>
        ) : null}
      </Card>

      {/* fuel */}
      <Card tone="muted" onPress={toggleMacros}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10}>Fuel</MonoText>
          <MonoText size={10}>{macrosOpen ? 'close' : 'tap for macros'}</MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm }}>
          <SerifText size={30}>1,180</SerifText>
          <SansText size={13} color={colors.textSecondary}>
            kcal remaining of 3,050
          </SansText>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <RangeBar width="100%" pct={61} />
        </View>
        {macrosOpen ? (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            {fuelMacros.map((m) => (
              <View key={m.name} style={{ flex: 1, backgroundColor: colors.screen, borderRadius: radii.md, padding: spacing.md }}>
                <MonoText size={9}>{m.name}</MonoText>
                <SansText size={16} weight="bold" style={{ marginTop: 4 }}>
                  {m.val}
                </SansText>
                <View style={{ marginTop: spacing.sm }}>
                  <RangeBar width="100%" height={4} pct={m.pct} trackColor={colors.border} />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      {/* body */}
      <Card tone="muted">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10}>Body</MonoText>
          <MonoText size={10} color={colors.primary}>
            −1.8 kg / 8 wks
          </MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.md }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <SerifText size={30}>78.4</SerifText>
              <SansText size={13} color={colors.textSecondary}>
                kg
              </SansText>
            </View>
            <MonoText size={9.5} style={{ marginTop: 2 }}>
              Next AI photo check-in · Sunday
            </MonoText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 44 }}>
            {weightBarHeights.map((h, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: h,
                  borderRadius: 3,
                  backgroundColor: i === weightBarHeights.length - 1 ? colors.primary : colors.track,
                }}
              />
            ))}
          </View>
        </View>
      </Card>

      {/* sources */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
        <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.pill, paddingVertical: 7, paddingHorizontal: spacing.md }}>
          <MonoText size={10}>● Apple Health · synced 6:41</MonoText>
        </View>
        <View style={{ backgroundColor: colors.cardMuted, borderRadius: radii.pill, paddingVertical: 7, paddingHorizontal: spacing.md }}>
          <MonoText size={10}>● Strava · run imported</MonoText>
        </View>
      </View>
    </ScreenContainer>
  );
}
