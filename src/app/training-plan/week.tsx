import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer, SerifText, SansText, MonoText, Card } from '@/components/ui';
import { colors, spacing, radii, onDark } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';
import { weekShapeDefs, planDayDefs } from '@/data/mock';

function dayCtaRoute(cta: string) {
  if (cta === 'Start session') return () => router.push('/workout/strength');
  if (cta === 'View log') return () => {};
  return () => {};
}

export default function WeekView() {
  const openPlanDay = useAppStore((s) => s.openPlanDay);
  const toggleOpenPlanDay = useAppStore((s) => s.toggleOpenPlanDay);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.xxl, gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <MonoText size={10}>Week 28 · build 3 of 4</MonoText>
          <SerifText size={28} style={{ marginTop: 2 }}>
            This week
          </SerifText>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: radii.pill,
            paddingVertical: 5,
            paddingHorizontal: 12,
          }}
        >
          <MonoText size={10} color={colors.primary}>
            8H 40M planned
          </MonoText>
        </View>
      </View>

      {/* week shape */}
      <Card tone="muted" style={{ paddingVertical: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MonoText size={10}>Load shape</MonoText>
          <MonoText size={10}>TSS / day</MonoText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginTop: spacing.lg }}>
          {weekShapeDefs.map((d) => {
            const color = d.today ? colors.primary : d.done ? '#b8b4a5' : colors.track;
            return (
              <View key={d.day} style={{ flex: 1, alignItems: 'center', gap: spacing.xs }}>
                <View style={{ alignSelf: 'stretch', height: d.h, borderRadius: 5, backgroundColor: color }} />
                <MonoText size={8.5} color={d.today ? colors.primary : colors.textMuted}>
                  {d.day}
                </MonoText>
              </View>
            );
          })}
        </View>
      </Card>

      {/* day cards */}
      <View style={{ gap: 9 }}>
        {planDayDefs.map((d, i) => {
          const isOpen = openPlanDay === i;
          const today = d.state === 'today';
          const done = d.state === 'done';
          const key = d.state === 'key';
          const fg = today ? colors.textOnDark : done ? colors.textMuted : colors.textPrimary;
          const sub = today ? colors.textOnDarkSecondary : colors.textMuted;
          const tag = today ? 'TODAY' : done ? 'DONE' : key ? 'KEY' : d.day === 'FRI' ? 'FLEX' : 'PLANNED';
          return (
            <Pressable key={d.day} onPress={() => toggleOpenPlanDay(i)}>
              <View
                style={{
                  backgroundColor: today ? colors.ink : colors.screen,
                  borderWidth: 1.5,
                  borderColor: today || isOpen ? colors.borderStrong : colors.border,
                  borderRadius: 18,
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <MonoText size={10} color={sub} style={{ width: 34 }}>
                    {d.day}
                  </MonoText>
                  <View style={{ flex: 1 }}>
                    <SansText size={14.5} weight="bold" color={fg}>
                      {d.title}
                    </SansText>
                    <SansText size={12} color={sub} style={{ marginTop: 2 }}>
                      {d.sub}
                    </SansText>
                  </View>
                  <View
                    style={{
                      backgroundColor: today ? colors.screen : key ? colors.primary : colors.cardMutedAlt,
                      borderRadius: radii.pill,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    <MonoText size={9} color={today ? colors.ink : done ? colors.textMuted : key ? colors.textOnDark : colors.textSecondary}>
                      {tag}
                    </MonoText>
                  </View>
                </View>
                {isOpen ? (
                  <View
                    style={{
                      marginTop: spacing.lg,
                      paddingTop: spacing.md,
                      borderTopWidth: 1,
                      borderTopColor: today ? onDark(0.16) : colors.border,
                      gap: spacing.sm,
                    }}
                  >
                    {d.blocks.map((b) => (
                      <View key={b.k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SansText size={13} weight="semibold" color={fg}>
                          {b.k}
                        </SansText>
                        <MonoText size={11} spaced={false} color={sub}>
                          {b.v}
                        </MonoText>
                      </View>
                    ))}
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                      <Pressable
                        onPress={dayCtaRoute(d.cta)}
                        style={{
                          flex: 1,
                          backgroundColor: today ? colors.screen : colors.ink,
                          borderRadius: radii.pill,
                          paddingVertical: 11,
                          alignItems: 'center',
                        }}
                      >
                        <SansText size={13} weight="extrabold" color={today ? colors.ink : colors.textOnDark}>
                          {d.cta}
                        </SansText>
                      </Pressable>
                      <View
                        style={{
                          width: 90,
                          borderWidth: 1.5,
                          borderColor: today ? onDark(0.35) : colors.trackAlt,
                          borderRadius: radii.pill,
                          paddingVertical: 11,
                          alignItems: 'center',
                        }}
                      >
                        <SansText size={13} weight="bold" color={fg}>
                          Move
                        </SansText>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => router.push('/training-plan/block')} style={{ paddingBottom: spacing.md }}>
        <MonoText size={10} color={colors.textPrimary}>
          View the 12-week arc →
        </MonoText>
      </Pressable>
    </ScreenContainer>
  );
}
