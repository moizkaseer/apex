import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card, ExpandableRow } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { trainDays } from '@/data/mock';

const blockProgress = [true, true, true, false];

function ctaRoute(cta: string) {
  if (cta === 'Start on Apple Watch') return () => router.push('/workout/run');
  if (cta === 'Preview session') return () => router.push('/training-plan/week');
  // "View in Strava" — the source's completed-day CTA has no in-app destination to deep-link to
  // (it implies handing off to the external Strava app). TODO: wire a real Strava deep link once
  // services/strava.ts exposes an activity URL for the logged workout.
  return () => {};
}

export default function TrainScreen() {
  const openDay = useAppStore((s) => s.openDay);
  const toggleOpenDay = useAppStore((s) => s.toggleOpenDay);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SerifText size={30}>Train</SerifText>
        <MonoText size={11}>Week 3 of 4</MonoText>
      </View>

      {/* current block */}
      <Card tone="dark">
        <MonoText size={10} color={colors.textOnDarkSecondary}>
          Current block
        </MonoText>
        <SerifText size={25} color={colors.textOnDark} style={{ marginTop: spacing.sm }}>
          Build — hybrid base
        </SerifText>
        <SansText size={13} color={colors.textOnDarkSecondary} style={{ marginTop: 2 }}>
          Run volume holds · squat 5×5 progresses 2.5 kg/wk
        </SansText>
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.lg }}>
          {blockProgress.map((filled, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 5, borderRadius: radii.pill, backgroundColor: filled ? colors.primary : onDark(0.2) }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          <MonoText size={9.5} color={colors.textOnDarkSecondary}>
            AI-adjusted Tue after Strava import
          </MonoText>
          <MonoText size={9.5} color={colors.textOnDarkSecondary}>
            deload next wk
          </MonoText>
        </View>
      </Card>

      {/* plan shortcuts */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Card tone="muted" radius={radii.md} onPress={() => router.push('/training-plan/week')} style={{ flex: 1, paddingVertical: spacing.md }}>
          <MonoText size={9.5} color={colors.textPrimary}>
            Full week →
          </MonoText>
        </Card>
        <Card tone="muted" radius={radii.md} onPress={() => router.push('/training-plan/block')} style={{ flex: 1, paddingVertical: spacing.md }}>
          <MonoText size={9.5} color={colors.textPrimary}>
            12-week arc →
          </MonoText>
        </Card>
        <Card tone="muted" radius={radii.md} onPress={() => router.push('/social/crew')} style={{ flex: 1, paddingVertical: spacing.md }}>
          <MonoText size={9.5} color={colors.textPrimary}>
            Crew →
          </MonoText>
        </Card>
      </View>

      {/* week list */}
      <View style={{ gap: spacing.sm }}>
        <MonoText size={10} style={{ paddingHorizontal: 2 }}>
          This week
        </MonoText>
        {trainDays.map((d, i) => {
          const isToday = d.status === 'today';
          const dotColor = d.status === 'done' ? colors.primary : isToday ? colors.textPrimary : colors.track;
          const statusColor = d.status === 'done' ? colors.primary : d.status === 'key' ? colors.textPrimary : colors.textMuted;
          return (
            <ExpandableRow
              key={d.day}
              tone={isToday ? 'muted' : 'screen'}
              isOpen={openDay === i}
              onPress={() => toggleOpenDay(i)}
              leading={
                <View style={{ width: 40 }}>
                  <MonoText size={10} color={isToday ? colors.textPrimary : colors.textMuted}>
                    {d.day}
                  </MonoText>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dotColor, marginTop: 5 }} />
                </View>
              }
              title={d.title}
              subtitle={d.sub}
              trailing={
                <MonoText size={10} color={statusColor}>
                  {d.status}
                </MonoText>
              }
            >
              {d.rows.map((r) => (
                <View key={r.k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SansText size={13}>{r.k}</SansText>
                  <MonoText size={11.5} spaced={false} upper={false} color={colors.textSecondary}>
                    {r.v}
                  </MonoText>
                </View>
              ))}
              <View style={{ marginTop: spacing.xxs }}>
                <Card tone="dark" radius={radii.pill} padded={false} onPress={ctaRoute(d.cta)} style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <SansText size={13.5} weight="bold" color={colors.textOnDark}>
                    {d.cta}
                  </SansText>
                </Card>
              </View>
            </ExpandableRow>
          );
        })}
      </View>
    </ScreenContainer>
  );
}
